import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';
import { prisma } from '$lib/server/db/prisma';

// POST /api/comments/[id]/like - Toggle like on a comment
export const POST: RequestHandler = async (event) => {
	const { user, isAuthenticated } = await getUser(event);

	if (!isAuthenticated || !user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const dbUser = await prisma.user.findUnique({
			where: { clerkId: user.id },
			select: { id: true }
		});

		if (!dbUser) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		const comment = await prisma.comment.findUnique({
			where: { id: event.params.id },
			select: { id: true }
		});

		if (!comment) {
			return json({ error: 'Comment not found' }, { status: 404 });
		}

		const result = await prisma.$transaction(async (tx) => {
			const existingLike = await tx.commentLike.findUnique({
				where: {
					userId_commentId: {
						userId: dbUser.id,
						commentId: event.params.id!
					}
				}
			});

			let newIsLiked: boolean;
			let newLikes: number;

			if (existingLike) {
				await tx.commentLike.delete({
					where: { id: existingLike.id }
				});
				newIsLiked = false;
				newLikes = await tx.comment
					.update({
						where: { id: event.params.id },
						data: { likes: { decrement: 1 } },
						select: { likes: true }
					})
					.then((c) => c.likes);
			} else {
				await tx.commentLike.create({
					data: {
						userId: dbUser.id,
						commentId: event.params.id!
					}
				});
				newIsLiked = true;
				newLikes = await tx.comment
					.update({
						where: { id: event.params.id },
						data: { likes: { increment: 1 } },
						select: { likes: true }
					})
					.then((c) => c.likes);
			}

			return { likes: newLikes, isLiked: newIsLiked };
		});

		return json(result);
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 400 });
	}
};
