import React from 'react';

function MapGrid({ width = 8, height = 5, onMove, children }) {
  const cells = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      cells.push({ x, y, key: `${x}-${y}` });
    }
  }

  return (
    <div className="relative w-full aspect-[8/5] rounded-xl overflow-hidden ring-1 ring-white/10 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.15),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.12),transparent_40%)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]" style={{ backgroundSize: `${100/width}% ${100/height}%` }} />

      <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${width}, 1fr)`, gridTemplateRows: `repeat(${height}, 1fr)` }}>
        {cells.map(({ x, y, key }) => (
          <button
            key={key}
            className="relative group"
            onClick={() => onMove && onMove({ x, y })}
          >
            <span className="pointer-events-none absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
          </button>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {children}
      </div>
    </div>
  );
}

export default MapGrid;
