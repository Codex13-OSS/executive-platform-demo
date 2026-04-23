const NODES = [
  [6, 10], [15, 22], [24, 14], [33, 28], [42, 18], [51, 32], [60, 16], [69, 30],
  [78, 20], [87, 34], [13, 48], [22, 62], [31, 52], [40, 66], [49, 54], [58, 68],
  [67, 56], [76, 70], [85, 60], [94, 74],
];

const LINKS = [
  [0, 1], [1, 2], [2, 4], [4, 6], [6, 8], [8, 9], [1, 3], [3, 5], [5, 7], [7, 9],
  [10, 12], [12, 14], [14, 16], [16, 18], [11, 13], [13, 15], [15, 17], [17, 19],
  [2, 12], [4, 14], [6, 16], [8, 18], [3, 13], [5, 15], [7, 17],
];

export default function AmbientNetwork() {
  return (
    <svg className="ambient-network" viewBox="0 0 100 80" preserveAspectRatio="none" aria-hidden="true">
      {LINKS.map(([a, b], idx) => (
        <line
          key={`l-${idx}`}
          x1={NODES[a][0]}
          y1={NODES[a][1]}
          x2={NODES[b][0]}
          y2={NODES[b][1]}
          className="network-link"
        />
      ))}
      {NODES.map(([x, y], idx) => (
        <circle key={`n-${idx}`} cx={x} cy={y} r={idx % 9 === 0 ? 0.8 : 0.55} className={`network-point p-${idx % 4}`} />
      ))}
      <circle className="network-traveler t1" cx="12" cy="22" r="0.65" />
      <circle className="network-traveler t2" cx="48" cy="54" r="0.65" />
      <circle className="network-traveler t3" cx="74" cy="30" r="0.65" />
    </svg>
  );
}
