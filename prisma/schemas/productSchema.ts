import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  price: z.number().positive('Price must be a positive number'),
  situation: z.boolean(),
});

export const updateProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  price: z.number().positive('Price must be a positive number').optional(),
  situation: z.boolean().optional(),
});

export const updateProductCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Category name is required'),
});

export const updateProductImageSchema = z.object({
  productId: z.string().uuid(),
  imagePath: z.string()
});