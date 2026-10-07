import { t } from "elysia"

export const signUpRequest = t.Object({
    firstName: t.String({ minLength: 1 }),
    lastName: t.String({ minLength: 1 }),
    email: t.String({ format: 'email' }),
    company: t.String({ minLength: 1 }),
    companyImageUrl: t.Optional(t.String()),
    password: t.String({ minLength: 1 }),
});

export const signInRequest = t.Object({
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 1 }),
    rememberMe: t.Optional(t.Boolean({ default: false })),
});