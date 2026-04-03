"use client";

import { useState } from "react";

/* ── Constants ── */
const REVENUE_PER_PARCEL = 7.2;
const FIXED_COSTS = 56_000;
const COST_BREAKDOWN = [
  { label: "Space rent", amount: 15_000 },
  { label: "2 packers", amount: 28_000 },
  { label: "Packaging materials", amount: 8_000 },
  { label: "Utilities + misc", amount: 5_000 },
];

type StatusTier = {
  color: string;
  bg: string;
  message: string;
};

function getStatusTier(dailyOrders: number): StatusTier {
  if (dailyOrders < 200)
    return {
      color: "text-red-400",
      bg: "bg-red-400/10 border-red-400/30",
      message: "Below Tier 1 minimum. BodeGO is built for 100+ orders/day sellers.",
    };
  if (dailyOrders <= 300)
    return {
      color: "text-blue-400",
      bg: "bg-blue-400/10 border-blue-400/30",
      message: "Tier 1 — Scaling Seller. This is BodeGO\u2019s core target.",
    };
  if (dailyOrders <= 500)
    return {
      color: "text-green-400",
      bg: "bg-green-400/10 border-green-400/30",
      message: "Tier 1–2 overlap. Strong hub. One seller fills this range.",
    };
  if (dailyOrders <= 600)
    return {
      color: "text-emerald-300",
      bg: "bg-emerald-400/10 border-emerald-300/30",
      message: "Tier 2 — Regional Brand. One seller fills an entire hub.",
    };
  return {
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/30",
    message: "Tier 2–3 territory. Consider multi-hub routing.",
  };
}

function formatPeso(value: number): string {
  return `₱${Math.round(value).toLocaleString("en-PH")}`;
}

/* ── Milestone markers beneath the orders slider ── */
const MILESTONES = [
  { value: 200, label: "Tier 1 min" },
  { value: 300, label: "Tier 1/2" },
  { value: 500, label: "Tier 2 mid" },
  { value: 600, label: "Tier 2 max" },
];

export default function HubCalculator() {
  const [dailyOrders, setDailyOrders] = useState(300);
  const [operatingDays, setOperatingDays] = useState(26);
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);

  const monthlyParcels = dailyOrders * operatingDays;
  const grossRevenue = monthlyParcels * REVENUE_PER_PARCEL;
  const netIncome = grossRevenue - FIXED_COSTS;
  const status = getStatusTier(dailyOrders);

  return (
    <div className="rounded-2xl bg-[#0F2645] p-6 sm:p-8">
      {/* Header */}
      <p className="text-xs font-semibold tracking-widest text-orange uppercase">
        Hub Partner Income Calculator
      </p>
      <h3 className="mt-2 text-2xl font-black text-white">
        How much can your hub earn?
      </h3>
      <p className="mt-1 text-sm text-[#A0A8B8]">
        Based on real BodeGO unit economics. Adjust the sliders to match your
        space.
      </p>

      {/* ── Sliders ── */}
      <div className="mt-8 space-y-8">
        {/* Daily orders */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#A0A8B8]">
              Daily orders
            </span>
            <span className="font-mono text-sm font-semibold text-white">
              {dailyOrders} orders/day
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={800}
            step={25}
            value={dailyOrders}
            onChange={(e) => setDailyOrders(Number(e.target.value))}
            className="hub-slider mt-3 w-full"
          />
          {/* Milestone markers */}
          <div className="relative mt-1 h-5">
            {MILESTONES.map((m) => {
              const pct = ((m.value - 100) / (800 - 100)) * 100;
              return (
                <span
                  key={m.value}
                  className="absolute -translate-x-1/2 text-[10px] text-[#A0A8B8]"
                  style={{ left: `${pct}%` }}
                >
                  {m.value}
                </span>
              );
            })}
          </div>
          <div className="relative h-4">
            {MILESTONES.map((m) => {
              const pct = ((m.value - 100) / (800 - 100)) * 100;
              return (
                <span
                  key={m.label}
                  className="absolute -translate-x-1/2 text-[9px] text-[#A0A8B8]/60"
                  style={{ left: `${pct}%` }}
                >
                  {m.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Operating days */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#A0A8B8]">
              Operating days/month
            </span>
            <span className="font-mono text-sm font-semibold text-white">
              {operatingDays} days
            </span>
          </div>
          <input
            type="range"
            min={20}
            max={27}
            step={1}
            value={operatingDays}
            onChange={(e) => setOperatingDays(Number(e.target.value))}
            className="hub-slider mt-3 w-full"
          />
        </div>
      </div>

      {/* ── Results grid ── */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        {/* Monthly Parcels */}
        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-xs text-[#A0A8B8]">Monthly Parcels</p>
          <p className="mt-1 font-mono text-2xl font-bold text-white transition-all duration-300">
            {monthlyParcels.toLocaleString("en-PH")}
          </p>
        </div>

        {/* Gross Revenue */}
        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-xs text-[#A0A8B8]">Gross Hub Revenue</p>
          <p className="mt-1 font-mono text-2xl font-bold text-orange transition-all duration-300">
            {formatPeso(grossRevenue)}
          </p>
          <p className="mt-0.5 text-[10px] text-[#A0A8B8]">
            ₱7.20/parcel &middot; 60% revenue share
          </p>
        </div>

        {/* Fixed Costs */}
        <div className="relative rounded-xl bg-white/5 p-4">
          <p className="text-xs text-[#A0A8B8]">Est. Fixed Costs</p>
          <button
            type="button"
            onClick={() => setShowCostBreakdown(!showCostBreakdown)}
            className="mt-1 font-mono text-2xl font-bold text-white transition-all duration-300"
          >
            {formatPeso(FIXED_COSTS)}
          </button>
          <p className="mt-0.5 text-[10px] text-[#A0A8B8]">
            <button
              type="button"
              onClick={() => setShowCostBreakdown(!showCostBreakdown)}
              className="underline decoration-dotted underline-offset-2 hover:text-white"
            >
              See breakdown
            </button>
          </p>
          {showCostBreakdown && (
            <div className="absolute bottom-full left-0 z-10 mb-2 w-56 rounded-lg border border-white/10 bg-[#0A1628] p-3 shadow-xl">
              {COST_BREAKDOWN.map((c) => (
                <div
                  key={c.label}
                  className="flex justify-between py-0.5 text-xs"
                >
                  <span className="text-[#A0A8B8]">{c.label}</span>
                  <span className="font-mono text-white">
                    ₱{(c.amount / 1000).toFixed(0)}K
                  </span>
                </div>
              ))}
              <div className="mt-1 border-t border-white/10 pt-1 flex justify-between text-xs font-semibold">
                <span className="text-[#A0A8B8]">Total</span>
                <span className="font-mono text-white">₱56K</span>
              </div>
            </div>
          )}
        </div>

        {/* Net Income */}
        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-xs text-[#A0A8B8]">Est. Monthly Net Income</p>
          <p
            className={`mt-1 font-mono text-2xl font-bold transition-all duration-300 ${
              netIncome > 0 ? "text-green-400" : netIncome === 0 ? "text-orange" : "text-red-400"
            }`}
          >
            {netIncome >= 0 ? formatPeso(netIncome) : `-${formatPeso(Math.abs(netIncome))}`}
          </p>
          <p className="mt-0.5 text-[10px]">
            {netIncome > 0 ? (
              <span className="text-green-400">&#10003; Profitable</span>
            ) : (
              <span className="text-red-400">
                &#9888; Below break-even — need more volume
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div
        className={`mt-4 rounded-lg border px-4 py-3 text-xs font-medium ${status.bg} ${status.color}`}
      >
        {status.message}
      </div>

      {/* ── Footnote ── */}
      <p className="mt-6 text-[10px] leading-relaxed text-[#A0A8B8]/60">
        Revenue share % subject to alpha partner agreements. Fixed costs are
        estimates — your actual costs depend on your space, location, and
        staffing. Hub income is pre-tax. BodeGO provides the tech, SOPs, and
        seller demand. You provide the space and operations.
      </p>

      {/* CTA */}
      <a
        href="#waitlist"
        className="mt-4 inline-block rounded-full border-2 border-orange px-6 py-3 text-sm font-semibold text-orange transition-colors hover:bg-orange hover:text-white"
      >
        Apply as Hub Partner &rarr;
      </a>
    </div>
  );
}
