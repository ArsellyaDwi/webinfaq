
import React, { useState } from 'react';
import { DonationDetail, User } from '../types';
import { IconMoon, IconZap } from './Icons';

interface DonationFormProps {
  initialAmount: number;
  initialData?: DonationDetail | null;
  currentUser: User | null;
  onCancel: () => void;
  onSubmit: (details: Omit<DonationDetail, 'date' | 'id'>) => void;
}

export const DonationForm: React.FC<DonationFormProps> = ({ initialAmount, initialData, currentUser, onCancel, onSubmit }) => {
  const [name, setName] = useState(currentUser?.name || initialData?.name || '');
  const [batch, setBatch] = useState(currentUser?.batch || initialData?.batch || '');
  const [major, setMajor] = useState(currentUser?.major || initialData?.major || '');
  const [amount, setAmount] = useState(initialData?.amount || initialAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && batch && major && amount >= 0) {
      onSubmit({ name, batch, major, amount, wishes: "", username: currentUser?.username });
    }
  };

  return (
    <div className="w-full max-w-lg bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
      <button 
        onClick={onCancel} 
        className="mb-8 px-6 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest hover:text-emerald-600 transition-colors flex items-center gap-2 shadow-sm"
      >
        <span>←</span> Kembali
      </button>

      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase tracking-widest flex items-center justify-center gap-2">
          Siapkan Infaq <IconMoon size={24} />
        </h2>
        <p className="text-slate-400 mt-2 font-bold text-[10px] uppercase tracking-widest">Lengkapi Data Amal Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">NAMA LENGKAP</label>
          <input
            required
            type="text"
            placeholder="Masukkan nama lengkap anda"
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">ANGKATAN</label>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-1 -mt-1">Contoh: 2024</p>
            <input
              required
              type="text"
              placeholder="Tahun Masuk"
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">JURUSAN</label>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-1 -mt-1">Contoh: Informatika</p>
            <input
              required
              type="text"
              placeholder="Program Studi"
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">NOMINAL INFAQ</label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">Rp</span>
            <input
              readOnly
              required
              type="number"
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-100 border-2 border-transparent outline-none transition-all font-black text-emerald-700 text-xl cursor-not-allowed"
              value={amount === 0 ? '' : amount}
              placeholder="0"
            />
          </div>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-2">Nominal telah dipilih otomatis</p>
        </div>

        <button
          type="submit"
          className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-sm hover:bg-emerald-600 shadow-xl transition-all active:scale-95 uppercase tracking-widest mt-4 flex items-center justify-center gap-2"
        >
          Konfirmasi <IconZap />
        </button>
      </form>
    </div>
  );
};
