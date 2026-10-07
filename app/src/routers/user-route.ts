import { Elysia, t } from 'elysia'
import { authService, userService } from '../service-di';
import { createUserRequest, listUsersQuery, updateUserRequest, userIdParams } from '../requests/user';
import { OrderDirection, OrderingParams } from '../../../packages/domains/entities/common';
import { User } from '../../../packages/domains/entities/user';

const errorResponse = t.Object({
    error: t.String(),
    message: t.String(),
    details: t.Optional(t.Array(t.Object({
        path: t.String(),
        message: t.String(),
    }))),
});

export const userRoute = new Elysia({
    prefix: '/user',
    detail: {
        tags: ['User']
    }
})

    .post('/create',
        async ({ body, request: { headers } }) => {
            return authService.createUserByAdmin(body, headers);
        },
        {
            body: createUserRequest,
            response: {
                401: errorResponse,
                409: errorResponse,
                422: errorResponse,
                500: errorResponse,
            },
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
            const users = userService.getAllUsers(paging, order);
            return users;
        },
        {
            query: listUsersQuery,
            response: {
                401: errorResponse,
                409: errorResponse,
                422: errorResponse,
                500: errorResponse,
            },
        }
    )

    .get('/:id',
        async ({ params }) => {
            return userService.getUserById(params.id);
        },
        {
            params: userIdParams,
            response: {
                401: errorResponse,
                409: errorResponse,
                422: errorResponse,
                500: errorResponse,
            },
        }
    )

    .put('/:id',
        async ({ params, body }) => {
            return userService.editUser(params.id, body)
        },
        {
            params: userIdParams,
            body: updateUserRequest,
            response: {
                401: errorResponse,
                409: errorResponse,
                422: errorResponse,
                500: errorResponse,
            },
        }
    )

    .delete('/:id',
        async ({ params }) => {
            return userService.deleteUser(params.id);
        },
        {
            response: {
                401: errorResponse,
                409: errorResponse,
                422: errorResponse,
                500: errorResponse,
            },
            params: userIdParams
        }
    )