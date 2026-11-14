import { useState, useEffect } from 'react';

const daftarSoalKata = [
  {
    target: 'air',
    acak: ['i', 'a', 'r'],
    ikon: '💧',
    petunjuk: 'Minuman bening yang menyegarkan',
  },
  {
    target: 'buku',
    acak: ['u', 'b', 'k', 'u'],
    ikon: '📘',
    petunjuk: 'Benda berisi tulisan untuk dibaca',
  },
  {
    target: 'roda',
    acak: ['d', 'o', 'r', 'a'],
    ikon: '🛞',
    petunjuk: 'Bagian bulat yang berputar pada sepeda',
  },
  {
    target: 'paku',
    acak: ['k', 'p', 'u', 'a'],
    ikon: '🔩',
    petunjuk: 'Benda logam runcing untuk menempelkan kayu',
  },
  {
    target: 'meja',
    acak: ['j', 'e', 'm', 'a'],
    ikon: '🪑',
    petunjuk: 'Perabot tempat meletakkan buku saat belajar',
  },
  {
    target: 'rumah',
    acak: ['m', 'u', 'r', 'a', 'h'],
    ikon: '🏠',
    petunjuk: 'Tempat kita tinggal bersama keluarga',
  },
];

export default function GameUrutkanKata({ onSelesai, onBatal }) {
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [waktuMulai, setWaktuMulai] = useState(Date.now());
  const [riwayat, setRiwayat] = useState([]);
  const [slotJawaban, setSlotJawaban] = useState([]);
  const [statusJawaban, setStatusJawaban] = useState(null); // 'benar' | 'salah' | null

  const soalAktif = daftarSoalKata[indeksSoal];

  const putarSuaraKata = (kata) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const ucapan = new SpeechSynthesisUtterance(`Susun huruf menjadi kata, ${kata}`);
      ucapan.lang = 'id-ID';
      ucapan.rate = 0.85;
      window.speechSynthesis.speak(ucapan);
    }
  };

  // Reset slot kotak jawaban, waktu mulai, dan suara otomatis tiap ganti soal
  useEffect(() => {
    const soalSekarang = daftarSoalKata[indeksSoal];
    setSlotJawaban(Array(soalSekarang.target.length).fill(null));
    setStatusJawaban(null);
    setWaktuMulai(Date.now());

    const jeda = setTimeout(() => {
      putarSuaraKata(soalSekarang.target);
    }, 250);

    return () => {
      clearTimeout(jeda);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [indeksSoal]);

  // Memasukkan kartu huruf acak ke kotak kosong pertama
  const handlePilihKartuHuruf = (indeksAcak, huruf) => {
    if (statusJawaban !== null) return;

    // Cegah kartu yang sama dipilih dua kali
    const sudahDipakai = slotJawaban.some((item) => item && item.indeksAcak === indeksAcak);
    if (sudahDipakai) return;

    const indeksKosong = slotJawaban.findIndex((item) => item === null);
    if (indeksKosong === -1) return;

    const slotBaru = [...slotJawaban];
    slotBaru[indeksKosong] = { indeksAcak, huruf };
    setSlotJawaban(slotBaru);

    // Jika semua kotak sudah terisi, langsung periksa jawabannya
    if (slotBaru.every((item) => item !== null)) {
      evaluasiKata(slotBaru);
    }
  };

  // Mengembalikan huruf dari kotak jawaban jika anak ingin mengoreksi susunan
  const handleKosongkanSlot = (indeksSlot) => {
    if (statusJawaban !== null) return;
    if (!slotJawaban[indeksSlot]) return;

    const slotBaru = [...slotJawaban];
    slotBaru[indeksSlot] = null;
    setSlotJawaban(slotBaru);
  };

  const evaluasiKata = (slotLengkap) => {
    const waktuSelesai = Date.now();
    const durasiDetik = Number(((waktuSelesai - waktuMulai) / 1000).toFixed(2));
    const kataSusunan = slotLengkap.map((item) => item.huruf).join('');
    const apakahBenar = kataSusunan === soalAktif.target;

    setStatusJawaban(apakahBenar ? 'benar' : 'salah');

    const catatanBaru = [
      ...riwayat,
      {
        ronde: indeksSoal + 1,
        target: soalAktif.target,
        jawaban: kataSusunan,
        benar: apakahBenar,
        waktuDetik: durasiDetik,
      },
    ];
    setRiwayat(catatanBaru);

    setTimeout(() => {
      if (indeksSoal + 1 < daftarSoalKata.length) {
        setIndeksSoal(indeksSoal + 1);
      } else {
        const jumlahBenar = catatanBaru.filter((item) => item.benar).length;
        const totalWaktu = catatanBaru.reduce((acc, item) => acc + item.waktuDetik, 0);
        const rataRataWaktu = Number((totalWaktu / daftarSoalKata.length).toFixed(2));
        const persentaseAkurasi = Math.round((jumlahBenar / daftarSoalKata.length) * 100);

        onSelesai({
          idGame: 'urutkan-kata',
          namaGame: 'Urutkan Kata',
          jumlahBenar,
          totalSoal: daftarSoalKata.length,
          akurasi: persentaseAkurasi,
          rataRataWaktu,
          detail: catatanBaru,
        });
      }
    }, 750);
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
        <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-4 py-1.5 rounded-full">
          Soal {indeksSoal + 1} dari {daftarSoalKata.length}
        </span>
      </div>

      {/* Bilah Progres */}
      <div className="w-full bg-slate-200 h-3 rounded-full mb-8 overflow-hidden">
        <div
          className="bg-amber-500 h-full transition-all duration-300"
          style={{ width: `${((indeksSoal + 1) / daftarSoalKata.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-3xl shadow-lg border-2 border-amber-100 p-8 text-center">
        <h2 className="text-xl md:text-2xl font-extrabold text-indigo-950 mb-2">
          🔤 Urutkan Huruf Menjadi Kata!
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Klik huruf-huruf acak di bawah untuk menyusunnya ke dalam kotak kosong.
        </p>

        {/* Gambar & Tombol Suara Petunjuk */}
        <div className="inline-flex flex-col items-center bg-amber-50/70 border border-amber-200 rounded-2xl px-8 py-4 mb-8">
          <span className="text-6xl mb-2">{soalAktif.ikon}</span>
          <p className="text-xs font-semibold text-slate-600 mb-3">{soalAktif.petunjuk}</p>
          <button
            type="button"
            onClick={() => putarSuaraKata(soalAktif.target)}
            className="text-xs font-bold bg-amber-400 hover:bg-amber-500 text-indigo-950 px-4 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5"
          >
            <span>🔊</span> Dengar Kata
          </button>
        </div>

        {/* Kotak Slot Jawaban (Sesuai ilustrasi kotak kosong di desain UI) */}
        <div className="flex justify-center gap-3 mb-8">
          {slotJawaban.map((isiSlot, idx) => {
            let gayaSlot = 'bg-slate-50 border-dashed border-amber-400 text-indigo-950';
            if (isiSlot) {
              gayaSlot = 'bg-white border-solid border-amber-500 text-indigo-950 shadow-sm';
            }
            if (statusJawaban === 'benar') {
              gayaSlot = 'bg-emerald-500 border-solid border-emerald-600 text-white scale-105';
            } else if (statusJawaban === 'salah') {
              gayaSlot = 'bg-amber-400 border-solid border-amber-500 text-white';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleKosongkanSlot(idx)}
                title={isiSlot ? 'Klik untuk menurunkan huruf' : ''}
                className={`${gayaSlot} w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 text-4xl font-extrabold flex items-center justify-center transition transform cursor-pointer select-none`}
              >
                {isiSlot ? isiSlot.huruf : ''}
              </button>
            );
          })}
        </div>

        {/* Pilihan Kartu Huruf Acak */}
        <div className="flex justify-center flex-wrap gap-3">
          {soalAktif.acak.map((huruf, idx) => {
            const sudahDipakai = slotJawaban.some((item) => item && item.indeksAcak === idx);

            return (
              <button
                key={idx}
                type="button"
                disabled={sudahDipakai}
                onClick={() => handlePilihKartuHuruf(idx, huruf)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-4xl font-extrabold border-2 transition transform select-none ${
                  sudahDipakai
                    ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed scale-95'
                    : 'bg-amber-300 hover:bg-amber-400 border-amber-400 text-indigo-950 shadow-md hover:-translate-y-1 cursor-pointer'
                }`}
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