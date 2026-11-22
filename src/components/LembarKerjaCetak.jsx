import { useState, useMemo } from 'react';
import { IlustrasiObjek } from './IlustrasiKataKita';

const bankPemenggalan = {
  meja: ['me', 'ja'],
  kursi: ['kur', 'si'],
  bola: ['bo', 'la'],
  buku: ['bu', 'ku'],
  apel: ['a', 'pel'],
  ikan: ['i', 'kan'],
  rumah: ['ru', 'mah'],
  topi: ['to', 'pi'],
  lari: ['la', 'ri'],
  air: ['a', 'ir'],
  ibu: ['i', 'bu'],
  mata: ['ma', 'ta'],
  kaki: ['ka', 'ki'],
  daun: ['da', 'un'],
  palu: ['pa', 'lu'],
};

const barisDiskriminasiDefault = [
  { target: 'b', deret: ['d', 'b', 'p', 'd', 'b', 'q', 'b', 'd'] },
  { target: 'd', deret: ['b', 'd', 'q', 'd', 'p', 'b', 'd', 'q'] },
  { target: 'p', deret: ['q', 'p', 'b', 'p', 'd', 'q', 'p', 'b'] },
  { target: 'm', deret: ['n', 'm', 'w', 'm', 'n', 'm', 'w', 'n'] },
];

const daftarCocokkanObjek = [
  { nama: 'meja', suku: 'me - ja' },
  { nama: 'bola', suku: 'bo - la' },
  { nama: 'buku', suku: 'bu - ku' },
  { nama: 'ikan', suku: 'i - kan' },
];

export default function LembarKerjaCetak({
  dataSesi,
  hasilGame,
  onKembaliKeLaporan,
}) {
  const [modeHematTinta, setModeHematTinta] = useState(false);

  // Ekstrak huruf dan kata spesifik yang keliru dijawab anak saat bermain
  const materiAdaptif = useMemo(() => {
    const hurufKeliru = [];
    const kataKeliru = [];

    Object.values(hasilGame || {}).forEach((game) => {
      if (Array.isArray(game.detail)) {
        game.detail.forEach((item) => {
          if (item && item.benar === false && item.target) {
            const teks = String(item.target).trim().toLowerCase();
            if (!teks) return;

            if (teks.length === 1) {
              if (!hurufKeliru.includes(teks)) hurufKeliru.push(teks);
            } else if (teks.length <= 10 && !teks.includes(' ')) {
              if (!kataKeliru.includes(teks)) kataKeliru.push(teks);
            }
          }
        });
      }
    });

    const adaDataAdaptif = hurufKeliru.length > 0 || kataKeliru.length > 0;

    // Lengkapi hingga 4 huruf utama untuk latihan menebalkan
    const cadanganHuruf = ['b', 'd', 'p', 'q'];
    const daftarHurufTebalkan = [...hurufKeliru];
    cadanganHuruf.forEach((h) => {
      if (daftarHurufTebalkan.length < 4 && !daftarHurufTebalkan.includes(h)) {
        daftarHurufTebalkan.push(h);
      }
    });

    // Lengkapi hingga 4 kata utama untuk latihan menulis & pemenggalan suku kata
    const cadanganKata = ['bola', 'meja', 'daun', 'buku'];
    const daftarKataTebalkan = [...kataKeliru];
    cadanganKata.forEach((k) => {
      if (daftarKataTebalkan.length < 4 && !daftarKataTebalkan.includes(k)) {
        daftarKataTebalkan.push(k);
      }
    });

    return {
      adaDataAdaptif,
      daftarHurufTebalkan: daftarHurufTebalkan.slice(0, 4),
      daftarKataTebalkan: daftarKataTebalkan.slice(0, 4),
    };
  }, [hasilGame]);

  const pecahSukuKata = (kata) => {
    if (bankPemenggalan[kata]) {
      return bankPemenggalan[kata].join(' - ');
    }
    if (kata.length >= 4) {
      const tengah = Math.ceil(kata.length / 2);
      return `${kata.slice(0, tengah)} - ${kata.slice(tengah)}`;
    }
    return kata;
  };

  const identitas = dataSesi?.identitas || {
    namaSiswa: 'Siswa KataKita',
    kelas: '4 SD',
    asalSekolah: 'SDN Percontohan',
    tanggal: new Date().toISOString().split('T')[0],
    namaPengisi: 'Pendamping',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Aturan CSS Khusus Cetak Kertas A4 */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            background: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* BILAH KONTROL LAYAR (TIDAK IKUT TERCETAK) */}
      <div className="no-print bg-white rounded-2xl p-4 mb-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onKembaliKeLaporan}
          className="text-teal-700 font-bold text-sm hover:underline cursor-pointer"
        >
          ← Kembali ke Laporan
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={modeHematTinta}
              onChange={(e) => setModeHematTinta(e.target.checked)}
              className="accent-indigo-950 w-4 h-4 cursor-pointer"
            />
            <span>🖨️ Mode Hemat Tinta (Hitam-Putih)</span>
          </label>

          <button
            type="button"
            onClick={() => window.print()}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-xl shadow transition cursor-pointer flex items-center gap-2"
          >
            <span>📄</span> Cetak / Simpan PDF (A4)
          </button>
        </div>
      </div>

      {/* KANVAS LEMBAR KERJA A4 */}
      <div
        className={`bg-white rounded-3xl print:rounded-none p-6 sm:p-10 print:p-2 border-2 print:border-0 shadow-lg print:shadow-none space-y-6 ${
          modeHematTinta
            ? 'grayscale border-slate-400 text-black'
            : 'border-sky-200 text-slate-800'
        }`}
      >
        {/* 1. KOP LEMBAR KERJA */}
        <div
          className={`rounded-2xl p-5 border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            modeHematTinta
              ? 'bg-white border-slate-800'
              : 'bg-sky-50/80 border-teal-500'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              <span className="text-lg font-extrabold tracking-tight text-indigo-950">
                KataKita • Lembar Latihan Mandiri
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {materiAdaptif.adaDataAdaptif
                ? 'Disusun adaptif berdasarkan pola huruf & kata dari sesi skrining siswa.'
                : 'Lembar latihan dasar pengenalan huruf cermin, bunyi, dan suku kata.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs bg-white p-3 rounded-xl border border-slate-300">
            <span className="text-slate-500">Nama Anak:</span>
            <span className="font-extrabold text-indigo-950">{identitas.namaSiswa}</span>
            <span className="text-slate-500">Kelas / Sekolah:</span>
            <span className="font-bold text-slate-800">
              {identitas.kelas} • {identitas.asalSekolah}
            </span>
            <span className="text-slate-500">Tanggal Cetak:</span>
            <span className="font-semibold text-slate-700">{identitas.tanggal}</span>
          </div>
        </div>

        {/* 2. BAGIAN A: LATIHAN MENEBALKAN & MENYALIN HURUF TARGET */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-indigo-950">
              A. Tebalkan Garis Putus-Putus, Lalu Salin Ulang di Kotak Kosong
            </h2>
            <span className="text-[11px] font-semibold text-slate-500">
              Ucapkan bunyi hurufnya saat menulis!
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {materiAdaptif.daftarHurufTebalkan.map((huruf, idx) => (
              <div
                key={idx}
                className="border-2 border-slate-300 rounded-2xl p-3 flex items-center justify-around bg-white"
              >
                {/* Huruf Contoh */}
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 block">
                    Contoh
                  </span>
                  <span className="text-5xl font-extrabold text-indigo-950 leading-none">
                    {huruf}
                  </span>
                </div>

                {/* Huruf Putus-Putus untuk Ditebalkan */}
                <div className="text-center border-x border-dashed border-slate-300 px-3">
                  <span className="text-[10px] font-bold text-slate-400 block">
                    Tebalkan
                  </span>
                  <span
                    style={{
                      WebkitTextStroke: '1.5px #64748B',
                      color: 'transparent',
                    }}
                    className="text-5xl font-extrabold leading-none select-none"
                  >
                    {huruf}
                  </span>
                </div>

                {/* Kotak Kosong untuk Menulis Mandiri */}
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 block">
                    Tulis
                  </span>
                  <div className="w-11 h-12 border-2 border-dashed border-slate-300 rounded-xl mt-0.5" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. BAGIAN B: LATIHAN DISKRIMINASI VISUAL HURUF CERMIN */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-indigo-950">
            B. Lingkari Semua Huruf yang Sama dengan Huruf di Kotak Kiri
          </h2>

          <div className="border-2 border-slate-300 rounded-2xl divide-y divide-slate-200 overflow-hidden">
            {barisDiskriminasiDefault.map((baris, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-4 py-2.5 bg-white"
              >
                <div className="flex items-center gap-2.5 pr-4 border-r-2 border-slate-300">
                  <span className="text-[11px] font-bold text-slate-500">Cari:</span>
                  <span className="w-9 h-9 rounded-xl bg-teal-600 text-white font-extrabold text-xl flex items-center justify-center">
                    {baris.target}
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-around pl-3">
                  {baris.deret.map((hurufOpsi, i) => (
                    <span
                      key={i}
                      className="w-9 h-9 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-xl font-bold text-slate-800"
                    >
                      {hurufOpsi}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. BAGIAN C: LATIHAN PEMENGGALAN SUKU KATA & MENYALIN KATA */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-indigo-950">
            C. Baca Pemenggalan Suku Kata, Lalu Salin Katanya dengan Rapi
          </h2>

          <div className="grid sm:grid-cols-2 gap-3">
            {materiAdaptif.daftarKataTebalkan.map((kata, idx) => (
              <div
                key={idx}
                className="border-2 border-slate-300 rounded-2xl p-3.5 flex items-center justify-between gap-3 bg-white"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-teal-700 block">
                    Suku Kata: {pecahSukuKata(kata)}
                  </span>
                  <span className="text-2xl font-extrabold tracking-widest text-indigo-950">
                    {kata}
                  </span>
                </div>

                <div className="flex-1 max-w-[170px] space-y-2 pt-2">
                  <div className="border-b-2 border-dashed border-slate-400 h-4" />
                  <div className="border-b-2 border-slate-400 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. BAGIAN D: TARIK GARIS MENCOCOKKAN GAMBAR & SUKU KATA */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-indigo-950">
            D. Tarik Garis dari Gambar ke Tulisan Suku Kata yang Tepat
          </h2>

          <div className="border-2 border-slate-300 rounded-2xl p-4 grid grid-cols-2 gap-8 items-center bg-white">
            {/* Kolom Gambar Kiri */}
            <div className="space-y-2.5">
              {daftarCocokkanObjek.map((obj) => (
                <div
                  key={obj.nama}
                  className="flex items-center justify-between border border-slate-200 rounded-xl px-3 py-1.5"
                >
                  <IlustrasiObjek nama={obj.nama} className="w-11 h-11" />
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-indigo-950 inline-block" />
                </div>
              ))}
            </div>

            {/* Kolom Kata Kanan (Diacak Urutannya) */}
            <div className="space-y-3">
              {[
                daftarCocokkanObjek[2],
                daftarCocokkanObjek[0],
                daftarCocokkanObjek[3],
                daftarCocokkanObjek[1],
              ].map((obj) => (
                <div
                  key={obj.nama}
                  className="flex items-center gap-3 border border-slate-200 rounded-xl px-3 py-3"
                >
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-indigo-950 inline-block shrink-0" />
                  <span className="text-lg font-extrabold tracking-wide text-indigo-950">
                    {obj.suku}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FOOTER APRESIASI ORANG TUA & ANAK */}
        <div className="border-t-2 border-dashed border-slate-300 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-extrabold text-indigo-950">
              ⭐ Bintang Apresiasi Hari Ini (Beri tanda centang bersama orang tua):
            </p>
            <div className="flex flex-wrap gap-4 mt-1.5 text-slate-700 font-semibold">
              <span>[ &nbsp; ] Berani mencoba</span>
              <span>[ &nbsp; ] Menulis dengan sabar</span>
              <span>[ &nbsp; ] Membaca bersuara</span>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <p className="text-slate-500">Paraf Orang Tua / Wali:</p>
            <div className="w-40 h-9 border-b-2 border-slate-400 mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
}