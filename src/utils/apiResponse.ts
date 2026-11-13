import { Response } from "express";
import { PaginationMeta } from "./InterfaceAll";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: PaginationMeta,
): Response => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta }),
  });
};

export const createHttpError = (
  statusCode: number,
  message: string,
): Error & { statusCode: number } => {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  return error;
};
