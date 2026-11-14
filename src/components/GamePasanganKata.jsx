import { useState, useEffect } from 'react';

const daftarSoalPasangan = [
  {
    kata: 'bola',
    suku1: 'bo',
    suku2: 'la',
    opsiPotongan: ['bo', 'do', 'la', 'ra'],
    ikon: '⚽',
  },
  {
    kata: 'buku',
    suku1: 'bu',
    suku2: 'ku',
    opsiPotongan: ['du', 'bu', 'ku', 'pu'],
    ikon: '📘',
  },
  {
    kata: 'roti',
    suku1: 'ro',
    suku2: 'ti',
    opsiPotongan: ['ro', 'lo', 'ti', 'di'],
    ikon: '🍞',
  },
  {
    kata: 'topi',
    suku1: 'to',
    suku2: 'pi',
    opsiPotongan: ['po', 'to', 'pi', 'bi'],
    ikon: '🧢',
  },
  {
    kata: 'ikan',
    suku1: 'i',
    suku2: 'kan',
    opsiPotongan: ['i', 'e', 'kan', 'kam'],
    ikon: '🐟',
  },
  {
    kata: 'rumah',
    suku1: 'ru',
    suku2: 'mah',
    opsiPotongan: ['ru', 'lu', 'mah', 'nah'],
    ikon: '🏠',
  },
];

export default function GamePasanganKata({ onSelesai, onBatal }) {
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [waktuMulai, setWaktuMulai] = useState(Date.now());
  const [riwayat, setRiwayat] = useState([]);
  const [pilihanSlot, setPilihanSlot] = useState([null, null]);
  const [statusJawaban, setStatusJawaban] = useState(null); // 'benar' | 'salah' | null

  const soalAktif = daftarSoalPasangan[indeksSoal];

  const putarSuara = (kata) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const ucapan = new SpeechSynthesisUtterance(
        `Pasangkan dua suku kata untuk gambar, ${kata}`
      );
      ucapan.lang = 'id-ID';
      ucapan.rate = 0.85;
      window.speechSynthesis.speak(ucapan);
    }
  };

  useEffect(() => {
    setPilihanSlot([null, null]);
    setStatusJawaban(null);
    setWaktuMulai(Date.now());

    const jeda = setTimeout(() => {
      putarSuara(daftarSoalPasangan[indeksSoal].kata);
    }, 250);

    return () => {
      clearTimeout(jeda);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [indeksSoal]);

  const handlePilihPotongan = (indeksOpsi, teks) => {
    if (statusJawaban !== null) return;

    // Cegah kartu potongan yang sama dipilih dua kali
    if (pilihanSlot.some((item) => item && item.indeksOpsi === indeksOpsi)) return;

    const slotBaru = [...pilihanSlot];
    if (slotBaru[0] === null) {
      slotBaru[0] = { indeksOpsi, teks };
      setPilihanSlot(slotBaru);
    } else if (slotBaru[1] === null) {
      slotBaru[1] = { indeksOpsi, teks };
      setPilihanSlot(slotBaru);
      evaluasiPasangan(slotBaru);
    }
  };

  const handleResetSlot = (posisi) => {
    if (statusJawaban !== null) return;
    const slotBaru = [...pilihanSlot];
    slotBaru[posisi] = null;
    setPilihanSlot(slotBaru);
  };

  const evaluasiPasangan = (slotLengkap) => {
    const waktuSelesai = Date.now();
    const durasiDetik = Number(((waktuSelesai - waktuMulai) / 1000).toFixed(2));
    const kataGabungan = `${slotLengkap[0].teks}${slotLengkap[1].teks}`;
    const apakahBenar = kataGabungan === soalAktif.kata;

    setStatusJawaban(apakahBenar ? 'benar' : 'salah');

    const catatanBaru = [
      ...riwayat,
      {
        ronde: indeksSoal + 1,
        target: soalAktif.kata,
        jawaban: kataGabungan,
        benar: apakahBenar,
        waktuDetik: durasiDetik,
      },
    ];
    setRiwayat(catatanBaru);

    setTimeout(() => {
      if (indeksSoal + 1 < daftarSoalPasangan.length) {
        setIndeksSoal(indeksSoal + 1);
      } else {
        const jumlahBenar = catatanBaru.filter((item) => item.benar).length;
        const totalWaktu = catatanBaru.reduce((acc, item) => acc + item.waktuDetik, 0);
        const rataRataWaktu = Number((totalWaktu / daftarSoalPasangan.length).toFixed(2));
        const persentaseAkurasi = Math.round(
          (jumlahBenar / daftarSoalPasangan.length) * 100
        );

        onSelesai({
          idGame: 'pasangan-kata',
          namaGame: 'Pasangan Kata',
          jumlahBenar,
          totalSoal: daftarSoalPasangan.length,
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
        <span className="bg-orange-100 text-orange-900 text-xs font-extrabold px-4 py-1.5 rounded-full">
          Soal {indeksSoal + 1} dari {daftarSoalPasangan.length}
        </span>
      </div>

      {/* Bilah Progres */}
      <div className="w-full bg-slate-200 h-3 rounded-full mb-8 overflow-hidden">
        <div
          className="bg-orange-500 h-full transition-all duration-300"
          style={{
            width: `${((indeksSoal + 1) / daftarSoalPasangan.length) * 100}%`,
          }}
        />
      </div>

      <div className="bg-white rounded-3xl shadow-lg border-2 border-orange-100 p-8 text-center">
        <h2 className="text-xl md:text-2xl font-extrabold text-indigo-950 mb-2">
          🧩 Pasangkan Suku Kata!
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Pilih 2 kepingan suku kata di bawah untuk menyusun nama gambar ini.
        </p>

        {/* Gambar Target */}
        <div className="inline-flex flex-col items-center bg-orange-50/70 border border-orange-200 rounded-2xl px-10 py-5 mb-8">
          <span className="text-7xl mb-3">{soalAktif.ikon}</span>
          <button
            type="button"
            onClick={() => putarSuara(soalAktif.kata)}
            className="text-xs font-bold bg-orange-200 hover:bg-orange-300 text-orange-950 px-4 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5"
          >
            <span>🔊</span> Dengar Nama Gambar
          </button>
        </div>

        {/* Dua Kepingan Puzzle Suku Kata (Sesuai ilustrasi me | ja di UI) */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1].map((posisi) => {
            const isi = pilihanSlot[posisi];
            let gayaKeping =
              'bg-slate-50 border-dashed border-orange-400 text-slate-400';

            if (isi) {
              gayaKeping =
                'bg-amber-100 border-solid border-orange-500 text-indigo-950 shadow-sm';
            }
            if (statusJawaban === 'benar') {
              gayaKeping =
                'bg-emerald-500 border-solid border-emerald-600 text-white scale-105';
            } else if (statusJawaban === 'salah') {
              gayaKeping =
                'bg-amber-400 border-solid border-amber-500 text-white';
            }

            return (
              <button
                key={posisi}
                type="button"
                onClick={() => handleResetSlot(posisi)}
                className={`${gayaKeping} w-28 h-20 rounded-2xl border-3 text-3xl font-extrabold flex items-center justify-center transition transform cursor-pointer select-none`}
              >
                {isi ? isi.teks : posisi === 0 ? 'Awal' : 'Akhir'}
              </button>
            );
          })}
        </div>

        {/* Pilihan Potongan Suku Kata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
          {soalAktif.opsiPotongan.map((potongan, idx) => {
            const sudahDipakai = pilihanSlot.some(
              (item) => item && item.indeksOpsi === idx
            );

            return (
              <button
                key={idx}
                type="button"
                disabled={sudahDipakai}
                onClick={() => handlePilihPotongan(idx, potongan)}
                className={`py-4 px-5 rounded-2xl text-2xl font-extrabold border-2 transition transform select-none ${
                  sudahDipakai
                    ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed scale-95'
                    : 'bg-orange-400 hover:bg-orange-500 border-orange-500 text-white shadow-md hover:-translate-y-1 cursor-pointer'
                }`}
              >
                {potongan}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}