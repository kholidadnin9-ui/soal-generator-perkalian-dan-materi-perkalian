import React from 'react';
import { Volume2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LEARNING_OBJECTIVES } from '../data/learningData';
import { playPop, speakIndonesian } from '../utils/audio';
import { ActiveTab } from '../types';

interface IntroZoneProps {
  onGoToTab: (tab: ActiveTab) => void;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  studentName: string;
}

export const IntroZone: React.FC<IntroZoneProps> = ({
  onGoToTab,
  soundEnabled,
  voiceEnabled,
  studentName,
}) => {
  const handleReadIntro = () => {
    const text = `Halo ${studentName}! Selamat datang di Skadron Perkalian untuk kelas dua SD. Di sini kita akan belajar konsep perkalian sebagai penjumlahan berulang dengan analogi resep dokter, mencari tahu manfaat perkalian di kehidupan sehari-hari, dan menyelesaikan misi soal cerita skadron!`;
    speakIndonesian(text, voiceEnabled);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Adventure Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-sky-500 bg-gradient-to-r from-slate-800 via-sky-800 to-blue-900 text-white">
        <div className="absolute inset-0 bg-black/25 mix-blend-multiply pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 md:p-8 relative z-10">
          <div className="md:col-span-7 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-full shadow-md">
              <span>✈️</span> Selamat Datang, Pilot Cilik {studentName}!
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-200 drop-shadow leading-tight">
              Siap Mengudara? Kuasai Perkalian 1–10 di Pangkalan Udara!
            </h2>

            <p className="text-sm sm:text-base text-sky-100 font-semibold leading-relaxed">
              Matematika itu seru dan mudah! Bersama <strong className="text-amber-300">Dok Sky si Pilot Medis</strong> dan <strong className="text-amber-300">Kiki si Pilot Cilik</strong>, kita akan memecahkan rahasia perkalian lewat <span className="underline decoration-amber-400 font-black">resep obat dokter</span> dan misi amunisi di gudang skadron!
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => {
                  playPop(soundEnabled);
                  onGoToTab('resep-dokter');
                }}
                className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-base px-6 py-3 rounded-2xl shadow-lg border-2 border-amber-200 transform hover:scale-105 transition-all flex items-center gap-2 group"
              >
                <span>Mulai Terbang!</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleReadIntro}
                className="bg-blue-950/90 hover:bg-blue-900 text-white font-bold text-sm px-4 py-3 rounded-2xl border-2 border-blue-800 shadow-md transition-all flex items-center gap-2"
                title="Dengarkan pengantar suara"
              >
                <Volume2 className="w-5 h-5 text-amber-300 animate-pulse" />
                <span>Dengarkan Komando Suara</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <div className="relative group">
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl bg-slate-800 transform rotate-1 group-hover:rotate-0 transition-transform">
                <img
                  src="/images/jet_hero.jpg"
                  alt="Pesawat tempur kartun skadron dengan mata besar dan mulut tersenyum"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-amber-400 text-amber-950 font-black text-xs px-3 py-1.5 rounded-2xl shadow-lg border-2 border-amber-100 flex items-center gap-1.5 animate-gentle-bounce">
                <span>👨‍️</span> Dok Sky & Kru Skuadron
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Learning Objectives (Tujuan Pembelajaran) */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-4 border-amber-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b-2 border-amber-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl text-2xl">
              🎯
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">
                Tujuan Pembelajaran (Kelas 2 SD)
              </h3>
              <p className="text-xs text-gray-600 font-bold">
                Apa saja kemampuan hebat yang akan kamu dapatkan hari ini?
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto bg-sky-100 text-sky-800 font-extrabold text-xs px-3 py-1 rounded-full border border-sky-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Kurikulum Sekolah
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEARNING_OBJECTIVES.map((obj, idx) => (
            <div
              key={idx}
              className="bg-sky-50/70 hover:bg-sky-50 rounded-2xl p-4 border-2 border-sky-200 transition-all flex gap-3.5 items-start group shadow-sm hover:shadow"
            >
              <div className="text-3xl bg-white p-2 rounded-2xl shadow-sm border border-sky-200 group-hover:scale-110 transition-transform">
                {obj.icon}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base mb-1 flex items-center gap-1.5">
                  <span>Misi #{idx + 1}:</span> {obj.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 font-semibold leading-relaxed">
                  {obj.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flight Plan Guide / Step-by-Step Pathway */}
      <div className="bg-gradient-to-b from-amber-50 to-sky-50 rounded-3xl p-6 border-4 border-sky-400 shadow-md">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="bg-sky-200 text-sky-900 font-black text-xs px-3 py-1 rounded-full uppercase">
            Rute Penerbangan
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            5 Pos Misi + Markas Guru Skuadron
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 font-semibold">
            Ikuti rutenya berurutan untuk menjadi Pahlawan Skuadron Perkalian!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[
            {
              step: 'Pos 1',
              title: 'Resep Dokter',
              desc: 'Pahami 3x1 = 1+1+1',
              tab: 'resep-dokter' as ActiveTab,
              emoji: '💊',
              color: 'border-rose-300 bg-rose-50 hover:bg-rose-100',
              btnColor: 'bg-rose-500 text-white',
            },
            {
              step: 'Pos 2',
              title: 'Manfaat Nyata',
              desc: 'Cepat hitung baterai & kue',
              tab: 'manfaat' as ActiveTab,
              emoji: '🌟',
              color: 'border-sky-300 bg-sky-50 hover:bg-sky-100',
              btnColor: 'bg-sky-500 text-white',
            },
            {
              step: 'Pos 3',
              title: 'Gudang Amunisi',
              desc: 'Eksplorasi perkalian 1-10',
              tab: 'tabel-rimba' as ActiveTab,
              emoji: '🛢️',
              color: 'border-blue-300 bg-blue-50 hover:bg-blue-100',
              btnColor: 'bg-blue-600 text-white',
            },
            {
              step: 'Pos 4',
              title: 'Misi Sehari-hari',
              desc: 'Pecahkan soal cerita kru',
              tab: 'soal-cerita' as ActiveTab,
              emoji: '🎯',
              color: 'border-orange-300 bg-orange-50 hover:bg-orange-100',
              btnColor: 'bg-orange-500 text-white',
            },
            {
              step: 'Pos 5',
              title: 'Kuis & Piagam',
              desc: 'Raih Bintang & Piagam Pilot',
              tab: 'kuis' as ActiveTab,
              emoji: '🏆',
              color: 'border-purple-300 bg-purple-50 hover:bg-purple-100',
              btnColor: 'bg-purple-600 text-white',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-4 border-2 ${item.color} flex flex-col justify-between text-center transition-transform hover:-translate-y-1 shadow-sm`}
            >
              <div>
                <span className="text-xs font-black uppercase text-gray-500 bg-white/80 px-2 py-0.5 rounded-full inline-block mb-1">
                  {item.step}
                </span>
                <div className="text-3xl my-1.5">{item.emoji}</div>
                <h4 className="font-extrabold text-gray-900 text-sm">{item.title}</h4>
                <p className="text-[11px] text-gray-600 font-semibold mb-3">{item.desc}</p>
              </div>
              <button
                onClick={() => {
                  playPop(soundEnabled);
                  onGoToTab(item.tab);
                }}
                className={`w-full py-1.5 px-3 rounded-xl font-black text-xs ${item.btnColor} shadow hover:opacity-90 transition-opacity`}
              >
                Mulai Misi
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mascot Card */}
      <div className="bg-amber-100/70 border-2 border-amber-300 rounded-3xl p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="text-4xl bg-white p-3 rounded-2xl shadow-sm border border-amber-200">
          👨‍✈️
        </div>
        <div className="text-center sm:text-left flex-1">
          <h4 className="font-black text-amber-950 text-base">
            Pesan Semangat dari Dok Sky si Pilot Medis:
          </h4>
          <p className="text-xs sm:text-sm text-amber-900 font-semibold mt-0.5">
            &ldquo;Jangan takut dengan perkalian ya pilot-pilot cilik! Perkalian itu sebenarnya cuma teman lama kita: penjumlahan yang diulang-ulang. Mari kita terbang ke pos pertama: <strong>Resep Dokter Skuadron</strong>!&rdquo;
          </p>
        </div>
        <button
          onClick={() => {
            playPop(soundEnabled);
            onGoToTab('resep-dokter');
          }}
          className="bg-sky-700 hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-md border-2 border-sky-600 flex items-center gap-2 whitespace-nowrap"
        >
          <span>Ayo ke Pos 1</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
