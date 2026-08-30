import { useEffect, useState } from 'react';

const WORD = 'DSA VISUALIZER';

const PASTELS = [
  '#C8DFDB', '#F599C6', '#FFB6A6', '#FFEBD3', '#9BCEC1',
  '#CFEBFF', '#FFFCE1', '#FFDDB0', '#FFBE91',
  '#D8C8FF', '#B8ECD0', '#FFD1DC', '#E4D9FF',
];

const SLOT = 40; // px per letter slot
const SPACE_SLOT = 20; // px for the gap between DSA and VISUALIZER
const POP_DURATION = 520; // ms, must match .letter-pop animation-duration below
const STAGGER = 90; // ms between each letter's pop start
const HOLD = 1500; // ms fully formed before fading
const FADE = 550; // ms fade-out transition

export default function Background() {
  const letters = WORD.split('');
  const [cycle, setCycle] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const formEnd = (letters.length - 1) * STAGGER + POP_DURATION + HOLD;
    const fadeTimer = setTimeout(() => setFading(true), formEnd);
    const resetTimer = setTimeout(() => {
      setFading(false);
      setCycle((c) => c + 1);
    }, formEnd + FADE);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(resetTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle]);

  // precompute x offset (slot start) for every character, accounting for the wider space gap
  let cursor = 0;
  const slotX = letters.map((ch) => {
    const x = cursor;
    cursor += ch === ' ' ? SPACE_SLOT : SLOT;
    return x;
  });
  const rowWidth = cursor;

  return (
    <div
      aria-hidden="true"
      className="pastel-grid-bg relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-hairline py-10"
      style={{ minHeight: 150 }}
    >
      <div className="flex items-center gap-6 sm:gap-10">
        {/* stack icon */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative h-14 w-11">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute left-1/2 h-3 w-11 -translate-x-1/2 rounded-md border border-black/10 shadow-sm"
                style={{
                  bottom: i * 9,
                  backgroundColor: PASTELS[(i * 3) % PASTELS.length],
                  transform: `translateX(-50%) rotate(${(i % 2 === 0 ? 1 : -1) * (2 + i)}deg)`,
                }}
              />
            ))}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50">stack</span>
        </div>

        {/* letters flying into their queue slots */}
        <div className="flex flex-col items-center gap-2">
          <div
            key={cycle}
            className={`relative transition-opacity ease-in ${fading ? 'opacity-0' : 'opacity-100'}`}
            style={{ width: rowWidth, height: 48, transitionDuration: `${FADE}ms` }}
          >
            {letters.map((ch, i) =>
              ch === ' ' ? null : (
                <div
                  key={i}
                  className="absolute top-0 flex h-11 items-center justify-center rounded-lg border border-black/10 font-mono text-lg font-bold text-ink/80 shadow-sm letter-pop"
                  style={
                    {
                      left: 0,
                      width: SLOT - 4,
                      backgroundColor: PASTELS[i % PASTELS.length],
                      animationDelay: `${i * STAGGER}ms`,
                      animationDuration: `${POP_DURATION}ms`,
                      '--tx': `${slotX[i]}px`,
                      '--sx': `${-((i % 4) * 3)}px`,
                      '--srot': `${((i % 5) - 2) * 7}deg`,
                    } as React.CSSProperties
                  }
                >
                  {ch}
                </div>
              )
            )}
            {/* dashed queue slots as a guide beneath the letters */}
            <div className="absolute top-0 -z-10 flex h-11" style={{ width: rowWidth }}>
              {letters.map((ch, i) =>
                ch === ' ' ? (
                  <div key={i} style={{ width: SPACE_SLOT }} />
                ) : (
                  <div
                    key={i}
                    className="h-11 rounded-lg border border-dashed border-ink/15"
                    style={{ width: SLOT - 4, marginRight: 4 }}
                  />
                )
              )}
            </div>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50">queue</span>
        </div>
      </div>
    </div>
  );
}
