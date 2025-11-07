import React from 'react';

export default function Board({ playerSlots, enemySlots }) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <Row title="Enemy" slots={enemySlots} reversed />
      <div className="h-2" />
      <Row title="You" slots={playerSlots} />
    </div>
  );
}

function Row({ title, slots, reversed = false }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
      <div className="text-xs text-slate-400 mb-2">{title} Field</div>
      <div className={`grid grid-cols-5 gap-3 ${reversed ? 'direction-rtl' : ''}`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const unit = slots[i];
          return (
            <div key={i} className="aspect-[5/7] rounded-xl border border-slate-800 bg-slate-900/70 flex items-center justify-center">
              {unit ? (
                <div className="text-center">
                  <div className="text-white font-semibold text-sm">{unit.name}</div>
                  <div className="text-xs text-slate-400">ATK {unit.atk} • DEF {unit.def}</div>
                </div>
              ) : (
                <div className="text-slate-600 text-xs">Empty</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
