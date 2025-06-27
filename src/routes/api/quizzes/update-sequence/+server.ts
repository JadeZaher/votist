import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';
import { getUser } from '$lib/server/auth';

type QuizUpdate = {
	id: string;
	sequence: number;
};

export const PATCH: RequestHandler = async (event) => {
	try {
		const { user, isAuthenticated } = await getUser(event);

		if (!isAuthenticated || !user || user.publicMetadata?.role !== 'admin') {
			return new Response('Unauthorized', { status: 401 });
		}

		const updates: QuizUpdate[] = await event.request.json();

		const updatePromises = updates.map(({ id, sequence }) =>
			prisma.quiz.update({
				where: { id },
				data: { sequence }
			})
		);

		await Promise.all(updatePromises);

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error('Error updating quiz sequences:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
