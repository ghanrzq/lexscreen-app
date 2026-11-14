import { useState, useEffect } from 'react';

const daftarSoal = [
  { target: 'b', opsi: ['d', 'b', 'p', 'q'] },
  { target: 'd', opsi: ['b', 'q', 'd', 'p'] },
  { target: 'p', opsi: ['q', 'p', 'b', 'd'] },
  { target: 'q', opsi: ['p', 'd', 'q', 'b'] },
  { target: 'm', opsi: ['n', 'w', 'm', 'u'] },
  { target: 'n', opsi: ['m', 'u', 'h', 'n'] },
  { target: 'b', opsi: ['p', 'q', 'd', 'b'] },
  { target: 'd', opsi: ['q', 'd', 'b', 'p'] },
];

export default function GameMencariHuruf({ onSelesai, onBatal }) {
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [waktuMulai, setWaktuMulai] = useState(Date.now());
  const [riwayat, setRiwayat] = useState([]);
  const [hurufDipilih, setHurufDipilih] = useState(null);

  const soalAktif = daftarSoal[indeksSoal];

  // Fungsi pemutar suara multisensori dengan awalan "Ini huruf..."
  const bunyikanHuruf = (huruf) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const ucapan = new SpeechSynthesisUtterance(`Ini huruf, ${huruf}`);
      ucapan.lang = 'id-ID';
      ucapan.rate = 0.85;
      window.speechSynthesis.speak(ucapan);
    }
  };

  // Reset waktu & putar suara otomatis setiap kali soal baru muncul
  useEffect(() => {
    setWaktuMulai(Date.now());
    setHurufDipilih(null);

    const jedaSuara = setTimeout(() => {
      bunyikanHuruf(daftarSoal[indeksSoal].target);
    }, 250);

    return () => {
      clearTimeout(jedaSuara);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [indeksSoal]);

  const handlePilihHuruf = (huruf) => {
    if (hurufDipilih !== null) return;

    const waktuSelesai = Date.now();
    const durasiDetik = Number(((waktuSelesai - waktuMulai) / 1000).toFixed(2));
    const apakahBenar = huruf === soalAktif.target;

    setHurufDipilih(huruf);

    const catatanBaru = [
      ...riwayat,
      {
        ronde: indeksSoal + 1,
        target: soalAktif.target,
        jawaban: huruf,
        benar: apakahBenar,
        waktuDetik: durasiDetik,
      },
    ];
    setRiwayat(catatanBaru);

    setTimeout(() => {
      if (indeksSoal + 1 < daftarSoal.length) {
        setIndeksSoal(indeksSoal + 1);
      } else {
        const jumlahBenar = catatanBaru.filter((item) => item.benar).length;
        const totalWaktu = catatanBaru.reduce((acc, item) => acc + item.waktuDetik, 0);
        const rataRataWaktu = Number((totalWaktu / daftarSoal.length).toFixed(2));
        const persentaseAkurasi = Math.round((jumlahBenar / daftarSoal.length) * 100);

        onSelesai({
          idGame: 'mencari-huruf',
          namaGame: 'Mencari Huruf',
          jumlahBenar,
          totalSoal: daftarSoal.length,
          akurasi: persentaseAkurasi,
          rataRataWaktu,
          detail: catatanBaru,
        });
      }
    }, 600);
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
        <span className="bg-purple-100 text-purple-900 text-xs font-extrabold px-4 py-1.5 rounded-full">
          Soal {indeksSoal + 1} dari {daftarSoal.length}
        </span>
      </div>

      {/* Bilah Progres Ramah Anak */}
      <div className="w-full bg-slate-200 h-3 rounded-full mb-8 overflow-hidden">
        <div
          className="bg-teal-500 h-full transition-all duration-300"
          style={{ width: `${((indeksSoal + 1) / daftarSoal.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-3xl shadow-lg border-2 border-purple-100 p-8 text-center">
        <h2 className="text-xl md:text-2xl font-extrabold text-indigo-950 mb-2">
          🔍 Temukan Huruf yang Sama!
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Dengarkan suaranya dan perhatikan huruf di dalam kaca pembesar, lalu pilih pasangan yang tepat.
        </p>

        {/* Target Huruf */}
        <div className="inline-flex flex-col items-center justify-center mb-8">
          <div className="w-28 h-28 rounded-full bg-sky-100 border-4 border-blue-600 flex items-center justify-center shadow-inner mb-3">
            <span className="text-6xl font-extrabold text-indigo-950 select-none">
              {soalAktif.target}
            </span>
          </div>
          <button
            type="button"
            onClick={() => bunyikanHuruf(soalAktif.target)}
            className="text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-3.5 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5"
          >
            <span>🔊</span> Ulangi Suara
          </button>
        </div>

        {/* Pilihan 4 Kartu Huruf */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
          {soalAktif.opsi.map((huruf, idx) => {
            let gayaKartu =
              'bg-purple-50/70 border-purple-200 hover:border-purple-500 hover:bg-purple-100 text-indigo-950';

            if (hurufDipilih === huruf) {
              gayaKartu =
                huruf === soalAktif.target
                  ? 'bg-emerald-500 border-emerald-600 text-white scale-105'
                  : 'bg-amber-400 border-amber-500 text-white';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePilihHuruf(huruf)}
                className={`${gayaKartu} border-3 rounded-2xl py-6 text-5xl font-extrabold shadow-sm transition transform cursor-pointer select-none`}
              >
                {huruf}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}