import React, { useMemo, useState } from 'react';
import GameHeader from './components/GameHeader';
import Board from './components/Board';
import Hand from './components/Hand';

function App() {
  const initialDeck = useMemo(() => generateDeck(), []);
  const [deck, setDeck] = useState(initialDeck);
  const [hand, setHand] = useState([]);
  const [playerSlots, setPlayerSlots] = useState(Array(5).fill(null));
  const [enemySlots, setEnemySlots] = useState(() => seedEnemy());
  const [turn, setTurn] = useState(1);
  const [mana, setMana] = useState(3);
  const [playerHP, setPlayerHP] = useState(20);
  const [enemyHP, setEnemyHP] = useState(20);

  function resetGame() {
    const newDeck = generateDeck();
    setDeck(newDeck);
    setHand([]);
    setPlayerSlots(Array(5).fill(null));
    setEnemySlots(seedEnemy());
    setTurn(1);
    setMana(3);
    setPlayerHP(20);
    setEnemyHP(20);
  }

  function drawCard(count = 1) {
    if (deck.length === 0) return;
    const drawn = deck.slice(0, count);
    const remaining = deck.slice(count);
    setHand((h) => [...h, ...drawn]);
    setDeck(remaining);
  }

  function playCard(card) {
    if (card.cost > mana) return;
    const emptyIndex = playerSlots.findIndex((s) => s === null);
    if (emptyIndex === -1) return;

    // Place card on board
    const newSlots = [...playerSlots];
    newSlots[emptyIndex] = { ...card };
    setPlayerSlots(newSlots);

    // Remove from hand and spend mana
    setHand((h) => h.filter((c) => c.id !== card.id));
    setMana((m) => m - card.cost);
  }

  function endTurn() {
    // Simple combat resolution: each friendly unit attacks matching enemy slot
    let dmgToEnemy = 0;
    let dmgToPlayer = 0;

    for (let i = 0; i < 5; i++) {
      const p = playerSlots[i];
      const e = enemySlots[i];
      if (p && e) {
        // Each deals damage to the other
        const pRemaining = p.def - e.atk;
        const eRemaining = e.def - p.atk;
        if (pRemaining <= 0) playerSlots[i] = null;
        else playerSlots[i] = { ...p, def: pRemaining };
        if (eRemaining <= 0) enemySlots[i] = null;
        else enemySlots[i] = { ...e, def: eRemaining };
      } else if (p && !e) {
        dmgToEnemy += p.atk;
      } else if (!p && e) {
        dmgToPlayer += e.atk;
      }
    }

    setEnemyHP((hp) => Math.max(0, hp - dmgToEnemy));
    setPlayerHP((hp) => Math.max(0, hp - dmgToPlayer));

    // Refresh state for next turn
    setPlayerSlots([...playerSlots]);
    setEnemySlots([...enemySlots]);
    setTurn((t) => t + 1);
    setMana(3 + Math.floor((turn + 1) / 3));

    // Enemy tries to summon if has empty slots (simple AI)
    const empties = enemySlots.reduce((acc, s, idx) => (s ? acc : [...acc, idx]), []);
    if (empties.length) {
      const summoned = randomEnemyUnit();
      const idx = empties[Math.floor(Math.random() * empties.length)];
      const newEnemy = [...enemySlots];
      newEnemy[idx] = summoned;
      setEnemySlots(newEnemy);
    }
  }

  // Initial draw
  React.useEffect(() => {
    if (hand.length === 0 && deck.length > 0) {
      drawCard(3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
      <GameHeader
        onReset={resetGame}
        onDraw={() => drawCard(1)}
        mana={mana}
        turn={turn}
        playerHP={playerHP}
        enemyHP={enemyHP}
      />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <Board playerSlots={playerSlots} enemySlots={enemySlots} />

        <div className="flex items-center justify-between">
          <button
            onClick={endTurn}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            End Turn
          </button>
          <div className="text-sm text-slate-400">Click a card to play it to the first empty slot.</div>
        </div>

        <section className="bg-slate-900/50 border border-slate-800 rounded-xl">
          <Hand cards={hand} onPlay={playCard} mana={mana} />
        </section>
      </main>

      <footer className="py-6 text-center text-xs text-slate-500">
        A lightweight, web-based DnD-inspired card battler. Draw, summon, and battle!
      </footer>
    </div>
  );
}

// Helpers
function generateDeck() {
  const base = [
    { name: 'Fighter', type: 'Hero', atk: 3, def: 3, pow: 1, cost: 1, desc: 'Reliable frontliner.' },
    { name: 'Ranger', type: 'Hero', atk: 2, def: 2, pow: 2, cost: 1, desc: 'Quick and precise.' },
    { name: 'Cleric', type: 'Hero', atk: 1, def: 4, pow: 2, cost: 2, desc: 'Protective guardian.' },
    { name: 'Wizard', type: 'Hero', atk: 4, def: 1, pow: 3, cost: 2, desc: 'Glass cannon spellcaster.' },
    { name: 'Paladin', type: 'Hero', atk: 3, def: 5, pow: 3, cost: 3, desc: 'Holy defender of light.' },
  ];
  const deck = [];
  let id = 1;
  for (let i = 0; i < 2; i++) {
    for (const c of base) deck.push({ ...c, id: `p-${id++}` });
  }
  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function seedEnemy() {
  const options = [
    { name: 'Goblin', type: 'Monster', atk: 2, def: 1, pow: 1 },
    { name: 'Skeleton', type: 'Monster', atk: 1, def: 2, pow: 1 },
    { name: 'Orc', type: 'Monster', atk: 3, def: 2, pow: 2 },
  ];
  const slots = Array(5).fill(null);
  const count = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * 5);
    if (!slots[idx]) slots[idx] = { ...options[Math.floor(Math.random() * options.length)] };
  }
  return slots;
}

function randomEnemyUnit() {
  const bag = [
    { name: 'Goblin', type: 'Monster', atk: 2, def: 1, pow: 1 },
    { name: 'Skeleton', type: 'Monster', atk: 1, def: 2, pow: 1 },
    { name: 'Orc', type: 'Monster', atk: 3, def: 2, pow: 2 },
    { name: 'Imp', type: 'Monster', atk: 2, def: 2, pow: 1 },
  ];
  return { ...bag[Math.floor(Math.random() * bag.length)] };
}

export default App;
