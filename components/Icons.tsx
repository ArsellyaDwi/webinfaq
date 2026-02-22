
import React from 'react';

// Common interface for icon properties
interface IconProps {
  size?: number;
  className?: string;
  stroke?: number;
}

const BaseIcon = ({ children, size = 24, stroke = 2, className }: { children: React.ReactNode } & IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

export const IconWallet = ({ size = 24, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></BaseIcon>
);

export const IconHeart = ({ size = 24, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></BaseIcon>
);

export const IconGift = ({ size = 24, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5Z"/></BaseIcon>
);

export const IconCoins = ({ size = 24, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18.06"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></BaseIcon>
);

export const IconUser = ({ size = 20, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></BaseIcon>
);

export const IconLogOut = ({ size = 20, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></BaseIcon>
);

export const IconShield = ({ size = 20, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></BaseIcon>
);

export const IconInstagram = ({ size = 20, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></BaseIcon>
);

export const IconDownload = ({ size = 18, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></BaseIcon>
);

export const IconTrash = ({ size = 16, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></BaseIcon>
);

export const IconEdit = ({ size = 16, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></BaseIcon>
);

export const IconMosque = ({ size = 16, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}>
    <path d="M2 20h20"/><path d="M7 20v-5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5"/>
    <path d="M12 11V3"/><path d="m12 3-3 3h6z"/>
    <path d="M4 20v-3a1 1 0 0 1 1-1h2"/><path d="M20 20v-3a1 1 0 0 0-1-1h-2"/>
  </BaseIcon>
);

export const IconMoon = ({ size = 24, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></BaseIcon>
);

export const IconCamera = ({ size = 20, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></BaseIcon>
);

export const IconHandshake = ({ size = 20, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><path d="m11 17 2 2 6-6"/><path d="m8 14 2.5 2.5"/><path d="M5 18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5l-5-5-5 5v5Z"/><circle cx="12" cy="5" r="3"/></BaseIcon>
);

export const IconTrendingUp = ({ size = 24, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></BaseIcon>
);

export const IconKeyboard = ({ size = 16, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M6 12h.01"/><path d="M18 12h.01"/><path d="M10 12h4"/><path d="M6 16h.01"/><path d="M10 16h.01"/><path d="M14 16h.01"/><path d="M18 16h.01"/></BaseIcon>
);

export const IconPackage = ({ size = 24, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><path d="M16.5 9.4 7.5 4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></BaseIcon>
);

export const IconSparkles = ({ size = 16, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><path d="m12 3 1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></BaseIcon>
);

export const IconCheckCircle = ({ size = 16, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></BaseIcon>
);

export const IconLock = ({ size = 16, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></BaseIcon>
);

export const IconFileText = ({ size = 16, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></BaseIcon>
);

export const IconRocket = ({ size = 20, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"/><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"/></BaseIcon>
);

export const IconZap = ({ size = 16, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></BaseIcon>
);

export const IconPrinter = ({ size = 16, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></BaseIcon>
);

export const IconEye = ({ size = 16, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></BaseIcon>
);

export const IconSparkle = ({ size = 16, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063L3 12l5.5-2.063A2 2 0 0 0 9.937 8.5L12 3l2.063 5.5A2 2 0 0 0 15.5 9.937L21 12l-5.5 2.063A2 2 0 0 0 14.063 15.5L12 21l-2.063-5.5Z" />
  </BaseIcon>
);

export const IconX = ({ size = 24, className, stroke }: IconProps) => (
  <BaseIcon size={size} className={className} stroke={stroke}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </BaseIcon>
);
