import React from 'react';
import { Swords, Shield, Flame } from 'lucide-react';

export default function Card({ card, onPlay, disabled }) {
  return (
    <div
      className={`group relative w-36 h-52 rounded-xl overflow-hidden border shadow-lg transition-transform select-none 
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'}
      bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700`}
      onClick={() => !disabled && onPlay?.(card)}
    >
      <div className="absolute inset-0 p-3 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
            {card.type}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-amber-600/30 text-amber-300 border border-amber-500/30">
            {card.cost}
          </span>
        </div>
        <div className="mt-3 text-white font-semibold text-sm leading-tight line-clamp-2">
          {card.name}
        </div>
        <div className="mt-2 text-xs text-slate-300 line-clamp-3">
          {card.desc}
        </div>
        <div className="mt-auto grid grid-cols-3 gap-2 text-slate-200">
          <Stat icon={<Swords className="w-4 h-4" />} value={card.atk} />
          <Stat icon={<Shield className="w-4 h-4" />} value={card.def} />
          <Stat icon={<Flame className="w-4 h-4" />} value={card.pow} />
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

function Stat({ icon, value }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/70 border border-slate-700">
      {icon}
      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}
