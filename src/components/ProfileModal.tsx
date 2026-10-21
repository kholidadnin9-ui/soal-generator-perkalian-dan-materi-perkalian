import React, { useState } from 'react';
import { X, Award, Sparkles, Check } from 'lucide-react';
import { StudentProfile, PilotAvatar } from '../types';
import { playCorrect, playPop } from '../utils/audio';
import { JetAvatar, PLANE_OPTIONS, PlaneIcon, PlaneOption } from './JetAvatar';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  soundEnabled: boolean;
}

const BADGES_INFO: { id: string; title: string; desc: string; color: string; variant: PlaneOption['variant'] }[] = [
  { id: 'starter', title: 'Kru Pangkalan', desc: 'Mulai petualangan matematika kelas 2', color: 'text-sky-600', variant: 'takeoff' },
  { id: 'doctor', title: 'Pilot Medis', desc: 'Memahami konsep resep dokter perkalian', color: 'text-rose-600', variant: 'plane' },
  { id: 'benefits', title: 'Pilot Cerdas', desc: 'Memahami manfaat perkalian di kehidupan nyata', color: 'text-amber-500', variant: 'plane' },
  { id: 'table_master', title: 'Master Gudang Amunisi', desc: 'Mengeksplorasi tabel perkalian 1 sampai 10', color: 'text-blue-600', variant: 'landing' },
  { id: 'story_solver', title: 'Inspektur Misi', desc: 'Menyelesaikan misi soal cerita sehari-hari', color: 'text-orange-500', variant: 'takeoff' },
  { id: 'quiz_hero', title: 'Pahlawan Skuadron', desc: 'Menyelesaikan kuis perkalian dengan hebat', color: 'text-purple-600', variant: 'plane' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  soundEnabled,
}) => {
  const [nameInput, setNameInput] = useState(profile.name);

  if (!isOpen) return null;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateProfile({ name: nameInput.trim() });
      playCorrect(soundEnabled);
    }
  };

  const handleSelectAvatar = (avatar: PilotAvatar) => {
    playPop(soundEnabled);
    onUpdateProfile({ avatar });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-amber-400 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-800 p-4 text-white flex items-center justify-between border-b-4 border-blue-900">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-2xl shadow-inner border border-amber-200">
              <JetAvatar avatar={profile.avatar} className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-100 flex items-center gap-1.5">
                Kartu Pilot Skuadron <Sparkles className="w-5 h-5 text-amber-300" />
              </h2>
              <p className="text-xs text-sky-100 font-semibold">
                Atur nama pilot dan pilih pesawat favoritmu!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playPop(soundEnabled);
              onClose();
            }}
            className="p-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Name Input */}
          <form onSubmit={handleSaveName} className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200">
            <label className="block text-xs font-black uppercase text-amber-900 mb-1">
              Nama Pilot Cilik:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                maxLength={20}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Tulis namamu disini..."
                className="flex-1 px-3 py-2 rounded-xl border-2 border-amber-300 font-extrabold text-gray-800 focus:outline-none focus:border-sky-500 bg-white"
              />
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white font-black px-4 py-2 rounded-xl border-2 border-sky-700 transition-all flex items-center gap-1 shadow-sm"
              >
                <Check className="w-4 h-4" /> Simpan
              </button>
            </div>
          </form>

          {/* Avatar Selector */}
          <div>
            <h3 className="font-extrabold text-sm text-gray-800 mb-2 flex items-center gap-1.5">
              <span>🛫</span> Pilih Pesawat Favorit:
            </h3>
            <div className="grid grid-cols-4 gap-2.5">
              {PLANE_OPTIONS.map((item) => {
                const isSelected = profile.avatar === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    title={item.desc}
                    onClick={() => handleSelectAvatar(item.id)}
                    className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all border-2 text-center ${
                      isSelected
                        ? 'bg-amber-300 border-amber-500 scale-105 shadow-md ring-2 ring-amber-400'
                        : 'bg-sky-50 border-sky-200 hover:bg-sky-100'
                    }`}
                  >
                    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.bg}`}>
                      <PlaneIcon variant={item.variant} className={`h-8 w-8 ${item.color}`} />
                    </span>
                    <span className="text-[11px] font-black text-gray-800 truncate w-full">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Badges Section */}
          <div className="bg-sky-50/70 rounded-2xl p-4 border-2 border-sky-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-sm text-sky-950 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> Lencana Jasa Skuadron
              </h3>
              <span className="text-xs font-bold bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full">
                {profile.badges.length} / {BADGES_INFO.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {BADGES_INFO.map((badge) => {
                const isUnlocked = profile.badges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                      isUnlocked
                        ? 'bg-white border-amber-300 shadow-sm'
                        : 'bg-gray-100/70 border-gray-200 opacity-60'
                    }`}
                  >
                    <PlaneIcon variant={badge.variant} className={`h-7 w-7 flex-shrink-0 ${isUnlocked ? badge.color : 'text-gray-400'}`} />
                    <div className="overflow-hidden">
                      <p className="text-xs font-black text-gray-800 truncate">{badge.title}</p>
                      <p className="text-[10px] text-gray-500 truncate">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => {
              playPop(soundEnabled);
              onClose();
            }}
            className="w-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-black py-2.5 px-6 rounded-2xl border-2 border-amber-500 transition-transform active:scale-95 shadow-md"
          >
            Siap Terbang! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
