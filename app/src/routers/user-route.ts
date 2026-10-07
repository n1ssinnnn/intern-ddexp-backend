import { Elysia, t } from 'elysia'
import { userService } from '../service-di';

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

    .get('/getById', '')

    .patch('/edit', '')

    .delete('/', '')