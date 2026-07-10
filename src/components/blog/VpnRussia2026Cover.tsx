export function VpnRussia2026Cover() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        aspectRatio: '1200 / 630',
        background: 'var(--cream)',
        border: '3px solid var(--ink)',
        boxShadow: '8px 8px 0 0 var(--ink)',
        backgroundImage: 'radial-gradient(circle, rgba(17,17,17,0.12) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <div className="w-full h-full flex flex-col md:flex-row p-4 md:p-8 gap-4 md:gap-6">
        {/* Left: text */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="chip" style={{ background: 'var(--violet)', fontSize: '0.65rem', padding: '0.3rem 0.7rem' }}>
              VPN
            </span>
            <span
              className="chip"
              style={{ background: 'transparent', borderColor: 'var(--ink)', opacity: 0.5, fontSize: '0.65rem', padding: '0.3rem 0.7rem' }}
            >
              РОССИЯ · 2026
            </span>
          </div>

          <div className="my-2 md:my-4">
            <div className="display leading-[0.95]" style={{ fontSize: 'clamp(1.5rem, 4.2vw, 3.4rem)' }}>
              VPN В
            </div>
            <div
              className="display leading-[0.95] inline-block rounded-lg px-2"
              style={{ fontSize: 'clamp(1.5rem, 4.2vw, 3.4rem)', background: 'var(--yellow)', margin: '2px 0' }}
            >
              РОССИИ
            </div>
            <div className="display leading-[0.95]" style={{ fontSize: 'clamp(1.3rem, 3.8vw, 3rem)' }}>
              2026
            </div>
          </div>

          <div className="border-t pt-2 md:pt-3" style={{ borderColor: 'rgba(17,17,17,0.15)' }}>
            <p className="font-extrabold" style={{ fontSize: 'clamp(0.65rem, 1.3vw, 0.95rem)' }}>
              Какой протокол реально работает
            </p>
            <ul className="mt-1.5 space-y-1 hidden sm:block">
              <li className="flex items-center gap-1.5" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.8rem)' }}>
                <span style={{ color: 'var(--yellow)' }}>●</span>
                <span className="opacity-70 font-semibold">OpenVPN и WireGuard — почему блокируют</span>
              </li>
              <li className="flex items-center gap-1.5" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.8rem)' }}>
                <span style={{ color: 'var(--violet)' }}>●</span>
                <span className="opacity-70 font-semibold">VLESS + Reality — невидим для DPI</span>
              </li>
              <li className="flex items-center gap-1.5" style={{ fontSize: 'clamp(0.6rem, 1vw, 0.8rem)' }}>
                <span style={{ color: 'var(--yellow)' }}>●</span>
                <span className="opacity-70 font-semibold">Операторы: МТС, Мегафон, Билайн, Tele2</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: yellow card with lock illustration */}
        <div
          className="flex-shrink-0 w-full md:w-[38%] rounded-xl flex flex-col items-center justify-between p-3 md:p-5"
          style={{ background: 'var(--yellow)', border: '2px solid var(--ink)', boxShadow: '5px 5px 0 0 var(--ink)' }}
        >
          <span className="chip" style={{ background: 'var(--ink)', color: 'var(--paper)', fontSize: '0.6rem', padding: '0.25rem 0.6rem', letterSpacing: '0.03em' }}>
            IMBA VPN → всегда работает
          </span>

          <svg viewBox="0 0 160 180" className="w-2/5 md:w-1/2 h-auto my-1">
            {/* Shadow ellipse */}
            <ellipse cx="80" cy="162" rx="44" ry="10" fill="rgba(17,17,17,0.25)"/>
            {/* Shield body */}
            <path d="M80,10 C54,26 16,34 16,34 L16,96 C16,138 46,164 80,175 C114,164 144,138 144,96 L144,34 C144,34 106,26 80,10 Z" fill="#111111"/>
            <path d="M80,16 C55,31 20,39 20,39 L20,96 C20,136 48,160 80,171 C112,160 140,136 140,96 L140,39 C140,39 105,31 80,16 Z" fill="#A8EAD4"/>
            <path d="M80,22 C57,36 24,44 24,44 L24,96 C24,133 51,155 80,166 C109,155 136,133 136,96 L136,44 C136,44 103,36 80,22 Z" fill="#B8F0DE"/>
            {/* Lock circle */}
            <circle cx="80" cy="96" r="26" fill="#111111"/>
            <circle cx="80" cy="96" r="23" fill="#2ECC8A"/>
            {/* Lock icon */}
            <rect x="68" y="93" width="24" height="18" rx="3" fill="#111111"/>
            <path d="M72,93 L72,87 C72,81 88,81 88,87 L88,93" fill="none" stroke="#111111" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="80" cy="101" r="3" fill="#2ECC8A"/>
            <line x1="80" y1="104" x2="80" y2="108" stroke="#2ECC8A" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>

          <p className="text-[9px] md:text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--ink)' }}>
            Невидим для DPI
          </p>

          <div className="flex flex-wrap gap-1 justify-center mt-1">
            <span className="rounded-full px-2 py-1" style={{ background: 'var(--ink)', color: 'var(--yellow)', fontSize: '0.55rem', fontWeight: 800 }}>
              VLESS REALITY
            </span>
            <span className="rounded-full px-2 py-1" style={{ background: 'rgba(17,17,17,0.15)', color: 'var(--ink)', fontSize: '0.55rem', fontWeight: 800 }}>
              XTLS
            </span>
            <span className="rounded-full px-2 py-1" style={{ background: 'rgba(17,17,17,0.15)', color: 'var(--ink)', fontSize: '0.55rem', fontWeight: 800 }}>
              SHADOWSOCKS
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
