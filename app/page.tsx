"use client";

import { useEffect, useState } from "react";
import { MapPin, Menu, X } from "lucide-react";
import HubCalculator from "@/components/HubCalculator";

/* ───────────────────────── Logo ───────────────────────── */
function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#" className="flex items-center gap-2">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-orange">
        <MapPin className="h-5 w-5 text-white" strokeWidth={2.5} />
      </span>
      <span className={`text-xl font-black tracking-tight ${dark ? "text-dark-navy" : "text-white"}`}>
        Bode<span className="italic text-orange">GO</span>
      </span>
    </a>
  );
}

/* ──────────────────── Hub Network Background ─────────────────── */
function HubNetworkBg() {
  const hubs: [number, number][] = [
    [60, 80], [280, 50], [520, 140], [780, 60], [1050, 100], [1180, 200],
    [150, 300], [400, 260], [650, 350], [900, 240], [1100, 380],
    [80, 500], [320, 480], [580, 560], [850, 480], [1150, 540],
  ];
  const buyers: [number, number][] = [
    [180, 30], [450, 20], [700, 45], [950, 30], [1100, 70],
    [30, 180], [200, 150], [370, 100], [600, 200], [820, 140], [1000, 180], [1160, 130],
    [110, 380], [260, 340], [490, 410], [730, 300], [980, 360], [1140, 300],
    [40, 580], [220, 550], [460, 610], [700, 650], [920, 590], [1080, 650], [1200, 580],
    [350, 220], [820, 420], [560, 480], [1020, 500],
  ];
  // Connect hubs to nearby buyers (distance < 200)
  const lines: [number, number, number, number][] = [];
  for (const [hx, hy] of hubs) {
    for (const [bx, by] of buyers) {
      const d = Math.sqrt((hx - bx) ** 2 + (hy - by) ** 2);
      if (d < 200) lines.push([hx, hy, bx, by]);
    }
  }

  return (
    <div className="hero-bg-layer">
      <svg
        viewBox="0 0 1200 700"
        className="hub-bg-svg absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Connection lines — very faint */}
        {lines.map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            className="hub-line-bg"
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="white"
            strokeOpacity={0.18}
            strokeWidth={1.2}
          />
        ))}

        {/* Small buyer nodes — barely visible white dots */}
        {buyers.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={1.5} fill="white" fillOpacity={0.25} />
        ))}

        {/* Hub nodes — subtle orange */}
        {hubs.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={4} fill="#E8601C" fillOpacity={0.45} />
        ))}
      </svg>
    </div>
  );
}

/* ──────────────────── Seller Dashboard Mockup ──────────── */
function DashboardMockup() {
  return (
    <div className="rounded-2xl border border-white/10 bg-dark-navy/60 p-6 shadow-2xl backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-red-400" />
        <div className="h-3 w-3 rounded-full bg-yellow-400" />
        <div className="h-3 w-3 rounded-full bg-green-400" />
        <span className="ml-2 text-xs text-muted">seller-dashboard.bodego.ph</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-navy/80 p-4">
          <p className="text-xs text-muted">Wallet Balance</p>
          <p className="font-mono text-xl font-medium text-orange">&#8369;48,500</p>
        </div>
        <div className="rounded-lg bg-navy/80 p-4">
          <p className="text-xs text-muted">Today&apos;s Orders</p>
          <p className="font-mono text-xl font-medium text-white">347</p>
        </div>
        <div className="rounded-lg bg-navy/80 p-4">
          <p className="text-xs text-muted">Delivered</p>
          <p className="font-mono text-xl font-medium text-green-400">312</p>
        </div>
        <div className="rounded-lg bg-navy/80 p-4">
          <p className="text-xs text-muted">In-transit</p>
          <p className="font-mono text-xl font-medium text-yellow-300">35</p>
        </div>
      </div>
      <div className="mt-3 rounded-lg bg-navy/80 p-4">
        <p className="text-xs text-muted">Avg Delivery Time</p>
        <p className="font-mono text-2xl font-medium text-white">1.1 <span className="text-sm text-muted">days</span></p>
      </div>
    </div>
  );
}

/* ══════════════════════ MAIN PAGE ═══════════════════════ */
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  /* ── Scroll: nav bg + section reveals ── */
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 80);

      // Parallax on hero bg
      const heroBg = document.querySelector('.hub-bg-svg') as HTMLElement;
      if (heroBg) {
        heroBg.style.transform = `translateY(${window.scrollY * 0.1}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const navLinks = [
    { label: "How it works", href: "#how-it-works" },
    { label: "For Sellers", href: "#for-sellers" },
    { label: "For Hubs", href: "#for-hubs" },
  ];

  return (
    <>
      {/* ═══════════════════ NAV ═══════════════════ */}
      <nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          navScrolled ? "nav-scrolled" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo dark={navScrolled} />

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  navScrolled ? "text-dark-navy hover:text-orange" : "text-white/80 hover:text-white"
                }`}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#waitlist"
              className="cta-btn rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-hover"
            >
              Join Waitlist
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className={`h-6 w-6 ${navScrolled ? "text-dark-navy" : "text-white"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${navScrolled ? "text-dark-navy" : "text-white"}`} />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-dark-navy px-6 pb-6 md:hidden">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="block py-3 text-sm font-medium text-white/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#waitlist"
              className="mt-2 block rounded-full bg-orange px-5 py-2.5 text-center text-sm font-semibold text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Join Waitlist
            </a>
          </div>
        )}
      </nav>

      {/* ═══════════════════ SECTION 1: HERO ═══════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-dark-navy px-6 pt-24 pb-16">
        <HubNetworkBg />
        <div className="relative z-10 flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl leading-tight font-black tracking-tight text-white md:text-7xl md:leading-tight">
              Ship Same-Day.
              <br />
              From Anywhere.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
              BodeGO is built for scaling Philippine sellers — ₱1M–3M/month and growing.
              You&apos;re packing 100–600 orders a day. That&apos;s your problem. We solve it.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="#waitlist"
                className="w-full rounded-full bg-orange px-8 py-4 text-center text-lg font-semibold text-white transition-colors hover:bg-orange-hover sm:w-auto"
              >
                Join the Waitlist
              </a>
              <a
                href="#how-it-works"
                className="w-full rounded-full border border-white/30 px-8 py-4 text-center text-lg font-semibold text-white transition-colors hover:border-white/60 sm:w-auto"
              >
                See How It Works
              </a>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted">
              <span>&#10003; Built for ₱1M+ sellers</span>
              <span>&#10003; Pay per order fulfilled</span>
              <span>&#10003; Launching Central Luzon 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 2: THE PROBLEM ═══════════════════ */}
      <section className="bg-warm-white px-6 py-24">
        <div className="reveal mx-auto max-w-7xl">
          <p className="text-sm font-semibold tracking-widest text-orange uppercase">The Problem</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-black text-dark-navy md:text-4xl">
            You&apos;re packing 200 orders a day from your bedroom. Your Metro Manila competitor
            ships same-day.
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "📦",
                title: "You pack. They fulfill.",
                desc: "You\u2019re packing 100\u2013600 orders a day. That\u2019s a full operations team just doing fulfillment \u2014 time stolen from sourcing, marketing, and growth.",
              },
              {
                icon: "🚚",
                title: "Distance = lost rankings.",
                desc: "TikTok Shop and Shopee rank fast shippers higher. A 100km order from Pampanga to a Manila buyer takes 2-3 days. A Manila seller ships same-day.",
              },
              {
                icon: "₱",
                title: "The math is brutal at \u20B1100/L fuel.",
                desc: "At today\u2019s fuel prices, shipping from a distant warehouse costs \u20B1148/parcel. You\u2019re bleeding margin every order.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="text-3xl">{card.icon}</span>
                <h3 className="mt-4 text-lg font-bold text-dark-navy">{card.title}</h3>
                <p className="mt-2 text-muted">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 3: THE SOLUTION ═══════════════════ */}
      <section className="bg-navy px-6 py-24">
        <div className="reveal mx-auto max-w-7xl">
          <p className="text-sm font-semibold tracking-widest text-orange uppercase">The Solution</p>
          <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">
            Your stock, 5km from your buyers.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-muted">
            BodeGO is the fulfillment layer PH e-commerce never had.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "🧠",
                title: "AI Routing Engine",
                desc: "Every order assigned to the optimal hub in under 500ms. No manual decisions.",
              },
              {
                icon: "🏪",
                title: "Franchised Micro-Hubs",
                desc: "Idle commercial spaces converted to tech-enabled storage nodes. We don\u2019t sign leases — local partners do.",
              },
              {
                icon: "💳",
                title: "Prepaid Wallet",
                desc: "No monthly subscriptions. Top up, pay per order fulfilled. COD and escrow both supported.",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-8"
              >
                <span className="text-3xl">{pillar.icon}</span>
                <h3 className="mt-4 text-lg font-bold text-white">{pillar.title}</h3>
                <p className="mt-2 text-muted">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 4: HOW IT WORKS ═══════════════════ */}
      <section id="how-it-works" className="bg-warm-white px-6 py-24">
        <div className="reveal mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-black text-dark-navy md:text-4xl">
            From Order to Delivered. In 4 Steps.
          </h2>
          <div className="relative mt-16 grid gap-8 md:grid-cols-4">
            {[
              {
                num: "1",
                icon: "📱",
                title: "Order placed on Shopee or TikTok",
                desc: "Webhook fires to BodeGO automatically.",
              },
              {
                num: "2",
                icon: "⚡",
                title: "AI assigns the optimal hub",
                desc: "In under 500ms — based on stock, proximity, capacity, courier cutoff.",
              },
              {
                num: "3",
                icon: "📦",
                title: "Hub picks, packs, labels",
                desc: "Pack photo taken. Barcode scanned. Sealed.",
              },
              {
                num: "4",
                icon: "🚚",
                title: "Courier picks up. Buyer receives.",
                desc: "J&T or Ninja Van picks 200 parcels from one address. Short route = faster delivery.",
              },
            ].map((step, i) => (
              <div key={step.num} className="relative text-center">
                {/* Arrow connector (desktop only) */}
                {i < 3 && (
                  <div className="absolute top-8 -right-4 hidden h-0.5 w-8 bg-orange/40 md:block" />
                )}
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange text-xl font-black text-white">
                  {step.num}
                </div>
                <span className="mt-4 block text-2xl">{step.icon}</span>
                <h3 className="mt-2 text-base font-bold text-dark-navy">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 5: STATS ═══════════════════ */}
      <section className="bg-dark-navy px-6 py-24">
        <div className="reveal mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-black text-white md:text-4xl">
            The Numbers Behind BodeGO
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "₱1.1T", label: "PH e-commerce GMV (2024)", sub: "+20% annually" },
              { value: "300–600", label: "Orders/day for Tier 2 sellers", sub: "BodeGO\u2019s sweet spot" },
              { value: "₱436K/mo", label: "Avg savings for Tier 2 seller", sub: "vs Metro Manila warehouse at ₱100/L" },
              { value: "<500ms", label: "Order routing time", sub: "Per order, every order" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                <p className="font-mono text-4xl font-medium text-orange">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-white">{stat.label}</p>
                <p className="mt-1 text-xs text-muted">{stat.sub}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-muted">
            Savings based on Tier 2 seller (450 orders/day) at &#8369;100/L fuel scenario. See full
            methodology in BodeGO Research Hub.
          </p>
        </div>
      </section>

      {/* ═══════════════════ SECTION 6: FOR SELLERS ═══════════════════ */}
      <section id="for-sellers" className="bg-white px-6 py-24">
        <div className="reveal mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold tracking-widest text-orange uppercase">For Sellers</p>
            <h2 className="mt-4 text-3xl font-black text-dark-navy md:text-4xl">
              Stop packing 300 orders a day. Start scaling.
            </h2>
            <ul className="mt-8 space-y-4">
              {[
                "Built for 100–600 order/day sellers — Tier 1 and Tier 2",
                "Ship same-day from Central Luzon to Manila buyers",
                "Rank higher on TikTok Shop and Shopee — platforms reward fast shippers",
                "Never stockout mid-sale — AI reorder alerts before you run dry",
                "No monthly subscription — pay per parcel fulfilled",
                "Alpha pricing for pilot sellers — locked in before public launch",
                "One Tier 2 seller (450 orders/day) fills an entire hub",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 text-green-500">&#10003;</span>
                  <span className="text-dark-navy">{b}</span>
                </li>
              ))}
            </ul>
            <a
              href="#waitlist"
              className="mt-8 inline-block rounded-full bg-orange px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-orange-hover"
            >
              Join Seller Waitlist &rarr;
            </a>
            <p className="mt-3 text-sm text-muted">
              Currently onboarding pilot sellers in Central Luzon.
            </p>
          </div>
          <DashboardMockup />
        </div>
      </section>

      {/* ═══════════════════ SECTION 7: FOR HUB PARTNERS ═══════════════════ */}
      <section id="for-hubs" className="bg-warm-white px-6 py-24">
        <div className="reveal mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold tracking-widest text-orange uppercase">For Hub Partners</p>
            <h2 className="mt-4 text-3xl font-black text-dark-navy md:text-4xl">
              Turn your idle space into a logistics income.
            </h2>
            <ul className="mt-8 space-y-4">
              {[
                "BodeGO provides tech, SOPs, and seller demand pipeline",
                "You provide the space, staff, and local presence",
                "Revenue share per parcel processed — paid weekly",
                "Zero upfront franchise fee in alpha phase",
                "Seller contracts owned by BodeGO — you can\u2019t be undercut",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 text-green-500">&#10003;</span>
                  <span className="text-dark-navy">{b}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted">
              Ideal spaces: 40–150sqm commercial, loading dock access, Central Luzon.
            </p>
          </div>
          <HubCalculator />
        </div>
      </section>

      {/* ═══════════════════ SECTION 8: PLATFORM INTEGRATIONS ═══════════════════ */}
      <section className="bg-navy px-6 py-24">
        <div className="reveal mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">
            Works with where you already sell.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Your orders flow in automatically. No manual uploads. No copy-paste.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Shopee",
                color: "#EE4D2D",
                priority: "#1 Priority · Live Q3 2026",
                note: ">100 orders/day? Time to 3PL.",
              },
              {
                name: "TikTok Shop",
                color: "#00F2EA",
                priority: "#2 Priority · Live Q4 2026",
                note: ">30 orders/day? Their algorithm punishes slow shippers.",
              },
              {
                name: "Lazada",
                color: "#0F146B",
                priority: "Post Hub 1 · 2027",
                note: "3-6mo certification process. Coming after Shopee + TikTok are live.",
              },
            ].map((p) => (
              <div key={p.name} className="rounded-2xl border border-white/10 bg-white/5 p-8">
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-lg font-black text-white"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name[0]}
                </div>
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <p className="mt-1 text-sm font-medium text-orange">{p.priority}</p>
                <p className="mt-2 text-sm text-muted">{p.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 9: WAITLIST CTA ═══════════════════ */}
      <section
        id="waitlist"
        className="px-6 py-24"
        style={{ background: "linear-gradient(180deg, #0F2645 0%, #0A1628 100%)" }}
      >
        <div className="reveal mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">
            BodeGO is launching in Central Luzon in 2026.
          </h2>
          <p className="mt-4 text-lg text-muted">
            We&apos;re onboarding 15-20 pilot sellers and 3 hub partners for Phase 1. Be first.
          </p>
          <form
            className="mt-10 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="you@email.com"
              className="flex-1 rounded-full border border-white/20 bg-white/10 px-6 py-4 text-white placeholder:text-muted focus:border-orange focus:outline-none"
              required
            />
            <button
              type="submit"
              className="rounded-full bg-orange px-8 py-4 font-semibold text-white transition-colors hover:bg-orange-hover"
            >
              Join Waitlist
            </button>
          </form>
          <p className="mt-4 text-sm text-muted">No spam. Just launch updates.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted">
            <span>🔒 No credit card</span>
            <span>📦 Free pilot onboarding</span>
            <span>🚀 Q3 2026 launch</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 10: FOOTER ═══════════════════ */}
      <footer className="bg-dark-navy px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            <div className="text-center md:text-left">
              <Logo />
              <p className="mt-2 text-sm text-muted">Same-day, from Anywhere.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#how-it-works" className="text-muted transition-colors hover:text-white">
                How It Works
              </a>
              <a href="#for-sellers" className="text-muted transition-colors hover:text-white">
                For Sellers
              </a>
              <a href="#for-hubs" className="text-muted transition-colors hover:text-white">
                For Hub Partners
              </a>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-8 md:flex-row md:justify-between">
            <p className="text-xs text-muted">
              BodeGO &middot; AIM MIB Capstone 2026 &middot; Built by Theo Roque
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-white"
              aria-label="GitHub"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
