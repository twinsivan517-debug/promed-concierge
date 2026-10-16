type Props = { speaking: boolean; walking: boolean };

const CURLS: [number, number, number][] = [
  [46, 92, 14], [39, 112, 13], [44, 130, 12], [36, 146, 12], [45, 162, 11], [38, 178, 10], [48, 190, 9],
  [154, 92, 14], [161, 112, 13], [156, 130, 12], [164, 146, 12], [155, 162, 11], [162, 178, 10], [152, 190, 9],
  [60, 60, 15], [80, 42, 16], [103, 36, 17], [126, 42, 16], [144, 60, 15],
];

export function Avatar({ speaking, walking }: Props) {
  return (
    <svg
      viewBox="0 0 200 360"
      className={`avatar h-full w-auto overflow-visible ${speaking ? "is-speaking" : ""} ${walking ? "is-walking" : ""}`}
      role="img"
      aria-label="Illustrated avatar of the doctor"
    >
      <defs>
        <radialGradient id="av-skin" cx="42%" cy="36%" r="70%">
          <stop offset="0%" stopColor="#e7ae86" />
          <stop offset="60%" stopColor="#cf9068" />
          <stop offset="100%" stopColor="#a96a46" />
        </radialGradient>
        <radialGradient id="av-limb" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#dda07a" />
          <stop offset="100%" stopColor="#a96a46" />
        </radialGradient>
        <radialGradient id="av-curl" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#9a6438" />
          <stop offset="45%" stopColor="#5a3420" />
          <stop offset="100%" stopColor="#2a160d" />
        </radialGradient>
        <linearGradient id="av-hair" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#4a2a18" />
          <stop offset="100%" stopColor="#24130b" />
        </linearGradient>
        <radialGradient id="av-scrubs" cx="40%" cy="25%" r="85%">
          <stop offset="0%" stopColor="#6a3f94" />
          <stop offset="70%" stopColor="#4a2a6a" />
          <stop offset="100%" stopColor="#331a4d" />
        </radialGradient>
        <radialGradient id="av-iris" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#8a5530" />
          <stop offset="100%" stopColor="#3a1f0f" />
        </radialGradient>
        <radialGradient id="av-shoe" cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d9d4e2" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy="350" rx="50" ry="7" fill="#7a3b4a" opacity="0.18" className="avatar-shadow" />

      <g className="avatar-figure">
        <g className="avatar-leg avatar-leg-left">
          <rect x="72" y="252" width="26" height="78" rx="12" fill="#3d2159" />
          <ellipse cx="83" cy="334" rx="18" ry="10" fill="url(#av-shoe)" />
        </g>
        <g className="avatar-leg avatar-leg-right">
          <rect x="102" y="252" width="26" height="78" rx="12" fill="#4a2a6a" />
          <ellipse cx="117" cy="334" rx="18" ry="10" fill="url(#av-shoe)" />
        </g>

        <g className="avatar-arm avatar-arm-left">
          <rect x="40" y="176" width="28" height="40" rx="14" fill="url(#av-scrubs)" />
          <rect x="44" y="206" width="21" height="50" rx="10.5" fill="url(#av-limb)" />
          <circle cx="54.5" cy="258" r="11" fill="url(#av-limb)" />
        </g>
        <g className="avatar-arm avatar-arm-right">
          <rect x="132" y="176" width="28" height="40" rx="14" fill="url(#av-scrubs)" />
          <rect x="135" y="206" width="21" height="50" rx="10.5" fill="url(#av-limb)" />
          <circle cx="145.5" cy="258" r="11" fill="url(#av-limb)" />
        </g>

        <path d="M52 192 Q54 168 82 164 L118 164 Q146 168 148 192 L150 262 Q100 274 50 262 Z" fill="url(#av-scrubs)" />
        <path d="M84 164 L100 194 L116 164 Z" fill="#b8774f" />
        <path d="M82 164 L100 198 L118 164" fill="none" stroke="#331a4d" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M70 226 Q100 232 130 226" fill="none" stroke="#331a4d" strokeWidth="1.5" opacity="0.5" />
        <text x="62" y="214" fontSize="5.6" fill="#f3e9f6" fontFamily="sans-serif" fontWeight="700">
          Dr. Akanksha
        </text>

        <rect x="88" y="142" width="24" height="28" rx="10" fill="#b8774f" />

        <g className="avatar-head">
          <path d="M40 100 Q36 30 100 24 Q164 30 160 100 L166 186 Q152 200 140 188 L136 148 L64 148 L60 188 Q48 200 34 186 Z" fill="url(#av-hair)" />
          {CURLS.map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="url(#av-curl)" />
          ))}

          <ellipse cx="100" cy="102" rx="47" ry="54" fill="url(#av-skin)" />
          <ellipse cx="86" cy="76" rx="20" ry="10" fill="#ffffff" opacity="0.12" />

          <path d="M54 92 Q56 40 104 38 Q148 42 150 90 Q140 62 112 58 Q96 56 84 64 Q66 70 54 92 Z" fill="url(#av-hair)" />
          <circle cx="66" cy="70" r="10" fill="url(#av-curl)" />
          <circle cx="138" cy="70" r="11" fill="url(#av-curl)" />
          <path d="M108 44 Q134 50 146 78" fill="none" stroke="#9a6438" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />

          <circle cx="55" cy="118" r="3" fill="#e9c46a" />
          <circle cx="145" cy="118" r="3" fill="#e9c46a" />

          <path d="M68 84 Q79 77 91 82" fill="none" stroke="#24130b" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M109 82 Q121 77 132 84" fill="none" stroke="#24130b" strokeWidth="4.5" strokeLinecap="round" />

          <g className="avatar-eyes">
            <ellipse cx="80" cy="101" rx="11" ry="12.5" fill="#ffffff" />
            <ellipse cx="120" cy="101" rx="11" ry="12.5" fill="#ffffff" />
            <circle cx="81" cy="103" r="7.5" fill="url(#av-iris)" />
            <circle cx="121" cy="103" r="7.5" fill="url(#av-iris)" />
            <circle cx="81" cy="103" r="3.6" fill="#120a06" />
            <circle cx="121" cy="103" r="3.6" fill="#120a06" />
            <circle cx="84" cy="99" r="2.4" fill="#ffffff" />
            <circle cx="124" cy="99" r="2.4" fill="#ffffff" />
            <path d="M68 96 Q80 85 92 95" fill="none" stroke="#120a06" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M108 95 Q120 85 132 96" fill="none" stroke="#120a06" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M68 96 L64 92 M132 96 L136 92" stroke="#120a06" strokeWidth="2.2" strokeLinecap="round" />
          </g>
          <g className="avatar-lids">
            <ellipse cx="80" cy="101" rx="12" ry="13.5" fill="url(#av-skin)" />
            <ellipse cx="120" cy="101" rx="12" ry="13.5" fill="url(#av-skin)" />
            <path d="M68 102 Q80 108 92 102" fill="none" stroke="#120a06" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M108 102 Q120 108 132 102" fill="none" stroke="#120a06" strokeWidth="2.6" strokeLinecap="round" />
          </g>

          <path d="M100 108 Q97 120 100 124 Q104 125 107 122" fill="none" stroke="#9a5a38" strokeWidth="2.6" strokeLinecap="round" />
          <ellipse cx="102" cy="114" rx="2" ry="5" fill="#ffffff" opacity="0.18" />
          <ellipse cx="68" cy="124" rx="9" ry="5.5" fill="#e0607a" opacity="0.25" />
          <ellipse cx="132" cy="124" rx="9" ry="5.5" fill="#e0607a" opacity="0.25" />

          <g className="avatar-mouth-closed">
            <path d="M86 134 Q100 146 114 134 Q100 140 86 134 Z" fill="#b8405a" />
          </g>
          <g className="avatar-mouth-open">
            <path d="M86 133 Q100 131 114 133 Q111 152 100 153 Q89 152 86 133 Z" fill="#5a1626" />
            <path d="M91 145 Q100 140 109 145 Q105 152 100 152 Q95 152 91 145 Z" fill="#e07788" />
            <path d="M88 133 Q100 130 112 133 L111 137 Q100 135 89 137 Z" fill="#ffffff" />
            <path d="M86 133 Q100 129 114 133" fill="none" stroke="#b8405a" strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </svg>
  );
}
