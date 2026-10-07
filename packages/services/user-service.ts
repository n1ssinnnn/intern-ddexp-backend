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
            throw createHttpError(err, "Cannot sign up", 500);
        }
    }
}