import { z } from 'zod';
import { PRODUCT_CATEGORIES } from '../models/Product.js';

const hexColor = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const baseFields = {
  name: z.string().trim().min(1, 'Name is required').max(120),
  batch: z.string().trim().max(30).optional(),
  category: z.enum(PRODUCT_CATEGORIES, {
    errorMap: () => ({ message: `Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}` }),
  }),
  price: z.number({ invalid_type_error: 'Price must be a number' }).nonnegative('Price cannot be negative'),
  volume: z.string().trim().min(1, 'Volume is required'),
  abv: z.string().trim().min(1, 'ABV is required'),
  color: z.string().regex(hexColor, 'Color must be a valid hex code').optional(),
  image: z.string().trim().url('Image must be a valid URL'),
  description: z.string().trim().min(1, 'Description is required').max(600),
};

export const createProductSchema = z.object(baseFields).strict();

// All fields optional for PATCH-style partial updates, but at least one required.
export const updateProductSchema = z
  .object(baseFields)
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  });

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().trim().max(120).optional(),
  category: z.enum(PRODUCT_CATEGORIES).optional(),
  sort: z.string().trim().optional().default('-createdAt'),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
});
