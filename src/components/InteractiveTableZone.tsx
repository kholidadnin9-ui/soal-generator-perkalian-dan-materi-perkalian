import React, { useState } from 'react';
import { Volume2, Sparkles, Eye, EyeOff } from 'lucide-react';
import { MULTIPLICATION_ITEMS } from '../data/learningData';
import { playCorrect, playPop, speakIndonesian } from '../utils/audio';

interface InteractiveTableZoneProps {
  soundEnabled: boolean;
  voiceEnabled: boolean;
  onAddStar: (count: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const InteractiveTableZone: React.FC<InteractiveTableZoneProps> = ({
  soundEnabled,
  voiceEnabled,
  onAddStar,
  onUnlockBadge,
}) => {
  const [selectedNum, setSelectedNum] = useState(2);
  const [hideAnswers, setHideAnswers] = useState(false);
  const [revealedRows, setRevealedRows] = useState<Record<number, boolean>>({});
  const [exploredCount, setExploredCount] = useState(1);

  const currentItem = MULTIPLICATION_ITEMS.find((f: (typeof MULTIPLICATION_ITEMS)[number]) => f.num === selectedNum) || MULTIPLICATION_ITEMS[1];

  const handleSelectNumber = (num: number) => {
    playPop(soundEnabled);
    setSelectedNum(num);
    setRevealedRows({});
    const newCount = exploredCount + 1;
    setExploredCount(newCount);
    if (newCount >= 4) {
      onAddStar(3);
      onUnlockBadge('table_master');
    }
  };

  const handleRowClick = (multiplier: number) => {
    playCorrect(soundEnabled);
    if (hideAnswers) {
      setRevealedRows((prev) => ({ ...prev, [multiplier]: true }));
    }

    const total = multiplier * selectedNum;
    const repeated = Array(multiplier).fill(selectedNum).join(' ditambah ');
    const speechText = `${multiplier} dikali ${selectedNum} sama dengan ${repeated} sama dengan ${total}!`;
    speakIndonesian(speechText, voiceEnabled);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-700 via-sky-700 to-blue-800 rounded-3xl p-6 text-white shadow-xl border-4 border-amber-300 relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3.5 py-1 rounded-full shadow">
            <span>🛢️</span> Pos 3: Gudang Amunisi Perkalian 1–10
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-200 drop-shadow">
            Papan Perkalian Skuadron Bergambar
          </h2>
          <p className="text-xs sm:text-base text-sky-100 font-semibold leading-relaxed">
            Pilih angka perkalian yang ingin kamu kuasai. Lihat bagaimana amunisi skuadron dijumlahkan berulang kali sampai menghasilkan jumlah yang besar!
          </p>
        </div>
      </div>

      {/* Number Selector Bar (1 - 10) */}
      <div className="bg-white rounded-3xl p-5 shadow-md border-4 border-sky-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-black text-gray-900 text-base sm:text-lg flex items-center gap-2">
              <span>🎯</span> Pilih Perkalian Angka (1 sampai 10):
            </h3>
            <p className="text-xs text-gray-500 font-bold">
              Klik angka di bawah untuk membuka barisan amunisi skuadron
            </p>
          </div>

          {/* Flashcard Peek Toggle */}
          <button
            onClick={() => {
              playPop(soundEnabled);
              setHideAnswers(!hideAnswers);
              setRevealedRows({});
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all shadow-sm ${
              hideAnswers
                ? 'bg-amber-400 text-amber-950 border-amber-500 ring-2 ring-amber-300'
                : 'bg-sky-50 text-sky-900 border-sky-300 hover:bg-sky-100'
            }`}
          >
            {hideAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{hideAnswers ? 'Mode Tebak: Jawaban Ditutup' : 'Tutup Jawaban (Tebak Sendiri)'}</span>
          </button>
        </div>

        {/* 10 Number Buttons */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {MULTIPLICATION_ITEMS.map((item) => {
            const isSelected = selectedNum === item.num;
            return (
              <button
                key={item.num}
                onClick={() => handleSelectNumber(item.num)}
                className={`py-3 rounded-2xl font-black text-center flex flex-col items-center justify-center transition-all border-2 ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-700 scale-105 shadow-md ring-2 ring-sky-300 -translate-y-1'
                    : 'bg-sky-50/70 text-sky-950 border-sky-200 hover:bg-sky-100 hover:scale-102'
                }`}
              >
                <span className="text-xl sm:text-2xl">{item.emoji}</span>
                <span className="text-base sm:text-lg font-black">{item.num}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Table Display */}
      <div className="bg-gradient-to-b from-white to-sky-50/50 rounded-3xl p-5 sm:p-6 shadow-md border-4 border-sky-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b-2 border-sky-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl bg-amber-100 p-2 rounded-2xl border border-amber-300">
              {currentItem.emoji}
            </span>
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                Tabel Perkalian {selectedNum} ({currentItem.label})
                <Sparkles className="w-5 h-5 text-amber-500" />
              </h3>
              <p className="text-xs text-gray-600 font-bold">
                Klik pada setiap baris untuk mendengar pengucapannya atau membuka jawabannya!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playPop(soundEnabled);
              const text = `Tabel perkalian ${selectedNum}. Klik baris mana saja untuk mendengar penjelasan!`;
              speakIndonesian(text, voiceEnabled);
            }}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-black bg-sky-700 hover:bg-sky-800 text-white px-3.5 py-2 rounded-xl shadow-sm transition-colors"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span>Suara Pengantar</span>
          </button>
        </div>

        {/* Rows List (1x to 10x) */}
        <div className="space-y-2.5">
          {Array.from({ length: 10 }).map((_, idx) => {
            const multiplier = idx + 1;
            const total = multiplier * selectedNum;
            const repeatedAddition = Array(multiplier).fill(selectedNum).join(' + ');
            const isRevealed = !hideAnswers || revealedRows[multiplier];

            return (
              <div
                key={multiplier}
                onClick={() => handleRowClick(multiplier)}
                className={`p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-4 group ${
                  isRevealed
                    ? 'bg-white hover:bg-amber-50 border-sky-200 hover:border-amber-400 shadow-sm'
                    : 'bg-sky-50/50 hover:bg-amber-100/50 border-dashed border-sky-300'
                }`}
              >
                {/* Multiplication Equation */}
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-900 font-black text-sm flex items-center justify-center group-hover:bg-amber-300 group-hover:text-amber-950 transition-colors">
                    {multiplier}
                  </span>
                  <span className="text-lg sm:text-xl font-black text-gray-800">
                    {multiplier} x {selectedNum}
                  </span>
                  <span className="text-gray-400 font-bold">=</span>
                </div>

                {/* Repeated Addition representation */}
                <div className="flex-1 overflow-x-auto py-1 text-xs sm:text-sm font-extrabold text-gray-700 flex items-center gap-1">
                  <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 whitespace-nowrap">
                    {repeatedAddition}
                  </span>
                  {/* Emoji item visualization for smaller multipliers */}
                  {multiplier <= 5 && (
                    <span className="hidden lg:inline-block text-base ml-2">
                      {Array.from({ length: multiplier }).map((_, fIdx) => (
                        <span key={fIdx} className="mr-1">
                          [{currentItem.emoji.repeat(selectedNum)}]
                        </span>
                      ))}
                    </span>
                  )}
                </div>

                {/* Answer or Mystery Peek Card */}
                <div className="flex items-center justify-between md:justify-end gap-2">
                  {isRevealed ? (
                    <div className="bg-sky-700 text-white font-black text-base sm:text-lg px-4 py-1.5 rounded-xl shadow-inner min-w-[70px] text-center">
                      = {total}
                    </div>
                  ) : (
                    <button className="bg-amber-400 text-amber-950 font-black text-xs px-3.5 py-2 rounded-xl shadow border border-amber-500 animate-pulse flex items-center gap-1">
                      <span>❓ Klik Buka Jawaban</span>
                    </button>
                  )}

                  <button
                    title="Dengarkan Baris Ini"
                    className="p-2 text-sky-700 hover:text-sky-900 hover:bg-sky-100 rounded-xl transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Helpful Tip */}
        <div className="mt-5 p-3.5 bg-amber-100 rounded-2xl border-2 border-amber-300 flex items-center justify-between gap-3 text-xs sm:text-sm text-amber-950 font-bold">
          <div className="flex items-center gap-2">
            <span>💡</span>
            <span>
              <strong>Tips Pilot:</strong> Lihat polanya! Setiap turun 1 baris, hasilnya selalu bertambah{' '}
              <strong className="text-rose-600 underline">+{selectedNum}</strong>!
            </span>
          </div>
          <button
            onClick={() => handleSelectNumber(selectedNum === 10 ? 1 : selectedNum + 1)}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs px-3 py-1.5 rounded-xl border border-amber-500 whitespace-nowrap"
          >
            Lanjut ke Tabel {selectedNum === 10 ? 1 : selectedNum + 1} ➡️
          </button>
        </div>
      </div>
    </div>
  );
};
