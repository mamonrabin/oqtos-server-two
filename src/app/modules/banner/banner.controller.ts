
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status-codes";
import { bannerService } from "./banner.service.js";

import {
  uploadBufferToCloudinary,
} from "../../config/cloudinary.config.js";

// ============================================
// CREATE BANNER
// ============================================

const createBanner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const banner = req.body;

    if (!req.file) {
      throw new Error("Banner image is required");
    }

    // Upload image to Cloudinary
    const uploadedImage = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.originalname,
      "banners",
    );

    const result = await bannerService.createBanner({
      ...banner,
      image: uploadedImage.secure_url,
    });

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Banner created successfully",
      data: result,
    });
  },
);

// ============================================
// GET ALL BANNERS
// ============================================

const getAllBanner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await bannerService.getAllBanner();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get all banners successfully",
      data: result,
    });
  },
);

// ============================================
// GET ALL ACTIVE BANNERS
// ============================================

const getAllActiveBanner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await bannerService.getActiveAllBanner();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get all active banners successfully",
      data: result,
    });
  },
);

// ============================================
// UPDATE BANNER
// ============================================

const updateSingleBanner = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const updateBanner = { ...req.body };

    // Upload new image only if provided
    if (req.file) {
      const uploadedImage = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname,
        "banners",
      );

      updateBanner.image = uploadedImage.secure_url;
    }

    const result = await bannerService.updateSingleBanner(
      id as string,
      updateBanner,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Banner updated successfully",
      data: result,
    });
  },
);

// ============================================
// DELETE BANNER
// ============================================

const deleteSingleBanner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await bannerService.deleteSingleBanner(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Delete single banner successfully",
      data: result,
    });
  },
);

// ============================================
// EXPORT
// ============================================

export const bannerController = {
  createBanner,
  getAllBanner,
  getAllActiveBanner,
  updateSingleBanner,
  deleteSingleBanner,
};
