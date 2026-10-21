import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { IntroZone } from './components/IntroZone';
import { DoctorPrescriptionZone } from './components/DoctorPrescriptionZone';
import { DailyLifeBenefitsZone } from './components/DailyLifeBenefitsZone';
import { InteractiveTableZone } from './components/InteractiveTableZone';
import { StoryProblemsZone } from './components/StoryProblemsZone';
import { QuizZone } from './components/QuizZone';
import { PrintGeneratorZone } from './components/PrintGeneratorZone';
import { ProfileModal } from './components/ProfileModal';
import { HelpModal } from './components/HelpModal';
import { CertificateModal } from './components/CertificateModal';
import { ActiveTab, StudentProfile } from './types';
import { playCorrect, playPop, stopSpeech } from './utils/audio';

const STORAGE_KEY = 'skadron_perkalian_profile_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('intro');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  // Floating star notification toast
  const [starToast, setStarToast] = useState<{ count: number; visible: boolean }>({
    count: 0,
    visible: false,
  });

  // Profile with LocalStorage fallback
  const [profile, setProfile] = useState<StudentProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {
        // ignore
      }
    }
    return {
      name: 'Pilot Cilik',
      avatar: 'jet-biru',
      stars: 5,
      badges: ['starter'],
      completedPrescriptions: 0,
      completedProblems: 0,
      quizScore: null,
    };
  });

  // Save profile to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  // Stop speech when changing tabs to prevent voice overlaps
  const handleSelectTab = (tab: ActiveTab) => {
    stopSpeech();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddStar = (count: number) => {
    setProfile((prev) => ({
      ...prev,
      stars: prev.stars + count,
    }));
    playCorrect(soundEnabled);

    // Show floating star toast
    setStarToast({ count, visible: true });
    setTimeout(() => {
      setStarToast((prev) => ({ ...prev, visible: false }));
    }, 2200);
  };

  const handleUnlockBadge = (badgeId: string) => {
    setProfile((prev) => {
      if (prev.badges.includes(badgeId)) return prev;
      return {
        ...prev,
        badges: [...prev.badges, badgeId],
      };
    });
  };

  const handleUpdateProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const handleUpdateQuizScore = (score: number) => {
    setProfile((prev) => ({
      ...prev,
      quizScore: score,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-amber-50 text-slate-800 flex flex-col font-sans selection:bg-amber-300 selection:text-amber-950">
      {/* Top Header */}
      <div className="no-print">
        <Header
          profile={profile}
          soundEnabled={soundEnabled}
          voiceEnabled={voiceEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
          onToggleVoice={() => setVoiceEnabled((prev) => !prev)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
        />
      </div>

      {/* Squadron Zone Navigation */}
      <div className="no-print">
        <Navigation
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          soundEnabled={soundEnabled}
        />
      </div>

      {/* Floating Star Toast */}
      {starToast.visible && (
        <div className="no-print fixed top-20 right-6 z-50 bg-amber-400 text-amber-950 px-4 py-2.5 rounded-2xl shadow-xl border-2 border-amber-200 font-black text-sm flex items-center gap-2 animate-bounce">
          <span className="text-xl">⭐</span>
          <span>+{starToast.count} Bintang Jasa Didapat!</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8">
        {activeTab === 'intro' && (
          <IntroZone
            onGoToTab={handleSelectTab}
            soundEnabled={soundEnabled}
            voiceEnabled={voiceEnabled}
            studentName={profile.name}
          />
        )}

        {activeTab === 'resep-dokter' && (
          <DoctorPrescriptionZone
            soundEnabled={soundEnabled}
            voiceEnabled={voiceEnabled}
            onAddStar={handleAddStar}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeTab === 'manfaat' && (
          <DailyLifeBenefitsZone
            soundEnabled={soundEnabled}
            voiceEnabled={voiceEnabled}
            onAddStar={handleAddStar}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeTab === 'tabel-rimba' && (
          <InteractiveTableZone
            soundEnabled={soundEnabled}
            voiceEnabled={voiceEnabled}
            onAddStar={handleAddStar}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeTab === 'soal-cerita' && (
          <StoryProblemsZone
            soundEnabled={soundEnabled}
            voiceEnabled={voiceEnabled}
            onAddStar={handleAddStar}
            onUnlockBadge={handleUnlockBadge}
          />
        )}

        {activeTab === 'kuis' && (
          <QuizZone
            soundEnabled={soundEnabled}
            voiceEnabled={voiceEnabled}
            profile={profile}
            onAddStar={handleAddStar}
            onUnlockBadge={handleUnlockBadge}
            onUpdateQuizScore={handleUpdateQuizScore}
            onOpenCertificate={() => setIsCertificateOpen(true)}
          />
        )}

        {activeTab === 'generator' && (
          <PrintGeneratorZone soundEnabled={soundEnabled} />
        )}
      </main>

      {/* Squadron Footer */}
      <footer className="no-print bg-slate-900 text-slate-100 border-t-4 border-amber-400 mt-12 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="text-3xl bg-slate-800 p-2 rounded-2xl border border-slate-700">✈️</span>
            <div>
              <p className="font-black text-amber-300 text-sm sm:text-base">
                Skadron Perkalian • Matematika Kelas 2 SD
              </p>
              <p className="text-xs text-slate-400 font-semibold">
                Konsep Penjumlahan Berulang (Resep Dokter 3x1 = 1+1+1) & Pemecahan Masalah Nyata
              </p>
              <p className="text-[11px] text-slate-500 font-semibold">
                Created by: Widodo guru SD
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => {
                playPop(soundEnabled);
                setIsProfileOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 text-xs font-black border border-slate-600 transition-colors"
            >
              👤 Profil {profile.name}
            </button>
            <button
              onClick={() => {
                playPop(soundEnabled);
                setIsCertificateOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-black shadow transition-colors"
            >
              🏆 Piagam Pilot
            </button>
            <button
              onClick={() => {
                playPop(soundEnabled);
                setIsHelpOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black border border-slate-600 transition-colors"
            >
              ❓ Bantuan & Tips
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <div className="no-print">
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          soundEnabled={soundEnabled}
        />

        <HelpModal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
          soundEnabled={soundEnabled}
        />

        <CertificateModal
          isOpen={isCertificateOpen}
          onClose={() => setIsCertificateOpen(false)}
          profile={profile}
          score={profile.quizScore ?? 100}
          soundEnabled={soundEnabled}
        />
      </div>
    </div>
  );
}
