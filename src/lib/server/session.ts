import crypto from 'crypto';
import { prisma } from '$lib/server/db/prisma';
import type { User } from '@prisma/client';

const SESSION_EXPIRY_DAYS = 30;
export const SESSION_COOKIE_NAME = 'votist_session';

function generateToken(): string {
	return crypto.randomBytes(32).toString('hex');
}

function hashToken(token: string): string {
	return crypto.createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
	const token = generateToken();
	const hashedToken = hashToken(token);
	const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

	await prisma.session.create({
		data: {
			userId,
			token: hashedToken,
			expiresAt
		}
	});

	return { token, expiresAt };
}

export async function validateSession(token: string): Promise<User | null> {
	const hashedToken = hashToken(token);

	const session = await prisma.session.findUnique({
		where: { token: hashedToken },
		include: { user: true }
	});

	if (!session) {
		return null;
	}

	if (session.expiresAt < new Date()) {
		await prisma.session.delete({ where: { id: session.id } });
		return null;
	}

	return session.user;
}

export async function invalidateSession(token: string): Promise<void> {
	const hashedToken = hashToken(token);
	await prisma.session.deleteMany({ where: { token: hashedToken } });
}

export async function cleanExpiredSessions(): Promise<number> {
	const result = await prisma.session.deleteMany({
		where: { expiresAt: { lt: new Date() } }
	});
	return result.count;
}
