// Ambil data dari localStorage, atau buat data contoh awal jika masih kosong
let daftarBarang = JSON.parse(localStorage.getItem('inventoryData')) || [
  { id: 1, nama: 'Mouse Wireless Logitech', kategori: 'Elektronik', stok: 15 },
  { id: 2, nama: 'Kertas HVS A4 (Rim)', kategori: 'ATK', stok: 4 },
  { id: 3, nama: 'Kopi Sachet Box', kategori: 'Konsumsi', stok: 0 }
];

// Referensi Elemen DOM
const formTambah = document.getElementById('form-tambah');
const tabelBarang = document.getElementById('tabel-barang');
const inputSearch = document.getElementById('input-search');
const filterKategori = document.getElementById('filter-kategori');
const pesanKosong = document.getElementById('pesan-kosong');

// Fungsi menyimpan array ke localStorage
function simpanData() {
  localStorage.setItem('inventoryData', JSON.stringify(daftarBarang));
}

// Fungsi memperbarui angka di Kartu Ringkasan
function updateSummary() {
  const totalJenis = daftarBarang.length;
  const totalStok = daftarBarang.reduce((total, item) => total + item.stok, 0);
  const stokMenipis = daftarBarang.filter(item => item.stok <= 5).length;

  document.getElementById('total-jenis').textContent = totalJenis;
  document.getElementById('total-stok').textContent = totalStok;
  document.getElementById('stok-menipis').textContent = stokMenipis;
}

// Fungsi merender data ke dalam tabel HTML
function renderTabel() {
  const kataKunci = inputSearch.value.toLowerCase();
  const kategoriDipilih = filterKategori.value;

  // Filter berdasarkan pencarian dan kategori
  const dataTersaring = daftarBarang.filter(item => {
    const cocokNama = item.nama.toLowerCase().includes(kataKunci);
    const cocokKategori = kategoriDipilih === 'Semua' || item.kategori === kategoriDipilih;
    return cocokNama && cocokKategori;
  });

  tabelBarang.innerHTML = '';

  if (dataTersaring.length === 0) {
    pesanKosong.style.display = 'block';
  } else {
    pesanKosong.style.display = 'none';
    dataTersaring.forEach((item, index) => {
      // Tentukan status badge berdasarkan jumlah stok
      let badgeClass = 'badge-aman';
      let statusText = 'Aman';

      if (item.stok === 0) {
        badgeClass = 'badge-habis';
        statusText = 'Habis';
      } else if (item.stok <= 5) {
        badgeClass = 'badge-menipis';
        statusText = 'Menipis';
      }

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td><strong>${item.nama}</strong></td>
        <td>${item.kategori}</td>
        <td>
          <div class="stok-control">
            <button class="btn-stok" onclick="ubahStok(${item.id}, -1)">-</button>
            <span>${item.stok}</span>
            <button class="btn-stok" onclick="ubahStok(${item.id}, 1)">+</button>
          </div>
        </td>
        <td><span class="badge ${badgeClass}">${statusText}</span></td>
        <td>
          <button class="btn-hapus" onclick="hapusBarang(${item.id})">Hapus</button>
        </td>
      `;
      tabelBarang.appendChild(row);
    });
  }

  updateSummary();
}

// Tambah Barang Baru
formTambah.addEventListener('submit', function (e) {
  e.preventDefault();

  const nama = document.getElementById('nama-barang').value.trim();
  const kategori = document.getElementById('kategori-barang').value;
  const stok = parseInt(document.getElementById('jumlah-stok').value);

  const barangBaru = {
    id: Date.now(), // ID unik berbasis timestamp
    nama: nama,
    kategori: kategori,
    stok: stok
  };

  daftarBarang.push(barangBaru);
  simpanData();
  renderTabel();
  formTambah.reset();
});

// Fungsi Tambah/Kurang Stok Cepat
function ubahStok(id, perubahan) {
  const barang = daftarBarang.find(item => item.id === id);
  if (barang) {
    // Mencegah stok bernilai negatif
    if (barang.stok + perubahan >= 0) {
      barang.stok += perubahan;
      simpanData();
      renderTabel();
    }
  }
}

// Fungsi Hapus Barang
function hapusBarang(id) {
  if (confirm('Yakin ingin menghapus barang ini dari daftar?')) {
    daftarBarang = daftarBarang.filter(item => item.id !== id);
    simpanData();
    renderTabel();
  }
}

// Event Listener untuk Search & Filter
inputSearch.addEventListener('input', renderTabel);
filterKategori.addEventListener('change', renderTabel);

// Jalankan render pertama kali saat halaman dibuka
renderTabel();
