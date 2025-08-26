import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';

const prisma = new PrismaClient();

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

		const total = await prisma.post.count({ where });

		return json({
			posts,
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

		return json({ post });
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 400 });
	}
};
