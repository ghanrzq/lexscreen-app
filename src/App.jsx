import { useState, useEffect } from 'react';
import FormObservasi from './components/FormObservasi';
import GameMencariHuruf from './components/GameMencariHuruf';
import GameDengarPilih from './components/GameDengarPilih';
import GameUrutkanKata from './components/GameUrutkanKata';
import GameBacaCepat from './components/GameBacaCepat';
import GamePasanganKata from './components/GamePasanganKata';
import GameIngatUlangi from './components/GameIngatUlangi';
import LaporanHasil from './components/LaporanHasil';
import HalamanMonitoring from './components/HalamanMonitoring';

function App() {
  const [halamanAktif, setHalamanAktif] = useState('beranda');
  const [dataSesi, setDataSesi] = useState(null);
  const [gameAktif, setGameAktif] = useState(null);
  const [hasilGame, setHasilGame] = useState({});
  const [sudahTersimpan, setSudahTersimpan] = useState(false);

  const [riwayatMonitoring, setRiwayatMonitoring] = useState(() => {
    try {
      const tersimpan = localStorage.getItem('lexscreen_riwayat');
      return tersimpan ? JSON.parse(tersimpan) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lexscreen_riwayat', JSON.stringify(riwayatMonitoring));
    } catch {
      // Abaikan jika storage penuh
    }
  }, [riwayatMonitoring]);

  const daftarGame = [
    {
      id: 'mencari-huruf',
      judul: 'Mencari Huruf',
      deskripsi: 'Temukan huruf yang ditampilkan',
      ikon: '🔍',
      badge: 'b  d  p  q',
      warnaBg: 'bg-purple-50 border-purple-200 hover:border-purple-400',
      warnaJudul: 'text-indigo-950',
      siapDimainkan: true,
    },
    {
      id: 'dengar-pilih',
      judul: 'Dengar & Pilih',
      deskripsi: 'Dengarkan suara, pilih gambar yang sesuai',
      ikon: '👂',
      badge: '🔊 Fonem',
      warnaBg: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
      warnaJudul: 'text-emerald-950',
      siapDimainkan: true,
    },
    {
      id: 'urutkan-kata',
      judul: 'Urutkan Kata',
      deskripsi: 'Susun huruf menjadi kata yang benar',
      ikon: '🔤',
      badge: 'i  A  R',
      warnaBg: 'bg-amber-50 border-amber-200 hover:border-amber-400',
      warnaJudul: 'text-amber-950',
      siapDimainkan: true,
    },
    {
      id: 'baca-cepat',
      judul: 'Baca Cepat',
      deskripsi: 'Baca sebanyak mungkin dalam waktu singkat',
      ikon: '⭐',
      badge: '⏱️ Waktu',
      warnaBg: 'bg-sky-50 border-sky-200 hover:border-sky-400',
      warnaJudul: 'text-sky-950',
      siapDimainkan: true,
    },
    {
      id: 'pasangan-kata',
      judul: 'Pasangan Kata',
      deskripsi: 'Cocokkan kata dengan gambar yang tepat',
      ikon: '🧩',
      badge: 'me | ja',
      warnaBg: 'bg-orange-50 border-orange-200 hover:border-orange-400',
      warnaJudul: 'text-orange-950',
      siapDimainkan: true,
    },
    {
      id: 'ingat-ulangi',
      judul: 'Ingat & Ulangi',
      deskripsi: 'Ingat urutan, lalu ulangi dengan benar',
      ikon: '🧠',
      badge: 'Memori',
      warnaBg: 'bg-pink-50 border-pink-200 hover:border-pink-400',
      warnaJudul: 'text-pink-950',
      siapDimainkan: true,
    },
  ];

  const handleSelesaiObservasi = (hasilObservasi) => {
    setDataSesi(hasilObservasi);
    setHasilGame({});
    setSudahTersimpan(false);
    setHalamanAktif('arena-game');
  };

  const handleBukaGame = (game) => {
    if (game.siapDimainkan) {
      setGameAktif(game.id);
    }
  };

  const handleSelesaiGame = (skorGame) => {
    setHasilGame((prev) => ({
      ...prev,
      [skorGame.idGame]: skorGame,
    }));
    setSudahTersimpan(false);
    setGameAktif(null);
  };

  const handleSimpanKeMonitoring = (analisisRingkas) => {
    if (!dataSesi) return;
    const rekamBaru = {
      id: Date.now(),
      identitas: dataSesi.identitas,
      observasi: {
        jumlahTandaYa: dataSesi.jumlahTandaYa,
        totalPertanyaan: dataSesi.totalPertanyaan,
        interpretasi: dataSesi.interpretasi,
      },
      hasilGame,
      analisis: analisisRingkas,
    };

    setRiwayatMonitoring((prev) => [rekamBaru, ...prev]);
    setSudahTersimpan(true);
    setHalamanAktif('monitoring');
  };

  const handleHapusSemuaRiwayat = () => {
    if (window.confirm('Yakin ingin menghapus seluruh riwayat monitoring siswa?')) {
      setRiwayatMonitoring([]);
    }
  };

  const jumlahGameSelesai = Object.keys(hasilGame).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50 font-sans text-slate-800">
      {/* NAVBAR */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div
          onClick={() => {
            setHalamanAktif('beranda');
            setGameAktif(null);
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-3xl">🧠</span>
          <span className="text-2xl font-extrabold tracking-tight text-teal-600">
            Lex<span className="text-indigo-950">Screen</span>
          </span>
        </div>

        <ul className="hidden md:flex items-center gap-8 font-semibold text-indigo-950">
          {['Beranda', 'Informasi', 'Monitoring', 'Laporan', 'Akun'].map((menu) => (
            <li key={menu}>
              <button
                onClick={() => {
                  setHalamanAktif(menu.toLowerCase());
                  setGameAktif(null);
                }}
                className={`pb-1 transition cursor-pointer ${
                  halamanAktif === menu.toLowerCase()
                    ? 'text-teal-600 border-b-2 border-teal-500'
                    : 'hover:text-teal-600'
                }`}
              >
                {menu}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* KONDISI 1: HALAMAN FORM OBSERVASI */}
      {halamanAktif === 'observasi' && (
        <FormObservasi
          onKembali={() => setHalamanAktif('beranda')}
          onSelesai={handleSelesaiObservasi}
        />
      )}

      {/* KONDISI 2: HALAMAN ARENA GAME ATAU LAYAR GAME AKTIF */}
      {halamanAktif === 'arena-game' && dataSesi && (
        <>
          {gameAktif === 'mencari-huruf' ? (
            <GameMencariHuruf
              onSelesai={handleSelesaiGame}
              onBatal={() => setGameAktif(null)}
            />
          ) : gameAktif === 'dengar-pilih' ? (
            <GameDengarPilih
              onSelesai={handleSelesaiGame}
              onBatal={() => setGameAktif(null)}
            />
          ) : gameAktif === 'urutkan-kata' ? (
            <GameUrutkanKata
              onSelesai={handleSelesaiGame}
              onBatal={() => setGameAktif(null)}
            />
          ) : gameAktif === 'baca-cepat' ? (
            <GameBacaCepat
              onSelesai={handleSelesaiGame}
              onBatal={() => setGameAktif(null)}
            />
          ) : gameAktif === 'pasangan-kata' ? (
            <GamePasanganKata
              onSelesai={handleSelesaiGame}
              onBatal={() => setGameAktif(null)}
            />
          ) : gameAktif === 'ingat-ulangi' ? (
            <GameIngatUlangi
              onSelesai={handleSelesaiGame}
              onBatal={() => setGameAktif(null)}
            />
          ) : (
            <main className="max-w-6xl mx-auto px-6 py-8">
              <div className="bg-indigo-950 text-white rounded-3xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
                <div>
                  <span className="bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full">
                    Tahap 2 dari 2 • Skrining Gamifikasi Anak ({jumlahGameSelesai}/6 Selesai)
                  </span>
                  <h1 className="text-2xl md:text-3xl font-extrabold mt-2">
                    Halo, {dataSesi.identitas.namaSiswa}! ({dataSesi.identitas.kelas})
                  </h1>
                  <p className="text-sm text-sky-200 mt-1">
                    Skor Checklist Awal: <strong>{dataSesi.jumlahTandaYa}</strong> dari{' '}
                    {dataSesi.totalPertanyaan} tanda ({dataSesi.interpretasi})
                  </p>
                </div>
                <button
                  onClick={() => setHalamanAktif('observasi')}
                  className="bg-white/15 hover:bg-white/25 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Ubah Data Observasi
                </button>
              </div>

              <section className="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h2 className="text-lg font-extrabold text-indigo-950">
                    Pilih Permainan untuk Memulai Tes:
                  </h2>

                  {jumlahGameSelesai > 0 && (
                    <button
                      onClick={() => setHalamanAktif('laporan')}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow transition cursor-pointer"
                    >
                      📊 Lihat Laporan Hasil Skrining ({jumlahGameSelesai}/6) →
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                  {daftarGame.map((game) => {
                    const sudahSelesai = hasilGame[game.id];

                    return (
                      <div
                        key={game.id}
                        onClick={() => handleBukaGame(game)}
                        className={`${game.warnaBg} border-2 rounded-2xl p-4 flex flex-col items-center text-center transition transform hover:-translate-y-1 cursor-pointer relative`}
                      >
                        {sudahSelesai && (
                          <span className="absolute -top-2.5 right-2 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow">
                            ✅ {sudahSelesai.akurasi}% ({sudahSelesai.rataRataWaktu}d)
                          </span>
                        )}

                        <h3 className={`font-extrabold text-base mb-3 ${game.warnaJudul}`}>
                          {game.judul}
                        </h3>
                        <div className="text-4xl my-2">{game.ikon}</div>
                        <span className="text-xs font-bold bg-white/80 px-2.5 py-1 rounded-md text-slate-600 my-2">
                          {game.badge}
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed mt-auto">
                          {game.deskripsi}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            </main>
          )}
        </>
      )}

      {/* KONDISI 3: HALAMAN LAPORAN */}
      {halamanAktif === 'laporan' && (
        <>
          {dataSesi ? (
            <LaporanHasil
              dataSesi={dataSesi}
              hasilGame={hasilGame}
              onKembaliKeArena={() => setHalamanAktif('arena-game')}
              onSimpanKeMonitoring={handleSimpanKeMonitoring}
              sudahTersimpan={sudahTersimpan}
            />
          ) : (
            <div className="max-w-xl mx-auto px-6 py-16 text-center">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <div className="text-5xl mb-3">📋</div>
                <h2 className="text-xl font-extrabold text-indigo-950 mb-2">
                  Belum Ada Sesi Skrining Aktif
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                  Silakan isi formulir observasi dan selesaikan minimal satu permainan untuk melihat laporan hasil analisis.
                </p>
                <button
                  onClick={() => setHalamanAktif('observasi')}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl cursor-pointer"
                >
                  🚀 Mulai Skrining Sekarang
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* KONDISI 4: HALAMAN MONITORING */}
      {halamanAktif === 'monitoring' && (
        <HalamanMonitoring
          riwayat={riwayatMonitoring}
          onMulaiBaru={() => setHalamanAktif('observasi')}
          onHapusSemua={handleHapusSemuaRiwayat}
        />
      )}

      {/* KONDISI 5: HALAMAN INFORMASI EDUKASI */}
      {halamanAktif === 'informasi' && (
        <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <span className="bg-sky-100 text-sky-900 text-xs font-bold px-3 py-1 rounded-full">
              Panduan Literasi & Inklusi
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-950 mt-2 mb-3">
              Mengenal Disleksia & Pendekatan Multisensori
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Disleksia merupakan kesulitan belajar spesifik yang berpusat pada pemrosesan simbol huruf dan bunyi bahasa di otak, bukan disebabkan oleh rendahnya kecerdasan atau kurangnya motivasi anak. Deteksi dini pada jenjang kelas 3–6 SD membantu guru dan orang tua memberikan strategi pendampingan yang tepat.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50/70 p-5 rounded-2xl border border-purple-100">
                <h3 className="font-bold text-indigo-950 mb-1">1. Disleksia Fonologis</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kesulitan menghubungkan bentuk huruf dengan bunyinya sehingga hambatan muncul saat mengeja kata baru.
                </p>
              </div>
              <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-100">
                <h3 className="font-bold text-emerald-950 mb-1">2. Disleksia Permukaan</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kesulitan mengenali bentuk kata secara visual utuh dan mengingat ejaan kata yang sering ditemui.
                </p>
              </div>
              <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-100">
                <h3 className="font-bold text-amber-950 mb-1">3. Rapid Naming Deficit</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kecepatan pemrosesan lambat saat menyebutkan nama huruf, angka, warna, atau objek secara cepat.
                </p>
              </div>
              <div className="bg-sky-50/70 p-5 rounded-2xl border border-sky-100">
                <h3 className="font-bold text-sky-950 mb-1">4. Terapi Multisensori (VAKT)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mengintegrasikan indera penglihatan, pendengaran, gerakan, dan sentuhan agar anak memahami simbol huruf lebih mudah.
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* KONDISI 6: HALAMAN AKUN */}
      {halamanAktif === 'akun' && (
        <main className="max-w-xl mx-auto px-6 py-12">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
            <div className="text-5xl mb-3">👩🏻‍🏫</div>
            <h2 className="text-xl font-extrabold text-indigo-950 mb-1">
              Akun Pendamping & Sekolah
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Saat ini aplikasi berjalan dalam mode penyimpanan lokal perangkat. Pada tahap berikutnya, menu ini dapat dihubungkan dengan Firebase Authentication untuk sinkronisasi akun guru dan orang tua.
            </p>
            <button
              onClick={() => setHalamanAktif('monitoring')}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl cursor-pointer"
            >
              Lihat Dasbor Monitoring
            </button>
          </div>
        </main>
      )}

      {/* KONDISI 7: HALAMAN BERANDA UTAMA */}
      {halamanAktif === 'beranda' && (
        <main className="max-w-6xl mx-auto px-6 pt-4 pb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-indigo-950 mb-6">
                Skrining Dini Disleksia,{' '}
                <span className="text-teal-600 block">Deteksi Cepat,</span>
                Intervensi Tepat
              </h1>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setHalamanAktif('observasi')}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-7 py-3.5 rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <span>🚀</span> Mulai Skrining
                </button>

                <button
                  onClick={() => setHalamanAktif('informasi')}
                  className="bg-white hover:bg-teal-50 text-teal-700 border-2 border-teal-500 font-bold px-7 py-3.5 rounded-xl transition cursor-pointer flex items-center gap-2"
                >
                  <span>📖</span> Pelajari Instrumen
                </button>
              </div>
            </div>

            <div className="bg-white/80 border-2 border-sky-100 rounded-3xl p-8 shadow-sm text-center relative">
              <div className="text-7xl mb-3">👦🏻💻</div>
              <p className="text-sm font-semibold text-slate-500">
                Area Ilustrasi Karakter Anak & Elemen Multisensori
              </p>
              <div className="flex justify-center gap-3 mt-4 text-2xl">
                <span className="bg-amber-100 px-3 py-1 rounded-lg">👂</span>
                <span className="bg-sky-100 px-3 py-1 rounded-lg font-bold text-blue-700">b</span>
                <span className="bg-emerald-100 px-3 py-1 rounded-lg font-bold text-emerald-700">me-ja</span>
              </div>
            </div>
          </div>

          <section className="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {daftarGame.map((game) => (
                <div
                  key={game.id}
                  onClick={() => setHalamanAktif('observasi')}
                  className={`${game.warnaBg} border-2 rounded-2xl p-4 flex flex-col items-center text-center transition transform hover:-translate-y-1 cursor-pointer`}
                >
                  <h2 className={`font-extrabold text-base mb-3 ${game.warnaJudul}`}>
                    {game.judul}
                  </h2>
                  <div className="text-4xl my-2">{game.ikon}</div>
                  <span className="text-xs font-bold bg-white/80 px-2.5 py-1 rounded-md text-slate-600 my-2">
                    {game.badge}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed mt-auto">
                    {game.deskripsi}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

export default App;