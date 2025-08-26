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

// GET /api/posts - Get all posts with polls and comments
export const GET: RequestHandler = async ({ url }) => {
	try {
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const category = url.searchParams.get('category');
		const skip = (page - 1) * limit;

		const where = category ? { category } : {};

		const posts = await prisma.post.findMany({
			where,
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
					where: {
						parentId: null // Only top-level comments
					},
					orderBy: {
						createdAt: 'desc'
					},
					take: 5 // Limit comments per post
				},
				_count: {
					select: {
						comments: true
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
		const transformedPosts = await Promise.all(
			posts.map(async (post: any) => {
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

				return {
					...post,
					author,
					comments: transformedComments
				};
			})
		);

		const total = await prisma.post.count({ where });

		return json({
			posts: transformedPosts,
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

// POST /api/posts - Create a new post
export const POST: RequestHandler = async (event) => {
	const { user, isAuthenticated } = await getUser(event);

	if (!isAuthenticated) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await event.request.json();

	try {
		const post = await prisma.post.create({
			data: {
				title: data.title,
				content: data.content,
				authorId: user.id,
				category: data.category,
				tags: data.tags || [],
				poll: data.poll
					? {
							create: {
								question: data.poll.question,
								endsAt: data.poll.endsAt ? new Date(data.poll.endsAt) : null,
								options: {
									create: data.poll.options.map((option: any) => ({
										text: option.text
									}))
								}
							}
						}
					: undefined
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
