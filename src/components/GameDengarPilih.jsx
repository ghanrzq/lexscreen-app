import { useState, useEffect } from 'react';

const daftarSoalAudio = [
  {
    targetKata: 'bola',
    instruksi: 'Dengarkan baik-baik. Pilih gambar, bola',
    opsi: [
      { id: 'bola', label: 'Bola', ikon: '⚽' },
      { id: 'boba', label: 'Boba', ikon: '🧋' },
      { id: 'boneka', label: 'Boneka', ikon: '🧸' },
    ],
  },
  {
    targetKata: 'palu',
    instruksi: 'Dengarkan baik-baik. Pilih gambar, palu',
    opsi: [
      { id: 'paku', label: 'Paku', ikon: '🔩' },
      { id: 'palu', label: 'Palu', ikon: '🔨' },
      { id: 'buku', label: 'Buku', ikon: '📘' },
    ],
  },
  {
    targetKata: 'topi',
    instruksi: 'Dengarkan baik-baik. Pilih gambar, topi',
    opsi: [
      { id: 'kopi', label: 'Kopi', ikon: '☕' },
      { id: 'roti', label: 'Roti', ikon: '🍞' },
      { id: 'topi', label: 'Topi', ikon: '🧢' },
    ],
  },
  {
    targetKata: 'kaki',
    instruksi: 'Dengarkan baik-baik. Pilih gambar, kaki',
    opsi: [
      { id: 'kaki', label: 'Kaki', ikon: '🦶' },
      { id: 'kado', label: 'Kado', ikon: '🎁' },
      { id: 'sapi', label: 'Sapi', ikon: '🐄' },
    ],
  },
  {
    targetKata: 'ayam',
    instruksi: 'Dengarkan baik-baik. Pilih gambar, ayam',
    opsi: [
      { id: 'awan', label: 'Awan', ikon: '☁️' },
      { id: 'ikan', label: 'Ikan', ikon: '🐟' },
      { id: 'ayam', label: 'Ayam', ikon: '🐔' },
    ],
  },
  {
    targetKata: 'meja',
    instruksi: 'Dengarkan baik-baik. Pilih gambar, meja',
    opsi: [
      { id: 'mata', label: 'Mata', ikon: '👁️' },
      { id: 'meja', label: 'Meja', ikon: '🪑' },
      { id: 'bata', label: 'Bata', ikon: '🧱' },
    ],
  },
];

export default function GameDengarPilih({ onSelesai, onBatal }) {
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [waktuMulai, setWaktuMulai] = useState(Date.now());
  const [riwayat, setRiwayat] = useState([]);
  const [opsiDipilih, setOpsiDipilih] = useState(null);
  const [sedangBicara, setSedangBicara] = useState(false);

  const soalAktif = daftarSoalAudio[indeksSoal];

  const putarSuara = (kalimat) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const ucapan = new SpeechSynthesisUtterance(kalimat);
      ucapan.lang = 'id-ID';
      ucapan.rate = 0.85;

      ucapan.onstart = () => setSedangBicara(true);
      ucapan.onend = () => setSedangBicara(false);
      ucapan.onerror = () => setSedangBicara(false);

      window.speechSynthesis.speak(ucapan);
    }
  };

  useEffect(() => {
    setWaktuMulai(Date.now());
    setOpsiDipilih(null);

    const jeda = setTimeout(() => {
      putarSuara(daftarSoalAudio[indeksSoal].instruksi);
    }, 250);

    return () => {
      clearTimeout(jeda);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [indeksSoal]);

  const handlePilihGambar = (idOpsi) => {
    if (opsiDipilih !== null) return;

    const waktuSelesai = Date.now();
    const durasiDetik = Number(((waktuSelesai - waktuMulai) / 1000).toFixed(2));
    const apakahBenar = idOpsi === soalAktif.targetKata;

    setOpsiDipilih(idOpsi);

    const catatanBaru = [
      ...riwayat,
      {
        ronde: indeksSoal + 1,
        target: soalAktif.targetKata,
        jawaban: idOpsi,
        benar: apakahBenar,
        waktuDetik: durasiDetik,
      },
    ];
    setRiwayat(catatanBaru);

    setTimeout(() => {
      if (indeksSoal + 1 < daftarSoalAudio.length) {
        setIndeksSoal(indeksSoal + 1);
      } else {
        const jumlahBenar = catatanBaru.filter((item) => item.benar).length;
        const totalWaktu = catatanBaru.reduce((acc, item) => acc + item.waktuDetik, 0);
        const rataRataWaktu = Number((totalWaktu / daftarSoalAudio.length).toFixed(2));
        const persentaseAkurasi = Math.round((jumlahBenar / daftarSoalAudio.length) * 100);

        onSelesai({
          idGame: 'dengar-pilih',
          namaGame: 'Dengar & Pilih',
          jumlahBenar,
          totalSoal: daftarSoalAudio.length,
          akurasi: persentaseAkurasi,
          rataRataWaktu,
          detail: catatanBaru,
        });
      }
    }, 650);
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
        <span className="bg-emerald-100 text-emerald-900 text-xs font-extrabold px-4 py-1.5 rounded-full">
          Soal {indeksSoal + 1} dari {daftarSoalAudio.length}
        </span>
      </div>

      {/* Bilah Progres */}
      <div className="w-full bg-slate-200 h-3 rounded-full mb-8 overflow-hidden">
        <div
          className="bg-emerald-500 h-full transition-all duration-300"
          style={{ width: `${((indeksSoal + 1) / daftarSoalAudio.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-3xl shadow-lg border-2 border-emerald-100 p-8 text-center">
        <h2 className="text-xl md:text-2xl font-extrabold text-indigo-950 mb-2">
          👂 Dengar & Pilih Gambar!
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Dengarkan kata yang diucapkan, lalu klik gambar yang paling sesuai.
        </p>

        {/* Tombol Pemutar Audio Besar */}
        <div className="mb-8 flex flex-col items-center">
          <button
            type="button"
            onClick={() => putarSuara(soalAktif.instruksi)}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-md transition transform cursor-pointer ${
              sedangBicara
                ? 'bg-amber-400 text-white scale-110 ring-4 ring-amber-200'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            🔊
          </button>
          <span className="text-xs font-bold text-emerald-800 mt-3 bg-emerald-50 px-3 py-1 rounded-full">
            {sedangBicara ? 'Sedang berbicara...' : 'Klik ikon speaker untuk mengulangi suara'}
          </span>
        </div>

        {/* Pilihan 3 Kartu Gambar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
          {soalAktif.opsi.map((item) => {
            let gayaKartu =
              'bg-emerald-50/60 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-100/70 text-indigo-950';

            if (opsiDipilih === item.id) {
              gayaKartu =
                item.id === soalAktif.targetKata
                  ? 'bg-emerald-500 border-emerald-600 text-white scale-105'
                  : 'bg-amber-400 border-amber-500 text-white';
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handlePilihGambar(item.id)}
                className={`${gayaKartu} border-3 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm transition transform cursor-pointer select-none`}
              >
                <span className="text-6xl mb-3">{item.ikon}</span>
                <span className="text-lg font-extrabold tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}