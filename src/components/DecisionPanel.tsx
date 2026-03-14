/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, Store, Package, Truck, Laptop, DollarSign, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import type { Player } from '../types/game';
import BusinessModelSection from './decisions/BusinessModelSection';
import ProductCategoriesSection from './decisions/ProductCategoriesSection';
import DeliverySection from './decisions/DeliverySection';
import TechnologySection from './decisions/TechnologySection';
import SourcingSection from './decisions/SourcingSection';
import PricingSection from './decisions/PricingInnovationPage';
import MarketingSection from './decisions/MarketingSection';
import OperationsSection from './decisions/OperationsSection';

interface DecisionPanelProps {
  player: Player;
  round: number;
  isRoundLocked?: boolean;
  timeLeftSec?: number;
  onComplete: () => void;
  onUpdatePlayer: (player: Player) => void;
}

const SECTIONS = [
  { id: 'business', label: 'Business Model', icon: Store },
  { id: 'products', label: 'Product Categories', icon: Package },
  { id: 'delivery', label: 'Delivery Fleet', icon: Truck },
  { id: 'technology', label: 'Technology', icon: Laptop },
  { id: 'sourcing', label: 'Sourcing', icon: Package },
  { id: 'marketing', label: 'Marketing', icon: TrendingUp },
  { id: 'operations', label: 'HR & Operations', icon: Users },
   { id: 'pricing', label: 'Pricing', icon: DollarSign }
];

const getCompletedFromRoundData = (roundData: any): Set<string> => {
  const completed = new Set<string>();

  if (!roundData) {
    return completed;
  }

  if (Array.isArray(roundData.__completedSections)) {
    roundData.__completedSections.forEach((sectionId: string) => completed.add(sectionId));
  }

  if (roundData.businessModel || roundData.marketPositioning) {
    completed.add('business');
  }
  if (roundData.categories || roundData.productCategories) {
    completed.add('products');
  }
  if (roundData.deliveryFleet) {
    completed.add('delivery');
  }
  if (roundData.selections || roundData.technology) {
    completed.add('technology');
  }
  if (roundData.supplierId || roundData.sourcing) {
    completed.add('sourcing');
  }
  if (roundData.acquisition || roundData.marketing) {
    completed.add('marketing');
  }
  if (roundData.operations || roundData.selectedEmployees) {
    completed.add('operations');
  }
  if (roundData.pricing || roundData.selectedFeatures || roundData.rdInvestment) {
    completed.add('pricing');
  }

  return completed;
};

export default function DecisionPanel({
  player,
  round,
  isRoundLocked = false,
  timeLeftSec = 0,
  onComplete,
  onUpdatePlayer,
}: DecisionPanelProps) {
  const [activeSection, setActiveSection] = useState('business');
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const autoCompletedRoundRef = useRef<number | null>(null);

  const stableUserId = localStorage.getItem('userId') || player.id || 'default-user';
  const stableSimulationId = localStorage.getItem('simulationId') || 'default-simulation';

  const completionStorageKey = useMemo(
    () => `decision-completion:${stableUserId}:${stableSimulationId}:round:${round}`,
    [stableUserId, stableSimulationId, round]
  );

  const activeSectionStorageKey = useMemo(
    () => `decision-active-section:${stableUserId}:${stableSimulationId}:round:${round}`,
    [stableUserId, stableSimulationId, round]
  );

  useEffect(() => {
    const roundData = player?.decisions?.[round];
    const inferred = getCompletedFromRoundData(roundData);
    const stored = localStorage.getItem(completionStorageKey);
    const storedActive = localStorage.getItem(activeSectionStorageKey);
    const dataActive = roundData?.__activeSection;

    if (dataActive && SECTIONS.some((section) => section.id === dataActive)) {
      setActiveSection(dataActive);
    } else if (storedActive && SECTIONS.some((section) => section.id === storedActive)) {
      setActiveSection(storedActive);
    } else {
      setActiveSection('business');
    }

    if (!stored) {
      setCompletedSections(inferred);
      setHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setCompletedSections(new Set<string>([...inferred, ...parsed]));
      } else {
        setCompletedSections(inferred);
      }
    } catch {
      setCompletedSections(inferred);
    }
    setHydrated(true);
  }, [completionStorageKey, activeSectionStorageKey, player, round]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(completionStorageKey, JSON.stringify(Array.from(completedSections)));
  }, [completedSections, completionStorageKey, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(activeSectionStorageKey, activeSection);
  }, [activeSection, activeSectionStorageKey, hydrated]);

  const handleSectionComplete = (sectionId: string, data: any) => {
    if (isRoundLocked) {
      return;
    }

    const currentIndex = SECTIONS.findIndex(s => s.id === sectionId);
    const nextSectionId = currentIndex < SECTIONS.length - 1 ? SECTIONS[currentIndex + 1].id : sectionId;

    setCompletedSections((prev) => {
      const next = new Set(prev);
      next.add(sectionId);

      localStorage.setItem(completionStorageKey, JSON.stringify(Array.from(next)));

      const updatedPlayer = {
        ...player,
        decisions: {
          ...player.decisions,
          [round]: {
            ...player.decisions[round],
            ...data,
            __completedSections: Array.from(next),
            __activeSection: nextSectionId,
          },
        },
        score: player.score + Math.floor(Math.random() * 50) + 20,
      };

      onUpdatePlayer(updatedPlayer);
      return next;
    });

    if (currentIndex < SECTIONS.length - 1) {
      localStorage.setItem(activeSectionStorageKey, nextSectionId);
      setActiveSection(nextSectionId);
    }
  };

  const handleFinish = () => {
    if (isRoundLocked) {
      return;
    }

    onComplete();
  };

  const allComplete = completedSections.size === SECTIONS.length;

  useEffect(() => {
    if (!allComplete || isRoundLocked) {
      return;
    }

    if (autoCompletedRoundRef.current === round) {
      return;
    }

    autoCompletedRoundRef.current = round;
    onComplete();
  }, [allComplete, isRoundLocked, onComplete, round]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-lg p-4 lg:sticky lg:top-4">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-900 text-sm md:text-base">Decision Sections</h3>
            <p className="text-xs text-slate-600 mt-1">Complete all sections to finish round</p>
          </div>
          <div className="space-y-2">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const isComplete = completedSections.has(section.id);

              return (
                <button
                  key={section.id}
                  disabled={isRoundLocked}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all text-sm md:text-base ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isComplete
                      ? 'bg-green-50 text-green-700'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  } ${isRoundLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <Icon className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="text-xs md:text-sm font-medium truncate">{section.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs md:text-sm font-medium text-slate-700">Progress</span>
              <span className="text-xs md:text-sm font-bold text-slate-900">
                {completedSections.size}/{SECTIONS.length}
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${(completedSections.size / SECTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {allComplete && (
            <button
              onClick={handleFinish}
              disabled={isRoundLocked}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 animate-pulse text-sm md:text-base"
            >
              <CheckCircle2 className="w-5 h-5" />
              Complete Round
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 relative">
          {isRoundLocked && (
            <div className="absolute inset-0 z-10 bg-slate-900/35 rounded-xl flex items-start justify-end p-4">
              <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs md:text-sm font-medium text-slate-800 shadow-sm">
                Round time is over. Advancing to next round...
              </div>
            </div>
          )}

          {timeLeftSec > 0 && timeLeftSec <= 30 && (
            <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3 py-2 text-xs md:text-sm font-medium">
              Less than 30 seconds left in this round.
            </div>
          )}

          {activeSection === 'business' && (
            <BusinessModelSection
              round={round}
              onComplete={(data) => handleSectionComplete('business', data)}
            />
          )}
          {activeSection === 'products' && (
            <ProductCategoriesSection
              round={round}
              onComplete={(data) => handleSectionComplete('products', data)}
            />
          )}
          {activeSection === 'delivery' && (
            <DeliverySection
              round={round}
              onComplete={(data) => handleSectionComplete('delivery', data)}
            />
          )}
          {activeSection === 'technology' && (
            <TechnologySection
              round={round}
              onComplete={(data) => handleSectionComplete('technology', data)}
            />
          )}
          {activeSection === 'sourcing' && (
            <SourcingSection
              round={round}
              onComplete={(data: any) => handleSectionComplete('sourcing', data)}
            />
          )}
          {activeSection === 'pricing' && (
            <PricingSection
              round={round}
              onComplete={(data: any) => handleSectionComplete('pricing', data)}
            />
          )}

          {activeSection === 'marketing' && (
            <MarketingSection
              round={round}
              onComplete={(data) => handleSectionComplete('marketing', data)}
            />
          )}
          {activeSection === 'operations' && (
            <OperationsSection
              round={round}
              onComplete={(data: any) => handleSectionComplete('operations', data)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
