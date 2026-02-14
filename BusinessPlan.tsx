/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import TopNav from "../components/TopNav";
import RoundsStrip from "../components/RoundStrip";
import {
  HelpCircle,
  Trophy,
  Check,
  Save,
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────
type SubTab =
  | "Competitive"
  | "SWOT"
  | "Vision"
  | "Growth"
  | "Targets"
  | "Revenue Model"
  | "Risk Matrix"
  | "Moat Builder";

type CompetitiveOption = {
  id: string;
  title: string;
  desc: string;
};

type SwotData = {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
};

type VisionValue = string;

type AnsoffCell = {
  id: string;
  title: string;
  desc: string;
};

type Target = {
  id: string;
  title: string;
  desc: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  defaultVal: number;
};

type TargetSection = {
  title: string;
  description: string;
  targets: Target[];
};

type RevenueStream = {
  id: string;
  label: string;
  desc: string;
  icon: string;
};

type RevenuePriority = "primary" | "secondary" | "experimental" | "not_planned";

type Risk = {
  id: string;
  label: string;
  desc: string;
  likelihood: number;
  impact: number;
};

type MoatOption = {
  id: string;
  label: string;
  desc: string;
  category: string;
  effort: number;
  impact: number;
};

// ─── CONSTANTS ───────────────────────────────────────────

const SUB_TABS: SubTab[] = [
  "Competitive",
  "SWOT",
  "Vision",
  "Growth",
  "Targets",
  "Revenue Model",
  "Risk Matrix",
  "Moat Builder",
];

const COMPETITIVE_OPTIONS: CompetitiveOption[] = [
  {
    id: "cost",
    title: "Cost Leadership",
    desc: "Compete on price — optimize unit economics, negotiate aggressive supplier deals, run lean dark stores. Aim to be the cheapest option in every delivery zone.",
  },
  {
    id: "speed",
    title: "Speed & Convenience Leadership",
    desc: "Win on delivery speed and reliability. Invest heavily in dark store density, rider fleet, and route optimization. Be the fastest in every pin code you operate in.",
  },
  {
    id: "selection",
    title: "Selection & Quality Leadership",
    desc: "Differentiate through the widest product catalog, premium sourcing, and curated private labels. Attract customers who value variety and quality over price.",
  },
  {
    id: "experience",
    title: "Customer Experience Focus",
    desc: "Build the strongest brand loyalty through exceptional app UX, personalized recommendations, proactive support, and a subscription-first model.",
  },
  {
    id: "balanced",
    title: "Balanced Approach",
    desc: "No single extreme — aim for a competitive position across price, speed, selection, and experience. Lower risk but harder to stand out.",
  },
];

const SWOT_INIT: SwotData = {
  strengths: [
    "Fresh supply chain with direct farm-to-store sourcing",
    "AI-powered demand forecasting reducing waste by 30%",
    "Lean dark store model enabling rapid city expansion",
    "Strong technology team with deep logistics expertise",
  ],
  weaknesses: [
    "Limited brand recognition as a new entrant",
    "High cash burn during initial city launches",
    "Dependence on gig-economy riders for last-mile delivery",
    "Narrow product catalog compared to established players",
  ],
  opportunities: [
    "Growing consumer shift to instant delivery for daily essentials",
    "Tier-2 city expansion where competition is limited",
    "Private label margins 2-3× higher than branded products",
    "Government push for digital commerce and UPI adoption",
  ],
  threats: [
    "Aggressive pricing wars from well-funded competitors",
    "Rising dark store rental costs in metro cities",
    "Regulatory changes around gig worker classification",
    "Supply chain disruptions from weather or logistics bottlenecks",
  ],
};

const VISION_VALUES: VisionValue[] = [
  "10-Minute Essentials for Every Indian",
  "Empowering Local Kiranas Through Tech",
  "Zero-Waste Supply Chain",
  "Affordable Quality for All",
  "Hyperlocal Community Commerce",
  "India's Most Trusted Delivery Brand",
  "Sustainable Last-Mile Logistics",
  "AI-First Operations",
  "Rider Welfare & Fair Gig Economy",
  "Fresh From Farm to Doorstep",
  "Premium Experience at Mass Prices",
  "Carbon-Neutral Deliveries by 2030",
  "Category-Defining Private Labels",
  "Data-Driven Personalization",
];

const ANSOFF_CELLS: AnsoffCell[] = [
  {
    id: "product_dev",
    title: "Product Development",
    desc: "Launch new categories (pharmacy, electronics, beauty) and private labels in your current operating cities.",
  },
  {
    id: "diversification",
    title: "Diversification",
    desc: "Launch entirely new offerings (B2B supply, subscription boxes, white-label logistics) in new markets. High risk, high reward.",
  },
  {
    id: "penetration",
    title: "Market Penetration",
    desc: "Increase market share in current cities with current categories. Win customers through better pricing, faster delivery, or superior experience.",
  },
  {
    id: "market_dev",
    title: "Market Development",
    desc: "Take your proven grocery and essentials catalog into new Tier-2 and Tier-3 cities. Replicate what works in new geographies.",
  },
];

const TARGET_SECTIONS: Record<string, TargetSection> = {
  financial: {
    title: "Financial",
    description:
      "Drive profitability and sustainable growth. Ambitious targets earn more ranking points.",
    targets: [
      { id: "net_profit", title: "Net Profit Margin", desc: "Profit after all expenses as a % of revenue.", min: 0, max: 25, step: 1, unit: "%", defaultVal: 8 },
      { id: "revenue_growth", title: "Revenue Growth Rate", desc: "Year-over-year revenue growth.", min: 10, max: 200, step: 5, unit: "%", defaultVal: 50 },
      { id: "unit_economics", title: "Positive Unit Economics", desc: "Contribution margin per order.", min: 0, max: 50, step: 1, unit: "₹", defaultVal: 15 },
      { id: "aov", title: "Average Order Value", desc: "Target AOV across all categories.", min: 100, max: 1000, step: 10, unit: "₹", defaultVal: 400 },
    ],
  },
  customer: {
    title: "Customer",
    description: "Focus on market position, satisfaction, and retention.",
    targets: [
      { id: "market_share", title: "Market Share", desc: "Share of quick commerce orders in operating cities.", min: 1, max: 40, step: 1, unit: "%", defaultVal: 12 },
      { id: "nps", title: "Net Promoter Score", desc: "Customer satisfaction score.", min: 10, max: 80, step: 5, unit: "", defaultVal: 45 },
      { id: "retention", title: "Monthly Retention Rate", desc: "Customers who reorder within 30 days.", min: 20, max: 80, step: 5, unit: "%", defaultVal: 55 },
      { id: "delivery_time", title: "Avg Delivery Time", desc: "Target average delivery time.", min: 8, max: 30, step: 1, unit: "min", defaultVal: 14 },
    ],
  },
  operations: {
    title: "Operations",
    description: "Ensure efficiency and scalability.",
    targets: [
      { id: "fill_rate", title: "Order Fill Rate", desc: "Orders fulfilled without substitution.", min: 80, max: 100, step: 1, unit: "%", defaultVal: 95 },
      { id: "wastage", title: "Perishable Wastage Rate", desc: "% of perishable inventory wasted.", min: 0, max: 15, step: 1, unit: "%", defaultVal: 5 },
    ],
  },
  growth: {
    title: "Learn & Growth",
    description: "Build long-term advantage through talent and innovation.",
    targets: [
      { id: "rider_retention", title: "Rider Retention Rate", desc: "Riders retained month-over-month.", min: 40, max: 95, step: 5, unit: "%", defaultVal: 70 },
      { id: "tech_adoption", title: "Tech Feature Adoption", desc: "Orders using AI recommendations.", min: 5, max: 60, step: 5, unit: "%", defaultVal: 25 },
    ],
  },
};

const REVENUE_STREAMS: RevenueStream[] = [
  { id: "delivery_fee", label: "Delivery Fee", desc: "Charge per order for delivery service", icon: "🚚" },
  { id: "product_margin", label: "Product Margins", desc: "Mark-up on goods sold through your platform", icon: "📦" },
  { id: "private_label", label: "Private Label Sales", desc: "Higher-margin in-house branded products", icon: "🏷️" },
  { id: "subscription", label: "Subscription / Membership", desc: "Monthly fee for free delivery & perks", icon: "💳" },
  { id: "advertising", label: "In-App Advertising", desc: "Brands pay for promoted placement in search & categories", icon: "📢" },
  { id: "data_insights", label: "Data & Insights", desc: "Sell anonymized consumer trend data to FMCG brands", icon: "📊" },
  { id: "dark_store_rental", label: "Dark Store as a Service", desc: "Rent excess dark store capacity to other businesses", icon: "🏪" },
  { id: "logistics_api", label: "Last-Mile Logistics API", desc: "Offer your delivery fleet as a service to D2C brands", icon: "🔌" },
];

const PRIORITY_STYLES: Record<RevenuePriority, { label: string; cls: string }> = {
  primary: { label: "Primary", cls: "bg-blue-100 text-blue-700 border-blue-300" },
  secondary: { label: "Secondary", cls: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  experimental: { label: "Experimental", cls: "bg-amber-100 text-amber-700 border-amber-300" },
  not_planned: { label: "Not Planned", cls: "bg-slate-100 text-slate-500 border-slate-200" },
};

const RISKS: Risk[] = [
  { id: "funding", label: "Funding Crunch", desc: "Unable to raise next round; forced to cut burn", likelihood: 3, impact: 5 },
  { id: "price_war", label: "Price War Escalation", desc: "Competitors slash prices below cost for sustained period", likelihood: 4, impact: 4 },
  { id: "regulation", label: "Regulatory Disruption", desc: "New gig worker laws or FSSAI rules increase compliance cost", likelihood: 3, impact: 3 },
  { id: "supply_chain", label: "Supply Chain Failure", desc: "Key supplier defaults or perishable cold chain breaks", likelihood: 2, impact: 4 },
  { id: "tech_outage", label: "Platform Outage", desc: "App or backend goes down during peak hours", likelihood: 2, impact: 5 },
  { id: "rider_churn", label: "Mass Rider Attrition", desc: "Competitors poach riders with higher incentives", likelihood: 4, impact: 3 },
  { id: "demand_shift", label: "Consumer Behaviour Shift", desc: "Users shift back to offline or a new model emerges", likelihood: 2, impact: 3 },
  { id: "data_breach", label: "Data / Security Breach", desc: "Customer data leak damages brand trust", likelihood: 1, impact: 5 },
];

const MOAT_OPTIONS: MoatOption[] = [
  { id: "network_density", label: "Dark Store Density", desc: "More stores = faster delivery = more orders = revenue to fund more stores.", category: "Network Effects", effort: 5, impact: 5 },
  { id: "rider_loyalty", label: "Rider Loyalty Program", desc: "Guaranteed hours, insurance, upskilling. Happy riders = reliable delivery.", category: "Switching Costs", effort: 3, impact: 3 },
  { id: "private_labels", label: "Private Label Portfolio", desc: "Exclusive brands customers can't get elsewhere. Higher margins and lock-in.", category: "Brand", effort: 4, impact: 4 },
  { id: "ai_personalization", label: "AI Personalization Engine", desc: "Recommendation system that gets smarter with each order.", category: "Data Advantage", effort: 4, impact: 4 },
  { id: "subscription_base", label: "Subscription User Base", desc: "Recurring revenue + predictable demand. Subscribers order 3× more.", category: "Switching Costs", effort: 3, impact: 5 },
  { id: "supplier_exclusives", label: "Exclusive Supplier Contracts", desc: "Lock in best-quality or lowest-cost supply competitors can't access.", category: "Cost Advantage", effort: 4, impact: 3 },
  { id: "hyperlocal_data", label: "Hyperlocal Demand Intelligence", desc: "Pin-code level prediction. Reduces waste, optimizes inventory.", category: "Data Advantage", effort: 5, impact: 4 },
  { id: "community_trust", label: "Community & Trust Brand", desc: "Local ambassadors, farmer stories, transparent sourcing.", category: "Brand", effort: 2, impact: 3 },
];

// ─── REUSABLE COMPONENTS ─────────────────────────────────

function AdvisorCard() {
  return (
    <div className="hidden md:flex flex-col items-center bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 shrink-0">
      <div className="w-12 h-12 bg-slate-300 rounded-full mb-2" />
      <span className="text-xs font-semibold text-slate-900">Strategy Advisor</span>
      <span className="text-[10px] text-slate-500">Quick Commerce Expert</span>
    </div>
  );
}

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm"
    >
      <Save className="w-[18px] h-[18px]" />
      Save
    </button>
  );
}

function NoteArea({
  value,
  onChange,
  placeholder,
  label = "Elaborate on your decision",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  label?: string;
}) {
  return (
    <div className="mt-6">
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none transition"
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export default function BusinessPlan() {
  const [activeTab, setActiveTab] = useState<SubTab>("Competitive");

  // Competitive
  const [selectedStrategy, setSelectedStrategy] = useState("speed");
  const [competitiveNote, setCompetitiveNote] = useState("");

  // SWOT
  const [swotNote, setSwotNote] = useState("");

  // Vision
  const [selectedValues, setSelectedValues] = useState<Set<string>>(
    new Set(["10-Minute Essentials for Every Indian", "Zero-Waste Supply Chain", "AI-First Operations"])
  );
  const [missionStatement, setMissionStatement] = useState("");

  // Growth
  const [selectedGrowth, setSelectedGrowth] = useState("penetration");
  const [growthNote, setGrowthNote] = useState("");

  // Targets
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(
    new Set(["net_profit", "market_share", "nps", "fill_rate", "rider_retention"])
  );
  const [targetValues, setTargetValues] = useState<Record<string, number>>({});
  const [kpiTargets, setKpiTargets] = useState<Set<string>>(new Set(["market_share"]));

  // Revenue Model
  const [revenuePriorities, setRevenuePriorities] = useState<Record<string, RevenuePriority>>({
    delivery_fee: "primary",
    product_margin: "primary",
    private_label: "secondary",
    subscription: "experimental",
  });
  const [revenueNote, setRevenueNote] = useState("");

  // Risk Matrix
  const [riskMitigations, setRiskMitigations] = useState<Record<string, string>>({});
  const [topRisks, setTopRisks] = useState<Set<string>>(new Set(["price_war", "rider_churn", "funding"]));

  // Moat Builder
  const [selectedMoats, setSelectedMoats] = useState<Set<string>>(
    new Set(["network_density", "ai_personalization", "subscription_base"])
  );
  const [moatNote, setMoatNote] = useState("");

  // Save toast
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Toggles
  const toggleValue = (val: string) => {
    setSelectedValues((prev) => {
      const next = new Set(prev);
      if (next.has(val)) next.delete(val);
      else if (next.size < 3) next.add(val);
      return next;
    });
  };

  const toggleTarget = (id: string) => {
    setSelectedTargets((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        const newKpi = new Set(kpiTargets);
        newKpi.delete(id);
        setKpiTargets(newKpi);
      } else if (next.size < 5) {
        next.add(id);
      }
      return next;
    });
  };

  const toggleMoat = (id: string) => {
    setSelectedMoats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 4) next.add(id);
      return next;
    });
  };

  const toggleTopRisk = (id: string) => {
    setTopRisks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id);
      return next;
    });
  };

  const getTargetVal = (t: Target) => targetValues[t.id] ?? t.defaultVal;

  // ═══════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Save toast */}
      {saved && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-bounce">
          <Check className="w-[18px] h-[18px]" /> Saved successfully
        </div>
      )}

      <div className="max-w-7xl mx-auto py-4">
        <TopNav />

        {/* Round header */}
        <div className="mt-4 bg-white border border-slate-200 rounded-lg shadow-sm px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900">Round 1 of 8</h2>
              <p className="text-sm text-slate-600 mt-1">
                Foundation: Fruits, dairy, cooking staples, snacks, beverages
              </p>
              <div className="mt-3">
                <RoundsStrip currentRound={1} maxRounds={8} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-md transition">
                <HelpCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Game Guide</span>
              </button>
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-slate-900">0 pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Business Plan</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Define your company's strategic direction and long-term goals
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1.5 mb-6 overflow-x-auto shadow-sm">
          {SUB_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ════════════ COMPETITIVE ════════════ */}
        {activeTab === "Competitive" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="max-w-2xl">
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Competitive Strategy</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    How will you differentiate against Blinkit, Zepto, and Swiggy Instamart? This influences scoring
                    multipliers across all decision areas.
                  </p>
                </div>
                <AdvisorCard />
              </div>

              <p className="text-sm font-semibold text-slate-700 mb-4">
                How will you compete against the market leaders?
              </p>

              <div className="space-y-3">
                {COMPETITIVE_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedStrategy === opt.id
                        ? "border-blue-600 bg-blue-50/50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                        selectedStrategy === opt.id ? "border-blue-600 bg-blue-600" : "border-slate-300"
                      }`}
                    >
                      {selectedStrategy === opt.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <input
                        type="radio"
                        className="sr-only"
                        checked={selectedStrategy === opt.id}
                        onChange={() => setSelectedStrategy(opt.id)}
                      />
                      <p className="text-sm font-bold text-slate-900 mb-1">{opt.title}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <NoteArea
                value={competitiveNote}
                onChange={(e) => setCompetitiveNote(e.target.value)}
                placeholder="Explain why this competitive strategy fits your plan…"
              />
            </div>
            <SaveButton onClick={handleSave} />
          </div>
        )}

        {/* ════════════ SWOT ════════════ */}
        {activeTab === "SWOT" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="max-w-2xl">
                  <h2 className="text-lg font-bold text-slate-900 mb-2">SWOT Analysis</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Assess internal strengths & weaknesses and external opportunities & threats to align decisions with
                    market realities.
                  </p>
                </div>
                <AdvisorCard />
              </div>

              <p className="text-center text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">
                Strength, Weakness, Opportunity & Threat Analysis
              </p>

              {/* Axis headers */}
              <div className="grid grid-cols-[auto_1fr_1fr] gap-0 mb-1">
                <div className="w-8" />
                <p className="text-center text-xs font-semibold text-slate-500">Positive</p>
                <p className="text-center text-xs font-semibold text-slate-500">Negative</p>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-[auto_1fr_1fr] gap-3">
                {/* External row */}
                <div className="flex items-center">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    External
                  </span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-emerald-800 mb-3 uppercase tracking-wider">Opportunities</h4>
                  <ul className="space-y-2">
                    {SWOT_INIT.opportunities.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                        <span className="text-xs text-slate-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-red-800 mb-3 uppercase tracking-wider">Threats</h4>
                  <ul className="space-y-2">
                    {SWOT_INIT.threats.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                        <span className="text-xs text-slate-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Internal row */}
                <div className="flex items-center">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    Internal
                  </span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-blue-800 mb-3 uppercase tracking-wider">Strengths</h4>
                  <ul className="space-y-2">
                    {SWOT_INIT.strengths.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                        <span className="text-xs text-slate-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-amber-800 mb-3 uppercase tracking-wider">Weaknesses</h4>
                  <ul className="space-y-2">
                    {SWOT_INIT.weaknesses.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                        <span className="text-xs text-slate-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <NoteArea
                value={swotNote}
                onChange={(e) => setSwotNote(e.target.value)}
                placeholder="How will you leverage strengths and address weaknesses?"
              />
            </div>
            <SaveButton onClick={handleSave} />
          </div>
        )}

        {/* ════════════ VISION ════════════ */}
        {activeTab === "Vision" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="max-w-2xl">
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Vision & Core Values</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Your vision shapes brand perception and customer loyalty multipliers. Choose three core values, then
                    write a mission statement.
                  </p>
                </div>
                <AdvisorCard />
              </div>

              <p className="text-sm font-bold text-slate-900 mb-1">
                STEP 1: Choose three core values for your company
              </p>
              <p className="text-xs text-slate-500 mb-4">{selectedValues.size}/3 selected</p>

              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {VISION_VALUES.map((val) => {
                  const active = selectedValues.has(val);
                  return (
                    <button
                      key={val}
                      onClick={() => toggleValue(val)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                        active
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <span>{val}</span>
                      {active && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>

              <p className="text-sm font-bold text-slate-900 mb-2">STEP 2: Write your mission statement</p>
              <textarea
                rows={3}
                value={missionStatement}
                onChange={(e) => setMissionStatement(e.target.value)}
                placeholder="Combine your three values into a compelling mission statement…"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none transition"
              />
            </div>
            <SaveButton onClick={handleSave} />
          </div>
        )}

        {/* ════════════ GROWTH ════════════ */}
        {activeTab === "Growth" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="max-w-2xl">
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Growth Strategy — Ansoff Matrix</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Will you deepen share, expand categories, enter new cities, or diversify? Your choice shapes capital
                    allocation and risk.
                  </p>
                </div>
                <AdvisorCard />
              </div>

              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Growth Strategy</h3>

              {/* Column headers */}
              <div className="flex gap-3 mb-1">
                <div className="w-8 shrink-0" />
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <p className="text-center text-xs font-semibold text-slate-500">Existing market</p>
                  <p className="text-center text-xs font-semibold text-slate-500">New market</p>
                </div>
              </div>

              {/* Row: New product */}
              <div className="flex gap-3 mb-3">
                <div className="w-8 shrink-0 flex items-center justify-center">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    New product
                  </span>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  {[ANSOFF_CELLS[0], ANSOFF_CELLS[1]].map((cell) => {
                    const sel = selectedGrowth === cell.id;
                    return (
                      <button
                        key={cell.id}
                        onClick={() => setSelectedGrowth(cell.id)}
                        className={`p-5 rounded-xl border-2 text-left transition-all ${
                          sel ? "border-blue-600 bg-blue-50/60" : "border-slate-200 hover:border-slate-300"
                        }`}
                        style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center" }}
                      >
                        <h4 className="text-sm font-bold text-slate-900 mb-1.5">{cell.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{cell.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row: Existing product */}
              <div className="flex gap-3">
                <div className="w-8 shrink-0 flex items-center justify-center">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    Existing product
                  </span>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  {[ANSOFF_CELLS[2], ANSOFF_CELLS[3]].map((cell) => {
                    const sel = selectedGrowth === cell.id;
                    return (
                      <button
                        key={cell.id}
                        onClick={() => setSelectedGrowth(cell.id)}
                        className={`p-5 rounded-xl border-2 text-left transition-all ${
                          sel ? "border-blue-600 bg-blue-50/60" : "border-slate-200 hover:border-slate-300"
                        }`}
                        style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center" }}
                      >
                        <h4 className="text-sm font-bold text-slate-900 mb-1.5">{cell.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{cell.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <NoteArea
                value={growthNote}
                onChange={(e) => setGrowthNote(e.target.value)}
                placeholder="Why does this growth strategy fit your current position?"
              />
            </div>
            <SaveButton onClick={handleSave} />
          </div>
        )}

        {/* ════════════ TARGETS ════════════ */}
        {activeTab === "Targets" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="max-w-2xl">
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Strategic Targets</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Choose 5 targets and set their level. Pick one as your KPI for 5× scoring.
                  </p>
                </div>
                <AdvisorCard />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 text-xs text-blue-700 font-medium">
                {selectedTargets.size}/5 targets selected · {kpiTargets.size}/1 KPI assigned
              </div>

              {Object.entries(TARGET_SECTIONS).map(([key, section]) => (
                <div key={key} className="mb-8 last:mb-0">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-1">
                      {section.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-5">{section.description}</p>

                    <div className="space-y-4">
                      {section.targets.map((t) => {
                        const isSel = selectedTargets.has(t.id);
                        const isKPI = kpiTargets.has(t.id);
                        const val = getTargetVal(t);

                        return (
                          <div
                            key={t.id}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              isSel ? "border-blue-300 bg-white" : "border-slate-200 bg-white/50 opacity-70"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleTarget(t.id)}
                                className={`w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                                  isSel ? "border-blue-600 bg-blue-600" : "border-slate-300"
                                }`}
                              >
                                {isSel && <Check className="w-3 h-3 text-white" />}
                              </button>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900">{t.title}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>

                                {isSel && (
                                  <div className="mt-3">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs text-slate-400">
                                        {t.min}
                                        {t.unit}
                                      </span>
                                      <span className="text-sm font-bold text-blue-600">
                                        {val}
                                        {t.unit}
                                      </span>
                                      <span className="text-xs text-slate-400">
                                        {t.max}
                                        {t.unit}
                                      </span>
                                    </div>
                                    <input
                                      type="range"
                                      min={t.min}
                                      max={t.max}
                                      step={t.step}
                                      value={val}
                                      onChange={(e) =>
                                        setTargetValues({ ...targetValues, [t.id]: Number(e.target.value) })
                                      }
                                      className="w-full"
                                    />
                                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                      <button
                                        onClick={() =>
                                          isKPI ? setKpiTargets(new Set()) : setKpiTargets(new Set([t.id]))
                                        }
                                        className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                          isKPI ? "border-amber-500 bg-amber-500" : "border-slate-300"
                                        }`}
                                      >
                                        {isKPI && <Check className="w-[10px] h-[10px] text-white" />}
                                      </button>
                                      <span
                                        className={`text-xs font-semibold ${
                                          isKPI ? "text-amber-600" : "text-slate-500"
                                        }`}
                                      >
                                        This target is a KPI (5× points)
                                      </span>
                                    </label>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <SaveButton onClick={handleSave} />
          </div>
        )}

        {/* ════════════ REVENUE MODEL ════════════ */}
        {activeTab === "Revenue Model" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="max-w-2xl">
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Revenue Model</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Quick commerce isn't just about selling groceries. Classify each revenue stream by priority — this
                    influences capital allocation and financial scoring.
                  </p>
                </div>
                <AdvisorCard />
              </div>

              <p className="text-sm font-bold text-slate-900 mb-4">Assign a priority to each revenue stream</p>

              <div className="space-y-3">
                {REVENUE_STREAMS.map((stream) => {
                  const current: RevenuePriority = revenuePriorities[stream.id] || "not_planned";
                  return (
                    <div key={stream.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-2xl">{stream.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900">{stream.label}</p>
                          <p className="text-xs text-slate-500">{stream.desc}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-9">
                        {(Object.entries(PRIORITY_STYLES) as [RevenuePriority, { label: string; cls: string }][]).map(
                          ([priority, style]) => {
                            const active = current === priority;
                            return (
                              <button
                                key={priority}
                                onClick={() =>
                                  setRevenuePriorities({ ...revenuePriorities, [stream.id]: priority })
                                }
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                  active
                                    ? style.cls + " border-current shadow-sm"
                                    : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                                }`}
                              >
                                {style.label}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <NoteArea
                value={revenueNote}
                onChange={(e) => setRevenueNote(e.target.value)}
                placeholder="Which streams drive profitability early vs. long-term?"
                label="Explain your revenue strategy"
              />
            </div>
            <SaveButton onClick={handleSave} />
          </div>
        )}

        {/* ════════════ RISK MATRIX ════════════ */}
        {activeTab === "Risk Matrix" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="max-w-2xl">
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Risk Assessment</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Select the 3 most critical risks and write a mitigation plan for each. Well-mitigated risks reduce
                    negative event impacts during the simulation.
                  </p>
                </div>
                <AdvisorCard />
              </div>

              <p className="text-xs text-blue-700 font-medium bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6">
                {topRisks.size}/3 critical risks selected
              </p>

              <div className="space-y-3">
                {RISKS.map((risk) => {
                  const sel = topRisks.has(risk.id);
                  return (
                    <div
                      key={risk.id}
                      className={`rounded-xl border-2 transition-all overflow-hidden ${
                        sel ? "border-red-300 bg-white" : "border-slate-200"
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTopRisk(risk.id)}
                            className={`w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                              sel ? "border-red-500 bg-red-500" : "border-slate-300"
                            }`}
                          >
                            {sel && <Check className="w-3 h-3 text-white" />}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-bold text-slate-900">{risk.label}</p>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="text-slate-500">
                                  Likelihood:{" "}
                                  <span className="font-bold text-slate-700">
                                    {"●".repeat(risk.likelihood)}
                                    {"○".repeat(5 - risk.likelihood)}
                                  </span>
                                </span>
                                <span className="text-slate-500">
                                  Impact:{" "}
                                  <span className="font-bold text-slate-700">
                                    {"●".repeat(risk.impact)}
                                    {"○".repeat(5 - risk.impact)}
                                  </span>
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{risk.desc}</p>
                          </div>
                        </div>
                      </div>

                      {sel && (
                        <div className="bg-red-50 border-t border-red-200 px-4 py-3">
                          <label className="block text-xs font-semibold text-red-700 mb-1.5">
                            Your mitigation plan
                          </label>
                          <textarea
                            rows={2}
                            value={riskMitigations[risk.id] || ""}
                            onChange={(e) =>
                              setRiskMitigations({ ...riskMitigations, [risk.id]: e.target.value })
                            }
                            placeholder="How will you prepare for or prevent this?"
                            className="w-full px-3 py-2 border border-red-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-300 resize-none bg-white"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <SaveButton onClick={handleSave} />
          </div>
        )}

        {/* ════════════ MOAT BUILDER ════════════ */}
        {activeTab === "Moat Builder" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="max-w-2xl">
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Moat Builder</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    What makes your business defensible? Select up to 4 competitive moats to invest in. These compound
                    over rounds and create advantages competitors can't easily replicate.
                  </p>
                </div>
                <AdvisorCard />
              </div>

              <p className="text-xs text-blue-700 font-medium bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6">
                {selectedMoats.size}/4 moats selected
              </p>

              <div className="grid md:grid-cols-2 gap-3">
                {MOAT_OPTIONS.map((moat) => {
                  const sel = selectedMoats.has(moat.id);
                  return (
                    <button
                      key={moat.id}
                      onClick={() => toggleMoat(moat.id)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        sel ? "border-blue-600 bg-blue-50/50" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                              sel ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {moat.category}
                          </span>
                          <p className="text-sm font-bold text-slate-900">{moat.label}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                            sel ? "border-blue-600 bg-blue-600" : "border-slate-300"
                          }`}
                        >
                          {sel && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-3">{moat.desc}</p>

                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <span className="font-semibold">Effort:</span>
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < moat.effort ? "bg-amber-400" : "bg-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <span className="font-semibold">Impact:</span>
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < moat.impact ? "bg-emerald-400" : "bg-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <NoteArea
                value={moatNote}
                onChange={(e) => setMoatNote(e.target.value)}
                placeholder="How do your chosen moats reinforce each other?"
                label="Explain your moat strategy"
              />
            </div>
            <SaveButton onClick={handleSave} />
          </div>
        )}
      </div>
    </div>
  );
}
