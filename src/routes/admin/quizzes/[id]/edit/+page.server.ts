import { error } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';

export const load = (async ({ params }) => {
    try {
        const quiz = await prisma.quiz.findUnique({
            where: { id: params.id },
            select: {
                id: true,
                title: true,
                description: true,
                difficulty: true,
                enabled: true,
                questions: {
                    select: {
                        id: true,
                        text: true,
                        correctOptionId: true,
                        points: true,
                        options: {
                            select: {
                                id: true,
                                text: true
                            }
                        }
                    }
                }
            }
        });

        if (!quiz) {
            throw error(404, 'Quiz not found');
        }

        return { quiz };
    } catch (e) {
        console.error('Error loading quiz:', e);
        throw error(500, 'Could not load quiz');
    }
}) satisfies ServerLoad;