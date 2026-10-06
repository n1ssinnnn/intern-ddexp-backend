import { Elysia, t } from 'elysia'
import { authService } from '../service-di'

export const authRoute = new Elysia({
    prefix: '/auth',
    detail: {
        tags: ['auth']
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
                companyImageUrl: t.String({ minLength: 1 }),
                password: t.String({ minLength: 1 }),
            })
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
            })
        }
    )

    .post('/sign-out', async ({ request: { headers } }) => {
        return authService.signOut(headers);
    });
