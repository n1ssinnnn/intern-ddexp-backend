import { drizzle } from 'drizzle-orm/node-postgres';
import { relations } from './relations';
import { config } from '../infra/config';


export const db = drizzle(config.DATABASE_URL, { relations });
