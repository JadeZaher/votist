import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';

const prisma = new PrismaClient();

// GET /api/posts/[id] - Get a specific post with all details
export const GET: RequestHandler = async ({ params }) => {
	try {
		const post = await prisma.post.findUnique({
			where: { id: params.id },
			include: {
				author: {
					select: {
						clerkId: true,
						email: true
					}
				},
				poll: {
					include: {
						options: {
							include: {
								_count: {
									select: {
										userVotes: true
									}
								}
							}
						}
					}
				},
				comments: {
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
							}
						}
					},
					orderBy: {
						createdAt: 'desc'
					}
				},
				_count: {
					select: {
						comments: true,
						likes: true
					}
				}
			}
		});

		if (!post) {
			return json({ error: 'Post not found' }, { status: 404 });
		}

		return json({ post });
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 500 });
	}
};

// PUT /api/posts/[id] - Update a post
export const PUT: RequestHandler = async (event) => {
	const { user, isAuthenticated } = await getUser(event);

	if (!isAuthenticated) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await event.request.json();

	try {
		// Check if user owns the post or is admin
		const existingPost = await prisma.post.findUnique({
			where: { id: event.params.id },
			select: { authorId: true }
		});

		if (!existingPost) {
			return json({ error: 'Post not found' }, { status: 404 });
		}

		if (existingPost.authorId !== user.id && user.publicMetadata?.role !== 'admin') {
			return json({ error: 'Forbidden' }, { status: 403 });
		}

		const post = await prisma.post.update({
			where: { id: event.params.id },
			data: {
				title: data.title,
				content: data.content,
				category: data.category,
				tags: data.tags || []
			},
			include: {
				author: {
					select: {
						clerkId: true,
						email: true
					}
				},
				poll: {
					include: {
						options: true
					}
				}
			}
		});

		return json({ post });
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 400 });
	}
};

// DELETE /api/posts/[id] - Delete a post
export const DELETE: RequestHandler = async (event) => {
	const { user, isAuthenticated } = await getUser(event);

	if (!isAuthenticated) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Check if user owns the post or is admin
		const existingPost = await prisma.post.findUnique({
			where: { id: event.params.id },
			select: { authorId: true }
		});

		if (!existingPost) {
			return json({ error: 'Post not found' }, { status: 404 });
		}

		if (existingPost.authorId !== user.id && user.publicMetadata?.role !== 'admin') {
			return json({ error: 'Forbidden' }, { status: 403 });
		}

		await prisma.post.delete({
			where: { id: event.params.id }
		});

		return json({ message: 'Post deleted successfully' });
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 500 });
	}
};
