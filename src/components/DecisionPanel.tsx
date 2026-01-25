/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { ChevronRight, Store, Package, Truck, Laptop, DollarSign, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import type { Player } from '../types/game';
import BusinessModelSection from './decisions/BusinessModelSection';
import ProductCategoriesSection from './decisions/ProductCategoriesSection';
import DarkStoresSection from './decisions/DarkStoresSection';
import DeliverySection from './decisions/DeliverySection';
import TechnologySection from './decisions/TechnologySection';
import SourcingSection from './decisions/SourcingSection';
import PricingSection from './decisions/PricingInnovationPage';
import MarketingSection from './decisions/MarketingSection';
import OperationsSection from './decisions/OperationsSection';

interface DecisionPanelProps {
  player: Player;
  round: number;
  onComplete: () => void;
  onUpdatePlayer: (player: Player) => void;
}

const SECTIONS = [
  { id: 'business', label: 'Business Model', icon: Store },
  { id: 'products', label: 'Product Categories', icon: Package },
  { id: 'darkstores', label: 'Dark Stores', icon: Store },
  { id: 'delivery', label: 'Delivery Fleet', icon: Truck },
  { id: 'technology', label: 'Technology', icon: Laptop },
  { id: 'sourcing', label: 'Sourcing', icon: Package },
  { id: 'marketing', label: 'Marketing', icon: TrendingUp },
  { id: 'operations', label: 'Operations', icon: Users },
   { id: 'pricing', label: 'Pricing', icon: DollarSign }
];

export default function DecisionPanel({ player, round, onComplete, onUpdatePlayer }: DecisionPanelProps) {
  const [activeSection, setActiveSection] = useState('business');
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSectionComplete = (sectionId: string, data: any) => {
    const updatedPlayer = {
      ...player,
      decisions: {
        ...player.decisions,
        [round]: {
          ...player.decisions[round],
          ...data,
        },
      },
      score: player.score + Math.floor(Math.random() * 50) + 20,
    };

    onUpdatePlayer(updatedPlayer);
    setCompletedSections(new Set([...completedSections, sectionId]));

    const currentIndex = SECTIONS.findIndex(s => s.id === sectionId);
    if (currentIndex < SECTIONS.length - 1) {
      setActiveSection(SECTIONS[currentIndex + 1].id);
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  const allComplete = completedSections.size === SECTIONS.length;

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-lg p-4 sticky top-4">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-900">Decision Sections</h3>
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
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isComplete
                      ? 'bg-green-50 text-green-700'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Progress</span>
              <span className="text-sm font-bold text-slate-900">
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
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 animate-pulse"
            >
              <CheckCircle2 className="w-5 h-5" />
              Complete Round
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="bg-white rounded-xl shadow-lg p-6">
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
          {activeSection === 'darkstores' && (
            <DarkStoresSection
              round={round}
              onComplete={(data) => handleSectionComplete('darkstores', data)}
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
