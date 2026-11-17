import { useState } from 'react';

const pertanyaanGuru = [
  { kategori: 'Membaca & Menulis', teks: 'Kesulitan mengenali huruf dan kata meskipun sudah diajarkan berulang kali' },
  { kategori: 'Membaca & Menulis', teks: 'Sering tertukar antara huruf yang mirip (b/d, p/q, m/n)' },
  { kategori: 'Membaca & Menulis', teks: 'Kesulitan menghubungkan huruf dengan bunyinya (kesulitan membaca fonem)' },
  { kategori: 'Membaca & Menulis', teks: 'Sering menghilangkan, menambah, atau mengganti huruf saat membaca atau menulis' },
  { kategori: 'Membaca & Menulis', teks: 'Kesulitan memahami isi bacaan walaupun bisa membaca kata-kata secara terpisah' },
  { kategori: 'Kognitif & Linguistik', teks: 'Sulit mengingat urutan alfabet atau angka' },
  { kategori: 'Kognitif & Linguistik', teks: 'Lambat dalam belajar nama hari, bulan, atau konsep waktu' },
  { kategori: 'Kognitif & Linguistik', teks: 'Sering kesulitan dalam mengingat instruksi secara berurutan' },
  { kategori: 'Kognitif & Linguistik', teks: 'Kesulitan dalam menyalin teks dari papan tulis atau buku' },
  { kategori: 'Kognitif & Linguistik', teks: 'Kesulitan mengucapkan kata-kata panjang atau baru' },
  { kategori: 'Perilaku & Keseharian', teks: 'Menghindari aktivitas yang melibatkan membaca atau menulis' },
  { kategori: 'Perilaku & Keseharian', teks: 'Sering mengalami kebingungan arah (kiri-kanan, atas-bawah)' },
  { kategori: 'Perilaku & Keseharian', teks: 'Sering lupa nama benda atau orang meskipun sudah dikenalkan berkali-kali' },
  { kategori: 'Perilaku & Keseharian', teks: 'Sering frustrasi atau kehilangan motivasi saat belajar membaca' },
  { kategori: 'Perilaku & Keseharian', teks: 'Mempunyai riwayat kesulitan berbicara atau terlambat berbicara saat kecil' },
];

const pertanyaanOrangTua = [
  { kategori: 'Membaca & Menulis', teks: 'Anak saya kesulitan mengenali huruf dan kata meskipun sudah diajarkan berulang kali' },
  { kategori: 'Membaca & Menulis', teks: 'Anak saya sering tertukar antara huruf yang mirip (b/d, p/q, m/n)' },
  { kategori: 'Membaca & Menulis', teks: 'Anak saya kesulitan menghubungkan huruf dengan bunyinya (kesulitan membaca fonem)' },
  { kategori: 'Membaca & Menulis', teks: 'Anak saya sering menghilangkan, menambah, atau mengganti huruf saat membaca atau menulis' },
  { kategori: 'Membaca & Menulis', teks: 'Anak saya kesulitan memahami isi bacaan walaupun bisa membaca kata-kata secara terpisah' },
  { kategori: 'Membaca & Menulis', teks: 'Anak saya sering membaca baris tulisan tidak secara berurutan (melompati baris)' },
  { kategori: 'Kognitif & Linguistik', teks: 'Anak saya sulit mengingat urutan alfabet atau angka' },
  { kategori: 'Kognitif & Linguistik', teks: 'Anak saya lambat dalam belajar nama hari, bulan, atau konsep waktu' },
  { kategori: 'Kognitif & Linguistik', teks: 'Anak saya sering kesulitan dalam mengingat instruksi secara berurutan' },
  { kategori: 'Kognitif & Linguistik', teks: 'Anak saya kesulitan dalam menyalin teks dari papan tulis atau buku' },
  { kategori: 'Kognitif & Linguistik', teks: 'Anak saya kesulitan mengucapkan kata-kata panjang atau baru' },
  { kategori: 'Perilaku & Keseharian', teks: 'Anak saya menghindari aktivitas yang melibatkan membaca atau menulis' },
  { kategori: 'Perilaku & Keseharian', teks: 'Anak saya sering mengalami kebingungan arah (kiri-kanan, atas-bawah)' },
  { kategori: 'Perilaku & Keseharian', teks: 'Anak saya sering lupa nama benda atau orang meskipun sudah dikenalkan berkali-kali' },
  { kategori: 'Perilaku & Keseharian', teks: 'Anak saya sering frustrasi atau kehilangan motivasi saat belajar membaca' },
  { kategori: 'Perilaku & Keseharian', teks: 'Anak saya mempunyai riwayat kesulitan berbicara atau terlambat berbicara saat kecil' },
  { kategori: 'Perilaku & Keseharian', teks: 'Anak saya sering terjatuh saat berjalan kaki meski tidak tersandung' },
  { kategori: 'Kemungkinan Penyebab', teks: 'Anak saya lahir prematur' },
  { kategori: 'Kemungkinan Penyebab', teks: 'Menurut keterangan dokter, anak mengalami gangguan pendengaran saat lahir hingga usia 2 tahun' },
  { kategori: 'Kemungkinan Penyebab', teks: 'Orang tua (ayah) juga mengalami keterlambatan membaca ketika masih di SD' },
  { kategori: 'Kemungkinan Penyebab', teks: 'Anak saya pernah mengalami benturan di kepala yang cukup keras saat bayi' },
];

export default function FormObservasi({ akunAktif, onKembali, onSelesai }) {
  const hariIni = new Date().toISOString().split('T')[0];

  const [identitas, setIdentitas] = useState({
    tanggal: hariIni,
    namaSiswa: '',
    kelas: '3 SD',
    asalSekolah: akunAktif?.asalSekolah || '',
    peran: akunAktif?.peran || 'guru',
    namaPengisi: akunAktif?.nama || '',
  });

  const [jawaban, setJawaban] = useState({});

  const daftarPertanyaan = identitas.peran === 'guru' ? pertanyaanGuru : pertanyaanOrangTua;

  const handleUbahPeran = (peranBaru) => {
    setIdentitas({ ...identitas, peran: peranBaru });
    setJawaban({});
  };

  const handlePilihJawaban = (index, nilai) => {
    setJawaban({ ...jawaban, [index]: nilai });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.keys(jawaban).length < daftarPertanyaan.length) {
      alert(`Mohon lengkapi seluruh pertanyaan checklist (${Object.keys(jawaban).length}/${daftarPertanyaan.length} terjawab).`);
      return;
    }

    const jumlahTandaYa = Object.values(jawaban).filter((val) => val === 'ya').length;

    let interpretasi = 'Kemungkinan kecil memiliki disleksia';
    if (jumlahTandaYa >= 10) {
      interpretasi = 'Disarankan untuk menjalani asesmen formal';
    } else if (jumlahTandaYa >= 6) {
      interpretasi = 'Perlu observasi lebih lanjut';
    }

    onSelesai({
      identitas,
      jawaban,
      jumlahTandaYa,
      totalPertanyaan: daftarPertanyaan.length,
      interpretasi,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button
        onClick={onKembali}
        className="mb-6 text-teal-700 font-bold hover:underline flex items-center gap-2 cursor-pointer"
      >
        ← Kembali ke Beranda
      </button>

      <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 md:p-8">
        <div className="border-b border-slate-100 pb-5 mb-6">
          <span className="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full">
            Tahap 1 dari 2 • Observasi Awal
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-950 mt-2">
            Data Identitas & Checklist Skrining
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Diisi oleh guru atau orang tua sebelum siswa memulai permainan interaktif.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Bagian A: Identitas */}
          <div className="bg-sky-50/70 p-5 rounded-2xl border border-sky-100 space-y-4">
            <h2 className="font-bold text-lg text-indigo-950">1. Identitas Siswa & Pendamping</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Peran Pengisi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUbahPeran('guru')}
                    className={`py-2.5 px-4 rounded-xl font-bold text-sm border-2 transition cursor-pointer ${
                      identitas.peran === 'guru'
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    👩🏻‍🏫 Guru (15 Butir)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUbahPeran('orangTua')}
                    className={`py-2.5 px-4 rounded-xl font-bold text-sm border-2 transition cursor-pointer ${
                      identitas.peran === 'orangTua'
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    👨🏻‍👩🏻‍👧🏻 Orang Tua (21 Butir)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tanggal Pemeriksaan</label>
                <input
                  type="date"
                  required
                  value={identitas.tanggal}
                  onChange={(e) => setIdentitas({ ...identitas, tanggal: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={identitas.namaSiswa}
                  onChange={(e) => setIdentitas({ ...identitas, namaSiswa: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kelas</label>
                <select
                  value={identitas.kelas}
                  onChange={(e) => setIdentitas({ ...identitas, kelas: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-500"
                >
                  <option value="3 SD">Kelas 3 SD</option>
                  <option value="4 SD">Kelas 4 SD</option>
                  <option value="5 SD">Kelas 5 SD</option>
                  <option value="6 SD">Kelas 6 SD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Asal Sekolah</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SDN 004 Terantang Manuk"
                  value={identitas.asalSekolah}
                  onChange={(e) => setIdentitas({ ...identitas, asalSekolah: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Nama {identitas.peran === 'guru' ? 'Guru' : 'Orang Tua'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama Anda"
                  value={identitas.namaPengisi}
                  onChange={(e) => setIdentitas({ ...identitas, namaPengisi: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Bagian B: Checklist Pertanyaan */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-indigo-950">
                2. Checklist Observasi ({identitas.peran === 'guru' ? 'Instrumen Guru' : 'Instrumen Orang Tua'})
              </h2>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full">
                Terjawab: {Object.keys(jawaban).length} / {daftarPertanyaan.length}
              </span>
            </div>

            <div className="space-y-3">
              {daftarPertanyaan.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white"
                >
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600">
                      {item.kategori}
                    </span>
                    <p className="text-sm font-medium text-slate-800 mt-0.5">
                      {idx + 1}. {item.teks}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handlePilihJawaban(idx, 'ya')}
                      className={`px-5 py-2 rounded-xl text-sm font-bold border transition cursor-pointer ${
                        jawaban[idx] === 'ya'
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-amber-50'
                      }`}
                    >
                      Ya
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePilihJawaban(idx, 'tidak')}
                      className={`px-5 py-2 rounded-xl text-sm font-bold border transition cursor-pointer ${
                        jawaban[idx] === 'tidak'
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-teal-50'
                      }`}
                    >
                      Tidak
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition cursor-pointer"
            >
              Simpan & Lanjut ke Arena Game Siswa →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}