import { Request, Response } from "express";
import * as authService from "./auth.service";
import { sendResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  sendResponse(res, 200, "Login successful", result);
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const result = await authService.registerUser(name, email, password);
  sendResponse(res, 201, "Registration successful", result);
});

export const getMe = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await authService.getCurrentUser(req.user!.userId);
    sendResponse(res, 200, "Authenticated user fetched", user);
  },
);
