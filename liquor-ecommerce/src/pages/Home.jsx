import React, { useState, useEffect } from 'react';
import { listProducts } from '../services/productService.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductImage from '../components/ProductImage.jsx';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const categories = ['All', 'Beer', 'Whiskey', 'Vodka', 'Rum', 'Tequila', 'Gin', 'Brandy'];

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    listProducts({ limit: 100, sort: '-createdAt' })
      .then(({ data }) => {
        if (cancelled) return;
        setProducts(data);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMessage(err.message);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const matchesCategory = (product, category) => {
    if (category === 'Whiskey') return product.category.includes('Whisky');
    if (category === 'Rum') return product.category.includes('Rum');
    return product.category === category;
  };
  const filteredProducts = products.filter((product) => {
    if (selectedCategory === 'All') return true;
    return matchesCategory(product, selectedCategory);
  });

  if (status === 'loading') {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 text-center text-stone">
        Loading the catalog&hellip;
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 text-center text-stone">
        <p className="mb-4">Couldn't load the catalog: {errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="premium-button px-5 py-2 bg-gold text-ink text-xs uppercase tracking-widest2 font-semibold hover:bg-goldSoft transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <section className="hero-shell max-w-6xl mx-auto px-6 pt-14 pb-20 grid md:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-20 items-center">
        <div className="hero-copy">
          <div className="eyebrow mb-5"><span /> Est. Small Batch Catalog</div>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-bone mb-6">
            Spirits, poured
            <br />
            with proof.
          </h1>
          <p className="text-stone text-sm leading-relaxed max-w-md mb-9">
            Eight bottles, chosen carefully. Every order is age-verified through DigiLocker before it
            ships, and checked again at your door.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#catalog" className="premium-button px-6 py-3 bg-gold text-ink text-xs uppercase tracking-widest2 font-semibold hover:bg-goldSoft transition-colors">
              View Catalog <span aria-hidden="true">&#8594;</span>
            </a>
            <span className="text-[10px] uppercase tracking-widest2 text-stone">21+ verified delivery</span>
          </div>
          <div className="hero-stats mt-12 pt-5 border-t border-white/10 flex gap-8">
            <div><strong>08</strong><span>Curated bottles</span></div>
            <div><strong>12+</strong><span>Years aged</span></div>
            <div><strong>21+</strong><span>Age verified</span></div>
          </div>
        </div>
        <div className="hero-vessel h-80 md:h-[27rem] bg-surface border border-white/10">
          {products[0] && <ProductImage product={products[0]} priority className="w-full h-full" />}
        </div>
      </section>

      <div className="foil-rule max-w-6xl mx-auto" />

      <section id="catalog" className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <div className="eyebrow mb-3"><span /> The collection</div>
            <h2 className="font-display text-3xl text-bone">The Catalog</h2>
          </div>
          <span className="catalog-count"><b>01</b> / {String(products.length).padStart(2, '0')} bottles</span>
        </div>
        <div className="category-strip mb-10" role="tablist" aria-label="Shop by category">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              className={`category-tab ${selectedCategory === category ? 'is-active' : ''}`}
            >
              {category}
              {category !== 'All' && <span>{products.filter((product) => matchesCategory(product, category)).length}</span>}
            </button>
          ))}
        </div>
        {filteredProducts.length === 0 ? (
          <p className="text-stone text-sm py-10 text-center">No bottles in this category yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
