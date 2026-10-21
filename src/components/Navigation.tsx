import React from 'react';
import { ActiveTab } from '../types';
import { playPop } from '../utils/audio';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  soundEnabled: boolean;
}

interface TabItem {
  id: ActiveTab;
  label: string;
  badge: string;
  emoji: string;
  color: string;
  activeBg: string;
}

const TABS: TabItem[] = [
  {
    id: 'intro',
    label: 'Pangkalan & Misi',
    badge: 'Mulai',
    emoji: '🗺️',
    color: 'hover:bg-slate-700 text-slate-100 border-slate-600',
    activeBg: 'bg-amber-400 text-amber-950 border-amber-500 shadow-amber-200',
  },
  {
    id: 'resep-dokter',
    label: 'Resep Dokter Skuadron',
    badge: 'Konsep Dasar',
    emoji: '💊',
    color: 'hover:bg-slate-700 text-slate-100 border-slate-600',
    activeBg: 'bg-rose-500 text-white border-rose-600 shadow-rose-200',
  },
  {
    id: 'manfaat',
    label: 'Manfaat Nyata',
    badge: 'Sehari-hari',
    emoji: '🌟',
    color: 'hover:bg-slate-700 text-slate-100 border-slate-600',
    activeBg: 'bg-sky-500 text-white border-sky-600 shadow-sky-200',
  },
  {
    id: 'tabel-rimba',
    label: 'Gudang Amunisi 1-10',
    badge: 'Tabel Visual',
    emoji: '🛢️',
    color: 'hover:bg-slate-700 text-slate-100 border-slate-600',
    activeBg: 'bg-blue-600 text-white border-blue-700 shadow-blue-200',
  },
  {
    id: 'soal-cerita',
    label: 'Misi Soal Cerita',
    badge: 'Latihan Nyata',
    emoji: '🎯',
    color: 'hover:bg-slate-700 text-slate-100 border-slate-600',
    activeBg: 'bg-orange-500 text-white border-orange-600 shadow-orange-200',
  },
  {
    id: 'kuis',
    label: 'Kuis & Piagam',
    badge: 'Uji Kehebatan',
    emoji: '🏆',
    color: 'hover:bg-slate-700 text-slate-100 border-slate-600',
    activeBg: 'bg-purple-600 text-white border-purple-700 shadow-purple-200',
  },
  {
    id: 'generator',
    label: 'Cetak Soal',
    badge: '5 Paket • Print',
    emoji: '🖨️',
    color: 'hover:bg-slate-700 text-slate-100 border-slate-600',
    activeBg: 'bg-teal-600 text-white border-teal-700 shadow-teal-200',
  },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  soundEnabled,
}) => {
  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-b-2 border-slate-700 py-2.5 px-3 sticky top-0 z-40 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playPop(soundEnabled);
                onSelectTab(tab.id);
              }}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl font-extrabold text-xs sm:text-sm transition-all duration-200 border-2 shadow-sm ${
                isActive
                  ? `${tab.activeBg} scale-105 shadow-md -translate-y-0.5`
                  : 'bg-slate-800/70 text-slate-200 border-slate-700 hover:bg-slate-700/70'
              }`}
            >
              <span className="text-lg">{tab.emoji}</span>
              <div className="text-left leading-tight">
                <span className="block font-black whitespace-nowrap">{tab.label}</span>
                <span
                  className={`text-[10px] font-semibold hidden md:inline-block ${
                    isActive ? 'opacity-90' : 'text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
