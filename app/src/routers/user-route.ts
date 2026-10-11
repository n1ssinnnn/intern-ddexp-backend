import { Elysia, t } from 'elysia'
import { authService, userService } from '../service-di';
import { createUserRequest, listUsersQuery, updateUserRequest, userIdParams } from '../requests/user';
import type { OrderDirection, OrderingParams } from '../../../packages/domains/entities/common';
import type { User } from '../../../packages/domains/entities/user';

export const userRoute = new Elysia({
    prefix: '/user',
    detail: {
        tags: ['User']
    }
})

    .post('/',
        async ({ body, request: { headers } }) => {
            return authService.createUserByAdmin(body, headers);
        },
        {
            body: createUserRequest,
        },


    )

    .get('/',
        async ({ query }) => {
            const paging = {
                page: Number(query.page),
                perPage: Number(query.perPage),
            };
            const order: OrderingParams<User> = {
                orderBy: query.orderBy as keyof User,
                orderDirection: query.orderDirection as OrderDirection,
            };
            return await userService.getAllUsers(paging, order);
        },
        {
            query: listUsersQuery,
        }
    )

    .get('/:id',
        async ({ params }) => {
            return userService.getUserById(params.id);
        },
        {
            params: userIdParams,
        }
    )

    .put('/:id',
        async ({ params, body }) => {
            return userService.editUser(params.id, body)
        },
        {
            params: userIdParams,
            body: updateUserRequest,
        }
    )

    .delete('/:id',
        async ({ params }) => {
            return userService.deleteUser(params.id);
        },
        {
            params: userIdParams
        }
    )