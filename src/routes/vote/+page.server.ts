import { prisma } from '$lib/server/db/prisma';
import { getUser } from '$lib/server/auth';
import type { PageServerLoad } from './$types';
import type { PollFeedData, PostData, CommentData, Poll } from '$lib/types';
import { userMeetsPostQuizGate } from '$lib/server/quizPermissions';

// Transform DB user fields into frontend display format (no external API calls)
function transformAuthor(author: {
	firstName: string | null;
	lastName: string | null;
	avatarUrl: string | null;
	email: string | null;
	isAdmin: boolean;
}) {
	const name =
		author.firstName && author.lastName
			? `${author.firstName} ${author.lastName}`
			: author.firstName || author.lastName || 'Anonymous';
	return {
		name,
		avatar: author.avatarUrl || '',
		username: author.email?.split('@')[0] || 'user',
		isVerified: author.isAdmin
	};
}

const authorSelect = {
	firstName: true,
	lastName: true,
	avatarUrl: true,
	email: true,
	isAdmin: true
} as const;

export const load: PageServerLoad = async (event) => {
	const { user, isAuthenticated } = await getUser(event);

	// Look up internal DB user for the authenticated user
	let dbUserId: string | null = null;
	if (isAuthenticated && user) {
		const dbUser = await prisma.user.findUnique({
			where: { clerkId: user.id },
			select: { id: true }
		});
		dbUserId = dbUser?.id ?? null;
	}

	let voteMap = new Map<string, string>();
	let postLikeMap = new Map<string, boolean>();
	let commentLikeMap = new Map<string, boolean>();

	// Fetch user interaction data and posts in parallel
	const [posts, ...userMaps] = await Promise.all([
		prisma.post.findMany({
			include: {
				author: { select: authorSelect },
				poll: {
					include: {
						options: {
							select: { id: true, text: true, votes: true }
						}
					}
				},
				comments: {
					include: {
						author: { select: authorSelect },
						replies: {
							include: {
								author: { select: authorSelect }
							}
						}
					},
					orderBy: { createdAt: 'asc' }
				}
			},
			orderBy: { createdAt: 'desc' },
			take: 10
		}),
		// Fetch user votes, likes, comment likes in parallel (only if authenticated)
		...(dbUserId
			? [
					prisma.vote.findMany({
						where: { userId: dbUserId },
						select: { postId: true, optionId: true }
					}),
					prisma.postLike.findMany({
						where: { userId: dbUserId },
						select: { postId: true }
					}),
					prisma.commentLike.findMany({
						where: { userId: dbUserId },
						select: { commentId: true }
					})
				]
			: [])
	]);

	if (dbUserId && userMaps.length === 3) {
		const [userVotes, userPostLikes, userCommentLikes] = userMaps as [
			{ postId: string; optionId: string }[],
			{ postId: string }[],
			{ commentId: string }[]
		];
		userVotes.forEach((vote) => voteMap.set(vote.postId, vote.optionId));
		userPostLikes.forEach((like) => postLikeMap.set(like.postId, true));
		userCommentLikes.forEach((like) => commentLikeMap.set(like.commentId, true));
	}

	// Transform posts - no async needed, all data is already loaded
	const polls: PollFeedData[] = await Promise.all(
		posts.map(async (post) => {
			const postAuthor = transformAuthor(post.author);

			// Check quiz gate for authenticated users
			let quizGateBlocked = false;
			let quizGateMessage = '';
			if (dbUserId && post.quizGateType !== 'NONE') {
				const gateResult = await userMeetsPostQuizGate(dbUserId, {
					quizGateType: post.quizGateType,
					quizGateDifficulty: post.quizGateDifficulty,
					quizGateQuizId: post.quizGateQuizId
				});
				quizGateBlocked = !gateResult.allowed;
				quizGateMessage = gateResult.message;
			}

			const transformedComments: CommentData[] = post.comments.map((comment) => {
				const commentAuthor = transformAuthor(comment.author);
				const transformedReplies: CommentData[] = (comment.replies || []).map((reply) => {
					const replyAuthor = transformAuthor(reply.author);
					return {
						id: reply.id,
						author: replyAuthor,
						content: reply.content,
						timestamp: reply.createdAt.toISOString(),
						likes: reply.likes,
						isLiked: commentLikeMap.get(reply.id) || false
					};
				});

				return {
					id: comment.id,
					author: commentAuthor,
					content: comment.content,
					timestamp: comment.createdAt.toISOString(),
					likes: comment.likes,
					isLiked: commentLikeMap.get(comment.id) || false,
					replies: transformedReplies
				};
			});

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
				isBookmarked: false,
				tags: post.tags || [],
				poll: pollData
			};

			return {
				post: transformedPost,
				comments: transformedComments,
				quizGateBlocked,
				quizGateMessage
			};
		})
	);

	return {
		polls,
		isAuthenticated,
		user: isAuthenticated ? user : null
	};
};
