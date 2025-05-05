import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';

// User table schema
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  clerkUserId: text('clerk_user_id').unique(),
  email: text('email').unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  username: text('username'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).defaultNow()
}, (table) => ({
  uniqueEmail: unique('unique_email').on(table.email)
}));

// Proposal table schema
export const proposals = sqliteTable('proposals', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status', { 
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected'] 
  }).default('draft'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).defaultNow()
});