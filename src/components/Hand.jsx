import React from 'react';
import Card from './Card';

export default function Hand({ cards, onPlay, mana }) {
  return (
    <div className="w-full flex gap-3 justify-center items-end p-4 overflow-x-auto">
      {cards.length === 0 && (
        <div className="text-slate-400 text-sm">Your hand is empty. Click Draw to get more cards.</div>
      )}
      {cards.map((c) => (
        <Card key={c.id} card={c} onPlay={onPlay} disabled={c.cost > mana} />
      ))}
    </div>
  );
}
