import { Link } from 'react-router-dom';
import './CSSFILES/Background.css';

const PASTELS = [
  '#C8DFDB', '#F599C6', '#FFB6A6', '#FFEBD3', '#9BCEC1',
  '#CFEBFF', '#FFFCE1', '#FFDDB0', '#FFBE91',
  '#D8C8FF', '#B8ECD0', '#FFD1DC', '#E4D9FF',
];

interface Category {
  title: string;
  tagline: string;
  count: number;
  available: boolean;
  color: string;
  path?: string;
}

const categories: Category[] = [
  { title: 'Sorting', tagline: 'Watch comparisons and swaps unfold, line by line.', count: 5, available: true, color: PASTELS[1], path: '/sorting' },
  { title: 'Linked List', tagline: 'Pointers, nodes, and the chains that connect them.', count: 2, available: true, color: PASTELS[5], path: '/linkedlist' },
  { title: 'Trees', tagline: 'Traversals, balancing, and hierarchical structure.', count: 0, available: false, color: PASTELS[4] },
  { title: 'Hash Maps', tagline: 'Buckets, collisions, and constant-time lookups.', count: 0, available: false, color: PASTELS[7] },
  { title: 'Graphs', tagline: 'BFS, DFS, and the shortest paths between nodes.', count: 0, available: false, color: PASTELS[9] },
  { title: 'Stacks & Queues', tagline: 'LIFO and FIFO structures in motion.', count: 0, available: false, color: PASTELS[2] },
];

export default function Categories() {
  return (
    <section id="visualize" className="dsa-bg-page dsa-cat-section">
      <h2 className="dsa-cat-heading">What do you want to visualize?</h2>
      <p className="dsa-cat-subheading">Pick a structure to start stepping through it.</p>

      <div className="dsa-cat-grid">
        {categories.map((cat) => {
          const card = (
            <div className={`dsa-cat-card ${cat.available ? 'is-available' : 'is-locked'}`}>
              <span className="dsa-cat-chip" style={{ backgroundColor: cat.color }} />
              <h3>{cat.title}</h3>
              <p>{cat.tagline}</p>
              <span className="dsa-cat-status">
                {cat.available ? `${cat.count} algorithms →` : 'coming soon'}
              </span>
            </div>
          );
          return cat.available && cat.path ? (
            <Link key={cat.title} to={cat.path} style={{ textDecoration: 'none', color: 'inherit' }}>
              {card}
            </Link>
          ) : (
            <div key={cat.title}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}