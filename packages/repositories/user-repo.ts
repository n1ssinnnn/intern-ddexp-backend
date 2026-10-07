import { db } from '../db';
import { Schema } from '../db/schema'
import type { User } from '../domains/entities/user';
import { isNull } from 'drizzle-orm';

type UserQueryRow = typeof Schema.users.$inferSelect

export class UserRepository {
    private readonly table = Schema.users;

    mapToEntity(row: UserQueryRow): User {
        return {
            id: row.id,
            firstName: row.firstName,
            lastName: row.lastName,
            name: row.name,
            image: row.image,
            email: row.email,
            emailVerified: row.emailVerified,
            company: row.company,
            companyImage: row.companyImageUrl,
            role: row.role,
            status: row.isActive,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            deletedAt: row.deletedAt,
        };
    }

    async findAll(): Promise<User[]> {
        const rows = await db
            .select()
            .from(this.table)
            .where(isNull(this.table.deletedAt));

        return rows.map((row) => this.mapToEntity(row));
    }
}