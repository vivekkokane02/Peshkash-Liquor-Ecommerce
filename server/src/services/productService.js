import { Product } from '../models/Product.js';
import { AppError } from '../utils/AppError.js';

export async function createProduct(payload) {
  const product = await Product.create(payload);
  return product;
}

export async function listProducts({ page, limit, search, category, sort, minPrice, maxPrice }) {
  const filter = { isActive: true };

  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v')
      .lean(), // read-only query: skip Mongoose document overhead
    Product.countDocuments(filter),
  ]);

  // .lean() skips the toJSON transform, so map _id -> id manually here.
  const data = items.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function getProductById(id) {
  const product = await Product.findOne({ _id: id, isActive: true });
  if (!product) {
    throw new AppError('Product not found', 404, 'RESOURCE_NOT_FOUND');
  }
  return product;
}

export async function updateProduct(id, updates) {
  const product = await Product.findOneAndUpdate(
    { _id: id, isActive: true },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  );
  if (!product) {
    throw new AppError('Product not found', 404, 'RESOURCE_NOT_FOUND');
  }
  return product;
}

// Soft delete — see architectural note in models/Product.js.
export async function deleteProduct(id) {
  const product = await Product.findOneAndUpdate(
    { _id: id, isActive: true },
    { $set: { isActive: false } },
    { new: true }
  );
  if (!product) {
    throw new AppError('Product not found', 404, 'RESOURCE_NOT_FOUND');
  }
  return product;
}
