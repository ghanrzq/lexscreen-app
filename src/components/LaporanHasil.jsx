const infoAspekGame = [
  {
    id: 'mencari-huruf',
    nama: 'Mencari Huruf',
    ikon: '🔍',
    aspek: 'Diskriminasi Visual Huruf Mirip (b/d, p/q, m/n)',
  },
  {
    id: 'dengar-pilih',
    nama: 'Dengar & Pilih',
    ikon: '👂',
    aspek: 'Kesadaran Fonologis & Pemetaan Bunyi-Kata',
  },
  {
    id: 'urutkan-kata',
    nama: 'Urutkan Kata',
    ikon: '🔤',
    aspek: 'Urutan Huruf & Memori Ejaan Kata',
  },
  {
    id: 'baca-cepat',
    nama: 'Baca Cepat',
    ikon: '⭐',
    aspek: 'Kelancaran Membaca & Kecepatan Pemrosesan',
  },
  {
    id: 'pasangan-kata',
    nama: 'Pasangan Kata',
    ikon: '🧩',
    aspek: 'Sintesis Suku Kata & Pemahaman Makna',
  },
  {
    id: 'ingat-ulangi',
    nama: 'Ingat & Ulangi',
    ikon: '🧠',
    aspek: 'Memori Kerja Jangka Pendek Sekuensial',
  },
];

export default function LaporanHasil({
  dataSesi,
  hasilGame,
  onKembaliKeArena,
  onSimpanKeMonitoring,
  sudahTersimpan,
}) {
  const listGameDimainkan = Object.values(hasilGame);
  const jumlahDimainkan = listGameDimainkan.length;

  const rataRataAkurasi =
    jumlahDimainkan > 0
      ? Math.round(
          listGameDimainkan.reduce((acc, g) => acc + g.akurasi, 0) / jumlahDimainkan
        )
      : 0;

  const persentaseKesulitan = jumlahDimainkan > 0 ? 100 - rataRataAkurasi : 0;

  const rataRataWaktu =
    jumlahDimainkan > 0
      ? Number(
          (
            listGameDimainkan.reduce((acc, g) => acc + g.rataRataWaktu, 0) /
            jumlahDimainkan
          ).toFixed(2)
        )
      : 0;

  // Mesin Penilaian Gabungan (Checklist Observasi + Performa Game)
  const skorChecklist = dataSesi.jumlahTandaYa;
  const levelChecklist = skorChecklist >= 10 ? 2 : skorChecklist >= 6 ? 1 : 0;
  const levelGame =
    jumlahDimainkan === 0
      ? 0
      : persentaseKesulitan >= 50
      ? 2
      : persentaseKesulitan >= 20 || rataRataWaktu > 4.5
      ? 1
      : 0;

  const levelAkhir = Math.max(levelChecklist, levelGame);

  const kategoriHasil = [
    {
      level: 0,
      status: 'Risiko Rendah — Kemungkinan Kecil Disleksia',
      warnaBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      warnaHeader: 'from-teal-600 to-emerald-600',
      ringkasan:
        'Indikator observasi awal dan performa permainan literasi berada pada kategori baik. Tetap pertahankan kebiasaan membaca yang menyenangkan dan apresiatif di rumah maupun sekolah.',
    },
    {
      level: 1,
      status: 'Risiko Sedang — Perlu Observasi & Latihan Tambahan',
      warnaBadge: 'bg-amber-100 text-amber-900 border-amber-300',
      warnaHeader: 'from-amber-500 to-orange-600',
      ringkasan:
        'Ditemukan beberapa tanda hambatan pada aspek pengenalan huruf, fonologi, atau kecepatan baca. Siswa disarankan mendapatkan pendampingan belajar multisensori rutin serta evaluasi ulang dalam 1–3 bulan.',
    },
    {
      level: 2,
      status: 'Risiko Tinggi — Disarankan Asesmen Formal',
      warnaBadge: 'bg-rose-100 text-rose-900 border-rose-300',
      warnaHeader: 'from-rose-600 to-amber-700',
      ringkasan:
        'Terdapat indikasi kuat kesulitan pemrosesan huruf, bunyi, atau kecepatan membaca. Sangat disarankan untuk melakukan konsultasi dan asesmen diagnostik formal bersama psikolog pendidikan atau profesional terkait.',
    },
  ][levelAkhir];

  // Rekomendasi Tindak Lanjut Dinamis Berdasarkan Aspek yang Lemah
  const buatRekomendasi = () => {
    const daftar = [];

    if (
      (hasilGame['mencari-huruf'] && hasilGame['mencari-huruf'].akurasi < 80) ||
      (hasilGame['urutkan-kata'] && hasilGame['urutkan-kata'].akurasi < 80)
    ) {
      daftar.push({
        judul: 'Latihan Multisensori Visual-Taktil (VAKT)',
        isi: 'Gunakan media kartu huruf bertekstur, pasir, atau plastisin untuk melatih perbedaan bentuk huruf cermin (b/d, p/q) sambil melafalkan bunyinya secara bersamaan.',
      });
    }

    if (
      (hasilGame['dengar-pilih'] && hasilGame['dengar-pilih'].akurasi < 80) ||
      (hasilGame['pasangan-kata'] && hasilGame['pasangan-kata'].akurasi < 80)
    ) {
      daftar.push({
        judul: 'Penguatan Kesadaran Fonologis & Suku Kata',
        isi: 'Latih pemenggalan suku kata dengan tepuk tangan (contoh: bo-la, me-ja) dan permainan tebak bunyi awal kata sebelum membaca teks panjang.',
      });
    }

    if (
      (hasilGame['baca-cepat'] && hasilGame['baca-cepat'].akurasi < 80) ||
      rataRataWaktu > 4.0
    ) {
      daftar.push({
        judul: 'Pendampingan Membaca Bertahap & Apresiatif',
        isi: 'Terapkan bacaan pendek dengan ukuran huruf besar dan spasi lega. Berikan apresiasi pada setiap usaha anak tanpa menekan kesalahan agar rasa percaya dirinya tetap terjaga.',
      });
    }

    if (hasilGame['ingat-ulangi'] && hasilGame['ingat-ulangi'].akurasi < 80) {
      daftar.push({
        judul: 'Stimulasi Memori Kerja & Instruksi Bertahap',
        isi: 'Berikan instruksi belajar satu per satu secara singkat dan gunakan bantuan petunjuk visual di kelas maupun di rumah.',
      });
    }

    if (daftar.length === 0) {
      daftar.push({
        judul: 'Pengayaan Literasi Multisensori',
        isi: 'Lanjutkan latihan membaca nyaring bersama orang tua/guru selama 15 menit setiap hari menggunakan buku cerita bergambar yang diminati anak.',
      });
    }

    return daftar;
  };

  const rekomendasiTindakLanjut = buatRekomendasi();

  const handleKlikSimpan = () => {
    onSimpanKeMonitoring({
      tanggalSimpan: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      rataRataAkurasi,
      persentaseKesulitan,
      rataRataWaktu,
      jumlahGameDimainkan: jumlahDimainkan,
      levelAkhir,
      statusHasil: kategoriHasil.status,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={onKembaliKeArena}
          className="text-teal-700 font-bold hover:underline flex items-center gap-2 cursor-pointer"
        >
          ← Kembali ke Arena Game
        </button>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
          >
            🖨️ Cetak / Simpan PDF
          </button>

          <button
            type="button"
            onClick={handleKlikSimpan}
            disabled={sudahTersimpan}
            className={`font-bold text-sm px-5 py-2.5 rounded-xl shadow transition ${
              sudahTersimpan
                ? 'bg-emerald-100 text-emerald-800 cursor-default'
                : 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer'
            }`}
          >
            {sudahTersimpan
              ? '✅ Tersimpan di Monitoring'
              : '💾 Simpan ke Monitoring'}
          </button>
        </div>
      </div>

      {/* KARTU HEADER HASIL SKRINING */}
      <div
        className={`bg-gradient-to-r ${kategoriHasil.warnaHeader} text-white rounded-3xl p-6 md:p-8 mb-8 shadow-lg`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-5 mb-5">
          <div>
            <span className="bg-white/20 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
              Laporan Hasil Skrining Dini KataKita
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-2">
              {dataSesi.identitas.namaSiswa}
            </h1>
            <p className="text-sm text-white/90 mt-1">
              Kelas {dataSesi.identitas.kelas} • {dataSesi.identitas.asalSekolah} • Tanggal:{' '}
              {dataSesi.identitas.tanggal}
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 text-left md:text-right">
            <p className="text-xs text-white/80">Pendamping Observasi</p>
            <p className="font-bold text-base">
              {dataSesi.identitas.namaPengisi} (
              {dataSesi.identitas.peran === 'guru' ? 'Guru' : 'Orang Tua'})
            </p>
          </div>
        </div>

        <div className="bg-white text-slate-800 rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Interpretasi Analisis Sistem:
          </p>
          <span
            className={`inline-block text-sm md:text-base font-extrabold px-4 py-1.5 rounded-xl border ${kategoriHasil.warnaBadge} mb-2`}
          >
            {kategoriHasil.status}
          </span>
          <p className="text-sm text-slate-600 leading-relaxed">
            {kategoriHasil.ringkasan}
          </p>
        </div>
      </div>

      {/* 3 METRIK UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">
            1. Checklist Observasi
          </p>
          <p className="text-3xl font-extrabold text-indigo-950 mt-1">
            {dataSesi.jumlahTandaYa}{' '}
            <span className="text-base font-semibold text-slate-400">
              / {dataSesi.totalPertanyaan} tanda
            </span>
          </p>
          <p className="text-xs font-semibold text-teal-700 mt-1">
            {dataSesi.interpretasi}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">
            2. Rata-Rata Akurasi Game
          </p>
          <p className="text-3xl font-extrabold text-indigo-950 mt-1">
            {rataRataAkurasi}%{' '}
            <span className="text-base font-semibold text-slate-400">
              ({jumlahDimainkan}/6 game)
            </span>
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Tingkat indikasi kesalahan: {persentaseKesulitan}%
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">
            3. Kecepatan Respons Rata-Rata
          </p>
          <p className="text-3xl font-extrabold text-indigo-950 mt-1">
            {rataRataWaktu}{' '}
            <span className="text-base font-semibold text-slate-400">detik/soal</span>
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Diukur secara otomatis saat anak bermain
          </p>
        </div>
      </div>

      {/* RINCIAN PERFORMA 6 AKTIVITAS */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm mb-8">
        <h2 className="text-lg font-extrabold text-indigo-950 mb-4">
          Rincian Performa Per Aktivitas Skrining
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-100 text-xs uppercase text-slate-400">
                <th className="py-3 pr-4">Aktivitas</th>
                <th className="py-3 px-4">Aspek Kognitif & Literasi</th>
                <th className="py-3 px-4">Akurasi</th>
                <th className="py-3 pl-4">Kecepatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {infoAspekGame.map((item) => {
                const skor = hasilGame[item.id];
                return (
                  <tr key={item.id}>
                    <td className="py-3.5 pr-4 font-bold text-indigo-950 whitespace-nowrap">
                      {item.ikon} {item.nama}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{item.aspek}</td>
                    <td className="py-3.5 px-4 font-bold">
                      {skor ? (
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs ${
                            skor.akurasi >= 80
                              ? 'bg-emerald-100 text-emerald-800'
                              : skor.akurasi >= 50
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {skor.akurasi}% ({skor.jumlahBenar}/{skor.totalSoal})
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Belum dimainkan
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 pl-4 text-slate-700 font-semibold whitespace-nowrap">
                      {skor ? `${skor.rataRataWaktu} detik` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* REKOMENDASI INTERVENSI MULTISENSORI */}
      <div className="bg-sky-50/80 rounded-3xl p-6 md:p-8 border border-sky-100 mb-6">
        <h2 className="text-lg font-extrabold text-indigo-950 mb-4">
          💡 Rekomendasi Tindak Lanjut untuk Guru & Orang Tua
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {rekomendasiTindakLanjut.map((rek, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs"
            >
              <h3 className="font-bold text-teal-700 text-sm mb-1.5">{rek.judul}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{rek.isi}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DISCLAIMER ETIKA ASESMEN */}
      <p className="text-xs text-slate-500 text-center bg-white p-4 rounded-2xl border border-slate-200">
        <strong>Catatan Penting:</strong> Instrumen KataKita berfungsi sebagai media skrining deteksi dini untuk membantu perencanaan intervensi pembelajaran, bukan sebagai alat diagnosis klinis final.
      </p>
    </div>
  );
}