import { drizzle } from 'drizzle-orm/node-postgres';
import { relations } from './relations';

if (!process.env.DATABASE_URL) {
    console.log('env has value', process.env.DATABASE_URL ? 'found' : 'missing')
    throw new Error("Database url not have value")
}

export const db = drizzle(process.env.DATABASE_URL, { relations });
