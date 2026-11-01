/**
 * Static, self-authored isometric fallback for the Tech Orbit (DESIGN.md §11).
 * Shown when WebGL is unavailable, the device is low-power, or the section is
 * far from the viewport. Pure SVG + a CSS float animation — no three.js.
 */
export function OrbitFallback({ labels }: { labels: readonly string[] }) {
  const nodes = labels.slice(0, 6)
  const radius = 118
  const center = 160

  return (
    <div className="flex h-full w-full items-center justify-center" role="img" aria-label="Ilustrasi statis orbit teknologi">
      <svg viewBox="0 0 320 320" className="h-full max-h-[420px] w-full max-w-[420px]">
        <defs>
          <linearGradient id="orbit-core" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5B7BF0" />
            <stop offset="100%" stopColor="#1B35A8" />
          </linearGradient>
          <radialGradient id="orbit-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8FB4FF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#8FB4FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={center} cy={center} r="150" fill="url(#orbit-glow)" />
        <ellipse
          cx={center}
          cy={center}
          rx={radius}
          ry={radius * 0.38}
          fill="none"
          stroke="rgba(20,40,110,.18)"
          strokeWidth="1"
          transform={`rotate(-18 ${center} ${center})`}
        />
        <ellipse
          cx={center}
          cy={center}
          rx={radius * 0.82}
          ry={radius * 0.3}
          fill="none"
          stroke="rgba(20,40,110,.14)"
          strokeWidth="1"
          transform={`rotate(24 ${center} ${center})`}
        />

        <g style={{ animation: 'hm-float 6s ease-in-out infinite' }}>
          <path
            d="M160 108 L206 134 L206 186 L160 212 L114 186 L114 134 Z"
            fill="url(#orbit-core)"
            opacity="0.92"
          />
          <path d="M160 108 L206 134 L160 160 L114 134 Z" fill="#ffffff" opacity="0.18" />
        </g>

        {nodes.map((label, index) => {
          const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2
          const x = center + Math.cos(angle) * radius
          const y = center + Math.sin(angle) * radius * 0.38
          return (
            <g key={label}>
              <circle cx={x} cy={y} r="7" fill="#ffffff" stroke="rgba(20,40,110,.22)" />
              <text
                x={x}
                y={y - 14}
                textAnchor="middle"
                fontSize="10"
                fontWeight="500"
                fill="#6B7280"
                letterSpacing="0.06em"
              >
                {label.toUpperCase()}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
