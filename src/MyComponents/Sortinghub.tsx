import { Link } from 'react-router-dom';
import { sortingAlgorithms } from './Sortingalgorithms';
import './CSSFILES/Sorting.css';

export default function SortingHub() {
  return (
    <section className="dsv-page">
      <div className="dsv-inner">
        <Link to="/" className="dsv-back">
          ← back to modules
        </Link>

        <div className="dsv-hub-header">
          <span className="dsv-eyebrow">SORT · {sortingAlgorithms.length} algorithms</span>
          <h1 className="dsv-hub-title">Sorting Algorithms</h1>
          <p className="dsv-hub-sub">
            Pick an algorithm to enter your own array, run the animation, and see the matching source line
            highlight on every step.
          </p>
        </div>

        <div className="dsv-hub-grid">
          {sortingAlgorithms.map((algo) => (
            <Link key={algo.id} to={`/sorting/${algo.id}`} className="dsv-algo-card">
              <h3>{algo.name}</h3>
              <p>{algo.shortDescription}</p>
              <div className="dsv-tag-row">
                <span className="dsv-tag">best {algo.timeComplexityBest}</span>
                <span className="dsv-tag">avg {algo.timeComplexityAvg}</span>
                <span className="dsv-tag">worst {algo.timeComplexityWorst}</span>
                <span className="dsv-tag">{algo.stable ? 'stable' : 'unstable'}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}