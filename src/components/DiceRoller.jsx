import React, { useMemo } from 'react';
import { Dice6 } from 'lucide-react';

function rollD20(mod = 0) {
  const r = Math.floor(Math.random() * 20) + 1;
  return { roll: r, total: r + mod, mod };
}

export default function DiceRoller({ label = 'Roll', mod = 0, auto = false, onResult }) {
  const result = useMemo(() => (auto ? rollD20(mod) : null), [auto, mod]);

  const handleRoll = () => {
    const res = rollD20(mod);
    onResult?.(res);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm">
        <Dice6 className="w-4 h-4 text-emerald-300" />
        <span>{label}</span>
        {typeof mod === 'number' && mod !== 0 && (
          <span className="text-emerald-300">{mod >= 0 ? `+${mod}` : mod}</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {result && (
          <span className="text-xs text-slate-300">Rolled {result.roll} {result.mod ? (result.mod > 0 ? `+${result.mod}` : result.mod) : ''} = <b>{result.total}</b></span>
        )}
        <button onClick={handleRoll} className="rounded-md bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 text-xs font-medium">Roll d20</button>
      </div>
    </div>
  );
}
