import type { UpdateUserInput } from "../domains/dto/user";
import type { OrderingParams, PagingParams, PagingResult } from "../domains/entities/common";
import type { User } from "../domains/entities/user";
import { Errors } from "../domains/errors";
import type { UserRepository } from "../repositories/user-repo";

export class UserService {
    constructor(
        private readonly userRepo: UserRepository
    ) { }

    async getAllUsers(paging: PagingParams, ordering: OrderingParams<User>): Promise<PagingResult<User>> {
        try {
            const users = await this.userRepo.findAll(paging, ordering);
            return users
        }

        catch (error: unknown) {
            if (error instanceof Errors.ApiError) throw error;
            const err = error as {
                statusCode?: number;
                status?: number;
                message?: string;
            }
            throw new Errors.InternalServerError(err?.message ?? 'Failed to get all users')
        }
    }

    async getUserById(id: string): Promise<User | null> {
        try {
            const user = await this.userRepo.findById(id);
            if (!user) {
                throw new Errors.NotFound('User not found')
            }
            return user
        }

        catch (error: unknown) {
            if (error instanceof Errors.ApiError) throw error;
            const err = error as {
                statusCode?: number;
                status?: number;
                message?: string;
            }
            throw new Errors.InternalServerError(err?.message ?? 'Failed to get user by id')
        }
    }

    async editUser(id: string, input: UpdateUserInput): Promise<User> {

        // Email exist
        const existingUser = await this.userRepo.findByEmail(input.email);
        if (existingUser && existingUser.id !== id) {
            throw new Errors.Conflict('This email is already registered.');
        }

        // Update 
        try {
            const updatedUser = await this.userRepo.update(id, {
                ...input
            })
            if (!updatedUser) {
                throw new Errors.NotFound('User not found');
            }
            return updatedUser;
        }


        catch (error: unknown) {
            if (error instanceof Errors.ApiError) throw error;
            const err = error as {
                statusCode?: number;
                status?: number;
                message?: string;
            }
            throw new Errors.InternalServerError(err?.message ?? 'Failed to update user')
        }
    }

    async deleteUser(id: string): Promise<void> {

        //Check if user exists
        const user = await this.userRepo.findById(id);
        if (!user) {
            throw new Errors.NotFound('User not found');
        }

        try {
            await this.userRepo.delete(id)
        }

        catch (error: unknown) {
            if (error instanceof Errors.ApiError) throw error;
            const err = error as {
                statusCode?: number;
                status?: number;
                message?: string;
            }
            throw new Errors.InternalServerError(err?.message ?? 'Failed to delete user')
        }
    }
}