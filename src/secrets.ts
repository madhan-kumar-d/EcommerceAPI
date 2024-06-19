import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
const secrets = {
  PORT: process.env.PORT || 3000,
  JWT_TOKEN: process.env.JWT_TOKEN!,
  JWT_EXPIRY: process.env.JWT_EXPIRY!,
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY!,
  UUID_V5_NAMESPACE: process.env.UUID_V5_NAMESPACE!,
};

export default secrets;
