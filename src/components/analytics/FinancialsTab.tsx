import { TrendingUp, DollarSign, CreditCard } from 'lucide-react';
import type { Player } from '../../types/game';

interface FinancialsTabProps {
  player: Player;
  round: number;
}

export default function FinancialsTab({ player, round }: FinancialsTabProps) {
  const decisions = player.decisions[round] || {};

  const darkStoreCount = decisions.darkStores
    ? Object.values(decisions.darkStores).reduce((sum: number, val) => sum + (Number(val) || 0), 0)
    : 0;

  const productCount = decisions.productCategories
    ? Object.values(decisions.productCategories).filter(Boolean).length
    : 0;

  const techInvestments = decisions.technology
    ? Object.values(decisions.technology).filter(Boolean).length
    : 3;

  const marketingChannels = decisions.marketing
    ? Object.values(decisions.marketing).filter(Boolean).length
    : 0;

  const fleetSize = decisions.deliveryFleet?.riderCount || 100;

  const darkStoreInvestment = darkStoreCount * 5000000;
  const inventoryInvestment = productCount * 2000000;
  const technologyInvestment = techInvestments * 3000000;
  const fleetInvestment = fleetSize * 80000;
  const totalAssets = darkStoreInvestment + inventoryInvestment + technologyInvestment + fleetInvestment;

  const monthlyRevenue = darkStoreCount * 8000000;
  const cogs = monthlyRevenue * 0.70;
  const grossProfit = monthlyRevenue - cogs;

  const operatingExpenses = (darkStoreCount * 1500000) + (fleetSize * 25000) + (marketingChannels * 500000);
  const ebitda = grossProfit - operatingExpenses;
  const netIncome = ebitda * 0.85;

  const operatingCashFlow = netIncome + (darkStoreInvestment * 0.02);
  const investingCashFlow = -(darkStoreInvestment + technologyInvestment) * 0.1;
  const financingCashFlow = totalAssets * 0.3;
  const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;

  const formatCurrency = (amount: number) => {
    const crores = amount / 10000000;
    return `₹${crores.toFixed(2)} Cr`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-4">Financial Statements - Round {round}</h3>
        <p className="text-slate-600">Based on your strategic decisions</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <DollarSign className="w-8 h-8 text-green-600 mb-2" />
          <div className="text-2xl font-bold text-green-700">{formatCurrency(monthlyRevenue)}</div>
          <div className="text-xs text-green-600 font-medium">Monthly Revenue</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
          <div className="text-2xl font-bold text-blue-700">{formatCurrency(grossProfit)}</div>
          <div className="text-xs text-blue-600 font-medium">Gross Profit</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
          <TrendingUp className="w-8 h-8 text-amber-600 mb-2" />
          <div className="text-2xl font-bold text-amber-700">{formatCurrency(netIncome)}</div>
          <div className="text-xs text-amber-600 font-medium">Net Income</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <CreditCard className="w-8 h-8 text-purple-600 mb-2" />
          <div className="text-2xl font-bold text-purple-700">{formatCurrency(netCashFlow)}</div>
          <div className="text-xs text-purple-600 font-medium">Net Cash Flow</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600 rounded"></div>
            Balance Sheet
          </h4>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-3">Assets</div>
              <div className="space-y-2 ml-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Dark Stores</span>
                  <span className="font-medium text-slate-900">{formatCurrency(darkStoreInvestment)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Inventory</span>
                  <span className="font-medium text-slate-900">{formatCurrency(inventoryInvestment)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Technology</span>
                  <span className="font-medium text-slate-900">{formatCurrency(technologyInvestment)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Fleet</span>
                  <span className="font-medium text-slate-900">{formatCurrency(fleetInvestment)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200">
                  <span className="text-slate-900">Total Assets</span>
                  <span className="text-blue-700">{formatCurrency(totalAssets)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-green-600 rounded"></div>
            Profit & Loss
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Revenue</span>
              <span className="font-medium text-slate-900">{formatCurrency(monthlyRevenue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Cost of Goods Sold</span>
              <span className="font-medium text-red-600">({formatCurrency(cogs)})</span>
            </div>
            <div className="flex justify-between text-sm font-semibold pt-2 border-t border-slate-200">
              <span className="text-slate-700">Gross Profit</span>
              <span className="text-green-700">{formatCurrency(grossProfit)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Operating Expenses</span>
              <span className="font-medium text-red-600">({formatCurrency(operatingExpenses)})</span>
            </div>
            <div className="flex justify-between text-sm font-semibold pt-2 border-t border-slate-200">
              <span className="text-slate-700">EBITDA</span>
              <span className={ebitda > 0 ? 'text-green-700' : 'text-red-700'}>{formatCurrency(ebitda)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t-2 border-slate-300">
              <span className="text-slate-900">Net Income</span>
              <span className={netIncome > 0 ? 'text-green-700' : 'text-red-700'}>{formatCurrency(netIncome)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-purple-600 rounded"></div>
          Cash Flow Statement
        </h4>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm font-semibold text-slate-700 mb-3">Operating Activities</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Net Income</span>
                <span className="font-medium text-slate-900">{formatCurrency(netIncome)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Depreciation</span>
                <span className="font-medium text-slate-900">{formatCurrency(darkStoreInvestment * 0.02)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200">
                <span className="text-slate-900">Operating CF</span>
                <span className="text-green-700">{formatCurrency(operatingCashFlow)}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-700 mb-3">Investing Activities</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">CapEx</span>
                <span className="font-medium text-red-600">({formatCurrency(Math.abs(investingCashFlow))})</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200">
                <span className="text-slate-900">Investing CF</span>
                <span className="text-red-700">{formatCurrency(investingCashFlow)}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-700 mb-3">Financing Activities</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Funding Raised</span>
                <span className="font-medium text-slate-900">{formatCurrency(financingCashFlow)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200">
                <span className="text-slate-900">Financing CF</span>
                <span className="text-green-700">{formatCurrency(financingCashFlow)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t-2 border-slate-300">
          <div className="flex justify-between font-bold">
            <span className="text-slate-900">Net Cash Flow</span>
            <span className={netCashFlow > 0 ? 'text-green-700 text-lg' : 'text-red-700 text-lg'}>
              {formatCurrency(netCashFlow)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-6">
        <h4 className="font-semibold text-slate-900 mb-4">Key Metrics</h4>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-slate-900">{((grossProfit / monthlyRevenue) * 100).toFixed(1)}%</div>
            <div className="text-sm text-slate-600">Gross Margin</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{((netIncome / monthlyRevenue) * 100).toFixed(1)}%</div>
            <div className="text-sm text-slate-600">Net Margin</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{(monthlyRevenue / darkStoreCount / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-slate-600">Revenue/Store</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{((monthlyRevenue / totalAssets) * 12).toFixed(2)}x</div>
            <div className="text-sm text-slate-600">Asset Turnover</div>
          </div>
        </div>
      </div>
    </div>
  );
}
