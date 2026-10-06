import { auth as Auth } from "../../app/src/lib/auth"; // path to your Better Auth server instance
import type { SignInRequest, SignUpRequest } from "../domains/dto/user";
import type { User } from "../domains/entities/user";
import type { UserRepository } from "../repositories/user-repo";

export class AuthService {
    constructor(
        private readonly auth: typeof Auth,
        private readonly userRepo: UserRepository,
    ) { }

    async signUp(input: SignUpRequest): Promise<User> {
        try {
            const result = await this.auth.api.signUpEmail({
                body: {
                    name: `${input.firstName} ${input.lastName}`,
                    email: input.email,
                    password: input.password,
                },
            });
            return {
                id: result.user.id,
                firstName: input.firstName,
                lastName: input.lastName,
                name: result.user.name,
                email: result.user.email,
                emailVerified: result.user.emailVerified,
                company: input.company,
                companyImage: input.companyImageUrl ?? null,
                role: "user",
                status: true,
                createdAt: new Date(result.user.createdAt),
                updatedAt: new Date(result.user.updatedAt),
            };
        } catch (err: unknown) {
            const error = new Error("Cannot sign up") as Error & { status?: number };
            error.status = 500;
            throw error;
        }
    }

    async signIn(input: SignInRequest, headers: Headers) {

        // User already signed in
        const existingSession = await this.auth.api.getSession({ headers })
        if (existingSession) {
            const error = new Error('User is already signed in.') as Error & { status?: number };
            error.status = 409
            throw error;
        }

        // Sign in
        try {
            const result = await this.auth.api.signInEmail({
                body: {
                    email: input.email,
                    password: input.password,
                    rememberMe: false,
                },
                headers,
                asResponse: true
            })
        }

        // Catch any errors
        catch (err: unknown) {
            const error = new Error("Invalid email or password") as Error & { status?: number };
            error.status = 401;
            throw error;
        }
    }

    async signOut(headers: Headers) {

        // No active session ( do not signed in )
        const session = await this.auth.api.getSession({ headers })
        if (!session) {
            const error = new Error('No active session found') as Error & { status?: number };
            error.status = 401
            throw error;
        }

        // Sign out
        try {
            const result = await this.auth.api.signOut({
                headers,
                asResponse: true
            });
        }

        // Catch any errors
        catch (err: unknown) {
            const error = new Error('Cannot sign out') as Error & { status?: number };
            error.status = 500
            throw error
        }
    }
}