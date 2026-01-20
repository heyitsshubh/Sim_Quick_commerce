import { Zap, Users, Trophy, TrendingUp, Package, Truck, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function WelcomeScreen(){
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 shadow-2xl">
              <Zap className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Quick Commerce Simulation
          </h1>
          <p className="text-2xl text-slate-700 font-medium mb-2">
            Build India's Fastest Delivery Network!
          </p>
          <p className="text-lg text-slate-600 mb-6">
            Compete like Blinkit, Zepto, Swiggy Instamart, Dunzo Daily
          </p>

          <div className="flex justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium">320+ Decisions</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-medium">8 Rounds</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-medium">Real Strategy</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Game Overview</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <Users className="w-10 h-10 text-blue-600 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">Compete</h3>
              <p className="text-sm text-slate-600">Play against other students and make strategic decisions</p>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <TrendingUp className="w-10 h-10 text-green-600 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">8 Rounds</h3>
              <p className="text-sm text-slate-600">Progressive unlocks with 320+ decisions to master</p>
            </div>

            <div className="bg-amber-50 rounded-xl p-6">
              <Trophy className="w-10 h-10 text-amber-600 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">Win Big</h3>
              <p className="text-sm text-slate-600">Highest scoring player wins based on strategy</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-slate-900 mb-4">Progressive Unlock System</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { round: 1, title: 'Groceries & Staples' },
                { round: 2, title: 'Personal Care' },
                { round: 3, title: 'Pharmacy & Health' },
                { round: 4, title: 'Ready-to-Eat' },
                { round: 5, title: 'Electronics' },
                { round: 6, title: 'Beauty & Fashion' },
                { round: 7, title: 'Premium' },
                { round: 8, title: 'B2B Expansion' },
              ].map((item) => (
                <div key={item.round} className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="text-xs font-medium text-blue-600 mb-1">Round {item.round}</div>
                  <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <h3 className="font-semibold text-slate-900">Decision Categories:</h3>
            <div className="grid md:grid-cols-2 gap-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Business Model & Positioning
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Product Categories (Progressive!)
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Dark Store Infrastructure
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Delivery Fleet & Logistics
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Technology & Platform
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Pricing & Economics
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Marketing & Growth
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Operations & Staffing
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/setup')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-4 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
