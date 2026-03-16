# 🟩 Wordle Friends

Multiplayer Wordle real-time untuk kamu dan temen-temen!

## ✨ Fitur
- Real-time multiplayer via Socket.io (beda browser, beda HP, beda negara pun bisa!)
- Validasi kata dari GitHub (dwyl/english-words) — gak bisa asal tebak
- Kata harian yang sama untuk semua pemain
- Sidebar live update progress semua pemain
- Outro screen dengan leaderboard setelah semua selesai
- Play Again buat ronde practice dengan kata random

---

## 🚀 Deploy ke Railway

### Cara 1: Deploy dari GitHub (Recommended)

1. **Push ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "🟩 Wordle Friends initial commit"
   git remote add origin https://github.com/USERNAME/wordle-friends.git
   git push -u origin main
   ```

2. **Deploy di Railway:**
   - Buka [railway.app](https://railway.app) → Login
   - Klik **"New Project"** → **"Deploy from GitHub repo"**
   - Pilih repo `wordle-friends`
   - Railway otomatis detect Node.js dan deploy!
   - Klik **"Generate Domain"** untuk dapat URL publik

### Cara 2: Deploy via Railway CLI

```bash
npm install -g @railway/cli
railway login
railway init
railway up
railway domain
```

---

## 🛠️ Jalankan Lokal

```bash
npm install
npm start
# Buka http://localhost:3000
```

Untuk development dengan auto-reload:
```bash
npm run dev
```

---

## 📁 Struktur Project

```
wordle-friends/
├── server.js          # Backend: Express + Socket.io
├── package.json
├── railway.json       # Railway config
├── .gitignore
├── README.md
└── public/
    └── index.html     # Frontend game
```

---

## 🎮 Cara Main

1. Buka URL Railway kamu
2. Pilih avatar + isi nama → **Mulai Nebak!**
3. Share URL yang sama ke teman-teman
4. Semua langsung main bareng! Progress keliatan di sidebar kiri
5. Setelah semua selesai → Outro screen + leaderboard muncul
6. Klik **Main Lagi** untuk ronde baru dengan kata random

---

## ⚙️ Environment Variables (Optional)

Tidak diperlukan — Railway otomatis set `PORT`.
