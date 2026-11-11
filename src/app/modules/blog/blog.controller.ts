
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status-codes';
import { blogService } from './blog.service.js';
import { uploadBufferToCloudinary } from '../../config/cloudinary.config.js';

// Helper: get uploaded files
const getBlogFiles = (req: Request) => {
  return (req.files || {}) as {
    image?: Express.Multer.File[];
    images?: Express.Multer.File[];
  };
};

// Helper: parse blog body
const parseBlogData = (body: any) => {
  const blogData = { ...body };

  if (typeof blogData.tags === 'string') {
    blogData.tags = blogData.tags
      ? JSON.parse(blogData.tags)
      : [];
  }

  return blogData;
};

// Create Blog
const createBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = getBlogFiles(req);

    const blog = parseBlogData(req.body);

    // Upload main image
    if (!files.image?.[0]) {
      throw new Error('Blog main image is required');
    }

    const imageUpload = await uploadBufferToCloudinary(
      files.image[0].buffer,
      files.image[0].originalname,
      'blogs',
    );

    // Upload gallery images
    const imagesUpload = files.images?.length
      ? await Promise.all(
          files.images.map((file) =>
            uploadBufferToCloudinary(
              file.buffer,
              file.originalname,
              'blogs/gallery',
            ),
          ),
        )
      : [];

    const result = await blogService.createBlog({
      ...blog,
      image: imageUpload.secure_url,
      images: imagesUpload.map((image) => image.secure_url),
    });

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Blog Created Successfully',
      data: result,
    });
  },
);

// Get All Blogs
const getAllBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await blogService.getAllBlog();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get all blogs successfully',
      data: result,
    });
  },
);

// Get All Published Blogs
const getAllBlogByStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await blogService.getAllBlogByStatus();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get all published blogs successfully',
      data: result,
    });
  },
);

// Get Single Blog
const getSingleBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await blogService.getSingleBlog(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get single blog successfully',
      data: result,
    });
  },
);

// Get Single Blog By Slug
const getSingleBlogBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const result = await blogService.getSingleBlogBySlug(slug as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Get single blog by slug successfully',
      data: result,
    });
  },
);

// Update Blog
const updateSingleBlog = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const files = getBlogFiles(req);

    const updateData = parseBlogData(req.body);

    // Upload new main image only if provided
    if (files.image?.[0]) {
      const imageUpload = await uploadBufferToCloudinary(
        files.image[0].buffer,
        files.image[0].originalname,
        'blogs',
      );

      updateData.image = imageUpload.secure_url;
    }

    // Upload new gallery images only if provided
    if (files.images?.length) {
      const imagesUpload = await Promise.all(
        files.images.map((file) =>
          uploadBufferToCloudinary(
            file.buffer,
            file.originalname,
            'blogs/gallery',
          ),
        ),
      );

      updateData.images = imagesUpload.map(
        (image) => image.secure_url,
      );
    }

    const result = await blogService.updateSingleBlog(
      id as string,
      updateData,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Blog updated successfully',
      data: result,
    });
  },
);

// Update Blog Status
const updateBlogStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await blogService.updateBlogStatus(
      id as string,
      status,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Blog status updated successfully',
      data: result,
    });
  },
);

// Delete Blog
const deleteSingleBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await blogService.deleteSingleBlog(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Delete single blog successfully',
      data: result,
    });
  },
);

export const blogController = {
  createBlog,
  getAllBlog,
  getAllBlogByStatus,
  getSingleBlog,
  getSingleBlogBySlug,
  updateSingleBlog,
  updateBlogStatus,
  deleteSingleBlog,
};
