import React, { useMemo, useState } from 'react';
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
  const [goblinFled, setGoblinFled] = useState(false);
  const [lastRoll, setLastRoll] = useState(null);
  const grid = { w: 8, h: 5 };

  const dcPerception = 12;
  const dcGoblinAC = 12;

  const storyIntro = useMemo(
    () => [
      `A parchment map lies before you. Candles flicker as the tabletop becomes a realm of stone corridors and shadow.`,
      `Your token rests near the entrance to Blackroot Keep. A goblin roams deeper within.`,
      `Click a tile on the grid to move. When adjacent to an enemy, you may attack. Roll wisely.`,
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
    setGoblinFled(false);
    setLog([]);
    setLastRoll(null);
    setScreen('map');
  };

  const statMod = (key) => Math.floor(((hero?.stats?.[key] || 0) - 0) / 2);

  const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

  const canAttack = hero && enemyPos && !goblinFled && distance(heroPos, enemyPos) === 1;

  const onMove = ({ x, y }) => {
    if (!hero) return;
    setHeroPos({ x, y });
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

  const handleAttackRoll = (res) => {
    const success = res.total >= dcGoblinAC;
    setLastRoll({ type: 'attack', res, success });
    if (success) {
      setLog((l) => [
        ...l,
        `Attack hits (AC ${dcGoblinAC}). The goblin shrieks and flees into the tunnels!`,
      ]);
      setGoblinFled(true);
      // Move goblin off the board to show it fled
      setEnemyPos(null);
      setScreen('result');
    } else {
      setLog((l) => [
        ...l,
        `Attack misses (AC ${dcGoblinAC}). The goblin cackles and sidesteps your strike.`,
      ]);
      setScreen('result');
    }
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
                <div style={cellCenterStyle(heroPos)}>
                  <Token type="hero" label={hero.name} hp={hero.hp} />
                </div>
                {enemyPos && (
                  <div style={cellCenterStyle(enemyPos)}>
                    <Token type="enemy" label="Goblin" hp={8} />
                  </div>
                )}
              </MapGrid>

              <div className="grid sm:grid-cols-2 gap-3">
                <DiceRoller label="Perception (WIS)" mod={statMod('wis')} onResult={handlePerceptionRoll} />
                {canAttack ? (
                  <div className="space-y-3">
                    <DiceRoller label="Melee Attack (STR) vs Goblin" mod={statMod('str')} onResult={handleAttackRoll} />
                    <DiceRoller label="Finesse Attack (DEX) vs Goblin" mod={statMod('dex')} onResult={handleAttackRoll} />
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300 flex items-center">Move adjacent to the goblin to attack.</div>
                )}
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
                      <span>Attack: {lastRoll.res.roll}{lastRoll.res.mod ? ` ${lastRoll.res.mod > 0 ? '+' : ''}${lastRoll.res.mod}` : ''} = <b>{lastRoll.res.total}</b> vs AC {dcGoblinAC} — {lastRoll.success ? 'Hit' : 'Miss'}</span>
                    )}
                  </div>
                </div>
              )}
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Log</div>
                <ul className="text-sm space-y-1 text-slate-200 max-h-64 overflow-auto pr-2">
                  {log.length === 0 && <li className="text-slate-400">Your adventure begins. Click on the map to move.</li>}
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
              lastRoll?.success
                ? 'Your decisive strike sends the goblin fleeing into the shadows.'
                : 'The goblin laughs and retreats, promising vengeance as it vanishes into the dark.',
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
        Tabletop-style map with tokens • Narration and dice decide your fate
      </footer>
    </div>
  );
}

export default App;
