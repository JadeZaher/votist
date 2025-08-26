import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';

const prisma = new PrismaClient();

// POST /api/posts/[id]/vote - Vote on a poll option
export const POST: RequestHandler = async (event) => {
	const { user, isAuthenticated } = await getUser(event);

	if (!isAuthenticated) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await event.request.json();

	try {
		// Verify the post and poll option exist
		const post = await prisma.post.findUnique({
			where: { id: event.params.id },
			include: {
				poll: {
					include: {
						options: true
					}
				}
			}
		});

		if (!post) {
			return json({ error: 'Post not found' }, { status: 404 });
		}

		if (!post.poll) {
			return json({ error: 'Post does not have a poll' }, { status: 400 });
		}

		const option = post.poll.options.find((opt) => opt.id === data.optionId);
		if (!option) {
			return json({ error: 'Poll option not found' }, { status: 404 });
		}

		// Check if poll has ended
		if (post.poll.endsAt && new Date() > post.poll.endsAt) {
			return json({ error: 'Poll has ended' }, { status: 400 });
		}

		// Use transaction to handle vote update/creation atomically
		const result = await prisma.$transaction(async (tx) => {
			// Check if user already voted
			const existingVote = await tx.vote.findUnique({
				where: {
					userId_postId: {
						userId: user.id,
						postId: event.params.id
					}
				}
			});

			if (existingVote) {
				// User already voted, update their vote
				if (existingVote.optionId === data.optionId) {
					return json({ error: 'Already voted for this option' }, { status: 400 });
				}

				// Remove vote from previous option
				await tx.pollOption.update({
					where: { id: existingVote.optionId },
					data: { votes: { decrement: 1 } }
				});

				// Update vote to new option
				await tx.vote.update({
					where: { id: existingVote.id },
					data: { optionId: data.optionId }
				});
			} else {
				// Create new vote
				await tx.vote.create({
					data: {
						userId: user.id,
						postId: event.params.id,
						optionId: data.optionId
					}
				});
			}

			// Increment votes for the selected option
			await tx.pollOption.update({
				where: { id: data.optionId },
				data: { votes: { increment: 1 } }
			});

			// Update total votes in poll
			await tx.poll.update({
				where: { id: post.poll!.id },
				data: { totalVotes: { increment: existingVote ? 0 : 1 } }
			});

			// Return updated poll data
			return await tx.poll.findUnique({
				where: { id: post.poll!.id },
				include: {
					options: true
				}
			});
		});

		return json({ poll: result });
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 400 });
	}
};

// DELETE /api/posts/[id]/vote - Remove user's vote
export const DELETE: RequestHandler = async (event) => {
	const { user, isAuthenticated } = await getUser(event);

	if (!isAuthenticated) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Find user's vote
		const vote = await prisma.vote.findUnique({
			where: {
				userId_postId: {
					userId: user.id,
					postId: event.params.id
				}
			},
			include: {
				option: true
			}
		});

		if (!vote) {
			return json({ error: 'No vote found' }, { status: 404 });
		}

		// Use transaction to handle vote removal atomically
		await prisma.$transaction(async (tx) => {
			// Remove the vote
			await tx.vote.delete({
				where: { id: vote.id }
			});

			// Decrement votes for the option
			await tx.pollOption.update({
				where: { id: vote.optionId },
				data: { votes: { decrement: 1 } }
			});

			// Decrement total votes in poll
			await tx.poll.update({
				where: { postId: event.params.id },
				data: { totalVotes: { decrement: 1 } }
			});
		});

		return json({ message: 'Vote removed successfully' });
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 500 });
	}
};
