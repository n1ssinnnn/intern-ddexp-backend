import { Elysia, t } from 'elysia'
import { authService } from '../service-di'

const errorResponse = t.Object({
    error: t.String(),
    message: t.String(),
    details: t.Optional(t.Array(t.Object({
        path: t.String(),
        message: t.String(),
    }))),
});

export const authRoute = new Elysia({
    prefix: '/auth',
    detail: {
        tags: ['Auth']
    }
})

    .post('/sign-up',
        async ({ body }) => {
            return authService.signUp(body);
        },
        {
            body: t.Object({
                firstName: t.String({ minLength: 1 }),
                lastName: t.String({ minLength: 1 }),
                email: t.String({ format: 'email' }),
                company: t.String({ minLength: 1 }),
                companyImageUrl: t.Optional(t.String()),
                role: t.Optional(t.String()),
                password: t.String({ minLength: 1 }),
            }),
            response: {
                409: errorResponse,
                422: errorResponse,
                500: errorResponse,
            },
        }
    )

    .post('/sign-in',
        async ({ body, request: { headers } }) => {
            return authService.signIn(body, headers);
        },
        {
            body: t.Object({
                email: t.String({ format: 'email' }),
                password: t.String({ minLength: 1 }),
                rememberMe: t.Optional(t.Boolean({ default: false })),
            }),
            response: {
                401: errorResponse,
                409: errorResponse,
                422: errorResponse,
                500: errorResponse,
            },
        }
    )

    .post('/sign-out', async ({ request: { headers } }) => {
        return authService.signOut(headers);
    }, {
        response: {
            401: errorResponse,
            500: errorResponse,
        },
    });
