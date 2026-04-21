# Richeese Risk Management System
Sistem Manajemen Risiko (Risk Management System) berbasis web yang dirancang untuk mengidentifikasi, menganalisis, dan memitigasi risiko operasional perusahaan. Aplikasi ini mengintegrasikan seluruh proses manajemen risiko mulai dari pendataan aset hingga pemetaan matriks risiko (Heatmap) secara otomatis.

## 🚀 Fitur Utama
- **Dashboard & Risk Matrix**: Visualisasi heatmap 3x3 (Likelihood vs Impact) untuk melihat sebaran risiko secara real-time.
- **Asset Management**: Inventarisasi aset kritis perusahaan beserta nilai kepentingannya.
- **Vulnerability & Threat Catalog**: Dokumentasi kelemahan sistem dan potensi ancaman yang mungkin terjadi.
- **Risk Analysis**: Perhitungan skor risiko otomatis berdasarkan parameter probabilitas dan dampak.
- **Mitigation/Control Management**: Perencanaan dan pelacakan kontrol (mitigasi) untuk menurunkan tingkat risiko.
- **Risk History (Audit Trail)**: Rekam jejak otomatis setiap perubahan data untuk transparansi dan audit.
- **User Management & RBAC**: Pengaturan hak akses berbasis peran (Admin, Manager, Crew).

## 🛠️ Stack Teknologi
- **Frontend**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: Shadcn UI (Radix UI)
- **Storage**: LocalStorage (Persistensi data sisi klien)
- **State Management**: React Hooks (useState, useEffect)

## 📋 Alur Analisis Risiko (Risk Workflow)
Aplikasi ini mengikuti standar manajemen risiko ISO 31000 dengan alur sebagai berikut:

1.  **Asset Identification**: Mendaftarkan aset perusahaan di menu *Asset Management*.
2.  **Vulnerability & Threat Mapping**: Mengidentifikasi kelemahan yang ada pada aset dan ancaman yang dapat mengeksploitasinya.
3.  **Risk Assessment**: Menentukan nilai *Likelihood* dan *Impact* untuk mendapatkan skor risiko.
4.  **Risk Matrix**: Melihat posisi risiko pada heatmap untuk menentukan prioritas penanganan.
5.  **Risk Mitigation**: Menentukan *Control* (tindakan pencegahan) untuk meminimalisir risiko.

## 🚦 Persyaratan Sistem
Pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (versi 18 ke atas)
- [npm](https://www.npmjs.com/)

## 💻 Cara Menjalankan Proyek
1. **Clone Repositori**
   ```bash
   git clone

2. **Instal Dependensi**
   ```bash
   npm install

3. **Jalankan Aplikasi**
   ```bash
   npm run dev
   
   Aplikasi akan berjalan di `http://localhost:5173`.

## 🔑 Kredensial Login (Default)
Sistem akan secara otomatis membuat akun administrator saat pertama kali dijalankan:
- **Email**: `admin@richeese.com`
- **Password**: `adminricheese123`

Aplikasi ini menggunakan **LocalStorage** sebagai penyimpanan utama di sisi klien, sehingga sistem dapat membaca dan menulis data langsung ke memori browser tanpa server eksternal. Arsitektur ini mensimulasikan fungsi API melalui beberapa kunci data terstruktur: **Endpoint Pengguna (`system_users`)** yang mengelola kredensial dan validasi login, **Endpoint Sesi (`user`)** untuk otorisasi akses berdasarkan peran, **Endpoint Audit Trail (`richeese_risk_history`)** yang mencatat riwayat aktivitas dan log login secara otomatis, serta **Endpoint Inventaris Aset (`richeese_assets`)** sebagai dasar kalkulasi skor risiko. Pendekatan ini menjamin performa tinggi tanpa latensi jaringan dengan struktur data yang siap diintegrasikan ke API sungguhan di masa depan.

## 📁 Struktur Folder Utama
```text
src/
├── app/
│   ├── components/
│   │   ├── figma/           # Komponen layout hasil slicing Figma
│   │   ├── ui/              # Komponen dasar
│   │   ├── AssetManagement.tsx
│   │   ├── ControlManagement.tsx
│   │   ├── RiskManagement.tsx
│   │   ├── ThreatManagement.tsx
│   │   ├── VulnerabilityManagement.tsx
│   │   └── ...
│   ├── App.tsx              # Wrapper provider
│   └── routes.tsx           # Konfigurasi react-router-dom
├── styles/
│   ├── fonts.css    # Definisi font-face
│   ├── index.css    # File utama yang mengimpor semua CSS
│   ├── tailwind.css # Base, Components, dan Utilities Tailwind
│   └── theme.css    # Variabel warna dan kustomisasi brand
└── main.tsx

## 🛡️ Keamanan & Validasi Data
- Input Sanitization: Mencegah input kosong atau nilai yang tidak logis (skala di luar 1-3).
- Referential Integrity: Memastikan data risiko terhubung secara benar dengan data aset dan ancaman yang ada.
- Audit Logging: Setiap aktivitas Create, Update, dan Delete dicatat secara otomatis ke dalam sistem *Risk History*.

## 📄 Lisensi
Proyek ini dibuat untuk tujuan akademik/internal. Seluruh aset visual mengikuti identitas merek yang bersangkutan.
