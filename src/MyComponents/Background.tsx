import { useEffect, useState } from 'react';
import './CSSFILES/Background.css';

const WORD = 'DSA VISUALIZER';

const PASTELS = [
  '#C8DFDB', '#F599C6', '#FFB6A6', '#FFEBD3', '#9BCEC1',
  '#CFEBFF', '#FFFCE1', '#FFDDB0', '#FFBE91',
  '#D8C8FF', '#B8ECD0', '#FFD1DC', '#E4D9FF',
];

const COMPARTMENT_H = 34; // height of one stack compartment / queue cell
const STACK_WIDTH = 88; // width of the vertical stack box
const CELL_W = 34; // width of a queue cell
const SPACE_W = 18; // width of the gap cell (for the space in the word)
const GAP = 90; // horizontal gap between the stack and the queue
const TILE_SIZE = 26; // size of the small flying letter tile

const STAGGER = 480; // ms between each pop
const FLIGHT_DURATION = 420; // ms for a letter to travel — must stay < STAGGER
const HOLD = 1600; // ms fully formed before fading
const FADE = 600; // ms fade-out transition

export default function Background() {
  const letters = WORD.split(''); // full word incl. space, for the queue layout
  const stackLetters = letters.filter((ch) => ch !== ' '); // what actually sits in the stack

  const [poppedCount, setPoppedCount] = useState(0); // how many left the stack
  const [landedCount, setLandedCount] = useState(0); // how many arrived in the queue
  const [fading, setFading] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timeouts: number[] = [];
    const total = stackLetters.length;

    function popStep(k: number) {
      if (cancelled) return;
      setPoppedCount(k + 1);
      timeouts.push(
        window.setTimeout(() => {
          if (!cancelled) setLandedCount(k + 1);
        }, FLIGHT_DURATION)
      );

      if (k + 1 < total) {
        timeouts.push(window.setTimeout(() => popStep(k + 1), STAGGER));
      } else {
        timeouts.push(
          window.setTimeout(() => {
            if (cancelled) return;
            setFading(true);
            timeouts.push(
              window.setTimeout(() => {
                if (cancelled) return;
                setFading(false);
                setPoppedCount(0);
                setLandedCount(0);
                setCycle((c) => c + 1);
              }, FADE)
            );
          }, HOLD)
        );
      }
    }

    timeouts.push(window.setTimeout(() => popStep(0), STAGGER));

    return () => {
      cancelled = true;
      timeouts.forEach((t) => window.clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle]);

  // map each letter in the full word to its x-offset within the queue,
  // and to its index within the stack (si), skipping the space
  let cursor = 0;
  let si = 0;
  const queueMeta = letters.map((ch) => {
    const x = cursor;
    if (ch === ' ') {
      cursor += SPACE_W;
      return { x, w: SPACE_W, si: -1, ch };
    }
    cursor += CELL_W;
    const meta = { x, w: CELL_W, si, ch };
    si += 1;
    return meta;
  });
  const queueWidth = cursor;

  const stackH = stackLetters.length * COMPARTMENT_H;
  const flyingIndex = poppedCount > landedCount ? poppedCount - 1 : -1;
  const flyingMeta = flyingIndex >= 0 ? queueMeta.find((m) => m.si === flyingIndex) : undefined;

  const originX = STACK_WIDTH / 2 - TILE_SIZE / 2;
  const originY = (COMPARTMENT_H - TILE_SIZE) / 2;
  const queueColOffsetY = (stackH - CELL_W) / 2; // queue is vertically centered against the stack
  const targetY = queueColOffsetY + (CELL_W - TILE_SIZE) / 2;

  return (
    <div className="dsa-bg-page" aria-hidden="true">
      <h1 className="sr-only">DSA Visualizer</h1>

      <div key={cycle} className="dsa-composition" style={{ opacity: fading ? 0 : 1, transitionDuration: `${FADE}ms` }}>
        {/* the stack: one compartment per letter, top pops first */}
        <div className="dsa-stack-col" style={{ width: STACK_WIDTH }}>
          <div className="dsa-stack-box" style={{ width: STACK_WIDTH, height: stackH }}>
            {stackLetters.map((ch, i) => (
              <div
                key={i}
                className={`dsa-compartment ${i < poppedCount ? 'is-popped' : ''}`}
                style={{ height: COMPARTMENT_H, backgroundColor: PASTELS[i % PASTELS.length] }}
              >
                <span>{ch}</span>
              </div>
            ))}
          </div>
          <span className="dsa-caption">stack</span>
        </div>

        {/* the flying letter currently in transit */}
        {flyingMeta && (
          <div
            key={flyingIndex}
            className="dsa-flyer"
            style={
              {
                width: TILE_SIZE,
                height: TILE_SIZE,
                backgroundColor: PASTELS[flyingIndex % PASTELS.length],
                animationDuration: `${FLIGHT_DURATION}ms`,
                '--ox': `${originX}px`,
                '--oy': `${originY}px`,
                '--tx': `${STACK_WIDTH + GAP + flyingMeta.x + (CELL_W - TILE_SIZE) / 2}px`,
                '--ty': `${targetY}px`,
              } as React.CSSProperties
            }
          >
            {stackLetters[flyingIndex]}
          </div>
        )}

        {/* the queue: fills left to right as letters land */}
        <div className="dsa-queue-col" style={{ marginLeft: GAP }}>
          <div className="dsa-queue-box" style={{ width: queueWidth, height: CELL_W }}>
            {queueMeta.map((m, i) =>
              m.ch === ' ' ? (
                <div key={i} style={{ width: m.w }} />
              ) : (
                <div
                  key={i}
                  className={`dsa-cell ${m.si < landedCount ? 'is-filled' : ''}`}
                  style={{
                    width: m.w,
                    backgroundColor: m.si < landedCount ? PASTELS[m.si % PASTELS.length] : 'transparent',
                  }}
                >
                  {m.si < landedCount && <span>{m.ch}</span>}
                </div>
              )
            )}
          </div>
          <span className="dsa-caption">queue</span>
        </div>
      </div>

      <p className="dsa-tagline">Step through data structures and algorithms one operation at a time.</p>
    </div>
  );
}