import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  limit: 100,
  message: 'Limit Reached',
  statusCode: 429,
  legacyHeaders: false,
  standardHeaders: 'draft-7',
});
