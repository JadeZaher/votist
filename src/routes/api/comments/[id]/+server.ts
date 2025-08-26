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
			name: clerkUser.firstName && clerkUser.lastName 
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

// PUT /api/comments/[id] - Update a comment
export const PUT: RequestHandler = async (event) => {
	const { user, isAuthenticated } = await getUser(event);

	if (!isAuthenticated) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await event.request.json();

	try {
		// Check if user owns the comment or is admin
		const existingComment = await prisma.comment.findUnique({
			where: { id: event.params.id },
			select: { authorId: true }
		});

		if (!existingComment) {
			return json({ error: 'Comment not found' }, { status: 404 });
		}

		if (existingComment.authorId !== user.id && user.publicMetadata?.role !== 'admin') {
			return json({ error: 'Forbidden' }, { status: 403 });
		}

		const comment = await prisma.comment.update({
			where: { id: event.params.id },
			data: {
				content: data.content
			},
			include: {
				author: {
					select: {
						clerkId: true,
						email: true
					}
				}
			}
		});

		// Transform the author data to match frontend expectations
		const author = await transformUserData(comment.author.clerkId);
		const transformedComment = {
			...comment,
			author
		};

		return json({ comment: transformedComment });
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 400 });
	}
};

// DELETE /api/comments/[id] - Delete a comment
export const DELETE: RequestHandler = async (event) => {
	const { user, isAuthenticated } = await getUser(event);

	if (!isAuthenticated) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Check if user owns the comment or is admin
		const existingComment = await prisma.comment.findUnique({
			where: { id: event.params.id },
			select: { authorId: true }
		});

		if (!existingComment) {
			return json({ error: 'Comment not found' }, { status: 404 });
		}

		if (existingComment.authorId !== user.id && user.publicMetadata?.role !== 'admin') {
			return json({ error: 'Forbidden' }, { status: 403 });
		}

		await prisma.comment.delete({
			where: { id: event.params.id }
		});

		return json({ message: 'Comment deleted successfully' });
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 500 });
	}
};
