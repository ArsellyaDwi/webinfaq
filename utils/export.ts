
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { DonationDetail, Activity } from '../types';
import { formatRupiah } from './format';

export const exportToPDF = (data: DonationDetail[]) => {
  try {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129);
    doc.text('LAPORAN INFAQ TAKJIL RAMADHAN 1447H', 105, 20, { align: 'center' });
    
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(`Total Dana Terkumpul: ${formatRupiah(totalAmount)}`, 14, 52);

    const tableColumn = ["ID", "Nama Donatur", "Angkatan", "Jurusan", "Nominal", "Tanggal"];
    const tableRows = data.map(item => [
      item.id, item.name, item.batch, item.major, formatRupiah(item.amount), item.date
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 70,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save(`Laporan_Infaq_Takjil_HATI_${new Date().getTime()}.pdf`);
  } catch (error) {
    console.error("PDF Export failed:", error);
  }
};

/**
 * Fungsi Ekspor Poster yang diperbaiki total agar IDENTIK dengan layar
 */
export const exportActivityToImage = async (elementId: string, activityTitle: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Ambil ukuran asli yang sedang tampil di layar user sekarang
  const width = element.offsetWidth;
  const height = element.offsetHeight;

  try {
    const canvas = await html2canvas(element, {
      scale: 3.5, // Sangat tajam tapi tetap ringan
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      width: width,
      height: height,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // KUNCI ukuran agar tidak berantakan saat proses render
          clonedElement.style.width = `${width}px`;
          clonedElement.style.height = `${height}px`;
          clonedElement.style.display = 'flex';
          clonedElement.style.flexDirection = 'column';
          clonedElement.style.position = 'relative';
          clonedElement.style.margin = '0';
          clonedElement.style.padding = '0';
          clonedElement.style.transform = 'none';

          // Perbaikan render khusus untuk area gambar (Hero)
          const heroArea = clonedElement.querySelector('.h-\\[62\\%\\]') as HTMLElement;
          if (heroArea) {
            heroArea.style.height = '62%';
            heroArea.style.minHeight = '62%';
          }

          // html2canvas tidak bisa render blur, kita beri warna solid yang persis
          const blurredElements = clonedElement.querySelectorAll('[class*="backdrop-blur"]');
          blurredElements.forEach((el: any) => {
            el.style.backdropFilter = "none";
            el.style.webkitBackdropFilter = "none";
            
            // Background fallback agar tetap terbaca dan premium
            if (el.classList.contains('bg-white/20')) {
                el.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
            }
            if (el.classList.contains('bg-emerald-500')) {
                el.style.backgroundColor = "#10b981";
            }
          });
        }
      }
    });

    // Download sebagai PNG kualitas tinggi
    const image = canvas.toDataURL("image/png", 1.0);
    const link = document.createElement('a');
    link.download = `HATI_Story_${activityTitle.replace(/\s+/g, '_')}.png`;
    link.href = image;
    link.click();
  } catch (error) {
    console.error("Poster Export failed:", error);
    alert("Gagal mengunduh gambar. Silakan coba lagi.");
  }
};
