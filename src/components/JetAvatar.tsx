import React from 'react';
import { Plane, PlaneTakeoff, PlaneLanding } from 'lucide-react';

export interface PlaneOption {
  id: string;
  name: string;
  desc: string;
  color: string; // text color class
  bg: string; // background class
  variant: 'plane' | 'takeoff' | 'landing';
}

export const PLANE_OPTIONS: PlaneOption[] = [
  { id: 'jet-biru', name: 'Falcon', desc: 'Pesawat Biru Cepat', color: 'text-sky-600', bg: 'bg-sky-100', variant: 'plane' },
  { id: 'jet-merah', name: 'Thunder', desc: 'Pesawat Merah Berani', color: 'text-rose-600', bg: 'bg-rose-100', variant: 'plane' },
  { id: 'jet-kuning', name: 'Sunny', desc: 'Pesawat Kuning Ceria', color: 'text-amber-500', bg: 'bg-amber-100', variant: 'takeoff' },
  { id: 'jet-hijau', name: 'Rimba', desc: 'Pesawat Hijau Tangguh', color: 'text-emerald-600', bg: 'bg-emerald-100', variant: 'plane' },
  { id: 'jet-ungu', name: 'Nova', desc: 'Pesawat Ungu Cerdas', color: 'text-purple-600', bg: 'bg-purple-100', variant: 'takeoff' },
  { id: 'jet-oranye', name: 'Blaze', desc: 'Pesawat Oranye Lincah', color: 'text-orange-500', bg: 'bg-orange-100', variant: 'landing' },
  { id: 'jet-pink', name: 'Bloom', desc: 'Pesawat Pink Gembira', color: 'text-pink-500', bg: 'bg-pink-100', variant: 'plane' },
  { id: 'jet-abu', name: 'Storm', desc: 'Pesawat Abu Kapten', color: 'text-slate-700', bg: 'bg-slate-200', variant: 'landing' },
];

export function getPlaneOption(id: string): PlaneOption {
  return PLANE_OPTIONS.find((p) => p.id === id) || PLANE_OPTIONS[0];
}

interface PlaneIconProps {
  variant: PlaneOption['variant'];
  className?: string;
}

export const PlaneIcon: React.FC<PlaneIconProps> = ({ variant, className = '' }) => {
  if (variant === 'takeoff') return <PlaneTakeoff className={className} strokeWidth={2.4} />;
  if (variant === 'landing') return <PlaneLanding className={className} strokeWidth={2.4} />;
  return <Plane className={className} strokeWidth={2.4} />;
};

interface JetAvatarProps {
  avatar: string;
  className?: string;
  withBg?: boolean;
}

// Avatar pilot selalu berupa ikon pesawat berwarna.
export const JetAvatar: React.FC<JetAvatarProps> = ({ avatar, className = 'w-8 h-8', withBg = false }) => {
  const opt = getPlaneOption(avatar);
  const icon = <PlaneIcon variant={opt.variant} className={`${opt.color} w-full h-full`} />;
  if (!withBg) return <span className={`inline-flex items-center justify-center ${className}`}>{icon}</span>;
  return (
    <span className={`inline-flex items-center justify-center rounded-xl p-1.5 ${opt.bg} ${className}`}>{icon}</span>
  );
};
