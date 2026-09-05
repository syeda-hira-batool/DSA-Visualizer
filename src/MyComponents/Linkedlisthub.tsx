import { Link } from 'react-router-dom';
import { linkedListTypes } from './Linkedlistoperations';
import './CSSFILES/Sorting.css';

export default function LinkedListHub() {
  return (
    <section className="dsv-page">
      <div className="dsv-inner">
        <Link to="/" className="dsv-back">
          ← back to modules
        </Link>

        <div className="dsv-hub-header">
          <span className="dsv-eyebrow">LIST · {linkedListTypes.length} types</span>
          <h1 className="dsv-hub-title">Linked Lists</h1>
          <p className="dsv-hub-sub">
            Pick a list type, then step through inserts, deletes, and searches one pointer move at a time.
          </p>
        </div>

        <div className="dsv-hub-grid">
          {linkedListTypes.map((list) => (
            <Link key={list.id} to={`/linkedlist/${list.id}`} className="dsv-algo-card">
              <h3>{list.name}</h3>
              <p>{list.description}</p>
              <div className="dsv-tag-row">
                <span className="dsv-tag">{list.operations.length} operations</span>
                <span className="dsv-tag">{list.id === 'doubly' ? 'bidirectional' : 'one-directional'}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}