import type { UpdateUserInput } from "../domains/dto/user";
import type { OrderingParams, PagingParams, PagingResult } from "../domains/entities/common";
import type { User } from "../domains/entities/user";
import type { UserRepository } from "../repositories/user-repo";
import { createHttpError } from "./auth-service";

export class UserService {
    constructor(
        private readonly userRepo: UserRepository
    ) { }

    async getAllUsers(paging: PagingParams, ordering: OrderingParams<User>): Promise<PagingResult<User>> {
        try {
            const users = await this.userRepo.findAll(paging, ordering);
            return users
        }

        catch (err: unknown) {
            throw createHttpError(err, "Cannot find users", 500);
        }
    }

    async getUserById(id: string): Promise<User | null> {
        try {
            const user = await this.userRepo.findById(id);
            if (!user) {
                throw new Error('User not found')
            }
            return user
        }

        catch (err: unknown) {
            throw createHttpError(err, "Cannot find user", 500);
        }
    }

    async editUser(id: string, input: UpdateUserInput): Promise<User> {

        // Email exist
        const hasExistingEmail = await this.userRepo.findByEmail(input.email)
        if (hasExistingEmail) {
            throw new Error('This email is already registered.');
        }

        // Update 
        try {
            const updatedUser = await this.userRepo.update(id, {
                ...input
            })
            if (!updatedUser) {
                throw new Error('User not found');
            }
            return updatedUser;
        }


        catch (err: unknown) {
            throw createHttpError(err, "Error", 500);
        }
    }

    async deleteUser(id: string): Promise<void> {
        const user = await this.userRepo.findById(id);
        if (!user) {
            throw new Error('User not found')
        }

        try {
            await this.userRepo.delete(id)
        }

        catch (err: unknown) {
            throw createHttpError(err, "Error", 500);
        }
    }
}