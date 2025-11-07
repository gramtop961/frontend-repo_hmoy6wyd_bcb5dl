import React from 'react';
import { Swords, User, Play } from 'lucide-react';

export default function MainMenu({ onNewGame, onLoad }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-lg">
        <div className="p-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Swords className="w-8 h-8 text-rose-400" />
            <h1 className="text-3xl font-semibold tracking-tight">DnD Story Adventure</h1>
          </div>
          <p className="text-slate-300">Choose your path. Every action is decided by the dice.</p>
          <div className="grid gap-3 mt-4">
            <button onClick={onNewGame} className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-500 hover:bg-rose-600 active:bg-rose-700 transition text-white px-5 py-3 font-medium">
              <Play className="w-5 h-5" /> New Game
            </button>
            <button onClick={onLoad} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-700 hover:bg-slate-600 active:bg-slate-700 transition text-white/90 px-5 py-3 font-medium">
              <User className="w-5 h-5" /> Load Game
            </button>
          </div>
          <p className="text-xs text-slate-400">Tip: You can rename your hero and pick a class with unique strengths.</p>
        </div>
      </div>
    </div>
  );
}
