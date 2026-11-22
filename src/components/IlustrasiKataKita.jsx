// Pustaka Ilustrasi Objek Konkret (SVG Presisi) & Lencana Apresiasi Anak KataKita

export function IlustrasiObjek({ nama, className = 'w-24 h-24' }) {
  switch (nama) {
    case 'meja':
      return (
        <svg viewBox="0 0 120 120" className={className} aria-label="Gambar Meja">
          {/* Permukaan Meja */}
          <rect x="14" y="42" width="92" height="12" rx="4" fill="#D97706" />
          <polygon points="22,32 98,32 106,42 14,42" fill="#F59E0B" />
          {/* Kaki Meja Belakang */}
          <rect x="30" y="54" width="8" height="36" rx="2" fill="#92400E" />
          <rect x="82" y="54" width="8" height="36" rx="2" fill="#92400E" />
          {/* Kaki Meja Depan */}
          <rect x="20" y="54" width="9" height="44" rx="2" fill="#B45309" />
          <rect x="91" y="54" width="9" height="44" rx="2" fill="#B45309" />
        </svg>
      );

    case 'kursi':
      return (
        <svg viewBox="0 0 120 120" className={className} aria-label="Gambar Kursi">
          {/* Sandaran Kursi */}
          <rect x="34" y="18" width="52" height="24" rx="5" fill="#0D9488" />
          <rect x="36" y="42" width="7" height="22" fill="#0F766E" />
          <rect x="77" y="42" width="7" height="22" fill="#0F766E" />
          {/* Dudukan Kursi */}
          <rect x="30" y="62" width="60" height="10" rx="4" fill="#14B8A6" />
          {/* Kaki Kursi */}
          <rect x="34" y="72" width="8" height="32" rx="2" fill="#0F766E" />
          <rect x="78" y="72" width="8" height="32" rx="2" fill="#0F766E" />
        </svg>
      );

    case 'bola':
      return (
        <svg viewBox="0 0 120 120" className={className} aria-label="Gambar Bola">
          <circle cx="60" cy="60" r="42" fill="#FFFFFF" stroke="#1E293B" strokeWidth="4" />
          <polygon points="60,42 76,54 70,72 50,72 44,54" fill="#1E293B" />
          <polygon points="60,18 72,28 60,34 48,28" fill="#1E293B" />
          <polygon points="98,52 92,68 82,62 84,48" fill="#1E293B" />
          <polygon points="22,52 36,48 38,62 28,68" fill="#1E293B" />
          <polygon points="44,96 48,84 72,84 76,96" fill="#1E293B" />
        </svg>
      );

    case 'buku':
      return (
        <svg viewBox="0 0 120 120" className={className} aria-label="Gambar Buku">
          {/* Sampul Biru */}
          <rect x="16" y="30" width="88" height="62" rx="6" fill="#2563EB" />
          {/* Halaman Kiri & Kanan */}
          <path d="M22 34 Q42 30 60 38 L60 86 Q42 78 22 84 Z" fill="#FFFFFF" />
          <path d="M98 34 Q78 30 60 38 L60 86 Q78 78 98 84 Z" fill="#F8FAFC" />
          <line x1="60" y1="36" x2="60" y2="88" stroke="#94A3B8" strokeWidth="2.5" />
          {/* Garis Teks */}
          <line x1="30" y1="48" x2="52" y2="48" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <line x1="30" y1="58" x2="52" y2="58" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <line x1="68" y1="48" x2="90" y2="48" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <line x1="68" y1="58" x2="90" y2="58" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'apel':
      return (
        <svg viewBox="0 0 120 120" className={className} aria-label="Gambar Apel">
          {/* Tangkai & Daun */}
          <path d="M60 34 Q62 20 70 16" stroke="#78350F" strokeWidth="4" fill="none" strokeLinecap="round" />
          <ellipse cx="74" cy="24" rx="12" ry="6" transform="rotate(-20 74 24)" fill="#16A34A" />
          {/* Badan Apel */}
          <path
            d="M60 38 C42 28, 22 42, 26 68 C29 90, 46 102, 60 96 C74 102, 91 90, 94 68 C98 42, 78 28, 60 38 Z"
            fill="#EF4444"
          />
          <ellipse cx="42" cy="54" rx="5" ry="11" transform="rotate(-18 42 54)" fill="#FCA5A5" opacity="0.7" />
        </svg>
      );

    case 'ikan':
      return (
        <svg viewBox="0 0 120 120" className={className} aria-label="Gambar Ikan">
          {/* Ekor */}
          <polygon points="84,60 108,38 104,60 108,82" fill="#F97316" />
          {/* Sirip Atas & Bawah */}
          <polygon points="48,36 66,22 70,38" fill="#FB923C" />
          <polygon points="52,82 68,96 70,80" fill="#FB923C" />
          {/* Badan Ikan */}
          <ellipse cx="54" cy="60" rx="36" ry="24" fill="#F59E0B" />
          {/* Mata & Insang */}
          <circle cx="34" cy="54" r="5" fill="#FFFFFF" />
          <circle cx="33" cy="54" r="2.5" fill="#1E293B" />
          <path d="M46 46 Q52 60 46 74" stroke="#B45309" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'rumah':
      return (
        <svg viewBox="0 0 120 120" className={className} aria-label="Gambar Rumah">
          {/* Dinding */}
          <rect x="28" y="54" width="64" height="44" rx="3" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
          {/* Atap */}
          <polygon points="18,56 60,22 102,56" fill="#E11D48" />
          {/* Pintu */}
          <rect x="52" y="68" width="16" height="30" rx="2" fill="#92400E" />
          {/* Jendela */}
          <rect x="34" y="66" width="12" height="12" rx="2" fill="#38BDF8" />
          <rect x="74" y="66" width="12" height="12" rx="2" fill="#38BDF8" />
        </svg>
      );

    case 'topi':
    default:
      return (
        <svg viewBox="0 0 120 120" className={className} aria-label="Gambar Topi">
          {/* Kubah Topi */}
          <path d="M26 70 C26 40, 86 40, 86 70 Z" fill="#4F46E5" />
          <circle cx="56" cy="43" r="4" fill="#FBBF24" />
          {/* Lidah Topi */}
          <path d="M24 70 L104 72 C106 80, 92 84, 72 82 L24 76 Z" fill="#312E81" />
        </svg>
      );
  }
}

export const katalogLencana = [
  {
    idGame: 'mencari-huruf',
    judul: 'Detektif Huruf',
    syarat: 'Selesaikan Mencari Huruf',
    warnaUtama: '#7C3AED',
    warnaLatar: '#EDE9FE',
    simbol: '🔍',
  },
  {
    idGame: 'dengar-pilih',
    judul: 'Telinga Emas',
    syarat: 'Selesaikan Dengar & Pilih',
    warnaUtama: '#059669',
    warnaLatar: '#D1FAE5',
    simbol: '👂',
  },
  {
    idGame: 'urutkan-kata',
    judul: 'Arsitek Kata',
    syarat: 'Selesaikan Urutkan Kata',
    warnaUtama: '#D97706',
    warnaLatar: '#FEF3C7',
    simbol: '🔤',
  },
  {
    idGame: 'baca-cepat',
    judul: 'Kilat Baca',
    syarat: 'Selesaikan Baca Cepat',
    warnaUtama: '#0284C7',
    warnaLatar: '#E0F2FE',
    simbol: '⚡',
  },
  {
    idGame: 'pasangan-kata',
    judul: 'Penjelajah Makna',
    syarat: 'Selesaikan Pasangan Kata',
    warnaUtama: '#EA580C',
    warnaLatar: '#FFEDD5',
    simbol: '🧩',
  },
  {
    idGame: 'ingat-ulangi',
    judul: 'Juara Memori',
    syarat: 'Selesaikan Ingat & Ulangi',
    warnaUtama: '#DB2777',
    warnaLatar: '#FCE7F3',
    simbol: '🧠',
  },
];

export function LencanaSVG({ warnaUtama, warnaLatar, simbol, terkunci = false }) {
  return (
    <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Pita Medali */}
        <polygon
          points="32,68 24,96 42,88 50,96 50,70"
          fill={terkunci ? '#CBD5E1' : warnaUtama}
          opacity="0.85"
        />
        <polygon
          points="68,68 76,96 58,88 50,96 50,70"
          fill={terkunci ? '#94A3B8' : warnaUtama}
        />
        {/* Lingkaran Medali */}
        <circle
          cx="50"
          cy="44"
          r="34"
          fill={terkunci ? '#F1F5F9' : warnaLatar}
          stroke={terkunci ? '#CBD5E1' : warnaUtama}
          strokeWidth="5"
        />
        <circle
          cx="50"
          cy="44"
          r="26"
          fill="none"
          stroke={terkunci ? '#E2E8F0' : warnaUtama}
          strokeWidth="2"
          strokeDasharray="4 3"
        />
      </svg>
      <span
        className={`absolute top-3.5 text-2xl ${
          terkunci ? 'grayscale opacity-35' : ''
        }`}
      >
        {terkunci ? '🔒' : simbol}
      </span>
    </div>
  );
}