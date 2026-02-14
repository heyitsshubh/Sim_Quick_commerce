import { useState } from "react";

/* ── Inline icons ── */
const I = ({ d, className = "", size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d={d} /></svg>
);
const Trophy = (p) => <I {...p} d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />;
const HelpCircle = (p) => <I {...p} d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />;
const Lock = (p) => <I {...p} d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2ZM7 11V7a5 5 0 0 1 10 0v4" />;
const Unlock = (p) => <I {...p} d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2ZM8 11V7a4 4 0 0 1 8 0" />;
const Check = (p) => <I {...p} d="M20 6 9 17l-5-5" />;
const Save = (p) => <I {...p} d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2ZM17 21v-8H7v8M7 3v5h8" />;

const NAV_TABS = [
  { name: "Profile", active: false },
  { name: "Business Plan", active: true },
  { name: "Decisions", active: false },
  { name: "Results", active: false },
  { name: "Analysis", active: false },
  { name: "Communication", active: false },
];

const SUB_TABS = ["Competitive", "SWOT", "Vision", "Growth", "Targets", "Revenue Model", "Risk Matrix", "Moat Builder"];

/* ══════════════════════════════════════════ DATA ══════════════════════════════════════════ */

const COMPETITIVE_OPTIONS = [
  { id: "cost", title: "Cost Leadership", desc: "Compete on price — optimize unit economics, negotiate aggressive supplier deals, run lean dark stores. Aim to be the cheapest option in every delivery zone." },
  { id: "speed", title: "Speed & Convenience Leadership", desc: "Win on delivery speed and reliability. Invest heavily in dark store density, rider fleet, and route optimization. Be the fastest in every pin code you operate in." },
  { id: "selection", title: "Selection & Quality Leadership", desc: "Differentiate through the widest product catalog, premium sourcing, and curated private labels. Attract customers who value variety and quality over price." },
  { id: "experience", title: "Customer Experience Focus", desc: "Build the strongest brand loyalty through exceptional app UX, personalized recommendations, proactive support, and a subscription-first model." },
  { id: "balanced", title: "Balanced Approach", desc: "No single extreme — aim for a competitive position across price, speed, selection, and experience. Lower risk but harder to stand out." },
];

const SWOT_INIT = {
  strengths: ["Fresh supply chain with direct farm-to-store sourcing", "AI-powered demand forecasting reducing waste by 30%", "Lean dark store model enabling rapid city expansion", "Strong technology team with deep logistics expertise"],
  weaknesses: ["Limited brand recognition as a new entrant", "High cash burn during initial city launches", "Dependence on gig-economy riders for last-mile delivery", "Narrow product catalog compared to established players"],
  opportunities: ["Growing consumer shift to instant delivery for daily essentials", "Tier-2 city expansion where competition is limited", "Private label margins 2-3× higher than branded products", "Government push for digital commerce and UPI adoption"],
  threats: ["Aggressive pricing wars from well-funded competitors", "Rising dark store rental costs in metro cities", "Regulatory changes around gig worker classification", "Supply chain disruptions from weather or logistics bottlenecks"],
};

const VISION_VALUES = ["10-Minute Essentials for Every Indian", "Empowering Local Kiranas Through Tech", "Zero-Waste Supply Chain", "Affordable Quality for All", "Hyperlocal Community Commerce", "India's Most Trusted Delivery Brand", "Sustainable Last-Mile Logistics", "AI-First Operations", "Rider Welfare & Fair Gig Economy", "Fresh From Farm to Doorstep", "Premium Experience at Mass Prices", "Carbon-Neutral Deliveries by 2030", "Category-Defining Private Labels", "Data-Driven Personalization"];

const ANSOFF_CELLS = [
  { id: "product_dev", title: "Product Development", desc: "Launch new categories (pharmacy, electronics, beauty) and private labels in your current operating cities." },
  { id: "diversification", title: "Diversification", desc: "Launch entirely new offerings (B2B supply, subscription boxes, white-label logistics) in new markets. High risk, high reward." },
  { id: "penetration", title: "Market Penetration", desc: "Increase market share in current cities with current categories. Win customers through better pricing, faster delivery, or superior experience." },
  { id: "market_dev", title: "Market Development", desc: "Take your proven grocery and essentials catalog into new Tier-2 and Tier-3 cities. Replicate what works in new geographies." },
];

const TARGET_SECTIONS = {
  financial: { title: "Financial", description: "Drive profitability and sustainable growth. Ambitious targets earn more ranking points.", targets: [
    { id: "net_profit", title: "Net Profit Margin", desc: "Profit after all expenses as a % of revenue.", min: 0, max: 25, step: 1, unit: "%", defaultVal: 8 },
    { id: "revenue_growth", title: "Revenue Growth Rate", desc: "Year-over-year revenue growth.", min: 10, max: 200, step: 5, unit: "%", defaultVal: 50 },
    { id: "unit_economics", title: "Positive Unit Economics", desc: "Contribution margin per order.", min: 0, max: 50, step: 1, unit: "₹", defaultVal: 15 },
    { id: "aov", title: "Average Order Value", desc: "Target AOV across all categories.", min: 100, max: 1000, step: 10, unit: "₹", defaultVal: 400 },
  ]},
  customer: { title: "Customer", description: "Focus on market position, satisfaction, and retention.", targets: [
    { id: "market_share", title: "Market Share", desc: "Share of quick commerce orders in operating cities.", min: 1, max: 40, step: 1, unit: "%", defaultVal: 12 },
    { id: "nps", title: "Net Promoter Score", desc: "Customer satisfaction score.", min: 10, max: 80, step: 5, unit: "", defaultVal: 45 },
    { id: "retention", title: "Monthly Retention Rate", desc: "Customers who reorder within 30 days.", min: 20, max: 80, step: 5, unit: "%", defaultVal: 55 },
    { id: "delivery_time", title: "Avg Delivery Time", desc: "Target average delivery time.", min: 8, max: 30, step: 1, unit: "min", defaultVal: 14 },
  ]},
  operations: { title: "Operations", description: "Ensure efficiency and scalability.", targets: [
    { id: "fill_rate", title: "Order Fill Rate", desc: "Orders fulfilled without substitution.", min: 80, max: 100, step: 1, unit: "%", defaultVal: 95 },
    { id: "wastage", title: "Perishable Wastage Rate", desc: "% of perishable inventory wasted.", min: 0, max: 15, step: 1, unit: "%", defaultVal: 5 },
  ]},
  growth: { title: "Learn & Growth", description: "Build long-term advantage through talent and innovation.", targets: [
    { id: "rider_retention", title: "Rider Retention Rate", desc: "Riders retained month-over-month.", min: 40, max: 95, step: 5, unit: "%", defaultVal: 70 },
    { id: "tech_adoption", title: "Tech Feature Adoption", desc: "Orders using AI recommendations.", min: 5, max: 60, step: 5, unit: "%", defaultVal: 25 },
  ]},
};

const REVENUE_STREAMS = [
  { id: "delivery_fee", label: "Delivery Fee", desc: "Charge per order for delivery service", icon: "🚚" },
  { id: "product_margin", label: "Product Margins", desc: "Mark-up on goods sold through your platform", icon: "📦" },
  { id: "private_label", label: "Private Label Sales", desc: "Higher-margin in-house branded products", icon: "🏷️" },
  { id: "subscription", label: "Subscription / Membership", desc: "Monthly fee for free delivery & perks", icon: "💳" },
  { id: "advertising", label: "In-App Advertising", desc: "Brands pay for promoted placement in search & categories", icon: "📢" },
  { id: "data_insights", label: "Data & Insights", desc: "Sell anonymized consumer trend data to FMCG brands", icon: "📊" },
  { id: "dark_store_rental", label: "Dark Store as a Service", desc: "Rent excess dark store capacity to other businesses", icon: "🏪" },
  { id: "logistics_api", label: "Last-Mile Logistics API", desc: "Offer your delivery fleet as a service to D2C brands", icon: "🔌" },
];

const PRIORITY_STYLES = {
  primary: { label: "Primary", cls: "bg-blue-100 text-blue-700 border-blue-300" },
  secondary: { label: "Secondary", cls: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  experimental: { label: "Experimental", cls: "bg-amber-100 text-amber-700 border-amber-300" },
  not_planned: { label: "Not Planned", cls: "bg-slate-100 text-slate-500 border-slate-200" },
};

const RISKS = [
  { id: "funding", label: "Funding Crunch", desc: "Unable to raise next round; forced to cut burn", likelihood: 3, impact: 5 },
  { id: "price_war", label: "Price War Escalation", desc: "Competitors slash prices below cost for sustained period", likelihood: 4, impact: 4 },
  { id: "regulation", label: "Regulatory Disruption", desc: "New gig worker laws or FSSAI rules increase compliance cost", likelihood: 3, impact: 3 },
  { id: "supply_chain", label: "Supply Chain Failure", desc: "Key supplier defaults or perishable cold chain breaks", likelihood: 2, impact: 4 },
  { id: "tech_outage", label: "Platform Outage", desc: "App or backend goes down during peak hours", likelihood: 2, impact: 5 },
  { id: "rider_churn", label: "Mass Rider Attrition", desc: "Competitors poach riders with higher incentives", likelihood: 4, impact: 3 },
  { id: "demand_shift", label: "Consumer Behaviour Shift", desc: "Users shift back to offline or a new model emerges", likelihood: 2, impact: 3 },
  { id: "data_breach", label: "Data / Security Breach", desc: "Customer data leak damages brand trust", likelihood: 1, impact: 5 },
];

const MOAT_OPTIONS = [
  { id: "network_density", label: "Dark Store Density", desc: "More stores = faster delivery = more orders = revenue to fund more stores.", category: "Network Effects", effort: 5, impact: 5 },
  { id: "rider_loyalty", label: "Rider Loyalty Program", desc: "Guaranteed hours, insurance, upskilling. Happy riders = reliable delivery.", category: "Switching Costs", effort: 3, impact: 3 },
  { id: "private_labels", label: "Private Label Portfolio", desc: "Exclusive brands customers can't get elsewhere. Higher margins and lock-in.", category: "Brand", effort: 4, impact: 4 },
  { id: "ai_personalization", label: "AI Personalization Engine", desc: "Recommendation system that gets smarter with each order.", category: "Data Advantage", effort: 4, impact: 4 },
  { id: "subscription_base", label: "Subscription User Base", desc: "Recurring revenue + predictable demand. Subscribers order 3× more.", category: "Switching Costs", effort: 3, impact: 5 },
  { id: "supplier_exclusives", label: "Exclusive Supplier Contracts", desc: "Lock in best-quality or lowest-cost supply competitors can't access.", category: "Cost Advantage", effort: 4, impact: 3 },
  { id: "hyperlocal_data", label: "Hyperlocal Demand Intelligence", desc: "Pin-code level prediction. Reduces waste, optimizes inventory.", category: "Data Advantage", effort: 5, impact: 4 },
  { id: "community_trust", label: "Community & Trust Brand", desc: "Local ambassadors, farmer stories, transparent sourcing.", category: "Brand", effort: 2, impact: 3 },
];

/* ══════════════════════════════════════════ COMPONENT ══════════════════════════════════════════ */
export default function BusinessPlanPreview() {
  const [activeTab, setActiveTab] = useState("Competitive");
  const [selectedStrategy, setSelectedStrategy] = useState("speed");
  const [competitiveNote, setCompetitiveNote] = useState("");
  const [swotNote, setSwotNote] = useState("");
  const [selectedValues, setSelectedValues] = useState(new Set(["10-Minute Essentials for Every Indian", "Zero-Waste Supply Chain", "AI-First Operations"]));
  const [missionStatement, setMissionStatement] = useState("");
  const [selectedGrowth, setSelectedGrowth] = useState("penetration");
  const [growthNote, setGrowthNote] = useState("");
  const [selectedTargets, setSelectedTargets] = useState(new Set(["net_profit", "market_share", "nps", "fill_rate", "rider_retention"]));
  const [targetValues, setTargetValues] = useState({});
  const [kpiTargets, setKpiTargets] = useState(new Set(["market_share"]));
  const [revenuePriorities, setRevenuePriorities] = useState({ delivery_fee: "primary", product_margin: "primary", private_label: "secondary", subscription: "experimental" });
  const [revenueNote, setRevenueNote] = useState("");
  const [riskMitigations, setRiskMitigations] = useState({});
  const [topRisks, setTopRisks] = useState(new Set(["price_war", "rider_churn", "funding"]));
  const [selectedMoats, setSelectedMoats] = useState(new Set(["network_density", "ai_personalization", "subscription_base"]));
  const [moatNote, setMoatNote] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const toggleValue = (v) => setSelectedValues((p) => { const n = new Set(p); n.has(v) ? n.delete(v) : n.size < 3 && n.add(v); return n; });
  const toggleTarget = (id) => setSelectedTargets((p) => { const n = new Set(p); if (n.has(id)) { n.delete(id); kpiTargets.delete(id); } else if (n.size < 5) n.add(id); return n; });
  const toggleMoat = (id) => setSelectedMoats((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.size < 4 && n.add(id); return n; });
  const toggleTopRisk = (id) => setTopRisks((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.size < 3 && n.add(id); return n; });
  const getVal = (t) => targetValues[t.id] ?? t.defaultVal;

  const Advisor = () => (<div className="hidden md:flex flex-col items-center bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 shrink-0"><div className="w-12 h-12 bg-slate-300 rounded-full mb-2" /><span className="text-xs font-semibold text-slate-900">Strategy Advisor</span><span className="text-[10px] text-slate-500">Quick Commerce Expert</span></div>);
  const Btn = () => (<button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm"><Save size={18} />Save</button>);
  const TA = ({ value, onChange, placeholder }) => (<textarea rows={3} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none transition" />);

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {saved && <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-bounce"><Check size={18} /> Saved successfully</div>}

      <div className="max-w-5xl mx-auto py-4 px-4">
        <div className="flex justify-center"><div className="flex items-center gap-2 px-3 py-3 rounded-2xl bg-white/70 border border-white/40 shadow-sm overflow-x-auto">
          {NAV_TABS.map((t) => (<button key={t.name} className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${t.active ? "text-white" : "text-black hover:text-blue-600"}`}>{t.active && <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 shadow-lg" />}<span className="relative z-10">{t.name}</span></button>))}
        </div></div>
        <div className="mt-4 bg-white border border-slate-200 rounded-lg shadow-sm px-4 py-4">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900">Round 1 of 8</h2>
              <p className="text-sm text-slate-600 mt-1">Foundation: Fruits, dairy, cooking staples, snacks, beverages</p>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 mt-3">{Array.from({length:8},(_,i)=>i+1).map((r)=>(<div key={r} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${r===1?"bg-blue-600 text-white":"bg-slate-100 text-slate-400"}`}>{r<=1?<Unlock size={14}/>:<Lock size={14}/>} Round {r}</div>))}</div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-md text-sm transition"><HelpCircle size={18} /><span className="hidden sm:inline">Game Guide</span></button>
              <div className="flex items-center gap-2 text-sm"><Trophy size={18} className="text-amber-500" /><span className="font-semibold text-slate-900">0 pts</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6"><h1 className="text-2xl font-bold text-slate-900">Business Plan</h1><p className="text-sm text-slate-500 mt-0.5">Define your company's strategic direction and long-term goals</p></div>

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1.5 mb-6 overflow-x-auto shadow-sm">
          {SUB_TABS.map((tab) => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>{tab}</button>))}
        </div>

        {/* ═══ COMPETITIVE ═══ */}
        {activeTab === "Competitive" && (<div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between gap-6 mb-6"><div className="max-w-2xl"><h2 className="text-lg font-bold text-slate-900 mb-2">Competitive Strategy</h2><p className="text-sm text-slate-600 leading-relaxed">How will you differentiate against Blinkit, Zepto, and Swiggy Instamart? This influences scoring multipliers across all decision areas.</p></div><Advisor /></div>
            <p className="text-sm font-semibold text-slate-700 mb-4">How will you compete against the market leaders?</p>
            <div className="space-y-3">{COMPETITIVE_OPTIONS.map((o) => (<label key={o.id} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedStrategy===o.id?"border-blue-600 bg-blue-50/50":"border-slate-200 hover:border-slate-300"}`}><div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${selectedStrategy===o.id?"border-blue-600 bg-blue-600":"border-slate-300"}`}>{selectedStrategy===o.id&&<Check size={12} className="text-white"/>}</div><div><input type="radio" className="sr-only" checked={selectedStrategy===o.id} onChange={()=>setSelectedStrategy(o.id)}/><p className="text-sm font-bold text-slate-900 mb-1">{o.title}</p><p className="text-xs text-slate-600 leading-relaxed">{o.desc}</p></div></label>))}</div>
            <div className="mt-6"><label className="block text-sm font-semibold text-slate-700 mb-2">Elaborate on your decision</label><TA value={competitiveNote} onChange={(e)=>setCompetitiveNote(e.target.value)} placeholder="Explain why this competitive strategy fits your plan…"/></div>
          </div><Btn />
        </div>)}

        {/* ═══ SWOT ═══ */}
        {activeTab === "SWOT" && (<div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between gap-6 mb-6"><div className="max-w-2xl"><h2 className="text-lg font-bold text-slate-900 mb-2">SWOT Analysis</h2><p className="text-sm text-slate-600 leading-relaxed">Assess internal strengths & weaknesses and external opportunities & threats to align decisions with market realities.</p></div><Advisor /></div>
            <p className="text-center text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">Strength, Weakness, Opportunity & Threat Analysis</p>
            <div className="grid grid-cols-[auto_1fr_1fr] gap-0 mb-1"><div className="w-8"/><p className="text-center text-xs font-semibold text-slate-500">Positive</p><p className="text-center text-xs font-semibold text-slate-500">Negative</p></div>
            <div className="grid grid-cols-[auto_1fr_1fr] gap-3">
              <div className="flex items-center"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest" style={{writingMode:"vertical-rl",transform:"rotate(180deg)"}}>External</span></div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4"><h4 className="text-sm font-bold text-emerald-800 mb-3 uppercase tracking-wider">Opportunities</h4><ul className="space-y-2">{SWOT_INIT.opportunities.map((x,i)=><li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"/><span className="text-xs text-slate-700 leading-relaxed">{x}</span></li>)}</ul></div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4"><h4 className="text-sm font-bold text-red-800 mb-3 uppercase tracking-wider">Threats</h4><ul className="space-y-2">{SWOT_INIT.threats.map((x,i)=><li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0"/><span className="text-xs text-slate-700 leading-relaxed">{x}</span></li>)}</ul></div>
              <div className="flex items-center"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest" style={{writingMode:"vertical-rl",transform:"rotate(180deg)"}}>Internal</span></div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4"><h4 className="text-sm font-bold text-blue-800 mb-3 uppercase tracking-wider">Strengths</h4><ul className="space-y-2">{SWOT_INIT.strengths.map((x,i)=><li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"/><span className="text-xs text-slate-700 leading-relaxed">{x}</span></li>)}</ul></div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4"><h4 className="text-sm font-bold text-amber-800 mb-3 uppercase tracking-wider">Weaknesses</h4><ul className="space-y-2">{SWOT_INIT.weaknesses.map((x,i)=><li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0"/><span className="text-xs text-slate-700 leading-relaxed">{x}</span></li>)}</ul></div>
            </div>
            <div className="mt-6"><label className="block text-sm font-semibold text-slate-700 mb-2">Elaborate on your decision</label><TA value={swotNote} onChange={(e)=>setSwotNote(e.target.value)} placeholder="How will you leverage strengths and address weaknesses?"/></div>
          </div><Btn />
        </div>)}

        {/* ═══ VISION ═══ */}
        {activeTab === "Vision" && (<div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between gap-6 mb-6"><div className="max-w-2xl"><h2 className="text-lg font-bold text-slate-900 mb-2">Vision & Core Values</h2><p className="text-sm text-slate-600 leading-relaxed">Your vision shapes brand perception and customer loyalty multipliers. Choose three core values, then write a mission statement.</p></div><Advisor /></div>
            <p className="text-sm font-bold text-slate-900 mb-1">STEP 1: Choose three core values</p><p className="text-xs text-slate-500 mb-4">{selectedValues.size}/3 selected</p>
            <div className="grid grid-cols-2 gap-2.5 mb-6">{VISION_VALUES.map((v)=>{const a=selectedValues.has(v);return(<button key={v} onClick={()=>toggleValue(v)} className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${a?"bg-blue-600 text-white shadow-sm":"bg-slate-100 text-slate-700 hover:bg-slate-200"}`}><span>{v}</span>{a&&<Check size={16}/>}</button>);})}</div>
            <p className="text-sm font-bold text-slate-900 mb-2">STEP 2: Write your mission statement</p>
            <TA value={missionStatement} onChange={(e)=>setMissionStatement(e.target.value)} placeholder="Combine your three values into a compelling mission statement…"/>
          </div><Btn />
        </div>)}

        {/* ═══ GROWTH (fixed square grid) ═══ */}
        {activeTab === "Growth" && (<div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between gap-6 mb-6"><div className="max-w-2xl"><h2 className="text-lg font-bold text-slate-900 mb-2">Growth Strategy — Ansoff Matrix</h2><p className="text-sm text-slate-600 leading-relaxed">Will you deepen share, expand categories, enter new cities, or diversify? Your choice shapes capital allocation and risk.</p></div><Advisor /></div>
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
              <div className="w-8 shrink-0 flex items-center justify-center"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap" style={{writingMode:"vertical-rl",transform:"rotate(180deg)"}}>New product</span></div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                {[ANSOFF_CELLS[0],ANSOFF_CELLS[1]].map((c)=>{const s=selectedGrowth===c.id;return(
                  <button key={c.id} onClick={()=>setSelectedGrowth(c.id)} className={`p-5 rounded-xl border-2 text-left transition-all ${s?"border-blue-600 bg-blue-50/60":"border-slate-200 hover:border-slate-300"}`} style={{aspectRatio:"1/1",display:"flex",flexDirection:"column",justifyContent:"center"}}>
                    <h4 className="text-sm font-bold text-slate-900 mb-1.5">{c.title}</h4><p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
                  </button>);})}
              </div>
            </div>

            {/* Row: Existing product */}
            <div className="flex gap-3">
              <div className="w-8 shrink-0 flex items-center justify-center"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap" style={{writingMode:"vertical-rl",transform:"rotate(180deg)"}}>Existing product</span></div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                {[ANSOFF_CELLS[2],ANSOFF_CELLS[3]].map((c)=>{const s=selectedGrowth===c.id;return(
                  <button key={c.id} onClick={()=>setSelectedGrowth(c.id)} className={`p-5 rounded-xl border-2 text-left transition-all ${s?"border-blue-600 bg-blue-50/60":"border-slate-200 hover:border-slate-300"}`} style={{aspectRatio:"1/1",display:"flex",flexDirection:"column",justifyContent:"center"}}>
                    <h4 className="text-sm font-bold text-slate-900 mb-1.5">{c.title}</h4><p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
                  </button>);})}
              </div>
            </div>

            <div className="mt-6"><label className="block text-sm font-semibold text-slate-700 mb-2">Elaborate on your decision</label><TA value={growthNote} onChange={(e)=>setGrowthNote(e.target.value)} placeholder="Why does this growth strategy fit your current position?"/></div>
          </div><Btn />
        </div>)}

        {/* ═══ TARGETS ═══ */}
        {activeTab === "Targets" && (<div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between gap-6 mb-6"><div className="max-w-2xl"><h2 className="text-lg font-bold text-slate-900 mb-2">Strategic Targets</h2><p className="text-sm text-slate-600 leading-relaxed">Choose 5 targets and set their level. Pick one as your KPI for 5× scoring.</p></div><Advisor /></div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 text-xs text-blue-700 font-medium">{selectedTargets.size}/5 targets selected · {kpiTargets.size}/1 KPI assigned</div>
            {Object.entries(TARGET_SECTIONS).map(([k,sec])=>(<div key={k} className="mb-8 last:mb-0"><div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-1">{sec.title}</h3><p className="text-xs text-slate-500 mb-5">{sec.description}</p>
              <div className="space-y-4">{sec.targets.map((t)=>{const isSel=selectedTargets.has(t.id);const isK=kpiTargets.has(t.id);const v=getVal(t);return(
                <div key={t.id} className={`p-4 rounded-xl border-2 transition-all ${isSel?"border-blue-300 bg-white":"border-slate-200 bg-white/50 opacity-70"}`}>
                  <div className="flex items-start gap-3">
                    <button onClick={()=>toggleTarget(t.id)} className={`w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center shrink-0 ${isSel?"border-blue-600 bg-blue-600":"border-slate-300"}`}>{isSel&&<Check size={12} className="text-white"/>}</button>
                    <div className="flex-1"><p className="text-sm font-bold text-slate-900">{t.title}</p><p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                      {isSel&&(<div className="mt-3"><div className="flex items-center justify-between mb-1"><span className="text-xs text-slate-400">{t.min}{t.unit}</span><span className="text-sm font-bold text-blue-600">{v}{t.unit}</span><span className="text-xs text-slate-400">{t.max}{t.unit}</span></div>
                        <input type="range" min={t.min} max={t.max} step={t.step} value={v} onChange={(e)=>setTargetValues({...targetValues,[t.id]:Number(e.target.value)})} className="w-full"/>
                        <label className="flex items-center gap-2 mt-2 cursor-pointer"><button onClick={()=>isK?setKpiTargets(new Set()):setKpiTargets(new Set([t.id]))} className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isK?"border-amber-500 bg-amber-500":"border-slate-300"}`}>{isK&&<Check size={10} className="text-white"/>}</button><span className={`text-xs font-semibold ${isK?"text-amber-600":"text-slate-500"}`}>This target is a KPI (5× points)</span></label>
                      </div>)}
                    </div>
                  </div>
                </div>);})}</div>
            </div></div>))}
          </div><Btn />
        </div>)}

        {/* ═══ REVENUE MODEL ═══ */}
        {activeTab === "Revenue Model" && (<div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between gap-6 mb-6"><div className="max-w-2xl"><h2 className="text-lg font-bold text-slate-900 mb-2">Revenue Model</h2><p className="text-sm text-slate-600 leading-relaxed">Quick commerce isn't just about selling groceries. Classify each revenue stream by priority — this influences capital allocation and financial scoring.</p></div><Advisor /></div>
            <p className="text-sm font-bold text-slate-900 mb-4">Assign a priority to each revenue stream</p>
            <div className="space-y-3">{REVENUE_STREAMS.map((s)=>{const cur=revenuePriorities[s.id]||"not_planned";return(
              <div key={s.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3"><span className="text-2xl">{s.icon}</span><div className="flex-1"><p className="text-sm font-bold text-slate-900">{s.label}</p><p className="text-xs text-slate-500">{s.desc}</p></div></div>
                <div className="flex gap-2 ml-9">{Object.entries(PRIORITY_STYLES).map(([p,st])=>{const a=cur===p;return(<button key={p} onClick={()=>setRevenuePriorities({...revenuePriorities,[s.id]:p})} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${a?st.cls+" border-current shadow-sm":"bg-white border-slate-200 text-slate-400 hover:border-slate-300"}`}>{st.label}</button>);})}</div>
              </div>);})}</div>
            <div className="mt-6"><label className="block text-sm font-semibold text-slate-700 mb-2">Explain your revenue strategy</label><TA value={revenueNote} onChange={(e)=>setRevenueNote(e.target.value)} placeholder="Which streams drive profitability early vs. long-term?"/></div>
          </div><Btn />
        </div>)}

        {/* ═══ RISK MATRIX ═══ */}
        {activeTab === "Risk Matrix" && (<div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between gap-6 mb-6"><div className="max-w-2xl"><h2 className="text-lg font-bold text-slate-900 mb-2">Risk Assessment</h2><p className="text-sm text-slate-600 leading-relaxed">Select the 3 most critical risks and write a mitigation plan for each. Well-mitigated risks reduce negative event impacts during the simulation.</p></div><Advisor /></div>
            <p className="text-xs text-blue-700 font-medium bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6">{topRisks.size}/3 critical risks selected</p>
            <div className="space-y-3">{RISKS.map((r)=>{const sel=topRisks.has(r.id);return(
              <div key={r.id} className={`rounded-xl border-2 transition-all overflow-hidden ${sel?"border-red-300 bg-white":"border-slate-200"}`}>
                <div className="p-4"><div className="flex items-start gap-3">
                  <button onClick={()=>toggleTopRisk(r.id)} className={`w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center shrink-0 ${sel?"border-red-500 bg-red-500":"border-slate-300"}`}>{sel&&<Check size={12} className="text-white"/>}</button>
                  <div className="flex-1"><div className="flex items-center justify-between"><p className="text-sm font-bold text-slate-900">{r.label}</p><div className="flex items-center gap-3 text-xs"><span className="text-slate-500">Likelihood: <span className="font-bold text-slate-700">{"●".repeat(r.likelihood)}{"○".repeat(5-r.likelihood)}</span></span><span className="text-slate-500">Impact: <span className="font-bold text-slate-700">{"●".repeat(r.impact)}{"○".repeat(5-r.impact)}</span></span></div></div><p className="text-xs text-slate-500 mt-0.5">{r.desc}</p></div>
                </div></div>
                {sel&&(<div className="bg-red-50 border-t border-red-200 px-4 py-3"><label className="block text-xs font-semibold text-red-700 mb-1.5">Your mitigation plan</label><textarea rows={2} value={riskMitigations[r.id]||""} onChange={(e)=>setRiskMitigations({...riskMitigations,[r.id]:e.target.value})} placeholder="How will you prepare for or prevent this?" className="w-full px-3 py-2 border border-red-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-300 resize-none bg-white"/></div>)}
              </div>);})}</div>
          </div><Btn />
        </div>)}

        {/* ═══ MOAT BUILDER ═══ */}
        {activeTab === "Moat Builder" && (<div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between gap-6 mb-6"><div className="max-w-2xl"><h2 className="text-lg font-bold text-slate-900 mb-2">Moat Builder</h2><p className="text-sm text-slate-600 leading-relaxed">What makes your business defensible? Select up to 4 competitive moats to invest in. These compound over rounds and create advantages competitors can't easily replicate.</p></div><Advisor /></div>
            <p className="text-xs text-blue-700 font-medium bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6">{selectedMoats.size}/4 moats selected</p>
            <div className="grid md:grid-cols-2 gap-3">{MOAT_OPTIONS.map((m)=>{const sel=selectedMoats.has(m.id);return(
              <button key={m.id} onClick={()=>toggleMoat(m.id)} className={`text-left p-4 rounded-xl border-2 transition-all ${sel?"border-blue-600 bg-blue-50/50":"border-slate-200 hover:border-slate-300"}`}>
                <div className="flex items-start justify-between gap-2 mb-2"><div><span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1.5 ${sel?"bg-blue-100 text-blue-700":"bg-slate-100 text-slate-500"}`}>{m.category}</span><p className="text-sm font-bold text-slate-900">{m.label}</p></div><div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${sel?"border-blue-600 bg-blue-600":"border-slate-300"}`}>{sel&&<Check size={12} className="text-white"/>}</div></div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{m.desc}</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500"><span className="font-semibold">Effort:</span>{Array.from({length:5},(_,i)=><span key={i} className={`w-2 h-2 rounded-full ${i<m.effort?"bg-amber-400":"bg-slate-200"}`}/>)}</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500"><span className="font-semibold">Impact:</span>{Array.from({length:5},(_,i)=><span key={i} className={`w-2 h-2 rounded-full ${i<m.impact?"bg-emerald-400":"bg-slate-200"}`}/>)}</div>
                </div>
              </button>);})}</div>
            <div className="mt-6"><label className="block text-sm font-semibold text-slate-700 mb-2">Explain your moat strategy</label><TA value={moatNote} onChange={(e)=>setMoatNote(e.target.value)} placeholder="How do your chosen moats reinforce each other?"/></div>
          </div><Btn />
        </div>)}

      </div>
    </div>
  );
}
