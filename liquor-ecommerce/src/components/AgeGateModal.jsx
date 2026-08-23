import React from 'react';

export default function AgeGateModal({ onConfirm, onDecline }) {
  return (
    <div className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="font-display text-3xl text-bone mb-4">PESHKASH</div>
        <div className="foil-rule mb-6" />
        <p className="text-stone text-sm leading-relaxed mb-8">
          This site sells alcoholic beverages. You must be of legal drinking age in your
          state to enter. We verify identity with DigiLocker before any order ships.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-gold text-ink text-xs uppercase tracking-widest2 font-semibold hover:bg-goldSoft transition-colors"
          >
            I am 21 or older
          </button>
          <button
            onClick={onDecline}
            className="px-6 py-3 border border-white/20 text-stone text-xs uppercase tracking-widest2 hover:border-white/40 transition-colors"
          >
            I am under 21
          </button>
        </div>
      </div>
    </div>
  );
}
