import React from 'react';
import { Dices } from 'lucide-react';

export default function GameHeader({ onReset, onDraw, mana, turn, playerHP, enemyHP }) {
  return (
    <header className="w-full sticky top-0 z-20 backdrop-blur bg-slate-900/70 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
            <Dices className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">D&D Card Arena</h1>
            <p className="text-xs text-slate-400">Drag-and-drop your heroes to the board</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-sm">
            <Stat label="Turn" value={turn} />
            <Stat label="Mana" value={mana} />
            <Stat label="You" value={`${playerHP} HP`} />
            <Stat label="Enemy" value={`${enemyHP} HP`} />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onDraw} className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">
              Draw
            </button>
            <button onClick={onReset} className="px-3 py-1.5 rounded-md bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors">
              Reset
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value }) {
  return (
    <div className="px-2 py-1 rounded-md bg-slate-800/70 text-slate-200 border border-slate-700">
      <span className="text-slate-400 mr-1">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
