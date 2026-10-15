// Article content for /artikel. One flat list, each item tagged with a `category` (one of
// ARTICLE_CATEGORIES below) and a `slug`, unique WITHIN its category — the public URL is
// /artikel/<category>/<slug>. ArtikelDetail.jsx renders every article through the same fixed
// layout (see its own comment): carousel 1 -> paragraph 1 -> carousel 2 -> paragraph 2 -> CTA
// button -> YouTube video (only if `videoUrl` is set).
//
// Optional `sources: [{ label, url }]` renders a "Sumber & Rujukan" list under the article text
// (used by the Perizinan articles, which cite the official regulation texts).
//
// `images1` / `images2` are the two carousels. They're left EMPTY here on purpose — the actual
// image links are still to be supplied; ArtikelDetail simply skips a carousel with no images, so
// the page is complete and correct with them empty, just plainer, until they're filled in.

export const ARTICLE_CATEGORIES = [
  { slug: 'edukasi', label: 'Edukasi' },
  { slug: 'panduan', label: 'Panduan' },
  { slug: 'regulasi', label: 'Regulasi' },
  { slug: 'perizinan', label: 'Perizinan' },
  { slug: 'layanan-kami', label: 'Layanan Kami' },

];

export function categoryLabel(slug) {
  return ARTICLE_CATEGORIES.find((c) => c.slug === slug)?.label || slug;
}

const DEFAULT_CTA = { ctaLabel: 'Lihat Daftar Harga & Konsultasi Gratis', ctaPath: '/harga-limbah' };

export const articles = [
  // ---- The 9 requested articles -----------------------------------------------------------
  {
    category: 'edukasi', slug: 'apa-itu-limbah-b3',
    title: 'Apa Itu Limbah B3?',
    excerpt: 'Pengertian limbah Bahan Berbahaya dan Beracun (B3), sumbernya, dan mengapa penanganannya diatur ketat oleh pemerintah.',
    author: 'Tim LIMBAHIN', date: '2026-09-22',
    images1: [
      "https://lh3.googleusercontent.com/d/1K5FB5CkdDFxnsy1KUkGiv7Y5amTCE2EQ"
    ], images2: [],
    paragraphs1: [
        'Limbah Bahan Berbahaya dan Beracun (B3) adalah sisa suatu usaha atau kegiatan yang mengandung zat berbahaya dan/atau beracun, yang karena sifat, konsentrasi, atau jumlahnya — baik secara langsung maupun tidak langsung — dapat mencemarkan lingkungan, merusak lingkungan, dan/atau membahayakan kesehatan manusia.',
        'Definisi ini diatur dalam Undang-Undang No. 32 Tahun 2009 dan diperjelas lebih lanjut dalam PP No. 22 Tahun 2021. Limbah B3 bisa berasal dari mana saja — bukan hanya pabrik, tetapi juga rumah sakit, klinik, hotel, kantor, dan bengkel.'
      ],
    paragraphs2: [
        'Empat sumber limbah B3 yang paling umum adalah limbah medis (jarum suntik, APD, kassa terkontaminasi), limbah industri (oli bekas, solvent, bahan kimia proses), limbah komersial (baterai bekas, lampu TL, toner printer), dan limbah produk/bahan (barang reject, produk kedaluwarsa).',
        'Setiap penghasil limbah B3 wajib mengelolanya melalui pihak ketiga berizin — bukan dibuang sembarangan — mulai dari pengumpulan, pengangkutan dengan manifest resmi, hingga pemusnahan di fasilitas yang diakui KLHK.'
      ],
    related: [{ category: 'edukasi', slug: 'pengangkutan-limbah-b3' }, { category: 'panduan', slug: 'cara-pengelolaan-limbah-b3' }],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'edukasi', slug: 'apa-itu-festronik',
    title: 'Apa Itu Festronik?',
    excerpt: 'Mengenal Festronik, sistem manifest elektronik resmi KLHK untuk mencatat setiap pergerakan limbah B3 di Indonesia.',
    author: 'Tim LIMBAHIN', date: '2026-09-22',
    images1: ["https://lh3.googleusercontent.com/d/1x9fTJ46ALArZOfxA69DGkJ0TFIKQtVVi"], images2: [],
    paragraphs1: [
        'Festronik (Sistem Manifest Elektronik Limbah B3) adalah platform digital resmi milik Kementerian Lingkungan Hidup dan Kehutanan (KLHK) untuk mencatat dan melacak setiap pergerakan limbah B3 di Indonesia — dari penghasil, pengangkut, hingga pengelola akhir.',
        'Sistem ini menggantikan manifest kertas manual dengan dokumen elektronik yang terintegrasi secara real-time, sehingga setiap pihak yang berwenang dapat melacak status limbah kapan saja.'
      ],
    paragraphs2: [
        'Sejak PermenLHK No. 6 Tahun 2021, penggunaan Festronik menjadi wajib bagi setiap penghasil, pengangkut, dan pengelola limbah B3.',
        'Setiap pengangkutan menghasilkan nomor manifest elektronik yang menjadi bukti hukum kepatuhan perusahaan terhadap regulasi lingkungan. LIMBAHIN mengelola akun Festronik khusus untuk tiap klien, sehingga data limbah tercatat atas nama perusahaan Anda sendiri.'
      ],
    ...DEFAULT_CTA,
    // No video link supplied yet for this slug specifically — the person asked to "add our
    // YouTube video" here but didn't give a URL. Add it via `videoUrl: 'https://youtu.be/...'`
    // once you have it.
    videoUrl: null,
  },
  {
    category: 'panduan', slug: 'pengaturan-festronik',
    title: 'Cara Pengaturan Akun Festronik',
    excerpt: 'Panduan langkah demi langkah mengatur akun Festronik perusahaan Anda, lengkap dengan video tutorial.',
    author: 'Tim LIMBAHIN', date: '2026-09-22',
    images1: ["https://lh3.googleusercontent.com/d/1vmcru9ZWJbAi6axdj5B2pYhFT79iZRHT"], images2: [],
    paragraphs1: [
        'Sebelum dapat mencatat manifest elektronik, setiap penghasil limbah B3 perlu mengatur akun Festronik perusahaannya terlebih dahulu — mendaftarkan profil perusahaan, lokasi sumber limbah, dan pihak-pihak yang berwenang menandatangani manifest.',
        'Pengaturan yang benar di awal akan memperlancar seluruh proses pelaporan limbah ke depannya.'
      ],
    paragraphs2: [
        'Video di bawah ini memandu Anda melalui setiap langkah pengaturan akun Festronik, dari pendaftaran awal hingga akun siap digunakan.',
        'Jika perusahaan Anda adalah klien LIMBAHIN, tim kami dapat membantu proses ini secara langsung sehingga Anda tidak perlu mengaturnya sendiri.'
      ],
    ...DEFAULT_CTA,
    videoUrl: 'https://youtu.be/u10GCVAxKjI?si=EMyw-h5xa2kUJM3E',
  },
  {
    category: 'panduan', slug: 'cara-melapor-limbah-b3-menggunakan-festronik',
    title: 'Cara Melapor Limbah B3 Menggunakan Festronik',
    excerpt: 'Panduan praktis membuat dan mengonfirmasi manifest elektronik limbah B3 melalui sistem Festronik.',
    author: 'Tim LIMBAHIN', date: '2026-09-22',
    images1: ["https://lh3.googleusercontent.com/d/1gTmSE7WLxd2LC_ensHkRdZYauIQhqE8G"], images2: [],
    paragraphs1: [
        'Setelah akun Festronik aktif, setiap pengangkutan limbah B3 harus dilaporkan melalui sistem ini sebelum limbah meninggalkan lokasi.',
        'Laporan mencakup jenis dan jumlah limbah, tanggal pengangkutan, serta identitas pengangkut dan pengelola akhir yang dituju — setiap pihak dalam rantai ini harus mengonfirmasi penerimaannya di sistem.'
      ],
    paragraphs2: [
        'Video berikut menunjukkan langkah-langkah membuat manifest baru di Festronik hingga mengonfirmasi status penerimaan limbah.',
        'Pelaporan yang tertib memastikan perusahaan Anda memiliki bukti hukum lengkap atas setiap kilogram limbah yang dikelola.'
      ],
    ...DEFAULT_CTA,
    videoUrl: 'https://youtu.be/FEeUnZMsTt4?si=Grket3ZgME8TtfeI',
  },
  {
    category: 'edukasi', slug: 'manifest-limbah-b3',
    title: 'Manifest Limbah B3: Apa dan Mengapa Penting',
    excerpt: 'Mengapa manifest bukan sekadar formalitas, melainkan bukti hukum kepatuhan pengelolaan limbah B3 perusahaan Anda.',
    author: 'Tim LIMBAHIN', date: '2026-09-22',
    images1: ["https://lh3.googleusercontent.com/d/19AveTuahotU-P9f0aDvLTuMQqpQE09wQ"], images2: [],
    paragraphs1: [
        'Manifest adalah dokumen resmi yang mencatat setiap pengangkutan limbah B3, dari penghasil hingga pengelola akhir.',
        'Manifest berisi jenis dan jumlah limbah, tanggal pengangkutan, serta identitas seluruh pihak yang terlibat — penghasil, pengangkut, dan pengelola. Di Indonesia, manifest wajib dicatat secara elektronik melalui Festronik sejak PermenLHK No. 6 Tahun 2021.'
      ],
    paragraphs2: [
        'Tanpa manifest yang lengkap, perusahaan tidak dapat membuktikan bahwa limbahnya telah dikelola sesuai regulasi — risikonya mulai dari teguran, denda, hingga pencabutan izin usaha.',
        'LIMBAHIN mengelola manifest elektronik untuk setiap klien dan mengirimkan laporan bulanan lengkap, sehingga dokumentasi kepatuhan lingkungan perusahaan Anda selalu siap untuk diaudit.'
      ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'panduan', slug: 'cara-pengelolaan-limbah-b3',
    title: 'Cara Pengelolaan Limbah B3 yang Benar',
    excerpt: 'Tahapan pengelolaan limbah B3 yang sesuai regulasi, dari pemilahan di sumber hingga pemusnahan berizin.',
    author: 'Tim LIMBAHIN', date: '2026-09-22',
    images1: ["https://lh3.googleusercontent.com/d/1Hj8Pw9-YwSJa0KKOtBp4RgIlwZG8xhv0"], images2: [],
    paragraphs1: [
        'Pengelolaan limbah B3 yang benar dimulai dari pemilahan di sumbernya — memisahkan limbah berdasarkan jenis dan karakteristiknya sejak awal, agar tidak tercampur dengan limbah non-B3.',
        'Limbah kemudian disimpan sementara (TPS) di wadah yang sesuai standar KLHK, sebelum diangkut oleh perusahaan berizin dengan armada khusus dan didokumentasikan melalui manifest elektronik.'
      ],
    paragraphs2: [
        'Tahap akhir adalah pemusnahan atau pengolahan di fasilitas yang berizin resmi, sesuai karakteristik limbahnya — insinerasi untuk limbah medis, daur ulang untuk oli bekas, dan sebagainya.',
        'Perusahaan menerima sertifikat pemusnahan (CoD) sebagai bukti bahwa limbahnya telah dikelola tuntas. LIMBAHIN menangani seluruh rangkaian ini untuk klien kami, dari konsultasi hingga dokumentasi akhir.'
      ],
    related: [{ category: 'edukasi', slug: 'apa-itu-limbah-b3' }, { category: 'panduan', slug: 'cara-mengelola-limbah-medis' }, { category: 'panduan', slug: 'cara-mengelola-oli-bekas' }],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'panduan', slug: 'cara-mengelola-oli-bekas',
    title: 'Cara Mengelola Oli Bekas dengan Benar',
    excerpt: 'Oli bekas tergolong limbah B3 — begini cara menyimpan, mengangkut, dan mendaur ulangnya sesuai regulasi.',
    author: 'Tim LIMBAHIN', date: '2026-09-22',
    images1: [
      "https://lh3.googleusercontent.com/d/1yko8w9nCaThRsVM_-6o9_vzGb7cn9aN8",
      "https://lh3.googleusercontent.com/d/13MmIOK-whYtCN6cQePEj6xkf7v7_1EKu"
    ], images2: [],
    paragraphs1: [
        'Oli bekas dari kendaraan, mesin industri, maupun genset tergolong limbah B3 karena mengandung logam berat dan senyawa hidrokarbon yang berbahaya bagi tanah dan air jika dibuang sembarangan.',
        'Oli bekas harus disimpan dalam wadah tertutup, kedap, dan diberi label sebagai limbah B3, terpisah dari bahan lain, di area TPS yang tidak terkena hujan langsung.'
      ],
    paragraphs2: [
        'Pengangkutan oli bekas hanya boleh dilakukan oleh pihak berizin, dan setiap pengangkutan dicatat melalui manifest elektronik.',
        'Sebagian besar oli bekas dapat didaur ulang menjadi bahan bakar alternatif atau oli dasar melalui fasilitas pengolahan berizin — bukan dibuang atau dibakar sembarangan. LIMBAHIN melayani penjemputan rutin oli bekas untuk bengkel, industri, maupun fasilitas komersial.'
      ],
    related: [{ category: 'panduan', slug: 'cara-mengelola-limbah-medis' }, { category: 'layanan-kami', slug: 'pengelolaan-limbah-b3-cikarang' }],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'panduan', slug: 'kontrak-elektronik',
    title: 'Kontrak Elektronik Melalui Mekari',
    excerpt: 'Cara menandatangani draf kontrak kerja sama LIMBAHIN secara elektronik melalui Mekari — tanpa cetak dan tanda tangan basah.',
    author: 'Tim LIMBAHIN', date: '2026-09-22',
    images1: ["https://lh3.googleusercontent.com/d/1c075d4zcfQINqaZThmmc4XjFqsMF8S1M"], images2: [],
    paragraphs1: [
        'Untuk klien yang memilih opsi kontrak elektronik (E-Kontrak) saat pendaftaran, draf perjanjian kerja sama LIMBAHIN ditandatangani secara digital melalui Mekari — tanpa perlu mencetak, menandatangani basah, dan mengirim dokumen fisik bolak-balik.',
        'Tanda tangan elektronik ini sah secara hukum sesuai UU ITE dan memiliki sertifikat elektronik yang terverifikasi.'
      ],
    paragraphs2: [
        'Video berikut menunjukkan cara membuka, memeriksa, dan menandatangani draf kontrak yang dikirim melalui Mekari.',
        'Setelah seluruh pihak menandatangani, salinan kontrak final otomatis dikirim ke email Anda dan tersimpan sebagai dokumen resmi perusahaan.'
      ],
    ...DEFAULT_CTA,
    videoUrl: 'https://youtu.be/6Z1e1g8wGSU?si=dG_zB81W2FddkxYm',
  },
  {
    category: 'panduan', slug: 'cara-mengelola-limbah-medis',
    title: 'Cara Mengelola Limbah Medis (dengan Dibakar)',
    excerpt: 'Standar pemilahan, penyimpanan, dan pemusnahan limbah medis melalui insinerasi sesuai regulasi KLHK.',
    author: 'Tim LIMBAHIN', date: '2026-09-22',
    images1: ["https://lh3.googleusercontent.com/d/1tEKuWl1FCCsJY678R-d7ftqmQKqonBNh",], images2: [
      "https://lh3.googleusercontent.com/d/193oBrwmpAWp06Rzno6EjV0UCWD9QeSfU",
    ],
    paragraphs1: [
        'Limbah medis dari rumah sakit, klinik, dan puskesmas — jarum suntik, kassa terkontaminasi, APD, hingga limbah patologis — harus dipilah sejak sumbernya sesuai PermenLHK No. 56 Tahun 2015.',
        'Kantung kuning digunakan untuk limbah infeksius, safety box untuk benda tajam, dan setiap wadah diisi maksimal 75% dari kapasitasnya untuk mencegah tumpahan saat pengangkutan.'
      ],
    paragraphs2: [
        'Pemusnahan limbah medis dilakukan dengan cara dibakar (insinerasi) pada suhu minimal 800°C di fasilitas berizin resmi, untuk memastikan seluruh patogen dan zat berbahaya benar-benar musnah.',
        'Proses ini menghasilkan sertifikat pemusnahan (CoD) sebagai bukti kepatuhan. LIMBAHIN menyediakan layanan penjemputan rutin serta safety box dan kantung kuning untuk klien fasilitas kesehatan.'
      ],
    related: [{ category: 'panduan', slug: 'cara-pengelolaan-limbah-b3' }, { category: 'panduan', slug: 'cara-mengelola-oli-bekas' }],
    ...DEFAULT_CTA,
    videoUrl: null,
  },

  // ---- Existing articles, kept and sorted into the four categories above -------------------
  {
    category: 'regulasi', slug: 'pp-22-2021',
    title: 'PP No. 22 Tahun 2021: Regulasi Baru Pengelolaan Limbah B3 di Indonesia',
    excerpt: 'Memahami perubahan penting dalam regulasi pengelolaan limbah B3 dan dampaknya bagi perusahaan penghasil limbah berbahaya.',
    author: 'Tim LIMBAHIN', date: '2026-03-20',
    images1: ['https://media.base44.com/images/public/6a44cc0879cf22739b8735ab/fa043d267_generated_image.png'], images2: [],
    paragraphs1: [
        'Peraturan Pemerintah No. 22 Tahun 2021 tentang Penyelenggaraan Perlindungan dan Pengelolaan Lingkungan Hidup adalah regulasi utama yang mengatur pengelolaan limbah B3 di Indonesia, menggantikan dan memperbarui ketentuan dari PP No. 101 Tahun 2014.',
        'PP ini memperjelas kewajiban setiap penghasil limbah B3 untuk mengelola limbahnya melalui pihak ketiga berizin resmi dari KLHK, mulai dari pemilahan, penyimpanan, hingga penyerahan kepada pengangkut berizin.'
      ],
    paragraphs2: [
        'Salah satu perubahan signifikan adalah pengetatan kewajiban manifest elektronik melalui Festronik, memastikan transparansi penuh dalam rantai pengelolaan limbah.',
        'Sanksi pelanggaran juga diperketat — mulai dari teguran tertulis, denda, paksaan pemerintah, hingga pencabutan izin usaha. Bekerja dengan pengelola berizin seperti LIMBAHIN memastikan kepatuhan penuh terhadap PP 22/2021.'
      ],
    related: [
      { category: 'perizinan', slug: 'pp-22-2021-persetujuan-lingkungan' },
      { category: 'perizinan', slug: 'panduan-perizinan-limbah-b3' },
      { category: 'regulasi', slug: 'manifest-elektronik-kewajiban' },
    ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'regulasi', slug: 'manifest-elektronik-kewajiban',
    title: 'Manifest Elektronik: Kewajiban yang Sering Diabaikan Penghasil Limbah B3',
    excerpt: 'Mengapa manifest elektronik bukan sekadar formalitas dan bagaimana hal ini melindungi perusahaan Anda secara hukum.',
    author: 'Tim LIMBAHIN', date: '2026-02-10',
    images1: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80'], images2: [],
    paragraphs1: [
        'Banyak perusahaan menganggap manifest hanyalah formalitas administratif. Padahal, manifest adalah bukti hukum bahwa perusahaan telah memenuhi kewajibannya mengelola limbah B3 dengan benar — berisi jenis dan jumlah limbah, tanggal pengangkutan, serta identitas penghasil, pengangkut, dan pengelola akhir.',
        'Setiap pihak dalam rantai pengelolaan harus konfirmasi penerimaan melalui sistem, menciptakan rantai pertanggungjawaban yang utuh.'
      ],
    paragraphs2: [
        'Tanpa manifest yang valid, perusahaan berisiko dikenai sanksi administratif, dan dalam kasus pencemaran lingkungan, ketiadaan manifest dapat dijadikan dasar dugaan tindak pidana.',
        'LIMBAHIN mengelola manifest elektronik untuk setiap klien melalui akun Festronik khusus, dengan laporan bulanan lengkap untuk kebutuhan audit internal maupun pemerintah.'
      ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'panduan', slug: 'panduan-memilah-limbah-medis',
    title: 'Panduan Memilah Sampah B3 Medis di Rumah Sakit & Klinik',
    excerpt: 'Ketahui standar sterilisasi wadah, pengkodean warna kantung medis, dan prosedur penanganan tumpahan infeksius darurat.',
    author: 'Tim LIMBAHIN', date: '2026-05-28',
    images1: ['https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80'], images2: [],
    paragraphs1: [
        'Pemilahan sampah B3 medis adalah langkah kritis dalam pengelolaan limbah fasilitas pelayanan kesehatan. Sesuai PermenLHK No. 56 Tahun 2015, limbah medis harus dipilah sejak sumbernya untuk mencegah kontaminasi silang.',
        'Pengkodean warna mengikuti standar internasional: kuning untuk limbah infeksius, ungu untuk sitotoksik, cokelat untuk farmasi, dan merah untuk radioaktif.'
      ],
    paragraphs2: [
        'Wadah limbah medis harus kedap air, tahan tusukan, dan diisi maksimal 75% dari kapasitasnya. Penanganan tumpahan limbah infeksius harus segera dilakukan dengan APD lengkap dan didesinfeksi dengan klorin 0,5%.',
        'LIMBAHIN menyediakan fasilitas pengelolaan limbah B3 medis sesuai standar, termasuk penyediaan safety box dan kantung kuning untuk klien paket tahunan.'
      ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'panduan', slug: 'pengelolaan-limbah-industri',
    title: 'Pengelolaan Limbah B3 Industri: Tantangan dan Solusi untuk Pabrik Modern',
    excerpt: 'Bagaimana pabrik manufaktur dapat mengelola limbah B3 secara efisien, patuh regulasi, dan ramah lingkungan.',
    author: 'Tim LIMBAHIN', date: '2026-01-25',
    images1: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80'], images2: [],
    paragraphs1: [
        'Pabrik manufaktur adalah salah satu penghasil limbah B3 terbesar di Indonesia — oli bekas, solvent, bahan kimia proses, filter industri, hingga limbah cair berbahaya.',
        'Volume dan keragaman limbah menuntut pengelolaan sistematis: pemilahan di sumber, penyimpanan sementara (TPS) sesuai standar KLHK, hingga pengangkutan oleh perusahaan berizin dengan armada khusus.'
      ],
    paragraphs2: [
        'Setiap pengangkutan wajib tercatat di Festronik, dan pemusnahan dilakukan di fasilitas pengelola berizin sesuai karakteristik limbahnya.',
        'LIMBAHIN menyediakan layanan rutin untuk industri dengan harga per kg yang kompetitif — semakin besar volume, semakin rendah harga per kg.'
      ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'edukasi', slug: '4-jenis-limbah-b3',
    title: 'Mengenal 4 Jenis Utama Limbah B3 dan Cara Pengelolaannya',
    excerpt: 'Limbah B3 medis, industri, komersial, dan produk & bahan — memahami perbedaan dan penanganan masing-masing jenis limbah berbahaya.',
    author: 'Tim LIMBAHIN', date: '2026-04-05',
    images1: ['https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1200&q=80'], images2: [],
    paragraphs1: [
        'Limbah B3 medis berasal dari fasilitas kesehatan — jarum suntik, kassa, APD, dan limbah patologis — dimusnahkan dengan insinerator berizin pada suhu minimal 800°C.',
        'Limbah B3 industri berasal dari proses produksi pabrik: oli bekas, solvent, bahan kimia proses, dan limbah cair berbahaya, ditangani melalui pengumpulan, pengangkutan khusus, dan pemusnahan/daur ulang di fasilitas berizin.'
      ],
    paragraphs2: [
        'Limbah B3 komersial berasal dari hotel, apartemen, dan kantor — baterai bekas, lampu TL, toner printer, dan elektronik rusak.',
        'Limbah B3 produk & bahan adalah barang reject, produk kedaluwarsa, dan kemasan terkontaminasi, yang memerlukan pemusnahan aman untuk mencegah penyalahgunaan dan pencemaran lingkungan. LIMBAHIN menyediakan layanan pemusnahan untuk seluruh kategori ini dengan sertifikat CoD.'
      ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'edukasi', slug: 'dampak-lingkungan-limbah-b3',
    title: 'Dampak Lingkungan Pemusnahan Limbah B3 yang Tidak Tepat',
    excerpt: 'Mengapa pemusnahan limbah B3 harus dilakukan oleh pihak berizin dan dampak serius jika dikelola sembarangan.',
    author: 'Tim LIMBAHIN', date: '2026-02-22',
    images1: ['https://images.unsplash.com/photo-1568438350562-2cae6d394ad0?w=1200&q=80'], images2: [],
    paragraphs1: [
        'Pemusnahan limbah B3 yang tidak tepat dapat menimbulkan pencemaran tanah, air, dan udara yang berjangka panjang.',
        'Zat beracun seperti logam berat dapat masuk ke rantai makanan melalui tanaman yang tumbuh di tanah tercemar, sementara limbah cair B3 yang meresap dapat mencemari air tanah, sungai, dan laut.'
      ],
    paragraphs2: [
        'Pembakaran terbuka limbah B3 menghasilkan dioksin dan furan — senyawa karsinogenik yang menyebar melalui udara. Pemusnahan yang tepat oleh fasilitas berizin menggunakan insinerator dengan pengendalian emisi dan pemantauan kontinu.',
        'LIMBAHIN memastikan setiap kilogram limbah klien kami dimusnahkan di fasilitas yang sesuai standar KLHK, dengan sertifikat CoD sebagai bukti.'
      ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'edukasi', slug: 'sertifikat-pemusnahan-cod',
    title: 'Sertifikat Pemusnahan (CoD): Mengapa Dokumen Ini Sangat Penting',
    excerpt: 'Certificate of Destruction sebagai bukti legal pemusnahan limbah B3 dan perannya dalam kepatuhan lingkungan perusahaan.',
    author: 'Tim LIMBAHIN', date: '2026-01-12',
    images1: ['https://media.base44.com/images/public/6a44cc0879cf22739b8735ab/ae5dc6f53_generated_image.png'], images2: [],
    paragraphs1: [
        'Certificate of Destruction (CoD) adalah dokumen resmi yang diterbitkan fasilitas pengelola limbah B3 berizin sebagai bukti bahwa limbah telah dimusnahkan sesuai standar.',
        'Dokumen ini berisi jenis dan jumlah limbah, tanggal dan metode pemusnahan, identitas penghasil, dan nomor manifest, ditandatangani oleh fasilitas pengelola dan terdaftar di sistem KLHK.'
      ],
    paragraphs2: [
        'Tanpa CoD, perusahaan tidak dapat membuktikan limbahnya telah dimusnahkan — berisiko fatal jika terjadi investigasi pencemaran lingkungan, audit ISO 14001, atau pemeriksaan dari dinas lingkungan hidup setempat.',
        'LIMBAHIN menyediakan CoD untuk setiap pemusnahan limbah B3 klien kami, dikirim setelah pemusnahan selesai, lengkap dengan nomor manifest elektronik yang dapat diverifikasi kapan saja.'
      ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'layanan-kami', slug: 'audit-iso-14001',
    title: 'Pentingnya Audit ISO 14001 Bagi Keberlanjutan Industri Modern',
    excerpt: 'Meningkatkan reputasi korporat melalui pengelolaan lingkungan hidup yang patuh, mandiri, dan berkesinambungan bersama LIMBAHIN.',
    author: 'Tim LIMBAHIN', date: '2026-04-12',
    images1: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80'], images2: [],
    paragraphs1: [
        'ISO 14001 adalah standar internasional untuk Sistem Manajemen Lingkungan yang membantu organisasi mengelola dampak lingkungan dari operasional mereka.',
        'Salah satu kriteria penting dalam audit ISO 14001 adalah pengelolaan limbah B3 — perusahaan harus menunjukkan bukti bahwa limbahnya dikelola oleh pihak ketiga berizin, dengan manifest dan dokumentasi lengkap.'
      ],
    paragraphs2: [
        'Inilah dimana LIMBAHIN berperan — kami menyediakan dokumen lengkap (manifest, sertifikat pemusnahan/CoD, laporan bulanan) yang mendukung kepatuhan ISO 14001 Anda.',
        'Perusahaan yang patuh lingkungan menikmati reputasi lebih baik, akses ke pasar yang lebih luas, dan risiko sanksi yang lebih rendah.'
      ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },

  // ---- Internal-linking cluster: general service articles + location pages, all cross-linked
  // (see the `related` field) instead of sitting as isolated pages ----------------------------
  {
    category: 'edukasi', slug: 'pengangkutan-limbah-b3',
    title: 'Pengangkutan Limbah B3: Syarat dan Prosedurnya',
    excerpt: 'Siapa saja yang boleh mengangkut limbah B3, kendaraan yang diwajibkan, dan dokumen yang harus menyertainya.',
    author: 'Tim LIMBAHIN', date: '2026-09-24',
    images1: ["https://lh3.googleusercontent.com/d/1BpZtHg9zDWUQfR-deEK7_A_BU9z2q-X_"], images2: [],
    paragraphs1: [
        'Pengangkutan limbah B3 tidak boleh dilakukan sembarang pihak — hanya perusahaan yang memiliki izin pengangkutan limbah B3 dari KLHK dan Kementerian Perhubungan yang boleh mengangkutnya.',
        'Kendaraan yang digunakan juga harus kendaraan khusus yang telah lolos uji kelaikan dan diberi simbol/label limbah B3 sesuai jenisnya, bukan kendaraan umum atau kendaraan pribadi.'
      ],
    paragraphs2: [
        'Setiap pengangkutan wajib disertai manifest elektronik (Festronik) yang mencatat jenis, jumlah, rute, serta identitas pengangkut dan tujuan akhir limbah — mulai dari saat limbah diambil hingga tiba di fasilitas pemusnahan.',
        'LIMBAHIN mengoperasikan armada pengangkutan berizin sendiri untuk wilayah Jakarta, Bogor, Depok, Tangerang, dan Bekasi (Jabodetabek), sehingga rantai pengelolaan limbah klien tetap dalam satu pengawasan dari penjemputan hingga pemusnahan.'
      ],
    related: [
      { category: 'edukasi', slug: 'apa-itu-limbah-b3' },
      { category: 'panduan', slug: 'cara-pengelolaan-limbah-b3' },
      { category: 'layanan-kami', slug: 'pengelolaan-limbah-b3-jabodetabek' },
    ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'layanan-kami', slug: 'pengelolaan-limbah-b3-jakarta',
    title: 'Pengelolaan Limbah B3 Jakarta',
    excerpt: 'Layanan penjemputan, pengangkutan, dan pemusnahan limbah B3 berizin untuk perusahaan dan fasilitas kesehatan di Jakarta.',
    author: 'Tim LIMBAHIN', date: '2026-09-24',
    images1: [ "https://lh3.googleusercontent.com/d/10ztqyc1PJPHu1cukb7ue5D0cgRm40fwD"], images2: [],
    paragraphs1: [
        'LIMBAHIN melayani pengelolaan limbah B3 untuk perusahaan, rumah sakit, klinik, hotel, dan industri di wilayah Jakarta — mencakup Jakarta Pusat, Jakarta Selatan, Jakarta Barat, Jakarta Timur, dan Jakarta Utara.',
        'Layanan kami mencakup penjemputan terjadwal, pengangkutan dengan armada berizin, hingga pemusnahan di fasilitas resmi.'
      ],
    paragraphs2: [
        'Setiap pengangkutan di Jakarta tercatat melalui manifest elektronik Festronik, dan klien menerima sertifikat pemusnahan (CoD) sebagai bukti kepatuhan.',
        'Untuk kebutuhan di luar Jakarta, kami juga melayani seluruh wilayah Jabodetabek.'
      ],
    related: [
      { category: 'layanan-kami', slug: 'pengelolaan-limbah-b3-jabodetabek' },
      { category: 'panduan', slug: 'cara-pengelolaan-limbah-b3' },
      { category: 'edukasi', slug: 'pengangkutan-limbah-b3' },
    ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'layanan-kami', slug: 'pengelolaan-limbah-b3-jabodetabek',
    title: 'Pengelolaan Limbah B3 Jabodetabek',
    excerpt: 'Cakupan layanan LIMBAHIN untuk seluruh wilayah Jabodetabek — Jakarta, Bogor, Depok, Tangerang, dan Bekasi.',
    author: 'Tim LIMBAHIN', date: '2026-09-24',
    images1: ["https://lh3.googleusercontent.com/d/1841g9nawTAUY1zxOuSoKKRpuwrT6aXg6", "https://lh3.googleusercontent.com/d/1pVqPOwG1Jp_gtfTGDeYkaiHyUm3SNGVF"], images2: [],
    paragraphs1: [
        'LIMBAHIN berbasis di Cikarang dan melayani pengelolaan limbah B3 di seluruh wilayah Jabodetabek — Jakarta, Bogor, Depok, Tangerang, dan Bekasi — dengan armada pengangkutan berizin dan tim operasional yang menjangkau tiap wilayah secara terjadwal.',
        'Lokasi kantor kami di Cikarang, yang berada di tengah kawasan industri Jabodetabek, memungkinkan waktu respons yang lebih cepat dibanding penyedia jasa dari luar wilayah.'
      ],
    paragraphs2: [
        'Baik industri manufaktur, fasilitas kesehatan, maupun sektor komersial, kami menyesuaikan jadwal penjemputan dengan volume dan jenis limbah masing-masing klien, lengkap dengan manifest elektronik dan sertifikat pemusnahan untuk setiap pengangkutan.',
        'Untuk kebutuhan spesifik per kota, lihat juga halaman layanan kami untuk Jakarta, Bekasi, Depok, dan Cikarang.'
      ],
    related: [
      { category: 'layanan-kami', slug: 'pengelolaan-limbah-b3-jakarta' },
      { category: 'layanan-kami', slug: 'pengelolaan-limbah-b3-bekasi' },
      { category: 'layanan-kami', slug: 'pengelolaan-limbah-b3-depok' },
      { category: 'layanan-kami', slug: 'pengelolaan-limbah-b3-cikarang' },
    ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'layanan-kami', slug: 'pengelolaan-limbah-b3-bekasi',
    title: 'Pengelolaan Limbah B3 Bekasi',
    excerpt: 'Layanan pengelolaan limbah B3 LIMBAHIN untuk kawasan industri dan komersial di Bekasi.',
    author: 'Tim LIMBAHIN', date: '2026-09-24',
    images1: ["https://lh3.googleusercontent.com/d/13ftdeDtxxQO4C1lLAIItB2U13a_ihUZx"], images2: [],
    paragraphs1: [
        'Bekasi adalah salah satu kawasan industri terbesar di Jabodetabek, dengan banyak pabrik manufaktur yang menghasilkan limbah B3 dalam volume besar — oli bekas, solvent, dan bahan kimia proses.',
        'LIMBAHIN, yang berbasis di Cikarang, melayani kawasan Bekasi dengan waktu respons cepat, termasuk kawasan-kawasan industri di sekitar Cikarang Barat, MM2100, dan Jababeka.'
      ],
    paragraphs2: [
        'Layanan kami mencakup penjemputan rutin sesuai jadwal produksi pabrik, pengangkutan berizin, hingga pemusnahan dengan dokumentasi lengkap — manifest elektronik dan sertifikat pemusnahan (CoD) untuk setiap pengangkutan.',
        'Klien industri di Bekasi juga dapat memilih paket kontrak tahunan dengan tarif per kg yang lebih kompetitif dibanding pengambilan satuan.'
      ],
    related: [
      { category: 'layanan-kami', slug: 'pengelolaan-limbah-b3-cikarang' },
      { category: 'layanan-kami', slug: 'pengelolaan-limbah-b3-jabodetabek' },
      { category: 'panduan', slug: 'pengelolaan-limbah-industri' },
    ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'layanan-kami', slug: 'pengelolaan-limbah-b3-depok',
    title: 'Pengelolaan Limbah B3 Depok',
    excerpt: 'Layanan pengelolaan limbah B3 LIMBAHIN untuk fasilitas kesehatan, komersial, dan industri di Depok.',
    author: 'Tim LIMBAHIN', date: '2026-09-24',
    images1: ["https://lh3.googleusercontent.com/d/1Tzxtlk3EzJ2ZuAASDDwqrN8a2NCNCTCE", "https://lh3.googleusercontent.com/d/14havWkuvlo22k2Us3NZRA1VgoKcn8wyR"], images2: [],
    paragraphs1: [
        'LIMBAHIN melayani pengelolaan limbah B3 di Depok untuk berbagai sektor — rumah sakit dan klinik (limbah medis), perkantoran dan apartemen (limbah komersial), hingga fasilitas produksi kecil-menengah, dengan penjemputan terjadwal dan armada berizin.',
        'Wilayah layanan kami mencakup seluruh kecamatan di Depok, dari Margonda hingga Cinere dan Sawangan.'
      ],
    paragraphs2: [
        'Sebagai bagian dari wilayah layanan Jabodetabek kami, klien di Depok mendapatkan dokumentasi lengkap setiap pengangkutan — manifest elektronik Festronik dan sertifikat pemusnahan — sama seperti klien di wilayah lainnya.',
        'Untuk klinik atau praktek pribadi berskala kecil di Depok, tersedia paket tahunan dengan tarif yang lebih terjangkau dibanding pengambilan satuan.'
      ],
    related: [
      { category: 'layanan-kami', slug: 'pengelolaan-limbah-b3-jabodetabek' },
      { category: 'panduan', slug: 'panduan-memilah-limbah-medis' },
      { category: 'panduan', slug: 'cara-mengelola-limbah-medis' },
    ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'layanan-kami', slug: 'pengelolaan-limbah-b3-cikarang',
    title: 'Pengelolaan Limbah B3 Cikarang',
    excerpt: 'LIMBAHIN berbasis langsung di Cikarang — layanan pengelolaan limbah B3 tercepat untuk kawasan industri Cikarang.',
    author: 'Tim LIMBAHIN', date: '2026-09-24',
    images1: ["https://lh3.googleusercontent.com/d/15ncogIVYxfvg1ZVzS-mejIYHScL7Jwkn", "https://lh3.googleusercontent.com/d/14Stj14xLdOw7isI9f7V0y9ubfOsTs5CD"], images2: [],
    paragraphs1: [
        'Kantor operasional LIMBAHIN berada di Cikarang Pusat, menjadikan kami mitra pengelolaan limbah B3 dengan waktu respons tercepat untuk kawasan industri Cikarang — termasuk kawasan-kawasan industri besar di sekitarnya seperti Jababeka, MM2100, EJIP, dan Delta Silicon.',
        'Sebagai perusahaan yang berkantor langsung di Cikarang, kami memahami karakteristik limbah B3 dari berbagai jenis pabrik di kawasan ini, mulai dari otomotif, elektronik, hingga farmasi.'
      ],
    paragraphs2: [
        'Kedekatan lokasi ini memungkinkan penjadwalan penjemputan yang lebih fleksibel dan penanganan permintaan mendadak lebih cepat, tanpa mengurangi kelengkapan dokumentasi — manifest elektronik dan sertifikat pemusnahan tetap menyertai setiap pengangkutan.',
        'Klien di Cikarang juga menjadi prioritas untuk kunjungan konsultasi langsung ke lokasi pabrik sebelum kontrak kerja sama disepakati.'
      ],
    related: [
      { category: 'layanan-kami', slug: 'pengelolaan-limbah-b3-bekasi' },
      { category: 'layanan-kami', slug: 'pengelolaan-limbah-b3-jabodetabek' },
      { category: 'panduan', slug: 'cara-pengelolaan-limbah-b3' },
    ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },

  // ---- Perizinan: the five key regulations + an overview that links them ---------------------
  // Covers are original illustrations served from /public/artikel (not hot-linked), so they cannot
  // disappear and can be used as the og:image. Facts were checked against the official texts.
  {
    category: 'perizinan', slug: 'panduan-perizinan-limbah-b3',
    title: 'Panduan Perizinan Limbah B3 di Indonesia: 5 Regulasi Kunci yang Wajib Dipahami',
    excerpt: 'Ringkasan lima regulasi kunci perizinan dan pengelolaan limbah B3 — dari UU 32/2009 hingga Permen LHK 11/2024 — dan apa artinya bagi penghasil limbah.',
    author: 'Tim LIMBAHIN', date: '2026-10-12',
    images1: ['/artikel/panduan-perizinan-limbah-b3.jpg'], images2: [],
    paragraphs1: [
        'Pengelolaan limbah B3 di Indonesia diatur berlapis: undang-undang sebagai dasar hukum tertinggi, peraturan pemerintah sebagai penjabarannya, lalu peraturan menteri yang memuat tata cara teknis dan persyaratan perizinannya. Memahami urutan ini membantu perusahaan tahu dokumen apa yang harus dimiliki dan siapa yang bertanggung jawab di setiap tahap.',
        'Lima regulasi menjadi rujukan utama: UU No. 32 Tahun 2009 (UU PPLH) sebagai payung hukum; PP No. 22 Tahun 2021 tentang penyelenggaraan perlindungan dan pengelolaan lingkungan hidup; PermenLHK No. 6 Tahun 2021 tentang tata cara dan persyaratan pengelolaan limbah B3; Permen LHK No. 9 Tahun 2024 tentang pengelolaan sampah yang mengandung B3 dan limbah B3; serta Permen LHK No. 11 Tahun 2024 tentang penerapan Kerangka Kualifikasi Nasional Indonesia (KKNI) bidang pengelolaan limbah B3.'
      ],
    paragraphs2: [
        'Dalam praktik, penghasil limbah B3 perlu memastikan tiga hal. Pertama, limbahnya dikelola sesuai tahapan yang diatur: pengurangan, penyimpanan, pengumpulan, pengangkutan, pemanfaatan, pengolahan, dan penimbunan. Kedua, kegiatan atau fasilitasnya memiliki persetujuan yang sesuai, seperti Persetujuan Teknis untuk penyimpanan, pemanfaatan, pengolahan, penimbunan, atau dumping limbah B3. Ketiga, pihak ketiga yang digunakan memiliki perizinan berusaha yang sah untuk kegiatan tersebut.',
        'Artikel-artikel berikut mengupas tiap regulasi secara ringkas dan praktis. Jika Anda ingin memastikan kepatuhan tanpa harus mengurus semuanya sendiri, LIMBAHIN menyediakan pengangkutan berizin, pengelolaan manifest elektronik Festronik, dan sertifikat pemusnahan untuk setiap pengangkutan.',
        'Catatan: artikel ini merupakan informasi umum dan bukan nasihat hukum. Selalu rujuk teks resmi peraturan atau konsultasikan dengan ahli hukum lingkungan untuk kasus spesifik perusahaan Anda.'
      ],
    related: [
      { category: 'perizinan', slug: 'uu-32-2009-pplh' },
      { category: 'perizinan', slug: 'pp-22-2021-persetujuan-lingkungan' },
      { category: 'perizinan', slug: 'permen-lhk-6-2021' },
      { category: 'perizinan', slug: 'permen-lhk-9-2024' },
      { category: 'perizinan', slug: 'permen-lhk-11-2024' },
    ],
    sources: [
      { label: 'IEC — 6 Peraturan dan Standar Terkait Limbah B3', url: 'https://environment-indonesia.com/5-peraturan-dan-standar-terkait-limbah-berbahaya-dan-beracun-yang-perlu-anda-ketahui/' },
      { label: 'Permen LHK No. 6 Tahun 2021 (teks resmi, BPK)', url: 'https://peraturan.bpk.go.id/Download/205145/permen%20LHK%20No.%206%20tahun%202021.pdf' },
      { label: 'Permen LHK No. 9 Tahun 2024 (teks resmi, BPK)', url: 'https://peraturan.bpk.go.id/Download/351283/Permen%20LHK%20No%209%20Tahun%202024.pdf' },
      { label: 'Permen LHK No. 11 Tahun 2024 (teks resmi, BPK)', url: 'https://peraturan.bpk.go.id/Download/360458/Permen%20LHK%20No%2011%20Tahun%202024.pdf' },
    ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'perizinan', slug: 'uu-32-2009-pplh',
    title: 'UU No. 32 Tahun 2009 (UU PPLH): Dasar Hukum Pengelolaan Limbah B3',
    excerpt: 'Mengenal UU PPLH, payung hukum tertinggi perlindungan dan pengelolaan lingkungan hidup yang menjadi dasar seluruh aturan limbah B3 di Indonesia.',
    author: 'Tim LIMBAHIN', date: '2026-10-12',
    images1: ['/artikel/uu-32-2009.jpg'], images2: [],
    paragraphs1: [
        'Undang-Undang No. 32 Tahun 2009 tentang Perlindungan dan Pengelolaan Lingkungan Hidup, atau UU PPLH, adalah dasar hukum utama perlindungan lingkungan hidup di Indonesia. Hampir seluruh aturan turunan tentang limbah B3 — dari peraturan pemerintah hingga peraturan menteri — berpijak pada undang-undang ini.',
        'Dalam konteks limbah B3, UU PPLH memberikan kerangka regulasi yang mencakup pengelolaan, pengangkutan, hingga pembuangan limbah berbahaya. Prinsip dasarnya sederhana: pihak yang menghasilkan limbah bertanggung jawab atas limbahnya, dan limbah B3 tidak boleh dibuang sembarangan ke lingkungan.'
      ],
    paragraphs2: [
        'Karena UU PPLH adalah payung hukum, detail teknisnya tidak diatur di dalamnya, melainkan di aturan turunan: PP No. 22 Tahun 2021 yang mengatur penyelenggaraan perlindungan dan pengelolaan lingkungan hidup, serta PermenLHK No. 6 Tahun 2021 yang memuat tata cara dan persyaratan teknis pengelolaan limbah B3.',
        'Bagi perusahaan, kepatuhan tidak berhenti pada "tahu ada undang-undangnya". Aturan itu perlu diterjemahkan menjadi praktik nyata: memilah dan menyimpan limbah dengan benar, menyerahkannya kepada pengangkut dan pengelola berizin, serta menyimpan dokumen bukti seperti manifest elektronik dan sertifikat pemusnahan.',
        'Mengabaikan kewajiban ini berisiko sanksi administratif hingga pidana. Menggunakan jasa pengelola berizin seperti LIMBAHIN membantu menutup celah kepatuhan tersebut.'
      ],
    related: [
      { category: 'perizinan', slug: 'panduan-perizinan-limbah-b3' },
      { category: 'perizinan', slug: 'pp-22-2021-persetujuan-lingkungan' },
      { category: 'perizinan', slug: 'permen-lhk-6-2021' },
    ],
    sources: [
      { label: 'IEC — 6 Peraturan dan Standar Terkait Limbah B3', url: 'https://environment-indonesia.com/5-peraturan-dan-standar-terkait-limbah-berbahaya-dan-beracun-yang-perlu-anda-ketahui/' },
    ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'perizinan', slug: 'pp-22-2021-persetujuan-lingkungan',
    title: 'PP No. 22 Tahun 2021: Persetujuan Lingkungan dan Pengelolaan Limbah B3',
    excerpt: 'PP 22/2021 mencabut PP 101/2014 dan mengatur persetujuan lingkungan, pengelolaan limbah B3 dan non-B3, hingga sanksi administratif.',
    author: 'Tim LIMBAHIN', date: '2026-10-12',
    images1: ['/artikel/pp-22-2021-perizinan.jpg'], images2: [],
    paragraphs1: [
        'Peraturan Pemerintah No. 22 Tahun 2021 tentang Penyelenggaraan Perlindungan dan Pengelolaan Lingkungan Hidup (PP 22/2021) adalah aturan pelaksana utama UU PPLH. PP ini mencabut PP No. 101 Tahun 2014 yang sebelumnya mengatur pengelolaan limbah B3.',
        'Cakupannya luas: persetujuan lingkungan; perlindungan dan pengelolaan mutu air, udara, dan laut; pengendalian kerusakan lingkungan hidup; pengelolaan limbah B3 dan limbah non-B3; penjaminan pemulihan fungsi lingkungan hidup; sistem informasi lingkungan hidup; pembinaan dan pengawasan; serta pengenaan sanksi administratif.'
      ],
    paragraphs2: [
        'Untuk limbah B3, PP 22/2021 menjadi rujukan rincian pengelolaan limbah B3 dan non-B3 beserta sanksinya. Ketentuan teknisnya kemudian dijabarkan dalam PermenLHK No. 6 Tahun 2021, termasuk tata cara permohonan dan penerbitan Persetujuan Teknis.',
        'Dua istilah yang sering tertukar: Persetujuan Lingkungan adalah keputusan kelayakan lingkungan hidup atau pernyataan kemampuan pengelolaan lingkungan hidup yang disetujui pemerintah, sedangkan Persetujuan Teknis adalah persetujuan berupa ketentuan standar perlindungan dan pengelolaan lingkungan hidup — di bidang limbah B3, misalnya untuk penyimpanan, pemanfaatan, pengolahan, penimbunan, dan dumping.',
        'Pelanggaran dapat dikenai sanksi administratif, mulai dari teguran tertulis, paksaan pemerintah, dan denda administratif hingga pembekuan atau pencabutan perizinan berusaha. Untuk ulasan perubahan yang dibawa regulasi ini, baca juga artikel kami "PP No. 22 Tahun 2021: Regulasi Baru Pengelolaan Limbah B3 di Indonesia".'
      ],
    related: [
      { category: 'regulasi', slug: 'pp-22-2021' },
      { category: 'perizinan', slug: 'permen-lhk-6-2021' },
      { category: 'perizinan', slug: 'panduan-perizinan-limbah-b3' },
    ],
    sources: [
      { label: 'IEC — 6 Peraturan dan Standar Terkait Limbah B3', url: 'https://environment-indonesia.com/5-peraturan-dan-standar-terkait-limbah-berbahaya-dan-beracun-yang-perlu-anda-ketahui/' },
      { label: 'Permen LHK No. 11 Tahun 2024 (definisi Persetujuan Teknis, BPK)', url: 'https://peraturan.bpk.go.id/Download/360458/Permen%20LHK%20No%2011%20Tahun%202024.pdf' },
    ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'perizinan', slug: 'permen-lhk-6-2021',
    title: 'PermenLHK No. 6 Tahun 2021: Tata Cara dan Persyaratan Pengelolaan Limbah B3',
    excerpt: 'Tahapan pengelolaan limbah B3 dari penyimpanan hingga penimbunan, serta tata cara Persetujuan Teknis dan SLO-PLB3 menurut PermenLHK 6/2021.',
    author: 'Tim LIMBAHIN', date: '2026-10-12',
    images1: ['/artikel/permen-lhk-6-2021.jpg'], images2: [],
    paragraphs1: [
        'Peraturan Menteri LHK No. 6 Tahun 2021 mengatur tata cara dan persyaratan pengelolaan limbah B3. Jika UU PPLH adalah payung hukum dan PP 22/2021 aturan pelaksananya, peraturan menteri ini adalah "buku petunjuk teknis" yang paling sering dipakai praktisi di lapangan.',
        'Materi yang diatur meliputi penetapan status limbah B3, pengurangan, penyimpanan, pengumpulan, pengangkutan, pemanfaatan, pengolahan, penimbunan, dumping (pembuangan), perpindahan lintas batas, serta permohonan dan penerbitan Persetujuan Teknis pengelolaan limbah B3 (PLB3) dan SLO-PLB3.'
      ],
    paragraphs2: [
        'Poin penting bagi penghasil limbah: pengelolaan dimulai dari sumber. Limbah diidentifikasi dan dipilah, disimpan sementara di tempat yang sesuai, lalu diserahkan kepada pengumpul, pengangkut, pemanfaat, atau pengolah yang memiliki perizinan.',
        'Sejak peraturan ini, pencatatan perpindahan limbah B3 melalui sistem manifest elektronik Festronik menjadi kewajiban bagi penghasil, pengangkut, dan pengelola. Setiap pengangkutan menghasilkan nomor manifest yang menjadi bukti kepatuhan perusahaan.',
        'Kegiatan seperti penyimpanan, pemanfaatan, pengolahan, dan penimbunan memerlukan Persetujuan Teknis, dan fasilitasnya perlu memenuhi persyaratan kelayakan operasional sebelum beroperasi. Karena itu, memilih mitra pengelola yang perizinannya lengkap adalah langkah pertama menjaga kepatuhan.'
      ],
    related: [
      { category: 'edukasi', slug: 'apa-itu-festronik' },
      { category: 'perizinan', slug: 'pp-22-2021-persetujuan-lingkungan' },
      { category: 'perizinan', slug: 'panduan-perizinan-limbah-b3' },
    ],
    sources: [
      { label: 'Permen LHK No. 6 Tahun 2021 (teks resmi, BPK)', url: 'https://peraturan.bpk.go.id/Download/205145/permen%20LHK%20No.%206%20tahun%202021.pdf' },
      { label: 'IEC — 6 Peraturan dan Standar Terkait Limbah B3', url: 'https://environment-indonesia.com/5-peraturan-dan-standar-terkait-limbah-berbahaya-dan-beracun-yang-perlu-anda-ketahui/' },
    ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'perizinan', slug: 'permen-lhk-9-2024',
    title: 'Permen LHK No. 9 Tahun 2024: Pengelolaan Sampah yang Mengandung B3 dan Limbah B3',
    excerpt: 'Pemilahan dengan wadah berwarna, kewajiban pengelola kawasan menyediakan TPSSS-B3, serta pencatatan dan pelaporan menurut Permen LHK 9/2024.',
    author: 'Tim LIMBAHIN', date: '2026-10-12',
    images1: ['/artikel/permen-lhk-9-2024.jpg'], images2: [],
    paragraphs1: [
        'Permen LHK No. 9 Tahun 2024, ditetapkan 1 Juli 2024, mengatur pengelolaan sampah yang mengandung B3 dan limbah B3 dari rumah tangga, kawasan komersial, kawasan industri, hingga fasilitas umum dan sosial. Aturan ini melaksanakan PP No. 27 Tahun 2020 tentang Pengelolaan Sampah Spesifik.',
        'Contoh sampah yang diatur: produk rumah tangga yang mengandung B3 dan tidak terpakai (aki bekas, termometer merkuri), bekas kemasan produk B3 (pestisida, cat, aerosol), barang elektronik rusak (baterai, lampu, laptop, printer), serta B3 kedaluwarsa atau tumpah. Perlu dicatat, aturan ini tidak mencakup sampah dari sisa hasil usaha atau kegiatan yang mengandung B3, dan limbah dari fasilitas pelayanan kesehatan tidak termasuk dalam kategori "fasilitas lainnya".'
      ],
    paragraphs2: [
        'Pemilahan dilakukan sejak dari sumber ke dalam empat kelompok dengan wadah berwarna: merah untuk produk rumah tangga yang mengandung B3, oranye untuk bekas kemasan produk B3, hitam untuk barang elektronik rusak, dan coklat untuk B3 kedaluwarsa, tumpah, atau tidak memenuhi spesifikasi. Wadah harus kedap air, bertutup, mudah dipindahkan, serta mudah dikosongkan dan dibersihkan.',
        'Pengelola kawasan permukiman, komersial, industri, dan fasilitas lain wajib menyediakan TPSSS-B3 (Tempat Penampungan Sementara Sampah Spesifik B3) dan mendaftarkannya kepada bupati/wali kota melalui dinas yang membidangi pengelolaan sampah. Nomor registrasi diterbitkan paling lama 7 hari kerja bila dokumen lengkap dan benar.',
        'Pencatatan dilakukan setiap kali sampah dikumpulkan, diolah, atau diserahkan, dan dilaporkan paling sedikit sekali setahun — melalui sistem informasi pengelolaan sampah nasional (SIPSN) untuk FPSS, atau melalui dinas kabupaten/kota untuk TPSSS-B3. Sampah terpilah ini pada akhirnya diserahkan kepada pihak yang memiliki perizinan berusaha di bidang pengelolaan limbah B3.'
      ],
    related: [
      { category: 'panduan', slug: 'panduan-memilah-limbah-medis' },
      { category: 'perizinan', slug: 'permen-lhk-6-2021' },
      { category: 'perizinan', slug: 'panduan-perizinan-limbah-b3' },
    ],
    sources: [
      { label: 'Permen LHK No. 9 Tahun 2024 (teks resmi, BPK)', url: 'https://peraturan.bpk.go.id/Download/351283/Permen%20LHK%20No%209%20Tahun%202024.pdf' },
    ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
  {
    category: 'perizinan', slug: 'permen-lhk-11-2024',
    title: 'Permen LHK No. 11 Tahun 2024: Wajib Sertifikasi Kompetensi (KKNI) untuk Tenaga Pengelola Limbah B3',
    excerpt: 'Pelaku usaha di bidang pengelolaan limbah B3 wajib memiliki tenaga kerja bersertifikat kompetensi KKNI jenjang 3 atau 6 menurut Permen LHK 11/2024.',
    author: 'Tim LIMBAHIN', date: '2026-10-12',
    images1: ['/artikel/permen-lhk-11-2024.jpg'], images2: [],
    paragraphs1: [
        'Permen LHK No. 11 Tahun 2024, ditetapkan 30 Agustus 2024, mengatur penerapan Kerangka Kualifikasi Nasional Indonesia (KKNI) di bidang pengelolaan limbah B3. Intinya: pelaku usaha di bidang pengelolaan limbah B3 wajib memiliki tenaga kerja yang bersertifikat kompetensi.',
        'Kewajiban ini berlaku bagi tiga kelompok: jasa pengelolaan limbah B3 (penyimpanan, pengumpulan, pemanfaatan, pengolahan, penimbunan) yang memiliki Persetujuan Teknis; penghasil limbah B3 yang memiliki Persetujuan Teknis di bidang pengelolaan limbah B3; dan usaha atau kegiatan tertentu yang berisiko tinggi terhadap lingkungan hidup, seperti industri semen, petrokimia, serta minyak dan gas bumi.'
      ],
    paragraphs2: [
        'Ada dua jenjang kualifikasi: jenjang 3 untuk operator atau pelaksana (misalnya operator penyimpanan, pengumpulan, atau pengolahan limbah B3) dan jenjang 6 untuk manajer atau penanggung jawab (misalnya manajer pengumpulan, pengolahan, pemanfaatan, atau penimbunan limbah B3). Apakah suatu jenjang bersifat wajib atau pilihan untuk tiap kegiatan dirinci dalam lampiran peraturan.',
        'Sertifikat Kompetensi Kerja diperoleh melalui Uji Kompetensi oleh Lembaga Sertifikasi Profesi (LSP) yang berlisensi BNSP dan skemanya terdaftar di kementerian lingkungan hidup. Sertifikat berlaku paling lama 3 tahun dan dapat diperpanjang; sertifikat yang terbit sebelum aturan ini tetap berlaku hingga masa berlakunya berakhir.',
        'Pelaku usaha yang tidak memenuhi kewajiban ini dapat dikenai sanksi administratif. Karena itu, sebelum menjalin kerja sama pengelolaan limbah, ada baiknya Anda menanyakan kelengkapan perizinan dan kompetensi tenaga kerja mitra pengelola.'
      ],
    related: [
      { category: 'perizinan', slug: 'permen-lhk-6-2021' },
      { category: 'perizinan', slug: 'pp-22-2021-persetujuan-lingkungan' },
      { category: 'perizinan', slug: 'panduan-perizinan-limbah-b3' },
    ],
    sources: [
      { label: 'Permen LHK No. 11 Tahun 2024 (teks resmi, BPK)', url: 'https://peraturan.bpk.go.id/Download/360458/Permen%20LHK%20No%2011%20Tahun%202024.pdf' },
    ],
    ...DEFAULT_CTA,
    videoUrl: null,
  },
];

export function findArticle(category, slug) {
  return articles.find((a) => a.category === category && a.slug === slug) || null;
}
