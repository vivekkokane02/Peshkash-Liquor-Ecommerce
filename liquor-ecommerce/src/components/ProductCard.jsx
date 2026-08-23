import React from 'react';
import { Link } from 'react-router-dom';
import ProductImage from './ProductImage.jsx';

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card group block bg-surface border border-white/10 hover:border-gold/40 transition-colors"
    >
      <div className="product-image h-64 bg-surface2 relative">
        <ProductImage product={product} className="w-full h-full" />
        <span className="absolute top-4 left-4 text-[9px] uppercase tracking-widest2 text-gold border border-gold/30 px-2 py-1">
          Reserve select
        </span>
        <span className="absolute bottom-3 right-4 text-[10px] text-stone">View detail &#8594;</span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest2 text-stone mb-2">
          <span>{product.category}</span>
          <span className="text-gold">{product.batch}</span>
        </div>
        <h3 className="font-display text-xl text-bone mb-1">{product.name}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-bone">&#8377;{product.price.toLocaleString('en-IN')}</span>
          <span className="text-xs text-stone">{product.volume}</span>
        </div>
      </div>
    </Link>
  );
}
