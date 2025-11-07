import React from 'react';

function Token({ type = 'hero', label = '', hp = null }) {
  const isHero = type === 'hero';
  const colors = isHero
    ? 'bg-emerald-500/90 ring-emerald-300/60'
    : 'bg-rose-500/90 ring-rose-300/60';

  return (
    <div className={`relative size-12 sm:size-14 rounded-full ${colors} ring-4 shadow-lg flex items-center justify-center text-white select-none`}
      title={label}
    >
      <span className="text-sm sm:text-base font-bold drop-shadow">{isHero ? '🛡️' : '👹'}</span>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-medium text-white/90 whitespace-nowrap">
        {label}
      </div>
      {hp !== null && (
        <div className={`absolute -top-2 -right-2 px-1.5 py-0.5 rounded-md text-[10px] sm:text-xs font-bold ${isHero ? 'bg-emerald-700' : 'bg-rose-700'}`}>
          HP {hp}
        </div>
      )}
    </div>
  );
}

export default Token;
