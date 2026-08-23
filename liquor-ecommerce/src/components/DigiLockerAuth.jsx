import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function DigiLockerAuth({ onClose }) {
  const { verificationStep, error, startVerification, confirmOtp, setVerificationStep } = useAuth();
  const [linkedId, setLinkedId] = useState('');
  const [otp, setOtp] = useState('');

  const handleConsent = (e) => {
    e.preventDefault();
    startVerification(linkedId);
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    const ok = await confirmOtp(otp);
    if (ok) setTimeout(onClose, 900);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-ink/90 backdrop-blur-sm flex items-center justify-center px-6">
      <div className="max-w-sm w-full bg-surface border border-gold/30 p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone hover:text-bone"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center text-gold text-xs font-bold">
            DL
          </div>
          <div className="text-sm text-bone font-medium">DigiLocker Verification</div>
        </div>

        {verificationStep === 'idle' || verificationStep === 'consent' ? (
          <form onSubmit={handleConsent} className="space-y-4">
            <p className="text-xs text-stone leading-relaxed">
              Verify your age and identity via DigiLocker to unlock checkout. We only receive a
              yes/no on age eligibility &mdash; not your full ID.
            </p>
            <label className="block text-[10px] uppercase tracking-widest2 text-stone">
              DigiLocker-linked mobile number
              <input
                type="tel"
                value={linkedId}
                onChange={(e) => setLinkedId(e.target.value)}
                placeholder="98XXXXXXXX"
                required
                className="mt-2 w-full bg-ink border border-white/15 px-3 py-2 text-bone text-sm focus:border-gold outline-none"
              />
            </label>
            {error && <p className="text-xs text-burgundy">{error}</p>}
            <button
              type="submit"
              disabled={verificationStep === 'consent'}
              className="w-full py-3 bg-gold text-ink text-xs uppercase tracking-widest2 font-semibold hover:bg-goldSoft transition-colors disabled:opacity-60"
            >
              {verificationStep === 'consent' ? 'Requesting consent…' : 'Continue with DigiLocker'}
            </button>
          </form>
        ) : null}

        {verificationStep === 'otp' && (
          <form onSubmit={handleOtp} className="space-y-4">
            <p className="text-xs text-stone leading-relaxed">
              Enter the 6-digit OTP sent to your DigiLocker-linked number.
            </p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              required
              className="w-full bg-ink border border-white/15 px-3 py-2 text-bone text-center tracking-[0.5em] focus:border-gold outline-none"
            />
            {error && <p className="text-xs text-burgundy">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-gold text-ink text-xs uppercase tracking-widest2 font-semibold hover:bg-goldSoft transition-colors"
            >
              Verify
            </button>
          </form>
        )}

        {verificationStep === 'verified' && (
          <div className="text-center py-4">
            <div className="text-gold text-2xl mb-2">&#10003;</div>
            <p className="text-sm text-bone">Identity verified. Checkout unlocked.</p>
          </div>
        )}

        {verificationStep === 'failed' && (
          <button
            onClick={() => setVerificationStep('idle')}
            className="mt-4 text-xs text-stone underline hover:text-gold"
          >
            Try again
          </button>
        )}

        <p className="mt-6 text-[10px] text-stone/70 leading-relaxed">
          Demo mode: any 6-digit code works. In production this calls the real DigiLocker
          Partner API from your backend.
        </p>
      </div>
    </div>
  );
}
