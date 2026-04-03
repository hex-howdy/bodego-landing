"use client";

import { useState } from "react";

/* ── Constants ── */
const REVENUE_PER_PARCEL = 12;

/* ── Variable cost tiers ── */
function getRent(orders: number): { cost: number; sqm: string } {
  if (orders <= 200) return { cost: 15_000, sqm: "40–80sqm" };
  if (orders <= 400) return { cost: 22_000, sqm: "80–120sqm" };
  if (orders <= 600) return { cost: 32_000, sqm: "120–160sqm" };
  return { cost: 45_000, sqm: "160–220sqm" };
}

function getStaff(orders: number): { cost: number; label: string; count: number } {
  if (orders <= 180) return { cost: 28_000, label: "2 packers", count: 2 };
  if (orders <= 330) return { cost: 42_000, label: "3 packers", count: 3 };
  if (orders <= 480) return { cost: 56_000, label: "4 packers", count: 4 };
  if (orders <= 630) return { cost: 77_000, label: "5 packers + supervisor", count: 5 };
  return { cost: 91_000, label: "6 packers + supervisor", count: 6 };
}

function getMaterials(monthlyParcels: number): number {
  return monthlyParcels * 1;
}

function getUtilities(orders: number): number {
  return orders <= 300 ? 5_000 : 8_000;
}

function formatPeso(value: number): string {
  return `₱${Math.round(value).toLocaleString("en-PH")}`;
}

/* ── Milestone markers beneath the orders slider ── */
const MILESTONES = [
  { value: 180, label: "break-even" },
  { value: 300, label: "profitable" },
  { value: 450, label: "sweet spot" },
  { value: 600, label: "Tier 2 scale" },
];

const SLIDER_MIN = 180;
const SLIDER_MAX = 800;

export default function HubCalculator() {
  const [dailyOrders, setDailyOrders] = useState(300);
  const [operatingDays, setOperatingDays] = useState(26);
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);

  const monthlyParcels = dailyOrders * operatingDays;
  const grossRevenue = monthlyParcels * REVENUE_PER_PARCEL;

  const rent = getRent(dailyOrders);
  const staff = getStaff(dailyOrders);
  const materials = getMaterials(monthlyParcels);
  const utilities = getUtilities(dailyOrders);
  const totalCosts = rent.cost + staff.cost + materials + utilities;

  const netIncome = grossRevenue - totalCosts;
  const netMonthly = netIncome;
  const annualIncome = netMonthly * 12;
  const margin = grossRevenue > 0 ? (netIncome / grossRevenue) * 100 : 0;

  const packerUtilization = Math.round(
    (dailyOrders / (staff.count * 180)) * 100
  );

  /* ── Recommendations ── */
  const recommendations: string[] = [
    "🏠 You provide the space. BodeGO brings the sellers, tech, SOPs, and courier partnerships. Your cost: operations. Their cost: everything else.",
  ];

  if (netIncome < 0) {
    const breakEvenOrders = Math.ceil(totalCosts / 12 / operatingDays);
    recommendations.push(
      `⚠️ Below break-even. You need ${breakEvenOrders} orders/day to cover costs at current staffing.`
    );
  }

  if (margin >= 0 && margin < 10) {
    recommendations.push(
      `💡 Thin margin at ${margin.toFixed(1)}%. Consider targeting a second seller to fill remaining capacity before adding staff.`
    );
  }

  if (packerUtilization > 85) {
    const nextTierThreshold = Math.ceil(dailyOrders / 180) * 180 + 1;
    const nextStaff = getStaff(nextTierThreshold);
    const addedCost = nextStaff.cost - staff.cost;
    recommendations.push(
      `⚡ Packers are near full capacity. Next hire needed at ${nextTierThreshold} orders/day — adds ₱${addedCost.toLocaleString("en-PH")}/mo.`
    );
  }

  if (dailyOrders >= 300 && dailyOrders <= 450) {
    recommendations.push(
      "🎯 Sweet spot zone. One Tier 1 seller (100–300 orders/day) fills this range."
    );
  }

  if (dailyOrders > 450 && dailyOrders < 600) {
    recommendations.push(
      "🏆 Tier 2 territory. One seller at this volume fills your entire hub — reduces client management overhead."
    );
  }

  if (dailyOrders >= 600) {
    recommendations.push(
      "📈 Consider expanding: at this volume, a second hub location becomes viable."
    );
  }

  // Removed — covered by the first-position insight above

  return (
    <div className="rounded-2xl bg-[#0F2645] p-6 sm:p-8">
      {/* Header */}
      <p className="text-xs font-semibold tracking-widest text-orange uppercase">
        Hub Partner Income Calculator
      </p>
      <h3 className="mt-2 text-2xl font-black text-white">
        Turn your idle space into ₱{annualIncome > 0 ? Math.round(annualIncome).toLocaleString("en-PH") : "0"}/year.
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
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            step={25}
            value={dailyOrders}
            onChange={(e) => setDailyOrders(Number(e.target.value))}
            className="hub-slider mt-3 w-full"
          />
          {/* Milestone markers */}
          <div className="relative mt-1 h-5">
            {MILESTONES.map((m) => {
              const pct =
                ((m.value - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;
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
              const pct =
                ((m.value - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;
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
            max={30}
            step={1}
            value={operatingDays}
            onChange={(e) => setOperatingDays(Number(e.target.value))}
            className="hub-slider mt-3 w-full"
          />
        </div>
      </div>

      {/* ── Annual Income Projection — hero card ── */}
      <div className="mt-8 rounded-xl bg-white/5 p-5">
        <p className="text-xs text-[#A0A8B8]">Annual Income Projection</p>
        <p
          className={`mt-1 font-mono text-3xl font-black transition-all duration-300 ${
            annualIncome > 0 ? "text-orange" : annualIncome === 0 ? "text-orange" : "text-red-400"
          }`}
        >
          {annualIncome >= 0
            ? formatPeso(annualIncome)
            : `-${formatPeso(Math.abs(annualIncome))}`}
        </p>
        <p className="mt-0.5 text-[10px] text-[#A0A8B8]">
          Projected yearly net income
        </p>
        <p className="mt-1 text-[10px] text-[#A0A8B8]/60">
          <span className="text-green-400">↑</span> vs. ₱0/mo if this space sits idle
        </p>
      </div>

      {/* ── Results grid — 5 cards ── */}
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {/* Card 1 — Monthly Parcels */}
        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-xs text-[#A0A8B8]">Monthly Parcels</p>
          <p className="mt-1 font-mono text-2xl font-bold text-white transition-all duration-300">
            {monthlyParcels.toLocaleString("en-PH")}
          </p>
        </div>

        {/* Card 2 — Gross Revenue */}
        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-xs text-[#A0A8B8]">Gross Revenue</p>
          <p className="mt-1 font-mono text-2xl font-bold text-orange transition-all duration-300">
            {formatPeso(grossRevenue)}
          </p>
          <p className="mt-0.5 text-[10px] text-[#A0A8B8]">
            ₱12/parcel fulfillment fee
          </p>
        </div>

        {/* Card 3 — Variable Costs (expandable) */}
        <div className="relative rounded-xl bg-white/5 p-4">
          <p className="text-xs text-[#A0A8B8]">Variable Costs</p>
          <button
            type="button"
            onClick={() => setShowCostBreakdown(!showCostBreakdown)}
            className="mt-1 font-mono text-2xl font-bold text-white transition-all duration-300"
          >
            {formatPeso(totalCosts)}
          </button>
          <p className="mt-0.5 text-[10px] text-[#A0A8B8]">
            <button
              type="button"
              onClick={() => setShowCostBreakdown(!showCostBreakdown)}
              className="underline decoration-dotted underline-offset-2 hover:text-white"
            >
              {showCostBreakdown ? "Hide" : "See"} breakdown
            </button>
          </p>
          {showCostBreakdown && (
            <div className="absolute bottom-full left-0 z-10 mb-2 w-64 rounded-lg border border-white/10 bg-[#0A1628] p-3 shadow-xl">
              <div className="flex justify-between py-0.5 text-xs">
                <span className="text-[#A0A8B8]">
                  Rent ({rent.sqm})
                </span>
                <span className="font-mono text-white">
                  {formatPeso(rent.cost)}
                </span>
              </div>
              <div className="flex justify-between py-0.5 text-xs">
                <span className="text-[#A0A8B8]">
                  Staff ({staff.label})
                </span>
                <span className="font-mono text-white">
                  {formatPeso(staff.cost)}
                </span>
              </div>
              <div className="flex justify-between py-0.5 text-xs">
                <span className="text-[#A0A8B8]">
                  Materials (₱1/parcel)
                </span>
                <span className="font-mono text-white">
                  {formatPeso(materials)}
                </span>
              </div>
              <div className="flex justify-between py-0.5 text-xs">
                <span className="text-[#A0A8B8]">Utilities</span>
                <span className="font-mono text-white">
                  {formatPeso(utilities)}
                </span>
              </div>
              <div className="mt-1 flex justify-between border-t border-white/10 pt-1 text-xs font-semibold">
                <span className="text-[#A0A8B8]">Total</span>
                <span className="font-mono text-white">
                  {formatPeso(totalCosts)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Card 4 — Net Monthly Income */}
        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-xs text-[#A0A8B8]">Net Monthly Income</p>
          <p
            className={`mt-1 font-mono text-2xl font-bold transition-all duration-300 ${
              netIncome > 0
                ? "text-green-400"
                : netIncome === 0
                  ? "text-orange"
                  : "text-red-400"
            }`}
          >
            {netIncome >= 0
              ? formatPeso(netIncome)
              : `-${formatPeso(Math.abs(netIncome))}`}
          </p>
          <p className="mt-0.5 text-[10px] text-[#A0A8B8]">
            {margin.toFixed(1)}% net margin
          </p>
        </div>

        {/* Card 5 — Capacity Used */}
        <div className="col-span-2 rounded-xl bg-white/5 p-4 sm:col-span-1">
          <p className="text-xs text-[#A0A8B8]">Capacity Used</p>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                packerUtilization > 90 ? "bg-red-400" : "bg-green-400"
              }`}
              style={{ width: `${Math.min(packerUtilization, 100)}%` }}
            />
          </div>
          <p
            className={`mt-1 text-xs font-medium ${
              packerUtilization > 90 ? "text-red-400" : "text-[#A0A8B8]"
            }`}
          >
            {packerUtilization}% packer utilization
            {packerUtilization > 90 && (
              <span className="ml-1">
                ⚠️ Near capacity — next hire needed soon
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ── Strategic Recommendations ── */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold text-[#A0A8B8] uppercase tracking-wide">
          📋 Strategic Recommendations
        </p>
        <ul className="mt-2 space-y-1.5">
          {recommendations.map((rec) => (
            <li key={rec} className="text-xs leading-relaxed text-[#A0A8B8]">
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Footnote ── */}
      <p className="mt-6 text-[10px] leading-relaxed text-[#A0A8B8]/60">
        Hub partner earns ₱12/parcel — the full BodeGO fulfillment fee. Costs
        are estimates based on Central Luzon market rates (2026). Rent scaled to
        ~₱120/sqm/mo (Lamudi Pampanga data). Staff at ₱14,000/packer/mo. All
        figures pre-tax.
      </p>

      {/* CTA */}
      <a
        href="#waitlist"
        className="mt-4 inline-flex flex-col items-center rounded-full border-2 border-orange px-6 py-3 text-center transition-colors hover:bg-orange hover:text-white"
      >
        <span className="text-sm font-semibold text-orange group-hover:text-white">
          Apply for a Hub Partner Slot &rarr;
        </span>
        <span className="mt-0.5 text-[10px] text-[#A0A8B8]">
          Only 3 hub partners in the alpha phase. Central Luzon only.
        </span>
      </a>
    </div>
  );
}
