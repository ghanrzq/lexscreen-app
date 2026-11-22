import { useState, useEffect, useRef } from 'react';

const daftarHurufLatihan = [
  {
    huruf: 'b',
    kataKunci: 'bola',
    ikon: '⚽',
    mnemonik: 'Perut bulatnya di depan (kanan), seperti bola.',
    langkahGoresan: [
      '1. Tarik garis lurus dari atas ke bawah',
      '2. Buat lengkungan perut bulat di kanan bawah',
    ],
    suaraInstruksi: 'Ini huruf, b. Seperti pada kata, bola. Perut bulatnya di depan.',
  },
  {
    huruf: 'd',
    kataKunci: 'daun',
    ikon: '🍃',
    mnemonik: 'Perut bulatnya di belakang (kiri), seperti daun.',
    langkahGoresan: [
      '1. Buat lengkungan perut bulat di kiri bawah dulu',
      '2. Tarik garis lurus panjang dari atas ke bawah',
    ],
    suaraInstruksi: 'Ini huruf, d. Seperti pada kata, daun. Perut bulatnya di belakang.',
  },
  {
    huruf: 'p',
    kataKunci: 'palu',
    ikon: '🔨',
    mnemonik: 'Tiangnya ke bawah, kepalanya di kanan atas seperti palu.',
    langkahGoresan: [
      '1. Tarik garis lurus dari tengah ke bawah',
      '2. Buat lengkungan kepala bulat di kanan atas',
    ],
    suaraInstruksi: 'Ini huruf, p. Seperti pada kata, palu. Kepalanya di depan atas.',
  },
  {
    huruf: 'q',
    kataKunci: 'quran / qori',
    ikon: '📖',
    mnemonik: 'Kepalanya di kiri atas, lalu tiangnya lurus ke bawah.',
    langkahGoresan: [
      '1. Buat lengkungan kepala bulat di kiri atas',
      '2. Tarik garis lurus panjang ke bawah',
    ],
    suaraInstruksi: 'Ini huruf, q. Kepalanya di belakang atas.',
  },
  {
    huruf: 'm',
    kataKunci: 'meja',
    ikon: '🪑',
    mnemonik: 'Punya dua lengkungan seperti kaki meja.',
    langkahGoresan: [
      '1. Tarik garis pendek dari tengah ke bawah',
      '2. Buat dua lengkungan berurutan ke arah kanan',
    ],
    suaraInstruksi: 'Ini huruf, m. Seperti pada kata, meja. Punya dua lengkungan.',
  },
  {
    huruf: 'n',
    kataKunci: 'nasi',
    ikon: '🍚',
    mnemonik: 'Punya satu lengkungan ke arah kanan.',
    langkahGoresan: [
      '1. Tarik garis pendek dari tengah ke bawah',
      '2. Buat satu lengkungan ke arah kanan',
    ],
    suaraInstruksi: 'Ini huruf, n. Seperti pada kata, nasi. Punya satu lengkungan.',
  },
];

const pilihanWarnaSpidol = [
  { id: 'teal', nama: 'Tosca', kode: '#0D9488', kelas: 'bg-teal-600' },
  { id: 'amber', nama: 'Oranye', kode: '#D97706', kelas: 'bg-amber-600' },
  { id: 'indigo', nama: 'Biru Tua', kode: '#312E81', kelas: 'bg-indigo-900' },
  { id: 'rose', nama: 'Merah Muda', kode: '#E11D48', kelas: 'bg-rose-600' },
];

export default function LatihanMenulis({ onKembali }) {
  const [indeksHuruf, setIndeksHuruf] = useState(0);
  const [warnaAktif, setWarnaAktif] = useState(pilihanWarnaSpidol[0]);
  const [sedangMenggambar, setSedangMenggambar] = useState(false);
  const [persenTertutup, setPersenTertutup] = useState(0);
  const [hurufSelesai, setHurufSelesai] = useState({});
  const [pesanApresiasi, setPesanApresiasi] = useState(false);

  const guideCanvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const titikTerakhirRef = useRef(null);

  const dataHuruf = daftarHurufLatihan[indeksHuruf];

  const putarSuara = (teks) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const ucapan = new SpeechSynthesisUtterance(teks);
      ucapan.lang = 'id-ID';
      ucapan.rate = 0.85;
      window.speechSynthesis.speak(ucapan);
    }
  };

  // Gambar pola huruf panduan + siapkan mask evaluasi setiap kali huruf berganti
  useEffect(() => {
    const ukuran = 340;
    const guideCanvas = guideCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;

    if (!guideCanvas || !drawCanvas) return;

    // 1. Bersihkan kanvas goresan anak
    const drawCtx = drawCanvas.getContext('2d');
    drawCtx.clearRect(0, 0, ukuran, ukuran);
    setPersenTertutup(0);
    setPesanApresiasi(false);

    // 2. Gambar garis bantu buku tulis halus & siluet huruf target di guideCanvas
    const guideCtx = guideCanvas.getContext('2d');
    guideCtx.clearRect(0, 0, ukuran, ukuran);

    // Garis bantu atas, tengah (putus-putus), dan garis dasar
    guideCtx.save();
    guideCtx.strokeStyle = '#E2E8F0';
    guideCtx.lineWidth = 2;
    guideCtx.beginPath();
    guideCtx.moveTo(24, 75);
    guideCtx.lineTo(ukuran - 24, 75);
    guideCtx.moveTo(24, 240);
    guideCtx.lineTo(ukuran - 24, 240);
    guideCtx.stroke();

    guideCtx.setLineDash([6, 6]);
    guideCtx.strokeStyle = '#CBD5E1';
    guideCtx.beginPath();
    guideCtx.moveTo(24, 158);
    guideCtx.lineTo(ukuran - 24, 158);
    guideCtx.stroke();
    guideCtx.restore();

    // Siluet huruf besar sebagai area tebalkan
    guideCtx.save();
    guideCtx.font = '800 225px system-ui, -apple-system, sans-serif';
    guideCtx.textAlign = 'center';
    guideCtx.textBaseline = 'middle';
    guideCtx.fillStyle = '#F1F5F9';
    guideCtx.fillText(dataHuruf.huruf, ukuran / 2, ukuran / 2 + 6);

    guideCtx.setLineDash([8, 6]);
    guideCtx.lineWidth = 3;
    guideCtx.strokeStyle = '#94A3B8';
    guideCtx.strokeText(dataHuruf.huruf, ukuran / 2, ukuran / 2 + 6);
    guideCtx.restore();

    // 3. Buat kanvas mask tersembunyi untuk menghitung ketepatan goresan anak
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = ukuran;
    maskCanvas.height = ukuran;
    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.font = '800 225px system-ui, -apple-system, sans-serif';
    maskCtx.textAlign = 'center';
    maskCtx.textBaseline = 'middle';
    maskCtx.fillStyle = '#000000';
    maskCtx.fillText(dataHuruf.huruf, ukuran / 2, ukuran / 2 + 6);
    maskCanvasRef.current = maskCanvas;

    // Putar instruksi suara multisensori otomatis
    const jeda = setTimeout(() => {
      putarSuara(dataHuruf.suaraInstruksi);
    }, 250);

    return () => {
      clearTimeout(jeda);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [indeksHuruf]);

  const ambilKoordinat = (e) => {
    const canvas = drawCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const mulaiGoresan = (e) => {
    e.preventDefault();
    const titik = ambilKoordinat(e);
    setSedangMenggambar(true);
    titikTerakhirRef.current = titik;

    const ctx = drawCanvasRef.current.getContext('2d');
    ctx.fillStyle = warnaAktif.kode;
    ctx.beginPath();
    ctx.arc(titik.x, titik.y, 13, 0, Math.PI * 2);
    ctx.fill();
  };

  const lanjutGoresan = (e) => {
    if (!sedangMenggambar) return;
    e.preventDefault();

    const titikBaru = ambilKoordinat(e);
    const ctx = drawCanvasRef.current.getContext('2d');

    ctx.strokeStyle = warnaAktif.kode;
    ctx.lineWidth = 26;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(titikTerakhirRef.current.x, titikTerakhirRef.current.y);
    ctx.lineTo(titikBaru.x, titikBaru.y);
    ctx.stroke();

    titikTerakhirRef.current = titikBaru;
  };

  const akhiriGoresan = () => {
    if (!sedangMenggambar) return;
    setSedangMenggambar(false);
    titikTerakhirRef.current = null;
    evaluasiGoresan();
  };

  const evaluasiGoresan = () => {
    const drawCanvas = drawCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!drawCanvas || !maskCanvas) return;

    const ukuran = 340;
    const drawData = drawCanvas
      .getContext('2d')
      .getImageData(0, 0, ukuran, ukuran).data;
    const maskData = maskCanvas
      .getContext('2d')
      .getImageData(0, 0, ukuran, ukuran).data;

    let totalPikselTarget = 0;
    let pikselTertutup = 0;
    let pikselLuar = 0;

    for (let i = 3; i < maskData.length; i += 4) {
      const adalahTarget = maskData[i] > 128;
      const sudahDigores = drawData[i] > 128;

      if (adalahTarget) {
        totalPikselTarget++;
        if (sudahDigores) pikselTertutup++;
      } else if (sudahDigores) {
        pikselLuar++;
      }
    }

    if (totalPikselTarget === 0) return;

    const rasioTertutup = pikselTertutup / totalPikselTarget;
    const persentase = Math.min(100, Math.round((rasioTertutup / 0.65) * 100));
    setPersenTertutup(persentase);

    // Berhasil jika minimal 62% badan huruf ditebalkan dan tidak dicoret acak ke seluruh layar
    if (rasioTertutup >= 0.62 && pikselLuar < totalPikselTarget * 2.2) {
      if (!hurufSelesai[dataHuruf.huruf]) {
        setHurufSelesai((prev) => ({ ...prev, [dataHuruf.huruf]: true }));
        setPesanApresiasi(true);
        putarSuara(`Hebat! Kamu berhasil menebalkan huruf ${dataHuruf.huruf} dengan rapi!`);
      } else {
        setPesanApresiasi(true);
      }
    }
  };

  const handleHapusKanvas = () => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return;
    drawCanvas.getContext('2d').clearRect(0, 0, 340, 340);
    setPersenTertutup(0);
    setPesanApresiasi(false);
  };

  const jumlahBintang = Object.keys(hurufSelesai).length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onKembali}
          className="text-teal-700 font-bold hover:underline flex items-center gap-2 cursor-pointer"
        >
          ← Kembali ke Beranda
        </button>

        <div className="bg-amber-100 border border-amber-300 text-amber-950 text-xs font-extrabold px-4 py-1.5 rounded-full">
          ⭐ Bintang Terkumpul: {jumlahBintang} / {daftarHurufLatihan.length} Huruf
        </div>
      </div>

      {/* HEADER MODUL LATIHAN VAKT */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm mb-6">
        <span className="bg-teal-100 text-teal-800 text-xs font-extrabold px-3 py-1 rounded-full">
          Terapi Multisensori VAKT • Visual • Auditori • Kinestetik
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-950 mt-2">
          ✍️ Papan Latihan Menulis Huruf
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Pilih huruf di bawah, dengarkan arah garisnya, lalu tebalkan pola huruf di papan menggunakan jari atau kursor.
        </p>

        {/* PILIHAN 6 HURUF RAWAN TERTUKAR */}
        <div className="grid grid-cols-6 gap-2.5 sm:gap-4 mt-6 max-w-xl">
          {daftarHurufLatihan.map((item, idx) => {
            const aktif = idx === indeksHuruf;
            const selesai = hurufSelesai[item.huruf];

            return (
              <button
                key={item.huruf}
                type="button"
                onClick={() => setIndeksHuruf(idx)}
                className={`py-3 rounded-2xl text-2xl sm:text-3xl font-extrabold border-2 transition relative cursor-pointer ${
                  aktif
                    ? 'bg-indigo-950 text-white border-indigo-950 shadow-md scale-105'
                    : selesai
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-sky-50/70 text-indigo-950 border-slate-200 hover:border-teal-400'
                }`}
              >
                {selesai && (
                  <span className="absolute -top-2 -right-1 text-xs">⭐</span>
                )}
                {item.huruf}
              </button>
            );
          })}
        </div>
      </div>

      {/* AREA PAPAN TRACING & PANDUAN */}
      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI: KANVAS INTERAKTIF */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-md flex flex-col items-center">
          {/* Pilihan Warna Spidol & Tombol Hapus */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Warna Spidol:</span>
              {pilihanWarnaSpidol.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWarnaAktif(w)}
                  title={w.nama}
                  className={`w-7 h-7 rounded-full ${w.kelas} transition transform cursor-pointer ${
                    warnaAktif.id === w.id
                      ? 'ring-3 ring-offset-2 ring-indigo-950 scale-110'
                      : 'opacity-75 hover:opacity-100'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleHapusKanvas}
              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-xl transition cursor-pointer"
            >
              🔄 Hapus & Ulangi
            </button>
          </div>

          {/* Kanvas Bertumpuk (Guide Layer + Drawing Layer) */}
          <div className="relative w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] rounded-2xl border-2 border-dashed border-teal-300 bg-white overflow-hidden shadow-inner">
            <canvas
              ref={guideCanvasRef}
              width={340}
              height={340}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
            <canvas
              ref={drawCanvasRef}
              width={340}
              height={340}
              onPointerDown={mulaiGoresan}
              onPointerMove={lanjutGoresan}
              onPointerUp={akhiriGoresan}
              onPointerLeave={akhiriGoresan}
              className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
            />
          </div>

          {/* Bilah Progres Tebalan & Umpan Balik Positif */}
          <div className="w-full max-w-[340px] mt-4 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Ketepatan Tebalan Huruf &ldquo;{dataHuruf.huruf}&rdquo;</span>
              <span>{persenTertutup}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-teal-500 h-full transition-all duration-300"
                style={{ width: `${persenTertutup}%` }}
              />
            </div>

            {pesanApresiasi && (
              <div className="mt-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl p-3 text-center text-xs font-extrabold animate-bounce">
                🎉 Hebat! Goresan huruf &ldquo;{dataHuruf.huruf}&rdquo; sudah lengkap!
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: PANDUAN ARAH & ASOSIASI VISUAL-AUDITORI */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-amber-50/80 rounded-3xl p-6 border border-amber-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                Ingatan Visual & Bunyi
              </span>
              <button
                type="button"
                onClick={() => putarSuara(dataHuruf.suaraInstruksi)}
                className="text-xs font-bold bg-amber-400 hover:bg-amber-500 text-indigo-950 px-3.5 py-1.5 rounded-full transition cursor-pointer"
              >
                🔊 Dengar Lagi
              </button>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-amber-100 mb-3">
              <span className="text-5xl">{dataHuruf.ikon}</span>
              <div>
                <p className="text-xs text-slate-400 font-bold">Kata Asosiasi:</p>
                <p className="text-xl font-extrabold text-indigo-950">
                  <span className="text-teal-600 underline">{dataHuruf.huruf}</span>
                  {dataHuruf.kataKunci.slice(1)}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
              💡 {dataHuruf.mnemonik}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-sm font-extrabold text-indigo-950 mb-3">
              Urutan Arah Menulis yang Benar:
            </h2>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              {dataHuruf.langkahGoresan.map((langkah, idx) => (
                <li
                  key={idx}
                  className="bg-sky-50/70 border border-sky-100 p-3 rounded-xl text-indigo-950 font-semibold"
                >
                  {langkah}
                </li>
              ))}
            </ul>

            {indeksHuruf + 1 < daftarHurufLatihan.length && (
              <button
                type="button"
                onClick={() => setIndeksHuruf(indeksHuruf + 1)}
                className="w-full mt-5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm py-3 rounded-xl shadow transition cursor-pointer"
              >
                Lanjut ke Huruf &ldquo;{daftarHurufLatihan[indeksHuruf + 1].huruf}&rdquo; →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}