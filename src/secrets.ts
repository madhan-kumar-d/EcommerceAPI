import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
export const PORT = process.env.PORT || 3000;
export const JWTTOKEN = process.env.JWTTOKEN!;
