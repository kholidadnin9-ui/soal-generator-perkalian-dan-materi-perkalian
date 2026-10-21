import React, { useState } from 'react';
import { Volume2, Zap, Clock, CheckCircle2 } from 'lucide-react';
import { DAILY_BENEFITS } from '../data/learningData';
import { playCorrect, playPop, speakIndonesian } from '../utils/audio';

interface DailyLifeBenefitsZoneProps {
  soundEnabled: boolean;
  voiceEnabled: boolean;
  onAddStar: (count: number) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const DailyLifeBenefitsZone: React.FC<DailyLifeBenefitsZoneProps> = ({
  soundEnabled,
  voiceEnabled,
  onAddStar,
  onUnlockBadge,
}) => {
  const [activeBenefitId, setActiveBenefitId] = useState(DAILY_BENEFITS[0].id);

  // Speed test simulation state
  const [raceStep, setRaceStep] = useState<'idle' | 'manual-running' | 'mult-running' | 'done'>('idle');
  const [manualCount, setManualCount] = useState(0);
  const [hasCompletedRace, setHasCompletedRace] = useState(false);

  const activeBenefit = DAILY_BENEFITS.find((b) => b.id === activeBenefitId) || DAILY_BENEFITS[0];

  const handleReadBenefit = (b = activeBenefit) => {
    const text = `${b.title}. ${b.desc}. Jika pakai cara perkalian: ${b.multiplicationWay}`;
    speakIndonesian(text, voiceEnabled);
  };

  const startManualCount = () => {
    playPop(soundEnabled);
    setRaceStep('manual-running');
    setManualCount(0);

    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setManualCount(count);
      if (count >= 15) {
        clearInterval(interval);
        setRaceStep('idle');
      }
    }, 280);
  };

  const startMultiplicationFlash = () => {
    playCorrect(soundEnabled);
    setRaceStep('mult-running');
    setManualCount(15);
    setTimeout(() => {
      setRaceStep('done');
      if (!hasCompletedRace) {
        setHasCompletedRace(true);
        onAddStar(3);
        onUnlockBadge('benefits');
      }
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl border-4 border-amber-300 relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-white text-sky-800 font-black text-xs sm:text-sm px-3.5 py-1 rounded-full shadow">
            <span>🌟</span> Pos 2: Manfaat Perkalian Sehari-hari
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-200 drop-shadow">
            Mengapa Kita Harus Bisa Perkalian?
          </h2>
          <p className="text-xs sm:text-base text-sky-100 font-semibold leading-relaxed">
            Perkalian itu seperti <strong className="text-amber-300">jurus kilat</strong>! Membantu kita saat berbelanja di pasar, membagikan kue ke teman agar adil, dan menghitung barang tanpa ribet!
          </p>
        </div>
      </div>

      {/* Jungle Market Story Illustration Card */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-4 border-sky-300">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 flex justify-center">
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-4 border-sky-400 shadow-xl bg-sky-50 relative group">
              <img
                src="/images/pilot_daily.jpg"
                alt="Kru Skuadron Menata Barang di Hanggar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute bottom-2 left-2 bg-amber-400 text-amber-950 font-black text-[11px] px-2.5 py-1 rounded-full shadow">
                Hanggar Skuadron ✈️
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-3">
            <span className="bg-sky-100 text-sky-900 font-black text-xs px-3 py-1 rounded-full inline-block">
              Kehidupan Nyata Siswa Kelas 2 SD
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900">
              4 Keajaiban Perkalian di Dunia Nyata
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-semibold leading-relaxed">
              Bayangkan jika kamu harus membeli 4 keranjang apel yang masing-masing isinya 5 buah. Kalau dihitung satu persatu dari 1 sampai 20, antrean di kasir jadi panjang! Dengan perkalian: <strong>4 x 5 = 20 apel</strong>, selesai dalam sekejap!
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {DAILY_BENEFITS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    playPop(soundEnabled);
                    setActiveBenefitId(item.id);
                  }}
                  className={`px-3 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 border-2 ${
                    activeBenefitId === item.id
                      ? 'bg-sky-500 text-white border-sky-600 shadow-md scale-105'
                      : 'bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100'
                  }`}
                >
                  <span className="text-base">{item.emoji}</span>
                  <span>{item.title.split(' ')[0]} {item.title.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Benefit Detail Card */}
        <div className="mt-6 bg-gradient-to-br from-sky-50 via-indigo-50 to-amber-50 rounded-2xl p-5 border-2 border-sky-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl bg-white p-2 rounded-2xl shadow-sm border border-sky-200">
                {activeBenefit.emoji}
              </span>
              <div>
                <h4 className="text-lg sm:text-xl font-black text-sky-950">
                  {activeBenefit.title}
                </h4>
                <p className="text-xs text-sky-700 font-bold">
                  {activeBenefit.subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleReadBenefit(activeBenefit)}
              className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-black bg-white hover:bg-sky-100 text-sky-900 px-3.5 py-2 rounded-xl border border-sky-300 shadow-sm transition-colors"
            >
              <Volume2 className="w-4 h-4 text-sky-600 animate-pulse" />
              <span>Dengarkan Penjelasan</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-sky-200 text-xs sm:text-sm text-gray-800 font-semibold mb-4 leading-relaxed">
            📖 <strong>Contoh Kasus:</strong> {activeBenefit.desc}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cara Manual */}
            <div className="bg-white rounded-2xl p-4 border-2 border-amber-300 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Cara Lama (Satu per Satu)
                </span>
                <span className="text-xs font-bold text-gray-500">Lambat 🐢</span>
              </div>
              <p className="text-xs text-gray-700 font-semibold leading-relaxed">
                {activeBenefit.manualWay}
              </p>
            </div>

            {/* Cara Perkalian */}
            <div className="bg-emerald-50 rounded-2xl p-4 border-2 border-emerald-400 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-emerald-900 bg-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-700" /> Cara Perkalian (Super Kilat!)
                </span>
                <span className="text-xs font-black text-emerald-600">Cepat ⚡</span>
              </div>
              <p className="text-xs text-emerald-950 font-black leading-relaxed">
                {activeBenefit.multiplicationWay}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Speed Race: Manual vs Multiplication */}
      <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 rounded-3xl p-6 border-4 border-amber-400 shadow-lg">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="bg-amber-300 text-amber-950 font-black text-xs px-3 py-1 rounded-full uppercase">
            Simulasi Interaktif
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-amber-950 mt-1">
            Balapan Menghitung 3 Keranjang x 5 Apel!
          </h3>
          <p className="text-xs sm:text-sm text-amber-900 font-semibold">
            Buktikan sendiri seberapa cepatnya perkalian dibandingkan menghitung satu per satu!
          </p>
        </div>

        {/* Visual of 3 Baskets with 5 Apples each */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {[1, 2, 3].map((bNum) => (
            <div
              key={bNum}
              className="bg-white rounded-2xl p-3 border-2 border-amber-300 shadow-sm text-center w-28 sm:w-32"
            >
              <div className="text-xs font-black text-amber-900 mb-1">Keranjang {bNum}</div>
              <div className="text-2xl my-1 flex justify-center flex-wrap gap-1">
                🍎🍎🍎🍎🍎
              </div>
              <div className="text-[11px] font-extrabold text-gray-500">5 apel</div>
            </div>
          ))}
        </div>

        {/* Race Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          {/* Manual Button */}
          <div className="bg-white rounded-2xl p-4 border-2 border-gray-300 text-center flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-xs font-black uppercase text-gray-500 block mb-1">
                Jalur 1: Hitung Satu-satu
              </span>
              <div className="text-2xl font-black text-gray-800 my-2">
                {raceStep === 'manual-running' ? (
                  <span className="text-amber-600 animate-pulse">{manualCount} apel...</span>
                ) : (
                  <span>🐢 1, 2, 3...</span>
                )}
              </div>
            </div>
            <button
              onClick={startManualCount}
              disabled={raceStep === 'manual-running'}
              className="w-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-800 font-black text-xs py-2.5 rounded-xl transition-all"
            >
              {raceStep === 'manual-running' ? 'Sedang menghitung pelan...' : 'Mulai Hitung Manual 🐢'}
            </button>
          </div>

          {/* Multiplication Button */}
          <div className="bg-emerald-500 text-white rounded-2xl p-4 border-2 border-emerald-600 text-center flex flex-col justify-between shadow-md">
            <div>
              <span className="text-xs font-black uppercase text-emerald-100 block mb-1">
                Jalur 2: Jurus Perkalian
              </span>
              <div className="text-2xl font-black text-amber-200 my-2">
                3 x 5 = 15! ⚡
              </div>
            </div>
            <button
              onClick={startMultiplicationFlash}
              className="w-full bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs py-2.5 rounded-xl shadow transition-transform active:scale-95"
            >
              Klik: Selesai Dalam 1 Detik! 🚀
            </button>
          </div>
        </div>

        {raceStep === 'done' && (
          <div className="mt-5 p-4 bg-white rounded-2xl border-2 border-emerald-400 text-center max-w-lg mx-auto shadow animate-bounce">
            <span className="text-emerald-700 font-black text-sm flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Hebat! Dengan rumus 3 x 5 = 15, kamu menghemat banyak waktu! Kamu dapat +3 Bintang! ⭐⭐⭐
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
