import React, { useState } from 'react';
import { Volume2, Sparkles, AlertTriangle, Check, Plus, Minus } from 'lucide-react';
import { DOCTOR_EXAMPLES } from '../data/learningData';
import { playCorrect, playPillDrop, playPop, speakIndonesian } from '../utils/audio';

interface MedicineCupVisualProps {
  cupNumber: number;
  itemCount: number;
}

// A recognizable handled cup icon helps children connect each group to one medicine cup.
const MedicineCupVisual: React.FC<MedicineCupVisualProps> = ({ cupNumber, itemCount }) => (
  <div className="flex flex-col items-center">
    <span className="mb-1 text-[10px] font-black uppercase text-teal-800">
      Cangkir {cupNumber}
    </span>
    <div className="relative h-24 w-28" aria-label={`Cangkir obat ${cupNumber} berisi ${itemCount} pil`}>
      <svg
        viewBox="0 0 120 96"
        className="absolute inset-0 h-full w-full drop-shadow-md"
        role="img"
        aria-hidden="true"
      >
        <path
          d="M88 35h10c12 0 17 8 17 17s-6 18-20 18h-9"
          fill="none"
          stroke="#0f766e"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M14 24h76l-7 56c-.7 6-5.8 10-12 10H33c-6.2 0-11.3-4-12-10l-7-56Z"
          fill="#ccfbf1"
          stroke="#0f766e"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <ellipse cx="52" cy="24" rx="38" ry="9" fill="#f0fdfa" stroke="#0f766e" strokeWidth="5" />
        <path d="M22 52h10M20 65h12" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" />
        <text x="52" y="78" textAnchor="middle" fill="#115e59" fontSize="10" fontWeight="800">
          OBAT
        </text>
      </svg>
      <div className="absolute left-1/2 top-7 flex w-14 -translate-x-1/2 flex-wrap items-center justify-center gap-0.5">
        {Array.from({ length: itemCount }).map((_, pillIdx) => (
          <span
            key={pillIdx}
            className="text-base leading-none animate-gentle-bounce"
            style={{ animationDelay: `${pillIdx * 0.15}s` }}
          >
            💊
          </span>
        ))}
      </div>
    </div>
    <span className="-mt-1 rounded-full border border-teal-200 bg-white px-2 py-0.5 text-xs font-black text-teal-900">
      {itemCount} butir
    </span>
  </div>
);

interface DoctorPrescriptionZoneProps {
  soundEnabled: boolean;
  voiceEnabled: boolean;
  onAddStar: (count: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const DoctorPrescriptionZone: React.FC<DoctorPrescriptionZoneProps> = ({
  soundEnabled,
  voiceEnabled,
  onAddStar,
  onUnlockBadge,
}) => {
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);

  // Interactive Pharmacy Lab State
  const [labGroups, setLabGroups] = useState(3); // A (berapa kali minum / wadah)
  const [labItems, setLabItems] = useState(1); // B (isi tiap wadah / butir obat)
  const [hasInteractedLab, setHasInteractedLab] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const currentExample = DOCTOR_EXAMPLES[selectedExampleIndex];

  const handleReadCurrentExample = () => {
    const text = `${currentExample.title}. Aturan minum: ${currentExample.rule}. ${currentExample.meaning}. Penjumlahan berulang: ${currentExample.calculation}. ${currentExample.warning}`;
    speakIndonesian(text, voiceEnabled);
  };

  const handleReadLab = () => {
    const total = labGroups * labItems;
    const repeated = Array(labGroups).fill(labItems).join(' + ');
    const text = `Resep obat: ${labGroups} kali ${labItems}. Bentuk penjumlahan berulang: ${repeated} sama dengan ${total}. Artinya angka ${labItems} diulang sebanyak ${labGroups} kali!`;
    speakIndonesian(text, voiceEnabled);
  };

  const handleUpdateLab = (newGroups: number, newItems: number) => {
    playPillDrop(soundEnabled);
    setLabGroups(newGroups);
    setLabItems(newItems);
    if (!hasInteractedLab) {
      setHasInteractedLab(true);
      onAddStar(2);
      onUnlockBadge('doctor');
    }
  };

  // Lab calculation
  const labTotal = labGroups * labItems;
  const labRepeatedText = Array(labGroups).fill(labItems).join(' + ') + ` = ${labTotal}`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Zone Header Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-3xl p-6 text-white shadow-xl border-4 border-amber-300 relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-white text-rose-800 font-black text-xs sm:text-sm px-3.5 py-1 rounded-full shadow">
            <span>🩺</span> Pos 1: Konsep Dasar Perkalian Kelas 2 SD
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-100 drop-shadow">
            Rahasia Resep Dokter: Penjumlahan Berulang!
          </h2>
          <p className="text-xs sm:text-base text-rose-50 font-semibold leading-relaxed">
            Pernahkah kamu melihat etiket obat dokter yang bertuliskan <strong className="underline decoration-white">3 x 1 sehari</strong>? Itu adalah rumus perkalian yang kita pakai setiap hari!
          </p>
        </div>
      </div>

      {/* Main Analogy Explanation Card */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-4 border-rose-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-4 border-rose-400 shadow-xl bg-rose-50 relative group">
              <img
                src="/images/pilot_medic.jpg"
                alt="Dok Sky Pilot Medis Menjelaskan Resep Perkalian"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute top-2 left-2 bg-amber-400 text-amber-950 font-black text-[11px] px-2.5 py-1 rounded-full shadow">
                Dok Sky Pilot Medis ✈️
              </div>
            </div>
            <p className="text-xs text-gray-500 font-bold mt-2 text-center">
              &ldquo;Jangan sampai keliru minum obat ya, pilot-pilot cilik!&rdquo;
            </p>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {/* Example selector tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {DOCTOR_EXAMPLES.map((ex, idx) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    playPop(soundEnabled);
                    setSelectedExampleIndex(idx);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all whitespace-nowrap border-2 ${
                    selectedExampleIndex === idx
                      ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                      : 'bg-white text-rose-900 border-rose-200 hover:bg-rose-50'
                  }`}
                >
                  {ex.id === 1 ? '💊 Resep Utama (3x1)' : ex.id === 2 ? '🥄 Sirup Kru (2x3)' : '💧 Tetes Mata (4x2)'}
                </button>
              ))}
            </div>

            <div className="bg-rose-50 rounded-2xl p-4 border-2 border-rose-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-xs uppercase tracking-wider text-rose-900 bg-rose-200 px-2.5 py-0.5 rounded-full">
                  {currentExample.title}
                </span>
                <button
                  onClick={handleReadCurrentExample}
                  className="flex items-center gap-1.5 text-xs font-black text-rose-800 bg-white px-3 py-1.5 rounded-xl border border-rose-300 shadow-sm hover:bg-rose-100 transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>Dengarkan Dokter</span>
                </button>
              </div>

              <div className="text-center my-3 bg-white rounded-2xl p-3 border-2 border-dashed border-rose-300 shadow-inner">
                <span className="text-xs font-extrabold text-gray-500 block">Aturan Minum Obat:</span>
                <div className="text-3xl sm:text-4xl font-black text-rose-600 tracking-wide my-1">
                  {currentExample.rule}
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-600">
                  = {currentExample.calculation}
                </div>
              </div>

              <div className="bg-amber-100 rounded-xl p-3 border border-amber-300 text-amber-950 text-xs sm:text-sm font-bold flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Makna Emas:</strong> {currentExample.meaning}
                </div>
              </div>
            </div>

            {/* Time schedule visualization */}
            <div className={`grid gap-2 text-center ${currentExample.times.length === 2 ? 'grid-cols-2' : currentExample.times.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
              {currentExample.times.map((t, idx) => (
                <div key={idx} className="bg-amber-50 rounded-2xl p-3 border-2 border-amber-200">
                  <div className="font-extrabold text-xs text-amber-950">{t.time}</div>
                  <div className="text-xl sm:text-2xl my-1 animate-gentle-bounce">
                    {Array.from({ length: t.pills }).map((_, pIdx) => (
                      <span key={pIdx}>{currentExample.itemEmoji}</span>
                    ))}
                  </div>
                  <div className="text-xs font-black text-rose-600">+{t.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Warning: Awas Tertukar! 3 x 1 vs 1 x 3 */}
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 sm:p-5 border-2 border-amber-300">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 animate-bounce" />
            <h3 className="font-black text-base sm:text-lg text-amber-950">
              Awas Tertukar! Mengapa 3 x 1 Berbeda dengan 1 x 3?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 border-2 border-emerald-400 shadow-sm relative">
              <div className="absolute top-2 right-2 bg-emerald-100 text-emerald-800 text-xs font-black px-2 py-0.5 rounded-full">
                Benar & Aman! 👍
              </div>
              <h4 className="font-black text-emerald-900 text-lg mb-1">3 x 1</h4>
              <p className="text-xs text-gray-700 font-bold mb-2">
                = 1 + 1 + 1 = 3 tablet
              </p>
              <div className="flex gap-2 items-center justify-center py-2 bg-emerald-50 rounded-xl">
                <span className="text-xl">💊</span>
                <span className="text-xs font-black text-emerald-700">pagi</span>
                <span>+</span>
                <span className="text-xl">💊</span>
                <span className="text-xs font-black text-emerald-700">siang</span>
                <span>+</span>
                <span className="text-xl">💊</span>
                <span className="text-xs font-black text-emerald-700">malam</span>
              </div>
              <p className="text-[11px] text-emerald-800 font-semibold mt-2">
                Diminum 3 kali sehari, masing-masing 1 butir. Obat bekerja teratur dan perut sehat!
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-rose-400 shadow-sm relative">
              <div className="absolute top-2 right-2 bg-rose-100 text-rose-800 text-xs font-black px-2 py-0.5 rounded-full">
                Awas Bahaya! 😵
              </div>
              <h4 className="font-black text-rose-900 text-lg mb-1">1 x 3</h4>
              <p className="text-xs text-gray-700 font-bold mb-2">
                = 3 (hanya 1 kali pengulangan)
              </p>
              <div className="flex gap-1.5 items-center justify-center py-2 bg-rose-50 rounded-xl">
                <span className="text-xl">💊💊💊</span>
                <span className="text-xs font-black text-rose-700">(3 butir sekaligus!)</span>
              </div>
              <p className="text-[11px] text-rose-800 font-semibold mt-2">
                Diminum 1 kali, tapi langsung menelan 3 butir sekaligus! Perut bisa kembung dan mual!
              </p>
            </div>
          </div>

          <div className="mt-3 text-center bg-white/80 rounded-xl p-2.5 border border-amber-200">
            <span className="text-xs sm:text-sm font-black text-amber-950">
              📌 Kesimpulan Emas: Meskipun hasil akhirnya sama-sama 3, arti dan prosesnya SANGAT BERBEDA!
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Pharmacy Lab (Apotek Rimba Dokter Gani) */}
      <div className="bg-gradient-to-b from-teal-50 to-emerald-50 rounded-3xl p-6 shadow-md border-4 border-teal-400">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-500 text-white rounded-2xl text-2xl shadow">
              ⚗️
            </div>
            <div>
            <h3 className="text-xl font-black text-teal-950">
              Gudang Medis Skuadron: Simulator Resep Interaktif
            </h3>
              <p className="text-xs text-teal-800 font-semibold">
                Ubah jumlah cangkir (berapa kali) dan isi pil untuk melihat penjumlahan berulangnya!
              </p>
            </div>
          </div>
          <button
            onClick={handleReadLab}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-black bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-2 rounded-xl shadow transition-colors"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span>Bacakan Resep Ini</span>
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Group Control (A) */}
          <div className="bg-white rounded-2xl p-4 border-2 border-teal-300 shadow-sm">
            <label className="text-xs font-extrabold uppercase text-gray-500 block mb-1">
              Berapa Kali Minum / Jumlah Cangkir (Angka Pertama):
            </label>
            <div className="flex items-center justify-between gap-3 mt-2">
              <button
                onClick={() => handleUpdateLab(Math.max(1, labGroups - 1), labItems)}
                className="w-10 h-10 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-900 font-black flex items-center justify-center transition-transform active:scale-90"
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="text-center">
                <span className="text-3xl font-black text-teal-700">{labGroups}</span>
                <span className="text-xs block font-bold text-gray-500">kali / wadah</span>
              </div>
              <button
                onClick={() => handleUpdateLab(Math.min(10, labGroups + 1), labItems)}
                className="w-10 h-10 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-black flex items-center justify-center transition-transform active:scale-90"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Items Control (B) */}
          <div className="bg-white rounded-2xl p-4 border-2 border-amber-300 shadow-sm">
            <label className="text-xs font-extrabold uppercase text-gray-500 block mb-1">
              Isi Tiap Kali Minum / Tiap Cangkir (Angka Kedua):
            </label>
            <div className="flex items-center justify-between gap-3 mt-2">
              <button
                onClick={() => handleUpdateLab(labGroups, Math.max(1, labItems - 1))}
                className="w-10 h-10 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black flex items-center justify-center transition-transform active:scale-90"
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="text-center">
                <span className="text-3xl font-black text-amber-600">{labItems}</span>
                <span className="text-xs block font-bold text-gray-500">butir / isi</span>
              </div>
              <button
                onClick={() => handleUpdateLab(labGroups, Math.min(5, labItems + 1))}
                className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black flex items-center justify-center transition-transform active:scale-90"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Prescription Formula Card Display */}
        <div className="bg-white rounded-3xl p-5 border-4 border-teal-300 text-center shadow-lg space-y-3">
          <div className="inline-block bg-teal-100 text-teal-900 font-black text-xs px-3 py-1 rounded-full">
            📋 Resep Obat Gudang Medis Skuadron
          </div>

          <div className="text-3xl sm:text-5xl font-black text-teal-800 tracking-wide">
            {labGroups} x {labItems} = {labTotal}
          </div>

          <div className="bg-teal-50 rounded-2xl p-3 border-2 border-dashed border-teal-300 max-w-xl mx-auto">
            <span className="text-xs font-extrabold text-gray-500 block mb-1">
              Bentuk Penjumlahan Berulang:
            </span>
            <div className="text-xl sm:text-2xl font-black text-rose-600">
              {labRepeatedText}
            </div>
            <p className="text-xs sm:text-sm font-extrabold text-teal-900 mt-2">
              Artinya: <span className="underline decoration-teal-500 font-black">angka {labItems}</span> yang diulang sebanyak <span className="underline decoration-teal-500 font-black">{labGroups} kali</span>!
            </p>
          </div>

          {/* Visual medicine cups with a clear handled-cup illustration */}
          <div className="pt-2">
            <span className="text-xs font-extrabold text-gray-500 block mb-2">
              Visual Cangkir Obat ({labGroups} cangkir, masing-masing {labItems} pil):
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {Array.from({ length: labGroups }).map((_, cIdx) => (
                <div
                  key={cIdx}
                  className="rounded-2xl border-2 border-teal-200 bg-gradient-to-b from-white to-teal-50 px-2 py-3 shadow-sm transition-transform hover:scale-105"
                >
                  <MedicineCupVisual cupNumber={cIdx + 1} itemCount={labItems} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Check Mini-Challenge */}
      <div className="bg-amber-100/90 rounded-3xl p-5 border-4 border-amber-400">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">⭐</div>
          <div>
            <h3 className="font-black text-amber-950 text-base sm:text-lg">
              Kuis Cepat Resep Dokter: Coba Tebak!
            </h3>
            <p className="text-xs text-amber-800 font-semibold">
              Berapa bentuk penjumlahan berulang dari perkalian <strong>4 x 1</strong>?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 1, text: '1 + 1 + 1 + 1 = 4', isCorrect: true },
            { id: 2, text: '4 + 1 = 5', isCorrect: false },
            { id: 3, text: '4 + 4 + 4 + 4 = 16', isCorrect: false },
          ].map((opt) => {
            const isSelected = quizAnswer === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setQuizAnswer(opt.id);
                  if (opt.isCorrect) {
                    playCorrect(soundEnabled);
                    onAddStar(3);
                    speakIndonesian('Hebat sekali! 4 x 1 artinya angka 1 diulang sebanyak 4 kali!', voiceEnabled);
                  } else {
                    playPop(soundEnabled);
                  }
                }}
                className={`p-3 rounded-2xl font-black text-sm border-2 text-center transition-all ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105'
                      : 'bg-rose-400 text-white border-rose-500'
                    : 'bg-white text-gray-800 border-amber-300 hover:bg-amber-50'
                }`}
              >
                {opt.text}
              </button>
            );
          })}
        </div>

        {quizAnswer !== null && (
          <div className="mt-3 p-3 bg-white rounded-2xl border-2 border-amber-300 text-xs sm:text-sm font-bold flex items-center justify-between">
            {quizAnswer === 1 ? (
              <span className="text-emerald-700 flex items-center gap-1.5 font-black">
                <Check className="w-5 h-5 text-emerald-600" />
                Luar biasa! Benar sekali! 4 x 1 = angka 1 yang diulang sebanyak 4 kali! Kamu dapat 3 Bintang! ⭐⭐⭐
              </span>
            ) : (
              <span className="text-rose-700 font-black">
                Wah, hampir tepat! Ingat ya: 4 x 1 artinya angka 1 yang diulang sebanyak 4 kali (1 + 1 + 1 + 1). Coba pilih lagi!
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
