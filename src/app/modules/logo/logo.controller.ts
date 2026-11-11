
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { logoService } from './logo.service.js';
import { uploadBufferToCloudinary } from '../../config/cloudinary.config.js';

// Get uploaded logo files
const getLogoFiles = (req: Request) => {
  return (req.files || {}) as {
    headerLogo?: Express.Multer.File[];
    footerLogo?: Express.Multer.File[];
  };
};

// Create Logo
const createLogo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = getLogoFiles(req);
    const logo = { ...req.body };

    // Upload header logo
    const headerLogoUpload = files.headerLogo?.[0]
      ? await uploadBufferToCloudinary(
          files.headerLogo[0].buffer,
          files.headerLogo[0].originalname,
          'logos/header',
        )
      : null;

    // Upload footer logo
    const footerLogoUpload = files.footerLogo?.[0]
      ? await uploadBufferToCloudinary(
          files.footerLogo[0].buffer,
          files.footerLogo[0].originalname,
          'logos/footer',
        )
      : null;

    const result = await logoService.createLogo({
      ...logo,
      headerLogo: headerLogoUpload?.secure_url || '',
      footerLogo: footerLogoUpload?.secure_url || '',
    });

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Logo created successfully',
      data: result,
    });
  },
);

// Get All Logo
const getAllLogo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await logoService.getAllLogo();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get all logos successfully',
      data: result,
    });
  },
);

// Update Logo
const updateSingleLogo = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateLogo = { ...req.body };

    const files = getLogoFiles(req);

    // Upload new header logo if provided
    if (files.headerLogo?.[0]) {
      const headerLogoUpload = await uploadBufferToCloudinary(
        files.headerLogo[0].buffer,
        files.headerLogo[0].originalname,
        'logos/header',
      );

      updateLogo.headerLogo = headerLogoUpload.secure_url;
    }

    // Upload new footer logo if provided
    if (files.footerLogo?.[0]) {
      const footerLogoUpload = await uploadBufferToCloudinary(
        files.footerLogo[0].buffer,
        files.footerLogo[0].originalname,
        'logos/footer',
      );

      updateLogo.footerLogo = footerLogoUpload.secure_url;
    }

    const result = await logoService.updateSingleLogo(
      id as string,
      updateLogo,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Logo updated successfully',
      data: result,
    });
  },
);

// Delete Logo
const deleteSingleLogo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await logoService.deleteSingleLogo(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Delete single logo successfully',
      data: result,
    });
  },
);

export const logoController = {
  createLogo,
  getAllLogo,
  updateSingleLogo,
  deleteSingleLogo,
};
