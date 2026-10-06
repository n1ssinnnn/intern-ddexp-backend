import { defineConfig } from '../../app/node_modules/drizzle-kit';

export default defineConfig({
    out: './packages/db/drizzle',
    schema: './packages/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    migrations: {
        schema: 'public',
    },
});
