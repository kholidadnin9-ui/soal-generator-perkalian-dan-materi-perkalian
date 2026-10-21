import React, { useMemo, useState } from 'react';
import { Printer, Shuffle, Eye, EyeOff, School, CheckCircle2 } from 'lucide-react';
import { generatePackages, PackageMode } from '../data/packageGenerator';
import { playPop } from '../utils/audio';
import { WorksheetPaper } from './WorksheetPaper';

interface PrintGeneratorZoneProps {
  soundEnabled: boolean;
}

export const PrintGeneratorZone: React.FC<PrintGeneratorZoneProps> = ({ soundEnabled }) => {
  const [mode, setMode] = useState<PackageMode>('campuran');
  const [activePackage, setActivePackage] = useState(1);
  const [maxFactor, setMaxFactor] = useState<5 | 10>(10);
  const [seed, setSeed] = useState(20240);
  const [viewMode, setViewMode] = useState<'one' | 'all'>('one');
  const [showKey, setShowKey] = useState(true);
  const [includeKeyInPrint, setIncludeKeyInPrint] = useState(false);
  const [schoolName, setSchoolName] = useState('SDN SKADRON PERKALIAN');
  const [teacherName, setTeacherName] = useState('Widodo, S.Pd.');

  const packages = useMemo(() => generatePackages(maxFactor, seed, mode), [maxFactor, seed, mode]);
  const current = packages[activePackage - 1];

  const handlePrint = () => {
    playPop(soundEnabled);
    window.print();
  };

  const handleShuffle = () => {
    playPop(soundEnabled);
    setSeed((s) => s + 17);
  };

  return (
    <div className="print-generator space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="no-print bg-gradient-to-r from-teal-600 via-cyan-700 to-blue-800 rounded-3xl p-6 text-white shadow-xl border-4 border-amber-300 relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-white text-teal-800 font-black text-xs sm:text-sm px-3.5 py-1 rounded-full shadow">
            <span>🖨️</span> Tab Guru: Generator & Cetak Paket Soal
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-200 drop-shadow">
            Generator 5 Paket Soal Perkalian Siap Print
          </h2>
          <p className="text-xs sm:text-base text-teal-50 font-semibold leading-relaxed">
            Setiap paket berisi <strong className="text-amber-300">15 soal</strong> (10 pilihan ganda a/b/c + 5 isian
            singkat). Pilih jenis soal <strong className="text-amber-300">Campuran</strong> atau{' '}
            <strong className="text-amber-300">Konsep Dasar</strong> (dengan ilustrasi buah, sayur & perlengkapan
            sekolah), lalu cetak!
          </p>
        </div>
      </div>

      {/* Kontrol Guru */}
      <div className="no-print bg-white rounded-3xl p-5 shadow-md border-4 border-teal-300 space-y-4">
        <div className="flex items-center gap-2">
          <School className="w-5 h-5 text-teal-700" />
          <h3 className="font-black text-slate-900 text-base">Panel Kontrol Guru</h3>
        </div>

        {/* Jenis soal */}
        <div>
          <p className="text-xs font-black uppercase text-slate-500 mb-2">1️⃣ Pilih jenis soal:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                playPop(soundEnabled);
                setMode('campuran');
              }}
              className={`text-left p-3.5 rounded-2xl border-2 transition-all ${
                mode === 'campuran'
                  ? 'bg-teal-600 text-white border-teal-700 shadow-md'
                  : 'bg-teal-50 text-teal-900 border-teal-200 hover:bg-teal-100'
              }`}
            >
              <p className="font-black text-sm">📘 Soal Campuran</p>
              <p className={`text-[11px] font-semibold mt-0.5 ${mode === 'campuran' ? 'text-teal-50' : 'text-teal-700'}`}>
                Perkalian langsung, resep dokter, penjumlahan berulang, soal cerita & 2 soal bergambar.
              </p>
            </button>
            <button
              onClick={() => {
                playPop(soundEnabled);
                setMode('konsep');
              }}
              className={`text-left p-3.5 rounded-2xl border-2 transition-all ${
                mode === 'konsep'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <p className="font-black text-sm">🍎 Khusus Konsep Dasar Perkalian</p>
              <p className={`text-[11px] font-semibold mt-0.5 ${mode === 'konsep' ? 'text-emerald-50' : 'text-emerald-700'}`}>
                Fokus penjumlahan berulang (3 × 1 = 1 + 1 + 1), 7 soal berilustrasi gambar buah 🍌, sayur 🥕 &
                perlengkapan sekolah ✏️.
              </p>
            </button>
          </div>
        </div>

        {/* Pilih paket */}
        <div>
          <p className="text-xs font-black uppercase text-slate-500 mb-2">2️⃣ Pilih paket soal (5 paket berbeda):</p>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => {
                  playPop(soundEnabled);
                  setActivePackage(n);
                  setViewMode('one');
                }}
                className={`py-2.5 rounded-2xl font-black text-sm border-2 transition-all ${
                  activePackage === n && viewMode === 'one'
                    ? 'bg-teal-600 text-white border-teal-700 shadow-md scale-105'
                    : 'bg-teal-50 text-teal-900 border-teal-200 hover:bg-teal-100'
                }`}
              >
                Paket {n}
              </button>
            ))}
          </div>
        </div>

        {/* Batas perkalian + mode tampil */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-2xl p-3 border-2 border-slate-200">
            <p className="text-xs font-black uppercase text-slate-500 mb-2">3️⃣ Batas perkalian:</p>
            <div className="flex gap-2">
              {([5, 10] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    playPop(soundEnabled);
                    setMaxFactor(m);
                  }}
                  className={`flex-1 py-2 rounded-xl font-black text-sm border-2 transition-all ${
                    maxFactor === m
                      ? 'bg-amber-400 text-amber-950 border-amber-500 shadow'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Sampai {m} (1–{m})
                </button>
              ))}
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 border-2 border-slate-200">
            <p className="text-xs font-black uppercase text-slate-500 mb-2">4️⃣ Tampilan & cetak:</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  playPop(soundEnabled);
                  setViewMode('one');
                }}
                className={`flex-1 py-2 rounded-xl font-black text-xs border-2 transition-all ${
                  viewMode === 'one'
                    ? 'bg-sky-600 text-white border-sky-700 shadow'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                1 Paket Saja
              </button>
              <button
                onClick={() => {
                  playPop(soundEnabled);
                  setViewMode('all');
                }}
                className={`flex-1 py-2 rounded-xl font-black text-xs border-2 transition-all ${
                  viewMode === 'all'
                    ? 'bg-sky-600 text-white border-sky-700 shadow'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Semua (5 Paket)
              </button>
            </div>
          </div>
        </div>

        {/* Kop sekolah */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-black uppercase text-slate-500">Nama sekolah (kop soal):</span>
            <input
              value={schoolName}
              maxLength={80}
              onChange={(e) => setSchoolName(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-bold text-sm text-slate-800 focus:outline-none focus:border-teal-500"
            />
          </label>
          <label className="block">
            <span className="text-xs font-black uppercase text-slate-500">Nama guru (tanda tangan):</span>
            <input
              value={teacherName}
              maxLength={60}
              onChange={(e) => setTeacherName(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-bold text-sm text-slate-800 focus:outline-none focus:border-teal-500"
            />
          </label>
        </div>

        {/* Opsi kunci + aksi */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between bg-amber-50 rounded-2xl p-3 border-2 border-amber-200">
          <div className="flex flex-wrap items-center gap-2">
            <button
              aria-pressed={showKey}
              onClick={() => {
                playPop(soundEnabled);
                setShowKey((v) => !v);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-xs border-2 transition-all ${
                showKey ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              {showKey ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showKey ? 'Kunci Jawaban: Tampil' : 'Kunci Jawaban: Sembunyi'}
            </button>
            <button
              aria-pressed={includeKeyInPrint}
              onClick={() => {
                playPop(soundEnabled);
                setIncludeKeyInPrint((v) => !v);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-xs border-2 transition-all ${
                includeKeyInPrint ? 'bg-purple-600 text-white border-purple-700' : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {includeKeyInPrint ? 'Kunci Ikut Tercetak' : 'Kunci Tidak Tercetak'}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleShuffle}
              className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 font-black text-xs px-4 py-2.5 rounded-xl border-2 border-slate-300 transition-all"
            >
              <Shuffle className="w-4 h-4" /> Acak Soal Baru
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs px-5 py-2.5 rounded-xl border-2 border-teal-700 shadow transition-all"
            >
              <Printer className="w-4 h-4" />
              {viewMode === 'one' ? `Print Paket ${activePackage}` : 'Print 5 Paket'}
            </button>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 font-semibold">
          Setiap paket terdiri dari 2 halaman A4: halaman 1 pilihan ganda, halaman 2 isian dan penutup.
          Saat mencetak, pilih A4 potret, skala 100%, margin 10 mm, dan matikan header/footer peramban.
          Kunci jawaban hanya ikut dicetak jika diaktifkan.
        </p>
      </div>

      {/* Pratinjau kertas soal (= area cetak) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
        <h3 className="font-bold">Pratinjau lembar soal</h3>
        <p>{viewMode === 'one' ? '1 paket - 2 halaman A4' : '5 paket - 10 halaman A4'}</p>
      </div>
      <div id="paket-print-area">
        {(viewMode === 'one' ? [current] : packages).map((pkg) => (
          <WorksheetPaper
            key={pkg.packageNo}
            pkg={pkg}
            schoolName={schoolName || 'SDN SKADRON PERKALIAN'}
            teacherName={teacherName || '........................'}
            maxFactor={maxFactor}
            showKey={showKey}
            includeKeyInPrint={includeKeyInPrint}
          />
        ))}
      </div>
    </div>
  );
};
