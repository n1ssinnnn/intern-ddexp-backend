import { auth as Auth } from "../auth"; // path to your Better Auth server instance
import type { CreateUserRequest, SignInRequest, SignUpRequest } from "../domains/dto/user";
import type { User, UserRole } from "../domains/entities/user";
import { Errors } from "../domains/errors";
import type { UserRepository } from "../repositories/user-repo";

export class AuthService {
    constructor(
        private readonly auth: typeof Auth,
        private readonly userRepo: UserRepository,
    ) { }

    async signUp(input: SignUpRequest): Promise<User> {

        // Email exist
        const hasExistingEmail = await this.userRepo.findByEmail(input.email)
        if (hasExistingEmail) {
            throw new Errors.Conflict('This email is already registered.');
        }

        // Sign up
        try {
            const result = await this.auth.api.signUpEmail({
                body: {
                    firstName: input.firstName,
                    lastName: input.lastName,
                    name: `${input.firstName} ${input.lastName}`,
                    email: input.email,
                    company: input.company,
                    password: input.password,
                    companyImageUrl: input.companyImageUrl
                },
            });

            const user = await this.userRepo.findById(result.user.id);
            if (!user) {
                throw new Errors.NotFound('User not found');
            }

            return user;

        }

        catch (error: unknown) {
            if (error instanceof Errors.ApiError) throw error;
            const err = error as {
                statusCode?: number;
                status?: number;
                message?: string;
            }
            throw new Errors.InternalServerError(err?.message ?? 'Failed to sign up')
        }
    }

    async signIn(input: SignInRequest, headers: Headers) {

        // User already signed in
        const existingSession = await this.auth.api.getSession({ headers })
        if (existingSession) {
            throw new Errors.Conflict('User is already signed in.');
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
                asResponse: true,
            });
            return result;
        }

        // Catch any errors
        catch (error: unknown) {
            if (error instanceof Errors.ApiError) throw error;
            const err = error as {
                statusCode?: number;
                status?: number;
                message?: string;
                body?: { code?: string };
            };
            //Check if email or password is incorrect
            if (err?.statusCode === 401 || err?.status === 401) {
                throw new Errors.Unauthorized('Invalid email or password');
            }
            throw new Errors.InternalServerError(err?.message ?? 'Failed to sign in');
        }
    }

    async signOut(headers: Headers) {

        // No active session ( do not signed in )
        const session = await this.auth.api.getSession({ headers })
        if (!session) {
            throw new Errors.Unauthorized('No active session found');
        }

        // Sign out
        try {
            const result = await this.auth.api.signOut({
                headers,
                asResponse: true,
            });
            return result;
        }

        // Catch any errors
        catch (error: unknown) {
            if (error instanceof Errors.ApiError) throw error;
            const err = error as {
                statusCode?: number;
                status?: number;
                message?: string;
            }
            throw new Errors.InternalServerError(err?.message ?? 'Failed to sign out')
        }
    }

    async createUserByAdmin(input: CreateUserRequest, headers: Headers): Promise<User> {

        // Email exist
        const hasExistingEmail = await this.userRepo.findByEmail(input.email)
        if (hasExistingEmail) {
            throw new Errors.Conflict('This email is already registered.');
        }

        //Validate password and confirmPassword
        if (input.password !== input.confirmPassword) {
            throw new Errors.UnprocessableEntity('Password and confirmPassword do not match');
        }

        // Create
        try {
            const result = await this.auth.api.createUser({
                body: {
                    name: `${input.firstName} ${input.lastName}`,
                    email: input.email,
                    password: input.password,
                    role: input.role as UserRole,

                    data: {
                        firstName: input.firstName,
                        lastName: input.lastName,
                        company: input.company,
                    }
                },
                headers
            })
            const user = await this.userRepo.findById(result.user.id);
            if (!user) {
                throw new Errors.NotFound('User not found');
            }
            return user;
        }

        catch (error: unknown) {
            if (error instanceof Errors.ApiError) throw error;
            const err = error as {
                statusCode?: number;
                status?: number;
                message?: string;
            }
            throw new Errors.InternalServerError(err?.message ?? 'Failed to create user')
        }
    }
}
