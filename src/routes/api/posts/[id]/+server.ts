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
			name:
				clerkUser.firstName && clerkUser.lastName
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

		// Transform the data to match frontend expectations
		const author = await transformUserData(post.author.clerkId);

		const transformedComments = await Promise.all(
			post.comments.map(async (comment: any) => {
				const commentAuthor = await transformUserData(comment.author.clerkId);

				const transformedReplies = await Promise.all(
					(comment.replies || []).map(async (reply: any) => {
						const replyAuthor = await transformUserData(reply.author.clerkId);
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

		const transformedPost = {
			...post,
			author,
			comments: transformedComments
		};

		return json({ post: transformedPost });
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

		// Transform the author data to match frontend expectations
		const author = await transformUserData(post.author.clerkId);
		const transformedPost = {
			...post,
			author
		};

		return json({ post: transformedPost });
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
