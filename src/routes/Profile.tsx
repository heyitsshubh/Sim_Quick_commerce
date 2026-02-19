import { useState } from "react";
import {
  User,
  Users,
  Zap,
  Trophy,
  Package,
  Truck,
  ShoppingBag,
  Heart,
  Cpu,
  Sparkles,
  Building2,
  ChevronRight,
  Plus,
  Trash2,
  Crown,
  Briefcase,
  UserCheck,
  Lock,
  Unlock,
  Store,
  DollarSign,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import TopNav from "../components/TopNav";

const DESIGNATIONS = [
  "CEO",
  "COO",
  "CMO",
  "CFO",
  "CTO",
  "VP - Operations",
  "VP - Marketing",
  "VP - Technology",
  "Head of Growth",
  "Head of Supply Chain",
  "Strategy Lead",
  "Business Analyst",
  "Product Manager",
  "Operations Manager",
];

const ROUNDS = [
  {
    round: 1,
    title: "Foundation",
    category: "Groceries & Staples",
    description: "Fruits, dairy, cooking staples, packaged food & beverages",
    icon: ShoppingBag,
    color: "blue",
    unlocked: true,
  },
  {
    round: 2,
    title: "Personal Care",
    category: "Personal Care & Household",
    description: "Personal care, baby care, cleaning supplies & pet products",
    icon: Heart,
    color: "pink",
    unlocked: false,
  },
  {
    round: 3,
    title: "Health & Pharmacy",
    category: "Pharmacy & Health",
    description: "OTC medicines, prescriptions, supplements & medical equipment",
    icon: Package,
    color: "green",
    unlocked: false,
  },
  {
    round: 4,
    title: "Food & Meals",
    category: "Ready-to-Eat & Food",
    description: "RTE meals, bakery, frozen foods & fresh meat/seafood",
    icon: Truck,
    color: "orange",
    unlocked: false,
  },
  {
    round: 5,
    title: "Electronics",
    category: "Electronics & Home",
    description: "Mobile accessories, small electronics, home & kitchen items",
    icon: Cpu,
    color: "purple",
    unlocked: false,
  },
  {
    round: 6,
    title: "Beauty & Fashion",
    category: "Beauty & Fashion",
    description: "Cosmetics, fashion accessories & footwear",
    icon: Sparkles,
    color: "rose",
    unlocked: false,
  },
  {
    round: 7,
    title: "Premium",
    category: "Premium & Specialty",
    description: "Organic, imported foods, alcohol delivery & flowers/gifts",
    icon: Crown,
    color: "amber",
    unlocked: false,
  },
  {
    round: 8,
    title: "B2B Expansion",
    category: "B2B & Expansion",
    description: "Wholesale, restaurant supply, office pantry & franchising",
    icon: Building2,
    color: "slate",
    unlocked: false,
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; light: string; badge: string }> = {
  blue:   { bg: "bg-blue-600",   text: "text-blue-600",   border: "border-blue-200",  light: "bg-blue-50",   badge: "bg-blue-100 text-blue-700" },
  pink:   { bg: "bg-pink-500",   text: "text-pink-600",   border: "border-pink-200",  light: "bg-pink-50",   badge: "bg-pink-100 text-pink-700" },
  green:  { bg: "bg-green-600",  text: "text-green-600",  border: "border-green-200", light: "bg-green-50",  badge: "bg-green-100 text-green-700" },
  orange: { bg: "bg-orange-500", text: "text-orange-600", border: "border-orange-200",light: "bg-orange-50", badge: "bg-orange-100 text-orange-700" },
  purple: { bg: "bg-purple-600", text: "text-purple-600", border: "border-purple-200",light: "bg-purple-50", badge: "bg-purple-100 text-purple-700" },
  rose:   { bg: "bg-rose-500",   text: "text-rose-600",   border: "border-rose-200",  light: "bg-rose-50",   badge: "bg-rose-100 text-rose-700" },
  amber:  { bg: "bg-amber-500",  text: "text-amber-600",  border: "border-amber-200", light: "bg-amber-50",  badge: "bg-amber-100 text-amber-700" },
  slate:  { bg: "bg-slate-700",  text: "text-slate-700",  border: "border-slate-200", light: "bg-slate-50",  badge: "bg-slate-200 text-slate-700" },
};

const DECISION_SECTIONS = [
  { icon: Store, label: "Business Model & Positioning", desc: "Choose your market focus and delivery promise" },
  { icon: Package, label: "Product Categories", desc: "Decide which SKUs & categories to stock each round" },
  { icon: Truck, label: "Delivery Fleet & Logistics", desc: "Own fleet vs 3rd party, rider count, EV mix" },
  { icon: Cpu, label: "Technology & Platform", desc: "App, warehouse tech, AI routing investments" },
  { icon: ShoppingBag, label: "Sourcing & Supply Chain", desc: "Supplier selection, lead times, quality tiers" },
  { icon: TrendingUp, label: "Marketing & Growth", desc: "Campaigns, offers, influencer & brand spend" },
  { icon: Users, label: "HR & Operations", desc: "Hire pickers, store managers, tech team" },
  { icon: DollarSign, label: "Pricing & Economics", desc: "Delivery charges, AOV targets, margin strategy" },
];

interface TeamMember {
  id: string;
  name: string;
  designation: string;
}

const Profile: React.FC = () => {
  const [companyName, setCompanyName] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "1", name: "", designation: "CEO" },
  ]);
  const [saved, setSaved] = useState(false);

  const addMember = () => {
    if (teamMembers.length >= 6) return;
    setTeamMembers([
      ...teamMembers,
      { id: Date.now().toString(), name: "", designation: "Business Analyst" },
    ]);
  };

  const removeMember = (id: string) => {
    if (teamMembers.length === 1) return;
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  const updateMember = (id: string, field: keyof TeamMember, value: string) => {
    setTeamMembers(
      teamMembers.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-4 px-4">
        <TopNav />
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-12 pt-2 space-y-6">

        {/* ── HERO BANNER ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 md:p-10 text-white">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center gap-5">
            <div className="bg-white/15 rounded-2xl p-4 w-fit backdrop-blur-sm">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">
                Quick Commerce Simulation
              </div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                Build India's Fastest Delivery Network
              </h1>
              <p className="text-blue-100 text-sm md:text-base mt-1">
                Compete like Blinkit, Zepto & Swiggy Instamart — make real strategic decisions across 8 progressive rounds.
              </p>
            </div>

            <div className="md:ml-auto flex gap-4 flex-shrink-0">
              {[
                { label: "Rounds", value: "8" },
                { label: "Decisions", value: "320+" },
                { label: "Players", value: "Multi" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-blue-200 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ABOUT THE SIMULATION ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">About This Simulation</h2>
          <p className="text-slate-500 text-sm mb-5">What you're about to experience</p>

          <p className="text-slate-700 leading-relaxed mb-5">
            You are the founding team of a quick commerce startup competing in India's hyper-competitive 
            instant delivery market. Over <strong>8 rounds</strong>, you'll grow from a simple grocery 
            delivery operation to a full-stack platform spanning electronics, pharmacy, fashion, and B2B supply.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            Every round, you'll make <strong>8 strategic decisions</strong> — from choosing your dark store 
            locations and delivery fleet to setting pricing, running marketing campaigns, and hiring the right 
            team. Your choices compound across rounds; early decisions shape the options available to you later.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <Trophy className="w-7 h-7 text-blue-600 mb-2" />
              <div className="font-semibold text-slate-900 text-sm mb-1">Compete to Win</div>
              <p className="text-xs text-slate-600">Every group plays simultaneously. The highest cumulative score at the end of Round 8 wins.</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <TrendingUp className="w-7 h-7 text-green-600 mb-2" />
              <div className="font-semibold text-slate-900 text-sm mb-1">Progressive Complexity</div>
              <p className="text-xs text-slate-600">New product categories unlock each round, increasing your strategic surface and portfolio complexity.</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <Briefcase className="w-7 h-7 text-amber-600 mb-2" />
              <div className="font-semibold text-slate-900 text-sm mb-1">Real-World Strategy</div>
              <p className="text-xs text-slate-600">Decisions mirror actual challenges faced by Blinkit, Zepto, and Swiggy Instamart in the Indian market.</p>
            </div>
          </div>
        </div>

        {/* ── DECISION SECTIONS ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">What You'll Decide Each Round</h2>
          <p className="text-slate-500 text-sm mb-5">8 strategic decision areas, every round</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DECISION_SECTIONS.map((section, i) => {
              const Icon = section.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{section.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{section.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ROUND PROGRESSION ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Round Progression</h2>
          <p className="text-slate-500 text-sm mb-6">A new category unlocks every round — expand your portfolio strategically</p>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-slate-100 hidden md:block" />

            <div className="space-y-3">
              {ROUNDS.map((r, i) => {
                const Icon = r.icon;
                const c = COLOR_MAP[r.color];
                return (
                  <div
                    key={r.round}
                    className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all ${
                      i === 0
                        ? `${c.light} ${c.border}`
                        : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    {/* Round number bubble */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 z-10 ${
                        i === 0 ? c.bg : "bg-slate-200"
                      }`}
                    >
                      {i === 0 ? (
                        <Icon className="w-5 h-5 text-white" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Round {r.round}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            i === 0 ? c.badge : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {r.title}
                        </span>
                        {i === 0 && (
                          <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                            <Unlock className="w-3 h-3" /> Starts Unlocked
                          </span>
                        )}
                      </div>
                      <div className={`font-semibold mt-0.5 text-sm ${i === 0 ? "text-slate-900" : "text-slate-500"}`}>
                        {r.category}
                      </div>
                      <div className={`text-xs mt-0.5 ${i === 0 ? "text-slate-600" : "text-slate-400"}`}>
                        {r.description}
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 flex-shrink-0 mt-1 ${
                        i === 0 ? c.text : "text-slate-300"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── TEAM SETUP ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-1">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Your Team Profile</h2>
          </div>
          <p className="text-slate-500 text-sm mb-6">
            Enter your company name and team members with their designations before starting.
          </p>

          {/* Company Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. ZoomCart, QuickRush, SwiftBasket..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
            />
          </div>

          {/* Team Members */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-700">
                Team Members
                <span className="text-slate-400 font-normal ml-2">({teamMembers.length}/6)</span>
              </label>
              <button
                onClick={addMember}
                disabled={teamMembers.length >= 6}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed transition"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            </div>

            <div className="space-y-3">
              {teamMembers.map((member, i) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {i === 0 ? (
                      <Crown className="w-4 h-4 text-blue-600" />
                    ) : (
                      <User className="w-4 h-4 text-blue-400" />
                    )}
                  </div>

                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateMember(member.id, "name", e.target.value)}
                    placeholder={`Member ${i + 1} name`}
                    className="flex-1 min-w-0 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />

                  <select
                    value={member.designation}
                    onChange={(e) => updateMember(member.id, "designation", e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  >
                    {DESIGNATIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeMember(member.id)}
                    disabled={teamMembers.length === 1}
                    className="text-slate-300 hover:text-red-400 disabled:cursor-not-allowed transition flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              saved
                ? "bg-green-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
            }`}
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Profile Saved!
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                Save Team Profile
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
