import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, Award, ArrowRight, RotateCcw, Check, XCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/learningData';
import { playCorrect, playFanfare, playPop, playWrong, speakIndonesian } from '../utils/audio';
import { StudentProfile } from '../types';

interface QuizZoneProps {
  soundEnabled: boolean;
  voiceEnabled: boolean;
  profile: StudentProfile;
  onAddStar: (count: number) => void;
  onUnlockBadge: (badgeId: string) => void;
  onUpdateQuizScore: (score: number) => void;
  onOpenCertificate: () => void;
}

export const QuizZone: React.FC<QuizZoneProps> = ({
  soundEnabled,
  voiceEnabled,
  onAddStar,
  onUnlockBadge,
  onUpdateQuizScore,
  onOpenCertificate,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, { selectedIdx: number; isCorrect: boolean }>>({});
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const question = QUIZ_QUESTIONS[currentIdx];
  const hasAnsweredCurrent = selectedOptionIdx !== null;

  const handleReadQuestion = () => {
    const text = `Pertanyaan nomor ${currentIdx + 1}: ${question.question}`;
    speakIndonesian(text, voiceEnabled);
  };

  const handleSelectOption = (idx: number) => {
    if (hasAnsweredCurrent) return;

    setSelectedOptionIdx(idx);
    const selectedOption = question.options[idx];
    const isCorrect = selectedOption.isCorrect;

    setAnswers((prev) => ({
      ...prev,
      [question.id]: { selectedIdx: idx, isCorrect },
    }));

    if (isCorrect) {
      playCorrect(soundEnabled);
      onAddStar(2);
      speakIndonesian(selectedOption.feedback, voiceEnabled);
    } else {
      playWrong(soundEnabled);
      speakIndonesian(selectedOption.feedback, voiceEnabled);
    }
  };

  const handleNext = () => {
    playPop(soundEnabled);
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionIdx(null);
    } else {
      // Complete quiz!
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsQuizComplete(true);
    playFanfare(soundEnabled);

    // Calculate score
    const totalCorrect = Object.values(answers).filter((a) => a.isCorrect).length;
    const finalScore = Math.round((totalCorrect / QUIZ_QUESTIONS.length) * 100);
    onUpdateQuizScore(finalScore);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    if (finalScore >= 70) {
      onAddStar(10);
      onUnlockBadge('quiz_hero');
    }
  };

  const handleRestart = () => {
    playPop(soundEnabled);
    setCurrentIdx(0);
    setSelectedOptionIdx(null);
    setAnswers({});
    setIsQuizComplete(false);
  };

  // Completion view
  if (isQuizComplete) {
    const totalCorrect = Object.values(answers).filter((a) => a.isCorrect).length;
    const finalScore = Math.round((totalCorrect / QUIZ_QUESTIONS.length) * 100);

    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-purple-400 text-center max-w-2xl mx-auto space-y-5 animate-fade-in">
        <div className="text-6xl animate-gentle-bounce">🎉🏆🎊</div>

        <div>
          <span className="bg-purple-100 text-purple-900 font-black text-xs px-3.5 py-1 rounded-full uppercase">
            Misi Kuis Selesai!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-purple-950 mt-2">
            Selamat, Pilot Hebat!
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-semibold mt-1">
            Kamu telah menyelesaikan seluruh tantangan perkalian skuadron dengan luar biasa!
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-gradient-to-br from-amber-50 to-purple-50 rounded-2xl p-5 border-2 border-purple-200">
          <div className="text-4xl sm:text-5xl font-black text-purple-700 my-1">
            {finalScore} <span className="text-lg text-gray-500 font-bold">/ 100</span>
          </div>
          <p className="text-xs sm:text-sm font-extrabold text-gray-700">
            Kamu menjawab benar <strong>{totalCorrect}</strong> dari <strong>{QUIZ_QUESTIONS.length}</strong> pertanyaan!
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-400 text-amber-950 px-3.5 py-1 rounded-full text-xs font-black shadow-sm">
            <span>⭐</span> Bonus +10 Bintang Jasa Ditambahkan!
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={onOpenCertificate}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-6 py-3 rounded-2xl shadow-lg border-2 border-amber-500 transform hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Award className="w-5 h-5" />
            <span>Lihat Piagam Sertifikat</span>
          </button>

          <button
            onClick={handleRestart}
            className="bg-purple-600 hover:bg-purple-700 text-white font-black px-5 py-3 rounded-2xl shadow border-2 border-purple-700 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Coba Kuis Lagi</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-3xl p-6 text-white shadow-xl border-4 border-amber-300 relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-white text-purple-900 font-black text-xs sm:text-sm px-3.5 py-1 rounded-full shadow">
            <span>🏆</span> Pos 5: Kuis Tantangan Skuadron
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-200 drop-shadow">
            Uji Kehebatan Perkalian Skuadron!
          </h2>
          <p className="text-xs sm:text-base text-purple-100 font-semibold leading-relaxed">
            Buktikan pemahamanmu tentang resep dokter (3x1 = 1+1+1), penjumlahan berulang, dan manfaat perkalian di kehidupan nyata.
          </p>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-4 border-purple-300">
        {/* Progress header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b-2 border-purple-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl p-2 bg-purple-100 rounded-2xl border border-purple-200">
              {question.emoji}
            </span>
            <div>
              <span className="text-xs font-black uppercase text-purple-700 block">
                Pertanyaan {currentIdx + 1} dari {QUIZ_QUESTIONS.length}
              </span>
              <h3 className="font-extrabold text-gray-900 text-xs sm:text-sm">
                Pilih jawaban yang paling tepat
              </h3>
            </div>
          </div>

          <button
            onClick={handleReadQuestion}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-black bg-purple-500 hover:bg-purple-600 text-white px-3.5 py-2 rounded-xl shadow-sm transition-colors"
          >
            <Volume2 className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>Bacakan Soal</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-5">
          <div
            className="bg-purple-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Question Text */}
        <div className="bg-purple-50/70 rounded-2xl p-5 border-2 border-purple-200 mb-6">
          <h4 className="text-base sm:text-lg font-black text-gray-900 leading-snug">
            {question.question}
          </h4>
          {question.hint && (
            <p className="text-xs text-purple-700 font-bold mt-2 flex items-center gap-1">
              <span>💡</span> <em>Petunjuk: {question.hint}</em>
            </p>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, idx) => {
            const isSelected = selectedOptionIdx === idx;
            let btnStyle = 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-purple-50 hover:border-purple-300';

            if (hasAnsweredCurrent) {
              if (option.isCorrect) {
                btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300';
              } else if (isSelected && !option.isCorrect) {
                btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-300';
              } else {
                btnStyle = 'bg-gray-50 border-gray-200 text-gray-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={hasAnsweredCurrent}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-2xl border-2 font-black text-xs sm:text-sm transition-all flex items-start gap-3 shadow-sm ${btnStyle}`}
              >
                <span className="w-6 h-6 rounded-xl bg-white border border-gray-300 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-relaxed">{option.text}</span>
                {hasAnsweredCurrent && option.isCorrect && (
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                )}
                {hasAnsweredCurrent && isSelected && !option.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Card */}
        {hasAnsweredCurrent && (
          <div
            className={`p-4 rounded-2xl border-2 mb-6 animate-fade-in ${
              question.options[selectedOptionIdx].isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="font-black text-sm mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {question.options[selectedOptionIdx].isCorrect ? 'Hebat Sekali!' : 'Ayo Kita Pelajari!'}
            </div>
            <p className="text-xs sm:text-sm font-semibold leading-relaxed">
              {question.options[selectedOptionIdx].feedback}
            </p>
            <div className="mt-2 text-xs font-bold text-gray-600 bg-white/70 p-2 rounded-xl">
              📖 <strong>Penjelasan Lengkap:</strong> {question.explanation}
            </div>
          </div>
        )}

        {/* Next Question Button */}
        {hasAnsweredCurrent && (
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md border-2 border-purple-700 flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Soal Berikutnya' : 'Selesai & Lihat Skor'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
