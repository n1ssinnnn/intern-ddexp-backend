import '../../app/node_modules/dotenv/dist/config';
import { drizzle } from '../../app/node_modules/drizzle-orm/node-postgres';

export const db = drizzle(process.env.DATABASE_URL!);
