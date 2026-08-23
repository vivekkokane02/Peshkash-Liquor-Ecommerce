import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function OrderSuccess() {
  const location = useLocation();
  const { clearCart } = useCart();
  const storedOrder = sessionStorage.getItem('rsv_last_order');
  const order = location.state?.order || (storedOrder ? JSON.parse(storedOrder) : null);

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <div className="text-gold text-4xl mb-4">&#10003;</div>
      <h1 className="font-display text-3xl text-bone mb-4">Order Placed</h1>
      <p className="text-stone text-sm leading-relaxed mb-8">
        Your order is confirmed. ID will be checked once more against your DigiLocker
        verification at the time of delivery.
      </p>
      {order && (
        <div className="bg-surface border border-white/10 p-5 mb-8 text-left text-sm">
          <div className="flex justify-between gap-4 mb-4">
            <span className="text-stone">Order ID</span>
            <span className="text-bone break-all">{order.orderId}</span>
          </div>
          <div className="space-y-2 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 text-stone">
                <span>{item.name} &times; {item.qty}</span>
                <span className="text-bone">&#8377;{(item.price * item.qty).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="foil-rule mb-4" />
          <div className="flex justify-between text-stone">
            <span>Paid via {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
            <span className="text-gold font-medium">&#8377;{order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-gold text-ink text-xs uppercase tracking-widest2 font-semibold hover:bg-goldSoft transition-colors"
      >
        Back to Catalog
      </Link>
    </div>
  );
}
