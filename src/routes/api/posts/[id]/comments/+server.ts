import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';

const prisma = new PrismaClient();

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

		const total = await prisma.comment.count({
			where: {
				postId: params.id,
				parentId: null
			}
		});

		return json({
			comments,
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

		return json({ comment });
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 400 });
	}
};
