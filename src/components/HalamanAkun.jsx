import { useState } from 'react';

export default function HalamanAkun({
  akunAktif,
  onLogin,
  onLogout,
  onMulaiSkrining,
  onBukaMonitoring,
}) {
  const [peran, setPeran] = useState('guru');
  const [nama, setNama] = useState('');
  const [asalSekolah, setAsalSekolah] = useState('');
  const [kontak, setKontak] = useState('');

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    if (!nama.trim() || !asalSekolah.trim()) return;

    onLogin({
      peran,
      nama: nama.trim(),
      asalSekolah: asalSekolah.trim(),
      kontak: kontak.trim(),
      waktuLogin: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    });
  };

  // TAMPILAN JIKA SUDAH LOGIN
  if (akunAktif) {
    const adalahGuru = akunAktif.peran === 'guru';

    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-indigo-950 p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl">
                {adalahGuru ? '👩🏻‍🏫' : '👨🏻‍👩🏻‍👧🏻'}
              </div>
              <div>
                <span className="bg-amber-400 text-indigo-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
                  Akun {adalahGuru ? 'Guru' : 'Orang Tua'} Aktif
                </span>
                <h1 className="text-2xl font-extrabold mt-2">{akunAktif.nama}</h1>
                <p className="text-sm text-sky-100">{akunAktif.asalSekolah}</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="bg-sky-50/70 rounded-2xl p-5 border border-sky-100 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Peran Akses</span>
                <span className="font-bold text-indigo-950">
                  {adalahGuru
                    ? 'Guru (Instrumen 15 Indikator)'
                    : 'Orang Tua (Instrumen 21 Indikator)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Asal Sekolah</span>
                <span className="font-bold text-indigo-950">{akunAktif.asalSekolah}</span>
              </div>
              {akunAktif.kontak && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Email / No. HP</span>
                  <span className="font-bold text-indigo-950">{akunAktif.kontak}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Sesi Masuk</span>
                <span className="font-semibold text-slate-700">{akunAktif.waktuLogin}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onMulaiSkrining}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 px-5 rounded-xl shadow transition cursor-pointer"
              >
                🚀 Mulai Skrining Baru
              </button>
              <button
                type="button"
                onClick={onBukaMonitoring}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-5 rounded-xl shadow transition cursor-pointer"
              >
                📊 Buka Dasbor Monitoring
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <p className="text-xs text-slate-400">
                Data akun otomatis mengisi formulir observasi siswa.
              </p>
              <button
                type="button"
                onClick={onLogout}
                className="text-sm font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                Keluar (Logout)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TAMPILAN FORMULIR PILIH PERAN & LOGIN
  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-8">
        <div className="text-center mb-6">
          <span className="bg-teal-100 text-teal-800 text-xs font-extrabold px-3 py-1 rounded-full">
            Akses Pendamping KataKita
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-950 mt-2">
            Masuk ke Akun Anda
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pilih peran pendamping untuk menyesuaikan instrumen skrining dan laporan siswa.
          </p>
        </div>

        <form onSubmit={handleSubmitLogin} className="space-y-5">
          {/* Pilihan Peran: Guru atau Orang Tua */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Saya masuk sebagai:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPeran('guru')}
                className={`p-4 rounded-2xl border-2 text-center transition cursor-pointer ${
                  peran === 'guru'
                    ? 'bg-teal-50 border-teal-600 text-teal-950 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300'
                }`}
              >
                <div className="text-3xl mb-1">👩🏻‍🏫</div>
                <div className="font-extrabold text-sm">Guru</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Checklist 15 Butir
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPeran('orangTua')}
                className={`p-4 rounded-2xl border-2 text-center transition cursor-pointer ${
                  peran === 'orangTua'
                    ? 'bg-teal-50 border-teal-600 text-teal-950 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300'
                }`}
              >
                <div className="text-3xl mb-1">👨🏻‍👩🏻‍👧🏻</div>
                <div className="font-extrabold text-sm">Orang Tua</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Checklist 21 Butir
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Nama Lengkap {peran === 'guru' ? 'Guru' : 'Orang Tua / Wali'}
            </label>
            <input
              type="text"
              required
              placeholder={
                peran === 'guru'
                  ? 'Contoh: Ibu Siti Aminah, S.Pd.'
                  : 'Contoh: Bapak Hendra Wijaya'
              }
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              {peran === 'guru' ? 'Sekolah Tempat Mengajar' : 'Asal Sekolah Anak'}
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: SDN 004 Terantang Manuk"
              value={asalSekolah}
              onChange={(e) => setAsalSekolah(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Email atau Nomor WhatsApp <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: guru@sekolah.sch.id / 0812..."
              value={kontak}
              onChange={(e) => setKontak(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-3.5 rounded-xl shadow-md transition cursor-pointer"
          >
            Masuk sebagai {peran === 'guru' ? 'Guru' : 'Orang Tua'} →
          </button>
        </form>
      </div>
    </div>
  );
}