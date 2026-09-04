import { useState } from 'react';
import type { QuizQuestion } from './Types';

interface Props {
  questions: QuizQuestion[];
}

export default function Quiz({ questions }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const isCorrect = selected === q.correctIndex;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current === questions.length - 1) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="dsv-quiz-result">
        <div className="dsv-panel-label">quiz complete</div>
        <div className="dsv-quiz-score">
          {score}/{questions.length}
        </div>
        <p style={{ color: 'rgba(20,20,20,0.6)', maxWidth: 380, margin: '0 auto 1.25rem' }}>
          {pct >= 80
            ? 'Excellent work — you know this algorithm well.'
            : pct >= 50
              ? 'Solid attempt. Review the flashcards and try again.'
              : 'Worth another pass — check the flashcards tab first.'}
        </p>
        <button className="dsv-btn" onClick={handleRestart}>
          Retake quiz
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="dsv-quiz-meta">
        <span>
          question {current + 1} / {questions.length}
        </span>
        <span>score {score}</span>
      </div>

      <div className="dsv-progress" style={{ marginBottom: '1.25rem' }}>
        <div
          className="dsv-progress-fill"
          style={{ width: `${((current + (selected !== null ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <p className="dsv-quiz-question">{q.question}</p>

      <div className="dsv-quiz-options">
        {q.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isRight = idx === q.correctIndex;
          let cls = 'dsv-quiz-option';
          if (selected !== null) {
            if (isRight) cls += ' is-correct';
            else if (isSelected) cls += ' is-wrong';
            else cls += ' is-faded';
          }
          return (
            <button key={idx} className={cls} onClick={() => handleSelect(idx)} disabled={selected !== null}>
              <span>{opt}</span>
              {selected !== null && isRight && <span>✓</span>}
              {selected !== null && isSelected && !isRight && <span>✗</span>}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className={`dsv-quiz-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
          <strong>{isCorrect ? 'Correct — ' : 'Not quite — '}</strong>
          {q.explanation}
        </div>
      )}

      <button className="dsv-btn dsv-quiz-next" onClick={handleNext} disabled={selected === null}>
        {current === questions.length - 1 ? 'Finish' : 'Next question →'}
      </button>
    </div>
  );
}