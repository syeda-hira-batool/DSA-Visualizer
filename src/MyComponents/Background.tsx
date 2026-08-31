import { useEffect, useState } from 'react';
import './CSSFILES/Background.css';

const WORD = 'DSA VISUALIZER';

const PASTELS = [
  '#C8DFDB', '#F599C6', '#FFB6A6', '#FFEBD3', '#9BCEC1',
  '#CFEBFF', '#FFFCE1', '#FFDDB0', '#FFBE91',
  '#D8C8FF', '#B8ECD0', '#FFD1DC', '#E4D9FF',
];

const SLOT = 40; // px per letter slot
const SPACE_SLOT = 20; // px for the gap between DSA and VISUALIZER
const POP_DURATION = 520; // ms — must match animation-duration set below
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

  // precompute each letter's target x offset, giving the space a narrower gap
  let cursor = 0;
  const slotX = letters.map((ch) => {
    const x = cursor;
    cursor += ch === ' ' ? SPACE_SLOT : SLOT;
    return x;
  });
  const rowWidth = cursor;

  return (
    <div className="dsa-bg-panel" aria-hidden="true">
      <div className="dsa-bg-row">
        {/* stack icon the letters "pop" out of */}
        <div className="dsa-stack-wrap">
          <div className="dsa-stack">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="dsa-stack-plate"
                style={{
                  bottom: i * 9,
                  backgroundColor: PASTELS[(i * 3) % PASTELS.length],
                  transform: `translateX(-50%) rotate(${(i % 2 === 0 ? 1 : -1) * (2 + i)}deg)`,
                }}
              />
            ))}
          </div>
          <span className="dsa-caption">stack</span>
        </div>

        {/* letters flying into their queue slots, spelling the heading */}
        <div className="dsa-queue-wrap">
          <div
            key={cycle}
            className="dsa-letters"
            style={{
              width: rowWidth,
              opacity: fading ? 0 : 1,
              transitionDuration: `${FADE}ms`,
            }}
          >
            {letters.map((ch, i) =>
              ch === ' ' ? null : (
                <div
                  key={i}
                  className="dsa-letter"
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

            {/* dashed queue-slot guides behind the letters */}
            <div className="dsa-slots" style={{ width: rowWidth }}>
              {letters.map((ch, i) =>
                ch === ' ' ? (
                  <div key={i} style={{ width: SPACE_SLOT }} />
                ) : (
                  <div
                    key={i}
                    className="dsa-slot"
                    style={{ width: SLOT - 4, marginRight: 4 }}
                  />
                )
              )}
            </div>
          </div>
          <span className="dsa-caption">queue</span>
        </div>
      </div>
    </div>
  );
}