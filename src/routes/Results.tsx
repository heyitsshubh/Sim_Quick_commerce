import { useState } from "react";
import TopNav from "../components/TopNav";
import RoundsStrip from "../components/RoundStrip";
import { HelpCircle, Timer, Trophy } from "lucide-react";
import IncomeTab from "../components/results/IncomeTab";
import BalanceSheetTab from "../components/results/BalanceSheetTab";
import CashFlowTab from "../components/results/CashFlowTab";
import InventoryTab from "../components/results/InventoryTab";
import StaffTab from "../components/results/StaffTab";
import ScoresTargetsTab from "../components/results/ScoresTargetsTab";
import useGameRoundSnapshot from "../hooks/useGameRoundSnapshot";

type TabKey = "inc" | "bal" | "cf" | "inv" | "stf" | "sco";

const tabs: { key: TabKey; label: string }[] = [
  { key: "inc", label: "Income Statement" },
  { key: "bal", label: "Balance Sheet" },
  { key: "cf", label: "Cash Flow" },
  { key: "inv", label: "Inventory" },
  { key: "stf", label: "Staff" },
  { key: "sco", label: "Scores & Targets" },
];

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("inc");
  const { currentRound, maxRounds, activePlayerScore, formattedTime } = useGameRoundSnapshot();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-4 px-4">
        <TopNav />

        <div className="mt-4 bg-white border border-slate-200 rounded-lg shadow-sm px-4 py-4">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900">Round {currentRound} of {maxRounds}</h2>
              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                Foundation: Fruits, dairy, cooking staples, snacks, beverages
              </p>

              <div className="mt-3 overflow-x-auto">
                <RoundsStrip currentRound={currentRound} maxRounds={maxRounds} />
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap bg-slate-100 text-slate-700 px-3 py-2 rounded-md">
                <Timer className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-semibold">{formattedTime}</span>
              </div>

              <button
                onClick={() => {}}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-md transition text-sm md:text-base"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Game Guide</span>
              </button>

              <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-slate-900">{activePlayerScore} pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="overflow-x-auto mb-6">
          <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "inc" && <IncomeTab />}
        {activeTab === "bal" && <BalanceSheetTab />}
        {activeTab === "cf" && <CashFlowTab />}
        {activeTab === "inv" && <InventoryTab />}
        {activeTab === "stf" && <StaffTab />}
        {activeTab === "sco" && <ScoresTargetsTab />}
      </div>
    </div>
  );
}