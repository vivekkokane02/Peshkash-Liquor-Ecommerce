import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function CartDrawer({ open, onClose }) {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-ink/70" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-surface border-l border-white/10 flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="font-display text-xl text-bone">Your Cart</h2>
          <button onClick={onClose} className="text-stone hover:text-bone text-xl" aria-label="Close cart">
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {items.length === 0 && <p className="text-stone text-sm">Your cart is empty.</p>}
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 items-center border-b border-white/5 pb-4">
              <div className="w-14 h-14 rounded-full flex-shrink-0" style={{ backgroundColor: item.color, opacity: 0.85 }} />
              <div className="flex-1">
                <div className="text-sm text-bone">{item.name}</div>
                <div className="text-xs text-stone">&#8377;{item.price.toLocaleString('en-IN')}</div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="w-6 h-6 border border-white/20 text-bone hover:border-gold"
                  >
                    -
                  </button>
                  <span className="text-sm w-5 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="w-6 h-6 border border-white/20 text-bone hover:border-gold"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-auto text-[10px] uppercase tracking-widest2 text-stone hover:text-burgundy"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-5 border-t border-white/10">
          <div className="flex justify-between text-sm text-bone mb-4">
            <span>Subtotal</span>
            <span>&#8377;{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <button
            disabled={items.length === 0}
            onClick={() => {
              onClose();
              navigate('/checkout');
            }}
            className="w-full py-3 bg-gold text-ink text-xs uppercase tracking-widest2 font-semibold hover:bg-goldSoft transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
