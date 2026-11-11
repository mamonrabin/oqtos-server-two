
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import config from "./index.js";
import AppError from "../helpers/AppError.js";

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name as string,
  api_key: config.cloudinary_api_key as string,
  api_secret: config.cloudinary_api_secret as string,
});

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  fileName: string,
  folder = "images",
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const publicId = `${Date.now()}-${fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder,
        public_id: publicId,
      },
      (error, result) => {
        if (error) {
          return reject(
            new AppError(500, `Cloudinary upload failed: ${error.message}`),
          );
        }

        if (!result) {
          return reject(new AppError(500, "Cloudinary returned no result"));
        }

        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
};

export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split("/");

    const uploadIndex = pathParts.indexOf("upload");

    if (uploadIndex === -1) {
      throw new Error("Invalid Cloudinary URL");
    }

    const publicId = pathParts
      .slice(uploadIndex + 1)
      .filter((part) => !/^v\d+$/.test(part))
      .join("/")
      .replace(/\.[^/.]+$/, "");

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    return result;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new AppError(
      500,
      `Cloudinary image deletion failed: ${error.message}`,
    );
  }
};

export const cloudinaryUpload = cloudinary;
