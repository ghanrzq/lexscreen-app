import { useState, useEffect, useRef } from 'react';

const daftarCerita = [
  {
    id: 'kucing-oren',
    judul: 'Bima dan Kucing Oren',
    level: 'Level 1 • Kalimat Pendek',
    ikon: '🐈',
    warnaKartu: 'bg-amber-50 border-amber-200',
    kalimat: [
      [
        ['Bi', 'ma'],
        ['pu', 'lang'],
        ['se', 'ko', 'lah'],
        ['pa', 'da'],
        ['si', 'ang'],
        ['ha', 'ri.'],
      ],
      [
        ['Di'],
        ['de', 'pan'],
        ['pa', 'gar'],
        ['ru', 'mah,'],
        ['a', 'da'],
        ['ku', 'cing'],
        ['ke', 'cil'],
        ['ber', 'war', 'na'],
        ['o', 'ren.'],
      ],
      [
        ['Ku', 'cing'],
        ['i', 'tu'],
        ['tam', 'pak'],
        ['la', 'par'],
        ['dan'],
        ['me', 'nge', 'ong'],
        ['pe', 'lan.'],
      ],
      [
        ['Bi', 'ma'],
        ['se', 'ge', 'ra'],
        ['mem', 'be', 'ri', 'nya'],
        ['i', 'kan'],
        ['dan'],
        ['a', 'ir'],
        ['mi', 'num.'],
      ],
      [
        ['Ki', 'ni'],
        ['ku', 'cing'],
        ['o', 'ren'],
        ['se', 'nang'],
        ['ber', 'ma', 'in'],
        ['di'],
        ['ha', 'la', 'man.'],
      ],
    ],
    kuis: [
      {
        tanya: 'Apa warna kucing yang ditemui Bima di depan pagar?',
        opsi: ['Putih bersih', 'Oren', 'Hitam legam'],
        jawabanBenar: 'Oren',
      },
      {
        tanya: 'Apa yang diberikan Bima kepada kucing kecil itu?',
        opsi: ['Ikan dan air minum', 'Bola plastik', 'Buku cerita'],
        jawabanBenar: 'Ikan dan air minum',
      },
    ],
  },
  {
    id: 'kebun-sekolah',
    judul: 'Kebun Hijau di Sekolah',
    level: 'Level 2 • Kosakata Beragam',
    ikon: '🌱',
    warnaKartu: 'bg-emerald-50 border-emerald-200',
    kalimat: [
      [
        ['Se', 'ti', 'ap'],
        ['ha', 'ri'],
        ['Jum', 'at,'],
        ['sis', 'wa'],
        ['ke', 'las'],
        ['em', 'pat'],
        ['me', 'ra', 'wat'],
        ['ke', 'bun'],
        ['se', 'ko', 'lah.'],
      ],
      [
        ['Ra', 'ni'],
        ['me', 'nyi', 'ram'],
        ['ta', 'na', 'man'],
        ['to', 'mat'],
        ['dan'],
        ['ca', 'bai'],
        ['de', 'ngan'],
        ['ge', 'mbor.'],
      ],
      [
        ['Do', 'ni'],
        ['mem', 'ber', 'sih', 'kan'],
        ['da', 'un'],
        ['ke', 'ring'],
        ['yang'],
        ['ja', 'tuh'],
        ['di'],
        ['ta', 'nah.'],
      ],
      [
        ['Bu', 'ah'],
        ['to', 'mat'],
        ['mu', 'lai'],
        ['tum', 'buh'],
        ['bu', 'lat'],
        ['dan'],
        ['ber', 'war', 'na'],
        ['me', 'rah'],
        ['ce', 'rah.'],
      ],
      [
        ['Se', 'mu', 'a'],
        ['mur', 'id'],
        ['bang', 'ga'],
        ['me', 'li', 'hat'],
        ['ha', 'sil'],
        ['ker', 'ja'],
        ['sa', 'ma'],
        ['me', 're', 'ka.'],
      ],
    ],
    kuis: [
      {
        tanya: 'Setiap hari apa siswa kelas empat merawat kebun sekolah?',
        opsi: ['Senin', 'Rabu', 'Jumat'],
        jawabanBenar: 'Jumat',
      },
      {
        tanya: 'Tanaman apa saja yang disiram oleh Rani?',
        opsi: ['Tomat dan cabai', 'Mangga dan jeruk', 'Mawar dan melati'],
        jawabanBenar: 'Tomat dan cabai',
      },
    ],
  },
  {
    id: 'layang-layang',
    judul: 'Layang-Layang Nusantara',
    level: 'Level 3 • Paragraf Deskriptif',
    ikon: '🪁',
    warnaKartu: 'bg-sky-50 border-sky-200',
    kalimat: [
      [
        ['A', 'ngin'],
        ['so', 're'],
        ['ber', 'ti', 'up'],
        ['se', 'poi'],
        ['di'],
        ['la', 'pa', 'ngan'],
        ['de', 'sa.'],
      ],
      [
        ['Ta', 'riq'],
        ['dan'],
        ['Sa', 'ri'],
        ['mem', 'ba', 'wa'],
        ['la', 'yang-', 'la', 'yang'],
        ['ber', 'ben', 'tuk'],
        ['bu', 'rung'],
        ['ga', 'ru', 'da.'],
      ],
      [
        ['Be', 'nang'],
        ['di', 'ta', 'rik'],
        ['per', 'la', 'han'],
        ['hing', 'ga'],
        ['la', 'yang-', 'la', 'yang'],
        ['ter', 'bang'],
        ['ting', 'gi.'],
      ],
      [
        ['E', 'kor', 'nya'],
        ['yang'],
        ['pan', 'jang'],
        ['me', 'na', 'ri-', 'na', 'ri'],
        ['in', 'dah'],
        ['di'],
        ['ba', 'wah'],
        ['a', 'wan'],
        ['pu', 'tih.'],
      ],
      [
        ['Me', 're', 'ka'],
        ['ber', 'main'],
        ['de', 'ngan'],
        ['ru', 'kun'],
        ['sam', 'pai'],
        ['ma', 'ta', 'ha', 'ri'],
        ['mu', 'lai'],
        ['ter', 'be', 'nam.'],
      ],
    ],
    kuis: [
      {
        tanya: 'Berbentuk seperti apa layang-layang milik Tariq dan Sari?',
        opsi: ['Burung garuda', 'Ikan paus', 'Bintang laut'],
        jawabanBenar: 'Burung garuda',
      },
      {
        tanya: 'Kapan mereka selesai bermain di lapangan desa?',
        opsi: ['Saat hujan turun', 'Saat matahari mulai terbenam', 'Saat pagi hari'],
        jawabanBenar: 'Saat matahari mulai terbenam',
      },
    ],
  },
];

export default function RuangBaca() {
  const [indeksCerita, setIndeksCerita] = useState(0);
  const [modeSukuKata, setModeSukuKata] = useState(true);
  const [penggarisAktif, setPenggarisAktif] = useState(true);
  const [ukuranTeks, setUkuranTeks] = useState('besar'); // 'normal' | 'besar' | 'ekstra'
  const [posisiY, setPosisiY] = useState(90);
  const [kalimatDibaca, setKalimatDibaca] = useState(null);
  const [jawabanKuis, setJawabanKuis] = useState({});

  const areaBacaRef = useRef(null);
  const cerita = daftarCerita[indeksCerita];

  useEffect(() => {
    setKalimatDibaca(null);
    setJawabanKuis({});
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [indeksCerita]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const gabungKalimatTeks = (arrKata) =>
    arrKata.map((sukuList) => sukuList.join('')).join(' ');

  const bacakanSatuKalimat = (idxKalimat) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const teks = gabungKalimatTeks(cerita.kalimat[idxKalimat]);
    const ucapan = new SpeechSynthesisUtterance(teks);
    ucapan.lang = 'id-ID';
    ucapan.rate = 0.85;

    setKalimatDibaca(idxKalimat);
    ucapan.onend = () => setKalimatDibaca(null);
    ucapan.onerror = () => setKalimatDibaca(null);

    window.speechSynthesis.speak(ucapan);
  };

  const bacakanSeluruhCerita = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    let indeksSekarang = 0;

    const bacaBerikutnya = () => {
      if (indeksSekarang >= cerita.kalimat.length) {
        setKalimatDibaca(null);
        return;
      }
      setKalimatDibaca(indeksSekarang);
      const teks = gabungKalimatTeks(cerita.kalimat[indeksSekarang]);
      const ucapan = new SpeechSynthesisUtterance(teks);
      ucapan.lang = 'id-ID';
      ucapan.rate = 0.85;
      ucapan.onend = () => {
        indeksSekarang++;
        bacaBerikutnya();
      };
      ucapan.onerror = () => setKalimatDibaca(null);
      window.speechSynthesis.speak(ucapan);
    };

    bacaBerikutnya();
  };

  const hentikanSuara = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setKalimatDibaca(null);
  };

  const handleGerakPenggaris = (e) => {
    if (!penggarisAktif || !areaBacaRef.current) return;
    const rect = areaBacaRef.current.getBoundingClientRect();
    const yRelatif = e.clientY - rect.top;
    const yTerbatas = Math.max(24, Math.min(rect.height - 24, yRelatif));
    setPosisiY(yTerbatas);
  };

  const kelasUkuranFont =
    ukuranTeks === 'ekstra'
      ? 'text-2xl md:text-3xl leading-[2.3]'
      : ukuranTeks === 'besar'
      ? 'text-xl md:text-2xl leading-[2.2]'
      : 'text-base md:text-lg leading-[2.0]';

  const jumlahKuisBenar = cerita.kuis.filter(
    (q, idx) => jawabanKuis[idx] === q.jawabanBenar
  ).length;

  return (
    <div className="space-y-6">
      {/* HEADER & PILIHAN JUDUL CERITA */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
        <span className="bg-sky-100 text-sky-900 text-xs font-extrabold px-3 py-1 rounded-full">
          Alat Bantu Baca Adaptif • Visual & Auditori
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-950 mt-2">
          📖 Ruang Baca Ramah Disleksia
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Gunakan <strong>Penggaris Fokus</strong> agar baris tidak melompat, aktifkan{' '}
          <strong>Warna Suku Kata</strong> untuk mempermudah pengejaan, atau klik kalimat mana saja untuk mendengarkan suaranya.
        </p>

        {/* Pilihan 3 Cerita Pendek */}
        <div className="grid sm:grid-cols-3 gap-3 mt-6">
          {daftarCerita.map((item, idx) => {
            const aktif = idx === indeksCerita;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndeksCerita(idx)}
                className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex items-center gap-3 ${
                  aktif
                    ? 'bg-indigo-950 text-white border-indigo-950 shadow-md'
                    : `${item.warnaKartu} text-indigo-950 hover:border-teal-400`
                }`}
              >
                <span className="text-3xl">{item.ikon}</span>
                <div>
                  <p className="font-extrabold text-sm">{item.judul}</p>
                  <p
                    className={`text-[11px] font-semibold mt-0.5 ${
                      aktif ? 'text-sky-200' : 'text-slate-500'
                    }`}
                  >
                    {item.level}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PANEL KONTROL ALAT BANTU BACA */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Toggle Warna Suku Kata */}
          <button
            type="button"
            onClick={() => setModeSukuKata(!modeSukuKata)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition cursor-pointer flex items-center gap-1.5 ${
              modeSukuKata
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <span>🎨</span> Warna Suku Kata: {modeSukuKata ? 'ON' : 'OFF'}
          </button>

          {/* Toggle Penggaris Fokus */}
          <button
            type="button"
            onClick={() => setPenggarisAktif(!penggarisAktif)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition cursor-pointer flex items-center gap-1.5 ${
              penggarisAktif
                ? 'bg-amber-400 text-indigo-950 border-amber-500'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <span>📏</span> Penggaris Fokus: {penggarisAktif ? 'ON' : 'OFF'}
          </button>

          {/* Kontrol Ukuran Huruf */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1">
            {[
              { id: 'normal', label: 'A' },
              { id: 'besar', label: 'A+' },
              { id: 'ekstra', label: 'A++' },
            ].map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => setUkuranTeks(u.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                  ukuranTeks === u.id
                    ? 'bg-white text-indigo-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        {/* Kontrol Audio Baca */}
        <div className="flex items-center gap-2">
          {kalimatDibaca !== null ? (
            <button
              type="button"
              onClick={hentikanSuara}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
            >
              ⏹️ Hentikan Suara
            </button>
          ) : (
            <button
              type="button"
              onClick={bacakanSeluruhCerita}
              className="bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
            >
              🔊 Bacakan Cerita
            </button>
          )}
        </div>
      </div>

      {/* KANVAS BACAAN DENGAN READING RULER & PEWARNA SUKU KATA */}
      <div
        ref={areaBacaRef}
        onPointerMove={handleGerakPenggaris}
        className="relative bg-[#FFFDF7] rounded-3xl p-6 md:p-10 border-2 border-amber-200/80 shadow-md overflow-hidden select-none"
      >
        {/* Pita Penggaris Fokus Baca (Reading Ruler) */}
        {penggarisAktif && (
          <div
            style={{ top: `${posisiY - 26}px` }}
            className="pointer-events-none absolute left-0 right-0 h-[52px] bg-amber-300/25 border-y-2 border-amber-400/70 transition-all duration-75 z-10"
          />
        )}

        <div className="relative z-20 mb-5 flex items-center justify-between border-b border-amber-200/60 pb-3">
          <h2 className="text-xl md:text-2xl font-extrabold text-indigo-950 flex items-center gap-2">
            <span>{cerita.ikon}</span> {cerita.judul}
          </h2>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
            Klik kalimat untuk mendengar
          </span>
        </div>

        <div className={`relative z-20 space-y-3 font-bold tracking-wide ${kelasUkuranFont}`}>
          {cerita.kalimat.map((barisKata, idxKalimat) => {
            const sedangAktif = kalimatDibaca === idxKalimat;

            return (
              <p
                key={idxKalimat}
                onClick={() => bacakanSatuKalimat(idxKalimat)}
                title="Klik untuk mendengarkan kalimat ini"
                className={`px-3 py-1.5 rounded-2xl transition cursor-pointer ${
                  sedangAktif
                    ? 'bg-teal-100/90 ring-2 ring-teal-500'
                    : 'hover:bg-amber-100/50'
                }`}
              >
                {barisKata.map((sukuList, idxKata) => (
                  <span key={idxKata} className="inline-block mr-3">
                    {sukuList.map((suku, idxSuku) => {
                      if (!modeSukuKata) {
                        return (
                          <span key={idxSuku} className="text-indigo-950">
                            {suku}
                          </span>
                        );
                      }
                      const warnaSuku =
                        idxSuku % 2 === 0 ? 'text-indigo-950' : 'text-teal-700';
                      return (
                        <span key={idxSuku} className={warnaSuku}>
                          {suku}
                        </span>
                      );
                    })}
                  </span>
                ))}
              </p>
            );
          })}
        </div>
      </div>

      {/* MINI KUIS PEMAHAMAN BACAAN */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-indigo-950">
              🧩 Cek Pemahaman Bacaan
            </h3>
            <p className="text-xs text-slate-500">
              Jawab dua pertanyaan singkat di bawah setelah selesai membaca cerita.
            </p>
          </div>
          {Object.keys(jawabanKuis).length === cerita.kuis.length && (
            <span className="bg-emerald-100 text-emerald-900 text-xs font-extrabold px-3.5 py-1.5 rounded-full">
              ⭐ Skor Pemahaman: {jumlahKuisBenar}/{cerita.kuis.length}
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {cerita.kuis.map((soal, idxSoal) => {
            const pilihanUser = jawabanKuis[idxSoal];

            return (
              <div
                key={idxSoal}
                className="bg-sky-50/60 border border-sky-100 rounded-2xl p-5 space-y-3"
              >
                <p className="text-sm font-extrabold text-indigo-950">
                  {idxSoal + 1}. {soal.tanya}
                </p>
                <div className="space-y-2">
                  {soal.opsi.map((opsi) => {
                    const terpilih = pilihanUser === opsi;
                    const benar = opsi === soal.jawabanBenar;

                    let gayaTombol =
                      'bg-white border-slate-200 text-slate-700 hover:border-teal-400';
                    if (terpilih && benar) {
                      gayaTombol =
                        'bg-emerald-600 border-emerald-600 text-white shadow-xs';
                    } else if (terpilih && !benar) {
                      gayaTombol = 'bg-rose-100 border-rose-400 text-rose-900';
                    }

                    return (
                      <button
                        key={opsi}
                        type="button"
                        onClick={() =>
                          setJawabanKuis((prev) => ({ ...prev, [idxSoal]: opsi }))
                        }
                        className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-between ${gayaTombol}`}
                      >
                        <span>{opsi}</span>
                        {terpilih && <span>{benar ? '✅ Benar!' : '🔄 Coba lagi'}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}