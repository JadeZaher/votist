import { pgTable, text, timestamp, unique, pgEnum } from 'drizzle-orm/pg-core';

// Define enums
export const proposalStatusEnum = pgEnum('proposal_status', [
	'draft',
	'submitted',
	'under_review',
	'approved',
	'rejected'
]);

// User table schema
export const users = pgTable(
	'users',
	{
		id: text('id').primaryKey(),
		clerkUserId: text('clerk_user_id').unique(),
		email: text('email').unique(),
		firstName: text('first_name'),
		lastName: text('last_name'),
		username: text('username'),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(table) => ({
		uniqueEmail: unique('unique_email').on(table.email)
	})
);

// Proposal table schema
export const proposals = pgTable('proposals', {
	id: text('id').primaryKey(),
	userId: text('user_id').references(() => users.id),
	title: text('title').notNull(),
	description: text('description'),
	status: proposalStatusEnum('status').default('draft'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});
