# 📂 Dokumentasi Database: KKM

## 1. Login (Autentikasi)
**Tabel:** `users`
* **Fungsi:** Untuk ngurusin siapa yang boleh masuk dan dia sebagai apa.
* **Kenapa dipisah dari data profil?** Biar fleksibel. Kalau nanti ada user tipe baru (misal: 'alumni' atau 'dosen'), kita nggak perlu ngacak-ngacak tabel profil mahasiswa.
* **password:** Kolom ini wajib diisi hasil hashing (pakai Bcrypt atau Argon2).
* **role:** Sistem backend harus baca kolom ini buat nentuin user dilempar ke Dashboard Admin atau Dashboard Mahasiswa.

## 2. Profil Mahasiswa
**Tabel:** `students`
* **Fungsi:** Untuk tabel identitas utama.
* **Relasi:** `user_id` nyambung ke tabel `users`. Jadi, satu akun login = satu data mahasiswa.
* **ON DELETE CASCADE:** Fitur bersih-bersih otomatis. Kalau akun user di tabel `users` dihapus, data di tabel ini otomatis ikut hilang. Biar gak ada sampah data (*orphan data*).

## 3. Analisis Skill (Many-to-Many)
Kita pakai dua tabel:

### A. Tabel Master: `skills`
* Isinya cuma daftar skill baku: "Python", "Public Speaking", "Data Analysis".
* **Tujuannya:** Biar penulisan skill seragam. Jangan sampai ada mahasiswa nulis "Excel", ada yang "Ms. Excel", ada yang "Microsoft Excel". Kalau seragam, gampang dihitung statistiknya.

### B. Tabel Pivot: `student_skills`
* Tabel ini mencatat: *"Mahasiswa A punya Skill B"*.
* Satu mahasiswa bisa punya banyak skill, satu skill bisa dimiliki banyak mahasiswa.

## 4. Portofolio & Validasi Admin
**Tabel:** `portfolios`
Di sini mahasiswa setor bukti kompetensi, dan Admin kerja.
* **file_path:** Kita simpan alamat/link filenya aja (misal: `/uploads/sertifikat/file.pdf`), bukan filenya langsung di database. Biar database gak lelet.
* **Workflow Kolom status:**
    1.  Mahasiswa upload -> Default status `pending`.
    2.  Admin cek -> Kalau oke, ubah jadi `approved`.
    3.  Kalau jelek -> Ubah jadi `rejected`.
* **admin_feedback:** Kalau Admin nge-reject, wajib isi kolom ini. Biar mahasiswa tau salahnya di mana (kurang jelas, file rusak, dll).

## 5. Mading Pengumuman (Fitur Admin)
Admin bisa posting 3 jenis konten. Kita pisah tabelnya biar datanya spesifik.

* **A. `jobs` (Lowongan Kerja):** Fokus ke tipe lowongan (`fulltime`/`internship`) dan syaratnya (`requirements`). `admin_user_id` buat jejak audit (kita jadi tau admin mana yang posting lowongan ini).
* **B. `trainings` (Pelatihan Kampus):** Fokus ke `schedule` (kapan) dan `organizer` (siapa penyelenggaranya).
* **C. `projects` (Proyek Industri):** Fokus ke `status` (`open`/`closed`). Kalau project udh penuh kuotanya, Admin tinggal update status jadi `closed`, jadi nggak muncul lagi di dashboard mahasiswa.
