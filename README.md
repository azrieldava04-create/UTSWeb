# Proyek Front-End Toko Online Pemesanan Buku (UTS Pemrograman Web 1)

Aplikasi web front-end pemesanan buku ajar digital interaktif yang dirancang khusus untuk memenuhi seluruh indikator penilaian dan spesifikasi soal **UTS Pemrograman Web 1**.

---

## 📁 Struktur Direktori & File Proyek

```text
UTS Pemrograman web/
├── index.html          # Halaman Login (dan validasi pop-up/alert serta modal)
├── login.html          # Salinan/alias halaman login (untuk kemudahan navigasi)
├── dashboard.html      # Menu Utama, Greeting dinamis waktu lokal, & statistik KPI
├── stok.html           # Informasi Stok / Katalog Buku & Tambah Stok via DOM
├── checkout
.html       # Formulir Pemesanan, Pengiriman, & Pembayaran
├── tracking.html       # Informasi Tracking Pengiriman DO dengan Progress Bar
├── css/
│   └── style.css       # External CSS modern, clean, dan fully-responsive
├── js/
│   ├── data.js         # Variabel konstanta Array JSON data dummy
│   └── script.js       # Logika DOM manipulation, validasi, modal, & kalkulasi
├── assets/
│   └── logo.png        # Logo resmi Toko Buku
└── img/
    ├── kepemimpinan.jpg
    ├── manajemen_keuangan.jpg
    ├── mikrobiologi.jpg
    ├── paud_perkembangan.jpeg
    ├── paud_perkembangan.jpg
    └── pengantar_komunikasi.jpg
```

---

## 🎯 Pemenuhan Indikator Penilaian UTS

### 1. HTML Semantik & Valid

- Seluruh halaman dirancang menggunakan elemen HTML5 semantik: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<figure>`, `<table>`, `<thead>`, `<tbody>`, serta formulir yang dilengkapi atribut `label`, `required`, dan `novalidate`.

### 2. Pengelolaan Gaya Antarmuka CSS

- **External CSS (`css/style.css`):** Menggunakan CSS Modern dengan CSS Variables (design token), Flexbox & Grid, radius halus, bayangan elevasi (_box-shadow_), dan transisi halus untuk modal/pop-up.
- **Internal CSS (`<style>`):** Terdapat blok gaya spesifik halaman di dalam elemen `<head>` pada setiap file HTML.
- **Inline CSS (`style="..."`):** Diterapkan pada elemen-elemen tertentu seperti persentase _progress bar_ dinamis, badge warna, dan tata letak khusus.

### 3. JavaScript Interaktif & Manipulasi DOM

- **Manipulasi DOM:** Merender data katalog secara dinamis dari `data.js`, menambah item stok baru ke tabel dan kartu tanpa me-reload browser, serta menambah/mengurangi/menghapus item pada tabel checkout.
- **Validasi Formulir:** Validasi login, validasi pendaftaran akun baru, dan validasi form pemesan/pembayaran dengan umpan balik pesan kesalahan yang informatif.
- **Interaksi UI Pop-up & Modal Box:**
  - Custom Alert Box untuk kesalahan login: _"email/password yang anda masukkan salah"_.
  - Modal Box interaktif untuk **Lupa Password** dan **Pendaftaran Akun Baru**.
  - Modal Box interaktif untuk **Tambah Baris Stok Baru**.
  - Modal Box untuk **Pilih Buku Lain dari Katalog**.
  - Modal Box **Struk / Bukti Pemesanan Sukses** yang langsung menerbitkan Nomor DO baru dan mengarahkan ke halaman tracking.

---

## 🔑 Data Uji Coba Cepat (Untuk Pengujian & Dosen)

### A. Akun Pengguna Terdaftar (`dataPengguna`)

| Nama               | Email            | Password  | Role  |
| :----------------- | :--------------- | :-------- | :---- |
| **Rina Wulandari** | `rina@gmail.com` | `rina123` | User  |
| **Agus Pranoto**   | `agus@gmail.com` | `agus123` | User  |
| **Siti Marlina**   | `siti@gmail.com` | `siti123` | Admin |

> _Tips:_ Pada halaman login (`index.html`), disediakan tombol _quick-fill chip_ untuk langsung mengisi akun di atas dengan 1 klik!

### B. Nomor Delivery Order (DO) Tracking (`dataTracking`)

- **`20230012`**: Paket atas nama _Rina Wulandari_, Ekspedisi JNE, Status: **Dalam Perjalanan** (Progress Step 3).
- **`20230013`**: Paket atas nama _Agus Pranoto_, Ekspedisi Pos Indonesia, Status: **Dikirim / Selesai Antar** (Progress Step 4).
- **DO Baru Hasil Checkout**: Otomatis dibuat saat menekan tombol "Konfirmasi & Proses Pesanan" di `checkout.html`.

---

## 🚀 Panduan Alur Pengerjaan & Pengujian Sistem

1. **Buka `index.html` pada browser:**
   - Coba masukkan email/password salah untuk melihat **pop-up alert**: _"email/password yang anda masukkan salah"_.
   - Coba klik tombol **Lupa Password** atau **Daftar** untuk menguji interaksi **Modal Box**.
   - Klik salah satu chip akun demo (misal: Rina Wulandari) lalu klik **Masuk Sekarang (Login)**. Sistem akan menampilkan alert sukses dan mengarahkan ke `dashboard.html`.

2. **Halaman `dashboard.html`:**
   - Amati teks _greeting_ di bagian atas (akan berubah otomatis menjadi _"Selamat Pagi"_, _"Selamat Siang"_, atau _"Selamat Sore"_ sesuai jam perangkat lokal Anda).
   - Periksa kartu navigasi menu utama, jam realtime lokal, dan tombol _Histori Transaksi_.

3. **Halaman `stok.html`:**
   - Amati tabel katalog buku yang dirender secara dinamis dari file `js/data.js`.
   - Coba fitur pencarian judul buku atau filter kategori.
   - Klik tombol **"+ Tambah Baris Stok Baru"**, isi data buku baru, dan klik submit. Baris baru akan langsung ditambahkan ke tabel via JavaScript DOM manipulation!
   - Klik tombol **"+ Pesan"** pada salah satu buku untuk memasukkannya ke keranjang belanja.

4. **Halaman `checkout.html`:**
   - Periksa ringkasan pesanan. Anda dapat menambah jumlah (`+`), mengurangi (`-`), atau menghapus item buku dari keranjang.
   - Biaya pengiriman dan total bayar akan terhitung ulang secara otomatis (_real-time_).
   - Lengkapi formulir informasi pemesan, lalu klik **"Konfirmasi & Proses Pesanan"**.
   - Muncul pop-up bukti pemesanan dengan Nomor DO baru. Klik tautan **"Lacak Status Pengiriman DO Sekarang"**.

5. **Halaman `tracking.html`:**
   - Masukkan Nomor DO (atau klik chip nomor DO `20230012` / `20230013`).
   - Klik **"Cari Pengiriman"**.
   - Amati **Visual Progress Bar**, badge warna status pengiriman, rincian ekspedisi, dan riwayat perjalanan paket yang dirender dari array JSON `perjalanan`.

### screenshot

![alt text](<img/ss/Screenshot 2026-11-02 163843.png>)
![alt text](</img/ss/Screenshot 2026-11-02 163910.png>)
![alt text](</img/ss/Screenshot 2026-11-02 163929.png>)
![alt text](</img/ss/Screenshot 2026-11-02 163955.png>)
![alt text](</img/ss/Screenshot 2026-11-02 164007.png>)
![alt text](</img/ss/Screenshot 2026-11-02 164007.png>)
![alt text](</img/ss/Screenshot 2026-11-02 164033.png>)


### link youtube

