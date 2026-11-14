import { useState, useEffect, useRef } from 'react';

const bankKataCepat = [
  {
    kata: 'bola',
    targetId: 'bola',
    opsi: [
      { id: 'bola', ikon: '⚽', label: 'A' },
      { id: 'boba', ikon: '🧋', label: 'B' },
    ],
  },
  {
    kata: 'boba',
    targetId: 'boba',
    opsi: [
      { id: 'bola', ikon: '⚽', label: 'A' },
      { id: 'boba', ikon: '🧋', label: 'B' },
    ],
  },
  {
    kata: 'buku',
    targetId: 'buku',
    opsi: [
      { id: 'buku', ikon: '📘', label: 'A' },
      { id: 'paku', ikon: '🔩', label: 'B' },
    ],
  },
  {
    kata: 'paku',
    targetId: 'paku',
    opsi: [
      { id: 'palu', ikon: '🔨', label: 'A' },
      { id: 'paku', ikon: '🔩', label: 'B' },
    ],
  },
  {
    kata: 'palu',
    targetId: 'palu',
    opsi: [
      { id: 'palu', ikon: '🔨', label: 'A' },
      { id: 'buku', ikon: '📘', label: 'B' },
    ],
  },
  {
    kata: 'roti',
    targetId: 'roti',
    opsi: [
      { id: 'kopi', ikon: '☕', label: 'A' },
      { id: 'roti', ikon: '🍞', label: 'B' },
    ],
  },
  {
    kata: 'topi',
    targetId: 'topi',
    opsi: [
      { id: 'topi', ikon: '🧢', label: 'A' },
      { id: 'kopi', ikon: '☕', label: 'B' },
    ],
  },
  {
    kata: 'kaki',
    targetId: 'kaki',
    opsi: [
      { id: 'kaki', ikon: '🦶', label: 'A' },
      { id: 'kado', ikon: '🎁', label: 'B' },
    ],
  },
  {
    kata: 'sapi',
    targetId: 'sapi',
    opsi: [
      { id: 'ikan', ikon: '🐟', label: 'A' },
      { id: 'sapi', ikon: '🐄', label: 'B' },
    ],
  },
  {
    kata: 'meja',
    targetId: 'meja',
    opsi: [
      { id: 'meja', ikon: '🪑', label: 'A' },
      { id: 'mata', ikon: '👁️', label: 'B' },
    ],
  },
  {
    kata: 'mata',
    targetId: 'mata',
    opsi: [
      { id: 'bata', ikon: '🧱', label: 'A' },
      { id: 'mata', ikon: '👁️', label: 'B' },
    ],
  },
  {
    kata: 'ayam',
    targetId: 'ayam',
    opsi: [
      { id: 'ayam', ikon: '🐔', label: 'A' },
      { id: 'awan', ikon: '☁️', label: 'B' },
    ],
  },
  {
    kata: 'roda',
    targetId: 'roda',
    opsi: [
      { id: 'roda', ikon: '🛞', label: 'A' },
      { id: 'kado', ikon: '🎁', label: 'B' },
    ],
  },
  {
    kata: 'gigi',
    targetId: 'gigi',
    opsi: [
      { id: 'gigi', ikon: '🦷', label: 'A' },
      { id: 'kaki', ikon: '🦶', label: 'B' },
    ],
  },
  {
    kata: 'rumah',
    targetId: 'rumah',
    opsi: [
      { id: 'awan', ikon: '☁️', label: 'A' },
      { id: 'rumah', ikon: '🏠', label: 'B' },
    ],
  },
];

export default function GameBacaCepat({ onSelesai, onBatal }) {
  const [sudahMulai, setSudahMulai] = useState(false);
  const [sisaWaktu, setSisaWaktu] = useState(30);
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [waktuMulaiSoal, setWaktuMulaiSoal] = useState(Date.now());
  const [riwayat, setRiwayat] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'benar' | 'salah' | null

  const riwayatRef = useRef([]);
  riwayatRef.current = riwayat;

  const soalAktif = bankKataCepat[indeksSoal % bankKataCepat.length];

  // Suara instruksi awal saat layar persiapan muncul
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const ucapan = new SpeechSynthesisUtterance(
        'Baca kata yang muncul secepat mungkin, lalu pilih gambar yang sesuai dalam tiga puluh detik!'
      );
      ucapan.lang = 'id-ID';
      ucapan.rate = 0.9;
      window.speechSynthesis.speak(ucapan);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Pengatur waktu mundur 30 detik setelah tombol Mulai ditekan
  useEffect(() => {
    if (!sudahMulai) return;

    const interval = setInterval(() => {
      setSisaWaktu((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          selesaikanPermainan(riwayatRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sudahMulai]);

  const selesaikanPermainan = (catatanAkhir) => {
    const totalDijawab = catatanAkhir.length;
    const jumlahBenar = catatanAkhir.filter((item) => item.benar).length;
    const persentaseAkurasi =
      totalDijawab > 0 ? Math.round((jumlahBenar / totalDijawab) * 100) : 0;

    const totalWaktu = catatanAkhir.reduce((acc, item) => acc + item.waktuDetik, 0);
    const rataRataWaktu =
      totalDijawab > 0 ? Number((totalWaktu / totalDijawab).toFixed(2)) : 30;

    onSelesai({
      idGame: 'baca-cepat',
      namaGame: 'Baca Cepat',
      jumlahBenar,
      totalSoal: totalDijawab,
      akurasi: persentaseAkurasi,
      rataRataWaktu,
      kataPerMenit: jumlahBenar * 2, // Konversi dari 30 detik ke 1 menit
      detail: catatanAkhir,
    });
  };

  const handleMulaiTantangan = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSudahMulai(true);
    setWaktuMulaiSoal(Date.now());
  };

  const handlePilihGambar = (idOpsi) => {
    if (!sudahMulai || feedback !== null || sisaWaktu <= 0) return;

    const waktuSelesai = Date.now();
    const durasiDetik = Number(((waktuSelesai - waktuMulaiSoal) / 1000).toFixed(2));
    const apakahBenar = idOpsi === soalAktif.targetId;

    setFeedback(apakahBenar ? 'benar' : 'salah');

    const catatanBaru = [
      ...riwayat,
      {
        ronde: indeksSoal + 1,
        target: soalAktif.kata,
        jawaban: idOpsi,
        benar: apakahBenar,
        waktuDetik: durasiDetik,
      },
    ];
    setRiwayat(catatanBaru);

    // Transisi cepat (0.25 detik) agar ritme membaca cepat tetap terjaga
    setTimeout(() => {
      setFeedback(null);
      setIndeksSoal((prev) => prev + 1);
      setWaktuMulaiSoal(Date.now());
    }, 250);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBatal}
          className="text-slate-600 hover:text-indigo-950 font-bold text-sm cursor-pointer"
        >
          ← Keluar dari Permainan
        </button>

        {sudahMulai && (
          <div className="flex items-center gap-3">
            <span className="bg-sky-100 text-sky-900 text-xs font-extrabold px-3.5 py-1.5 rounded-full">
              Terbaca: {riwayat.filter((r) => r.benar).length} Kata
            </span>
            <span
              className={`text-xs font-extrabold px-4 py-1.5 rounded-full transition ${
                sisaWaktu <= 10
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-indigo-950 text-white'
              }`}
            >
              ⏱️ {sisaWaktu} Detik
            </span>
          </div>
        )}
      </div>

      {/* Bilah Waktu Mundur */}
      <div className="w-full bg-slate-200 h-3 rounded-full mb-8 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 linear ${
            sisaWaktu <= 10 ? 'bg-amber-500' : 'bg-sky-500'
          }`}
          style={{ width: `${(sisaWaktu / 30) * 100}%` }}
        />
      </div>

      {!sudahMulai ? (
        /* LAYAR PERSIAPAN SEBELUM TIMER BERJALAN */
        <div className="bg-white rounded-3xl shadow-lg border-2 border-sky-100 p-8 md:p-10 text-center">
          <div className="text-6xl mb-4">⭐⏱️</div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-950 mb-3">
            Tantangan Baca Cepat!
          </h2>
          <p className="text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
            Kamu punya waktu <strong>30 detik</strong>. Baca kata yang muncul di layar secepat mungkin, lalu klik gambar yang sesuai!
          </p>
          <button
            type="button"
            onClick={handleMulaiTantangan}
            className="bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-lg px-8 py-4 rounded-2xl shadow-md transition transform hover:scale-105 cursor-pointer"
          >
            🚀 Mulai Hitung Mundur!
          </button>
        </div>
      ) : (
        /* LAYAR UTAMA PERMAINAN BACA CEPAT */
        <div
          className={`bg-white rounded-3xl shadow-lg border-4 p-8 text-center transition-colors duration-200 ${
            feedback === 'benar'
              ? 'border-emerald-400 bg-emerald-50/30'
              : feedback === 'salah'
              ? 'border-amber-400 bg-amber-50/30'
              : 'border-sky-100'
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-3">
            Baca Kata Ini & Pilih Gambarnya:
          </p>

          {/* Kartu Kata Target (Tipografi Besar & Jelas Ramah Disleksia) */}
          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl py-6 px-10 inline-block mb-8 shadow-inner">
            <span className="text-5xl md:text-6xl font-extrabold tracking-wide text-indigo-950 select-none">
              {soalAktif.kata}
            </span>
          </div>

          {/* 2 Pilihan Gambar Cepat */}
          <div className="grid grid-cols-2 gap-5 max-w-md mx-auto">
            {soalAktif.opsi.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handlePilihGambar(item.id)}
                className="bg-white hover:bg-sky-50 border-2 border-slate-200 hover:border-sky-500 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm transition transform active:scale-95 cursor-pointer select-none"
              >
                <span className="text-6xl md:text-7xl">{item.ikon}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}