import crypto from 'node:crypto';

export const hashToken = (token: string) => {
  // use createHash/createHmac or other encryption methods based on needs
  return crypto.createHash('sha512').update(token).digest('hex');
};
