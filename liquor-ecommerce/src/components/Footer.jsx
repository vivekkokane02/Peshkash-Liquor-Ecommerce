import React from 'react';

export default function Footer() {
  return (
    <footer id="about" className="border-t border-white/10 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-[1.3fr_1fr_1fr] gap-12">
        <div>
          <div className="eyebrow mb-4"><span /> Reserve spirits</div>
          <div className="font-display text-2xl text-bone mb-3">A considered pour.</div>
          <p className="text-sm text-stone leading-relaxed max-w-sm">
            A small, considered catalog of spirits. Verified age delivery only, in states where
            online sale of alcohol is permitted.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest2 text-gold mb-3">Compliance</div>
          <ul className="text-sm text-stone space-y-2">
            <li>Sale restricted to verified 21+ customers</li>
            <li>ID checked again at the door on delivery</li>
            <li>Excise license displayed at checkout</li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest2 text-gold mb-3">Drink responsibly</div>
          <p className="text-sm text-stone leading-relaxed">
            This platform does not sell to anyone below the legal drinking age in their state.
          </p>
        </div>
      </div>
      <div className="foil-rule" />
      <div className="text-center text-[11px] text-stone py-6 tracking-widest2 uppercase">
        &copy; {new Date().getFullYear()} Reserve. All rights reserved.
      </div>
    </footer>
  );
}
