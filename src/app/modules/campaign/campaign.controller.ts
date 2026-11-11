/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */

import type { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { campaignService } from './campaign.service.js';
import { uploadBufferToCloudinary } from '../../config/cloudinary.config.js';

// Parse campaign body
const parseCampaignData = (body: any) => {
  const campaign = { ...body };

  if (typeof campaign.products === 'string') {
    campaign.products = campaign.products
      ? JSON.parse(campaign.products)
      : [];
  }

  return campaign;
};

// Create Campaign
const createCampaign = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const campaign = parseCampaignData(req.body);

    if (!req.file) {
      throw new Error('Campaign image is required');
    }

    const imageUpload = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.originalname,
      'campaigns',
    );

    const result = await campaignService.createCampaign({
      ...campaign,
      image: imageUpload.secure_url,
    });

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Campaign Created Successfully',
      data: result,
    });
  },
);

// Get All Campaigns
const getAllCampaign = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await campaignService.getAllCampaign();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get all campaigns successfully',
      data: result,
    });
  },
);

// Get Flash Sale
const getFlashSale = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await campaignService.getflashSale();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Flash sale fetched successfully',
      data: result,
    });
  },
);

// Get Single Campaign
const getSingleCampaign = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await campaignService.getSingleCampaign(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get single campaign successfully',
      data: result,
    });
  },
);

// Update Campaign
const updateSingleCampaign = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const updateCampaign = parseCampaignData(req.body);

    // Upload new image only if provided
    if (req.file) {
      const imageUpload = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname,
        'campaigns',
      );

      updateCampaign.image = imageUpload.secure_url;
    }

    const result = await campaignService.updateSingleCampaign(
      id as string,
      updateCampaign,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Campaign updated successfully',
      data: result,
    });
  },
);

// Delete Campaign
const deleteSingleCampaign = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await campaignService.deleteSingleCampaign(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Delete single campaign successfully',
      data: result,
    });
  },
);

export const campaignController = {
  createCampaign,
  getAllCampaign,
  getFlashSale,
  getSingleCampaign,
  updateSingleCampaign,
  deleteSingleCampaign,
};
