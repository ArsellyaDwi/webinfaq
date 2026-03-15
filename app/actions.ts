'use server';

import bcrypt from "bcrypt";
import { prisma } from '@/lib/prisma';
import { Activity, DonationDetail, User } from '@/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

/* ===================== AUTH ===================== */

export async function registerUser(userData: User) {
  try {
    const existing = await prisma.user.findUnique({
      where: { username: userData.username! },
    });

    if (existing) return { error: "Username already exists" };

    const hashedPassword = await bcrypt.hash(userData.password!, 10);

    await prisma.user.create({
      data: {
        username: userData.username!,
        name: userData.name,
        password: hashedPassword,
        major: userData.major,
        batch: userData.batch,
        phone: userData.phone,
        avatar: userData.avatar,
        role: userData.role || "user",
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Registration failed" };
  }
}

export async function loginUser(credentials: {
  username: string;
  password: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: credentials.username },
    });

    if (!user) {
      return { error: "Username atau password salah" };
    }

    const isValid = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isValid) {
      return { error: "Username atau password salah" };
    }

    // ✅ SET SESSION
    const cookieStore = await cookies();
    cookieStore.set('hati_session', user.username, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return user;
  } catch (error) {
    console.error(error);
    return { error: "Login failed" };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.set('hati_session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 0,
  });
  return { success: true };
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const username = cookieStore.get('hati_session')?.value;
    if (!username) return null;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return null;

    return {
      username: user.username,
      name: user.name,
      role: user.role as 'user' | 'admin',
      major: user.major,
      batch: user.batch,
      phone: user.phone,
      avatar: user.avatar,
    };
  } catch {
    return null;
  }
}

export async function resetPassword(name: string, newPassword: string) {
  try {
    const hashed = await bcrypt.hash(newPassword, 10);

    const result = await prisma.user.updateMany({
      where: { name },
      data: { password: hashed },
    });

    if (result.count === 0) return { error: "User with this name not found" };
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Reset failed" };
  }
}

export async function changePassword(username: string, newPassword: string) {
  try {
    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { username },
      data: { password: hashed },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Update failed" };
  }
}

/* ===================== USERS ===================== */

export async function getAdminUsers() {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'user' },
      orderBy: { createdAt: 'desc' },
    });
    return users.map(u => ({ ...u, role: u.role as 'user' | 'admin' }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function updateUser(userData: User) {
  try {
    const updated = await prisma.user.update({
      where: { username: userData.username! },
      data: {
        name: userData.name,
        major: userData.major,
        batch: userData.batch,
        phone: userData.phone,
        avatar: userData.avatar,
      },
    });
    return { success: true, user: { ...updated, role: updated.role as 'user' | 'admin' } };
  } catch (error) {
    console.error(error);
    return { error: "Update failed" };
  }
}

/* ===================== DONATION ===================== */

export async function getDonations() {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return donations.map(d => ({
      ...d,
      amount: Number(d.amount),
      proofImage: d.proofImage || undefined,
      username: d.username || undefined,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function saveDonation(donation: DonationDetail) {

  const donationClosed = true; // true = donasi ditutup

  if (donationClosed) {
    return { error: "Donasi sudah ditutup. Terima kasih atas partisipasinya 🙏" };
  }

  try {
    const id = donation.id || 'HATI-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const date = donation.date || new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    await prisma.donation.create({
      data: {
        id,
        name: donation.name,
        batch: donation.batch,
        major: donation.major,
        amount: donation.amount,
        date,
        proofImage: donation.proofImage,
        username: donation.username,
      },
    });

    revalidatePath('/');
    return { success: true, id, date };
  } catch (error) {
    console.error(error);
    return { error: "Failed to save donation" };
  }
}

export async function deleteDonation(id: string) {
  try {
    await prisma.donation.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete donation" };
  }
}

export async function updateDonation(donation: DonationDetail) {
  try {
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        name: donation.name,
        batch: donation.batch,
        major: donation.major,
        amount: donation.amount,
        phone: donation.phone,
        wishes: donation.wishes,
        proofImage: donation.proofImage,
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update donation" };
  }
}

/* ===================== ACTIVITY ===================== */

export async function getActivities() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return activities;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function saveActivity(activity: Activity) {
  try {
    const id = activity.id || 'ACT' + Date.now();
    const date = activity.date || new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    await prisma.activity.upsert({
      where: { id },
      update: {
        title: activity.title,
        imageUrl: activity.imageUrl,
        description: activity.description,
      },
      create: {
        id,
        title: activity.title,
        imageUrl: activity.imageUrl,
        date,
        description: activity.description,
      },
    });

    revalidatePath('/');
    return { success: true, id, date };
  } catch (error) {
    console.error(error);
    return { error: "Failed to save activity" };
  }
}

export async function deleteActivity(id: string) {
  try {
    await prisma.activity.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete activity" };
  }
}

/* ===================== QRIS ===================== */

export async function getQrisConfigs() {
  try {
    return await prisma.qrisConfig.findMany();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function saveQrisConfig(nominal: number, imageUrl: string) {
  try {
    await prisma.qrisConfig.upsert({
      where: { nominal },
      update: { imageUrl },
      create: { nominal, imageUrl },
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to save QRIS config" };
  }
}