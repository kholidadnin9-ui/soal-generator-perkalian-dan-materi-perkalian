import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { STORY_PROBLEMS } from '../data/learningData';
import { playCorrect, playPop, playWrong, speakIndonesian } from '../utils/audio';

interface StoryProblemsZoneProps {
  soundEnabled: boolean;
  voiceEnabled: boolean;
  onAddStar: (count: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const StoryProblemsZone: React.FC<StoryProblemsZoneProps> = ({
  soundEnabled,
  voiceEnabled,
  onAddStar,
  onUnlockBadge,
}) => {
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);

  // Solving states
  const [selectedGroups, setSelectedGroups] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number | null>(null);
  const [selectedRepeated, setSelectedRepeated] = useState<string | null>(null);
  const [selectedTotal, setSelectedTotal] = useState<number | null>(null);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [showExplanation, setShowExplanation] = useState(false);
  const [solvedIds, setSolvedIds] = useState<number[]>([]);

  const problem = STORY_PROBLEMS[currentProblemIdx];
  const expectedTotal = problem.groups * problem.itemsPerGroup;
  const expectedRepeated = Array(problem.groups).fill(problem.itemsPerGroup).join(' + ');

  const handleReadProblem = () => {
    const text = `Soal Cerita: ${problem.title}. ${problem.story}. Ayo pecahkan bersama!`;
    speakIndonesian(text, voiceEnabled);
  };

  const handleResetCurrent = () => {
    playPop(soundEnabled);
    setSelectedGroups(null);
    setSelectedItems(null);
    setSelectedRepeated(null);
    setSelectedTotal(null);
    setStep(1);
    setShowExplanation(false);
  };

  const handleNextProblem = () => {
    playPop(soundEnabled);
    handleResetCurrent();
    setCurrentProblemIdx((prev) => (prev + 1) % STORY_PROBLEMS.length);
  };

  const handlePrevProblem = () => {
    playPop(soundEnabled);
    handleResetCurrent();
    setCurrentProblemIdx((prev) => (prev - 1 + STORY_PROBLEMS.length) % STORY_PROBLEMS.length);
  };

  // Step 1: choosing groups
  const handleSelectGroups = (val: number) => {
    setSelectedGroups(val);
    if (val === problem.groups) {
      playCorrect(soundEnabled);
      setStep(2);
    } else {
      playWrong(soundEnabled);
    }
  };

  // Step 2: choosing items
  const handleSelectItems = (val: number) => {
    setSelectedItems(val);
    if (val === problem.itemsPerGroup) {
      playCorrect(soundEnabled);
      setStep(3);
    } else {
      playWrong(soundEnabled);
    }
  };

  // Step 3: choosing repeated addition
  const handleSelectRepeated = (str: string) => {
    setSelectedRepeated(str);
    if (str === expectedRepeated) {
      playCorrect(soundEnabled);
      setStep(4);
    } else {
      playWrong(soundEnabled);
    }
  };

  // Step 4: choosing total
  const handleSelectTotal = (val: number) => {
    setSelectedTotal(val);
    if (val === expectedTotal) {
      playCorrect(soundEnabled);
      setShowExplanation(true);
      if (!solvedIds.includes(problem.id)) {
        setSolvedIds((prev) => [...prev, problem.id]);
        onAddStar(3);
        if (solvedIds.length + 1 >= 3) {
          onUnlockBadge('story_solver');
        }
      }
      speakIndonesian(
        `Hebat sekali! Jadi ${problem.groups} kali ${problem.itemsPerGroup} sama dengan ${expectedTotal}!`,
        voiceEnabled
      );
    } else {
      playWrong(soundEnabled);
    }
  };

  // Generate shuffled options
  const groupOptions = Array.from(new Set([problem.groups, problem.groups + 1, Math.max(1, problem.groups - 1)])).sort();
  const itemOptions = Array.from(new Set([problem.itemsPerGroup, problem.itemsPerGroup + 1, Math.max(1, problem.itemsPerGroup - 1)])).sort();
  const repeatedOptions = [
    expectedRepeated,
    Array(problem.itemsPerGroup).fill(problem.groups).join(' + '),
    `${problem.groups} + ${problem.itemsPerGroup}`,
  ].filter((v, i, a) => a.indexOf(v) === i);
  const totalOptions = Array.from(new Set([expectedTotal, expectedTotal + 2, Math.max(1, expectedTotal - 3)])).sort((a, b) => a - b);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-6 text-white shadow-xl border-4 border-amber-300 relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-white text-orange-900 font-black text-xs sm:text-sm px-3.5 py-1 rounded-full shadow">
            <span>🛒</span> Pos 4: Misi Soal Cerita Sehari-hari
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-100 drop-shadow">
            Inspektur Misi Skuadron
          </h2>
          <p className="text-xs sm:text-base text-orange-50 font-semibold leading-relaxed">
            Siswa kelas 2 yang hebat bisa mengubah masalah sehari-hari menjadi kalimat perkalian! Ikuti 4 langkah mudah untuk memecahkan setiap misi.
          </p>
        </div>
      </div>

      {/* Problem Navigation & Selector */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-md border-4 border-orange-300 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{problem.character}</span>
          <div>
            <span className="text-xs font-black uppercase text-orange-600 block">
              Misi #{problem.id} dari {STORY_PROBLEMS.length}
            </span>
            <h3 className="font-black text-gray-900 text-sm sm:text-base">{problem.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={handlePrevProblem}
            className="p-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-950 font-bold transition-all border border-orange-300"
            title="Misi Sebelumnya"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-black bg-orange-50 text-orange-900 px-3 py-1.5 rounded-xl border border-orange-200">
            {solvedIds.includes(problem.id) ? '✅ Sudah Selesai' : '⏳ Belum Selesai'}
          </span>

          <button
            onClick={handleNextProblem}
            className="p-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-950 font-bold transition-all border border-orange-300"
            title="Misi Selanjutnya"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Story Problem Card */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-4 border-orange-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b-2 border-orange-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl p-2 bg-orange-100 rounded-2xl border border-orange-200">
              {problem.itemEmoji}
            </span>
            <div>
              <span className="text-xs font-bold text-gray-500">Konteks Kehidupan Nyata:</span>
              <p className="text-xs font-black text-orange-800">{problem.realWorldContext}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReadProblem}
              className="flex items-center gap-1.5 text-xs font-black bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-2 rounded-xl shadow-sm transition-colors"
            >
              <Volume2 className="w-4 h-4 text-amber-200 animate-pulse" />
              <span>Bacakan Cerita</span>
            </button>
            <button
              onClick={handleResetCurrent}
              title="Ulangi Misi Ini"
              className="p-2 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Story Text Box */}
        <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 border-2 border-amber-200 mb-6 text-sm sm:text-base text-gray-800 font-semibold leading-relaxed">
          &ldquo;{problem.story}&rdquo;
        </div>

        {/* Visual Container Representation */}
        <div className="mb-6 p-4 bg-orange-50/50 rounded-2xl border-2 border-dashed border-orange-300">
          <span className="text-xs font-extrabold text-orange-950 block mb-2 text-center">
            👀 Gambar Ilustrasi Benda ({problem.groups} {problem.containerName}, masing-masing {problem.itemsPerGroup} {problem.itemName}):
          </span>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {Array.from({ length: problem.groups }).map((_, gIdx) => (
              <div
                key={gIdx}
                className="bg-white rounded-2xl p-3 border-2 border-amber-300 shadow-sm text-center min-w-[90px] group hover:scale-105 transition-transform"
              >
                <span className="text-[10px] font-black uppercase text-amber-800 block">
                  {problem.containerName} {gIdx + 1}
                </span>
                <div className="text-2xl my-1 flex justify-center flex-wrap gap-1">
                  {Array.from({ length: problem.itemsPerGroup }).map((_, iIdx) => (
                    <span key={iIdx} className="animate-gentle-bounce">
                      {problem.itemEmoji}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] font-black text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                  {problem.itemsPerGroup} {problem.itemName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Interactive Guided Steps */}
        <div className="space-y-4">
          {/* Step 1: Identify Groups */}
          <div
            className={`p-4 rounded-2xl border-2 transition-all ${
              step >= 1 ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-amber-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 text-xs flex items-center justify-center">1</span>
                Langkah 1: Berapa banyak kelompok atau {problem.containerName}?
              </span>
              {selectedGroups === problem.groups && (
                <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Benar! Ada {problem.groups} {problem.containerName}
                </span>
              )}
            </div>

            {step === 1 && (
              <div className="flex gap-2">
                {groupOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectGroups(opt)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-amber-100 border-2 border-amber-300 font-black text-sm text-gray-800 transition-all active:scale-95 shadow-sm"
                  >
                    {opt} {problem.containerName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Identify Items per Group */}
          <div
            className={`p-4 rounded-2xl border-2 transition-all ${
              step >= 2 ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-amber-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 text-xs flex items-center justify-center">2</span>
                Langkah 2: Berapa isi di setiap {problem.containerName}?
              </span>
              {selectedItems === problem.itemsPerGroup && (
                <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Benar! Ada {problem.itemsPerGroup} {problem.itemName} tiap {problem.containerName}
                </span>
              )}
            </div>

            {step === 2 && (
              <div className="flex gap-2">
                {itemOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectItems(opt)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-amber-100 border-2 border-amber-300 font-black text-sm text-gray-800 transition-all active:scale-95 shadow-sm"
                  >
                    {opt} {problem.itemName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 3: Write Repeated Addition */}
          <div
            className={`p-4 rounded-2xl border-2 transition-all ${
              step >= 3 ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-amber-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 text-xs flex items-center justify-center">3</span>
                Langkah 3: Tulis bentuk penjumlahan berulang!
              </span>
              {selectedRepeated === expectedRepeated && (
                <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Benar! ({expectedRepeated})
                </span>
              )}
            </div>

            {step === 3 && (
              <div className="flex flex-col sm:flex-row gap-2">
                {repeatedOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectRepeated(opt)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-amber-100 border-2 border-amber-300 font-black text-sm text-gray-800 transition-all active:scale-95 shadow-sm"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 4: Write Multiplication & Find Total */}
          <div
            className={`p-4 rounded-2xl border-2 transition-all ${
              step >= 4 ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-amber-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 text-xs flex items-center justify-center">4</span>
                Langkah 4: Rumus perkalian {problem.groups} x {problem.itemsPerGroup} = Berapa?
              </span>
              {selectedTotal === expectedTotal && (
                <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Sempurna! = {expectedTotal} {problem.itemName}
                </span>
              )}
            </div>

            {step === 4 && (
              <div className="flex gap-2">
                {totalOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectTotal(opt)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-amber-100 border-2 border-amber-300 font-black text-sm text-gray-800 transition-all active:scale-95 shadow-sm"
                  >
                    {opt} {problem.itemName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Success Card / Explanation */}
        {showExplanation && (
          <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border-2 border-emerald-400 shadow-md animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <h4 className="font-black text-emerald-950 text-base sm:text-lg">
                Hore! Misi Berhasil Dipecahkan! 🎉
              </h4>
            </div>

            <div className="bg-white rounded-xl p-4 border border-emerald-200 text-xs sm:text-sm text-gray-800 font-semibold space-y-2">
              <p>
                <strong>Kalimat Matematika:</strong> {problem.groups} x {problem.itemsPerGroup} = {expectedTotal}
              </p>
              <p>
                <strong>Penjumlahan Berulang:</strong> {expectedRepeated} = {expectedTotal}
              </p>
              <p className="text-emerald-800 font-bold">
                <strong>Artinya:</strong> Ada {problem.groups} {problem.containerName}, masing-masing berisi {problem.itemsPerGroup} {problem.itemName}. Jadi total seluruhnya adalah <strong>{expectedTotal} {problem.itemName}</strong>!
              </p>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs font-black text-emerald-700">
                Kamu mendapatkan +3 Bintang Jasa! ⭐⭐⭐
              </span>

              <button
                onClick={handleNextProblem}
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow border-2 border-amber-500 flex items-center justify-center gap-2"
              >
                <span>Misi Selanjutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
