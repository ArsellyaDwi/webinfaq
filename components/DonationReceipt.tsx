
import React from 'react';
import { DonationDetail } from '../types';
import { formatRupiah } from '../utils/format';
import { IconMoon } from './Icons';

interface DonationReceiptProps {
  details: DonationDetail;
  onClose: () => void;
}

export const DonationReceipt: React.FC<DonationReceiptProps> = ({ details, onClose }) => {
  return (
    <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-emerald-500 animate-in zoom-in-95 duration-500">
      <div className="bg-emerald-600 p-8 text-center text-white relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none flex justify-center items-center text-9xl">
          <IconMoon size={120} />
        </div>
        <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-emerald-700 mx-auto mb-4 shadow-lg border-4 border-white">
          <IconMoon size={40} />
        </div>
        <h2 className="text-2xl font-black">Bukti Infaq Takjil</h2>
        <p className="text-emerald-100 opacity-90 text-sm italic">"Tangan di atas lebih baik dari tangan di bawah"</p>
      </div>

      <div className="p-8 space-y-5 relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono tracking-tighter">
            <span>ID TRANSAKSI</span>
            <span>{details.id}</span>
          </div>
          <div className="h-px w-full bg-slate-100" />
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm">Donatur</span>
            <span className="font-bold text-slate-800">{details.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm">Jurusan</span>
            <span className="font-bold text-emerald-700">{details.major}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm">Angkatan</span>
            <span className="font-bold text-slate-800">{details.batch}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm">Tanggal</span>
            <span className="font-bold text-slate-800">{details.date}</span>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-100 text-center shadow-inner">
          <span className="block text-yellow-700 text-[10px] font-black uppercase tracking-widest mb-1">Total Sedekah</span>
          <span className="text-3xl font-black text-emerald-700">{formatRupiah(details.amount)}</span>
        </div>

        <div className="pt-4 text-center space-y-4">
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">HIMPUNAN MAHASISWA INFORMATIKA</p>
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-200"
          >
            Alhamdulillah, Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
