import type { User } from "../domains/entities/user";
import type { UserRepository } from "../repositories/user-repo";
import { createHttpError } from "./auth-service";

export class UserService {
    constructor(
        private readonly userRepo: UserRepository
    ) { }

    async getAllUsers(): Promise<User[]> {
        try {
            const users = await this.userRepo.findAll();
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