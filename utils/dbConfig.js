import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
const sql = neon('postgresql://neondb_owner:npg_dfbou3lEJIn7@ep-still-block-a717as7r-pooler.ap-southeast-2.aws.neon.tech/PennyWise?sslmode=require&channel_binding=require');

export const db = drizzle(sql,{schema});