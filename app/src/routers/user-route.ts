import { Elysia, t } from 'elysia'
import { userService } from '../service-di';
import { userIdParams } from '../requests/user';

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

    .post('/create', '')

    .get('/getAll',
        async () => {
            return userService.getAllUsers();
        },
        {
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
            response: {
                401: errorResponse,
                409: errorResponse,
                422: errorResponse,
                500: errorResponse,
            },
            params: userIdParams
        }
    )

    .patch('/edit', '')

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