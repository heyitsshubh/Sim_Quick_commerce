import { BarChart3, Users, Package, Truck, TrendingUp } from 'lucide-react';
import type { Player } from '../../types/game';

interface PerformanceTabProps {
  player: Player;
  round: number;
}

export default function PerformanceTab({ player, round }: PerformanceTabProps) {
  const decisions = player.decisions[round] || {};

  const darkStoreCount = decisions.darkStores
    ? Object.values(decisions.darkStores).reduce((sum: number, val) => sum + (Number(val) || 0), 0)
    : 0;

  const productCount = decisions.productCategories
    ? Object.values(decisions.productCategories).filter(Boolean).length
    : 0;

  const fleetSize = decisions.deliveryFleet?.riderCount || 100;
  const techCount = decisions.technology
    ? Object.values(decisions.technology).filter(Boolean).length
    : 3;

  const kpis = [
    { label: 'Average Order Value', value: '₹487', target: '₹500', progress: 97, icon: TrendingUp },
    { label: 'Delivery Success Rate', value: '94.2%', target: '95%', progress: 99, icon: Truck },
    { label: 'Customer Retention', value: '76%', target: '80%', progress: 95, icon: Users },
    { label: 'Inventory Turnover', value: '12.3x', target: '15x', progress: 82, icon: Package },
  ];

  const monthlyTrend = [
    { month: 'M1', orders: 15000, revenue: 73 },
    { month: 'M2', orders: 23000, revenue: 112 },
    { month: 'M3', orders: 34000, revenue: 166 },
    { month: 'M4', orders: 45000, revenue: 219 },
    { month: 'M5', orders: 58000, revenue: 282 },
    { month: 'M6', orders: 67000, revenue: 326 },
  ];

  const maxRevenue = Math.max(...monthlyTrend.map(m => m.revenue));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-4">Performance Dashboard - Round {round}</h3>
        <p className="text-slate-600">Key performance indicators and growth metrics</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="text-3xl font-bold text-blue-700 mb-1">67K</div>
          <div className="text-sm text-blue-600 font-medium">Monthly Orders</div>
          <div className="text-xs text-slate-600 mt-1">+24% vs last month</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="text-3xl font-bold text-green-700 mb-1">18.5K</div>
          <div className="text-sm text-green-600 font-medium">Active Customers</div>
          <div className="text-xs text-slate-600 mt-1">+32% growth</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
          <div className="text-3xl font-bold text-amber-700 mb-1">14 min</div>
          <div className="text-sm text-amber-600 font-medium">Avg Delivery Time</div>
          <div className="text-xs text-slate-600 mt-1">-2 min improvement</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="text-3xl font-bold text-purple-700 mb-1">4.6★</div>
          <div className="text-sm text-purple-600 font-medium">Customer Rating</div>
          <div className="text-xs text-slate-600 mt-1">From 12.3K reviews</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
        <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Revenue & Orders Growth Trend
        </h4>
        <div className="space-y-4">
          {monthlyTrend.map((data, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">{data.month}</span>
                <div className="flex gap-4">
                  <span className="text-slate-600">{data.orders.toLocaleString()} orders</span>
                  <span className="font-semibold text-blue-700">₹{data.revenue}L</span>
                </div>
              </div>
              <div className="h-8 bg-slate-100 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                >
                  {data.revenue / maxRevenue > 0.3 && (
                    <span className="text-xs font-semibold text-white">₹{data.revenue}L</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
          <h4 className="font-bold text-slate-900 mb-4">Key Performance Indicators</h4>
          <div className="space-y-4">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">{kpi.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{kpi.value}</span>
                      <span className="text-xs text-slate-500">/ {kpi.target}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        kpi.progress >= 95
                          ? 'bg-green-500'
                          : kpi.progress >= 80
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${kpi.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
          <h4 className="font-bold text-slate-900 mb-4">Operational Metrics</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Dark Stores Operational</span>
              <span className="text-lg font-bold text-slate-900">{darkStoreCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">SKUs Available</span>
              <span className="text-lg font-bold text-slate-900">{productCount * 250}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Delivery Fleet Size</span>
              <span className="text-lg font-bold text-slate-900">{fleetSize}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Tech Systems Active</span>
              <span className="text-lg font-bold text-slate-900">{techCount}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <span className="text-sm font-semibold text-slate-700">Orders per Dark Store (Daily)</span>
              <span className="text-lg font-bold text-blue-700">{Math.round(67000 / darkStoreCount / 30)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700">Orders per Rider (Daily)</span>
              <span className="text-lg font-bold text-green-700">{Math.round(67000 / fleetSize / 30)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-blue-200 p-6">
        <h4 className="font-bold text-slate-900 mb-4">Market Coverage Heat Map</h4>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }, (_, i) => {
            const intensity = Math.random();
            return (
              <div
                key={i}
                className={`aspect-square rounded ${
                  intensity > 0.7
                    ? 'bg-green-500'
                    : intensity > 0.5
                    ? 'bg-blue-400'
                    : intensity > 0.3
                    ? 'bg-blue-300'
                    : 'bg-slate-200'
                }`}
                title={`Zone ${i + 1}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-200 rounded"></div>
            <span>No Coverage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-300 rounded"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
