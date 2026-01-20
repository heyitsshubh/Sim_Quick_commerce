import { X, Trophy, Target, Zap, TrendingUp, Package, Store, Truck, DollarSign, Users, BarChart3, Lightbulb } from 'lucide-react';

interface GameGuideProps {
  onClose: () => void;
}

export default function GameGuide({ onClose }: GameGuideProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Game Guide</h2>
              <p className="text-sm text-slate-600">Everything you need to know to win</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-amber-600" />
              <h3 className="text-xl font-bold text-slate-900">Game Objective</h3>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-200">
              <p className="text-slate-700 leading-relaxed">
                Build and scale a successful quick commerce company over 8 rounds. Make strategic decisions across 8 key business areas to maximize your score and beat your competitors. The player with the highest total score at the end wins!
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-slate-900">How to Play</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="font-semibold text-slate-900 mb-2">1. Make Decisions Each Round</div>
                <p className="text-sm text-slate-600">
                  Navigate through 8 decision categories. Complete each section by making strategic choices about your business model, products, infrastructure, and more.
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="font-semibold text-slate-900 mb-2">2. Track Your Progress</div>
                <p className="text-sm text-slate-600">
                  Watch for green checkmarks next to completed sections. Once all 8 sections have checkmarks, you can complete the round.
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="font-semibold text-slate-900 mb-2">3. Review Performance</div>
                <p className="text-sm text-slate-600">
                  After each round, check your ranking and explore the Analysis, Financials, and Performance tabs to understand your business metrics.
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="font-semibold text-slate-900 mb-2">4. Continue to Next Round</div>
                <p className="text-sm text-slate-600">
                  Progress through all 8 rounds, unlocking new product categories and facing new challenges as you grow your business.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-900">Decision Categories</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Store className="w-5 h-5 text-blue-600" />
                  <div className="font-semibold text-slate-900">Business Model</div>
                </div>
                <p className="text-sm text-slate-600">
                  Choose your delivery speed, market positioning, and target segment strategy.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <div className="font-semibold text-slate-900">Product Categories</div>
                </div>
                <p className="text-sm text-slate-600">
                  Select which product categories to offer. New categories unlock each round!
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Store className="w-5 h-5 text-amber-600" />
                  <div className="font-semibold text-slate-900">Dark Stores</div>
                </div>
                <p className="text-sm text-slate-600">
                  Decide how many dark stores to open in each city location for inventory.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div className="font-semibold text-slate-900">Delivery Fleet</div>
                </div>
                <p className="text-sm text-slate-600">
                  Choose vehicle types, rider count, and logistics strategy for deliveries.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <div className="font-semibold text-slate-900">Technology</div>
                </div>
                <p className="text-sm text-slate-600">
                  Invest in AI routing, inventory management, and platform features.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div className="font-semibold text-slate-900">Pricing</div>
                </div>
                <p className="text-sm text-slate-600">
                  Set delivery fees, commission rates, and subscription pricing strategies.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div className="font-semibold text-slate-900">Marketing</div>
                </div>
                <p className="text-sm text-slate-600">
                  Choose marketing channels and strategies to acquire and retain customers.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-slate-600" />
                  <div className="font-semibold text-slate-900">Operations</div>
                </div>
                <p className="text-sm text-slate-600">
                  Manage customer service, quality control, and operational efficiency.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-slate-900">Scoring System</h3>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-slate-50 rounded-xl p-6 border border-green-200">
              <p className="text-slate-700 mb-4">
                Points are awarded based on the quality and strategic fit of your decisions:
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <p className="text-sm text-slate-600">
                    <strong className="text-slate-900">Strategic Alignment:</strong> Decisions that work well together earn bonus points
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <p className="text-sm text-slate-600">
                    <strong className="text-slate-900">Market Position:</strong> Strong competitive positioning increases your score
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <p className="text-sm text-slate-600">
                    <strong className="text-slate-900">Operational Efficiency:</strong> Balanced cost and growth decisions earn more points
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <p className="text-sm text-slate-600">
                    <strong className="text-slate-900">Innovation:</strong> Adopting new technologies and strategies provides advantages
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-6 h-6 text-amber-600" />
              <h3 className="text-xl font-bold text-slate-900">Winning Tips</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <div className="font-semibold text-slate-900 mb-1">Think Long-Term</div>
                <p className="text-sm text-slate-600">
                  Building infrastructure early may cost more but pays off in later rounds with better operational efficiency.
                </p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <div className="font-semibold text-slate-900 mb-1">Balance Speed and Coverage</div>
                <p className="text-sm text-slate-600">
                  Ultra-fast delivery is impressive but requires dense dark store networks. Consider your market strategy carefully.
                </p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <div className="font-semibold text-slate-900 mb-1">Watch Your Competitors</div>
                <p className="text-sm text-slate-600">
                  Check the leaderboard and analytics tabs to see how your strategy compares to other players.
                </p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <div className="font-semibold text-slate-900 mb-1">Don't Ignore Technology</div>
                <p className="text-sm text-slate-600">
                  AI routing, demand forecasting, and automation can significantly improve your operations and profitability.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-900">Progressive Unlocks</h3>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <p className="text-slate-700 mb-4">
                New product categories unlock each round, allowing you to expand your offerings:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="bg-white rounded-lg p-2 border border-blue-200">
                  <div className="font-semibold text-blue-600">Round 1</div>
                  <div className="text-slate-600">Groceries & Staples</div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-blue-200">
                  <div className="font-semibold text-blue-600">Round 2</div>
                  <div className="text-slate-600">Personal Care</div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-blue-200">
                  <div className="font-semibold text-blue-600">Round 3</div>
                  <div className="text-slate-600">Pharmacy</div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-blue-200">
                  <div className="font-semibold text-blue-600">Round 4</div>
                  <div className="text-slate-600">Ready-to-Eat</div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-blue-200">
                  <div className="font-semibold text-blue-600">Round 5</div>
                  <div className="text-slate-600">Electronics</div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-blue-200">
                  <div className="font-semibold text-blue-600">Round 6</div>
                  <div className="text-slate-600">Beauty & Fashion</div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-blue-200">
                  <div className="font-semibold text-blue-600">Round 7</div>
                  <div className="text-slate-600">Premium Goods</div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-blue-200">
                  <div className="font-semibold text-blue-600">Round 8</div>
                  <div className="text-slate-600">B2B Expansion</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            Got It, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
}
