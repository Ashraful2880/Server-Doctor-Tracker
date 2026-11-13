import { createHttpError } from '../utils/apiResponse';
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Authentication required. Missing Bearer token.'));
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return next(createHttpError(401, 'Authentication required. Invalid token format.'));
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(createHttpError(401, 'Invalid or expired authentication token.'));
  }
};

