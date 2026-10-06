import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../../packages/db/index"; // your drizzle instance
import { accounts, sessions, users, verifications } from "../../../packages/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: {
            user: users,
            session: sessions,
            account: accounts,
            verification: verifications,
        },
    }),
    user: {
        additionalFields: {
            firstName: {
                type: "string",
                required: true,
                input: true,
            },
            lastName: {
                type: "string",
                required: true,
                input: true,
            },
            company: {
                type: "string",
                required: true,
                input: true,
            },
            companyImageUrl: {
                type: "string",
                required: false,
                input: true,
            },
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
                input: false,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
    },
});