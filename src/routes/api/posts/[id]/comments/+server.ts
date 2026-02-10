import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';
import { clerkClient } from 'svelte-clerk/server';

const prisma = new PrismaClient();

// Helper function to transform user data for frontend
async function transformUserData(clerkId: string) {
	try {
		const clerkUser = await clerkClient.users.getUser(clerkId);
		return {
			name: clerkUser.firstName && clerkUser.lastName 
				? `${clerkUser.firstName} ${clerkUser.lastName}` 
				: clerkUser.username || 'Anonymous',
			avatar: clerkUser.imageUrl || '',
			username: clerkUser.username || 'user',
			isVerified: clerkUser.publicMetadata?.role === 'admin'
		};
	} catch (error) {
		console.error('Error fetching clerk user:', error);
		return {
			name: 'Anonymous',
			avatar: '',
			username: 'user',
			isVerified: false
		};
	}
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
				parentId: null // Only top-level comments
			},
			include: {
				author: {
					select: {
						clerkId: true,
						email: true
					}
				},
				replies: {
					include: {
						author: {
							select: {
								clerkId: true,
								email: true
							}
						}
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

		// Transform the data to match frontend expectations
		const transformedComments = await Promise.all(
			comments.map(async (comment: any) => {
				const commentAuthor = await transformUserData(comment.author.clerkId!);
				
				const transformedReplies = await Promise.all(
					(comment.replies || []).map(async (reply: any) => {
						const replyAuthor = await transformUserData(reply.author.clerkId!);
						return {
							...reply,
							author: replyAuthor
						};
					})
				);

				return {
					...comment,
					author: commentAuthor,
					replies: transformedReplies
				};
			})
		);

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
		// Verify the post exists
		const post = await prisma.post.findUnique({
			where: { id: event.params.id },
			select: { id: true }
		});

		if (!post) {
			return json({ error: 'Post not found' }, { status: 404 });
		}

		const comment = await prisma.comment.create({
			data: {
				content: data.content,
				authorId: user.id,
				postId: event.params.id,
				parentId: data.parentId || null
			},
			include: {
				author: {
					select: {
						clerkId: true,
						email: true
					}
				}
			}
		});

		// Transform the author data to match frontend expectations
		const author = await transformUserData(comment.author.clerkId!);
		const transformedComment = {
			...comment,
			author
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
