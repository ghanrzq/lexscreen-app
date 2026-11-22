import { useState, useEffect, useRef } from 'react';
import { IlustrasiObjek } from './IlustrasiKataKita';

const bankSoalPasangan = [
  {
    target: 'meja',
    sukuKata: ['me', 'ja'],
    opsiGambar: ['meja', 'kursi', 'buku'],
  },
  {
    target: 'bola',
    sukuKata: ['bo', 'la'],
    opsiGambar: ['apel', 'bola', 'topi'],
  },
  {
    target: 'buku',
    sukuKata: ['bu', 'ku'],
    opsiGambar: ['rumah', 'meja', 'buku'],
  },
  {
    target: 'ikan',
    sukuKata: ['i', 'kan'],
    opsiGambar: ['ikan', 'bola', 'kursi'],
  },
  {
    target: 'rumah',
    sukuKata: ['ru', 'mah'],
    opsiGambar: ['topi', 'rumah', 'apel'],
  },
  {
    target: 'topi',
    sukuKata: ['to', 'pi'],
    opsiGambar: ['kursi', 'ikan', 'topi'],
  },
];

export default function GamePasanganKata({ onSelesai, onBatal }) {
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [pilihanDipilih, setPilihanDipilih] = useState(null);
  const [riwayatJawaban, setRiwayatJawaban] = useState([]);
  const waktuMulaiRef = useRef(Date.now());

  const soalAktif = bankSoalPasangan[indeksSoal];

  useEffect(() => {
    waktuMulaiRef.current = Date.now();
    setPilihanDipilih(null);
  }, [indeksSoal]);

  const bunyikanKata = (kata) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const ucapan = new SpeechSynthesisUtterance(kata);
      ucapan.lang = 'id-ID';
      ucapan.rate = 0.85;
      window.speechSynthesis.speak(ucapan);
    }
  };

  const handlePilihGambar = (namaGambar) => {
    if (pilihanDipilih !== null) return;

    const waktuDetik = Number(
      ((Date.now() - waktuMulaiRef.current) / 1000).toFixed(2)
    );
    const benar = namaGambar === soalAktif.target;

    setPilihanDipilih(namaGambar);

    const catatanBaru = [
      ...riwayatJawaban,
      {
        target: soalAktif.target,
        jawaban: namaGambar,
        benar,
        waktuDetik,
      },
    ];
    setRiwayatJawaban(catatanBaru);

    setTimeout(() => {
      if (indeksSoal + 1 < bankSoalPasangan.length) {
        setIndeksSoal(indeksSoal + 1);
      } else {
        const jumlahBenar = catatanBaru.filter((item) => item.benar).length;
        const totalSoal = bankSoalPasangan.length;
        const akurasi = Math.round((jumlahBenar / totalSoal) * 100);
        const rataRataWaktu = Number(
          (
            catatanBaru.reduce((acc, item) => acc + item.waktuDetik, 0) / totalSoal
          ).toFixed(2)
        );

        onSelesai({
          idGame: 'pasangan-kata',
          namaGame: 'Pasangan Kata',
          akurasi,
          rataRataWaktu,
          jumlahBenar,
          totalSoal,
          detail: catatanBaru,
        });
      }
    }, 950);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBatal}
          className="text-slate-500 hover:text-indigo-950 font-bold text-sm cursor-pointer"
        >
          ← Keluar Permainan
        </button>
        <span className="bg-orange-100 text-orange-900 text-xs font-extrabold px-3.5 py-1.5 rounded-full">
          Soal {indeksSoal + 1} dari {bankSoalPasangan.length}
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-orange-100 shadow-md text-center">
        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-700">
          🧩 Pasangan Kata & Ilustrasi Presisi
        </span>
        <h2 className="text-lg md:text-xl font-extrabold text-indigo-950 mt-1 mb-6">
          Pilih gambar yang sesuai dengan kata di bawah ini:
        </h2>

        {/* Kartu Kata Berwarna per Suku Kata */}
        <div className="inline-flex items-center gap-3 bg-orange-50 border-2 border-orange-200 px-8 py-4 rounded-2xl mb-8">
          <div className="text-3xl md:text-4xl font-extrabold tracking-wide">
            {soalAktif.sukuKata.map((suku, idx) => (
              <span
                key={idx}
                className={idx % 2 === 0 ? 'text-indigo-950' : 'text-teal-700'}
              >
                {suku}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => bunyikanKata(soalAktif.target)}
            title="Dengarkan kata"
            className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-500 text-indigo-950 flex items-center justify-center text-lg shadow-xs cursor-pointer"
          >
            🔊
          </button>
        </div>

        {/* 3 Pilihan Ilustrasi SVG Akurat */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {soalAktif.opsiGambar.map((namaObjek) => {
            const dipilih = pilihanDipilih === namaObjek;
            const benar = namaObjek === soalAktif.target;

            let gayaKartu =
              'bg-slate-50/70 border-slate-200 hover:border-orange-400 hover:bg-orange-50/40';
            if (pilihanDipilih !== null) {
              if (benar) {
                gayaKartu = 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300';
              } else if (dipilih && !benar) {
                gayaKartu = 'bg-rose-50 border-rose-400';
              }
            }

            return (
              <button
                key={namaObjek}
                type="button"
                disabled={pilihanDipilih !== null}
                onClick={() => handlePilihGambar(namaObjek)}
                className={`p-6 rounded-2xl border-2 transition flex flex-col items-center justify-center gap-2 cursor-pointer ${gayaKartu}`}
              >
                <IlustrasiObjek nama={namaObjek} className="w-24 h-24" />
                {pilihanDipilih !== null && benar && (
                  <span className="text-xs font-extrabold text-emerald-700">
                    ✅ Tepat!
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}