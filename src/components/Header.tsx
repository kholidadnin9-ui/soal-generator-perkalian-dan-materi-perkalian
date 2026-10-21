import React from 'react';
import { Volume2, VolumeX, Sparkles, HelpCircle } from 'lucide-react';
import { StudentProfile } from '../types';
import { playPop } from '../utils/audio';
import { JetAvatar } from './JetAvatar';

interface HeaderProps {
  profile: StudentProfile;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  onToggleSound: () => void;
  onToggleVoice: () => void;
  onOpenProfile: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  soundEnabled,
  voiceEnabled,
  onToggleSound,
  onToggleVoice,
  onOpenProfile,
  onOpenHelp,
}) => {
  return (
    <header className="bg-gradient-to-r from-slate-800 via-sky-800 to-blue-900 text-white shadow-xl border-b-4 border-amber-400 relative overflow-hidden">
      {/* Decorative cloud and runway background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-400 rounded-full blur-2xl opacity-20" />

      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-3 relative z-10">
        {/* Logo and App Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-sky-100 rounded-2xl flex items-center justify-center shadow-lg border-2 border-amber-200 transform hover:scale-105 transition-transform overflow-hidden animate-gentle-bounce">
            <JetAvatar avatar="jet-biru" className="h-9 w-9" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-amber-950 text-xs font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                Kelas 2 SD
              </span>
              <span className="bg-blue-950 text-sky-200 text-xs font-semibold px-2 py-0.5 rounded-full hidden sm:inline-block">
                Pangkalan Udara
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide drop-shadow-md text-amber-100 flex items-center gap-1.5">
              Skadron Perkalian
              <Sparkles className="w-5 h-5 text-amber-300 hidden sm:inline" />
            </h1>
            <p className="mt-0.5 text-[10px] sm:text-xs font-semibold tracking-wide text-sky-200">
              Created by: Widodo guru SD
            </p>
          </div>
        </div>

        {/* Right side controls: Stars, Sound, Voice, Profile */}
        <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-3">
          {/* Star Counter */}
          <div className="bg-blue-950/80 backdrop-blur-sm border-2 border-amber-400/80 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-inner">
            <span className="text-xl animate-pulse">⭐</span>
            <span className="font-extrabold text-amber-300 text-sm sm:text-base">
              {profile.stars}
            </span>
            <span className="text-xs text-sky-200 font-bold hidden sm:inline">Bintang Jasa</span>
          </div>

          {/* Sound Effect Toggle */}
          <button
            onClick={() => {
              playPop(!soundEnabled);
              onToggleSound();
            }}
            title={soundEnabled ? 'Efek Suara Aktif (Klik untuk Matikan)' : 'Efek Suara Mati (Klik untuk Nyalakan)'}
            className={`p-2 rounded-xl border-2 transition-all shadow-sm ${
              soundEnabled
                ? 'bg-amber-400 text-amber-950 border-amber-300 hover:bg-amber-300'
                : 'bg-blue-950/80 text-sky-300 border-blue-900 hover:bg-blue-900'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Voice Narration Toggle */}
          <button
            onClick={() => {
              playPop(soundEnabled);
              onToggleVoice();
            }}
            title={voiceEnabled ? 'Suara Narasi Aktif (Bisa Bacakan Teks)' : 'Suara Narasi Mati'}
            className={`px-2.5 py-1.5 rounded-xl border-2 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              voiceEnabled
                ? 'bg-sky-400 text-sky-950 border-sky-300 hover:bg-sky-300'
                : 'bg-blue-950/80 text-sky-300 border-blue-900 hover:bg-blue-900'
            }`}
          >
            <span>🗣️</span>
            <span className="hidden sm:inline">{voiceEnabled ? 'Komando Suara ON' : 'Komando Suara OFF'}</span>
          </button>

          {/* Instructions / Help */}
          <button
            onClick={() => {
              playPop(soundEnabled);
              onOpenHelp();
            }}
            className="p-2 rounded-xl bg-blue-950 text-sky-100 hover:bg-blue-900 border-2 border-blue-900 transition-all shadow-sm"
            title="Petunjuk Belajar"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Kid Profile Badge */}
          <button
            onClick={() => {
              playPop(soundEnabled);
              onOpenProfile();
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 font-black px-3 py-1.5 rounded-2xl border-2 border-amber-100 shadow-md transform hover:scale-105 transition-all"
          >
            <JetAvatar avatar={profile.avatar} className="w-7 h-7 bg-white rounded-lg p-0.5" />
            <span className="text-sm max-w-[100px] sm:max-w-[120px] truncate">{profile.name}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
