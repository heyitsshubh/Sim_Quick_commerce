export interface Player {
  id: string;
  name: string;
  company: string;
  score: number;
  decisions: Record<number, RoundDecisions>;
}

export interface RoundDecisions {
  businessModel?: string;
  marketPositioning?: string;
  productCategories: Record<string, CategoryDecision>;
  darkStores: Record<string, DarkStoreDecision>;
  deliveryFleet?: FleetDecision;
  technology: Record<string, boolean>;
  pricing?: PricingDecision;
  marketing: Record<string, MarketingDecision>;
  operations?: OperationsDecision;
  compliance: Record<string, boolean>;
}

export interface CategoryDecision {
  enabled: boolean;
  skus?: number;
  extras?: Record<string, any>;
}

export interface DarkStoreDecision {
  enabled: boolean;
  count?: number;
  size?: string;
}

export interface FleetDecision {
  ownFleet: boolean;
  riderCount?: number;
  bikeCount?: number;
  electricPercent?: number;
  thirdParty: boolean;
}

export interface PricingDecision {
  strategy: string;
  deliveryCharges: string;
  aov: number;
  margin: number;
}

export interface MarketingDecision {
  enabled: boolean;
  budget?: number;
}

export interface OperationsDecision {
  storeManagers: number;
  pickers: number;
  riders: number;
  techTeam: number;
}

export interface GameState {
  currentRound: number;
  maxRounds: number;
  players: Player[];
  started: boolean;
  finished: boolean;
}
