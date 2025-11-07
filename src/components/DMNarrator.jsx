import React from 'react';
import { Sparkles, Quote } from 'lucide-react';

export default function DMNarrator({ lines = [], onContinue }) {
  return (
    <div className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-amber-300" />
        <div className="font-semibold">Dungeon Master</div>
      </div>
      <div className="space-y-2 text-slate-200">
        {lines.map((l, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <Quote className="w-4 h-4 mt-1 text-amber-200" />
            <p>{l}</p>
          </div>
        ))}
      </div>
      {onContinue && (
        <div className="mt-4">
          <button onClick={onContinue} className="rounded-lg bg-amber-500 hover:bg-amber-600 px-3 py-2 text-sm font-medium">Continue</button>
        </div>
      )}
    </div>
  );
}
