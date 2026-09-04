import type { LeetLink } from './Types';

interface Props {
  links: LeetLink[];
  algorithmName: string;
}

export default function LeetLinks({ links, algorithmName }: Props) {
  return (
    <div>
      <p className="dsv-leet-intro">
        Practice problems related to {algorithmName} on the official LeetCode site.
      </p>
      {links.map((link) => (
        <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="dsv-leet-link">
          <span>{link.title}</span>
          <span className={`dsv-leet-diff ${link.difficulty.toLowerCase()}`}>{link.difficulty}</span>
        </a>
      ))}
    </div>
  );
}