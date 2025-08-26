import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

// GET /api/test-polls - Test endpoint to verify poll feed setup
export const GET: RequestHandler = async () => {
	try {
		// Test basic database connectivity
		const postCount = await prisma.post.count();
		const pollCount = await prisma.poll.count();
		const commentCount = await prisma.comment.count();
		const userCount = await prisma.user.count();

		return json({
			message: 'Poll feed API is working!',
			stats: {
				posts: postCount,
				polls: pollCount,
				comments: commentCount,
				users: userCount
			},
			endpoints: {
				'GET /api/posts': 'Get all posts with pagination',
				'POST /api/posts': 'Create a new post',
				'GET /api/posts/[id]': 'Get specific post with details',
				'PUT /api/posts/[id]': 'Update a post',
				'DELETE /api/posts/[id]': 'Delete a post',
				'GET /api/posts/[id]/comments': 'Get comments for a post',
				'POST /api/posts/[id]/comments': 'Create a comment',
				'POST /api/posts/[id]/vote': 'Vote on a poll option',
				'DELETE /api/posts/[id]/vote': 'Remove user vote',
				'PUT /api/comments/[id]': 'Update a comment',
				'DELETE /api/comments/[id]': 'Delete a comment'
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
