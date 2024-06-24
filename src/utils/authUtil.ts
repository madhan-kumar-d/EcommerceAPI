import { Request } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { prismaClient } from '..';
import secrets from '../secrets';
import { v5 as uuid } from 'uuid';

export const hashToken = (token: string) => {
  // use createHash/createHmac or other encryption methods based on needs
  return crypto.createHash('sha512').update(token).digest('hex');
};

export const generateRefreshToken = async (userId: number, req: Request) => {
  const time = new Date().getTime();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + parseInt(secrets.JWT_REFRESH_EXPIRY));
  const refreshToken = uuid(
    time + userId.toString(),
    secrets.UUID_V5_NAMESPACE,
  );
  // Can generate one more jwt token and verify it after generating the token
  const refreshTokenHash = hashToken(refreshToken);
  await prismaClient.tokens.create({
    data: {
      token: refreshTokenHash,
      userId: userId,
      userAgent: req.userAgent,
      ipAddress: req.clientIp,
      expiresAt,
    },
  });
  return refreshToken;
};

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, secrets.JWT_TOKEN, {
    algorithm: 'HS512',
    expiresIn: secrets.JWT_EXPIRY,
  });
};
