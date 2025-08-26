import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';

const prisma = new PrismaClient();

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

		return json({ comment });
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
