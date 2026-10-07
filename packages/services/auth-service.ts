import { auth as Auth } from "../auth"; // path to your Better Auth server instance
import type { SignInRequest, SignUpRequest } from "../domains/dto/user";
import type { User } from "../domains/entities/user";
import type { UserRepository } from "../repositories/user-repo";

export function createHttpError(caught: unknown, fallbackMessage: string, fallbackStatus: number) {
    const source = typeof caught === "object" && caught !== null
        ? caught as { message?: unknown; status?: unknown; statusCode?: unknown }
        : undefined;
    const candidateStatus = Number(source?.statusCode ?? source?.status);
    const status = Number.isInteger(candidateStatus) && candidateStatus >= 400 && candidateStatus <= 599
        ? candidateStatus
        : fallbackStatus;
    const message = typeof source?.message === "string" && source.message.length > 0
        ? source.message
        : fallbackMessage;

    return Object.assign(new Error(message), { status });
}

export class AuthService {
    constructor(
        private readonly auth: typeof Auth,
        private readonly userRepo: UserRepository,
    ) { }

    async signUp(input: SignUpRequest): Promise<User> {

        const hasExistingEmail = await this.userRepo.findByEmail(input.email)
        if (hasExistingEmail) {
            throw new Error('This email is already registered.');
        }

        try {
            const result = await this.auth.api.signUpEmail({
                body: {
                    firstName: input.firstName,
                    lastName: input.lastName,
                    company: input.company,
                    name: `${input.firstName} ${input.lastName}`,
                    email: input.email,
                    password: input.password,
                    ...(input.companyImageUrl ? { companyImageUrl: input.companyImageUrl } : {}),
                },
            });

            const user = await this.userRepo.findById(result.user.id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;

        } catch (err: unknown) {
            throw createHttpError(err, "Cannot get users", 500);
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
            return await this.auth.api.signInEmail({
                body: {
                    email: input.email,
                    password: input.password,
                    rememberMe: false,
                },
                headers,
                asResponse: true,
            });
        }

        // Catch any errors
        catch (err: unknown) {
            throw createHttpError(err, "Invalid email or password", 401);
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
            return await this.auth.api.signOut({
                headers,
                asResponse: true,
            });
        }

        // Catch any errors
        catch (err: unknown) {
            throw createHttpError(err, "Cannot sign out", 500);
        }
    }
}