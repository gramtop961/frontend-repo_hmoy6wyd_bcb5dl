import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainMenu from './components/MainMenu';
import CharacterCreator from './components/CharacterCreator';
import DMNarrator from './components/DMNarrator';
import DiceRoller from './components/DiceRoller';
import MapGrid from './components/MapGrid';
import Token from './components/Token';
import HUD from './components/HUD';

function App() {
  // Screens: menu | creator | map | result
  const [screen, setScreen] = useState('menu');
  const [hero, setHero] = useState(null);
  const [log, setLog] = useState([]);
  const [heroPos, setHeroPos] = useState({ x: 1, y: 2 });
  const [enemyPos, setEnemyPos] = useState({ x: 6, y: 2 });
  const [enemyHP, setEnemyHP] = useState(8);
  const [lastRoll, setLastRoll] = useState(null);

  // Turn-based control
  const [turn, setTurn] = useState('player'); // 'player' | 'enemy'
  const [hasMoved, setHasMoved] = useState(false);
  const [hasAttacked, setHasAttacked] = useState(false);

  // Small hit effects
  const [heroHit, setHeroHit] = useState(false);
  const [goblinHit, setGoblinHit] = useState(false);

  const grid = { w: 8, h: 5 };

  const dcPerception = 12;
  const goblinAC = 12;

  const storyIntro = useMemo(
    () => [
      `A parchment map lies before you. Candles flicker as the tabletop becomes a realm of stone corridors and shadow.`,
      `Your token rests near the entrance to Blackroot Keep. A goblin roams deeper within.`,
      `This is turn-based. On your turn, move one tile and/or attack when adjacent. End your turn to let the goblin act.`,
    ],
    []
  );

  const handleNewGame = () => setScreen('creator');
  const handleLoad = () => {
    alert('No saved games found in this demo. Start a New Game.');
  };

  const startAdventure = (createdHero) => {
    setHero(createdHero);
    setHeroPos({ x: 1, y: 2 });
    setEnemyPos({ x: 6, y: 2 });
    setEnemyHP(8);
    setLog([]);
    setLastRoll(null);
    setTurn('player');
    setHasMoved(false);
    setHasAttacked(false);
    setHeroHit(false);
    setGoblinHit(false);
    setScreen('map');
  };

  const statMod = (key) => Math.floor(((hero?.stats?.[key] || 0) - 10) / 2);
  const heroAC = 10 + (statMod('dex') || 0);

  const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

  const adjacent = hero && enemyPos && distance(heroPos, enemyPos) === 1;
  const canAttack = hero && enemyPos && adjacent && turn === 'player' && !hasAttacked;

  const onMove = ({ x, y }) => {
    if (!hero || turn !== 'player' || hasMoved) return;
    // Restrict movement to 1 tile orthogonally per turn
    const d = distance(heroPos, { x, y });
    const isOrthogonal = (heroPos.x === x || heroPos.y === y);
    if (d !== 1 || !isOrthogonal) return;
    setHeroPos({ x, y });
    setHasMoved(true);
    setLog((l) => [...l, `You move to (${x + 1}, ${y + 1}).`]);
  };

  const handlePerceptionRoll = (res) => {
    const success = res.total >= dcPerception;
    setLastRoll({ type: 'perception', res, success });
    setLog((l) => [
      ...l,
      success
        ? `Perception success (DC ${dcPerception}). You spot a loose flagstone and a faint tripwire ahead.`
        : `Perception fail (DC ${dcPerception}). The gloom hides subtle dangers; you proceed with caution.`,
    ]);
  };

  // Player attack (STR or DEX) vs goblin AC, deal 1d8 + mod damage
  const playerAttack = (res, statKey) => {
    if (!canAttack) return;
    const hit = res.total >= goblinAC;
    setLastRoll({ type: 'attack', res, success: hit });
    setHasAttacked(true);
    if (hit) {
      const dmgRoll = Math.floor(Math.random() * 8) + 1; // d8
      const dmg = Math.max(1, dmgRoll + (statMod(statKey) || 0));
      setGoblinHit(true);
      setTimeout(() => setGoblinHit(false), 250);
      setEnemyHP((hp) => {
        const newHP = Math.max(0, hp - dmg);
        setLog((l) => [
          ...l,
          `You hit the goblin (AC ${goblinAC}) for ${dmg} damage! (${newHP}/8 HP left)`,
        ]);
        if (newHP <= 0) {
          setLog((l) => [...l, 'The goblin collapses. Victory!']);
          setTimeout(() => setScreen('result'), 300);
        }
        return newHP;
      });
    } else {
      setLog((l) => [
        ...l,
        `Your attack misses (AC ${goblinAC}). The goblin ducks aside.`,
      ]);
    }
  };

  const endPlayerTurn = () => {
    if (!hero) return;
    setTurn('enemy');
    setHasMoved(false);
    setHasAttacked(false);
    // Enemy acts after a short beat for readability
    setTimeout(enemyTurn, 450);
  };

  const enemyTurn = () => {
    if (!enemyPos || enemyHP <= 0 || !hero) {
      setTurn('player');
      return;
    }
    // If adjacent, attack. Else move 1 step closer (orthogonal)
    if (distance(heroPos, enemyPos) === 1) {
      const roll = Math.floor(Math.random() * 20) + 1;
      const mod = 3; // goblin attack bonus
      const total = roll + mod;
      const hit = total >= heroAC;
      setLastRoll({ type: 'enemy-attack', res: { roll, mod, total }, success: hit });
      if (hit) {
        const dmg = Math.floor(Math.random() * 6) + 1 + 1; // 1d6+1
        setHeroHit(true);
        setTimeout(() => setHeroHit(false), 250);
        setHero((h) => {
          if (!h) return h;
          const newHP = Math.max(0, (h.hp || 10) - dmg);
          setLog((l) => [...l, `Goblin hits you for ${dmg} damage! (${newHP} HP left)`]);
          if (newHP <= 0) {
            setLog((l) => [...l, 'You fall. The dungeon grows silent...']);
            setTimeout(() => setScreen('result'), 300);
          }
          return { ...h, hp: newHP };
        });
      } else {
        setLog((l) => [...l, 'Goblin attack misses!']);
      }
      setTurn('player');
      return;
    }

    // Move towards hero by one tile
    let { x: ex, y: ey } = enemyPos;
    if (heroPos.x !== ex) {
      ex += heroPos.x > ex ? 1 : -1;
    } else if (heroPos.y !== ey) {
      ey += heroPos.y > ey ? 1 : -1;
    }
    setEnemyPos({ x: ex, y: ey });
    setLog((l) => [...l, `Goblin moves to (${ex + 1}, ${ey + 1}).`]);
    setTurn('player');
  };

  // Convert grid coordinates to absolute positions for token overlays
  const cellCenterStyle = (pos) => {
    if (!pos) return { display: 'none' };
    const left = ((pos.x + 0.5) / grid.w) * 100;
    const top = ((pos.y + 0.5) / grid.h) * 100;
    return {
      position: 'absolute',
      left: `${left}%`,
      top: `${top}%`,
      transform: 'translate(-50%, -50%)',
    };
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
      {screen === 'menu' && (
        <MainMenu onNewGame={handleNewGame} onLoad={handleLoad} />
      )}

      {screen === 'creator' && (
        <CharacterCreator onConfirm={startAdventure} />
      )}

      {screen === 'map' && hero && (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <HUD hero={hero} onBack={() => { setScreen('menu'); setHero(null); setLog([]); }} />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <MapGrid width={grid.w} height={grid.h} onMove={onMove}>
                <AnimatePresence>
                  {enemyPos && (
                    <motion.div
                      key="enemy"
                      layout
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: goblinHit ? 1.15 : 1, opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      style={cellCenterStyle(enemyPos)}
                    >
                      <Token type="enemy" label="Goblin" hp={enemyHP} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  key="hero"
                  layout
                  animate={{ scale: heroHit ? 1.12 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  style={cellCenterStyle(heroPos)}
                >
                  <Token type="hero" label={hero.name} hp={hero.hp} />
                </motion.div>
              </MapGrid>

              <div className="grid sm:grid-cols-2 gap-3">
                <DiceRoller label="Perception (WIS)" mod={statMod('wis')} onResult={handlePerceptionRoll} />

                <div className="space-y-3">
                  {canAttack ? (
                    <>
                      <DiceRoller label="Melee Attack (STR) vs Goblin" mod={statMod('str')} onResult={(res) => playerAttack(res, 'str')} />
                      <DiceRoller label="Finesse Attack (DEX) vs Goblin" mod={statMod('dex')} onResult={(res) => playerAttack(res, 'dex')} />
                    </>
                  ) : (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300 flex items-center">Move adjacent to the goblin to attack.</div>
                  )}

                  <button
                    className="w-full rounded-lg bg-slate-700/80 hover:bg-slate-600 px-4 py-2 font-medium disabled:opacity-50"
                    disabled={turn !== 'player' || (hasMoved === false && hasAttacked === false)}
                    onClick={endPlayerTurn}
                  >
                    End Turn
                  </button>
                  <div className="text-xs text-slate-400">Turn: {turn === 'player' ? 'Your turn' : "Goblin's turn"} • {hasMoved ? 'Moved' : 'Not moved'} • {hasAttacked ? 'Attacked' : 'No attack'}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <DMNarrator lines={storyIntro} />
              {lastRoll && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                  <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Last Roll</div>
                  <div>
                    {lastRoll.type === 'perception' && (
                      <span>Perception: {lastRoll.res.roll}{lastRoll.res.mod ? ` ${lastRoll.res.mod > 0 ? '+' : ''}${lastRoll.res.mod}` : ''} = <b>{lastRoll.res.total}</b> vs DC {dcPerception} — {lastRoll.success ? 'Success' : 'Fail'}</span>
                    )}
                    {lastRoll.type === 'attack' && (
                      <span>Attack: {lastRoll.res.roll}{lastRoll.res.mod ? ` ${lastRoll.res.mod > 0 ? '+' : ''}${lastRoll.res.mod}` : ''} = <b>{lastRoll.res.total}</b> vs AC {goblinAC} — {lastRoll.success ? 'Hit' : 'Miss'}</span>
                    )}
                    {lastRoll.type === 'enemy-attack' && (
                      <span>Goblin Attack: {lastRoll.res.roll}{lastRoll.res.mod ? ` ${lastRoll.res.mod > 0 ? '+' : ''}${lastRoll.res.mod}` : ''} = <b>{lastRoll.res.total}</b> vs AC {heroAC} — {lastRoll.success ? 'Hit' : 'Miss'}</span>
                    )}
                  </div>
                </div>
              )}
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Log</div>
                <ul className="text-sm space-y-1 text-slate-200 max-h-64 overflow-auto pr-2">
                  {log.length === 0 && <li className="text-slate-400">Your adventure begins. Click a tile to move one step.</li>}
                  {log.map((l, i) => (
                    <li key={i}>• {l}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === 'result' && hero && (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          <DMNarrator
            lines={[
              enemyHP <= 0
                ? 'Your decisive blows end the threat of the goblin. The chamber falls quiet.'
                : hero.hp <= 0
                ? 'You collapse as darkness seeps in around the map edges. The goblin scampers away, victorious.'
                : 'The encounter ends for now.',
              'The corridor opens into a quiet antechamber. A heavy door awaits — beyond, new adventures.',
            ]}
          />
          <div className="flex gap-3">
            <button onClick={() => setScreen('map')} className="rounded-lg bg-rose-500 hover:bg-rose-600 px-4 py-2 font-medium">Back to Map</button>
            <button onClick={() => { setScreen('menu'); setHero(null); setLog([]); setLastRoll(null); }} className="rounded-lg bg-slate-700 hover:bg-slate-600 px-4 py-2 font-medium">Main Menu</button>
          </div>
        </div>
      )}

      <footer className="py-6 text-center text-xs text-slate-500">
        Turn-based map with animated tokens • Narration and dice decide your fate
      </footer>
    </div>
  );
}

export default App;
