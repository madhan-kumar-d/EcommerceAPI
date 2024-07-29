import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
const secrets = {
  PORT: process.env.PORT || 3000,
  JWT_TOKEN: process.env.JWT_TOKEN!,
  JWT_EXPIRY: process.env.JWT_EXPIRY!,
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY!,
  UUID_V5_NAMESPACE: process.env.UUID_V5_NAMESPACE!,
  MAILER_HOST: process.env.MAILER_HOST!,
  MAILER_PORT: process.env.MAILER_PORT!,
  MAILER_SECURE: process.env.MAILER_SECURE!,
  MAILER_USER: process.env.MAILER_USER!,
  MAILER_PASSWORD: process.env.MAILER_PASSWORD!,
  MAILER_FROM: process.env.MAILER_FROM!,
  MAILER_FROM_NAME: process.env.MAILER_FROM_NAME!,
  COMPANY_NAME: process.env.COMPANY_NAME,
  COMPANY_SLOGAN: process.env.COMPANY_SLOGAN,
  COMPANY_ADDRESS: process.env.COMPANY_ADDRESS,
  ORDER_EMAIL_SUBJECT: process.env.ORDER_EMAIL_SUBJECT!,
  ORDER_UPDATE_EMAIL_SUBJECT: process.env.ORDER_UPDATE_EMAIL_SUBJECT!,
};

export default secrets;
