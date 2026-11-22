import { useState, useMemo } from 'react';

const daftarNamaGame = [
  { id: 'mencari-huruf', nama: 'Mencari Huruf', ikon: '🔍' },
  { id: 'dengar-pilih', nama: 'Dengar & Pilih', ikon: '👂' },
  { id: 'urutkan-kata', nama: 'Urutkan Kata', ikon: '🔤' },
  { id: 'baca-cepat', nama: 'Baca Cepat', ikon: '⭐' },
  { id: 'pasangan-kata', nama: 'Pasangan Kata', ikon: '🧩' },
  { id: 'ingat-ulangi', nama: 'Ingat & Ulangi', ikon: '🧠' },
];

export default function HalamanMonitoring({
  riwayat,
  onMulaiBaru,
  onHapusSemua,
}) {
  const [kataKunci, setKataKunci] = useState('');
  const [filterKelas, setFilterKelas] = useState('semua');
  const [filterRisiko, setFilterRisiko] = useState('semua');
  const [detailDipilih, setDetailDipilih] = useState(null);

  const totalSiswa = riwayat.length;
  const risikoRendah = riwayat.filter((r) => r.analisis?.levelAkhir === 0).length;
  const risikoSedang = riwayat.filter((r) => r.analisis?.levelAkhir === 1).length;
  const risikoTinggi = riwayat.filter((r) => r.analisis?.levelAkhir === 2).length;

  // Pemetaan riwayat longitudinal per nama siswa (diurutkan dari tes terlama ke terbaru)
  const petaProgresSiswa = useMemo(() => {
    const kelompok = {};

    [...riwayat]
      .sort((a, b) => a.id - b.id)
      .forEach((item) => {
        const kunciNama = (item.identitas?.namaSiswa || '').trim().toLowerCase();
        if (!kunciNama) return;
        if (!kelompok[kunciNama]) {
          kelompok[kunciNama] = [];
        }
        kelompok[kunciNama].push(item);
      });

    const hasilPerId = {};
    Object.values(kelompok).forEach((daftarTes) => {
      daftarTes.forEach((tes, indeks) => {
        const tesSebelumnya = indeks > 0 ? daftarTes[indeks - 1] : null;
        const selisihAkurasi = tesSebelumnya
          ? (tes.analisis?.rataRataAkurasi ?? 0) -
            (tesSebelumnya.analisis?.rataRataAkurasi ?? 0)
          : null;

        hasilPerId[tes.id] = {
          tesKe: indeks + 1,
          totalTesSiswa: daftarTes.length,
          selisihAkurasi,
          semuaSesiSiswa: daftarTes,
        };
      });
    });

    return hasilPerId;
  }, [riwayat]);

  // Penyaringan data berdasarkan pencarian nama/sekolah, kelas, dan tingkat risiko
  const riwayatTersaring = useMemo(() => {
    return riwayat.filter((item) => {
      const teksCari = kataKunci.trim().toLowerCase();
      const cocokTeks =
        teksCari === '' ||
        (item.identitas?.namaSiswa || '').toLowerCase().includes(teksCari) ||
        (item.identitas?.asalSekolah || '').toLowerCase().includes(teksCari);

      const cocokKelas =
        filterKelas === 'semua' || item.identitas?.kelas === filterKelas;

      const cocokRisiko =
        filterRisiko === 'semua' ||
        String(item.analisis?.levelAkhir) === filterRisiko;

      return cocokTeks && cocokKelas && cocokRisiko;
    });
  }, [riwayat, kataKunci, filterKelas, filterRisiko]);

  // Fungsi Ekspor Data ke File CSV (Kompatibel dengan Microsoft Excel & Google Sheets)
  const handleUnduhCSV = () => {
    if (riwayatTersaring.length === 0) {
      alert('Tidak ada data yang dapat diunduh.');
      return;
    }

    const header = [
      'No',
      'Tanggal Pemeriksaan',
      'Nama Siswa',
      'Kelas',
      'Asal Sekolah',
      'Nama Pendamping',
      'Peran',
      'Skor Checklist (Ya)',
      'Total Butir Checklist',
      'Interpretasi Checklist',
      'Jumlah Game Selesai',
      'Rata-Rata Akurasi (%)',
      'Kecepatan Rata-Rata (detik)',
      'Status Tingkat Risiko',
      'Fokus Subtipe',
      'Catatan Pendamping',
    ];

    const escapeCSV = (nilai) => {
      const teks = String(nilai ?? '').replace(/"/g, '""');
      return `"${teks}"`;
    };

    const barisData = riwayatTersaring.map((item, idx) => [
      idx + 1,
      item.identitas?.tanggal || '-',
      item.identitas?.namaSiswa || '-',
      item.identitas?.kelas || '-',
      item.identitas?.asalSekolah || '-',
      item.identitas?.namaPengisi || '-',
      item.identitas?.peran === 'guru' ? 'Guru' : 'Orang Tua',
      item.observasi?.jumlahTandaYa ?? 0,
      item.observasi?.totalPertanyaan ?? 0,
      item.observasi?.interpretasi || '-',
      item.analisis?.jumlahGameDimainkan ?? 0,
      item.analisis?.rataRataAkurasi ?? 0,
      item.analisis?.rataRataWaktu ?? 0,
      item.analisis?.statusHasil || '-',
      item.analisis?.subtipeDominan || '-',
      item.analisis?.catatanPendamping || '-',
    ]);

    const isiCSV =
      '\uFEFF' +
      [header, ...barisData]
        .map((baris) => baris.map(escapeCSV).join(','))
        .join('\n');

    const blob = new Blob([isiCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const tautan = document.createElement('a');
    const tanggalFile = new Date().toISOString().split('T')[0];

    tautan.href = url;
    tautan.setAttribute('download', `Rekap_Skrining_KataKita_${tanggalFile}.csv`);
    document.body.appendChild(tautan);
    tautan.click();
    document.body.removeChild(tautan);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* HEADER DASBOR MONITORING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full">
            Dasbor Guru & Orang Tua
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-950 mt-2">
            Monitoring Perkembangan Literasi Siswa
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Pantau hasil skrining kelas, bandingkan perkembangan tes ulang, dan unduh rekap laporan.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {totalSiswa > 0 && (
            <>
              <button
                type="button"
                onClick={handleUnduhCSV}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs md:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <span>📥</span> Unduh Rekap Excel (.CSV)
              </button>

              <button
                type="button"
                onClick={onHapusSemua}
                className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Hapus Semua
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onMulaiBaru}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl shadow transition cursor-pointer"
          >
            + Skrining Baru
          </button>
        </div>
      </div>

      {/* RINGKASAN STATISTIK */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400">Total Sesi Skrining</p>
          <p className="text-3xl font-extrabold text-indigo-950 mt-1">{totalSiswa}</p>
        </div>
        <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-100">
          <p className="text-xs font-bold text-emerald-700">Risiko Rendah</p>
          <p className="text-3xl font-extrabold text-emerald-900 mt-1">{risikoRendah}</p>
        </div>
        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-100">
          <p className="text-xs font-bold text-amber-700">Perlu Observasi</p>
          <p className="text-3xl font-extrabold text-amber-900 mt-1">{risikoSedang}</p>
        </div>
        <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-100">
          <p className="text-xs font-bold text-rose-700">Asesmen Formal</p>
          <p className="text-3xl font-extrabold text-rose-900 mt-1">{risikoTinggi}</p>
        </div>
      </div>

      {/* BILAH PENCARIAN & FILTER KELAS / RISIKO */}
      {totalSiswa > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6">
            <input
              type="text"
              value={kataKunci}
              onChange={(e) => setKataKunci(e.target.value)}
              placeholder="🔍 Cari nama siswa atau asal sekolah..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-semibold text-slate-700 focus:outline-none focus:border-teal-500"
            >
              <option value="semua">Semua Kelas (3–6 SD)</option>
              <option value="3 SD">Kelas 3 SD</option>
              <option value="4 SD">Kelas 4 SD</option>
              <option value="5 SD">Kelas 5 SD</option>
              <option value="6 SD">Kelas 6 SD</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={filterRisiko}
              onChange={(e) => setFilterRisiko(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-semibold text-slate-700 focus:outline-none focus:border-teal-500"
            >
              <option value="semua">Semua Tingkat Risiko</option>
              <option value="0">Risiko Rendah</option>
              <option value="1">Perlu Observasi (Sedang)</option>
              <option value="2">Asesmen Formal (Tinggi)</option>
            </select>
          </div>
        </div>
      )}

      {/* DAFTAR RIWAYAT SKRINING */}
      {totalSiswa === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="text-5xl mb-3">📊</div>
          <h2 className="text-lg font-extrabold text-indigo-950 mb-1">
            Belum Ada Data Skrining Tersimpan
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Selesaikan formulir observasi dan permainan anak, lalu klik tombol &ldquo;Simpan ke Monitoring&rdquo; pada halaman laporan.
          </p>
          <button
            type="button"
            onClick={onMulaiBaru}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer"
          >
            Mulai Skrining Pertama
          </button>
        </div>
      ) : riwayatTersaring.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-600 mb-3">
            Tidak ditemukan data siswa yang cocok dengan filter pencarian Anda.
          </p>
          <button
            type="button"
            onClick={() => {
              setKataKunci('');
              setFilterKelas('semua');
              setFilterRisiko('semua');
            }}
            className="text-xs font-extrabold text-teal-700 hover:underline cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {riwayatTersaring.map((item) => {
            const warnaStatus =
              item.analisis?.levelAkhir === 2
                ? 'bg-rose-100 text-rose-800'
                : item.analisis?.levelAkhir === 1
                ? 'bg-amber-100 text-amber-900'
                : 'bg-emerald-100 text-emerald-800';

            const infoProgres = petaProgresSiswa[item.id];

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:border-teal-200 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* KIRI: IDENTITAS & STATUS RISIKO */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-extrabold text-indigo-950">
                      {item.identitas?.namaSiswa}
                    </h3>
                    <span className="text-xs font-bold bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-md">
                      {item.identitas?.kelas}
                    </span>

                    {infoProgres && infoProgres.totalTesSiswa > 1 && (
                      <span className="text-[11px] font-extrabold bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded-full">
                        Tes ke-{infoProgres.tesKe} dari {infoProgres.totalTesSiswa}
                      </span>
                    )}

                    <span className="text-xs text-slate-400">
                      • {item.identitas?.asalSekolah} ({item.identitas?.tanggal})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full ${warnaStatus}`}
                    >
                      {item.analisis?.statusHasil}
                    </span>

                    {/* Lencana Perbandingan Progres Longitudinal */}
                    {infoProgres && infoProgres.selisihAkurasi !== null && (
                      <span
                        className={`inline-block text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                          infoProgres.selisihAkurasi > 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : infoProgres.selisihAkurasi < 0
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {infoProgres.selisihAkurasi > 0
                          ? `📈 Akurasi naik +${infoProgres.selisihAkurasi}%`
                          : infoProgres.selisihAkurasi < 0
                          ? `📉 Akurasi turun ${infoProgres.selisihAkurasi}%`
                          : '➡️ Akurasi stabil dari tes sebelumnya'}
                      </span>
                    )}
                  </div>

                  {item.analisis?.subtipeDominan && (
                    <p className="text-xs text-slate-600">
                      🧭 {item.analisis.subtipeDominan}
                    </p>
                  )}
                </div>

                {/* KANAN: GRAFIK BAR & TOMBOL DETAIL */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="w-full sm:w-64 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>
                        Akurasi Game ({item.analisis?.jumlahGameDimainkan ?? 0}/6)
                      </span>
                      <span>{item.analisis?.rataRataAkurasi ?? 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-500 h-full rounded-full"
                        style={{ width: `${item.analisis?.rataRataAkurasi ?? 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>
                        Checklist: {item.observasi?.jumlahTandaYa}/
                        {item.observasi?.totalPertanyaan} tanda
                      </span>
                      <span>Kecepatan: {item.analisis?.rataRataWaktu}d/soal</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDetailDipilih(item)}
                    className="bg-sky-50 hover:bg-sky-100 text-indigo-950 border border-sky-200 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0"
                  >
                    🔍 Rincian Laporan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL RINCIAN LAPORAN SISWA */}
      {detailDipilih && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 my-8 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="bg-teal-100 text-teal-800 text-[11px] font-extrabold px-3 py-1 rounded-full">
                  Arsip Hasil Skrining KataKita
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-indigo-950 mt-2">
                  {detailDipilih.identitas?.namaSiswa} ({detailDipilih.identitas?.kelas})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {detailDipilih.identitas?.asalSekolah} • Tanggal:{' '}
                  {detailDipilih.identitas?.tanggal} • Pendamping:{' '}
                  {detailDipilih.identitas?.namaPengisi}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailDipilih(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Ringkasan Status & Subtipe */}
            <div className="bg-sky-50/70 rounded-2xl p-4 border border-sky-100 space-y-1.5">
              <p className="text-sm font-extrabold text-indigo-950">
                {detailDipilih.analisis?.statusHasil}
              </p>
              {detailDipilih.analisis?.subtipeDominan && (
                <p className="text-xs font-semibold text-teal-800">
                  🧭 {detailDipilih.analisis.subtipeDominan}
                </p>
              )}
              <p className="text-xs text-slate-600">
                Skor Checklist Observasi: <strong>{detailDipilih.observasi?.jumlahTandaYa}</strong>{' '}
                dari {detailDipilih.observasi?.totalPertanyaan} tanda (
                {detailDipilih.observasi?.interpretasi})
              </p>
            </div>

            {/* Rincian Skor per Mini-Game */}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                Performa per Aktivitas Permainan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {daftarNamaGame.map((g) => {
                  const skor = detailDipilih.hasilGame?.[g.id];
                  return (
                    <div
                      key={g.id}
                      className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-indigo-950">
                        {g.ikon} {g.nama}
                      </span>
                      {skor ? (
                        <span className="font-extrabold text-teal-700">
                          {skor.akurasi}% ({skor.rataRataWaktu}d)
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Tidak dimainkan</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grafik Riwayat Longitudinal Jika Siswa Dites Lebih dari 1 Kali */}
            {petaProgresSiswa[detailDipilih.id]?.totalTesSiswa > 1 && (
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                  Grafik Perkembangan Antar Sesi Tes
                </h3>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
                  {petaProgresSiswa[detailDipilih.id].semuaSesiSiswa.map((sesi, idx) => (
                    <div key={sesi.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>
                          Tes ke-{idx + 1} ({sesi.identitas?.tanggal})
                        </span>
                        <span>
                          Akurasi: {sesi.analisis?.rataRataAkurasi ?? 0}% • Checklist:{' '}
                          {sesi.observasi?.jumlahTandaYa} tanda
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-950 h-full rounded-full"
                          style={{ width: `${sesi.analisis?.rataRataAkurasi ?? 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Catatan Pendamping */}
            {detailDipilih.analisis?.catatanPendamping && (
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs">
                <p className="font-extrabold text-amber-950 mb-1">
                  📝 Catatan Guru / Orang Tua:
                </p>
                <p className="text-slate-700 leading-relaxed">
                  {detailDipilih.analisis.catatanPendamping}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
              >
                🖨️ Cetak Arsip
              </button>
              <button
                type="button"
                onClick={() => setDetailDipilih(null)}
                className="bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}