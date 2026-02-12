import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';
import { userMeetsPostQuizGate } from '$lib/server/quizPermissions';
import { prisma } from '$lib/server/db/prisma';

const authorSelect = {
	firstName: true,
	lastName: true,
	avatarUrl: true,
	email: true,
	isAdmin: true
} as const;

function transformAuthor(author: {
	firstName: string | null;
	lastName: string | null;
	avatarUrl: string | null;
	email: string | null;
	isAdmin: boolean;
}) {
	const name =
		author.firstName && author.lastName
			? `${author.firstName} ${author.lastName}`
			: author.firstName || author.lastName || 'Anonymous';
	return {
		name,
		avatar: author.avatarUrl || '',
		username: author.email?.split('@')[0] || 'user',
		isVerified: author.isAdmin
	};
}

// GET /api/posts/[id]/comments - Get comments for a post
export const GET: RequestHandler = async ({ params, url }) => {
	try {
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '20');
		const skip = (page - 1) * limit;

		const comments = await prisma.comment.findMany({
			where: {
				postId: params.id,
				parentId: null
			},
			include: {
				author: { select: authorSelect },
				replies: {
					include: {
						author: { select: authorSelect }
					},
					orderBy: {
						createdAt: 'asc'
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			},
			skip,
			take: limit
		});

		const transformedComments = comments.map((comment) => {
			const commentAuthor = transformAuthor(comment.author);
			const transformedReplies = (comment.replies || []).map((reply) => ({
				...reply,
				author: transformAuthor(reply.author)
			}));

			return {
				...comment,
				author: commentAuthor,
				replies: transformedReplies
			};
		});

		const total = await prisma.comment.count({
			where: {
				postId: params.id,
				parentId: null
			}
		});

		return json({
			comments: transformedComments,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		});
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 500 });
	}
};

// POST /api/posts/[id]/comments - Create a new comment
export const POST: RequestHandler = async (event) => {
	const { user, isAuthenticated } = await getUser(event);

	if (!isAuthenticated) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await event.request.json();

	try {
		// Look up internal DB user by Clerk ID
		const dbUser = await prisma.user.findUnique({
			where: { clerkId: user.id }
		});

		if (!dbUser) {
			return json({ error: 'User not found in database' }, { status: 404 });
		}

		// Verify the post exists and check quiz gate in one query
		const post = await prisma.post.findUnique({
			where: { id: event.params.id },
			select: { id: true, quizGateType: true, quizGateDifficulty: true, quizGateQuizId: true }
		});

		if (!post) {
			return json({ error: 'Post not found' }, { status: 404 });
		}

		// Check if user meets post-level quiz gate
		const gateResult = await userMeetsPostQuizGate(dbUser.id, post);
		if (!gateResult.allowed) {
			return json(
				{
					error: 'Quiz gate requirement not met',
					message: gateResult.message
				},
				{ status: 403 }
			);
		}

		const comment = await prisma.comment.create({
			data: {
				content: data.content,
				authorId: dbUser.id,
				postId: event.params.id,
				parentId: data.parentId || null
			},
			include: {
				author: { select: authorSelect }
			}
		});

		const transformedComment = {
			...comment,
			author: transformAuthor(comment.author)
		};

		return json({ comment: transformedComment });
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 400 });
	}
};
