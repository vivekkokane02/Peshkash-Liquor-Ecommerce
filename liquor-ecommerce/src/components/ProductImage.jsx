import React, { useState } from 'react';

export default function ProductImage({ product, className = '', priority = false }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`product-photo relative overflow-hidden ${className}`}>
      {!failed && (
        <img
          src={product.image}
          alt={`${product.name} ${product.category} bottle`}
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
        />
      )}
      {failed && (
        <div
          className="h-full w-full flex items-center justify-center text-center px-8"
          style={{ backgroundColor: product.color }}
        >
          <span className="font-display text-xl text-ink">{product.name}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
