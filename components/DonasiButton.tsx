
import React from 'react';
import { DonationOption } from '../types';
import { IconWallet, IconHeart, IconGift, IconCoins } from './Icons';

interface DonasiButtonProps {
  option: DonationOption;
  onClick: (e: React.MouseEvent, value: number) => void;
}

export const DonasiButton: React.FC<DonasiButtonProps> = ({ option, onClick }) => {
  const getIcon = () => {
    switch (option.id) {
      case '5k': return <IconWallet />;
      case '10k': return <IconCoins />;
      case '20k': return <IconGift />;
      case '50k': return <IconHeart />;
      default: return <IconWallet />;
    }
  };

  return (
    <button
      onClick={(e) => onClick(e, option.value)}
      className="group relative flex flex-col items-center justify-center bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-500 active:scale-95 shadow-sm hover:shadow-xl"
    >
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner">
        {getIcon()}
      </div>
      <span className="text-lg font-black text-slate-800 tracking-tight">
        {option.label}
      </span>
      <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};
