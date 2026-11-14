export default function HalamanMonitoring({
  riwayat,
  onMulaiBaru,
  onHapusSemua,
}) {
  const totalSiswa = riwayat.length;
  const risikoRendah = riwayat.filter((r) => r.analisis.levelAkhir === 0).length;
  const risikoSedang = riwayat.filter((r) => r.analisis.levelAkhir === 1).length;
  const risikoTinggi = riwayat.filter((r) => r.analisis.levelAkhir === 2).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full">
            Dasbor Guru & Orang Tua
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-950 mt-2">
            Monitoring Perkembangan Literasi Siswa
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Rekap riwayat skrining dini untuk memantau kebutuhan pendampingan individual.
          </p>
        </div>

        <div className="flex gap-3">
          {totalSiswa > 0 && (
            <button
              type="button"
              onClick={onHapusSemua}
              className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              Hapus Riwayat
            </button>
          )}
          <button
            type="button"
            onClick={onMulaiBaru}
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow transition cursor-pointer"
          >
            + Skrining Siswa Baru
          </button>
        </div>
      </div>

      {/* RINGKASAN STATISTIK */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400">Total Diskrining</p>
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

      {/* DAFTAR RIWAYAT & GRAFIK BATANG SEDERHANA */}
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
      ) : (
        <div className="space-y-4">
          {riwayat.map((item) => {
            const warnaStatus =
              item.analisis.levelAkhir === 2
                ? 'bg-rose-100 text-rose-800'
                : item.analisis.levelAkhir === 1
                ? 'bg-amber-100 text-amber-900'
                : 'bg-emerald-100 text-emerald-800';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-extrabold text-indigo-950">
                      {item.identitas.namaSiswa}
                    </h3>
                    <span className="text-xs font-bold bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-md">
                      {item.identitas.kelas}
                    </span>
                    <span className="text-xs text-slate-400">
                      • {item.identitas.asalSekolah} ({item.identitas.tanggal})
                    </span>
                  </div>
                  <span
                    className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full ${warnaStatus}`}
                  >
                    {item.analisis.statusHasil}
                  </span>
                </div>

                {/* Visualisasi Bar Akurasi Game */}
                <div className="w-full lg:w-80 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Akurasi Game ({item.analisis.jumlahGameDimainkan}/6)</span>
                    <span>{item.analisis.rataRataAkurasi}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-500 h-full rounded-full"
                      style={{ width: `${item.analisis.rataRataAkurasi}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>
                      Checklist: {item.observasi.jumlahTandaYa}/
                      {item.observasi.totalPertanyaan} tanda
                    </span>
                    <span>Kecepatan: {item.analisis.rataRataWaktu}d/soal</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}