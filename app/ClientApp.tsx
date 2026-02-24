'use client';

import React, { useState, useEffect } from 'react';
import { DonasiButton } from '@/components/DonasiButton';
import { ProgressBar } from '@/components/ProgressBar';
import { QRISCard } from '@/components/QRISCard';
import { DonationForm } from '@/components/DonationForm';
import { DonationReceipt } from '@/components/DonationReceipt';
import { formatRupiah } from '@/utils/format';
import { maskName } from '@/utils/mask';
import { exportToPDF } from '@/utils/export';
import {
  IconUser,
  IconLogOut,
  IconShield,
  IconInstagram,
  IconDownload,
  IconTrash,
  IconEdit,
  IconMosque,
  IconMoon,
  IconCamera,
  IconHandshake,
  IconTrendingUp,
  IconKeyboard,
  IconPackage,
  IconSparkles,
  IconCheckCircle,
  IconLock,
  IconFileText,
  IconRocket,
  IconZap,
  IconPrinter,
  IconEye,
  IconSparkle,
  IconX,
} from '@/components/Icons';
import { DonationOption, Coin, DonationDetail, ViewState, User, Activity, QrisConfig } from '@/types';
import * as actions from './actions';

const DONATION_OPTIONS: DonationOption[] = [
  { label: 'Rp5.000', value: 5000, id: '5k' },
  { label: 'Rp10.000', value: 10000, id: '10k' },
  { label: 'Rp20.000', value: 20000, id: '20k' },
  { label: 'Rp50.000', value: 50000, id: '50k' },
];

const TARGET_DONASI = 5000000;

interface ClientAppProps {
  initialActivities: Activity[];
  initialDonations: DonationDetail[];
}

const ClientApp: React.FC<ClientAppProps> = ({ initialActivities, initialDonations }) => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('home');
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [donationData, setDonationData] = useState<DonationDetail | null>(null);
  const [tempProof, setTempProof] = useState<string | null>(null);
  const [tempActivityImage, setTempActivityImage] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [showManualDonation, setShowManualDonation] = useState(false);
  const [editingDonation, setEditingDonation] = useState<DonationDetail | null>(null);
  const [customAmount, setCustomAmount] = useState<number | ''>('');
  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const [toast, setToast] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const [showMenu, setShowMenu] = useState(false);

  const [profileForm, setProfileForm] = useState({ username: '', name: '', major: '', batch: '', phone: '', password: '' });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [adminLoginForm, setAdminLoginForm] = useState({ name: '', password: '' });

  // Data Awal
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [transactions, setTransactions] = useState<DonationDetail[]>(initialDonations);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [qrisConfigs, setQrisConfigs] = useState<QrisConfig[]>([]);

  const [resetForm, setResetForm] = useState({ name: '', newPassword: '' });
  const [changePasswordForm, setChangePasswordForm] = useState({ newPassword: '' });

  // Database Lifecycle
  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await actions.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setProfileForm({
          username: currentUser.username || '',
          name: currentUser.name,
          major: currentUser.major,
          batch: currentUser.batch,
          phone: currentUser.phone || '',
          password: ''
        });
      }
    };
    loadUser();

    const loadQris = async () => {
      const configs = await actions.getQrisConfigs();
      setQrisConfigs(configs);
    };
    loadQris();
  }, []);

  const currentDonasi = transactions.reduce((sum, t) => sum + t.amount, 0);
  const isAdmin = user?.role === 'admin';

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const triggerCoins = (e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const newCoins: Coin[] = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 80,
      y: y + (Math.random() - 0.5) * 80,
    }));
    setCoins((prev) => [...prev, ...newCoins]);
    setTimeout(() => {
      setCoins((prev) => prev.filter(c => !newCoins.find(nc => nc.id === c.id)));
    }, 1500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      ...profileForm,
      username: profileForm.name, // Use name as username
      role: 'user',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.name)}&background=10b981&color=fff`
    };

    const result = await actions.registerUser(newUser);
    if (result.success) {
      showToast("Pendaftaran berhasil! Silakan masuk. 👋");
      setView('auth');
    } else {
      alert(result.error || "Pendaftaran gagal.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await actions.loginUser(loginForm);
    if ('error' in result) {
      alert(result.error);
    } else {
      setUser(result as any);
      setProfileForm({
        username: result.username || '',
        name: result.name,
        major: result.major,
        batch: result.batch,
        phone: result.phone || '',
        password: ''
      });
      setView('home');
      showToast(`Selamat datang, ${result.name}! 👋`);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.username) return;

    const updatedUser: User = {
      ...user,
      name: profileForm.name,
      major: profileForm.major,
      batch: profileForm.batch,
      phone: profileForm.phone,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profileForm.name)}&background=10b981&color=fff`
    };

    const result = await actions.updateUser(updatedUser);
    if (result.success && result.user) {
      setUser(result.user);
      showToast("Profil diperbarui! ✅");
    } else {
      alert(result.error || "Gagal memperbarui profil.");
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await actions.loginUser({
      username: adminLoginForm.name,
      password: adminLoginForm.password
    });

    if ('error' in result) {
      alert(result.error);
    } else if (result.role !== 'admin') {
      alert('Anda tidak memiliki akses admin!');
      await actions.logoutUser();
    } else {
      setUser(result as any);
      setProfileForm({
        username: result.username || '',
        name: result.name,
        major: result.major,
        batch: result.batch,
        phone: result.phone || '',
        password: ''
      });
      setView('home');
      showToast(`Selamat datang kembali, Admin ${result.name}! 🚀`);

      const users = await actions.getAdminUsers();
      setAllUsers(users);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await actions.resetPassword(resetForm.name, resetForm.newPassword);
    if (result.success) {
      showToast("Password berhasil direset! Silakan masuk. ✅");
      setView('auth');
    } else {
      alert(result.error || "Nama tidak ditemukan atau gagal reset.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.username) return;
    const result = await actions.changePassword(user.username, changePasswordForm.newPassword);
    if (result.success) {
      showToast("Password berhasil diubah! 🔐");
      setChangePasswordForm({ newPassword: '' });
    } else {
      alert(result.error || "Gagal mengubah password.");
    }
  };

  const logout = async () => {
    await actions.logoutUser();
    setUser(null);
    setView('home');
    showToast("Berhasil keluar.");
  };

  const handleEditActivity = (act: Activity) => {
    setEditingActivity(act);
    setTempActivityImage(act.imageUrl);
    setView('gallery_upload');
  };

  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    let activityToSave: Activity;

    if (editingActivity) {
      activityToSave = {
        ...editingActivity,
        title,
        description,
        imageUrl: tempActivityImage || editingActivity.imageUrl
      };
    } else {
      if (!tempActivityImage) return alert("Pilih foto terlebih dahulu!");
      activityToSave = {
        id: 'ACT' + Date.now(),
        title,
        imageUrl: tempActivityImage,
        description,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      };
    }

    const result = await actions.saveActivity(activityToSave);
    if (result.success) {
      const savedActivity = {
        ...activityToSave,
        id: result.id as string,
        date: result.date as string
      };
      if (editingActivity) {
        setActivities(prev => prev.map(a => a.id === editingActivity.id ? savedActivity : a));
        showToast("Laporan diperbarui! ✅");
      } else {
        setActivities(prev => [savedActivity, ...prev]);
        showToast("Berhasil diterbitkan! 📸");
      }
      setView('home');
    } else {
      showToast(result.error || "Gagal menyimpan laporan.");
    }

    setTempActivityImage(null);
    setEditingActivity(null);
  };

  const finalizeDonation = async () => {
    if (donationData) {
      const finalData = { ...donationData, proofImage: tempProof || undefined };
      const result = await actions.saveDonation(finalData);
      if (result.success) {
        const savedDonation = {
          ...finalData,
          id: result.id as string,
          date: result.date as string
        };
        setTransactions((prev) => [savedDonation, ...prev]);
        setTempProof(null);
        setDonationData(savedDonation);
        setView('receipt');
        showToast("Infaq telah tercatat! 🙏");
      } else {
        showToast(result.error || "Gagal mencatat infaq.");
      }
    }
  };

  const deleteDonation = async (id: string) => {
    const result = await actions.deleteDonation(id);
    if (result.success) {
      setTransactions(prev => prev.filter(x => x.id !== id));
      showToast("Donasi dihapus.");
    } else {
      showToast(result.error || "Gagal menghapus donasi.");
    }
  };

  const deleteActivity = async (id: string) => {
    const result = await actions.deleteActivity(id);
    if (result.success) {
      setActivities(prev => prev.filter(x => x.id !== id));
      showToast("Laporan dihapus.");
    } else {
      showToast(result.error || "Gagal menghapus laporan.");
    }
  };

  const openNewsPage = (act: Activity) => {
    setSelectedActivity(act);
    setView('activity_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Transaksi Pribadi User
  const myTransactions = transactions.filter(t =>
    user && t.name === user.name && t.major === user.major && t.batch === user.batch
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-100 overflow-x-hidden">
      {/* COINS ANIMATION */}
      <div className="fixed inset-0 pointer-events-none z-[999]">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="absolute w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg animate-bounce"
            style={{
              left: coin.x,
              top: coin.y,
              transition: 'all 1.5s ease-out',
              opacity: 0,
              transform: 'translateY(100px) rotate(360deg)',
            }}
          >
            🪙
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl animate-in slide-in-from-top-10 duration-500 border border-emerald-500/50">
          {toast}
        </div>
      )}

      {/* PRATINJAU PREMIUM (POSTER) MODAL - DESAIN ASLI DIKEMBALIKAN */}
      {showShareModal && selectedActivity && (
        <div className="fixed inset-0 z-[200] bg-slate-950/98 backdrop-blur-xl flex items-start justify-center p-4 overflow-y-auto no-print" onClick={() => setShowShareModal(false)}>
          <div className="relative max-w-[440px] w-full flex flex-col gap-6 animate-in zoom-in-95 duration-500 my-auto pb-10" onClick={e => e.stopPropagation()}>

            <div className="w-full aspect-[9/16] bg-white rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] overflow-hidden relative flex flex-col border-[12px] border-white">
              <div className="h-[62%] relative overflow-hidden m-2 rounded-[1.8rem] shadow-inner bg-slate-100">
                <img src={selectedActivity.imageUrl} className="w-full h-full object-cover" alt="Poster Hero" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                  <div className="px-5 py-2.5 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border border-white/20">HATI UPDATES</div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl border border-white/20 flex items-center justify-center text-white"><IconSparkles size={24} /></div>
                </div>

                <div className="absolute bottom-6 left-8 right-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-0.5 w-12 bg-emerald-400 rounded-full"></div>
                    <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em]">{selectedActivity.date}</p>
                  </div>
                  <h2 className="text-4xl font-[1000] text-white uppercase tracking-tighter leading-[0.85] drop-shadow-2xl">{selectedActivity.title}</h2>
                </div>
              </div>

              <div className="flex-1 px-10 py-8 flex flex-col justify-between bg-white relative">
                <div className="absolute top-0 right-10 -translate-y-1/2 w-16 h-16 bg-emerald-600 rounded-3xl rotate-12 flex items-center justify-center text-white shadow-xl">
                  <IconMosque size={28} />
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-2 right-4 text-emerald-200/50"><IconMoon size={40} /></div>
                    <p className="text-slate-700 text-[13px] font-bold leading-relaxed italic relative z-10">"{selectedActivity.description}"</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-900 rounded-[1.2rem] flex items-center justify-center text-white font-[1000] text-3xl shadow-2xl">H</div>
                    <div>
                      <p className="text-sm font-black text-slate-900 uppercase leading-none tracking-tight">HATI HMIF</p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.1em] mt-1 italic">ITN Malang '25</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">VERIFIED POST</p>
                    <div className="flex items-center gap-1 text-emerald-600 mt-1">
                      <IconCheckCircle size={12} /> <span className="text-[10px] font-black uppercase">OFFICIAL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => setShowShareModal(false)} className="w-full py-5 bg-white/10 text-white font-[1000] rounded-2xl hover:bg-white/20 transition-all text-xs uppercase tracking-[0.2em] border border-white/20">KEMBALI KE BERANDA</button>
            <p className="text-center text-white/40 text-[9px] font-bold uppercase tracking-widest">Screenshot layar untuk menyimpan Poster Premium</p>
          </div>
        </div>
      )}

      {/* SIDE MENU DRAWER */}
      {showMenu && (
        <div className="fixed inset-0 z-[150] bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowMenu(false)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-xs bg-white shadow-2xl p-8 animate-in slide-in-from-right duration-500" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
                <p className="text-[10px] font-black uppercase tracking-widest">HATI MENU</p>
              </div>
              <button onClick={() => setShowMenu(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all">
                <IconX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <button onClick={() => { setView('home'); setShowMenu(false); }} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 transition-all group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all"><IconMosque size={20} /></div>
                <p className="font-black text-xs uppercase tracking-widest">Beranda</p>
              </button>
              <button onClick={() => { setView('all_activities'); setShowMenu(false); }} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 transition-all group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all"><IconCamera size={20} /></div>
                <p className="font-black text-xs uppercase tracking-widest">Semua Dokumentasi</p>
              </button>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2">Social Media</p>
                <a href="https://www.instagram.com/hati_itn_malang?igsh=dnF6NmM4ZGRtcnZy" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 transition-all group">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all"><IconInstagram size={20} /></div>
                  <p className="font-black text-[10px] uppercase tracking-widest">HATI ITN MALANG</p>
                </a>
                <a href="https://www.instagram.com/informatika.itn?igsh=N2N5c2JheWdwdnU1" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 transition-all group">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all"><IconInstagram size={20} /></div>
                  <p className="font-black text-[10px] uppercase tracking-widest">INFORMATIKA ITN</p>
                </a>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8 text-center">
              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">HMIF ITN MALANG</p>
            </div>
          </div>
        </div>
      )}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm no-print pointer-events-auto">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg animate-hati-logo">H</div>
          <div className="animate-nav-text">
            <p className="text-xs font-black text-emerald-600 uppercase tracking-tight group-hover:text-slate-900 transition-all">HATI ITN Malang</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">HMIF Teknik Informatika</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setShowMenu(!showMenu)} className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-slate-100 relative group cursor-pointer">
            <IconPackage size={20} />
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest whitespace-nowrap pointer-events-none">Menu Utama</span>
          </button>

          {user && (
            <div className="flex items-center gap-2">
              <div onClick={() => setView('profile')} className={`flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-2xl border cursor-pointer hover:border-emerald-500 transition-all ${isAdmin ? 'bg-slate-900 text-white border-slate-700' : 'bg-emerald-50 text-emerald-900 border-emerald-100'}`}>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{isAdmin ? 'ADMIN' : user.batch}</p>
                  <p className="text-sm font-bold leading-none">{user.name}</p>
                </div>
                <img src={user.avatar} className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/20" alt="avatar" />
                <button type="button" onClick={(e) => { e.stopPropagation(); logout(); }} className="p-1.5 hover:text-red-400 transition-colors"><IconLogOut /></button>
              </div>
            </div>
          )}
          {!user && (
            <button type="button" onClick={() => setView('login_portal')} className="px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-black hover:bg-emerald-600 transition-all shadow-xl cursor-pointer">MASUK</button>
          )}
        </div>
      </nav>

      {/* AUTH VIEW (LOGIN/REGISTER) */}
      {view === 'auth' && (
        <div className="min-h-screen flex items-start justify-center p-6 pt-32 pb-12 animate-in zoom-in-95 duration-500 overflow-y-auto">
          <div className="w-full max-w-md bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100">
            <button onClick={() => setView('home')} className="mb-10 px-6 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest hover:text-emerald-600 transition-all flex items-center gap-2"><span>←</span> Kembali</button>
            <div className="text-center mt-12 mb-10 space-y-4">
              <h2 className="text-4xl font-[1000] text-slate-900 uppercase tracking-tighter">MASUK DONATUR</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Silakan masuk ke akun Anda</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">NAMA LENGKAP</label>
                <input required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold" placeholder="Masukkan nama lengkap anda" value={loginForm.username} onChange={e => setLoginForm({ ...loginForm, username: e.target.value })} />
              </div>
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">PASSWORD</label>
                <div className="relative">
                  <input
                    required
                    type={showPasswords['login'] ? 'text' : 'password'}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold pr-14"
                    placeholder="Masukkan password"
                    value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword('login')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPasswords['login'] ? <IconEye size={20} /> : <IconLock size={20} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">MASUK DONATUR <IconSparkles /></button>
              <div className="flex flex-col gap-3 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Lupa password? <button type="button" onClick={() => setView('forgot_password')} className="text-emerald-600 font-black hover:underline">RESET DISINI</button></p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Belum punya akun? <button type="button" onClick={() => setView('profile_setup')} className="text-emerald-600 font-black hover:underline">DAFTAR DISINI</button></p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD VIEW */}
      {view === 'forgot_password' && (
        <div className="min-h-screen flex items-start justify-center p-6 pt-32 pb-12 animate-in zoom-in-95 duration-500 overflow-y-auto">
          <div className="w-full max-w-md bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100">
            <button onClick={() => setView('auth')} className="mb-10 px-6 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest hover:text-emerald-600 transition-all flex items-center gap-2"><span>←</span> Kembali</button>
            <div className="text-center mt-12 mb-10 space-y-4">
              <h2 className="text-4xl font-[1000] text-slate-900 uppercase tracking-tighter">LUPA PASSWORD</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Masukkan Nama Lengkap Anda</p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">NAMA LENGKAP</label>
                <input required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold" placeholder="Nama lengkap sesuai pendaftaran" value={resetForm.name} onChange={e => setResetForm({ ...resetForm, name: e.target.value })} />
              </div>
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">PASSWORD BARU</label>
                <div className="relative">
                  <input
                    required
                    type={showPasswords['reset'] ? 'text' : 'password'}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold pr-14"
                    placeholder="••••••••"
                    value={resetForm.newPassword}
                    onChange={e => setResetForm({ ...resetForm, newPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword('reset')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPasswords['reset'] ? <IconEye size={20} /> : <IconLock size={20} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">RESET PASSWORD <IconZap /></button>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-[9px] font-bold text-emerald-700 uppercase leading-relaxed">Hubungi Admin jika masih bermasalah: <br /> <span className="text-[11px] font-black">+62 878-2246-3210 (Admin Arsellya)</span></p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PORTAL VIEW */}
      {view === 'login_portal' && (
        <div className="min-h-screen flex items-start justify-center p-6 pt-32 pb-12 animate-in zoom-in-95 duration-500 overflow-y-auto">
          <div className="w-full max-w-xl bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100">
            <button onClick={() => setView('home')} className="mb-10 px-6 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest hover:text-emerald-600 transition-all flex items-center gap-2"><span>←</span> Kembali</button>
            <div className="text-center mb-12 space-y-4">
              <div className="w-20 h-20 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl animate-hati-logo"><IconMosque size={40} /></div>
              <h2 className="text-4xl font-[1000] text-slate-900 uppercase tracking-tighter">PILIH PORTAL</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pilih jenis akses Anda</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button onClick={() => setView('auth')} className="group p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-500 text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-3xl mx-auto flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all"><IconUser size={32} /></div>
                <div><p className="font-black text-slate-900 uppercase tracking-tight">MASUK DONATUR</p><p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Daftar & Berinfaq</p></div>
              </button>
              <button onClick={() => setView('admin_login')} className="group p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 hover:border-emerald-500 hover:bg-slate-800 transition-all duration-500 text-center space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-3xl mx-auto flex items-center justify-center text-emerald-400 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all"><IconShield size={32} /></div>
                <div><p className="font-black text-white uppercase tracking-tight">LOGIN ADMIN</p><p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Panitia Khusus</p></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DONOR SETUP VIEW - DENGAN LABEL */}
      {view === 'profile_setup' && (
        <div className="min-h-screen flex items-start justify-center p-6 pt-32 pb-12 animate-in zoom-in-95 overflow-y-auto">
          <div className="w-full max-w-lg bg-white p-10 sm:p-12 rounded-[3.5rem] shadow-2xl border border-slate-100">
            <button onClick={() => setView('auth')} className="mb-8 px-5 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase hover:text-emerald-600 flex items-center gap-2"><span>←</span> Kembali</button>
            <div className="text-center mt-12 mb-10">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">DAFTAR DONATUR</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase mt-2 tracking-widest">Lengkapi data profil Anda</p>
            </div>
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">NAMA LENGKAP</label>
                <input required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold" placeholder="Masukkan nama lengkap anda" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">PASSWORD</label>
                <input required type="password" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold" placeholder="Masukkan password" value={profileForm.password} onChange={e => setProfileForm({ ...profileForm, password: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">JURUSAN</label>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-1 -mt-1">Contoh: Informatika</p>
                  <input required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold" placeholder="Program Studi" value={profileForm.major} onChange={e => setProfileForm({ ...profileForm, major: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">ANGKATAN</label>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-1 -mt-1">Contoh: 2024</p>
                  <input required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold" placeholder="Tahun Masuk" value={profileForm.batch} onChange={e => setProfileForm({ ...profileForm, batch: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">DAFTAR SEKARANG <IconSparkles /></button>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN LOGIN VIEW - DENGAN LABEL */}
      {view === 'admin_login' && (
        <div className="min-h-screen flex items-start justify-center p-6 pt-32 pb-12 bg-slate-50 w-full overflow-y-auto">
          <div className="w-full max-w-md bg-slate-900 p-10 sm:p-12 rounded-[3.5rem] shadow-2xl border-4 border-emerald-500/20 text-white animate-in zoom-in-95">
            <button onClick={() => setView('login_portal')} className="mb-8 px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase hover:text-emerald-400 flex items-center gap-2"><span>←</span> Kembali</button>
            <div className="text-center mb-10 space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tight">MASUK ADMIN</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Khusus Panitia HMIF</p>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] ml-1">NAMA ADMIN</label>
                <input required className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-emerald-500 outline-none font-bold" placeholder="Masukkan nama admin" value={adminLoginForm.name} onChange={e => setAdminLoginForm({ ...adminLoginForm, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] ml-1">PASSWORD</label>
                <input required type="password" className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-emerald-500 outline-none font-bold" placeholder="Masukkan password" value={adminLoginForm.password} onChange={e => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })} />
              </div>
              <button type="submit" className="w-full py-5 rounded-2xl bg-emerald-600 text-white font-black text-sm uppercase shadow-2xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">MASUK ADMIN <IconLock size={16} /></button>
            </form>
          </div>
        </div>
      )}

      {/* HISTORY VIEW (ALL TRANSACTIONS) */}
      {view === 'history' && (
        <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto animate-in slide-in-from-bottom-12 duration-700">
          <button onClick={() => setView('home')} className="mb-8 px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:text-emerald-600 flex items-center gap-2 shadow-sm"><span>←</span> Kembali</button>
          <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-100 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Riwayat Semua Infaq</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total {transactions.length} donasi terkumpul</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <input type="text" placeholder="Cari nama..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold outline-none focus:border-emerald-500 transition-all" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><IconUser size={14} /></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {transactions.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) && t.name !== 'Admin HATI').length > 0 ?
                transactions.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) && t.name !== 'Admin HATI').map(t => (
                  <div key={t.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 hover:border-emerald-200 transition-all group">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">{t.batch.slice(-2)}</div>
                      <div>
                        <p className="font-black text-slate-800 uppercase text-sm">{isAdmin ? t.name : maskName(t.name)}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.major} • {t.batch}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8">
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.date}</p>
                        <p className="text-lg font-black text-emerald-600">{formatRupiah(t.amount)}</p>
                      </div>
                      {isAdmin && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedProof(t.proofImage || null)} className="p-2.5 bg-white text-emerald-600 rounded-xl border border-slate-200 hover:bg-emerald-50 transition-all"><IconEye size={18} /></button>
                          <button onClick={() => { setEditingDonation(t); setShowManualDonation(true); }} className="p-2.5 bg-white text-blue-500 rounded-xl border border-slate-200 hover:bg-blue-50 transition-all"><IconEdit size={18} /></button>
                          <button onClick={() => deleteDonation(t.id)} className="p-2.5 bg-white text-red-500 rounded-xl border border-slate-200 hover:bg-red-50 transition-all"><IconTrash size={18} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Tidak ada data ditemukan.</div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* PROFILE VIEW (EDIT & TRANSAKSI) */}
      {view === 'profile' && user && (
        <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto animate-in slide-in-from-bottom-12 duration-700">
          <button onClick={() => setView('home')} className="mb-8 px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:text-emerald-600 flex items-center gap-2 shadow-sm"><span>←</span> Kembali</button>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-emerald-600" />
                <div className="relative z-10">
                  <img src={user.avatar} className="w-24 h-24 rounded-[2rem] mx-auto border-4 border-white shadow-xl mb-4" alt="avatar" />
                  <h2 className="text-2xl font-black text-slate-900 uppercase leading-none">{user.name}</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{user.major} • {user.batch}</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">EDIT PROFIL <IconEdit size={14} /></h3>
                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">NAMA LENGKAP</label>
                    <input className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-sm" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">JURUSAN</label>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest ml-1 -mt-1">Contoh: Informatika</p>
                    <input className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-sm" placeholder="Program Studi" value={profileForm.major} onChange={e => setProfileForm({ ...profileForm, major: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">ANGKATAN</label>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest ml-1 -mt-1">Contoh: 2024</p>
                    <input className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-sm" placeholder="Tahun Masuk" value={profileForm.batch} onChange={e => setProfileForm({ ...profileForm, batch: e.target.value })} />
                  </div>
                  <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-black text-[10px] uppercase rounded-xl hover:bg-emerald-700 transition-all shadow-lg">SIMPAN PERUBAHAN</button>
                </form>
              </div>

              <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">UBAH PASSWORD <IconLock size={14} /></h3>
                <form onSubmit={handleChangePassword} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">PASSWORD BARU</label>
                    <input required type="password" className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-sm" placeholder="••••••••" value={changePasswordForm.newPassword} onChange={e => setChangePasswordForm({ newPassword: e.target.value })} />
                  </div>
                  <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black text-[10px] uppercase rounded-xl hover:bg-emerald-600 transition-all shadow-lg">UPDATE PASSWORD</button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Riwayat Infaq Saya</h3>
                <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">{myTransactions.length} Kali Beramal</div>
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {myTransactions.length > 0 ? myTransactions.map(t => (
                  <div key={t.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center hover:border-emerald-200 transition-all">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.date}</p>
                      <p className="font-black text-slate-800 uppercase text-xs">TRX ID: {t.id}</p>
                    </div>
                    <p className="text-xl font-black text-emerald-600">{formatRupiah(t.amount)}</p>
                  </div>
                )) : (
                  <div className="py-24 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-slate-300"><IconHandshake size={32} /></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Belum ada riwayat infaq yang tercatat.</p>
                    <button onClick={() => setView('home')} className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all">MULAI BERINFAQ SEKARANG</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD HOME VIEW */}
      {view === 'home' && (
        <div className="pt-24 pb-20 animate-in fade-in duration-700">
          <section className="max-w-6xl mx-auto px-6 mb-12 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-black tracking-widest uppercase animate-pulse">
              <IconMosque /> Ramadhan 1447H
            </div>
            <h1 className="text-5xl sm:text-8xl font-[1000] text-slate-900 tracking-tighter leading-tight uppercase">Infaq <span className="text-emerald-600 italic">Takjil Ramadhan</span></h1>
            <p className="text-sm sm:text-lg font-bold text-slate-500 uppercase tracking-[0.3em]">Berbagi Kebaikan di Bulan Ramadhan</p>
          </section>

          <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white p-8 sm:p-10 rounded-[3rem] border border-slate-200 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">Status Penyaluran Infaq <IconTrendingUp /></h2>
                <ProgressBar current={currentDonasi} target={TARGET_DONASI} />

                <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Infaq</p>
                    <p className="text-sm font-black text-slate-800">{formatRupiah(TARGET_DONASI)}</p>
                  </div>
                  <div className="p-5 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Terkumpul</p>
                    <p className="text-sm font-black text-emerald-700">{formatRupiah(currentDonasi)}</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Donatur</p>
                    <p className="text-sm font-black text-slate-800">{transactions.length} Orang</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kekurangan</p>
                    <p className="text-sm font-black text-slate-800">{formatRupiah(Math.max(0, TARGET_DONASI - currentDonasi))}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">Riwayat Donasi Terbaru <IconHandshake /></h3>
                    <button onClick={() => setView('history')} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-1">Lihat Semua <span>→</span></button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {transactions.length > 0 ? transactions.slice(0, 8).map((t) => (
                      <div key={t.id} className="flex items-center justify-between p-4 rounded-[1.5rem] bg-white border border-slate-100 hover:border-emerald-200 transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xs">{t.batch.slice(-2)}</div>
                          <div>
                            <p className="font-black text-slate-800">{isAdmin ? t.name : maskName(t.name)}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.major} • {t.batch}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-base font-black text-emerald-600">{formatRupiah(t.amount)}</p>
                          {isAdmin && (
                            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                              <button onClick={(e) => { e.stopPropagation(); setSelectedProof(t.proofImage || null); }} className="p-2 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all" title="Lihat Bukti"><IconEye size={16} /></button>
                              <button onClick={(e) => { e.stopPropagation(); deleteDonation(t.id); }} className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all" title="Hapus Donatur"><IconTrash size={16} /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="py-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Belum ada donasi hari ini.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 sm:p-10 rounded-[3rem] border border-slate-200 shadow-xl space-y-6">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">Dokumentasi Kegiatan <IconCamera /></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activities.map((act) => (
                    <div key={act.id} onClick={() => openNewsPage(act)} className="group relative overflow-hidden rounded-[2.5rem] aspect-video bg-slate-50 border border-slate-100 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500">
                      <img src={act.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={act.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent p-6 flex flex-col justify-end text-white">
                        <p className="text-[10px] font-black text-emerald-400 uppercase mb-1 tracking-widest opacity-80">{act.date}</p>
                        <h4 className="font-black text-lg uppercase tracking-tight leading-none group-hover:text-emerald-300 transition-colors">{act.title}</h4>
                      </div>
                      {isAdmin && (
                        <div className="absolute top-4 right-4 flex gap-2 z-20">
                          <button onClick={(e) => { e.stopPropagation(); handleEditActivity(act); }} className="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-xl border border-emerald-400 transition-all active:scale-90"><IconEdit /></button>
                          <button onClick={(e) => { e.stopPropagation(); deleteActivity(act.id); }} className="p-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-xl border border-red-400 transition-all active:scale-90"><IconTrash /></button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 no-print">
              {!isAdmin ? (
                <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-emerald-50 space-y-8">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Pilih Infaq</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Klik nominal untuk memulai</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {DONATION_OPTIONS.map((opt) => (
                      <DonasiButton
                        key={opt.id}
                        option={opt}
                        onClick={(e, val) => {
                          if (!user) {
                            setView('login_portal');
                            showToast('Silakan login terlebih dahulu!');
                          } else {
                            setSelectedAmount(val);
                            setView('form');
                            triggerCoins(e);
                          }
                        }}
                      />
                    ))}
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Atau masukkan nominal sendiri</p>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">Rp</span>
                      <input
                        id="custom-amount-input"
                        type="number"
                        placeholder="Masukkan nominal"
                        className="w-full pl-14 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-lg"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = parseInt((e.target as HTMLInputElement).value);
                            if (!user) {
                              setView('login_portal');
                              showToast('Silakan login terlebih dahulu!');
                            } else if (val >= 1000) {
                              setSelectedAmount(val);
                              setView('form');
                            }
                          }
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!user) {
                          setView('login_portal');
                          showToast('Silakan login terlebih dahulu!');
                          return;
                        }
                        const input = document.getElementById('custom-amount-input') as HTMLInputElement;
                        const val = parseInt(input.value);
                        if (val >= 1000) {
                          setSelectedAmount(val);
                          setView('form');
                        } else {
                          alert('Minimal donasi Rp1.000');
                        }
                      }}
                      className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg"
                    >
                      Donasi Sekarang
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-6 shadow-2xl border-4 border-emerald-500/20">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <IconShield /><h4 className="font-black uppercase tracking-[0.2em] text-[10px]">ADMIN CONSOLE</h4>
                  </div>

                  { }
                  <button
                    onClick={() => setShowManualDonation(true)}
                    className="..."
                  >
                    + Tambah Donasi Manual
                  </button>

                  <button onClick={() => { setEditingActivity(null); setView('gallery_upload'); }} className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 text-[10px] uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2">POST LAPORAN <IconCamera size={16} /></button>
                  <button onClick={() => exportToPDF(transactions)} className="w-full py-4 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 text-[10px] uppercase tracking-widest border border-white/10 transition-all flex items-center justify-center gap-2">EXPORT PDF <IconFileText size={16} /></button>

                  {/* ==================== QRIS UTAMA (SEMUA NOMINAL) ==================== */}
                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">QRIS Utama</h5>
                    <p className="text-[8px] text-slate-400">QRIS untuk semua nominal</p>

                    <input
                      type="file"
                      id="admin-main-qris"
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            const base64 = reader.result as string;
                            const res = await actions.saveQrisConfig(0, base64);
                            if (res.success) {
                              setQrisConfigs(prev => {
                                const filtered = prev.filter(c => c.nominal !== 0);
                                return [...filtered, { nominal: 0, imageUrl: base64, updatedAt: new Date() }];
                              });
                              showToast('QRIS utama berhasil diupload!');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="admin-main-qris"
                      className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${qrisConfigs.find(c => c.nominal === 0 && c.imageUrl) ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/20 bg-white/5 hover:border-emerald-500'}`}
                    >
                      {qrisConfigs.find(c => c.nominal === 0 && c.imageUrl) ? (
                        <>
                          <span className="text-[9px] font-black text-emerald-400">QRIS TERPASANG</span>
                          <img
                            src={qrisConfigs.find(c => c.nominal === 0)?.imageUrl || ''}
                            alt="QRIS Utama"
                            className="w-32 h-32 object-contain mt-2 rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <span className="text-[7px] font-bold opacity-60 mt-2">Klik untuk ubah</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[9px] font-black">UPLOAD QRIS UTAMA</span>
                          <span className="text-[7px] font-bold opacity-60 mt-1">1 gambar untuk semua nominal</span>
                        </>
                      )}
                    </label>
                  </div>
                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Rekap User Terdaftar</h5>
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {allUsers.map(u => (
                        <div key={u.username} className="p-3 bg-white/5 rounded-xl border border-white/10 text-[10px]">
                          <p className="font-black text-white uppercase">{u.name}</p>
                          <div className="flex justify-between text-slate-400 mt-1">
                            <span>Username: {u.username}</span>
                            <span>Angkatan: {u.batch}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      { }
      {view === 'form' && (
        <div className="pt-32 pb-12 w-full flex flex-col items-center animate-in zoom-in-95 no-print">
          <DonationForm initialAmount={selectedAmount} initialData={donationData} currentUser={user} onCancel={() => setView('home')} onSubmit={details => { setDonationData({ ...details, date: '', id: '' }); setView('payment'); }} />
        </div>
      )}

      {view === 'payment' && donationData && (
        <div className="pt-32 pb-12 w-full max-w-4xl space-y-8 animate-in zoom-in-95 no-print px-6 mx-auto">
          <button onClick={() => setView('form')} className="mb-4 px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:text-emerald-600 flex items-center gap-2 shadow-sm transition-all"><span>←</span> Kembali</button>

          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-[1000] tracking-tighter uppercase text-slate-900 leading-none">
              KONFIRMASI <span className="text-emerald-600">INFAQ</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <QRISCard
              amount={donationData.amount}
              customImageUrl={
                qrisConfigs.find(c => c.nominal === donationData.amount)?.imageUrl ||
                qrisConfigs.find(c => c.nominal === 0)?.imageUrl
              }
            />
            <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-emerald-50 text-center space-y-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl" />

              <div className="space-y-6 text-left relative z-10">
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-2">Unggah Bukti Transfer</label>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider ml-2">Pastikan nominal dan waktu transaksi terlihat jelas</p>
                  </div>

                  <div className="p-8 border-2 border-dashed border-emerald-100 rounded-[2rem] bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer relative group">
                    <input
                      type="file"
                      required
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setTempProof(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    />
                    <div className="flex flex-col items-center gap-3 text-emerald-600">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <IconCamera size={24} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest">
                        {tempProof ? 'GANTI FOTO BUKTI' : 'PILIH FOTO BUKTI'}
                      </p>
                    </div>
                  </div>
                </div>

                {tempProof && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                      <img src={tempProof} className="w-full h-[600px] object-contain bg-slate-50" alt="Proof Preview" />
                      <div className="absolute top-4 right-4">
                        <div className="bg-emerald-600 p-2 rounded-full shadow-lg">
                          <IconCheckCircle className="text-white" size={24} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                      <p className="text-[9px] font-bold text-amber-700 uppercase tracking-tight">Perhatikan: Pastikan bukti transfer sudah benar</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative z-10 pt-2">
                <button
                  onClick={finalizeDonation}
                  disabled={!tempProof}
                  className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  KONFIRMASI PEMBAYARAN <IconCheckCircle />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'receipt' && donationData && (
        <div className="pt-32 pb-16 w-full flex flex-col items-center animate-in zoom-in-95 duration-700">
          <DonationReceipt details={donationData} onClose={() => { setDonationData(null); setView('home'); }} />
        </div>
      )}

      {/* GALLERY UPLOAD / EDIT ACTIVITY */}
      {view === 'gallery_upload' && (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-2xl mx-auto animate-in zoom-in-95">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
            <button onClick={() => { setEditingActivity(null); setView('home'); }} className="mb-8 px-5 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase hover:text-emerald-600 flex items-center gap-2"><span>←</span> Kembali</button>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-8">{editingActivity ? 'EDIT LAPORAN' : 'POST LAPORAN BARU'}</h2>
            <form onSubmit={handleActivitySubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">JUDUL KEGIATAN</label>
                <input required name="title" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold" placeholder="Contoh: Berbagi 100 Takjil..." defaultValue={editingActivity?.title} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">DESKRIPSI LENGKAP</label>
                <textarea required name="description" rows={5} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold resize-none" placeholder="Ceritakan detail kegiatan..." defaultValue={editingActivity?.description}></textarea>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">UNGGAH FOTO KEGIATAN</label>
                <input type="file" onChange={e => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setTempActivityImage(reader.result as string); reader.readAsDataURL(file); } }} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-emerald-50 file:text-emerald-700" />
                {tempActivityImage && <img src={tempActivityImage} className="mt-4 w-full h-48 object-cover rounded-2xl border" alt="preview" />}
              </div>
              <button type="submit" className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">PUBLIKASIKAN SEKARANG <IconCamera size={18} /></button>
            </form>
          </div>
        </div>
      )}

      {/* ALL ACTIVITIES VIEW */}
      {view === 'all_activities' && (
        <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto animate-in slide-in-from-bottom-12 duration-700">
          <button onClick={() => setView('home')} className="mb-8 px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:text-emerald-600 flex items-center gap-2 shadow-sm"><span>←</span> Kembali</button>
          <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-100 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-[1000] text-slate-900 uppercase tracking-tighter">Semua Dokumentasi</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kegiatan HMIF ITN Malang</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((act) => (
                <div key={act.id} onClick={() => openNewsPage(act)} className="group relative overflow-hidden rounded-[2.5rem] aspect-video bg-slate-50 border border-slate-100 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500">
                  <img src={act.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={act.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent p-6 flex flex-col justify-end text-white">
                    <p className="text-[10px] font-black text-emerald-400 uppercase mb-1 tracking-widest opacity-80">{act.date}</p>
                    <h4 className="font-black text-lg uppercase tracking-tight leading-none group-hover:text-emerald-300 transition-colors">{act.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVITY DETAIL */}
      {view === 'activity_detail' && selectedActivity && (
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto animate-in slide-in-from-bottom-12 duration-700">
          <button onClick={() => setView('home')} className="mb-8 px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:text-emerald-600 flex items-center gap-2 shadow-sm"><span>←</span> Kembali</button>
          <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="aspect-video w-full overflow-hidden"><img src={selectedActivity.imageUrl} className="w-full h-full object-cover" alt={selectedActivity.title} /></div>
            <div className="p-10 sm:p-16 space-y-6">
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-black uppercase tracking-[0.2em]"><IconCamera size={16} /> {selectedActivity.date}</div>
              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{selectedActivity.title}</h1>
              <div className="h-2 w-20 bg-emerald-500 rounded-full" />
              <p className="text-lg text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{selectedActivity.description}</p>
              <div className="pt-12 border-t flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400"><IconMosque size={24} /></div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diterbitkan oleh</p><p className="text-sm font-bold text-slate-900">Panitia HATI HMIF ITN</p></div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setShowShareModal(true)} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-900 transition-all shadow-xl"><IconSparkle size={16} /> PRATINJAU PREMIUM</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROOF MODAL */}
      {selectedProof && (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-10" onClick={() => setSelectedProof(null)}>
          <div className="max-w-4xl w-full max-h-[90vh] bg-white rounded-[3rem] shadow-2xl animate-in zoom-in-95 flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <IconEye size={20} />
                </div>
                <div>
                  <h3 className="font-black text-xs uppercase tracking-widest text-slate-900">Detail Bukti Transfer</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Gunakan scroll untuk melihat seluruh gambar</p>
                </div>
              </div>
              <button onClick={() => setSelectedProof(null)} className="p-3 rounded-2xl hover:bg-white text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-slate-200 shadow-sm">
                <IconX size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50/30 custom-scrollbar">
              <div className="relative rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl">
                <img src={selectedProof} className="w-full h-auto block" alt="Bukti Transfer" />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-white text-center">
              <button onClick={() => setSelectedProof(null)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl">Tutup Pratinjau</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-20 py-12 px-8 bg-white border-t border-slate-100 text-center space-y-4 no-print">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">© 2026 HMIF ITN Malang • Program HATI</p>
        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">A Social Initiative <IconMoon size={12} /></p>
      </footer>

      {/* MODAL TAMBAH/EDIT DONASI MANUAL */}
      {showManualDonation && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => { setShowManualDonation(false); setEditingDonation(null); }}>
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="bg-emerald-600 p-8 text-white text-center">
              <h2 className="text-2xl font-black uppercase tracking-tight">
                {editingDonation ? 'Edit Donasi' : 'Tambah Donasi Manual'}
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">
                {editingDonation ? 'Ubah data donasi' : 'Catat donasi offline/cash'}
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);

                const donationData: DonationDetail = {
                  id: editingDonation?.id || 'TRX' + Date.now(),
                  name: formData.get('name') as string,
                  major: formData.get('major') as string,
                  batch: formData.get('batch') as string,
                  amount: parseInt(formData.get('amount') as string),
                  phone: formData.get('phone') as string,
                  wishes: formData.get('wishes') as string,
                  date: editingDonation?.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                  proofImage: editingDonation?.proofImage,
                };

                if (editingDonation) {
                  // UPDATE DONASI
                  const result = await actions.updateDonation(donationData);
                  if (result.success) {
                    setTransactions(prev => prev.map(t => t.id === editingDonation.id ? donationData : t));
                    showToast('Donasi berhasil diperbarui! ✅');
                  } else {
                    alert('Gagal memperbarui donasi');
                  }
                } else {
                  // TAMBAH DONASI BARU
                  const result = await actions.saveDonation(donationData);
                  if (result.success) {
                    setTransactions(prev => [donationData, ...prev]);
                    showToast('Donasi berhasil ditambahkan! ✅');
                  } else {
                    alert('Gagal menyimpan donasi');
                  }
                }

                setShowManualDonation(false);
                setEditingDonation(null);
              }}
              className="p-8 space-y-5"
            >
              {/* Nama */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">NAMA DONATUR</label>
                <input required name="name" defaultValue={editingDonation?.name} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold" placeholder="Nama lengkap donatur" />
              </div>

              {/* Jurusan &Angkatan */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">JURUSAN</label>
                  <input required name="major" defaultValue={editingDonation?.major} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold" placeholder="Jurusan" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">ANGKATAN</label>
                  <input required name="batch" defaultValue={editingDonation?.batch} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold" placeholder="Tahun" />
                </div>
              </div>

              {/* Nominal */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">NOMINAL DONASI</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                  <input required type="number" min="1000" name="amount" defaultValue={editingDonation?.amount} className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold text-lg" placeholder="Nominal donasi" />
                </div>
              </div>

              {/* No HP */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">NO. WA (OPSIONAL)</label>
                <input type="tel" name="phone" defaultValue={editingDonation?.phone} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold" placeholder="0812xxxxxx" />
              </div>

              {/* Doa/Pesan */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">DOA/PESAN (OPSIONAL)</label>
                <textarea name="wishes" rows={2} defaultValue={editingDonation?.wishes} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 outline-none font-bold resize-none" placeholder="Doa atau pesan dari donatur..."></textarea>
              </div>

              {/* Tombol */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowManualDonation(false); setEditingDonation(null); }}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black text-sm uppercase hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-2xl bg-emerald-600 text-white font-black text-sm uppercase shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  {editingDonation ? 'Perbarui' : 'Simpan'} <IconCheckCircle />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientApp;
