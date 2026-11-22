import { useState, useEffect } from 'react';
import FormObservasi from './components/FormObservasi';
import GameMencariHuruf from './components/GameMencariHuruf';
import GameDengarPilih from './components/GameDengarPilih';
import GameUrutkanKata from './components/GameUrutkanKata';
import GameBacaCepat from './components/GameBacaCepat';
import GamePasanganKata from './components/GamePasanganKata';
import GameIngatUlangi from './components/GameIngatUlangi';
import LaporanHasil from './components/LaporanHasil';
import LembarKerjaCetak from './components/LembarKerjaCetak';
import HalamanMonitoring from './components/HalamanMonitoring';
import HalamanAkun from './components/HalamanAkun';
import LatihanMenulis from './components/LatihanMenulis';
import RuangBaca from './components/RuangBaca';
import { katalogLencana, LencanaSVG } from './components/IlustrasiKataKita';

function App() {
  const [halamanAktif, setHalamanAktif] = useState('beranda');
  const [tabLatihan, setTabLatihan] = useState('menulis'); // 'menulis' | 'membaca'
  const [dataSesi, setDataSesi] = useState(null);
  const [gameAktif, setGameAktif] = useState(null);
  const [hasilGame, setHasilGame] = useState({});
  const [sudahTersimpan, setSudahTersimpan] = useState(false);
  const [lencanaBaruDiraih, setLencanaBaruDiraih] = useState(null);

  // State Panel Aksesibilitas Ramah Disleksia (UDL)
  const [bukaPanelUDL, setBukaPanelUDL] = useState(false);
  const [spasiRenggang, setSpasiRenggang] = useState(false);
  const [temaLatar, setTemaLatar] = useState('default'); // 'default' | 'krem' | 'biru'

  const [akunAktif, setAkunAktif] = useState(() => {
    try {
      const tersimpan = localStorage.getItem('katakita_akun');
      return tersimpan ? JSON.parse(tersimpan) : null;
    } catch {
      return null;
    }
  });

  const [riwayatMonitoring, setRiwayatMonitoring] = useState(() => {
    try {
      const tersimpan =
        localStorage.getItem('katakita_riwayat') ||
        localStorage.getItem('lexscreen_riwayat');
      return tersimpan ? JSON.parse(tersimpan) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      if (akunAktif) {
        localStorage.setItem('katakita_akun', JSON.stringify(akunAktif));
      } else {
        localStorage.removeItem('katakita_akun');
      }
    } catch {
      // Abaikan jika storage penuh
    }
  }, [akunAktif]);

  useEffect(() => {
    try {
      localStorage.setItem('katakita_riwayat', JSON.stringify(riwayatMonitoring));
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

  const handleMulaiModeDemo = () => {
    const hariIni = new Date().toISOString().split('T')[0];
    setDataSesi({
      identitas: {
        tanggal: hariIni,
        namaSiswa: 'Siswa Demo',
        kelas: '4 SD',
        asalSekolah: 'SDN Percontohan KataKita',
        peran: akunAktif?.peran || 'guru',
        namaPengisi: akunAktif?.nama || 'Pendamping Demo',
      },
      jawaban: {},
      jumlahTandaYa: 4,
      totalPertanyaan: 15,
      interpretasi: 'Mode Simulasi Demo',
      adalahDemo: true,
    });
    setHasilGame({});
    setSudahTersimpan(false);
    setLencanaBaruDiraih(null);
    setGameAktif(null);
    setHalamanAktif('arena-game');
  };

  const handleSelesaiObservasi = (hasilObservasi) => {
    setDataSesi(hasilObservasi);
    setHasilGame({});
    setSudahTersimpan(false);
    setLencanaBaruDiraih(null);
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

    // Tampilkan Apresiasi Lencana Anak setiap kali menyelesaikan 1 game
    const infoLencana = katalogLencana.find((l) => l.idGame === skorGame.idGame);
    if (infoLencana) {
      setLencanaBaruDiraih(infoLencana);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const ucapan = new SpeechSynthesisUtterance(
          `Wah hebat! Kamu mendapatkan lencana ${infoLencana.judul}!`
        );
        ucapan.lang = 'id-ID';
        ucapan.rate = 0.9;
        window.speechSynthesis.speak(ucapan);
      }
    }
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

  const bunyikanContohBeranda = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const ucapan = new SpeechSynthesisUtterance(
        'Selamat datang di Kata Kita. Mari belajar membaca dengan cara yang menyenangkan!'
      );
      ucapan.lang = 'id-ID';
      ucapan.rate = 0.9;
      window.speechSynthesis.speak(ucapan);
    }
  };

  const kelasLatar =
    temaLatar === 'krem'
      ? 'bg-[#FDF6E3]'
      : temaLatar === 'biru'
      ? 'bg-sky-100/70'
      : 'bg-gradient-to-b from-sky-50 via-white to-blue-50';

  const gayaSpasiUDL = spasiRenggang
    ? { letterSpacing: '0.06em', wordSpacing: '0.16em', lineHeight: '1.75' }
    : {};

  const jumlahGameSelesai = Object.keys(hasilGame).length;

  return (
    <div
      style={gayaSpasiUDL}
      className={`min-h-screen ${kelasLatar} font-sans text-slate-800 transition-colors duration-300`}
    >
      {/* NAVBAR */}
      <nav className="print:hidden max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4 relative">
        <div
       onClick={() => {
         setHalamanAktif('beranda');
         setGameAktif(null);
       }}
       className="flex items-center gap-2.5 cursor-pointer"
     >
       <img
         src="/logo-katakita.png"
         alt="Logo KataKita"
         className="h-12 w-auto object-contain mix-blend-multiply"
       />
       <span className="text-2xl font-extrabold tracking-tight text-teal-600">
         Kata<span className="text-indigo-950">Kita</span>
       </span>
     </div>

        <ul className="flex flex-wrap items-center gap-4 md:gap-6 font-semibold text-indigo-950 text-sm md:text-base">
          {['Beranda', 'Latihan', 'Informasi', 'Monitoring', 'Laporan'].map((menu) => (
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

          {/* TOMBOL PENGATURAN AKSESIBILITAS DISLEKSIA (UDL) */}
          <li className="relative">
            <button
              type="button"
              onClick={() => setBukaPanelUDL(!bukaPanelUDL)}
              title="Pengaturan Tampilan Ramah Disleksia"
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                spasiRenggang || temaLatar !== 'default'
                  ? 'bg-amber-100 border-amber-400 text-amber-950'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-teal-400'
              }`}
            >
              <span>👁️</span>
              <span className="hidden sm:inline">Tampilan</span>
            </button>

            {bukaPanelUDL && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700">
                    Aksesibilitas Disleksia
                  </span>
                  <button
                    type="button"
                    onClick={() => setBukaPanelUDL(false)}
                    className="text-xs text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-bold text-slate-700">
                      Spasi Huruf & Kata Lega
                    </span>
                    <input
                      type="checkbox"
                      checked={spasiRenggang}
                      onChange={(e) => setSpasiRenggang(e.target.checked)}
                      className="w-4 h-4 accent-teal-600 cursor-pointer"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Mencegah huruf terlihat saling menumpuk saat dibaca.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2">
                    Warna Latar Anti-Silau:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTemaLatar('default')}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                        temaLatar === 'default'
                          ? 'border-teal-600 bg-sky-50 text-teal-900'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      Cerah
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemaLatar('krem')}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                        temaLatar === 'krem'
                          ? 'border-amber-600 bg-[#FDF6E3] text-amber-950'
                          : 'border-slate-200 bg-[#FDF6E3] text-slate-700'
                      }`}
                    >
                      Krem
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemaLatar('biru')}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                        temaLatar === 'biru'
                          ? 'border-sky-600 bg-sky-100 text-sky-950'
                          : 'border-slate-200 bg-sky-100/60 text-slate-700'
                      }`}
                    >
                      Pastel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>

          {/* TOMBOL MENU AKUN */}
          <li>
            <button
              onClick={() => {
                setHalamanAktif('akun');
                setGameAktif(null);
              }}
              className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                akunAktif
                  ? 'bg-teal-600 text-white shadow-xs hover:bg-teal-700'
                  : halamanAktif === 'akun'
                  ? 'bg-indigo-950 text-white'
                  : 'bg-white border border-slate-200 text-indigo-950 hover:border-teal-500'
              }`}
            >
              <span>
                {akunAktif ? (akunAktif.peran === 'guru' ? '👩🏻‍🏫' : '👨🏻‍👩🏻‍👧🏻') : '👤'}
              </span>
              <span>
                {akunAktif
                  ? `${akunAktif.nama.split(' ')[0]} (${
                      akunAktif.peran === 'guru' ? 'Guru' : 'Ortu'
                    })`
                  : 'Akun'}
              </span>
            </button>
          </li>
        </ul>
      </nav>

      {/* KONDISI 1: HALAMAN FORM OBSERVASI */}
      {halamanAktif === 'observasi' && (
        <FormObservasi
          akunAktif={akunAktif}
          onKembali={() => setHalamanAktif('beranda')}
          onSelesai={handleSelesaiObservasi}
        />
      )}

      {/* KONDISI 2: HALAMAN LATIHAN MULTISENSORI (MENULIS VAKT & RUANG BACA) */}
      {halamanAktif === 'latihan' && (
        <div>
          <div className="max-w-5xl mx-auto px-6 pt-4">
            <div className="inline-flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs gap-1.5">
              <button
                type="button"
                onClick={() => setTabLatihan('menulis')}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-extrabold transition cursor-pointer flex items-center gap-2 ${
                  tabLatihan === 'menulis'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>✍️</span> Papan Latihan Menulis (VAKT)
              </button>

              <button
                type="button"
                onClick={() => setTabLatihan('membaca')}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-extrabold transition cursor-pointer flex items-center gap-2 ${
                  tabLatihan === 'membaca'
                    ? 'bg-indigo-950 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>📖</span> Ruang Baca Ramah Disleksia
              </button>
            </div>
          </div>

          {tabLatihan === 'menulis' ? (
            <LatihanMenulis onKembali={() => setHalamanAktif('beranda')} />
          ) : (
            <div className="max-w-5xl mx-auto px-6 py-6">
              <RuangBaca />
            </div>
          )}
        </div>
      )}

      {/* KONDISI 3: HALAMAN ARENA GAME ATAU LAYAR GAME AKTIF */}
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
            <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
              {/* POP-UP PERAYAAN LENCANA BARU */}
              {lencanaBaruDiraih && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-sm w-full p-7 text-center shadow-2xl border-2 border-amber-300 space-y-4">
                    <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3.5 py-1 rounded-full">
                      🎉 Apresiasi Pencapaian Anak
                    </span>
                    <div className="pt-2">
                      <LencanaSVG
                        warnaUtama={lencanaBaruDiraih.warnaUtama}
                        warnaLatar={lencanaBaruDiraih.warnaLatar}
                        simbol={lencanaBaruDiraih.simbol}
                        terkunci={false}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-indigo-950">
                        Lencana &ldquo;{lencanaBaruDiraih.judul}&rdquo;!
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Terima kasih sudah berusaha dengan penuh semangat! Ayo kumpulkan semua lencananya.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLencanaBaruDiraih(null)}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-3 rounded-xl shadow cursor-pointer"
                    >
                      Lanjut Bermain 🚀
                    </button>
                  </div>
                </div>
              )}

              {/* BANNER SAPAAN SISWA */}
              <div className="bg-indigo-950 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
                <div>
                  <span className="bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full">
                    {dataSesi.adalahDemo
                      ? `Mode Uji Coba Demo • ${jumlahGameSelesai}/6 Game Selesai`
                      : `Tahap 2 dari 2 • Skrining Gamifikasi Anak (${jumlahGameSelesai}/6 Selesai)`}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-extrabold mt-2">
                    Halo, {dataSesi.identitas.namaSiswa}! ({dataSesi.identitas.kelas})
                  </h1>
                  <p className="text-sm text-sky-200 mt-1">
                    {dataSesi.adalahDemo
                      ? 'Silakan pilih kartu permainan di bawah untuk menguji alur skrining dan laporan.'
                      : `Skor Checklist Awal: ${dataSesi.jumlahTandaYa} dari ${dataSesi.totalPertanyaan} tanda (${dataSesi.interpretasi})`}
                  </p>
                </div>
                <button
                  onClick={() => setHalamanAktif('observasi')}
                  className="bg-white/15 hover:bg-white/25 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
                >
                  {dataSesi.adalahDemo ? 'Isi Form Asli' : 'Ubah Data Observasi'}
                </button>
              </div>

              {/* KARTU PILIHAN 6 GAME */}
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

              {/* PAPAN APRESIASI & KOLEKSI LENCANA ANAK */}
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-amber-200/80">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-base md:text-lg font-extrabold text-indigo-950 flex items-center gap-2">
                      <span>🏆</span> Papan Koleksi Lencana {dataSesi.identitas.namaSiswa}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Setiap permainan yang diselesaikan akan membuka lencana keberanian belajar!
                    </p>
                  </div>
                  <span className="bg-amber-100 text-amber-950 text-xs font-extrabold px-3.5 py-1.5 rounded-full">
                    🏅 Terkumpul: {jumlahGameSelesai} / 6 Lencana
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                  {katalogLencana.map((lencana) => {
                    const terbuka = Boolean(hasilGame[lencana.idGame]);
                    return (
                      <div
                        key={lencana.idGame}
                        className={`p-3 rounded-2xl border text-center transition ${
                          terbuka
                            ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                            : 'bg-slate-50/70 border-slate-200'
                        }`}
                      >
                        <LencanaSVG
                          warnaUtama={lencana.warnaUtama}
                          warnaLatar={lencana.warnaLatar}
                          simbol={lencana.simbol}
                          terkunci={!terbuka}
                        />
                        <p
                          className={`text-xs font-extrabold mt-2 ${
                            terbuka ? 'text-indigo-950' : 'text-slate-400'
                          }`}
                        >
                          {lencana.judul}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {terbuka ? '✨ Terbuka!' : lencana.syarat}
                        </p>
                      </div>
                    );
                  })}

                  {/* Lencana Utama Jika Ke-6 Game Selesai */}
                  <div
                    className={`p-3 rounded-2xl border-2 text-center transition ${
                      jumlahGameSelesai === 6
                        ? 'bg-gradient-to-b from-amber-100 to-yellow-50 border-amber-400 shadow-md'
                        : 'bg-slate-50/70 border-dashed border-slate-300'
                    }`}
                  >
                    <LencanaSVG
                      warnaUtama="#B45309"
                      warnaLatar="#FEF08A"
                      simbol="👑"
                      terkunci={jumlahGameSelesai < 6}
                    />
                    <p
                      className={`text-xs font-extrabold mt-2 ${
                        jumlahGameSelesai === 6 ? 'text-amber-950' : 'text-slate-400'
                      }`}
                    >
                      Bintang Super
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {jumlahGameSelesai === 6 ? '🎉 Juara Literasi!' : 'Selesaikan 6 game'}
                    </p>
                  </div>
                </div>
              </section>
            </main>
          )}
        </>
      )}

      {/* KONDISI 4: HALAMAN LAPORAN */}
      {halamanAktif === 'laporan' && (
        <>
          {dataSesi ? (
            <LaporanHasil
              dataSesi={dataSesi}
              hasilGame={hasilGame}
              onKembaliKeArena={() => setHalamanAktif('arena-game')}
              onSimpanKeMonitoring={handleSimpanKeMonitoring}
              sudahTersimpan={sudahTersimpan}
              onBukaLatihan={() => {
                setTabLatihan('menulis');
                setHalamanAktif('latihan');
              }}
              onBukaLembarKerja={() => setHalamanAktif('lembar-kerja')}
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

      {/* KONDISI 4B: HALAMAN GENERATOR LEMBAR KERJA CETAK A4 */}
      {halamanAktif === 'lembar-kerja' && dataSesi && (
        <LembarKerjaCetak
          dataSesi={dataSesi}
          hasilGame={hasilGame}
          onKembaliKeLaporan={() => setHalamanAktif('laporan')}
        />
      )}

      {/* KONDISI 5: HALAMAN MONITORING */}
      {halamanAktif === 'monitoring' && (
        <HalamanMonitoring
          riwayat={riwayatMonitoring}
          onMulaiBaru={() => setHalamanAktif('observasi')}
          onHapusSemua={handleHapusSemuaRiwayat}
        />
      )}

      {/* KONDISI 6: HALAMAN INFORMASI EDUKASI */}
      {halamanAktif === 'informasi' && (
        <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <span className="bg-sky-100 text-sky-900 text-xs font-bold px-3 py-1 rounded-full">
              Panduan Literasi & Inklusi KataKita
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

      {/* KONDISI 7: HALAMAN AKUN */}
      {halamanAktif === 'akun' && (
        <HalamanAkun
          akunAktif={akunAktif}
          onLogin={(dataAkun) => setAkunAktif(dataAkun)}
          onLogout={() => setAkunAktif(null)}
          onMulaiSkrining={() => setHalamanAktif('observasi')}
          onBukaMonitoring={() => setHalamanAktif('monitoring')}
        />
      )}

      {/* KONDISI 8: HALAMAN BERANDA UTAMA */}
      {halamanAktif === 'beranda' && (
        <main className="max-w-6xl mx-auto px-6 pt-4 pb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div>
              <span className="inline-block bg-teal-100 text-teal-800 text-xs font-extrabold px-3.5 py-1 rounded-full mb-3">
                ✨ Platform Literasi Multisensori Kelas 3–6 SD
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-indigo-950 mb-4">
                Skrining Dini Disleksia,{' '}
                <span className="text-teal-600 block">Deteksi Cepat,</span>
                Intervensi Tepat
              </h1>
              <p className="text-sm md:text-base text-slate-600 mb-6 leading-relaxed">
                Membantu guru dan orang tua mengenali gaya belajar serta potensi hambatan membaca anak melalui 6 aktivitas permainan interaktif, latihan menulis VAKT, dan ruang baca adaptif.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setHalamanAktif('observasi')}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <span>🚀</span> Mulai Skrining
                </button>

                <button
                  onClick={handleMulaiModeDemo}
                  className="bg-white hover:bg-teal-50 text-teal-700 border-2 border-teal-500 font-bold px-6 py-3.5 rounded-xl transition cursor-pointer flex items-center gap-2"
                >
                  <span>▶️</span> Coba Demo Game
                </button>
              </div>
            </div>

            {/* Kartu Simulasi Multisensori Interaktif di Beranda */}
            <div className="bg-white/90 border-2 border-sky-100 rounded-3xl p-7 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                  Stimulasi Visual • Auditori • Kinestetik
                </span>
                <button
                  type="button"
                  onClick={bunyikanContohBeranda}
                  className="text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1 rounded-full transition cursor-pointer"
                >
                  🔊 Tes Suara
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 my-4 text-center">
                <div
                  onClick={() => {
                    setTabLatihan('membaca');
                    setHalamanAktif('latihan');
                  }}
                  className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-2xl p-4 cursor-pointer transition"
                >
                  <span className="text-3xl font-extrabold text-indigo-950 block">📖</span>
                  <span className="text-[11px] font-semibold text-purple-800 mt-1 block">
                    Ruang Baca
                  </span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <span className="text-3xl block">👂🔊</span>
                  <span className="text-[11px] font-semibold text-emerald-800 mt-1 block">
                    Fonem Audio
                  </span>
                </div>
                <div
                  onClick={() => {
                    setTabLatihan('menulis');
                    setHalamanAktif('latihan');
                  }}
                  className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-2xl p-4 cursor-pointer transition"
                >
                  <span className="text-2xl font-extrabold text-orange-900 block pt-1">
                    ✍️ VAKT
                  </span>
                  <span className="text-[11px] font-semibold text-orange-800 mt-1 block">
                    Latih Menulis
                  </span>
                </div>
              </div>

              <div className="bg-sky-50/80 rounded-2xl p-3.5 flex items-center justify-between text-xs text-slate-600">
                <span>
                  💡 Klik menu <strong>Latihan</strong> untuk mencoba Papan Menulis VAKT & Ruang Baca.
                </span>
              </div>
            </div>
          </div>

          <section className="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base md:text-lg font-extrabold text-indigo-950">
                6 Aktivitas Skrining Berbasis Permainan
              </h2>
              <span className="text-xs font-semibold text-slate-400">
                Klik kartu untuk memulai
              </span>
            </div>
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