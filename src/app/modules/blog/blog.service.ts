
import { Status, type TBlog } from './blog.interface.js';
import { blogModel } from './blog.model.js';
import { deleteImageFromCloudinary } from '../../config/cloudinary.config.js';

// Delete Cloudinary images safely
const cleanupCloudinaryImages = async (imageUrls: string[]) => {
  const validUrls = imageUrls.filter(
    (url) =>
      typeof url === 'string' &&
      url.includes('res.cloudinary.com'),
  );

  if (!validUrls.length) return;

  const results = await Promise.allSettled(
    validUrls.map((url) => deleteImageFromCloudinary(url)),
  );

  // Cleanup failures should not undo a successful database operation.
  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error('Cloudinary image cleanup failed:', result.reason);
    }
  });
};

// Create Blog
const createBlog = async (blog: TBlog) => {
  const result = await blogModel.create(blog);
  return result;
};

// Get All Blogs
const getAllBlog = async () => {
  const result = await blogModel.find();
  return result;
};

// Get All Published Blogs
const getAllBlogByStatus = async () => {
  const result = await blogModel.find({
    status: {
      $nin: [Status.draft],
    },
  });

  return result;
};

// Get Single Blog
const getSingleBlog = async (id: string) => {
  const result = await blogModel.findById(id);
  return result;
};

// Get Single Blog By Slug
const getSingleBlogBySlug = async (slug: string) => {
  const result = await blogModel.findOne({ slug });
  return result;
};

// Update Blog
const updateSingleBlog = async (
  id: string,
  updateData: Partial<TBlog>,
) => {
  // Get existing blog before updating
  const existingBlog = await blogModel.findById(id);

  if (!existingBlog) {
    return null;
  }

  // Update blog in MongoDB
  const result = await blogModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!result) {
    return null;
  }

  const oldImagesToDelete: string[] = [];

  // Check whether the main image was replaced
  if (
    updateData.image &&
    existingBlog.image &&
    existingBlog.image !== updateData.image
  ) {
    oldImagesToDelete.push(existingBlog.image);
  }

  // Check whether gallery images were replaced
  if (
    updateData.images &&
    Array.isArray(updateData.images)
  ) {
    const newImages = updateData.images;

    const replacedImages = (existingBlog.images ?? []).filter(
      (oldImage) => !newImages.includes(oldImage),
    );

    oldImagesToDelete.push(...replacedImages);
  }

  // Delete old images after successful database update
  await cleanupCloudinaryImages(oldImagesToDelete);

  return result;
};

// Update Blog Status
const updateBlogStatus = async (
  id: string,
  status: 'draft' | 'published',
) => {
  const result = await blogModel.findByIdAndUpdate(
    id,
    {
      $set: {
        status,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

// Delete Blog
const deleteSingleBlog = async (id: string) => {
  // Get and delete blog from MongoDB
  const result = await blogModel.findByIdAndDelete(id);

  if (!result) {
    return null;
  }

  // Collect main and gallery images
  const imagesToDelete = [
    result.image,
    ...(result.images || []),
  ].filter((image): image is string => Boolean(image));

  // Delete associated Cloudinary images
  await cleanupCloudinaryImages(imagesToDelete);

  return result;
};

export const blogService = {
  createBlog,
  getAllBlog,
  getAllBlogByStatus,
  getSingleBlog,
  getSingleBlogBySlug,
  updateSingleBlog,
  updateBlogStatus,
  deleteSingleBlog,
};
