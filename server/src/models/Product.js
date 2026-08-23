import mongoose from 'mongoose';

const { Schema } = mongoose;

const CATEGORIES = [
  'Beer',
  'Single Malt Whisky',
  'Blended Whisky',
  'Vodka',
  'Gin',
  'Dark Rum',
  'White Rum',
  'Tequila',
  'Cognac',
  'Brandy',
  'Wine',
];

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name must be at most 120 characters'],
    },
    batch: {
      type: String,
      trim: true,
      maxlength: [30, 'Batch label must be at most 30 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: '{VALUE} is not a supported category',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    volume: {
      type: String,
      required: [true, 'Volume is required'],
      trim: true,
    },
    abv: {
      type: String,
      required: [true, 'ABV is required'],
      trim: true,
    },
    color: {
      type: String,
      trim: true,
      match: [/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Color must be a valid hex code'],
      default: '#C9822B',
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [600, 'Description must be at most 600 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Search index (name/category/description) for the `search` query param
productSchema.index({ name: 'text', category: 'text', description: 'text' });
// Common list-query patterns: filter by category, sort by newest/price
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ price: 1 });
// Soft-delete support: list queries exclude isActive:false by default
productSchema.index({ isActive: 1 });

export const PRODUCT_CATEGORIES = CATEGORIES;
export const Product = mongoose.model('Product', productSchema);
