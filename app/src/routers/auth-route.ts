import { Elysia, t } from 'elysia'
import { authService } from '../service-di'
import { signInRequest, signUpRequest } from '../requests/auth';

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
            body: signUpRequest,
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
            body: signInRequest,
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
