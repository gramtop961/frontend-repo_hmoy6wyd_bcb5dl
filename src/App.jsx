import React, { useMemo, useState } from 'react';
import MainMenu from './components/MainMenu';
import CharacterCreator from './components/CharacterCreator';
import DMNarrator from './components/DMNarrator';
import DiceRoller from './components/DiceRoller';

function App() {
  const [screen, setScreen] = useState('menu'); // menu | creator | story | encounter | result
  const [hero, setHero] = useState(null);
  const [log, setLog] = useState([]);
  const [checkResult, setCheckResult] = useState(null);

  const storyIntro = useMemo(
    () => [
      `The torchlight flickers along ancient stone as you step into the forgotten halls of Blackroot Keep.`,
      `Dust motes swirl in the stale air. Somewhere deeper, a low growl echoes like thunder in a cavern.`,
      `Your steps slow as a narrow passage yawns ahead — choked with webs and shadow.`,
    ],
    []
  );

  const dcPerception = 12;
  const dcGoblinAC = 12;

  const handleNewGame = () => setScreen('creator');
  const handleLoad = () => {
    // Simple demo load handler
    alert('No saved games found in this demo. Start a New Game.');
  };

  const startAdventure = (createdHero) => {
    setHero(createdHero);
    setScreen('story');
  };

  const handlePerceptionRoll = (res) => {
    if (!hero) return;
    const success = res.total >= dcPerception;
    setCheckResult({ type: 'perception', res, success });
    const line = success
      ? `Success! Your keen senses catch the glint of a tripwire. You carefully step over it. (DC ${dcPerception})`
      : `You miss the fine filament across the path. A click echoes — but the trap sputters, long rusted. (DC ${dcPerception})`;
    setLog((l) => [...l, line]);
    setTimeout(() => setScreen('encounter'), 600);
  };

  const handleAttackRoll = (res) => {
    if (!hero) return;
    const success = res.total >= dcGoblinAC;
    const msg = success
      ? `Hit! Your blow connects with the goblin (AC ${dcGoblinAC}). It screeches and staggers back.`
      : `Miss! Your attack whiffs as the goblin ducks under your swing (AC ${dcGoblinAC}).`;
    setLog((l) => [...l, msg]);
    setCheckResult({ type: 'attack', res, success });
    setScreen('result');
  };

  const statMod = (stat) => Math.floor(((hero?.stats?.[stat] || 0) - 0) / 2); // lightweight modifier mapping

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
      {screen === 'menu' && (
        <MainMenu onNewGame={handleNewGame} onLoad={handleLoad} />
      )}

      {screen === 'creator' && (
        <CharacterCreator onConfirm={startAdventure} />
      )}

      {screen === 'story' && hero && (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Welcome, {hero.name} the {hero.className}</h1>
            <div className="text-sm text-slate-300">HP {hero.hp} • STR {hero.stats.str} DEX {hero.stats.dex} INT {hero.stats.int} WIS {hero.stats.wis} CON {hero.stats.con}</div>
          </header>

          <DMNarrator lines={storyIntro} onContinue={null} />

          <div className="space-y-3">
            <div className="text-slate-200">Make a Perception check to scout the passage.</div>
            <DiceRoller label="Perception (WIS) Check" mod={statMod('wis')} onResult={handlePerceptionRoll} />
          </div>

          {log.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Log</div>
              <ul className="text-sm space-y-1 text-slate-200">
                {log.map((l, i) => (
                  <li key={i}>• {l}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {screen === 'encounter' && hero && (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          <DMNarrator
            lines={[
              'A goblin snarls from the dark, brandishing a jagged blade.',
              'It lunges! You ready your strike — roll to hit!'
            ]}
          />

          <div className="space-y-3">
            <div className="text-slate-200">Attack roll vs Goblin (AC {dcGoblinAC}). Use STR for melee or DEX for finesse.</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <DiceRoller label="Melee Attack (STR)" mod={statMod('str')} onResult={handleAttackRoll} />
              <DiceRoller label="Finesse Attack (DEX)" mod={statMod('dex')} onResult={handleAttackRoll} />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Recent</div>
            <div className="text-sm text-slate-200">{checkResult?.type === 'perception' ? `Perception roll: ${checkResult.res.roll}${checkResult.res.mod ? ` ${checkResult.res.mod > 0 ? '+' : ''}${checkResult.res.mod}` : ''} = ${checkResult.res.total}` : '—'}</div>
          </div>
        </div>
      )}

      {screen === 'result' && hero && (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          <DMNarrator
            lines={[
              checkResult?.success
                ? 'Your decisive strike sends the goblin fleeing into the shadows.'
                : 'The goblin laughs and retreats, promising vengeance as it vanishes into the dark.',
              'The corridor opens into a quiet antechamber. A heavy door awaits — beyond, new adventures.'
            ]}
          />
          <div className="flex gap-3">
            <button onClick={() => setScreen('story')} className="rounded-lg bg-rose-500 hover:bg-rose-600 px-4 py-2 font-medium">Continue Story</button>
            <button onClick={() => { setScreen('menu'); setHero(null); setLog([]); setCheckResult(null); }} className="rounded-lg bg-slate-700 hover:bg-slate-600 px-4 py-2 font-medium">Main Menu</button>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Roll Summary</div>
            {checkResult && (
              <div className="text-sm text-slate-200">Attack roll: {checkResult.res.roll}{checkResult.res.mod ? ` ${checkResult.res.mod > 0 ? '+' : ''}${checkResult.res.mod}` : ''} = <b>{checkResult.res.total}</b> vs AC {dcGoblinAC} — {checkResult.success ? 'Hit' : 'Miss'}</div>
            )}
          </div>
        </div>
      )}

      <footer className="py-6 text-center text-xs text-slate-500">
        Narrative DnD-style adventure — all actions decided by the dice.
      </footer>
    </div>
  );
}

export default App;
