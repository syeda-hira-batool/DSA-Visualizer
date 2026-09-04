import { useState } from 'react';
import type { Flashcard } from './Types';

interface Props {
  cards: Flashcard[];
}

export default function Flashcards({ cards }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];

  const go = (dir: 1 | -1) => {
    setFlipped(false);
    setIndex((i) => (i + dir + cards.length) % cards.length);
  };

  return (
    <div>
      <div className="dsv-flash-meta">
        card {index + 1} / {cards.length} — click to flip
      </div>

      <div className="dsv-flash-card" onClick={() => setFlipped((f) => !f)}>
        <div className="dsv-flash-inner" style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          <div className="dsv-flash-face front">
            <span className="dsv-flash-tag">term</span>
            <span className="dsv-flash-front-text">{card.front}</span>
          </div>
          <div className="dsv-flash-face back">
            <span className="dsv-flash-tag">definition</span>
            <span className="dsv-flash-back-text">{card.back}</span>
          </div>
        </div>
      </div>

      <div className="dsv-flash-nav">
        <button className="dsv-btn-icon" onClick={() => go(-1)} aria-label="Previous card">
          ←
        </button>
        <div className="dsv-flash-dots">
          {cards.map((_, i) => (
            <span key={i} className={`dsv-flash-dot ${i === index ? 'is-active' : ''}`} />
          ))}
        </div>
        <button className="dsv-btn-icon" onClick={() => go(1)} aria-label="Next card">
          →
        </button>
      </div>
    </div>
  );
}