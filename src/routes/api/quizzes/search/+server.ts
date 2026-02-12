import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';
import { prisma } from '$lib/server/db/prisma';

// GET /api/quizzes/search?q=searchterm - Search quizzes by title
export const GET: RequestHandler = async (event) => {
	const { user, isAuthenticated } = await getUser(event);

	if (!isAuthenticated || user.publicMetadata?.role !== 'admin') {
		return json({ error: 'Admin access required' }, { status: 403 });
	}

	const query = event.url.searchParams.get('q') || '';

	try {
		const quizzes = await prisma.quiz.findMany({
			where: query
				? {
						title: {
							contains: query,
							mode: 'insensitive'
						}
					}
				: {},
			select: {
				id: true,
				title: true,
				difficulty: true,
				order: true
			},
			orderBy: [{ difficulty: 'asc' }, { order: 'asc' }],
			take: 20
		});

		return json({ quizzes });
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 500 });
	}
};
