
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { NextFunction, Request, Response } from 'express';
import { reviewService } from './review.service.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { uploadBufferToCloudinary } from '../../config/cloudinary.config.js';

// Get uploaded review images
const getReviewFiles = (req: Request) => {
  return (req.files || {}) as {
    images?: Express.Multer.File[];
  };
};

// Create Review
const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = getReviewFiles(req);
    const data = { ...req.body };

    // Upload review images to Cloudinary
    const imageUploads = files.images?.length
      ? await Promise.all(
          files.images.map((file) =>
            uploadBufferToCloudinary(
              file.buffer,
              file.originalname,
              'reviews',
            ),
          ),
        )
      : [];

    const images = imageUploads.map((image) => image.secure_url);

    const result = await reviewService.createReview({
      ...data,
      images,
    });

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Review Created Successfully',
      data: result,
    });
  },
);

// Get Review
const getReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await reviewService.getReview();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get Reviews Successfully',
      data: result,
    });
  },
);

// Get Review By Status
const getReviewbyStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await reviewService.getReviewbyStatus();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get Reviews Successfully',
      data: result,
    });
  },
);

// Get All Reviews
const getAllReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await reviewService.getAllReview(
      query as Record<string, string>,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get All Reviews Successfully',
      data: result,
    });
  },
);

// Get Single Review
const getSingleReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await reviewService.getSingleReview(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get Single Review Successfully',
      data: result,
    });
  },
);

// Delete Review
const deleteSingleReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await reviewService.deleteSingleReview(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Delete Single Review Successfully',
      data: result,
    });
  },
);

// Update Review
const updateSingleReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = getReviewFiles(req);
    const updateData = { ...req.body };

    // Upload new images only if provided
    if (files.images?.length) {
      const imageUploads = await Promise.all(
        files.images.map((file) =>
          uploadBufferToCloudinary(
            file.buffer,
            file.originalname,
            'reviews',
          ),
        ),
      );

      // Replace existing images with new Cloudinary URLs
      updateData.images = imageUploads.map((image) => image.secure_url);
    }

    const result = await reviewService.updateSingleReview(
      req.params.id as string,
      updateData,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Review Updated Successfully',
      data: result,
    });
  },
);

export const reviewController = {
  createReview,
  getReview,
  getReviewbyStatus,
  getAllReview,
  getSingleReview,
  deleteSingleReview,
  updateSingleReview,
};
