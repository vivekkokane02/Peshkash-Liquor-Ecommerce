import React from 'react';
import { PAYMENT_METHODS } from '../utils/paymentApi.js';

const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank'];
const WALLETS = ['Paytm', 'Amazon Pay', 'Mobikwik'];

export default function PaymentMethods({ method, onMethodChange, details, onDetailsChange }) {
  const setDetail = (key, value) => onDetailsChange({ ...details, [key]: value });

  return (
    <div className="space-y-4">
      <label className="block text-[10px] uppercase tracking-widest2 text-stone">Payment Method</label>

      <div className="grid grid-cols-2 gap-2">
        {PAYMENT_METHODS.map((m) => {
          const active = method === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onMethodChange(m.id)}
              className={`text-left px-3 py-2.5 border text-sm transition-colors ${
                active
                  ? 'border-gold bg-gold/10 text-bone'
                  : 'border-white/15 text-stone hover:border-white/30'
              }`}
            >
              <span className="block font-medium">
                {m.id === 'googlepay' && <span className="text-gold mr-1">G</span>}
                {m.label}
              </span>
              <span className="block text-[10px] text-stone/70 mt-0.5">{m.hint}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-1">
        {method === 'googlepay' && (
          <p className="text-xs text-stone">
            You'll be prompted to confirm payment for the order total in Google Pay.
          </p>
        )}

        {method === 'upi' && (
          <label className="block text-[10px] uppercase tracking-widest2 text-stone">
            UPI ID
            <input
              type="text"
              placeholder="name@bank"
              value={details.vpa || ''}
              onChange={(e) => setDetail('vpa', e.target.value)}
              className="mt-2 w-full bg-surface border border-white/15 px-3 py-2 text-bone text-sm focus:border-gold outline-none"
            />
          </label>
        )}

        {method === 'card' && (
          <div className="grid grid-cols-2 gap-3">
            <label className="col-span-2 block text-[10px] uppercase tracking-widest2 text-stone">
              Card Number
              <input
                type="text"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                value={details.number || ''}
                onChange={(e) => setDetail('number', e.target.value)}
                className="mt-2 w-full bg-surface border border-white/15 px-3 py-2 text-bone text-sm focus:border-gold outline-none"
              />
            </label>
            <label className="block text-[10px] uppercase tracking-widest2 text-stone">
              Expiry
              <input
                type="text"
                placeholder="MM/YY"
                value={details.expiry || ''}
                onChange={(e) => setDetail('expiry', e.target.value)}
                className="mt-2 w-full bg-surface border border-white/15 px-3 py-2 text-bone text-sm focus:border-gold outline-none"
              />
            </label>
            <label className="block text-[10px] uppercase tracking-widest2 text-stone">
              CVV
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={details.cvv || ''}
                onChange={(e) => setDetail('cvv', e.target.value)}
                className="mt-2 w-full bg-surface border border-white/15 px-3 py-2 text-bone text-sm focus:border-gold outline-none"
              />
            </label>
          </div>
        )}

        {method === 'netbanking' && (
          <label className="block text-[10px] uppercase tracking-widest2 text-stone">
            Bank
            <select
              value={details.bank || ''}
              onChange={(e) => setDetail('bank', e.target.value)}
              className="mt-2 w-full bg-surface border border-white/15 px-3 py-2 text-bone text-sm focus:border-gold outline-none"
            >
              <option value="">Select your bank</option>
              {BANKS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>
        )}

        {method === 'wallet' && (
          <label className="block text-[10px] uppercase tracking-widest2 text-stone">
            Wallet
            <select
              value={details.wallet || ''}
              onChange={(e) => setDetail('wallet', e.target.value)}
              className="mt-2 w-full bg-surface border border-white/15 px-3 py-2 text-bone text-sm focus:border-gold outline-none"
            >
              <option value="">Select a wallet</option>
              {WALLETS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </label>
        )}

        {method === 'cod' && (
          <p className="text-xs text-stone">
            Pay in cash when your order arrives. ID will still be checked against your
            DigiLocker-verified name at the door.
          </p>
        )}
      </div>
    </div>
  );
}
