// Generator Paket Soal Perkalian — 5 paket berbeda, siap cetak.
// Tiap paket: 10 soal Pilihan Ganda (a, b, c) + 5 soal Isian Singkat.
// Dua mode: 'campuran' (soal cerita bernilai Islami tanpa label) dan
// 'konsep' (khusus konsep dasar perkalian = penjumlahan berulang,
// sebagian dilengkapi ilustrasi gambar buah, sayur & perlengkapan sekolah).

export type PackageMode = 'campuran' | 'konsep';

export interface Illustration {
  emoji: string; // benda yang digambar
  groups: number; // banyak kelompok (A)
  perGroup: number; // isi tiap kelompok (B)
  containerLabel: string; // misal "piring", "keranjang"
}

export interface GeneratedMC {
  no: number;
  question: string;
  options: string[];
  answerIndex: number; // 0-2 (a-c)
  answerLetter: string;
  topic: string;
  illustration?: Illustration;
}

export interface GeneratedShort {
  no: number;
  question: string;
  answer: string;
  topic: string;
  illustration?: Illustration;
  instructionAfterIllustration?: string;
  answerTemplate?: string;
}

export interface GeneratedPackage {
  packageNo: number;
  code: string;
  mode: PackageMode;
  mc: GeneratedMC[];
  short: GeneratedShort[];
}

const LETTERS = 'abc';

// ---------- Seeded RNG (mulberry32) agar tiap paket konsisten & berbeda ----------
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function shuffled<T>(rng: () => number, arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function repeatedText(value: number, times: number): string {
  return Array(times).fill(String(value)).join(' + ');
}

function pickDistinct<T>(rng: () => number, pool: T[], n: number): T[] {
  return shuffled(rng, pool).slice(0, n);
}

// ---------- Bank benda bergambar: buah, sayur, perlengkapan sekolah ----------
interface PictureItem {
  emoji: string;
  name: string;
  container: string;
  category: 'buah' | 'sayur' | 'sekolah';
}

const PICTURE_ITEMS: PictureItem[] = [
  // Buah
  { emoji: '🍎', name: 'apel', container: 'piring', category: 'buah' },
  { emoji: '🍌', name: 'pisang', container: 'keranjang', category: 'buah' },
  { emoji: '🍊', name: 'jeruk', container: 'kantong', category: 'buah' },
  { emoji: '🍇', name: 'tangkai anggur', container: 'piring', category: 'buah' },
  { emoji: '🍉', name: 'potong semangka', container: 'nampan', category: 'buah' },
  { emoji: '🥭', name: 'mangga', container: 'keranjang', category: 'buah' },
  { emoji: '🍓', name: 'stroberi', container: 'mangkuk', category: 'buah' },
  { emoji: '🍐', name: 'pir', container: 'kantong', category: 'buah' },
  // Sayur
  { emoji: '🥕', name: 'wortel', container: 'ikat', category: 'sayur' },
  { emoji: '🌽', name: 'jagung', container: 'keranjang', category: 'sayur' },
  { emoji: '🍅', name: 'tomat', container: 'kantong', category: 'sayur' },
  { emoji: '🥒', name: 'timun', container: 'piring', category: 'sayur' },
  { emoji: '🥔', name: 'kentang', container: 'karung kecil', category: 'sayur' },
  { emoji: '🧅', name: 'bawang', container: 'kantong', category: 'sayur' },
  // Perlengkapan sekolah
  { emoji: '✏️', name: 'pensil', container: 'kotak pensil', category: 'sekolah' },
  { emoji: '📚', name: 'buku', container: 'tas', category: 'sekolah' },
  { emoji: '🖍️', name: 'krayon', container: 'kotak', category: 'sekolah' },
  { emoji: '📏', name: 'penggaris', container: 'kotak', category: 'sekolah' },
  { emoji: '🎒', name: 'tas sekolah', container: 'rak', category: 'sekolah' },
  { emoji: '✂️', name: 'gunting', container: 'kotak', category: 'sekolah' },
  { emoji: '📎', name: 'penjepit kertas', container: 'wadah', category: 'sekolah' },
  { emoji: '🧷', name: 'peniti', container: 'kotak kecil', category: 'sekolah' },
];

// ---------- Konteks bernilai Islami (tanpa label pada soal) ----------
// Setiap konteks diberi fungsi pembuat kalimat sesuai benda bergambar.
type ContextMaker = (item: PictureItem, g: number, b: number) => string;

const ISLAMIC_PICTURE_CONTEXTS: ContextMaker[] = [
  (it, g, b) =>
    `Setelah sholat Subuh, Aisyah membantu Ibu menyiapkan ${g} ${it.container} berisi ${it.name}. Setiap ${it.container} berisi ${b} ${it.name}. Berapa jumlah semua ${it.name}?`,
  (it, g, b) =>
    `Untuk berbagi takjil, Umar menyiapkan ${g} ${it.container} ${it.name}. Setiap ${it.container} berisi ${b} ${it.name}. Berapa jumlah semua ${it.name}?`,
  (it, g, b) =>
    `Fatimah bersedekah ${g} ${it.container} ${it.name} untuk tetangga. Setiap ${it.container} berisi ${b} ${it.name}. Berapa jumlah semua ${it.name}?`,
  (it, g, b) =>
    `Ustadzah membagikan ${it.name} kepada ${g} santri TPA. Setiap santri mendapat ${b} ${it.name}. Berapa jumlah ${it.name} yang dibagikan?`,
  (it, g, b) =>
    `Sebelum mengaji, Hasan merapikan ${g} ${it.container} ${it.name}. Setiap ${it.container} berisi ${b} ${it.name}. Berapa jumlah semua ${it.name}?`,
  (it, g, b) =>
    `Panitia pengajian menyiapkan ${g} ${it.container} ${it.name}. Setiap ${it.container} berisi ${b} ${it.name}. Berapa jumlah semua ${it.name}?`,
  (it, g, b) =>
    `Ali berbagi ${it.name} dengan ${g} teman sekelasnya dengan adil. Setiap teman mendapat ${b} ${it.name}. Berapa jumlah ${it.name} yang dibagikan?`,
  (it, g, b) =>
    `Setelah berdoa sebelum makan, Zahra melihat ${g} ${it.container} ${it.name} di meja. Setiap ${it.container} berisi ${b} ${it.name}. Berapa jumlah semua ${it.name}?`,
  (it, g, b) =>
    `Untuk hadiah hafalan surat pendek, Ustadz menyiapkan ${g} ${it.container} ${it.name}. Setiap ${it.container} berisi ${b} ${it.name}. Berapa jumlah semua ${it.name}?`,
  (it, g, b) =>
    `Bilal menjaga amanah Ibu menata ${g} ${it.container} ${it.name} untuk dijual. Setiap ${it.container} berisi ${b} ${it.name}. Berapa jumlah semua ${it.name}?`,
];

// Soal cerita Islami umum (mode campuran, tanpa gambar)
type StoryTemplate = (g: number, b: number) => string;

const ISLAMIC_STORIES: StoryTemplate[] = [
  (g, b) =>
    `Menjelang buka puasa, Ibu menyiapkan ${g} piring kurma. Setiap piring berisi ${b} buah kurma. Berapa jumlah semua kurma?`,
  (g, b) =>
    `Di TPA Al-Hikmah ada ${g} kelompok santri. Setiap kelompok terdiri dari ${b} anak. Berapa jumlah semua santri?`,
  (g, b) =>
    `Ustadz membagikan buku Iqro kepada ${g} anak. Setiap anak mendapat ${b} buku. Berapa jumlah semua buku Iqro?`,
  (g, b) =>
    `Di masjid ada ${g} kotak infak. Setiap kotak berisi ${b} amplop sedekah. Berapa jumlah semua amplop?`,
  (g, b) =>
    `Ada ${g} sajadah panjang di musala. Setiap sajadah cukup untuk ${b} orang. Berapa orang yang bisa sholat bersama?`,
  (g, b) =>
    `Selama ${g} hari, Aisyah menghafal ${b} doa pendek setiap hari. Berapa jumlah doa yang sudah dihafal?`,
  (g, b) =>
    `Pada Jumat Berkah, relawan menyiapkan ${g} kantong sembako. Setiap kantong berisi ${b} bungkus beras. Berapa jumlah semua bungkus beras?`,
  (g, b) =>
    `Di perpustakaan masjid ada ${g} rak. Setiap rak berisi ${b} Al-Qur\u2019an. Berapa jumlah semua Al-Qur\u2019an?`,
  (g, b) =>
    `Fatimah membuat ${g} tasbih mainan. Setiap tasbih memakai ${b} manik warna. Berapa jumlah semua manik?`,
  (g, b) =>
    `Selama ${g} pekan, Umar menyetor hafalan ${b} surat pendek setiap pekan. Berapa jumlah surat yang disetor?`,
  (g, b) =>
    `Panitia takjil menyiapkan ${g} nampan kue. Setiap nampan berisi ${b} kue. Berapa jumlah semua kue takjil?`,
  (g, b) =>
    `Hasan membantu Ayah menata ${g} baris sandal jamaah di depan masjid. Setiap baris berisi ${b} pasang sandal. Berapa jumlah semua pasang sandal?`,
];

const DAILY_STORIES: StoryTemplate[] = [
  (g, b) => `Ibu membeli ${g} kantong jeruk. Setiap kantong berisi ${b} jeruk. Berapa jumlah semua jeruk?`,
  (g, b) => `Ada ${g} kotak pensil warna. Setiap kotak berisi ${b} pensil. Berapa jumlah semua pensil?`,
  (g, b) => `Di parkiran sekolah ada ${g} sepeda. Setiap sepeda mempunyai ${b} roda. Berapa jumlah semua roda?`,
  (g, b) => `Nenek memanen ${g} ikat wortel. Setiap ikat berisi ${b} wortel. Berapa jumlah semua wortel?`,
  (g, b) => `Di lapangan ada ${g} baris bendera. Setiap baris berisi ${b} bendera. Berapa jumlah semua bendera?`,
  (g, b) => `Ayah menata ${g} rak buku. Setiap rak berisi ${b} buku. Berapa jumlah semua buku?`,
];

// ---------- Distraktor angka yang masuk akal (ambil 2) ----------
function numericDistractors(rng: () => number, a: number, b: number, correct: number): number[] {
  const candidates = [
    a + b,
    correct + 1,
    correct - 1,
    correct + a,
    correct + b,
    (a + 1) * b,
    a * (b + 1),
    correct - a,
    correct + 2,
    correct - 2,
    correct + 10,
  ];
  const uniq: number[] = [];
  for (const c of candidates) {
    if (c > 0 && c !== correct && !uniq.includes(c)) uniq.push(c);
    if (uniq.length >= 6) break;
  }
  return shuffled(rng, uniq).slice(0, 2);
}

function makeMC(
  rng: () => number,
  no: number,
  question: string,
  correct: string,
  wrongPool: string[],
  topic: string,
  illustration?: Illustration,
): GeneratedMC {
  const wrongs = pickDistinct(
    rng,
    wrongPool.filter((w, i, arr) => w !== correct && arr.indexOf(w) === i),
    2,
  );
  const options = shuffled(rng, [correct, ...wrongs]);
  const answerIndex = options.indexOf(correct);
  return {
    no,
    question,
    options,
    answerIndex,
    answerLetter: LETTERS[answerIndex],
    topic,
    illustration,
  };
}

function numericMC(
  rng: () => number,
  no: number,
  question: string,
  a: number,
  b: number,
  topic: string,
  illustration?: Illustration,
): GeneratedMC {
  const correct = a * b;
  return makeMC(
    rng,
    no,
    question,
    String(correct),
    numericDistractors(rng, a, b, correct).map(String),
    topic,
    illustration,
  );
}

// ---------- Ambil pasangan faktor unik dalam satu paket ----------
function uniquePair(
  rng: () => number,
  maxFactor: number,
  used: Set<string>,
  minA = 2,
  maxB?: number,
): { a: number; b: number } {
  const bMax = maxB ?? maxFactor;
  for (let attempt = 0; attempt < 60; attempt++) {
    const a = randInt(rng, minA, maxFactor);
    const b = randInt(rng, 1, bMax);
    const key = `${a}x${b}`;
    if (!used.has(key)) {
      used.add(key);
      return { a, b };
    }
  }
  const a = randInt(rng, minA, maxFactor);
  const b = randInt(rng, 1, bMax);
  used.add(`${a}x${b}-${rng()}`);
  return { a, b };
}

// Pasangan untuk soal bergambar: dibatasi agar gambar tetap rapi di kertas
function picturePair(rng: () => number, used: Set<string>): { a: number; b: number } {
  return uniquePair(rng, 5, used, 2, 5);
}

function illustrationFor(item: PictureItem, a: number, b: number): Illustration {
  return { emoji: item.emoji, groups: a, perGroup: b, containerLabel: item.container };
}

// =====================================================================
// MODE CAMPURAN
// =====================================================================
function buildMixedPackage(packageNo: number, maxFactor: number, seed: number): GeneratedPackage {
  const rng = mulberry32(seed + packageNo * 7919);
  const used = new Set<string>();
  const mc: GeneratedMC[] = [];
  const short: GeneratedShort[] = [];
  const islamicPool = shuffled(rng, ISLAMIC_STORIES);
  const dailyPool = shuffled(rng, DAILY_STORIES);
  const picturePool = shuffled(rng, PICTURE_ITEMS);
  const ctxPool = shuffled(rng, ISLAMIC_PICTURE_CONTEXTS);
  let iIdx = 0;
  let dIdx = 0;
  let pIdx = 0;
  let cIdx = 0;
  const nextIslamic = () => islamicPool[iIdx++ % islamicPool.length];
  const nextDaily = () => dailyPool[dIdx++ % dailyPool.length];
  const nextPicture = () => picturePool[pIdx++ % picturePool.length];
  const nextCtx = () => ctxPool[cIdx++ % ctxPool.length];

  // PG 1-2 : perkalian langsung
  for (let i = 0; i < 2; i++) {
    const { a, b } = uniquePair(rng, maxFactor, used);
    mc.push(numericMC(rng, mc.length + 1, `Hasil dari ${a} \u00d7 ${b} adalah ....`, a, b, 'Perkalian langsung'));
  }

  // PG 3 : analogi resep dokter
  {
    const { a, b } = uniquePair(rng, Math.min(maxFactor, 5), used);
    mc.push(
      makeMC(
        rng,
        mc.length + 1,
        `Resep dokter tertulis "${a} \u00d7 ${b}". Artinya ....`,
        `Angka ${b} diulang ${a} kali (${repeatedText(b, a)})`,
        [
          `Angka ${a} diulang ${b} kali (${repeatedText(a, b)})`,
          `${a} ditambah ${b} sama dengan ${a + b}`,
          `Angka ${b} diulang ${a + 1} kali (${repeatedText(b, a + 1)})`,
        ],
        'Resep dokter',
      ),
    );
  }

  // PG 4 : penjumlahan berulang -> perkalian
  {
    const { a, b } = uniquePair(rng, Math.min(maxFactor, 6), used);
    mc.push(
      makeMC(
        rng,
        mc.length + 1,
        `Bentuk perkalian dari ${repeatedText(b, a)} adalah ....`,
        `${a} \u00d7 ${b}`,
        [`${b} \u00d7 ${a}`, `${a} + ${b}`, `${a} \u00d7 ${a}`, `${a + 1} \u00d7 ${b}`],
        'Penjumlahan berulang',
      ),
    );
  }

  // PG 5 : soal bergambar bernuansa Islami
  {
    const item = nextPicture();
    const { a, b } = picturePair(rng, used);
    mc.push(
      numericMC(rng, mc.length + 1, nextCtx()(item, a, b), a, b, 'Soal bergambar', illustrationFor(item, a, b)),
    );
  }

  // PG 6-7 : soal cerita bernilai Islami
  for (let i = 0; i < 2; i++) {
    const { a, b } = uniquePair(rng, Math.min(maxFactor, 6), used);
    mc.push(numericMC(rng, mc.length + 1, nextIslamic()(a, b), a, b, 'Soal cerita'));
  }

  // PG 8 : soal cerita sehari-hari
  {
    const { a, b } = uniquePair(rng, maxFactor, used);
    mc.push(numericMC(rng, mc.length + 1, nextDaily()(a, b), a, b, 'Soal cerita'));
  }

  // PG 9 : lambang perkalian
  {
    const { a, b } = uniquePair(rng, Math.min(maxFactor, 6), used);
    mc.push(
      makeMC(
        rng,
        mc.length + 1,
        `Lambang perkalian yang tepat untuk "angka ${b} diulang ${a} kali" adalah ....`,
        `${a} \u00d7 ${b}`,
        [`${b} \u00d7 ${a}`, `${a} + ${b}`, `${b} - ${a}`],
        'Konsep perkalian',
      ),
    );
  }

  // PG 10 : perkalian langsung
  {
    const { a, b } = uniquePair(rng, maxFactor, used);
    mc.push(numericMC(rng, mc.length + 1, `Hasil dari ${a} \u00d7 ${b} adalah ....`, a, b, 'Perkalian langsung'));
  }

  // ---- ISIAN ----
  for (let i = 0; i < 2; i++) {
    const { a, b } = uniquePair(rng, maxFactor, used);
    short.push({ no: short.length + 1, question: `${a} \u00d7 ${b} = ....`, answer: String(a * b), topic: 'Perkalian langsung' });
  }
  {
    const { a, b } = uniquePair(rng, Math.min(maxFactor, 5), used);
    short.push({
      no: short.length + 1,
      question: `${repeatedText(b, a)} = .... \u00d7 .... = ....`,
      answer: `${a} \u00d7 ${b} = ${a * b}`,
      topic: 'Penjumlahan berulang',
    });
  }
  {
    const item = nextPicture();
    const { a, b } = picturePair(rng, used);
    short.push({
      no: short.length + 1,
      question: `${nextCtx()(item, a, b)} (Tulis cara dan jawabannya!)`,
      answer: `${a} \u00d7 ${b} = ${a * b}`,
      topic: 'Soal bergambar',
      illustration: illustrationFor(item, a, b),
    });
  }
  {
    const { a, b } = uniquePair(rng, Math.min(maxFactor, 6), used);
    short.push({
      no: short.length + 1,
      question: `${nextIslamic()(a, b)} (Tulis cara dan jawabannya!)`,
      answer: `${a} \u00d7 ${b} = ${a * b}`,
      topic: 'Soal cerita',
    });
  }

  return { packageNo, code: `PKT-${packageNo}`, mode: 'campuran', mc, short };
}

// =====================================================================
// MODE KONSEP DASAR (penjumlahan berulang, banyak ilustrasi gambar)
// =====================================================================
function buildConceptPackage(packageNo: number, maxFactor: number, seed: number): GeneratedPackage {
  const rng = mulberry32(seed + 104729 + packageNo * 7919);
  const used = new Set<string>();
  const mc: GeneratedMC[] = [];
  const short: GeneratedShort[] = [];
  const picturePool = shuffled(rng, PICTURE_ITEMS);
  const ctxPool = shuffled(rng, ISLAMIC_PICTURE_CONTEXTS);
  let pIdx = 0;
  let cIdx = 0;
  const nextPicture = () => picturePool[pIdx++ % picturePool.length];
  const nextCtx = () => ctxPool[cIdx++ % ctxPool.length];
  const capA = Math.min(maxFactor, 6);

  // PG 1 : gambar -> bentuk penjumlahan berulang
  {
    const item = nextPicture();
    const { a, b } = picturePair(rng, used);
    mc.push(
      makeMC(
        rng,
        mc.length + 1,
        `Perhatikan gambar! Ada ${a} ${item.container}, setiap ${item.container} berisi ${b} ${item.name}. Bentuk penjumlahan berulangnya adalah ....`,
        `${repeatedText(b, a)}`,
        [`${repeatedText(a, b)}`, `${a} + ${b}`, `${repeatedText(b, a + 1)}`, `${repeatedText(b, a + 2)}`],
        'Gambar ke penjumlahan berulang',
        illustrationFor(item, a, b),
      ),
    );
  }

  // PG 2 : gambar -> kalimat perkalian
  {
    const item = nextPicture();
    const { a, b } = picturePair(rng, used);
    mc.push(
      makeMC(
        rng,
        mc.length + 1,
        `Perhatikan gambar! Kalimat perkalian yang sesuai adalah ....`,
        `${a} \u00d7 ${b} = ${a * b}`,
        [`${b} \u00d7 ${a} = ${a * b}`, `${a} + ${b} = ${a + b}`, `${a} \u00d7 ${a} = ${a * a}`, `${a + 1} \u00d7 ${b} = ${(a + 1) * b}`],
        'Gambar ke perkalian',
        illustrationFor(item, a, b),
      ),
    );
  }

  // PG 3 : resep dokter
  {
    const { a, b } = uniquePair(rng, Math.min(maxFactor, 5), used);
    mc.push(
      makeMC(
        rng,
        mc.length + 1,
        `Dokter menulis aturan minum obat "${a} \u00d7 ${b}". Artinya ....`,
        `Minum ${b} tablet, diulang ${a} kali (${repeatedText(b, a)})`,
        [
          `Minum ${a} tablet, diulang ${b} kali (${repeatedText(a, b)})`,
          `Minum ${a + b} tablet sekaligus`,
          `Minum ${b} tablet, diulang ${a + 1} kali (${repeatedText(b, a + 1)})`,
        ],
        'Resep dokter',
      ),
    );
  }

  // PG 4 : penjumlahan berulang -> perkalian
  {
    const { a, b } = uniquePair(rng, capA, used);
    mc.push(
      makeMC(
        rng,
        mc.length + 1,
        `Bentuk perkalian dari ${repeatedText(b, a)} adalah ....`,
        `${a} \u00d7 ${b}`,
        [`${b} \u00d7 ${a}`, `${a} + ${b}`, `${b} \u00d7 ${b}`, `${a + 1} \u00d7 ${b}`],
        'Penjumlahan berulang',
      ),
    );
  }

  // PG 5 : perkalian -> penjumlahan berulang
  {
    const { a, b } = uniquePair(rng, Math.min(maxFactor, 5), used);
    mc.push(
      makeMC(
        rng,
        mc.length + 1,
        `Bentuk penjumlahan berulang dari ${a} \u00d7 ${b} adalah ....`,
        `${repeatedText(b, a)} = ${a * b}`,
        [`${repeatedText(a, b)} = ${a * b}`, `${a} + ${b} = ${a + b}`, `${repeatedText(b, a + 1)} = ${(a + 1) * b}`, `${repeatedText(b, a + 2)} = ${(a + 2) * b}`],
        'Penjumlahan berulang',
      ),
    );
  }

  // PG 6 : gambar -> hasil (cerita bernilai Islami)
  {
    const item = nextPicture();
    const { a, b } = picturePair(rng, used);
    mc.push(numericMC(rng, mc.length + 1, nextCtx()(item, a, b), a, b, 'Soal bergambar', illustrationFor(item, a, b)));
  }

  // PG 7 : banyak kelompok (pengali)
  {
    const item = nextPicture();
    const { a, b } = picturePair(rng, used);
    mc.push(
      makeMC(
        rng,
        mc.length + 1,
        `Perhatikan gambar! Pada perkalian ${a} \u00d7 ${b}, angka ${a} menunjukkan ....`,
        `banyak ${item.container} (kelompok)`,
        [`banyak ${item.name} di setiap ${item.container}`, `jumlah semua ${item.name}`],
        'Makna angka pengali',
        illustrationFor(item, a, b),
      ),
    );
  }

  // PG 8 : isi tiap kelompok
  {
    const item = nextPicture();
    const { a, b } = picturePair(rng, used);
    mc.push(
      makeMC(
        rng,
        mc.length + 1,
        `Perhatikan gambar! Pada perkalian ${a} \u00d7 ${b}, angka ${b} menunjukkan ....`,
        `banyak ${item.name} di setiap ${item.container}`,
        [`banyak ${item.container}`, `jumlah semua ${item.name}`],
        'Makna angka yang dikalikan',
        illustrationFor(item, a, b),
      ),
    );
  }

  // PG 9 : 3 x 1 vs 1 x 3
  {
    const b = randInt(rng, 2, 5);
    const a = randInt(rng, 2, 4);
    mc.push(
      makeMC(
        rng,
        mc.length + 1,
        `Manakah bentuk penjumlahan berulang yang BENAR?`,
        `${a} \u00d7 ${b} = ${repeatedText(b, a)}`,
        [`${a} \u00d7 ${b} = ${repeatedText(a, b)}`, `${a} \u00d7 ${b} = ${a} + ${b}`, `${a} \u00d7 ${b} = ${repeatedText(b, a + 1)}`, `${a} \u00d7 ${b} = ${repeatedText(b, a + 2)}`],
        'Konsep perkalian',
      ),
    );
  }

  // PG 10 : perkalian dengan 1
  {
    const b = randInt(rng, 2, maxFactor);
    mc.push(
      makeMC(
        rng,
        mc.length + 1,
        `Hasil dari 1 \u00d7 ${b} adalah ....`,
        String(b),
        [String(b + 1), String(1), String(b + b)],
        'Perkalian dengan 1',
      ),
    );
  }

  // ---- ISIAN ----
  {
    const item = nextPicture();
    const { a, b } = picturePair(rng, used);
    short.push({
      no: short.length + 1,
      question: 'Perhatikan gambar!',
      instructionAfterIllustration:
        'Tuliskan bentuk penjumlahan berulang, bentuk perkaliannya, serta hasil perkaliannya.',
      answerTemplate: `${Array(a).fill('....').join(' + ')} = .... \u00d7 .... = ....`,
      answer: `${repeatedText(b, a)} = ${a} \u00d7 ${b} = ${a * b}`,
      topic: 'Gambar ke perkalian',
      illustration: illustrationFor(item, a, b),
    });
  }
  {
    const { a, b } = uniquePair(rng, Math.min(maxFactor, 5), used);
    short.push({
      no: short.length + 1,
      question: `${repeatedText(b, a)} = .... \u00d7 .... = ....`,
      answer: `${a} \u00d7 ${b} = ${a * b}`,
      topic: 'Penjumlahan berulang',
    });
  }
  {
    const { a, b } = uniquePair(rng, Math.min(maxFactor, 5), used);
    short.push({
      no: short.length + 1,
      question: `${a} \u00d7 ${b} = .... + .... + .... (tulis lengkap) = ....`,
      answer: `${repeatedText(b, a)} = ${a * b}`,
      topic: 'Perkalian ke penjumlahan berulang',
    });
  }
  {
    const item = nextPicture();
    const { a, b } = picturePair(rng, used);
    short.push({
      no: short.length + 1,
      question: `${nextCtx()(item, a, b)} (Tulis bentuk penjumlahan berulang dan perkaliannya!)`,
      answer: `${repeatedText(b, a)} = ${a} \u00d7 ${b} = ${a * b}`,
      topic: 'Soal bergambar',
      illustration: illustrationFor(item, a, b),
    });
  }
  {
    const { a, b } = uniquePair(rng, Math.min(maxFactor, 5), used);
    short.push({
      no: short.length + 1,
      question: `Dokter menulis aturan minum "${a} \u00d7 ${b} tablet sehari". Jumlah tablet yang diminum dalam sehari adalah .... tablet.`,
      answer: `${repeatedText(b, a)} = ${a * b}`,
      topic: 'Resep dokter',
    });
  }

  return { packageNo, code: `KD-${packageNo}`, mode: 'konsep', mc, short };
}

export function generatePackages(maxFactor: number, seed: number, mode: PackageMode = 'campuran'): GeneratedPackage[] {
  const safeMax = maxFactor <= 5 ? 5 : 10;
  return [1, 2, 3, 4, 5].map((n) =>
    mode === 'konsep' ? buildConceptPackage(n, safeMax, seed) : buildMixedPackage(n, safeMax, seed),
  );
}
