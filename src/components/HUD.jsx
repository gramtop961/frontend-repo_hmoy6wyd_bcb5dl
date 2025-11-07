import React from 'react';
import { Swords, Eye, Heart } from 'lucide-react';

function StatTag({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs">
      <Icon className="size-3.5 text-white/80" />
      <span className="text-white/70">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function HUD({ hero, onBack }) {
  if (!hero) return null;
  const { name, className, stats, hp } = hero;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-white/10 px-3 py-2">
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-xs text-white/70">{className}</div>
        </div>
        <StatTag icon={Heart} label="HP" value={hp} />
        <StatTag icon={Swords} label="STR" value={stats.str} />
        <StatTag icon={Swords} label="DEX" value={stats.dex} />
        <StatTag icon={Eye} label="WIS" value={stats.wis} />
      </div>
      {onBack && (
        <button onClick={onBack} className="rounded-md bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium">Main Menu</button>
      )}
    </div>
  );
}

export default HUD;
