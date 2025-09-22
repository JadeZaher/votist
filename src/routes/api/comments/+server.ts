import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';
import { clerkClient } from 'svelte-clerk/server';
import type { CommentData } from '$lib/types';

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

// GET /api/comments?postId=... - Get comments for a post
export const GET: RequestHandler = async (event) => {
	const { user, isAuthenticated } = await getUser(event);
	const url = new URL(event.request.url);
	const postId = url.searchParams.get('postId');

	if (!postId) {
		return json({ error: 'postId is required' }, { status: 400 });
	}

	try {
		// Get user's comment likes if authenticated
		let commentLikeMap = new Map<string, boolean>();
		if (isAuthenticated && user) {
			const userCommentLikes = await prisma.commentLike.findMany({
				where: { userId: user.id },
				select: { commentId: true }
			});
			userCommentLikes.forEach((like) => {
				commentLikeMap.set(like.commentId, true);
			});
		}

		// Get all top-level comments
		const topLevelComments = await prisma.comment.findMany({
			where: {
				postId,
				parentId: null // Only root comments
			},
			include: {
				author: {
					select: { clerkId: true }
				}
			},
			orderBy: { createdAt: 'desc' }
		});

		// Get all replies grouped by rootCommentId for 2-level threading
		const allReplies = await prisma.comment.findMany({
			where: {
				postId,
				rootCommentId: { not: null } // All replies regardless of depth
			},
			include: {
				author: {
					select: { clerkId: true }
				}
			},
			orderBy: { createdAt: 'asc' }
		});

		// Group replies by their root comment
		const repliesByRoot = new Map<string, any[]>();
		allReplies.forEach((reply) => {
			if (reply.rootCommentId) {
				if (!repliesByRoot.has(reply.rootCommentId)) {
					repliesByRoot.set(reply.rootCommentId, []);
				}
				repliesByRoot.get(reply.rootCommentId)!.push(reply);
			}
		});

		const transformedComments: CommentData[] = await Promise.all(
			topLevelComments.map(async (comment) => {
				const commentAuthor = await transformUserData(comment.author.clerkId);

				// Get all replies for this root comment (flattened)
				const replies = repliesByRoot.get(comment.id) || [];
				const transformedReplies = await Promise.all(
					replies.map(async (reply) => {
						const replyAuthor = await transformUserData(reply.author.clerkId);
						return {
							id: reply.id,
							author: replyAuthor,
							content: reply.content,
							timestamp: reply.createdAt.toISOString(),
							likes: reply.likes,
							isLiked: commentLikeMap.get(reply.id) || false,
							rootCommentId: reply.rootCommentId || undefined,
							parentId: reply.parentId || undefined
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

		return json({ comments: transformedComments });
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 500 });
	}
};

// POST /api/comments - Create a new comment
export const POST: RequestHandler = async (event) => {
	const { user, isAuthenticated } = await getUser(event);

	if (!isAuthenticated) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await event.request.json();
	const { postId, content, parentId } = data;

	if (!postId || !content || content.length > 2000 || content.trim().length === 0) {
		return json({ error: 'Invalid postId or content' }, { status: 400 });
	}

	let rootCommentId: string | null = null;

	// If parentId, verify it's under the post and determine rootCommentId
	if (parentId) {
		const parentComment = await prisma.comment.findUnique({
			where: { id: parentId },
			select: { id: true, postId: true, rootCommentId: true, parentId: true }
		});

		if (!parentComment || parentComment.postId !== postId) {
			return json({ error: 'Invalid parent comment' }, { status: 400 });
		}

		// For 2-level threading: if parent is a top-level comment, set it as root
		// If parent is already a reply, use its rootCommentId
		rootCommentId = parentComment.rootCommentId || parentComment.id;
	}

	try {
		const newComment = await prisma.comment.create({
			data: {
				content: content.trim(),
				authorId: user.id,
				postId,
				parentId,
				rootCommentId
			},
			include: {
				author: {
					select: { clerkId: true }
				}
			}
		});

		const author = await transformUserData(newComment.author.clerkId);
		const transformedComment: CommentData = {
			id: newComment.id,
			author,
			content: newComment.content,
			timestamp: newComment.createdAt.toISOString(),
			likes: 0,
			replies: [],
			rootCommentId: newComment.rootCommentId || undefined,
			parentId: newComment.parentId || undefined
		};

		return json({ comment: transformedComment });
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 500 });
	}
};
