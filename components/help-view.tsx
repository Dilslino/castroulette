"use client"

import { HelpCircle, Shuffle, RotateCcw, Heart, Megaphone, Users, ExternalLink } from "lucide-react"

interface HelpViewProps {
  language?: "id" | "en"
}

export function HelpView({ language = "id" }: HelpViewProps) {
  const faqs = [
    {
      icon: Shuffle,
      question: language === "id" ? "Apa itu Spin?" : "What is Spin?",
      answer: language === "id"
        ? "Spin adalah cara untuk menemukan cast acak berkualitas. Kamu dapat 5 spin gratis setiap hari."
        : "Spin is how you discover random quality casts. You get 5 free spins daily.",
    },
    {
      icon: RotateCcw,
      question: language === "id" ? "Apa itu Re-roll?" : "What is Re-roll?",
      answer: language === "id"
        ? "Re-roll memungkinkan kamu mendapatkan cast baru dengan biaya 0.05 USDC jika spin gratis habis."
        : "Re-roll lets you get a new cast for 0.05 USDC when free spins run out.",
    },
    {
      icon: Heart,
      question: language === "id" ? "Bagaimana cara Tip?" : "How to Tip?",
      answer: language === "id"
        ? "Tekan tombol Tip untuk memberikan 0.10 USDC kepada kreator cast yang kamu suka."
        : "Press Tip button to send 0.10 USDC to the cast creator you like.",
    },
    {
      icon: Megaphone,
      question: language === "id" ? "Cara promosi cast?" : "How to promote?",
      answer: language === "id"
        ? "Buka tab Sponsor dan pilih paket sesuai kebutuhan untuk mempromosikan cast kamu."
        : "Go to Sponsor tab and choose a package to promote your cast.",
    },
    {
      icon: Users,
      question: language === "id" ? "Apa itu Referral?" : "What is Referral?",
      answer: language === "id"
        ? "Bagikan link referral kamu dan dapatkan 10% dari setiap transaksi teman yang bergabung."
        : "Share your referral link and earn 10% from every transaction by friends who join.",
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)]">
          <HelpCircle className="h-5 w-5" />
          <h2 className="font-mono font-bold text-lg">
            {language === "id" ? "BANTUAN & FAQ" : "HELP & FAQ"}
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const Icon = faq.icon
          return (
            <div
              key={index}
              className="bg-card border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="bg-primary p-2 border-2 border-black flex-shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-sm mb-1">{faq.question}</h3>
                  <p className="font-mono text-xs text-foreground/70 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Contact Section */}
      <div className="mt-6 bg-muted border-4 border-black shadow-[4px_4px_0px_0px_rgba(45,45,45,1)] p-4">
        <h3 className="font-mono font-bold text-sm mb-2">
          {language === "id" ? "BUTUH BANTUAN LAIN?" : "NEED MORE HELP?"}
        </h3>
        <p className="font-mono text-xs text-foreground/70 mb-3">
          {language === "id"
            ? "Hubungi kami di Warpcast untuk pertanyaan lebih lanjut"
            : "Contact us on Warpcast for further questions"}
        </p>
        <a
          href="https://warpcast.com/castroulette"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono font-bold text-sm text-primary active:underline"
        >
          @castroulette
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
