
import express from 'express';

import upload from '../../utils/ImgUploder.js';
import { blogController } from './blog.controller.js';

const router = express.Router();

// Blog image upload middleware
const blogImageUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);

// Create blog
router.post(
  '/create-blog',
  blogImageUpload,
  blogController.createBlog,
);

// Get blogs
router.get('/', blogController.getAllBlog);
router.get('/published', blogController.getAllBlogByStatus);

// Get blog by slug
router.get('/blogSlug/:slug', blogController.getSingleBlogBySlug);

// Get blog by ID
router.get('/:id', blogController.getSingleBlog);

// Update blog status
router.patch('/:id/status', blogController.updateBlogStatus);

// Update blog
router.put(
  '/:id',
  blogImageUpload,
  blogController.updateSingleBlog,
);

// Delete blog
router.delete('/:id', blogController.deleteSingleBlog);

export const blogRoutes = router;
