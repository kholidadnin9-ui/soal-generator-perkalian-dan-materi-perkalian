import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { playPop } from '../utils/audio';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, soundEnabled }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-emerald-400 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-emerald-600 text-white p-4 flex items-center justify-between border-b-2 border-emerald-700">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-300" />
            <h3 className="font-black text-base text-amber-100">
              Petunjuk Petualangan Belajar
            </h3>
          </div>
          <button
            onClick={() => {
              playPop(soundEnabled);
              onClose();
            }}
            className="p-1 rounded-full hover:bg-emerald-700 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-gray-700 font-semibold leading-relaxed">
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <h4 className="font-black text-amber-950 text-sm mb-1 flex items-center gap-1.5">
              <span>🌟</span> Untuk Siswa Kelas 2 SD:
            </h4>
            <p>
              Selamat datang di pangkalan matematika! Ikuti 5 pos misi secara berurutan:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-800">
              <li><strong>Pos 1 (Resep Dokter):</strong> Pahami bahwa 3 x 1 = 1 + 1 + 1 (angka 1 diulang 3x).</li>
              <li><strong>Pos 2 (Manfaat):</strong> Lihat bagaimana perkalian mempercepat belanja dan pembagian kue.</li>
              <li><strong>Pos 3 (Gudang Amunisi):</strong> Coba klik baris amunisi 1-10 untuk mendengar suara pengucapan.</li>
              <li><strong>Pos 4 (Soal Cerita):</strong> Pecahkan soal cerita kehidupan sehari-hari step-by-step.</li>
              <li><strong>Pos 5 (Kuis):</strong> Uji kemampuanmu dan cetak Piagam Pilot Skuadron!</li>
              <li><strong>🖨️ Markas Guru (Cetak Soal):</strong> Untuk Bapak/Ibu Guru — buat 5 paket soal berbeda (10 PG a/b/c + 5 isian) jenis Campuran atau Khusus Konsep Dasar berilustrasi gambar, lengkap dengan kunci jawaban, siap cetak ukuran A4.</li>
            </ul>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
            <h4 className="font-black text-emerald-950 text-sm mb-1 flex items-center gap-1.5">
              <span>🗣️</span> Fitur Suara (Text-to-Speech):
            </h4>
            <p>
              Klik tombol speaker <strong>&quot;Dengarkan Suara Guru&quot;</strong> atau <strong>&quot;Bacakan Soal&quot;</strong> jika kamu ingin mendengarkan komputer membacakan teks dengan suara ramah!
            </p>
          </div>

          <div className="bg-teal-50 rounded-2xl p-4 border border-teal-200">
            <h4 className="font-black text-teal-950 text-sm mb-1 flex items-center gap-1.5">
              <span>🩺</span> Catatan Penting Guru & Orang Tua:
            </h4>
            <p>
              Di kurikulum kelas 2 SD, analogi resep dokter <strong>&quot;3 x 1&quot;</strong> sangat ditekankan agar siswa tidak rancu antara jumlah kelompok (waktu minum) dan isi tiap kelompok (jumlah butir obat).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => {
              playPop(soundEnabled);
              onClose();
            }}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 rounded-xl shadow transition-all"
          >
            Siap Terbang! 🛫
          </button>
        </div>
      </div>
    </div>
  );
};
