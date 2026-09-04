import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getAlgorithmById } from './Sortingalgorithms';
import type { SortStep } from './Types';
import Quiz from './Quiz';
import Flashcards from './Flashcards';
import LeetLinks from './LeetLinks';
import './CSSFILES/Sorting.css';

const DEFAULT_ARRAY = [8, 3, 5, 1, 9, 2, 7];
const TABS = ['Visualize', 'Quiz', 'Flashcards', 'LeetCode'] as const;
type Tab = (typeof TABS)[number];

const COMPARE_COLOR = '#c1584c';
const SWAP_COLOR = '#07a3b2';
const SORTED_COLOR = '#4a9b6e';
const IDLE_COLOR = '#e0a050';

function randomArray(): number[] {
  const len = 6 + Math.floor(Math.random() * 5);
  return Array.from({ length: len }, () => 1 + Math.floor(Math.random() * 60));
}

function barColor(step: SortStep, idx: number) {
  if (step.sorted.includes(idx)) return SORTED_COLOR;
  if (step.swapping.includes(idx)) return SWAP_COLOR;
  if (step.comparing.includes(idx)) return COMPARE_COLOR;
  return IDLE_COLOR;
}

export default function SortVisualizer() {
  const { algoId } = useParams();
  const algo = algoId ? getAlgorithmById(algoId) : undefined;

  const [sourceArray, setSourceArray] = useState<number[]>(DEFAULT_ARRAY);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [tab, setTab] = useState<Tab>('Visualize');
  const intervalRef = useRef<number | null>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const steps = useMemo(() => (algo ? algo.generateSteps(sourceArray) : []), [algo, sourceArray]);

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [sourceArray, algo?.id]);

  useEffect(() => {
    if (!isPlaying) return;
    const delay = 900 / speed;
    intervalRef.current = window.setInterval(() => {
      setStepIndex((i) => {
        if (i >= steps.length - 1) {
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, delay);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  useEffect(() => {
    activeLineRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [stepIndex]);

  if (!algo) return <Navigate to="/sorting" replace />;

  const step = steps[stepIndex];
  const activeLine = step?.codeLine ?? 1;
  const currentArray = step ? step.array : sourceArray;
  const maxVal = Math.max(...currentArray, 1);

  const handleArraySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = inputValue
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (parts.length < 2) {
      setInputError('Enter at least 2 numbers, separated by commas.');
      return;
    }
    if (parts.length > 20) {
      setInputError('Keep it to 20 elements or fewer for a readable animation.');
      return;
    }
    const nums = parts.map(Number);
    if (nums.some((n) => Number.isNaN(n))) {
      setInputError('Only numbers are allowed, e.g. 5, 3, 8, 1, 9');
      return;
    }
    setInputError('');
    setSourceArray(nums);
  };

  return (
    <section className="dsv-page">
      <div className="dsv-inner">
        <Link to="/sorting" className="dsv-back">
          ← back to sorting
        </Link>

        <div className="dsv-viz-header">
          <div>
            <span className="dsv-eyebrow">
              SORT · {algo.stable ? 'stable' : 'unstable'} · {algo.spaceComplexity} space
            </span>
            <h1 className="dsv-viz-title">{algo.name}</h1>
            <p className="dsv-viz-desc">{algo.shortDescription}</p>
          </div>
          <div className="dsv-tag-row">
            <span className="dsv-tag">best {algo.timeComplexityBest}</span>
            <span className="dsv-tag">avg {algo.timeComplexityAvg}</span>
            <span className="dsv-tag">worst {algo.timeComplexityWorst}</span>
          </div>
        </div>

        <div className="dsv-tabs">
          {TABS.map((t) => (
            <button key={t} className={`dsv-tab ${tab === t ? 'is-active' : ''}`} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'Visualize' && (
          <>
            <div className="dsv-panel">
              <div className="dsv-panel-label">enter array elements</div>
              <form onSubmit={handleArraySubmit} className="dsv-input-row">
                <input
                  className="dsv-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g. 8, 3, 5, 1, 9, 2"
                />
                <button type="submit" className="dsv-btn">
                  Visualize
                </button>
              </form>
              {inputError && <p className="dsv-error">{inputError}</p>}
              <p className="dsv-current-array">current: [{sourceArray.join(', ')}]</p>
            </div>

            <div className="dsv-viz-grid">
              <div className="dsv-panel">
                <div className="dsv-panel-label">visualization</div>
                {step ? (
                  <div className="dsv-bars">
                    {step.array.map((val, idx) => (
                      <div key={idx} className="dsv-bar-col">
                        <span className="dsv-bar-value">{val}</span>
                        <div
                          className="dsv-bar"
                          style={{ height: `${(val / maxVal) * 100}%`, backgroundColor: barColor(step, idx) }}
                        />
                        <span className="dsv-bar-idx">{idx}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No steps.</p>
                )}
                <p className="dsv-note">{step?.note}</p>

                <div className="dsv-controls">
                  <div className="dsv-controls-row">
                    <button
                      className="dsv-btn-icon"
                      onClick={() => {
                        setIsPlaying(false);
                        setStepIndex(0);
                      }}
                      disabled={steps.length === 0}
                      aria-label="Reset"
                    >
                      ⟲
                    </button>
                    <button
                      className="dsv-btn-icon"
                      onClick={() => {
                        setIsPlaying(false);
                        setStepIndex((i) => Math.max(0, i - 1));
                      }}
                      disabled={steps.length === 0 || stepIndex === 0}
                      aria-label="Previous step"
                    >
                      ◁
                    </button>
                    <button
                      className="dsv-btn"
                      onClick={() => setIsPlaying((p) => !p)}
                      disabled={steps.length === 0}
                      style={{ minWidth: 84 }}
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button
                      className="dsv-btn-icon"
                      onClick={() => {
                        setIsPlaying(false);
                        setStepIndex((i) => Math.min(steps.length - 1, i + 1));
                      }}
                      disabled={steps.length === 0 || stepIndex >= steps.length - 1}
                      aria-label="Next step"
                    >
                      ▷
                    </button>
                    <button
                      className="dsv-btn-icon"
                      onClick={() => setSourceArray(randomArray())}
                      aria-label="Randomize array"
                    >
                      ⤮
                    </button>
                    <span className="dsv-step-count">
                      step {Math.min(stepIndex + 1, steps.length)} / {steps.length || 0}
                    </span>
                  </div>

                  <div className="dsv-speed-row">
                    <span className="dsv-speed-label">speed</span>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                    />
                    <span className="dsv-speed-label" style={{ textAlign: 'right' }}>
                      {speed}x
                    </span>
                  </div>

                  <div className="dsv-progress">
                    <div
                      className="dsv-progress-fill"
                      style={{ width: steps.length ? `${((stepIndex + 1) / steps.length) * 100}%` : '0%' }}
                    />
                  </div>
                </div>

                <div className="dsv-legend">
                  <span className="dsv-legend-item">
                    <span className="dsv-legend-dot" style={{ backgroundColor: COMPARE_COLOR }} /> comparing
                  </span>
                  <span className="dsv-legend-item">
                    <span className="dsv-legend-dot" style={{ backgroundColor: SWAP_COLOR }} /> swapping / shifting
                  </span>
                  <span className="dsv-legend-item">
                    <span className="dsv-legend-dot" style={{ backgroundColor: SORTED_COLOR }} /> sorted
                  </span>
                  <span className="dsv-legend-item">
                    <span className="dsv-legend-dot" style={{ backgroundColor: IDLE_COLOR }} /> untouched
                  </span>
                </div>
              </div>

              <div className="dsv-panel">
                <div className="dsv-panel-label">{algo.id}.cpp</div>
                <div className="dsv-code">
                  {algo.code.map((line, idx) => {
                    const lineNo = idx + 1;
                    const isActive = lineNo === activeLine;
                    return (
                      <div
                        key={idx}
                        ref={isActive ? activeLineRef : undefined}
                        className={`dsv-code-line ${isActive ? 'is-active' : ''}`}
                      >
                        <span className="dsv-code-ln">{lineNo}</span>
                        <span className="dsv-code-text">{line}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'Quiz' && (
          <div className="dsv-panel">
            <Quiz questions={algo.quiz} />
          </div>
        )}

        {tab === 'Flashcards' && (
          <div className="dsv-panel">
            <Flashcards cards={algo.flashcards} />
          </div>
        )}

        {tab === 'LeetCode' && (
          <div className="dsv-panel">
            <LeetLinks links={algo.leetLinks} algorithmName={algo.name} />
          </div>
        )}
      </div>
    </section>
  );
}