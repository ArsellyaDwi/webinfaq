
export interface Coin {
  id: number;
  x: number;
  y: number;
}

export interface DonationOption {
  label: string;
  value: number;
  id: string;
}

export interface User {
  name: string;
  major: string;
  batch: string;
  phone: string;
  role: 'user' | 'admin';
  avatar?: string;
  username?: string;
  password?: string;
}

export interface DonationDetail {
  name: string;
  batch: string;
  major: string;
  amount: number;
  date: string;
  wishes: string;
  id: string;
  phone?: string;
  userId?: string;
  proofImage?: string;
  username?: string;
}

export interface Activity {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  description: string;
}

export interface QrisConfig {
  nominal: number;
  imageUrl: string;
  updatedAt: Date;
}

export type ViewState = 'home' | 'form' | 'payment' | 'receipt' | 'history' | 'admin' | 'profile_setup' | 'gallery_upload' | 'admin_login' | 'login_portal' | 'profile' | 'activity_detail' | 'auth' | 'all_activities' | 'forgot_password';
