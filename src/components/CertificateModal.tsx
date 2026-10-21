import React from 'react';
import { X, Award, Printer, Sparkles } from 'lucide-react';
import { StudentProfile } from '../types';
import { playPop } from '../utils/audio';
import { JetAvatar } from './JetAvatar';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  score: number;
  soundEnabled: boolean;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  profile,
  score,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    playPop(soundEnabled);
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border-4 border-amber-400 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="bg-emerald-700 p-3 text-white flex items-center justify-between border-b-2 border-emerald-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-300" />
            <span className="font-black text-sm">Piagam Penghargaan Resmi Skuadron</span>
          </div>
          <button
            onClick={() => {
              playPop(soundEnabled);
              onClose();
            }}
            className="p-1 rounded-full hover:bg-emerald-800 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body (Printable area) */}
        <div className="p-6 overflow-y-auto print:m-0 print:p-8" id="jungle-certificate">
          <div className="bg-gradient-to-b from-amber-50 via-yellow-50 to-emerald-50 rounded-3xl p-6 sm:p-8 border-8 border-double border-amber-400 relative overflow-hidden text-center shadow-inner">
            {/* Corner Jet Decorations */}
            <div className="absolute top-2 left-2 text-2xl">🛩️</div>
            <div className="absolute top-2 right-2 text-2xl">✈️</div>
            <div className="absolute bottom-2 left-2 text-2xl">🚀</div>
            <div className="absolute bottom-2 right-2 text-2xl">⭐</div>

            {/* Certificate Header */}
            <div className="space-y-1 mb-4">
              <span className="text-4xl block animate-gentle-bounce">🏆</span>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-200/60 px-3 py-1 rounded-full inline-block">
                Sertifikat Prestasi Matematika Kelas 2 SD
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 mt-2">
                PILOT SKADRON PERKALIAN
              </h2>
              <p className="text-xs text-gray-600 font-bold">
                Diberikan dengan rasa bangga dan bahagia kepada:
              </p>
            </div>

            {/* Student Name & Avatar */}
            <div className="my-4 py-2 border-b-2 border-dashed border-amber-300">
              <div className="flex justify-center my-1">
                <JetAvatar avatar={profile.avatar} className="h-14 w-14" withBg />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-rose-600 tracking-wide underline decoration-amber-400">
                {profile.name}
              </h3>
              <p className="text-xs font-extrabold text-emerald-900 mt-1">
                Pilot Cilik Skuadron Berprestasi
              </p>
            </div>

            {/* Achievement text */}
            <div className="text-xs sm:text-sm text-gray-700 font-semibold max-w-md mx-auto leading-relaxed my-3">
              Telah berhasil menguasai <strong>Konsep Dasar Perkalian (Penjumlahan Berulang)</strong> melalui Analogi Resep Dokter (3x1 = 1+1+1), memahami manfaat perkalian dalam kehidupan sehari-hari, serta menyelesaikan misi soal cerita skuadron dengan nilai luar biasa:
            </div>

            {/* Score & Stars */}
            <div className="inline-flex items-center gap-3 bg-amber-300 text-amber-950 px-5 py-2 rounded-2xl font-black text-lg sm:text-xl shadow my-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              <span>Nilai Kuis: {score} / 100</span>
              <Sparkles className="w-5 h-5 text-amber-700" />
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-amber-200 text-center">
              <div>
                <div className="text-2xl mb-1">🐘🩺</div>
                <p className="text-xs font-black text-emerald-950">Dok Sky</p>
                <p className="text-[10px] text-gray-500 font-bold">Pilot Medis Skuadron</p>
              </div>

              <div>
                <div className="text-xs font-extrabold text-gray-600 mb-2">{currentDate}</div>
                <div className="text-xl mb-0.5">🌟⭐🌟</div>
                <p className="text-xs font-black text-emerald-950">Bintang Jasa Skuadron</p>
                <p className="text-[10px] text-gray-500 font-bold">Pangkalan Udara Skuadron</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500 font-bold text-center sm:text-left">
            Kamu bisa mencetak atau menyimpan sertifikat ini sebagai kenang-kenangan!
          </p>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Cetak Piagam
            </button>
            <button
              onClick={() => {
                playPop(soundEnabled);
                onClose();
              }}
              className="flex-1 sm:flex-initial bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs px-4 py-2.5 rounded-xl shadow transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
