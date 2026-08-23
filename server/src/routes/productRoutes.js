import { Router } from 'express';
import * as productController from '../controllers/productController.js';
import { validate } from '../middleware/validate.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import {
  createProductSchema,
  updateProductSchema,
  listProductsQuerySchema,
} from '../validators/productValidators.js';

const router = Router();

router
  .route('/')
  .get(validate(listProductsQuerySchema, 'query'), productController.listProducts)
  .post(validate(createProductSchema, 'body'), productController.createProduct);

router
  .route('/:id')
  .get(validateObjectId(), productController.getProduct)
  .patch(validateObjectId(), validate(updateProductSchema, 'body'), productController.updateProduct)
  .delete(validateObjectId(), productController.deleteProduct);

export default router;
