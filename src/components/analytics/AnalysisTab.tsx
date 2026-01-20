import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Player } from '../../types/game';

interface AnalysisTabProps {
  player: Player;
  round: number;
  allPlayers: Player[];
}

export default function AnalysisTab({ player, round, allPlayers }: AnalysisTabProps) {
  const decisions = player.decisions[round];
  const avgScore = allPlayers.reduce((sum, p) => sum + p.score, 0) / allPlayers.length;
  const ranking = allPlayers.sort((a, b) => b.score - a.score).findIndex(p => p.id === player.id) + 1;

  const insights = [
    {
      type: 'positive',
      title: 'Market Position',
      desc: decisions?.marketPositioning === 'premium'
        ? 'Premium positioning allows higher margins but requires excellent execution'
        : decisions?.marketPositioning === 'value'
        ? 'Value positioning captures price-sensitive customers with volume'
        : 'Mass market approach balances reach and profitability',
    },
    {
      type: 'neutral',
      title: 'Delivery Strategy',
      desc: decisions?.businessModel === '10min'
        ? 'Ultra-fast delivery requires dense dark store network and higher operational costs'
        : decisions?.businessModel === '30min'
        ? 'Balanced delivery speed allows wider product range and better unit economics'
        : 'Your delivery model balances speed with operational efficiency',
    },
    {
      type: player.score > avgScore ? 'positive' : 'warning',
      title: 'Competitive Position',
      desc: `You're ranked #${ranking} out of ${allPlayers.length} players. ${
        player.score > avgScore
          ? 'Above average performance!'
          : 'Room for strategic improvement'
      }`,
    },
  ];

  const productCount = decisions?.productCategories
    ? Object.values(decisions.productCategories).filter(Boolean).length
    : 0;

  const darkStoreCount = decisions?.darkStores
    ? Object.values(decisions.darkStores).reduce((sum: number, val) => sum + (Number(val) || 0), 0)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-4">Round {round} Performance Analysis</h3>
        <p className="text-slate-600">Strategic insights based on your decisions</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="text-3xl font-bold text-blue-700 mb-1">{productCount}</div>
          <div className="text-sm text-blue-600 font-medium">Product Categories</div>
          <div className="text-xs text-slate-600 mt-1">Active in your platform</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="text-3xl font-bold text-green-700 mb-1">{darkStoreCount}</div>
          <div className="text-sm text-green-600 font-medium">Dark Stores</div>
          <div className="text-xs text-slate-600 mt-1">Total locations</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
          <div className="text-3xl font-bold text-amber-700 mb-1">#{ranking}</div>
          <div className="text-sm text-amber-600 font-medium">Current Rank</div>
          <div className="text-xs text-slate-600 mt-1">Out of {allPlayers.length} players</div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-slate-900">Strategic Insights</h4>
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`flex gap-4 p-4 rounded-xl border-2 ${
              insight.type === 'positive'
                ? 'bg-green-50 border-green-200'
                : insight.type === 'warning'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex-shrink-0 mt-1">
              {insight.type === 'positive' ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : insight.type === 'warning' ? (
                <AlertCircle className="w-5 h-5 text-amber-600" />
              ) : (
                <TrendingUp className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <div className="font-semibold text-slate-900 mb-1">{insight.title}</div>
              <div className="text-sm text-slate-600">{insight.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-xl p-6">
        <h4 className="font-semibold text-slate-900 mb-4">Score Comparison</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Your Score</span>
              <span className="font-bold text-slate-900">{player.score} pts</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${Math.min((player.score / Math.max(...allPlayers.map(p => p.score))) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Average Score</span>
              <span className="font-bold text-slate-900">{Math.round(avgScore)} pts</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-400 rounded-full"
                style={{ width: `${Math.min((avgScore / Math.max(...allPlayers.map(p => p.score))) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
