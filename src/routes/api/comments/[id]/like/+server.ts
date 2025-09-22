import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';

const prisma = new PrismaClient();

// POST /api/comments/[id]/like - Toggle like on a comment
export const POST: RequestHandler = async (event) => {
	const { user, isAuthenticated } = await getUser(event);

	if (!isAuthenticated) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Verify the comment exists
		const comment = await prisma.comment.findUnique({
			where: { id: event.params.id },
			select: { id: true }
		});

		if (!comment) {
			return json({ error: 'Comment not found' }, { status: 404 });
		}

		// Use transaction to handle like toggle atomically
		const result = await prisma.$transaction(async (tx) => {
			// Check if user already liked
			const existingLike = await tx.commentLike.findUnique({
				where: {
					userId_commentId: {
						userId: user.id,
						commentId: event.params.id
					}
				}
			});

			let newIsLiked: boolean;
			let newLikes: number;

			if (existingLike) {
				// Remove like
				await tx.commentLike.delete({
					where: { id: existingLike.id }
				});
				newIsLiked = false;
				newLikes = await tx.comment.update({
					where: { id: event.params.id },
					data: { likes: { decrement: 1 } },
					select: { likes: true }
				}).then(c => c.likes);
			} else {
				// Add like
				await tx.commentLike.create({
					data: {
						userId: user.id,
						commentId: event.params.id
					}
				});
				newIsLiked = true;
				newLikes = await tx.comment.update({
					where: { id: event.params.id },
					data: { likes: { increment: 1 } },
					select: { likes: true }
				}).then(c => c.likes);
			}

			return { likes: newLikes, isLiked: newIsLiked };
		});

		return json({ ...result });
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 400 });
	}
};