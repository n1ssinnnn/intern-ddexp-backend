import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import type { UserRole } from "../domains/entities/user";

export const users = pgTable('users', {
    id: t.text('id').primaryKey(),
    firstName: t.text('firstName').notNull(),
    lastName: t.text('lastName').notNull(),
    name: t.text('name').notNull(),
    image: t.text("image"),
    email: t.text('email').notNull().unique(),
    emailVerified: t.boolean('email_verified').default(false).notNull(),
    company: t.text('company').notNull(),
    companyImageUrl: t.text('companyImageUrl'),
    role: t.text('role').$type<UserRole>().default('user').notNull(),
    isActive: t.boolean('is_active').default(true).notNull(),
    banned: t.boolean('banned').default(false),
    banReason: t.text('ban_reason'),
    banExpires: t.timestamp('ban_expires'),
    createdAt: t.timestamp('created_at').notNull(),
    updatedAt: t.timestamp('updated_at')
        .$onUpdate(() => new Date())
        .notNull(),
    deletedAt: t.timestamp('deleted_at'),
});

export const sessions = pgTable('sessions', {
    id: t.text('id').primaryKey(),
    userId: t.text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    token: t.text('token').notNull().unique(),
    expiresAt: t.timestamp('expires_at').notNull(),
    ipAddress: t.text('ip_address'),
    userAgent: t.text('user_agent'),
    createdAt: t.timestamp('created_at').notNull(),
    updatedAt: t.timestamp('updated_at')
        .$onUpdate(() => new Date())
        .notNull(),
    impersonatedBy: t.text('impersonated_by'),
},
    (table) => [t.index('sessions_user_id_idx').on(table.userId)],
);

export const accounts = pgTable('accounts', {
    id: t.text('id').primaryKey(),
    userId: t.text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    accountId: t.text('account_id').notNull(),
    providerId: t.text('provider_id').notNull(),
    accessToken: t.text('access_token'),
    refreshToken: t.text('refresh_token'),
    idToken: t.text('id_token'),
    accessTokenExpiresAt: t.timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: t.timestamp('refresh_token_expires_at'),
    scope: t.text('scope'),
    password: t.text('password'),
    createdAt: t.timestamp('created_at').notNull(),
    updatedAt: t.timestamp('updated_at')
        .$onUpdate(() => new Date())
        .notNull(),
},
    (table) => [t.index('accounts_user_id_idx').on(table.userId)],
);

export const verifications = pgTable('verifications', {
    id: t.text('id').primaryKey(),
    identifier: t.text('identifier').notNull(),
    value: t.text('value').notNull(),
    expiresAt: t.timestamp('expires_at').notNull(),
    createdAt: t.timestamp('created_at').notNull(),
    updatedAt: t.timestamp('updated_at')
        .$onUpdate(() => new Date())
        .notNull(),
},
    (table) => [t.index('verifications_identifier_idx').on(table.identifier)],
);

const schemaTables = {
    users,
    sessions,
    accounts,
    verifications,
};

export const Schema = schemaTables;
export type Schema = typeof schemaTables;