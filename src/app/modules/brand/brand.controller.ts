
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { brandService } from './brand.service.js';
import { uploadBufferToCloudinary } from '../../config/cloudinary.config.js';

// Create Brand
const createBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new Error('Brand image is required');
    }

    const imageUpload = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.originalname,
      'brands',
    );

    const result = await brandService.createBrand({
      ...req.body,
      image: imageUpload.secure_url,
    });

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Brand Created Successfully',
      data: result,
    });
  },
);

// Get All Brands Without Builder
const getAllBrandWithoutBuilder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await brandService.getAllBrandWithoutBuilder();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get all brands successfully',
      data: result,
    });
  },
);

// Get All Brands
const getAllBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await brandService.getAllBrand(
      query as Record<string, string>,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get all brands successfully',
      data: result,
    });
  },
);

// Get All Active Brands
const getAllActiveBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await brandService.getActiveAllBrand();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get all active brands successfully',
      data: result,
    });
  },
);

// Get Single Brand
const getSingleBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await brandService.getSingleBrand(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get single brand successfully',
      data: result,
    });
  },
);

// Get Single Brand By Slug
const getSingleBrandBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const result = await brandService.getSingleBrandBySlug(
      slug as string,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get single brand by slug successfully',
      data: result,
    });
  },
);

// Update Brand
const updateSingleBrand = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateBrand = { ...req.body };

    // Upload new image only when provided
    if (req.file) {
      const imageUpload = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname,
        'brands',
      );

      updateBrand.image = imageUpload.secure_url;
    }

    const result = await brandService.updateSingleBrand(
      id as string,
      updateBrand,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Brand updated successfully',
      data: result,
    });
  },
);

// Delete Brand
const deleteSingleBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await brandService.deleteSingleBrand(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Delete single brand successfully',
      data: result,
    });
  },
);

export const brandController = {
  createBrand,
  getAllBrandWithoutBuilder,
  getAllBrand,
  getAllActiveBrand,
  getSingleBrand,
  getSingleBrandBySlug,
  updateSingleBrand,
  deleteSingleBrand,
};
