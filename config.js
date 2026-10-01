// ====== EDIT DI SINI SAJA ======
const CONFIG = {
  // boleh satu alamat, atau beberapa (dicoba berurutan). Contoh link: music: ["https://situsmu.com/lagu.mp3", "assets/backsound.mp3"],
  music: "assets/backsound.mp3",   // lagu utama, mulai di teks "You look so pretty"
  volume: 0.7,
  musicStart: 13.0,   // detik di lagu tempat musik mulai (supaya pas dengan teks pertama seperti di video)
  musicLead: 600,     // ms musik jalan dulu sebelum kata pertama muncul

  // Foto: isi "src" dengan LINK foto (harus link langsung .jpg/.png) lalu ganti judulnya
  photos: [
    { src: "https://i.ibb.co.com/HvtWhKX/1790846336301.jpg", caption: "My girl", color: "red",  rot: -5 },
    { src: "https://i.ibb.co.com/vxdkbv7w/IMG-20261001-WA0016.jpg", caption: "my girl", color: "dark", rot: 3, capTop: true },
    { src: "https://i.ibb.co.com/mVNcQnwB/1790846302338.jpg", caption: "my girl", color: "red",  rot: -3 }
  ],

  header: { small: "happy", title: "National Girlfriend Day", sub: "put us back together", hint: "drag each piece into place" },

  // TEMPEL LIRIK DI SINI (di antara tanda ` `), 10 baris persis seperti urutan yang kamu kirim ke aku.
  // Kode otomatis memotongnya per kata dan mengatur waktunya sesuai video. Urutan baris jangan diubah.
  lyricsText: `You look so pretty and I love this view
Don't bother looking down, we're not going that way
At least I know, I am here to stay
We fell in love in October
That's why I love fall
Looking at the stars
Admiring from afar
My girl
My girl
My girl`,

  // Pengaturan waktu (otomatis, tidak perlu diubah).
  // line = baris ke berapa dari lirik yang ditempel (mulai 0), from/to = potongan katanya
  // gap = jeda antar kata (ms), total = lama baris tampil (ms)
  cues: [
    { line: 0, to: 4,   gap: 220, total: 950 },
    { line: 0, from: 4, gap: 450, total: 5400 },
    { line: 3,          gap: 500, total: 4600 },
    { line: 4, to: 2,   gap: 450, total: 1600 },
    { line: 4, from: 2, gap: 450, total: 1500 },
    { line: 5,          gap: 500, total: 2500 },
    { line: 6,          gap: 500, total: 3500 }
  ],

  // Kata-kata penyemangat di bagian bawah (bergantian tiap beberapa detik). Bebas diganti.
  quotes: [
    "Hari ini boleh capek, boleh pelan. Yang penting kamu tidak menyerah. Aku bangga sama kamu.",
    "Kamu lebih kuat dari yang kamu kira, dan lebih berharga dari yang kamu sadari.",
    "Kalau hari ini terasa berat, ingat ya: ada aku yang selalu percaya sama kamu.",
    "Satu langkah kecil tetap namanya maju. Pelan-pelan saja, aku di sini menemani.",
    "Apa pun yang terjadi, kamu tidak sendirian. Semangat ya, sayang ♥"
  ],

  endTitle: "Happy National Girlfriend Day",
  endText: "I love you, now and always ♥"
};
