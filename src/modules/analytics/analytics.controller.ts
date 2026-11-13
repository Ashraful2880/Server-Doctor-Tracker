import { Request, Response } from "express";
import { sendResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import * as analyticsService from "./analytics.service";

export const getDashboardAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await analyticsService.getDashboardAnalytics({
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
    });
    sendResponse(
      res,
      200,
      "Dashboard analytics fetched successfully",
      analytics,
    );
  },
);
