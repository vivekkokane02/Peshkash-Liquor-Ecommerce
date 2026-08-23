import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import AddressMap from '../components/AddressMap.jsx';
import PaymentMethods from '../components/PaymentMethods.jsx';
import { createPaymentOrder, processPayment } from '../utils/paymentApi.js';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', address: '', city: '', pincode: '', phone: '' });
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [paymentMethod, setPaymentMethod] = useState('googlepay');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [placing, setPlacing] = useState(false);
  const [payError, setPayError] = useState('');

  if (!user?.verified) return <Navigate to="/" replace />;
  if (items.length === 0) return <Navigate to="/" replace />;

  const delivery = subtotal > 3000 ? 0 : 150;
  const total = subtotal + delivery;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLocationChange = ({ formattedAddress, city, pincode, lat, lng }) => {
    setForm((prev) => ({
      ...prev,
      address: formattedAddress || prev.address,
      city: city || prev.city,
      pincode: pincode || prev.pincode,
    }));
    setLocation({ lat, lng });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPayError('');
    setPlacing(true);
    try {
      const order = await createPaymentOrder({
        amount: total,
        items: items.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
        delivery: form,
      });
      const payment = await processPayment({
        orderId: order.orderId,
        method: paymentMethod,
        details: paymentDetails,
      });

      const placedOrder = {
        ...order,
        items: items.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
        delivery: form,
        paymentMethod,
        paymentId: payment.paymentId,
        deliveryFee: delivery,
        total,
        placedAt: new Date().toISOString(),
      };
      sessionStorage.setItem('rsv_last_order', JSON.stringify(placedOrder));
      navigate('/order-success', { state: { order: placedOrder } });
    } catch (err) {
      setPayError(err.message || 'Payment failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-14 grid md:grid-cols-5 gap-10">
      <form onSubmit={handlePlaceOrder} className="md:col-span-3 space-y-5">
        <h1 className="font-display text-2xl text-bone mb-2">Delivery Details</h1>
        <p className="text-xs text-stone mb-6">
          ID will be checked again against your DigiLocker-verified name at the door.
        </p>

        <AddressMap onLocationChange={handleLocationChange} />

        {['name', 'address', 'city', 'pincode', 'phone'].map((field) => (
          <label key={field} className="block text-[10px] uppercase tracking-widest2 text-stone">
            {field}
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              className="mt-2 w-full bg-surface border border-white/15 px-3 py-2 text-bone text-sm focus:border-gold outline-none"
            />
          </label>
        ))}

        <div className="foil-rule !my-6" />

        <PaymentMethods
          method={paymentMethod}
          onMethodChange={(m) => {
            setPaymentMethod(m);
            setPaymentDetails({});
            setPayError('');
          }}
          details={paymentDetails}
          onDetailsChange={setPaymentDetails}
        />

        {payError && <p className="text-xs text-burgundy">{payError}</p>}

        <button
          type="submit"
          disabled={placing}
          className="w-full py-3 bg-gold text-ink text-xs uppercase tracking-widest2 font-semibold hover:bg-goldSoft transition-colors disabled:opacity-60"
        >
          {placing ? 'Placing order…' : `Place Order — ₹${total.toLocaleString('en-IN')}`}
        </button>
      </form>

      <div className="md:col-span-2 bg-surface border border-white/10 p-6 h-fit">
        <h2 className="font-display text-lg text-bone mb-4">Order Summary</h2>
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-stone">
              <span>
                {item.name} &times; {item.qty}
              </span>
              <span className="text-bone">&#8377;{(item.price * item.qty).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
        <div className="foil-rule mb-4" />
        <div className="flex justify-between text-sm text-stone mb-2">
          <span>Subtotal</span>
          <span>&#8377;{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-sm text-stone mb-4">
          <span>Delivery</span>
          <span>{delivery === 0 ? 'Free' : `₹${delivery}`}</span>
        </div>
        <div className="flex justify-between text-base text-bone font-medium">
          <span>Total</span>
          <span>&#8377;{total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}
