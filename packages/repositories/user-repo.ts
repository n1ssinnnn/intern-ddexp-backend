import { db } from '../db';
import { accounts, Schema, users } from '../db/schema'
import type { CreateUserRequest, UpdateUserInput } from '../domains/dto/user';
import { ORDER_DIRECTION, type OrderingParams, type PagingParams, type PagingResult } from '../domains/entities/common';
import type { User, UserRole } from '../domains/entities/user';
import { and, eq, isNull, count } from 'drizzle-orm';
import { buildPagingResult } from '../domains/helper/paging';

type UserQueryRow = typeof Schema.users.$inferSelect

export class UserRepository {

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

    async findAll(paging: PagingParams, ordering: OrderingParams<User>): Promise<PagingResult<User>> {
        const orderByKey =
            ordering.orderBy as keyof typeof Schema.users.$inferSelect;
        const isAsc = ordering.orderDirection === ORDER_DIRECTION.ASC;

        const [rows, countResult] = await Promise.all([
            db.query.users.findMany({
                where: {
                    deletedAt: { isNull: true }
                },
                orderBy: (users, { asc, desc }) =>
                    isAsc ? asc(users[orderByKey]) : desc(users[orderByKey]),
                limit: paging.perPage,
                offset: (paging.page - 1) * paging.perPage,
            }),
            db.select({ total: count() }).from(users).where(isNull(users.deletedAt))
        ])

        return buildPagingResult(
            rows.map((row) => this.mapToEntity(row as UserQueryRow)),
            Number(countResult[0]?.total ?? 0),
            paging,
        );
    }

    async update(id: string, input: UpdateUserInput): Promise<User> {
        const result = await db.update(users).set({
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            company: input.company,
            role: input.role as UserRole,
            updatedAt: new Date(),
        })
            .where(and(eq(users.id, id), isNull(users.deletedAt)))
            .returning();

        const user = this.mapToEntity(result as any)
        return user
    }

    async delete(id: string): Promise<void> {
        await db.update(users).set({
            isActive: false,
            deletedAt: new Date(),
            updatedAt: new Date(),
        })
            .where(and(eq(users.id, id), isNull(users.deletedAt)));

        await db.delete(accounts).where(eq(accounts.accountId, id));
    }
}