import axios from "axios";

export const getId = id => document.getElementById(id)

export const downloadFile = async (fileUrl) => {
  try {
    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'blob', // Mengambil respons sebagai blob
    });

    // Membuat URL sementara untuk blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Membuat elemen anchor
    const link = document.createElement('a');
    link.href = url;

    // Ambil nama file dari URL
    const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
    link.setAttribute('download', fileName);

    // Menyembunyikan elemen anchor dan menambahkannya ke dalam dokumen
    link.style.display = 'none';
    document.body.appendChild(link);

    // Klik link secara otomatis untuk memulai unduhan
    link.click();

    // Hapus elemen anchor dan URL sementara setelah selesai unduh
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

export const limitText = (text, limit = 30) => {
  if (text.length <= limit) {
    return text;
  } else {
    return text.substring(0, limit) + "...";
  }
}

export const formatDateFromISO = (dateString) => {
  const tanggalISO = dateString
  const tanggalObjek = new Date(tanggalISO);
  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const tanggal = tanggalObjek.getUTCDate().toString().padStart(2, '0');
  const bulan = namaBulan[tanggalObjek.getUTCMonth()];
  const tahun = tanggalObjek.getUTCFullYear();
  const hasil = `${tanggal} ${bulan} ${tahun}`;
  return hasil
}