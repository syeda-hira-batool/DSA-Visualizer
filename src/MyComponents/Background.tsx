import { useEffect, useState } from 'react';
import './CSSFILES/Background.css';

const WORD = 'DSA VISUALIZER';

const PASTELS = [
  '#C8DFDB', '#F599C6', '#FFB6A6', '#FFEBD3', '#9BCEC1',
  '#CFEBFF', '#FFFCE1', '#FFDDB0', '#FFBE91',
  '#D8C8FF', '#B8ECD0', '#FFD1DC', '#E4D9FF',
];

const SLOT = 56; // px per letter slot in the queue
const SPACE_SLOT = 26; // px for the gap between DSA and VISUALIZER
const TILE_W = 48;
const TILE_H = 56;
const ROW_HEIGHT = 190; // total height of the stack+queue row
const TILE_TOP = (ROW_HEIGHT - TILE_H) / 2;

const STACK_ZONE_WIDTH = 150; // width reserved for the pile of cards
const GAP = 100; // gap between the stack and the first queue slot

const POP_DURATION = 620; // ms — must match animation-duration set below
const STAGGER = 100; // ms between each letter's pop start
const STACK_LEAVE_DURATION = 220; // ms for a card to lift off the pile
const HOLD = 1700; // ms fully formed before fading
const FADE = 600; // ms fade-out transition

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

  // target x offset for each letter's queue slot
  let cursor = 0;
  const slotX = letters.map((ch) => {
    const x = STACK_ZONE_WIDTH + GAP + cursor;
    cursor += ch === ' ' ? SPACE_SLOT : SLOT;
    return x;
  });
  const queueWidth = cursor;
  const rowWidth = STACK_ZONE_WIDTH + GAP + queueWidth + 20;

  // fanned "in the pile" pose for a given letter index — shared by the
  // static stack card and the flying letter's starting position, so the
  // handoff between them looks seamless.
  const stackPose = (i: number) => ({
    x: 20 + (i % 3) * 14,
    y: -Math.floor(i / 3) * 5,
    rot: ((i % 5) - 2) * 6,
  });

  return (
    <div className="dsa-bg-page" aria-hidden="true">
      <h1 className="sr-only">DSA Visualizer</h1>

      <div className="dsa-hero-row" style={{ width: rowWidth, height: ROW_HEIGHT }}>
        {/* the pile that holds every letter before it pops out */}
        <div className="dsa-stack-tray" style={{ width: STACK_ZONE_WIDTH }} />

        <div key={cycle} style={{ opacity: fading ? 0 : 1, transitionDuration: `${FADE}ms` }} className="dsa-cycle">
          {letters.map((ch, i) => {
            if (ch === ' ') return null;
            const pose = stackPose(i);
            return (
              <div
                key={`card-${i}`}
                className="dsa-stack-card"
                style={{
                  top: TILE_TOP,
                  width: TILE_W,
                  height: TILE_H,
                  backgroundColor: PASTELS[i % PASTELS.length],
                  zIndex: letters.length - i,
                  transform: `translate(${pose.x}px, ${pose.y}px) rotate(${pose.rot}deg)`,
                  animationDelay: `${i * STAGGER}ms`,
                  animationDuration: `${STACK_LEAVE_DURATION}ms`,
                }}
              >
                {ch}
              </div>
            );
          })}

          {/* dashed queue-slot guides */}
          <div className="dsa-queue-tray" style={{ left: STACK_ZONE_WIDTH + GAP, top: TILE_TOP, width: queueWidth }}>
            {letters.map((ch, i) =>
              ch === ' ' ? (
                <div key={`slot-${i}`} style={{ width: SPACE_SLOT }} />
              ) : (
                <div key={`slot-${i}`} className="dsa-slot" style={{ width: SLOT - 6, marginRight: 6 }} />
              )
            )}
          </div>

          {/* letters flying from the pile into their queue slot */}
          {letters.map((ch, i) => {
            if (ch === ' ') return null;
            const pose = stackPose(i);
            return (
              <div
                key={`fly-${i}`}
                className="dsa-letter"
                style={
                  {
                    top: TILE_TOP,
                    width: TILE_W,
                    height: TILE_H,
                    backgroundColor: PASTELS[i % PASTELS.length],
                    animationDelay: `${i * STAGGER}ms`,
                    animationDuration: `${POP_DURATION}ms`,
                    '--sx': `${pose.x}px`,
                    '--sy': `${pose.y}px`,
                    '--srot': `${pose.rot}deg`,
                    '--tx': `${slotX[i]}px`,
                  } as React.CSSProperties
                }
              >
                {ch}
              </div>
            );
          })}
        </div>

        <span className="dsa-caption" style={{ left: STACK_ZONE_WIDTH / 2, top: TILE_TOP + TILE_H + 14 }}>
          stack
        </span>
        <span
          className="dsa-caption"
          style={{ left: STACK_ZONE_WIDTH + GAP + queueWidth / 2, top: TILE_TOP + TILE_H + 14 }}
        >
          queue
        </span>
      </div>

      <p className="dsa-tagline">Step through data structures and algorithms one operation at a time.</p>
    </div>
  );
}