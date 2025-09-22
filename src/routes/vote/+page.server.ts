import { error, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';
import { getUser } from '$lib/server/auth';
import type { PageServerLoad } from './$types';
import type { PollFeedData, PostData, CommentData, Poll } from '$lib/types';

import type { Prisma } from '@prisma/client';
import { clerkClient } from 'svelte-clerk/server';

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

export const load: PageServerLoad = async (event) => {
	const { locals } = event;
	const { user, isAuthenticated } = await getUser(event);

	let voteMap = new Map<string, string>();
	let postLikeMap = new Map<string, boolean>();
	let commentLikeMap = new Map<string, boolean>();

	if (isAuthenticated && user) {
		// Get user's votes
		const userVotes = await prisma.vote.findMany({
			where: { userId: user.id },
			select: { postId: true, optionId: true }
		});
		userVotes.forEach((vote) => {
			voteMap.set(vote.postId, vote.optionId);
		});

		// Get user's post likes
		const userPostLikes = await prisma.postLike.findMany({
			where: { userId: user.id },
			select: { postId: true }
		});
		userPostLikes.forEach((like) => {
			postLikeMap.set(like.postId, true);
		});

		// Get user's comment likes
		const userCommentLikes = await prisma.commentLike.findMany({
			where: { userId: user.id },
			select: { commentId: true }
		});
		userCommentLikes.forEach((like) => {
			commentLikeMap.set(like.commentId, true);
		});
	}

	const posts = await prisma.post.findMany({
		include: {
			author: {
				select: { clerkId: true }
			},
			poll: {
				include: {
					options: {
						select: { id: true, text: true, votes: true }
					}
				}
			},
			comments: {
				include: {
					author: {
						select: { clerkId: true }
					},
					replies: {
						include: {
							author: {
								select: { clerkId: true }
							}
						}
					}
				},
				orderBy: { createdAt: 'asc' }
			}
		},
		orderBy: { createdAt: 'desc' },
		take: 10
	});

	const polls: PollFeedData[] = await Promise.all(
		posts.map(async (post) => {
			const postAuthor = await transformUserData(post.author.clerkId);

			const transformedComments: CommentData[] = await Promise.all(
				post.comments.map(async (comment) => {
					const commentAuthor = await transformUserData(comment.author.clerkId);
					const transformedReplies = await Promise.all(
						comment.replies.map(async (reply) => {
							const replyAuthor = await transformUserData(reply.author.clerkId);
							return {
								id: reply.id,
								author: replyAuthor,
								content: reply.content,
								timestamp: reply.createdAt.toISOString(),
								likes: reply.likes,
								isLiked: commentLikeMap.get(reply.id) || false
							};
						})
					);

					return {
						id: comment.id,
						author: commentAuthor,
						content: comment.content,
						timestamp: comment.createdAt.toISOString(),
						likes: comment.likes,
						isLiked: commentLikeMap.get(comment.id) || false,
						replies: transformedReplies
					};
				})
			);

			const pollData: Poll | undefined = post.poll
				? {
						question: post.poll.question,
						totalVotes: post.poll.totalVotes,
						options: post.poll.options,
						userVote: voteMap.get(post.id),
						endsAt: post.poll.endsAt?.toISOString()
					}
				: undefined;

			const transformedPost: PostData = {
				id: post.id,
				title: post.title,
				content: post.content,
				author: postAuthor,
				timestamp: post.createdAt.toISOString(),
				category: post.category,
				likes: post.likes,
				comments: post.comments.length,
				isLiked: postLikeMap.get(post.id) || false,
				isBookmarked: false, // TODO: Check user's bookmark status
				tags: post.tags || [],
				poll: pollData
			};

			return {
				post: transformedPost,
				comments: transformedComments
			};
		})
	);

	return {
		polls,
		isAuthenticated,
		user: isAuthenticated ? user : null
	};
};

// Form actions removed - now using API endpoints for comments and likes
