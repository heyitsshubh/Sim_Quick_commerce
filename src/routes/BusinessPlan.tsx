/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import TopNav from "../components/TopNav";
import RoundsStrip from "../components/RoundStrip";
import {
  HelpCircle,
  Trophy,
  Check,
  Save,
} from "lucide-react";
import axios from "axios";

const API = "https://sim-quick-commerce-backend.onrender.com/api/business-plan";

const mapTabToSection = (tab: string) =>
  tab.toLowerCase().replace(" ", "-");

const normalizeTargetSections = (raw: any): Record<string, TargetSection> | null => {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    const entries = raw
      .filter((section) => section && Array.isArray(section.targets))
      .map((section, idx) => {
        const key = section.id || section.title || `section_${idx + 1}`;
        return [key, {
          title: section.title || "",
          description: section.description || "",
          targets: section.targets || [],
        }] as [string, TargetSection];
      });
    return entries.length > 0 ? Object.fromEntries(entries) : null;
  }
  if (typeof raw === "object") {
    return raw as Record<string, TargetSection>;
  }
  return null;
};

const buildTargetsFromFinancial = (financial: Record<string, number>): Record<string, TargetSection> => {
  const targets: Target[] = Object.entries(financial).map(([key, value]) => {
    const normalizedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
    const isPercent = /margin|growth|rate|percentage|percent/i.test(key);
    const unit = isPercent ? "%" : "";
    const min = 0;
    const max = isPercent ? 100 : Math.max(1000, Math.ceil(value * 2));
    const step = isPercent ? 1 : Math.max(1, Math.ceil(max / 20));
    return {
      id: key,
      title: normalizedKey,
      desc: "Set your target value.",
      min,
      max,
      step,
      unit,
      defaultVal: typeof value === "number" ? value : min,
    };
  });

  return {
    financial: {
      title: "Financial Targets",
      description: "Adjust the key financial targets for your plan.",
      targets,
    },
  };
};

const toTitle = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();

const normalizeRevenueStreams = (raw: any): RevenueStream[] | null => {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    return raw as RevenueStream[];
  }
  if (typeof raw === "object") {
    const entries = Object.keys(raw);
    if (entries.length === 0) return null;
    return entries.map((id) => ({
      id,
      label: toTitle(id),
      desc: "",
      icon: "💰",
    }));
  }
  return null;
};



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

// Data will be loaded from API

// Data will be loaded from API

// Data will be loaded from API

// Data will be loaded from API

// Data will be loaded from API

// Data will be loaded from API

const PRIORITY_STYLES: Record<RevenuePriority, { label: string; cls: string }> = {
  primary: { label: "Primary", cls: "bg-blue-100 text-blue-700 border-blue-300" },
  secondary: { label: "Secondary", cls: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  experimental: { label: "Experimental", cls: "bg-amber-100 text-amber-700 border-amber-300" },
  not_planned: { label: "Not Planned", cls: "bg-slate-100 text-slate-500 border-slate-200" },
};

// Data will be loaded from API

// Data will be loaded from API

// ─── REUSABLE COMPONENTS ─────────────────────────────────

// function AdvisorCard() {
//   return (
//     <div className="hidden md:flex flex-col items-center bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 shrink-0">
//       <div className="w-12 h-12 bg-slate-300 rounded-full mb-2" />
//       <span className="text-xs font-semibold text-slate-900">Strategy Advisor</span>
//       <span className="text-[10px] text-slate-500">Quick Commerce Expert</span>
//     </div>
//   );
// }

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

  // API Data States
  const [competitiveOptions, setCompetitiveOptions] = useState<CompetitiveOption[]>([]);
  const [swotData, setSwotData] = useState<SwotData>({ strengths: [], weaknesses: [], opportunities: [], threats: [] });
  const [visionValues, setVisionValues] = useState<VisionValue[]>([]);
  const [ansoffCells, setAnsoffCells] = useState<AnsoffCell[]>([]);
  const [targetSections, setTargetSections] = useState<Record<string, TargetSection>>({});
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [moatOptions, setMoatOptions] = useState<MoatOption[]>([]);

  // Competitive
  const [selectedStrategy, setSelectedStrategy] = useState("speed");
  const [competitiveNote, setCompetitiveNote] = useState("");

  // SWOT
  const [swotNote, setSwotNote] = useState("");

  // Vision
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());
  const [missionStatement, setMissionStatement] = useState("");

  // Growth
  const [selectedGrowth, setSelectedGrowth] = useState("penetration");
  const [growthNote, setGrowthNote] = useState("");
  const [growthValues, setGrowthValues] = useState<Record<string, string>>({});

  // Targets
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(new Set());
  const [targetValues, setTargetValues] = useState<Record<string, number>>({});
  const [kpiTargets, setKpiTargets] = useState<Set<string>>(new Set());

  // Revenue Model
  const [revenuePriorities, setRevenuePriorities] = useState<Record<string, RevenuePriority>>({});
  const [revenueNote, setRevenueNote] = useState("");

  // Risk Matrix
  const [riskMitigations, setRiskMitigations] = useState<Record<string, string>>({});
  const [topRisks, setTopRisks] = useState<Set<string>>(new Set());

  // Moat Builder
  const [selectedMoats, setSelectedMoats] = useState<Set<string>>(new Set());
  const [moatNote, setMoatNote] = useState("");

  // Save toast
  const [saved, setSaved] = useState(false);

  // ════════ LOAD MASTER DATA FROM API (once on mount) ════════
  // Disabled: user requested no automatic master-data fetch
  useEffect(() => {
    // loadMasterData();
  }, []);

  // const loadMasterData = async () => {
  //   try {
  //     const res = await axios.get(`${API}/master-data`);
  //     const data = res.data;
      
  //     // Map API structure to component state
  //     if (data.strategies) {
  //       setCompetitiveOptions(data.strategies.map((s: any) => ({
  //         id: s.title.toLowerCase().replace(/\s+&\s+/g, '_').replace(/\s+/g, '_'),
  //         title: s.title,
  //         desc: s.description
  //       })));
  //     }
      
  //     // Handle SWOT data - check for both direct properties and nested swotData
  //     if (data.opportunities || data.threats || data.strengths || data.weaknesses) {
  //       setSwotData({
  //         opportunities: data.opportunities || [],
  //         threats: data.threats || [],
  //         strengths: data.strengths || [],
  //         weaknesses: data.weaknesses || []
  //       });
  //     } else if (data.swotData) {
  //       setSwotData(data.swotData);
  //     }
      
  //     if (data.visionValues && Array.isArray(data.visionValues) && data.visionValues.length > 0) {
  //       setVisionValues(data.visionValues);
  //     } else if (data.values && Array.isArray(data.values) && data.values.length > 0) {
  //       setVisionValues(data.values);
  //     } else if (data.options && Array.isArray(data.options) && data.options.length > 0) {
  //       setVisionValues(data.options);
  //     }
      
  //     if (data.ansoffCells) {
  //       setAnsoffCells(data.ansoffCells.map((c: any) => ({
  //         id: c.id,
  //         title: c.title,
  //         desc: c.description || c.desc
  //       })));
  //     }
  //     // ansoffCells set from API above; no defaults injected
      
  //     const normalizedTargets = normalizeTargetSections(
  //       data.targetSections || data.sections || data.targets
  //     );
  //     if (normalizedTargets) {
  //       setTargetSections(normalizedTargets);
  //     } else if (data.financial && typeof data.financial === "object") {
  //       setTargetSections(buildTargetsFromFinancial(data.financial));
  //     }
      
  //     const normalizedRevenueStreams = normalizeRevenueStreams(
  //       data.revenueStreams || data.revenueModel || data.revenue || data.streams
  //     );
  //     if (normalizedRevenueStreams) {
  //       setRevenueStreams(normalizedRevenueStreams);
  //     }
      
  //     if (data.risks) {
  //       setRisks(data.risks.map((r: any, idx: number) => ({
  //         id: r.id || r.name || `risk_${idx + 1}`,
  //         label: r.label || r.name || "",
  //         desc: r.description || r.desc || "",
  //         likelihood: r.likelihood ?? 3,
  //         impact: r.impact ?? 3
  //       })));
  //     }
      
  //     if (data.moatOptions) {
  //       setMoatOptions(data.moatOptions.map((m: any) => ({
  //         id: m.id || m.label?.toLowerCase().replace(/\s+/g, "_") || "",
  //         label: m.label || m.name || "",
  //         desc: m.description || m.desc || "",
  //         category: m.category || "Moat",
  //         effort: m.effort ?? 3,
  //         impact: m.impact ?? 3
  //       })));
  //     } else if (data.moats) {
  //       setMoatOptions(data.moats.map((m: any) => {
  //         if (typeof m === "string") {
  //           return {
  //             id: m.toLowerCase().replace(/\s+/g, "_"),
  //             label: m,
  //             desc: "",
  //             category: "Moat",
  //             effort: 3,
  //             impact: 3,
  //           };
  //         }
  //         return {
  //           id: m.id || m.label?.toLowerCase().replace(/\s+/g, "_") || "",
  //           label: m.label || m.name || "",
  //           desc: m.description || m.desc || "",
  //           category: m.category || "Moat",
  //           effort: m.effort ?? 3,
  //           impact: m.impact ?? 3,
  //         };
  //       }));
  //     }
  //   } catch (e) {
  //     console.error("Failed to load master data:", e);
  //   }
  // };

  // ════════ LOAD SECTION DATA FROM API ════════
  useEffect(() => {
    loadSection();
  }, [activeTab]);

  const loadSection = async () => {
    try {
      const section = mapTabToSection(activeTab);
      const res = await axios.get(`${API}/${section}`);
      const data = res.data;

      switch (section) {
        case "competitive":
          // Handle both title and ID formats
          if (data.selectedStrategy) {
            // If it's a full title, convert to ID
            const strategyId = data.selectedStrategy.toLowerCase().replace(/\s+&\s+/g, '_').replace(/\s+/g, '_');
            setSelectedStrategy(strategyId);
          }
          setCompetitiveNote(data.elaboration || "");
          
          // Also load strategies if provided
          if (data.strategies) {
            setCompetitiveOptions(data.strategies.map((s: any) => ({
              id: s.title.toLowerCase().replace(/\s+&\s+/g, '_').replace(/\s+/g, '_'),
              title: s.title,
              desc: s.description
            })));
          }
          break;

        case "swot":
          setSwotNote(data.note || data.elaboration || "");
          
          // Handle both direct properties and nested swotData
          if (data.opportunities || data.threats || data.strengths || data.weaknesses) {
            setSwotData({
              opportunities: data.opportunities || [],
              threats: data.threats || [],
              strengths: data.strengths || [],
              weaknesses: data.weaknesses || []
            });
          } else if (data.swotData) {
            setSwotData(data.swotData);
          }
          break;

        case "vision":
          // Do not prefill selected values or mission; user will choose manually
          // Load visionValues from response if provided
          if (data.visionValues && Array.isArray(data.visionValues) && data.visionValues.length > 0) {
            setVisionValues(data.visionValues);
          } else if (data.values && Array.isArray(data.values) && data.values.length > 0) {
            setVisionValues(data.values);
          } else if (data.options && Array.isArray(data.options) && data.options.length > 0) {
            setVisionValues(data.options);
          }
          break;

        case "growth":
          if (data.strategy) {
            setSelectedGrowth(data.strategy);
          }
          setGrowthNote(data.note || "");
          if (data.values && typeof data.values === "object") {
            setGrowthValues(data.values);
          }
          if (data.ansoffCells) {
            setAnsoffCells(data.ansoffCells);
          }
          break;

        case "targets": {
          // Do not prefill targets/values/KPI; user will choose and slide manually
          const normalizedTargets = normalizeTargetSections(
            data.targetSections || data.sections || data.targets
          );
          if (normalizedTargets) {
            setTargetSections(normalizedTargets);
          } else if (data.financial && typeof data.financial === "object") {
            setTargetSections(buildTargetsFromFinancial(data.financial));
          }
          break;
        }

        case "revenue-model": {
          let nextPriorities: Record<string, RevenuePriority> = {};
          if (data.priorities && typeof data.priorities === "object") {
            nextPriorities = data.priorities;
          } else if (data && typeof data === "object") {
            nextPriorities = data as Record<string, RevenuePriority>;
          }
          setRevenuePriorities(nextPriorities);
          setRevenueNote(data.note || "");
          const normalizedRevenueStreams = normalizeRevenueStreams(
            data.revenueStreams || data.revenueModel || data.revenue || data.streams || nextPriorities
          );
          if (normalizedRevenueStreams) {
            setRevenueStreams(normalizedRevenueStreams);
          }
          break;
        }

        case "risk-matrix":
          setTopRisks(new Set(data.topRisks || []));
          setRiskMitigations(data.mitigations || {});
          if (data.risks) {
            const mappedRisks = data.risks.map((r: any, idx: number) => ({
              id: r.id || r.name || `risk_${idx + 1}`,
              label: r.label || r.name || "",
              desc: r.description || r.desc || "",
              likelihood: r.likelihood ?? 3,
              impact: r.impact ?? 3,
            }));
            setRisks(mappedRisks);

            const mitigationMap: Record<string, string> = {};
            data.risks.forEach((r: any, idx: number) => {
              const id = r.id || r.name || `risk_${idx + 1}`;
              if (r.mitigation) mitigationMap[id] = r.mitigation;
            });
            if (Object.keys(mitigationMap).length > 0) {
              setRiskMitigations(mitigationMap);
            }
          }
          break;

        case "moat-builder": {
          // Don't prefill selected moats; user will choose manually
          setMoatNote(data.note || "");
          
          // Handle moat options from various response formats
          const moatsList = data.moatOptions || data.moats || data.options || data.selectedMoats;
          if (moatsList && Array.isArray(moatsList)) {
            setMoatOptions(moatsList.map((m: any) => {
              // Handle both object format and string format
              if (typeof m === "string") {
                return {
                  id: m.toLowerCase().replace(/\s+/g, "_"),
                  label: m,
                  desc: "",
                  category: "Moat",
                  effort: 3,
                  impact: 3,
                };
              }
              return {
                id: m.id || m.label?.toLowerCase().replace(/\s+/g, "_") || m.name?.toLowerCase().replace(/\s+/g, "_") || "",
                label: m.label || m.name || m.id || "",
                desc: m.description || m.desc || "",
                category: m.category || "Moat",
                effort: m.effort ?? 3,
                impact: m.impact ?? 3,
              };
            }));
          }
          break;
        }
      }
    } catch (e: any) {
      console.error(`Failed to load section ${activeTab}:`, e);
      console.error(`API URL was: ${API}/${mapTabToSection(activeTab)}`);
      console.error(`Error details:`, e.response?.data || e.message);
    }
  };

  // ════════ SAVE SECTION DATA TO API ════════
  const handleSave = async () => {
    const section = mapTabToSection(activeTab);
    let payload: any = {};

    switch (section) {
      case "competitive":
        payload = { selectedStrategy, elaboration: competitiveNote };
        break;

      case "swot":
        payload = { note: swotNote };
        break;

      case "vision":
        payload = { selectedValues: Array.from(selectedValues), mission: missionStatement };
        break;

      case "growth":
        payload = { strategy: selectedGrowth, note: growthNote, values: growthValues };
        break;

      case "targets":
        payload = {
          selectedTargets: Array.from(selectedTargets),
          targetValues,
          kpiTargets: Array.from(kpiTargets),
        };
        break;

      case "revenue-model":
        payload = { priorities: revenuePriorities, note: revenueNote };
        break;

      case "risk-matrix":
        payload = { topRisks: Array.from(topRisks), mitigations: riskMitigations };
        break;

      case "moat-builder":
        payload = { selectedMoats: Array.from(selectedMoats), note: moatNote };
        break;
    }

    await axios.post(`${API}/${section}`, { data: payload });
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
              </div>

              <p className="text-sm font-semibold text-slate-700 mb-4">
                How will you compete against the market leaders?
              </p>

              <div className="space-y-3">
                {competitiveOptions.map((opt) => (
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
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6 mb-6">
                <div className="max-w-2xl">
                  <h2 className="text-base md:text-lg font-bold text-slate-900 mb-2">SWOT Analysis</h2>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    Assess internal strengths & weaknesses and external opportunities & threats to align decisions with
                    market realities.
                  </p>
                </div>
              </div>

              <p className="text-center text-[10px] md:text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">
                Strength, Weakness, Opportunity & Threat Analysis
              </p>

              {/* Axis headers */}
              <div className="hidden md:grid grid-cols-[auto_1fr_1fr] gap-0 mb-1">
                <div className="w-8" />
                <p className="text-center text-xs font-semibold text-slate-500">Positive</p>
                <p className="text-center text-xs font-semibold text-slate-500">Negative</p>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr] gap-3">
                {/* External row */}
                <div className="hidden md:flex items-center">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    External
                  </span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <h4 className="text-xs md:text-sm font-bold text-emerald-800 mb-3 uppercase tracking-wider">Opportunities</h4>
                  <ul className="space-y-2">
                    {swotData.opportunities.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                        <span className="text-xs text-slate-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h4 className="text-xs md:text-sm font-bold text-red-800 mb-3 uppercase tracking-wider">Threats</h4>
                  <ul className="space-y-2">
                    {swotData.threats.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                        <span className="text-xs text-slate-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Internal row */}
                <div className="hidden md:flex items-center">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    Internal
                  </span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="text-xs md:text-sm font-bold text-blue-800 mb-3 uppercase tracking-wider">Strengths</h4>
                  <ul className="space-y-2">
                    {swotData.strengths.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                        <span className="text-xs text-slate-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h4 className="text-xs md:text-sm font-bold text-amber-800 mb-3 uppercase tracking-wider">Weaknesses</h4>
                  <ul className="space-y-2">
                    {swotData.weaknesses.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                        <span className="text-xs text-slate-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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

              </div>

              <p className="text-sm font-bold text-slate-900 mb-1">
                STEP 1: Choose three core values for your company
              </p>
              <p className="text-xs text-slate-500 mb-4">{selectedValues.size}/3 selected</p>

              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {visionValues.map((val) => {
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
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6 mb-6">
                <div className="max-w-2xl">
                  <h2 className="text-base md:text-lg font-bold text-slate-900 mb-2">Growth Strategy — Ansoff Matrix</h2>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    Will you deepen share, expand categories, enter new cities, or diversify? Your choice shapes capital
                    allocation and risk.
                  </p>
                </div>
              </div>

              <h3 className="text-xs md:text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Growth Strategy</h3>

              {/* Column headers */}
              <div className="hidden md:flex gap-3 mb-1">
                <div className="w-8 shrink-0" />
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <p className="text-center text-xs font-semibold text-slate-500">Existing market</p>
                  <p className="text-center text-xs font-semibold text-slate-500">New market</p>
                </div>
              </div>

              {/* Row: New product */}
              <div className="flex flex-col md:flex-row gap-3 mb-3">
                <div className="hidden md:flex w-8 shrink-0 items-center justify-center">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    New product
                  </span>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[ansoffCells[0], ansoffCells[1]].filter(Boolean).map((cell) => {
                    const id = cell.id || cell.title?.toLowerCase().replace(/\s+/g, "_") || String(Math.random());
                    const sel = selectedGrowth === id;
                    const inputValue = growthValues[id] || "";
                    return (
                      <div
                        key={id}
                        className={`p-4 md:p-5 rounded-xl border-2 text-left transition-all ${
                          sel ? "border-blue-600 bg-blue-50/60" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <button
                          onClick={() => setSelectedGrowth(id)}
                          className="w-full text-left mb-3"
                          style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
                        >
                          <h4 className="text-xs md:text-sm font-bold text-slate-900 mb-1.5">{cell.title}</h4>
                          <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed">{cell.desc}</p>
                        </button>
                        <input
                          type="text"
                          placeholder="Enter value"
                          value={inputValue}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setGrowthValues({ ...growthValues, [id]: e.target.value })}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row: Existing product */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="hidden md:flex w-8 shrink-0 items-center justify-center">
                  <span
                    className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    Existing product
                  </span>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[ansoffCells[2], ansoffCells[3]].filter(Boolean).map((cell) => {
                    const id = cell.id || cell.title?.toLowerCase().replace(/\s+/g, "_") || String(Math.random());
                    const sel = selectedGrowth === id;
                    const inputValue = growthValues[id] || "";
                    return (
                      <div
                        key={id}
                        className={`p-4 md:p-5 rounded-xl border-2 text-left transition-all ${
                          sel ? "border-blue-600 bg-blue-50/60" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <button
                          onClick={() => setSelectedGrowth(id)}
                          className="w-full text-left mb-3"
                          style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
                        >
                          <h4 className="text-xs md:text-sm font-bold text-slate-900 mb-1.5">{cell.title}</h4>
                          <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed">{cell.desc}</p>
                        </button>
                        <input
                          type="text"
                          placeholder="Enter value"
                          value={inputValue}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setGrowthValues({ ...growthValues, [id]: e.target.value })}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
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
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 text-xs text-blue-700 font-medium">
                {selectedTargets.size}/5 targets selected · {kpiTargets.size}/1 KPI assigned
              </div>

              {Object.entries(targetSections).map(([key, section]) => (
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
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6 mb-6">
                <div className="max-w-2xl">
                  <h2 className="text-base md:text-lg font-bold text-slate-900 mb-2">Revenue Model</h2>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    Quick commerce isn't just about selling groceries. Classify each revenue stream by priority — this
                    influences capital allocation and financial scoring.
                  </p>
                </div>
              </div>

              <p className="text-xs md:text-sm font-bold text-slate-900 mb-4">Assign a priority to each revenue stream</p>

              <div className="space-y-3">
                {revenueStreams.map((stream) => {
                  const current: RevenuePriority = revenuePriorities[stream.id] || "not_planned";
                  return (
                    <div key={stream.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        {/* <span className="text-xl md:text-2xl">{stream.icon}</span> */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{stream.label}</p>
                          <p className="text-xs text-slate-500">{stream.desc}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-0 md:ml-9">
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
              </div>

              <p className="text-xs text-blue-700 font-medium bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6">
                {topRisks.size}/3 critical risks selected
              </p>

              <div className="space-y-3">
                {risks.map((risk) => {
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
              
              </div>

              <p className="text-xs text-blue-700 font-medium bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6">
                {selectedMoats.size}/4 moats selected
              </p>

              <div className="grid md:grid-cols-2 gap-3">
                {moatOptions.map((moat) => {
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
