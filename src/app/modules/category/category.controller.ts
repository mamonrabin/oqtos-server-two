/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Request, Response, NextFunction } from "express";
import { categoryService } from "./category.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status-codes";

import {
  uploadBufferToCloudinary,
  deleteImageFromCloudinary,
} from "../../config/cloudinary.config.js";
import { bannerService } from "../banner/banner.service.js";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = req.body;

    if (!req.file) {
      throw new Error("Category image is required");
    }

    // Upload image to Cloudinary
    const uploadedImage = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.originalname,
      "categories",
    );

    const result = await categoryService.createCategory({
      ...category,
      image: uploadedImage.secure_url,
    });

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category Created Successfully",
      data: result,
    });
  },
);

const getAllCategoryWithOutBuilder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getAllCategoryWithOutBuilder();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get all category successfully",
      data: result,
    });
  },
);

const getAllCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await categoryService.getAllCategory(
      query as Record<string, string>,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get all category successfully",
      data: result,
    });
  },
);

const getSingleCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await categoryService.getSingleCategory(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get single category successfully",
      data: result,
    });
  },
);

const getSingleCategoryBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const result = await categoryService.getSingleCategoryBySlug(
      slug as string,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get single category by slug successfully",
      data: result,
    });
  },
);

const updateSingleCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateCategory = req.body;

    // Upload new image if provided
    if (req.file) {
      const uploadedImage = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname,
        "categories",
      );

      updateCategory.image = uploadedImage.secure_url;
    }

    const result = await categoryService.updateSingleCategory(
      id as string,
      updateCategory,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category Updated Successfully",
      data: result,
    });
  },
);

const deleteSingleCategory = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await categoryService.deleteSingleCategory(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Delete single category successfully",
      data: result,
    });
  },
);

export const categoryController = {
  createCategory,
  getAllCategory,
  getAllCategoryWithOutBuilder,
  getSingleCategory,
  getSingleCategoryBySlug,
  updateSingleCategory,
  deleteSingleCategory,
};
