import { useState } from 'react';

const infoAspekGame = [
  {
    id: 'mencari-huruf',
    nama: 'Mencari Huruf',
    ikon: '🔍',
    aspek: 'Diskriminasi Visual Huruf Mirip (b/d, p/q, m/n)',
    domain: 'permukaan',
  },
  {
    id: 'dengar-pilih',
    nama: 'Dengar & Pilih',
    ikon: '👂',
    aspek: 'Kesadaran Fonologis & Pemetaan Bunyi-Kata',
    domain: 'fonologis',
  },
  {
    id: 'urutkan-kata',
    nama: 'Urutkan Kata',
    ikon: '🔤',
    aspek: 'Urutan Huruf & Memori Ejaan Kata',
    domain: 'permukaan',
  },
  {
    id: 'baca-cepat',
    nama: 'Baca Cepat',
    ikon: '⭐',
    aspek: 'Kelancaran Membaca & Kecepatan Pemrosesan',
    domain: 'kecepatan',
  },
  {
    id: 'pasangan-kata',
    nama: 'Pasangan Kata',
    ikon: '🧩',
    aspek: 'Sintesis Suku Kata & Pemahaman Makna',
    domain: 'fonologis',
  },
  {
    id: 'ingat-ulangi',
    nama: 'Ingat & Ulangi',
    ikon: '🧠',
    aspek: 'Memori Kerja Jangka Pendek Sekuensial',
    domain: 'memori',
  },
];

export default function LaporanHasil({
  dataSesi,
  hasilGame,
  onKembaliKeArena,
  onSimpanKeMonitoring,
  sudahTersimpan,
  onBukaLatihan,
}) {
  const [catatanPendamping, setCatatanPendamping] = useState('');

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

  // 1. PEMETAAN 4 PROFIL SUBTIPE KOGNITIF-LITERASI
  const hitungSkorDomain = (daftarIdGame, sertakanFaktorKecepatan = false) => {
    const gameTerkait = daftarIdGame
      .map((id) => hasilGame[id])
      .filter((item) => Boolean(item));

    if (gameTerkait.length === 0) return null;

    const akurasiDomain = Math.round(
      gameTerkait.reduce((acc, g) => acc + g.akurasi, 0) / gameTerkait.length
    );

    if (!sertakanFaktorKecepatan) return akurasiDomain;

    const waktuDomain =
      gameTerkait.reduce((acc, g) => acc + g.rataRataWaktu, 0) / gameTerkait.length;
    const skorKecepatan = waktuDomain <= 2.5 ? 100 : waktuDomain <= 4.5 ? 75 : 50;

    return Math.round(akurasiDomain * 0.7 + skorKecepatan * 0.3);
  };

  const profilSubtipe = [
    {
      id: 'fonologis',
      nama: 'Pemrosesan Fonologis',
      labelSubtipe: 'Kecenderungan Disleksia Fonologis',
      ikon: '👂',
      sumberGame: 'Dengar & Pilih, Pasangan Kata',
      skor: hitungSkorDomain(['dengar-pilih', 'pasangan-kata']),
      deskripsi:
        'Kemampuan membedakan bunyi bahasa (fonem) dan menggabungkan suku kata menjadi kata bermakna.',
    },
    {
      id: 'permukaan',
      nama: 'Visual-Ortografis (Permukaan)',
      labelSubtipe: 'Kecenderungan Disleksia Permukaan',
      ikon: '🔍',
      sumberGame: 'Mencari Huruf, Urutkan Kata',
      skor: hitungSkorDomain(['mencari-huruf', 'urutkan-kata']),
      deskripsi:
        'Ketelitian membedakan bentuk huruf yang mirip (b/d, p/q) serta mengingat susunan ejaan kata.',
    },
    {
      id: 'kecepatan',
      nama: 'Kelancaran & Rapid Naming',
      labelSubtipe: 'Hambatan Kecepatan Pemrosesan',
      ikon: '⚡',
      sumberGame: 'Baca Cepat & Kecepatan Respons',
      skor: hitungSkorDomain(['baca-cepat'], true),
      deskripsi:
        'Kecepatan mengenali simbol kata secara otomatis dan kelancaran membaca di bawah batas waktu.',
    },
    {
      id: 'memori',
      nama: 'Memori Kerja Sekuensial',
      labelSubtipe: 'Hambatan Memori Kerja Jangka Pendek',
      ikon: '🧠',
      sumberGame: 'Ingat & Ulangi',
      skor: hitungSkorDomain(['ingat-ulangi']),
      deskripsi:
        'Kapasitas menyimpan dan mengulang urutan huruf atau instruksi secara berurutan dalam jangka pendek.',
    },
  ];

  // Identifikasi subtipe paling dominan yang membutuhkan perhatian
  const domainTeruji = profilSubtipe.filter((d) => d.skor !== null);
  const domainLemah = [...domainTeruji]
    .filter((d) => d.skor < 80)
    .sort((a, b) => a.skor - b.skor);

  const kesimpulanSubtipe =
    domainTeruji.length === 0
      ? 'Belum ada permainan yang diselesaikan untuk pemetaan subtipe.'
      : domainLemah.length === 0
      ? 'Profil Literasi Seimbang — Seluruh domain yang diuji berada pada kategori baik.'
      : domainLemah.length >= 3
      ? `Profil Kombinasi (Double/Multiple Deficit) — Perlu penguatan utama pada ${domainLemah[0].nama} dan ${domainLemah[1].nama}.`
      : `Fokus Utama: ${domainLemah[0].labelSubtipe} (Skor ${domainLemah[0].skor}%).`;

  // 2. EKSTRAKSI POLA KESALAHAN KONKRET DARI JAWABAN SISWA
  const daftarKesalahanKonkret = [];
  listGameDimainkan.forEach((game) => {
    const detailSoal = Array.isArray(game.detail) ? game.detail : [];
    detailSoal.forEach((item) => {
      if (item && item.benar === false) {
        daftarKesalahanKonkret.push({
          namaGame: game.namaGame,
          target: item.target,
          jawaban: item.jawaban,
          waktu: item.waktuDetik,
        });
      }
    });
  });

  // 3. KALKULASI TINGKAT RISIKO GABUNGAN (CHECKLIST + PERFORMA GAME)
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
        'Indikator observasi awal dan performa permainan literasi berada pada kategori baik. Pertahankan kebiasaan membaca yang menyenangkan dan apresiatif di rumah maupun di sekolah.',
    },
    {
      level: 1,
      status: 'Risiko Sedang — Perlu Observasi & Latihan Multisensori',
      warnaBadge: 'bg-amber-100 text-amber-900 border-amber-300',
      warnaHeader: 'from-amber-500 to-orange-600',
      ringkasan:
        'Ditemukan beberapa tanda hambatan pada aspek pengenalan huruf, fonologi, atau kecepatan baca. Siswa disarankan mendapatkan pendampingan belajar multisensori rutin serta evaluasi ulang dalam 1–3 bulan.',
    },
    {
      level: 2,
      status: 'Risiko Tinggi — Disarankan Asesmen Diagnostik Formal',
      warnaBadge: 'bg-rose-100 text-rose-900 border-rose-300',
      warnaHeader: 'from-rose-600 to-amber-700',
      ringkasan:
        'Terdapat indikasi kuat kesulitan pemrosesan huruf, bunyi, atau kecepatan membaca. Sangat disarankan untuk melakukan konsultasi dan asesmen diagnostik formal bersama psikolog pendidikan atau profesional terkait.',
    },
  ][levelAkhir];

  // 4. REKOMENDASI TERSTRUKTUR UNTUK GURU & ORANG TUA
  const buatRekomendasiTerpisah = () => {
    const untukGuru = [];
    const untukOrangTua = [];

    const skorPermukaan = profilSubtipe.find((d) => d.id === 'permukaan')?.skor;
    const skorFonologis = profilSubtipe.find((d) => d.id === 'fonologis')?.skor;
    const skorKecepatan = profilSubtipe.find((d) => d.id === 'kecepatan')?.skor;
    const skorMemori = profilSubtipe.find((d) => d.id === 'memori')?.skor;

    if (skorPermukaan !== null && skorPermukaan < 80) {
      untukGuru.push(
        'Gunakan lembar kerja dengan ukuran huruf besar, spasi renggang, serta beri penanda warna berbeda pada huruf cermin (b/d, p/q) di papan tulis.'
      );
      untukOrangTua.push(
        'Latih anak membentuk huruf b, d, p, q menggunakan plastisin, pasir, atau kartu bertekstur (metode taktil-kinestetik) selama 10 menit setiap hari.'
      );
    }

    if (skorFonologis !== null && skorFonologis < 80) {
      untukGuru.push(
        'Terapkan metode mengeja berbasis pemenggalan suku kata dan asosiasi bunyi awal sebelum meminta siswa membaca kalimat panjang.'
      );
      untukOrangTua.push(
        'Ajak anak bermain tebak bunyi awal benda di rumah dan bertepuk tangan mengikuti jumlah suku kata (contoh: bo-la, me-ja).'
      );
    }

    if ((skorKecepatan !== null && skorKecepatan < 80) || rataRataWaktu > 4.0) {
      untukGuru.push(
        'Berikan kelonggaran waktu saat siswa mengerjakan tugas membaca/menyalin serta hindari meminta anak membaca nyaring mendadak di depan kelas tanpa persiapan.'
      );
      untukOrangTua.push(
        'Gunakan penggaris baca (reading guide) untuk membantu fokus mata per baris dan baca buku cerita bergambar bersama secara bergantian.'
      );
    }

    if (skorMemori !== null && skorMemori < 80) {
      untukGuru.push(
        'Pecah instruksi tugas kelas menjadi langkah-langkah pendek (maksimal 2 tahap) dan tuliskan poin utamanya di sudut papan tulis.'
      );
      untukOrangTua.push(
        'Latih daya ingat urutan melalui permainan sederhana seperti mengulang 3 nama benda atau urutan kegiatan harian secara berurutan.'
      );
    }

    if (untukGuru.length === 0) {
      untukGuru.push(
        'Pertahankan variasi media pembelajaran visual-auditori di kelas dan libatkan siswa dalam aktivitas literasi kolaboratif yang positif.'
      );
    }
    if (untukOrangTua.length === 0) {
      untukOrangTua.push(
        'Lanjutkan rutinitas membaca cerita bersama selama 15 menit sebelum tidur dan berikan apresiasi atas setiap kemajuan membaca anak.'
      );
    }

    return { untukGuru, untukOrangTua };
  };

  const rekomendasi = buatRekomendasiTerpisah();

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
      subtipeDominan: kesimpulanSubtipe,
      catatanPendamping: catatanPendamping.trim(),
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* BARIS TOMBOL AKSI ATAS */}
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

      {/* 1. KARTU HEADER HASIL SKRINING */}
      <div
        className={`bg-gradient-to-r ${kategoriHasil.warnaHeader} text-white rounded-3xl p-6 md:p-8 mb-8 shadow-lg`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-5 mb-5">
          <div>
            <span className="bg-white/20 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
              Laporan Analisis Skrining Dini KataKita
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

        <div className="bg-white text-slate-800 rounded-2xl p-5 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Kesimpulan Tingkat Risiko & Fokus Subtipe:
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-block text-sm md:text-base font-extrabold px-4 py-1.5 rounded-xl border ${kategoriHasil.warnaBadge}`}
            >
              {kategoriHasil.status}
            </span>
          </div>
          <p className="text-xs md:text-sm font-bold text-indigo-950 pt-1">
            🧭 {kesimpulanSubtipe}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {kategoriHasil.ringkasan}
          </p>
        </div>
      </div>

      {/* 2. TIGA METRIK RINGKAS */}
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

      {/* 3. PETA PROFIL 4 SUBTIPE KOGNITIF & LITERASI */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm mb-8">
        <div className="mb-5">
          <span className="bg-indigo-50 text-indigo-800 text-xs font-extrabold px-3 py-1 rounded-full">
            Pemetaan Kognitif & Literasi
          </span>
          <h2 className="text-lg md:text-xl font-extrabold text-indigo-950 mt-2">
            Profil 4 Subtipe Kemampuan Membaca Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Grafik di bawah memetakan kekuatan dan area yang memerlukan dukungan spesifik berdasarkan kombinasi permainan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {profilSubtipe.map((domain) => {
            const belumDiuji = domain.skor === null;
            const statusLabel = belumDiuji
              ? 'Belum Diuji'
              : domain.skor >= 80
              ? 'Baik'
              : domain.skor >= 60
              ? 'Perlu Penguatan'
              : 'Indikasi Hambatan';

            const warnaPill = belumDiuji
              ? 'bg-slate-100 text-slate-500'
              : domain.skor >= 80
              ? 'bg-emerald-100 text-emerald-800'
              : domain.skor >= 60
              ? 'bg-amber-100 text-amber-900'
              : 'bg-rose-100 text-rose-800';

            const warnaBar = belumDiuji
              ? 'bg-slate-200'
              : domain.skor >= 80
              ? 'bg-emerald-500'
              : domain.skor >= 60
              ? 'bg-amber-500'
              : 'bg-rose-500';

            return (
              <div
                key={domain.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-indigo-950">
                      {domain.ikon} {domain.nama}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Instrumen: {domain.sumberGame}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full shrink-0 ${warnaPill}`}
                  >
                    {belumDiuji ? statusLabel : `${statusLabel} (${domain.skor}%)`}
                  </span>
                </div>

                {/* Bar Visual Skor */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${warnaBar} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${belumDiuji ? 0 : domain.skor}%` }}
                  />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {domain.deskripsi}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. ANALISIS POLA KESALAHAN KONKRET */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm mb-8">
        <h2 className="text-lg font-extrabold text-indigo-950 mb-1">
          🔎 Analisis Pola Kesalahan Spesifik
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Menampilkan contoh huruf, bunyi, atau susunan kata yang tertukar selama sesi permainan berlangsung.
        </p>

        {jumlahDimainkan === 0 ? (
          <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-2xl">
            Belum ada data permainan yang dapat dianalisis.
          </p>
        ) : daftarKesalahanKonkret.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs font-semibold text-emerald-900">
            🎉 Tidak ditemukan kesalahan huruf atau kata pada permainan yang telah diselesaikan!
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {daftarKesalahanKonkret.slice(0, 6).map((err, idx) => (
              <div
                key={idx}
                className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 text-xs space-y-1"
              >
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-amber-900">{err.namaGame}</span>
                  <span className="text-[10px] text-slate-500">{err.waktu}d</span>
                </div>
                <p className="text-slate-700">
                  Target: <strong className="text-teal-700">&ldquo;{err.target}&rdquo;</strong>{' '}
                  → Dijawab:{' '}
                  <strong className="text-rose-700">&ldquo;{err.jawaban}&rdquo;</strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. TABEL RINCIAN PERFORMA 6 AKTIVITAS */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm mb-8">
        <h2 className="text-lg font-extrabold text-indigo-950 mb-4">
          Rincian Skor Per Aktivitas Skrining
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

      {/* 6. REKOMENDASI INTERVENSI TERPISAH (GURU VS ORANG TUA) */}
      <div className="bg-sky-50/80 rounded-3xl p-6 md:p-8 border border-sky-100 mb-8">
        <h2 className="text-lg font-extrabold text-indigo-950 mb-4">
          💡 Rencana Tindak Lanjut Multisensori (VAKT)
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {onBukaLatihan && (
       <div className="mt-5 pt-4 border-t border-sky-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
         <p className="text-xs font-semibold text-indigo-950">
           Ingin langsung melatih bentuk huruf cermin (b/d, p/q) bersama anak sekarang?
         </p>
         <button
           type="button"
           onClick={onBukaLatihan}
           className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow transition cursor-pointer shrink-0"
         >
           ✍️ Buka Papan Latihan Menulis (VAKT) →
         </button>
       </div>
     )}
          <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm">
            <h3 className="font-extrabold text-teal-700 text-sm mb-3 flex items-center gap-2">
              <span>👩🏻‍🏫</span> Strategi untuk Guru di Sekolah
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed list-disc pl-4">
              {rekomendasi.untukGuru.map((teks, idx) => (
                <li key={idx}>{teks}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm">
            <h3 className="font-extrabold text-amber-700 text-sm mb-3 flex items-center gap-2">
              <span>👨🏻‍👩🏻‍👧🏻</span> Pendampingan Orang Tua di Rumah
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed list-disc pl-4">
              {rekomendasi.untukOrangTua.map((teks, idx) => (
                <li key={idx}>{teks}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 7. CATATAN OBSERVASI PENDAMPING */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
        <label className="block text-sm font-extrabold text-indigo-950 mb-1">
          📝 Catatan Tambahan Guru / Orang Tua (Opsional)
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Tuliskan pengamatan perilaku anak saat tes (misalnya: fokus, rasa percaya diri, atau kelelahan mata) sebelum mencetak PDF atau menyimpan ke Monitoring.
        </p>
        <textarea
          rows={3}
          value={catatanPendamping}
          onChange={(e) => setCatatanPendamping(e.target.value)}
          placeholder="Contoh: Anak sangat antusias saat permainan suara, namun tampak ragu dan memiringkan kepala saat membedakan huruf b dan d..."
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
        />
      </div>

      {/* DISCLAIMER ETIKA ASESMEN */}
      <p className="text-xs text-slate-500 text-center bg-white p-4 rounded-2xl border border-slate-200">
        <strong>Catatan Penting:</strong> Instrumen KataKita berfungsi sebagai media skrining deteksi dini untuk membantu perencanaan intervensi pembelajaran, bukan sebagai alat diagnosis klinis final.
      </p>
    </div>
  );
}