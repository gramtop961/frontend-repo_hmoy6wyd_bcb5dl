import React, { useState } from 'react';
import { Shield, Swords, Wand2, Heart } from 'lucide-react';

const classes = [
  {
    id: 'fighter',
    name: 'Fighter',
    desc: 'Martial expert with high defense and steady damage.',
    stats: { str: 3, dex: 1, int: 0, wis: 0, con: 2 },
    icon: Swords,
  },
  {
    id: 'rogue',
    name: 'Rogue',
    desc: 'Agile trickster who excels in stealth and precision.',
    stats: { str: 1, dex: 3, int: 0, wis: 0, con: 1 },
    icon: Wand2,
  },
  {
    id: 'wizard',
    name: 'Wizard',
    desc: 'Master of arcane spells with powerful burst damage.',
    stats: { str: 0, dex: 1, int: 3, wis: 1, con: 0 },
    icon: Wand2,
  },
  {
    id: 'cleric',
    name: 'Cleric',
    desc: 'Divine protector offering healing and support.',
    stats: { str: 0, dex: 0, int: 1, wis: 3, con: 1 },
    icon: Shield,
  },
];

export default function CharacterCreator({ onConfirm }) {
  const [name, setName] = useState('Ardent');
  const [selected, setSelected] = useState(classes[0].id);

  const handleStart = () => {
    const cls = classes.find(c => c.id === selected);
    onConfirm({ name: name.trim() || 'Ardent', classId: cls.id, className: cls.name, stats: cls.stats, hp: 20 + (cls.stats.con || 0) * 2 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-lg p-6">
        <h2 className="text-2xl font-semibold mb-2">Create Your Hero</h2>
        <p className="text-slate-300 mb-6">Pick a name and class. Stats influence dice rolls during checks and combat.</p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-3">
            <label className="text-sm text-slate-300">Hero Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-rose-500" placeholder="Enter your name" />
            <div className="text-sm text-slate-400">HP and rolls will factor your class stats.</div>
            <button onClick={handleStart} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-rose-500 hover:bg-rose-600 px-4 py-2 font-medium">Start Adventure</button>
          </div>

          <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
            {classes.map((c) => {
              const Icon = c.icon;
              const active = selected === c.id;
              return (
                <button key={c.id} onClick={() => setSelected(c.id)} className={`text-left rounded-xl border bg-white/5 p-4 transition ${active ? 'border-rose-400/60 ring-2 ring-rose-400/40' : 'border-white/10 hover:border-white/20'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-rose-300" />
                    <div className="font-semibold">{c.name}</div>
                  </div>
                  <div className="text-sm text-slate-300">{c.desc}</div>
                  <div className="mt-3 flex gap-3 text-xs text-slate-300">
                    <span className="inline-flex items-center gap-1"><Heart className="w-3 h-3 text-rose-400" />CON {c.stats.con}</span>
                    <span>STR {c.stats.str}</span>
                    <span>DEX {c.stats.dex}</span>
                    <span>INT {c.stats.int}</span>
                    <span>WIS {c.stats.wis}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
