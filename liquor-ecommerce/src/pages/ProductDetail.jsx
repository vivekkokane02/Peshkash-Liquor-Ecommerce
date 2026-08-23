import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/productService.js';
import { ApiError } from '../services/apiClient.js';
import ProductImage from '../components/ProductImage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProductDetail({ onRequireAuth }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | success | error | not-found
  const { addItem } = useCart();
  const { user } = useAuth();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    getProduct(id)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setStatus('not-found');
        } else {
          setStatus('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === 'loading') {
    return <div className="max-w-6xl mx-auto px-6 py-20 text-center text-stone">Loading&hellip;</div>;
  }

  if (status === 'error') {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center text-stone">
        Couldn't load this bottle. <Link to="/" className="text-gold underline">Back to catalog</Link>
      </div>
    );
  }

  if (status === 'not-found' || !product) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center text-stone">
        Bottle not found. <Link to="/" className="text-gold underline">Back to catalog</Link>
      </div>
    );
  }

  const handleAdd = () => {
    if (!user?.verified) {
      onRequireAuth();
      return;
    }
    addItem(
      { id: product.id, name: product.name, price: product.price, color: product.color },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <Link to="/" className="text-xs text-stone hover:text-gold uppercase tracking-widest2">
        &larr; Back to catalog
      </Link>

      <div className="grid md:grid-cols-2 gap-12 mt-8">
        <div className="h-96 bg-surface border border-white/10">
          <ProductImage product={product} priority className="w-full h-full" />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs uppercase tracking-widest2 text-stone mb-3">
            <span>{product.category}</span>
            <span className="text-gold">{product.batch}</span>
          </div>
          <h1 className="font-display text-4xl text-bone mb-4">{product.name}</h1>
          <p className="text-stone text-sm leading-relaxed mb-6">{product.description}</p>

          <div className="flex gap-6 text-sm text-stone mb-6">
            <div>
              <div className="text-[10px] uppercase tracking-widest2 text-stone/70">Volume</div>
              <div className="text-bone">{product.volume}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest2 text-stone/70">ABV</div>
              <div className="text-bone">{product.abv}</div>
            </div>
          </div>

          <div className="foil-rule mb-6" />

          <div className="text-2xl text-bone mb-6">&#8377;{product.price.toLocaleString('en-IN')}</div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 border border-white/20 hover:border-gold">
                -
              </button>
              <span className="w-6 text-center">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8 border border-white/20 hover:border-gold">
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex-1 py-3 bg-gold text-ink text-xs uppercase tracking-widest2 font-semibold hover:bg-goldSoft transition-colors"
            >
              {added ? 'Added ✓' : user?.verified ? 'Add to Cart' : 'Verify Age to Purchase'}
            </button>
          </div>

          {!user?.verified && (
            <p className="text-xs text-stone">
              You'll need to complete DigiLocker age verification before adding items to your cart.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
