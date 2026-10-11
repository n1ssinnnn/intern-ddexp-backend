import { Elysia, t } from 'elysia'
import { authService } from '../service-di'
import { signInRequest, signUpRequest } from '../requests/auth';

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
        }
    )

    .post('/sign-in',
        async ({ body, request: { headers } }) => {
            return authService.signIn(body, headers);
        },
        {
            body: signInRequest,
        }
    )

    .post('/sign-out', async ({ request: { headers } }) => {
        return authService.signOut(headers);
    });
