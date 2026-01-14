export const translations = {
  id: {
    // Frame UI
    appTitle: "CastRoulette — Temukan cast acak berkualitas",
    spin: "SPIN",
    reroll: "RE-ROLL",
    tip: "TIP",
    follow: "FOLLOW",
    sponsored: "SPONSORED",
    freeSpinsRemaining: "Sisa spin gratis: {count}",
    dailyLimitReached: "Batas spin gratis harian habis",

    // Landing Page
    heroTitle: "Temukan Cast Berkualitas Secara Acak",
    heroSubtitle: "Jelajahi konten terbaik Farcaster dengan sistem spin yang menyenangkan",
    tryInFarcaster: "Coba di Farcaster",
    sponsorNow: "Sponsor sekarang",
    openDashboard: "Buka dashboard",
    howItWorks: "Cara kerja",
    pricing: "Biaya & Fee",
    privacy: "Privasi & Keamanan",

    // Dashboard
    overview: "Ringkasan",
    payments: "Pembayaran",
    creatorWallet: "Dompet Kreator",
    referrals: "Referral",
    totalSpins: "Total Spin",
    paidRerolls: "Re-roll Berbayar",
    tipsGiven: "Tip Diberikan",
    tipsReceived: "Tip Diterima",

    // Sponsor
    sponsorSlot: "Slot Sponsor",
    campaignLabel: "Label Kampanye",
    duration: "Durasi",
    expectedImpressions: "Perkiraan Tayangan",
    totalPrice: "Total Harga",
    buySponsorSlot: "Beli slot sponsor",

    // Payment
    confirmPayment: "Konfirmasi Pembayaran",
    pay: "Bayar",
    cancel: "Batal",

    // Common
    loading: "Memuat...",
    error: "Terjadi kesalahan",
    success: "Berhasil",
    copy: "Salin",
    copied: "Tersalin",
    connect: "Hubungkan",
    disconnect: "Putuskan",
    save: "Simpan",
    edit: "Edit",
    delete: "Hapus",
    close: "Tutup",
  },
  en: {
    // Frame UI
    appTitle: "CastRoulette — Discover random quality casts",
    spin: "SPIN",
    reroll: "RE-ROLL",
    tip: "TIP",
    follow: "FOLLOW",
    sponsored: "SPONSORED",
    freeSpinsRemaining: "Free spins remaining: {count}",
    dailyLimitReached: "Daily free spin limit reached",

    // Landing Page
    heroTitle: "Discover Quality Casts Randomly",
    heroSubtitle: "Explore the best Farcaster content with our fun spin system",
    tryInFarcaster: "Try in Farcaster",
    sponsorNow: "Sponsor now",
    openDashboard: "Open dashboard",
    howItWorks: "How it works",
    pricing: "Pricing & Fees",
    privacy: "Privacy & Security",

    // Dashboard
    overview: "Overview",
    payments: "Payments",
    creatorWallet: "Creator Wallet",
    referrals: "Referrals",
    totalSpins: "Total Spins",
    paidRerolls: "Paid Re-rolls",
    tipsGiven: "Tips Given",
    tipsReceived: "Tips Received",

    // Sponsor
    sponsorSlot: "Sponsor Slot",
    campaignLabel: "Campaign Label",
    duration: "Duration",
    expectedImpressions: "Expected Impressions",
    totalPrice: "Total Price",
    buySponsorSlot: "Buy sponsor slot",

    // Payment
    confirmPayment: "Confirm Payment",
    pay: "Pay",
    cancel: "Cancel",

    // Common
    loading: "Loading...",
    error: "An error occurred",
    success: "Success",
    copy: "Copy",
    copied: "Copied",
    connect: "Connect",
    disconnect: "Disconnect",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    close: "Close",
  },
} as const

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.id

export function t(key: TranslationKey, lang: Language = "id", params?: Record<string, string | number>): string {
  let text = translations[lang][key] || translations.en[key] || key

  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, String(value))
    })
  }

  return text
}
