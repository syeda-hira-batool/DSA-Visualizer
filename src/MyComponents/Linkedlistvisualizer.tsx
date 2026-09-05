import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getListTypeById } from './Linkedlistoperations';
import Quiz from './Quiz';
import Flashcards from './Flashcards';
import LeetLinks from './LeetLinks';
import './CSSFILES/Sorting.css';
import './CSSFILES/LinkedList.css';

const TABS = ['Visualize', 'Quiz', 'Flashcards', 'LeetCode'] as const;
type Tab = (typeof TABS)[number];

const POINTER_COLOR = '#07a3b2';
const HIGHLIGHT_COLOR = '#4a9b6e';
const NEW_COLOR = '#8a6fd8';

export default function LinkedListVisualizer() {
  const { listId } = useParams();
  const list = listId ? getListTypeById(listId) : undefined;

  const [sourceArray, setSourceArray] = useState<number[]>([4, 8, 15, 16, 23]);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [opId, setOpId] = useState('insert-beginning');
  const [valueInput, setValueInput] = useState('10');
  const [positionInput, setPositionInput] = useState('0');
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [tab, setTab] = useState<Tab>('Visualize');
  const intervalRef = useRef<number | null>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const selectedOp = list ? list.operations.find((o) => o.id === opId) ?? list.operations[0] : undefined;

  const steps = useMemo(() => {
    if (!selectedOp) return [];
    const value = Number(valueInput);
    const position = Number(positionInput);
    return selectedOp.generateSteps(sourceArray, Number.isNaN(value) ? 0 : value, Number.isNaN(position) ? 0 : position);
  }, [selectedOp, sourceArray, valueInput, positionInput]);

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [sourceArray, opId, valueInput, positionInput, list?.id]);

  useEffect(() => {
    // reset to the first operation whenever the list type itself changes
    if (list) setOpId(list.operations[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list?.id]);

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

  if (!list || !selectedOp) return <Navigate to="/linkedlist" replace />;

  const step = steps[stepIndex];
  const activeLine = step?.codeLine ?? 1;
  const arrow = list.id === 'doubly' ? '↔' : '→';

  const handleArraySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = inputValue
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (parts.length > 20) {
      setInputError('Keep it to 20 nodes or fewer for a readable animation.');
      return;
    }
    const nums = parts.map(Number);
    if (nums.some((n) => Number.isNaN(n))) {
      setInputError('Only numbers are allowed, e.g. 4, 8, 15, 16, 23');
      return;
    }
    setInputError('');
    setSourceArray(nums);
  };

  return (
    <section className="dsv-page">
      <div className="dsv-inner">
        <Link to="/linkedlist" className="dsv-back">
          ← back to linked lists
        </Link>

        <div className="dsv-viz-header">
          <div>
            <span className="dsv-eyebrow">LIST · {list.id === 'doubly' ? 'bidirectional' : 'one-directional'}</span>
            <h1 className="dsv-viz-title">{list.name}</h1>
            <p className="dsv-viz-desc">{list.description}</p>
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
              <div className="dsv-panel-label">build the list</div>
              <form onSubmit={handleArraySubmit} className="dsv-input-row">
                <input
                  className="dsv-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g. 4, 8, 15, 16, 23 (leave empty for an empty list)"
                />
                <button type="submit" className="dsv-btn">
                  Build List
                </button>
              </form>
              {inputError && <p className="dsv-error">{inputError}</p>}
              <p className="dsv-current-array">
                current: {sourceArray.length ? `[${sourceArray.join(', ')}]` : '(empty list)'}
              </p>

              <div className="dsv-panel-label" style={{ marginTop: '1.25rem' }}>
                operation
              </div>
              <div className="dsv-op-grid">
                {list.operations.map((op) => (
                  <button
                    key={op.id}
                    className={`dsv-op-btn ${op.id === selectedOp.id ? 'is-active' : ''}`}
                    onClick={() => setOpId(op.id)}
                  >
                    {op.name}
                  </button>
                ))}
              </div>

              {(selectedOp.needsValue || selectedOp.needsPosition) && (
                <div className="dsv-param-row">
                  {selectedOp.needsValue && (
                    <div className="dsv-param-field">
                      <label>{selectedOp.valueLabel ?? 'value to insert'}</label>
                      <input
                        className="dsv-input"
                        type="number"
                        value={valueInput}
                        onChange={(e) => setValueInput(e.target.value)}
                      />
                    </div>
                  )}
                  {selectedOp.needsPosition && (
                    <div className="dsv-param-field">
                      <label>position (0-indexed)</label>
                      <input
                        className="dsv-input"
                        type="number"
                        min={0}
                        value={positionInput}
                        onChange={(e) => setPositionInput(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="dsv-viz-grid">
              <div className="dsv-panel">
                <div className="dsv-panel-label">visualization</div>
                {step && step.nodes.length > 0 ? (
                  <div className="dsv-ll-row">
                    {step.nodes.map((node, idx) => (
                      <Fragment key={node.id}>
                        <div
                          className={`dsv-ll-node ${idx === step.pointerIndex ? 'is-pointer' : ''} ${
                            idx === step.highlightIndex ? 'is-highlight' : ''
                          } ${idx === step.newIndex ? 'is-new' : ''}`}
                        >
                          {node.value}
                          <span className="dsv-ll-node-idx">{idx}</span>
                        </div>
                        <span className="dsv-ll-arrow">{arrow}</span>
                      </Fragment>
                    ))}
                    <span className="dsv-ll-null">NULL</span>
                  </div>
                ) : (
                  <div className="dsv-ll-row">
                    <span className="dsv-ll-empty">head → NULL (empty list)</span>
                  </div>
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
                    <span className="dsv-legend-dot" style={{ backgroundColor: POINTER_COLOR }} /> current pointer
                  </span>
                  <span className="dsv-legend-item">
                    <span className="dsv-legend-dot" style={{ backgroundColor: HIGHLIGHT_COLOR }} /> found / target
                  </span>
                  <span className="dsv-legend-item">
                    <span className="dsv-legend-dot" style={{ backgroundColor: NEW_COLOR }} /> new node
                  </span>
                </div>
              </div>

              <div className="dsv-panel">
                <div className="dsv-panel-label">{selectedOp.id}.cpp</div>
                <div className="dsv-code">
                  {selectedOp.code.map((line, idx) => {
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
            <Quiz questions={list.quiz} />
          </div>
        )}

        {tab === 'Flashcards' && (
          <div className="dsv-panel">
            <Flashcards cards={list.flashcards} />
          </div>
        )}

        {tab === 'LeetCode' && (
          <div className="dsv-panel">
            <LeetLinks links={list.leetLinks} algorithmName={list.name} />
          </div>
        )}
      </div>
    </section>
  );
}