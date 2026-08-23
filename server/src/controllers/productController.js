import * as productService from '../services/productService.js';
import { sendResponse } from '../utils/sendResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  sendResponse(res, { statusCode: 201, message: 'Product created successfully', data: product });
});

export const listProducts = asyncHandler(async (req, res) => {
  const { data, meta } = await productService.listProducts(req.query);
  sendResponse(res, { message: 'Products retrieved successfully', data, meta });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  sendResponse(res, { message: 'Product retrieved successfully', data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  sendResponse(res, { message: 'Product updated successfully', data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  sendResponse(res, { message: 'Product deleted successfully', data: null });
});
