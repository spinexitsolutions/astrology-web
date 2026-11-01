/** Generative product artwork — every product gets a unique, on-brand visual without needing photos. */
export default function ProductArt({ category, hue, className = "" }: { category: string; hue: number; className?: string }) {
  const id = `g${hue}${category}`;
  const c1 = `hsl(${hue} 85% 72%)`;
  const c2 = `hsl(${hue} 70% 45%)`;
  const c3 = `hsl(${hue} 80% 22%)`;
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={`hsl(${hue} 40% 18%)`} />
          <stop offset="100%" stopColor="#0b0b12" />
        </radialGradient>
        <linearGradient id={`${id}-gem`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="55%" stopColor={c2} />
          <stop offset="100%" stopColor={c3} />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" stopColor={c1} stopOpacity="0.55" />
          <stop offset="100%" stopColor={c1} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#${id}-bg)`} />
      <circle cx="200" cy="200" r="150" fill={`url(#${id}-glow)`} />
      <g stroke="rgba(243,238,229,.12)" fill="none">
        <circle cx="200" cy="200" r="170" />
        <circle cx="200" cy="200" r="130" strokeDasharray="2 6" />
      </g>
      {category === "Gemstone" && (
        <g>
          <path d="M200 110 L265 160 L245 270 L200 300 L155 270 L135 160 Z" fill={`url(#${id}-gem)`} />
          <path d="M200 110 L230 165 L200 300 L170 165 Z" fill="rgba(255,255,255,.18)" />
          <path d="M135 160 L265 160 L230 165 L170 165 Z" fill="rgba(255,255,255,.35)" />
          <path d="M170 165 L155 270 L200 300 Z" fill="rgba(0,0,0,.18)" />
          <path d="M230 165 L245 270 L200 300 Z" fill="rgba(255,255,255,.08)" />
          <circle cx="182" cy="140" r="5" fill="white" opacity=".9" />
        </g>
      )}
      {category === "Rudraksha" && (
        <g>
          <circle cx="200" cy="205" r="72" fill={`url(#${id}-gem)`} />
          {[-48, -24, 0, 24, 48].map((x) => (
            <path key={x} d={`M${200 + x} 135 Q ${200 + x * 1.5} 205 ${200 + x} 275`} stroke="rgba(0,0,0,.35)" strokeWidth="3" fill="none" />
          ))}
          <path d="M200 60 Q 200 100 200 133" stroke="#c0392b" strokeWidth="3" />
          <circle cx="175" cy="180" r="10" fill="rgba(255,255,255,.18)" />
        </g>
      )}
      {category === "Yantra" && (
        <g fill="none" stroke={c1} strokeWidth="2">
          <rect x="100" y="100" width="200" height="200" />
          <circle cx="200" cy="200" r="88" />
          <path d="M200 125 L265 238 L135 238 Z" />
          <path d="M200 275 L135 162 L265 162 Z" />
          <path d="M200 150 L243 225 L157 225 Z" />
          <circle cx="200" cy="200" r="5" fill={c1} />
        </g>
      )}
      {category === "Bracelet" && (
        <g>
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return <circle key={i} cx={200 + 95 * Math.cos(a)} cy={200 + 95 * Math.sin(a)} r="17" fill={`hsl(${(hue + i * 22) % 360} 70% ${45 + (i % 3) * 10}%)`} />;
          })}
        </g>
      )}
      {category === "Report" && (
        <g>
          <rect x="130" y="95" width="150" height="200" rx="8" fill={`url(#${id}-gem)`} transform="rotate(-6 200 200)" />
          <rect x="120" y="105" width="150" height="200" rx="8" fill="#f3eee5" />
          <circle cx="195" cy="175" r="40" fill="none" stroke={c2} strokeWidth="2" />
          <path d="M195 135 L235 175 L195 215 L155 175 Z" fill="none" stroke={c2} strokeWidth="1.5" />
          {[235, 250, 265].map((y) => <rect key={y} x="140" y={y} width={y === 265 ? 70 : 110} height="5" rx="2" fill="#0b0b12" opacity=".25" />)}
        </g>
      )}
      {category === "Puja" && (
        <g>
          <path d="M140 250 Q200 300 260 250 L250 270 Q200 310 150 270 Z" fill={`url(#${id}-gem)`} />
          <path d="M200 160 C 225 190, 222 225, 200 240 C 178 225, 175 190, 200 160 Z" fill={c1} />
          <path d="M200 190 C 210 205, 208 222, 200 230 C 192 222, 190 205, 200 190 Z" fill="#fff6dc" />
        </g>
      )}
    </svg>
  );
}
