import { db } from '../db';
import { accounts, Schema, users } from '../db/schema'
import type { CreateUserRequest } from '../domains/dto/user';
import type { User, UserRole } from '../domains/entities/user';
import { and, eq, isNull } from 'drizzle-orm';

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

    async findById(id: string): Promise<User | null> {
        const row = await db.query.users.findFirst({
            where: {
                id: { eq: id },
                deletedAt: { isNull: true },
            }
        });

        if (!row) {
            return null;
        }

        return this.mapToEntity(row as UserQueryRow);
    }

    async findByEmail(email: string): Promise<User | null> {
        const row = await db.query.users.findFirst({
            where: {
                email: { eq: email },
                deletedAt: { isNull: true },
            }
        });

        if (!row) {
            return null;
        }

        return this.mapToEntity(row as UserQueryRow);
    }

    async findAll(): Promise<User[]> {
        const rows = await db.query.users.findMany({
            where: {
                deletedAt: { isNull: true }
            }
        })

        return rows.map((row) => this.mapToEntity(row as UserQueryRow));
    }

    // async create(input: CreateUserRequest): Promise<User> {
    //     const newUser = await db.insert(users).values({
    //         firstName: input.firstName,
    //         lastName: input.lastName,
    //         email: input.email,
    //         company: input.company,
    //         role: input.role as UserRole,
    //         password: input.password
    //     })
    //         .returning();

    //     const createdUser = newUser[0];
    //     return this.mapToEntity(createdUser);
    // }

    async delete(id: string): Promise<void> {
        try {
            await db.update(users).set({
                isActive: false,
                deletedAt: new Date(),
                updatedAt: new Date(),
            })
                .where(and(eq(users.id, id), isNull(users.deletedAt)));

            await db.delete(accounts).where(eq(accounts.accountId, id));
        }
        catch (error) {
            console.error(error)
        }
    }
}