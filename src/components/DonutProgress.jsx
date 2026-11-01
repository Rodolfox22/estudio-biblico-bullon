export default function DonutProgress({ pct, size = 56, stroke = 6 }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${pct}% completado`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} style={{ stroke: 'rgb(var(--line))' }} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          style={{ stroke: 'rgb(var(--p2))', transition: 'stroke-dashoffset 0.5s' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[0.7rem] font-semibold text-ink">{pct}%</span>
    </div>
  )
}
