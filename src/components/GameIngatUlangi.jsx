import { useState, useEffect, useRef } from 'react';

const daftarSoalMemori = [
  { urutan: ['b', 'd'] },
  { urutan: ['a', 'u', 'b'] },
  { urutan: ['p', 'q', 'd'] },
  { urutan: ['m', 'n', 'b', 'p'] },
  { urutan: ['d', 'a', 'q', 'u'] },
];

const tombolHuruf = ['b', 'd', 'p', 'q', 'm', 'n', 'a', 'u'];

export default function GameIngatUlangi({ onSelesai, onBatal }) {
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [fase, setFase] = useState('tampil'); // 'tampil' | 'jawab' | 'evaluasi'
  const [hurufMenyala, setHurufMenyala] = useState(null);
  const [jawabanAnak, setJawabanAnak] = useState([]);
  const [statusJawaban, setStatusJawaban] = useState(null); // 'benar' | 'salah' | null
  const [waktuMulai, setWaktuMulai] = useState(Date.now());
  const [riwayat, setRiwayat] = useState([]);
  const [sudahPutarUlang, setSudahPutarUlang] = useState(false);

  const timersRef = useRef([]);
  const soalAktif = daftarSoalMemori[indeksSoal];

  const bersihkanTimer = () => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  };

  const bunyikanTeks = (teks) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const ucapan = new SpeechSynthesisUtterance(teks);
      ucapan.lang = 'id-ID';
      ucapan.rate = 0.9;
      window.speechSynthesis.speak(ucapan);
    }
  };

  const jalankanPeragaanUrutan = (urutanTarget) => {
    bersihkanTimer();
    setFase('tampil');
    setHurufMenyala(null);
    setJawabanAnak([]);
    setStatusJawaban(null);

    urutanTarget.forEach((huruf, idx) => {
      const waktuNyala = 600 + idx * 1050;
      const waktuMati = waktuNyala + 700;

      const t1 = setTimeout(() => {
        setHurufMenyala(huruf);
        bunyikanTeks(huruf);
      }, waktuNyala);

      const t2 = setTimeout(() => {
        setHurufMenyala(null);
      }, waktuMati);

      timersRef.current.push(t1, t2);
    });

    const waktuSelesaiTampil = 600 + urutanTarget.length * 1050 + 200;
    const tSelesai = setTimeout(() => {
      setFase('jawab');
      setWaktuMulai(Date.now());
    }, waktuSelesaiTampil);

    timersRef.current.push(tSelesai);
  };

  useEffect(() => {
    setSudahPutarUlang(false);
    jalankanPeragaanUrutan(daftarSoalMemori[indeksSoal].urutan);

    return () => {
      bersihkanTimer();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [indeksSoal]);

  const handlePutarUlangSekali = () => {
    if (fase !== 'jawab' || jawabanAnak.length > 0 || sudahPutarUlang) return;
    setSudahPutarUlang(true);
    jalankanPeragaanUrutan(soalAktif.urutan);
  };

  const handleKetukHuruf = (huruf) => {
    if (fase !== 'jawab') return;

    bunyikanTeks(huruf);
    const jawabanBaru = [...jawabanAnak, huruf];
    setJawabanAnak(jawabanBaru);

    // Jika jumlah ketukan sudah sama dengan panjang urutan target, langsung evaluasi
    if (jawabanBaru.length === soalAktif.urutan.length) {
      const waktuSelesai = Date.now();
      const durasiDetik = Number(((waktuSelesai - waktuMulai) / 1000).toFixed(2));
      const apakahBenar = jawabanBaru.every(
        (item, idx) => item === soalAktif.urutan[idx]
      );

      setFase('evaluasi');
      setStatusJawaban(apakahBenar ? 'benar' : 'salah');

      const catatanBaru = [
        ...riwayat,
        {
          ronde: indeksSoal + 1,
          target: soalAktif.urutan.join(' - '),
          jawaban: jawabanBaru.join(' - '),
          benar: apakahBenar,
          waktuDetik: durasiDetik,
        },
      ];
      setRiwayat(catatanBaru);

      const tLanjut = setTimeout(() => {
        if (indeksSoal + 1 < daftarSoalMemori.length) {
          setIndeksSoal(indeksSoal + 1);
        } else {
          const jumlahBenar = catatanBaru.filter((item) => item.benar).length;
          const totalWaktu = catatanBaru.reduce((acc, item) => acc + item.waktuDetik, 0);
          const rataRataWaktu = Number((totalWaktu / daftarSoalMemori.length).toFixed(2));
          const persentaseAkurasi = Math.round(
            (jumlahBenar / daftarSoalMemori.length) * 100
          );

          onSelesai({
            idGame: 'ingat-ulangi',
            namaGame: 'Ingat & Ulangi',
            jumlahBenar,
            totalSoal: daftarSoalMemori.length,
            akurasi: persentaseAkurasi,
            rataRataWaktu,
            detail: catatanBaru,
          });
        }
      }, 850);

      timersRef.current.push(tLanjut);
    }
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
        <span className="bg-pink-100 text-pink-900 text-xs font-extrabold px-4 py-1.5 rounded-full">
          Level {indeksSoal + 1} dari {daftarSoalMemori.length} ({soalAktif.urutan.length} Huruf)
        </span>
      </div>

      {/* Bilah Progres */}
      <div className="w-full bg-slate-200 h-3 rounded-full mb-8 overflow-hidden">
        <div
          className="bg-pink-500 h-full transition-all duration-300"
          style={{
            width: `${((indeksSoal + 1) / daftarSoalMemori.length) * 100}%`,
          }}
        />
      </div>

      <div className="bg-white rounded-3xl shadow-lg border-2 border-pink-100 p-8 text-center">
        <h2 className="text-xl md:text-2xl font-extrabold text-indigo-950 mb-2">
          🧠 Ingat & Ulangi Urutannya!
        </h2>

        {/* Indikator Status Fase */}
        <div className="mb-6">
          {fase === 'tampil' ? (
            <span className="inline-block bg-amber-100 text-amber-900 text-sm font-bold px-4 py-1.5 rounded-full animate-pulse">
              👀 Perhatikan dan dengarkan urutan huruf yang menyala...
            </span>
          ) : fase === 'jawab' ? (
            <span className="inline-block bg-emerald-100 text-emerald-900 text-sm font-bold px-4 py-1.5 rounded-full">
              👆 Sekarang giliranmu! Klik {soalAktif.urutan.length} huruf sesuai urutan tadi
            </span>
          ) : (
            <span
              className={`inline-block text-sm font-bold px-4 py-1.5 rounded-full ${
                statusJawaban === 'benar'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-400 text-white'
              }`}
            >
              {statusJawaban === 'benar' ? 'Hebat! Urutannya tepat!' : 'Urutan dicatat, lanjut level berikutnya!'}
            </span>
          )}
        </div>

        {/* Kotak Indikator Langkah Jawaban Anak */}
        <div className="flex justify-center gap-3 mb-6">
          {soalAktif.urutan.map((_, idx) => {
            const isi = jawabanAnak[idx];
            let gayaKotak = 'bg-slate-50 border-dashed border-pink-300 text-slate-300';

            if (isi) {
              gayaKotak = 'bg-pink-100 border-solid border-pink-500 text-indigo-950';
            }
            if (statusJawaban === 'benar') {
              gayaKotak = 'bg-emerald-500 border-solid border-emerald-600 text-white';
            } else if (statusJawaban === 'salah') {
              gayaKotak = 'bg-amber-400 border-solid border-amber-500 text-white';
            }

            return (
              <div
                key={idx}
                className={`${gayaKotak} w-14 h-14 rounded-2xl border-2 text-2xl font-extrabold flex items-center justify-center transition`}
              >
                {isi || idx + 1}
              </div>
            );
          })}
        </div>

        {/* Tombol Bantuan Putar Ulang (Maksimal 1x sebelum mengetuk) */}
        {fase === 'jawab' && jawabanAnak.length === 0 && !sudahPutarUlang && (
          <div className="mb-6">
            <button
              type="button"
              onClick={handlePutarUlangSekali}
              className="text-xs font-bold bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 px-3.5 py-1.5 rounded-full transition cursor-pointer"
            >
              🔁 Putar Ulang Urutan (1x)
            </button>
          </div>
        )}

        {/* Papan 8 Tombol Huruf Interaktif */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto">
          {tombolHuruf.map((huruf) => {
            const sedangDisorot = fase === 'tampil' && hurufMenyala === huruf;

            return (
              <button
                key={huruf}
                type="button"
                disabled={fase !== 'jawab'}
                onClick={() => handleKetukHuruf(huruf)}
                className={`py-5 rounded-2xl text-4xl font-extrabold border-3 transition transform select-none ${
                  sedangDisorot
                    ? 'bg-amber-400 border-amber-500 text-indigo-950 scale-110 shadow-xl ring-4 ring-amber-200'
                    : fase === 'jawab'
                    ? 'bg-pink-50 hover:bg-pink-100 border-pink-200 hover:border-pink-500 text-indigo-950 shadow-sm active:scale-95 cursor-pointer'
                    : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
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