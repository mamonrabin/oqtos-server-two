/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */

import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync.js";
import { productService } from "./product.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import type { ProductLabel } from "./product.interface.js";

import {
  uploadBufferToCloudinary,
} from "../../config/cloudinary.config.js";

// ============================================
// Helper: Get Multer files
// ============================================

type ProductFiles = {
  thumbnailImage?: Express.Multer.File[];
  backviewImage?: Express.Multer.File[];
  images?: Express.Multer.File[];
};

const getProductFiles = (req: Request): ProductFiles => {
  return (req.files || {}) as ProductFiles;
};

// ============================================
// Helper: Parse JSON fields
// ============================================

const parseProductData = (data: any) => {
  const productData = { ...data };

  if (productData.inventories) {
    productData.inventories =
      typeof productData.inventories === "string"
        ? JSON.parse(productData.inventories)
        : productData.inventories;
  }

  if (productData.specifications) {
    productData.specifications =
      typeof productData.specifications === "string"
        ? JSON.parse(productData.specifications)
        : productData.specifications;
  }

  if (productData.tags) {
    productData.tags =
      typeof productData.tags === "string"
        ? JSON.parse(productData.tags)
        : productData.tags;
  }

  if (productData.freeShipping !== undefined) {
    productData.freeShipping =
      productData.freeShipping === true ||
      productData.freeShipping === "true";
  }

  return productData;
};

// ============================================
// CREATE PRODUCT
// ============================================

const createProduct = catchAsync(
  async (req: Request, res: Response) => {
    const files = getProductFiles(req);

    const thumbnailFile = files.thumbnailImage?.[0];
    const backviewFile = files.backviewImage?.[0];
    const galleryFiles = files.images || [];

    if (!thumbnailFile) {
      throw new Error("Product thumbnail image is required");
    }

    const productData = parseProductData(req.body);

    // Upload all images to Cloudinary
    const [thumbnailUpload, backviewUpload, galleryUploads] =
      await Promise.all([
        uploadBufferToCloudinary(
          thumbnailFile.buffer,
          thumbnailFile.originalname,
          "products",
        ),

        backviewFile
          ? uploadBufferToCloudinary(
              backviewFile.buffer,
              backviewFile.originalname,
              "products",
            )
          : Promise.resolve(null),

        Promise.all(
          galleryFiles.map((file) =>
            uploadBufferToCloudinary(
              file.buffer,
              file.originalname,
              "products",
            ),
          ),
        ),
      ]);

    const result = await productService.createProduct({
      ...productData,
      thumbnailImage: thumbnailUpload.secure_url,
      backviewImage: backviewUpload?.secure_url || "",
      images: galleryUploads.map((image) => image.secure_url),
    });

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Product created successfully",
      data: result,
    });
  },
);

// ============================================
// GET ALL PRODUCTS WITHOUT BUILDER
// ============================================

const getAllProductWithoutBuilder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await productService.getAllProductWithoutBuilder();

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get all products successfully",
      data: result,
    });
  },
);

// ============================================
// GET ALL PRODUCTS
// ============================================

const getAllProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await productService.getAllProduct(
      query as Record<string, string>,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get all products successfully",
      data: result,
    });
  },
);

// ============================================
// RELATED PRODUCTS
// ============================================

const getReletiveProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const limit = req.query.limit ? Number(req.query.limit) : 8;

    const result = await productService.getRelatedProducts(
      id as string,
      limit,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get related products successfully",
      data: result,
    });
  },
);

// ============================================
// DISCOUNT PRODUCTS
// ============================================

const getDiscountProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const limit = req.query.limit ? Number(req.query.limit) : 8;

    const result = await productService.getDiscountProducts(limit);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get discount products successfully",
      data: result,
    });
  },
);

// ============================================
// NEW ARRIVAL PRODUCTS
// ============================================

const getNewArrivalProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const limit = req.query.limit ? Number(req.query.limit) : 8;

    const result = await productService.getNewArrivalProducts(limit);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get new arrival products successfully",
      data: result,
    });
  },
);

// ============================================
// PRODUCTS BY CATEGORY
// ============================================

const getProductsByCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await productService.getProductsByCategory(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get products by category successfully",
      data: result,
    });
  },
);

// ============================================
// PRODUCTS BY SUBCATEGORY
// ============================================

const getProductsBySubCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await productService.getProductsBySubCategory(
      id as string,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get products by sub-category successfully",
      data: result,
    });
  },
);

// ============================================
// PRODUCTS BY BRAND
// ============================================

const getProductsByBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await productService.getProductsByBrand(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get products by brand successfully",
      data: result,
    });
  },
);

// ============================================
// PRODUCTS BY LABELS
// ============================================

const getProductsByLabels = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { label } = req.params;

    const result = await productService.getProductsByLabels(
      label as ProductLabel,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get products by labels successfully",
      data: result,
    });
  },
);

// ============================================
// BEST SELLING PRODUCTS
// ============================================

const getBestSellingProducts = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 8;

  const result = await productService.getBestSellingProducts(limit);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Best selling products retrieved successfully",
    data: result,
  });
});

// ============================================
// TOP PRODUCTS
// ============================================

const getTopProducts = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 8;

  const result = await productService.getTopProducts(limit);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Top products retrieved successfully",
    data: result,
  });
});

// ============================================
// SINGLE PRODUCT
// ============================================

const getSingleProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await productService.getSingleProduct(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get single product successfully",
      data: result,
    });
  },
);

// ============================================
// SINGLE PRODUCT BY SLUG
// ============================================

const getSingleProductBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const result = await productService.getSingleProductBySlug(
      slug as string,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get single product by slug successfully",
      data: result,
    });
  },
);

// ============================================
// UPDATE PRODUCT
// ============================================

const updateSingleProduct = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const files = getProductFiles(req);

    const thumbnailFile = files.thumbnailImage?.[0];
    const backviewFile = files.backviewImage?.[0];
    const galleryFiles = files.images || [];

    const updateData = parseProductData(req.body);

    // Upload new thumbnail if provided
    if (thumbnailFile) {
      const uploaded = await uploadBufferToCloudinary(
        thumbnailFile.buffer,
        thumbnailFile.originalname,
        "products",
      );

      updateData.thumbnailImage = uploaded.secure_url;
    }

    // Upload new backview image if provided
    if (backviewFile) {
      const uploaded = await uploadBufferToCloudinary(
        backviewFile.buffer,
        backviewFile.originalname,
        "products",
      );

      updateData.backviewImage = uploaded.secure_url;
    }

    // Upload new gallery images if provided
    if (galleryFiles.length > 0) {
      const uploadedImages = await Promise.all(
        galleryFiles.map((file) =>
          uploadBufferToCloudinary(
            file.buffer,
            file.originalname,
            "products",
          ),
        ),
      );

      updateData.images = uploadedImages.map(
        (image) => image.secure_url,
      );
    }

    const result = await productService.updateSingleProduct(
      id as string,
      updateData,
    );

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Product updated successfully",
      data: result,
    });
  },
);

// ============================================
// DELETE PRODUCT
// ============================================

const deleteSingleProduct = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await productService.deleteSingleProduct(id as string);

    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Product deleted successfully",
      data: result,
    });
  },
);

// ============================================
// EXPORT CONTROLLER
// ============================================

export const productController = {
  createProduct,
  getAllProductWithoutBuilder,
  getAllProduct,
  getReletiveProduct,
  getDiscountProducts,
  getNewArrivalProducts,
  getProductsByCategory,
  getProductsBySubCategory,
  getProductsByBrand,
  getProductsByLabels,
  getBestSellingProducts,
  getTopProducts,
  getSingleProduct,
  getSingleProductBySlug,
  updateSingleProduct,
  deleteSingleProduct,
};
