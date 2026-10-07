import { defineRelations } from "drizzle-orm";
import { Schema } from "./schema";

export const relations = defineRelations(Schema, (r) => ({
    users: {
        sessions: r.many.sessions(),
        accounts: r.many.accounts(),
    },
    sessions: {
        user: r.one.users({
            from: r.sessions.userId,
            to: r.users.id,
        }),
    },
    accounts: {
        user: r.one.users({
            from: r.accounts.userId,
            to: r.users.id,
        }),
    },
}))