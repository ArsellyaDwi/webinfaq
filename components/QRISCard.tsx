
import React from 'react';
import { formatRupiah } from '../utils/format';

interface QRISCardProps {
  amount?: number;
  customImageUrl?: string;
}

function generateCRC16(data: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

const fTag = (tag: string, value: string) => {
  return tag + value.length.toString().padStart(2, '0') + value;
};

export const QRISCard: React.FC<QRISCardProps> = ({ amount, customImageUrl }) => {
  const adminFee = amount ? 500 : 0;
  const totalAmount = amount ? amount + adminFee : 0;

  const generatePayload = () => {
    const name = "ARSELLYADWI, MAKANAN & MINUMAN";
    const city = "MALANG";
    const nmid = "ID1026486658762";
    const pmid = "93600914";

    let payload = "000201010212"; 
    const sub26_00 = fTag("00", "ID.CO.QRIS.WWW");
    const sub26_01 = fTag("01", nmid);
    const sub26_02 = fTag("02", pmid + "000000001");
    const sub26_03 = fTag("03", "UMI");
    payload += fTag("26", sub26_00 + sub26_01 + sub26_02 + sub26_03);
    payload += "520459995303360";
    if (totalAmount > 0) payload += fTag("54", totalAmount.toString());
    payload += "5802ID";
    payload += fTag("59", name);
    payload += fTag("60", city);
    payload += "6304";
    return payload + generateCRC16(payload);
  };
  
  const qrisPayload = generatePayload();
  const qrSource = customImageUrl || `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrisPayload)}&margin=0`;
  
  return (
    <div className="w-full max-w-[420px] bg-white rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(16,185,129,0.15)] border border-emerald-100 overflow-hidden flex flex-col font-sans relative group transition-all duration-700">
      {/* Premium Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-60 blur-3xl group-hover:bg-emerald-100 transition-colors duration-700" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 rounded-full -ml-32 -mb-32 opacity-60 blur-3xl group-hover:bg-emerald-100 transition-colors duration-700" />
      
      {/* Elegant Corner Accents - Green instead of Red */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-600 -translate-x-12 -translate-y-12 rotate-45 z-10 shadow-lg opacity-20" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-emerald-600 translate-x-12 translate-y-12 rotate-45 z-10 shadow-lg opacity-20" />

      <div className="p-10 flex flex-col items-center z-20 relative">
        {/* Header Section */}
        <div className="text-center mb-8 space-y-2">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-200 shadow-sm">
             <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
             Infaq Takjil Ramadhan
           </div>
           <h2 className="text-2xl font-[1000] text-slate-900 uppercase tracking-tighter leading-none pt-2">
             Scan untuk Infaq <br/> <span className="text-emerald-600 italic">Takjil Ramadhan</span>
           </h2>
        </div>

        {/* QR Code Container - Ultra Premium */}
        <div className="relative w-full aspect-square mb-8">
          <div className="absolute inset-0 bg-emerald-600/5 rounded-[3rem] blur-3xl group-hover:bg-emerald-600/10 transition-all duration-700" />
          <div className="relative h-full w-full bg-white p-6 rounded-[3rem] border border-emerald-50 shadow-[0_20px_50px_rgba(16,185,129,0.08)] flex items-center justify-center overflow-hidden group-hover:border-emerald-200 transition-all duration-500">
            {/* Corner Markers */}
            <div className="absolute top-6 left-6 w-6 h-6 border-t-4 border-l-4 border-emerald-500/40 rounded-tl-xl" />
            <div className="absolute top-6 right-6 w-6 h-6 border-t-4 border-r-4 border-emerald-500/40 rounded-tr-xl" />
            <div className="absolute bottom-6 left-6 w-6 h-6 border-b-4 border-l-4 border-emerald-500/40 rounded-bl-xl" />
            <div className="absolute bottom-6 right-6 w-6 h-6 border-b-4 border-r-4 border-emerald-500/40 rounded-br-xl" />

            <img 
              src={qrSource} 
              alt="QRIS" 
              className="w-full h-full object-contain relative z-10 p-2"
            />
            
            {!customImageUrl && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                 <div className="w-14 h-14 bg-white rounded-2xl border border-emerald-50 flex items-center justify-center shadow-2xl">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="Q" className="w-10" />
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Amount & Instruction Section */}
        <div className="w-full space-y-6 text-center">
          {amount && (
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-3">Total Pembayaran</p>
               <div className="flex items-baseline justify-center gap-1.5">
                 <span className="text-emerald-400 font-black text-lg">Rp</span>
                 <p className="text-4xl font-[1000] text-white tracking-tighter leading-none">
                   {(totalAmount).toLocaleString('id-ID')}
                 </p>
               </div>
               <div className="mt-4 pt-4 border-t border-white/10">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Flat Admin Fee: Rp500 • Verified</p>
               </div>
            </div>
          )}

          <div className="space-y-4 px-2">
            <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
              Silakan scan QRIS di atas menggunakan <span className="text-slate-900 font-black">GoPay, DANA, OVO</span>, atau <span className="text-slate-900 font-black">mobile banking</span> Anda.
            </p>
            <div className="h-px w-12 bg-emerald-200 mx-auto" />
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              Total pembayaran sudah termasuk biaya admin tetap sebesar Rp500.
            </p>
          </div>
        </div>

        {/* Merchant Footer */}
        <div className="w-full mt-10 pt-8 border-t border-emerald-50 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
             <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS" className="h-4 opacity-40" />
          </div>
        </div>
      </div>
    </div>
  );
};
