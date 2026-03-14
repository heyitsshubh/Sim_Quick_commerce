// Updated Communication.tsx with tag popup filtering
import { useState, useEffect } from "react";
import axios from "axios";
import TopNav from "../components/TopNav";
import RoundsStrip from "../components/RoundStrip";
import { Newspaper, Clock, X, HelpCircle, Timer, Trophy } from "lucide-react";
import useGameRoundSnapshot from "../hooks/useGameRoundSnapshot";

const API = "https://sim-quick-commerce-backend.onrender.com/api/news";

type Article = {
  _id: string;
  type: string;
  headline: string;
  summary: string;
  body: string;
  source: string;
  date: string;
  readTime: string;
  impact?: "positive" | "negative" | "neutral";
  impactAreas?: string[];
  round: number;
};

export default function Communication() {
  const { currentRound, maxRounds, activePlayerScore, formattedTime } = useGameRoundSnapshot();
  const [articles, setArticles] = useState<Article[]>([]);
  const [popupArticles, setPopupArticles] = useState<Article[]>([]);
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const res = await axios.get(API);
    setArticles(res.data);
  };

  const openImpactPopup = async (area: string) => {
    const res = await axios.get(`${API}?impactArea=${area}`);
    setPopupArticles(res.data);
    setOpenPopup(true);
  };

  const featured = articles.find(a=>a.type==="breaking");
  const others = articles.filter(a=>a._id!==featured?._id);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-4">
        <TopNav />
        
        {/* ROUNDS HEADER */}
        <div className="mt-4 bg-white border border-slate-200 rounded-lg shadow-sm px-4 py-4">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900">Round {currentRound} of {maxRounds}</h2>
              <p className="text-sm text-slate-600 mt-1">
                Foundation: Fruits, dairy, cooking staples, snacks, beverages
              </p>

              <div className="mt-3">
                <RoundsStrip currentRound={currentRound} maxRounds={maxRounds} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap bg-slate-100 text-slate-700 px-3 py-2 rounded-md">
                <Timer className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-semibold">{formattedTime}</span>
              </div>

              <button
                onClick={() => {}}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-md transition"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Game Guide</span>
              </button>

              <div className="flex items-center gap-2 text-sm">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-slate-900">{activePlayerScore} pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-sm">
            <Newspaper className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">News & Communication</h1>
            <p className="text-sm text-slate-500">Market intelligence and updates affecting your business</p>
          </div>
        </div>

        {/* Featured Article */}
        {featured && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wide rounded-full">
                Breaking News
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{featured.source}</span>
                <span>•</span>
                <span>{featured.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {featured.readTime}
                </span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-3 leading-tight">{featured.headline}</h2>
            <p className="text-slate-700 mb-4 leading-relaxed">{featured.summary}</p>

            <div className="flex gap-2 flex-wrap">
              {featured.impact && (
                <button 
                  onClick={()=>openImpactPopup(featured.impact === "positive" ? "Positive Impact" : featured.impact === "negative" ? "Negative Impact" : "Neutral")} 
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    featured.impact === "positive" 
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                      : featured.impact === "negative"
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {featured.impact === "positive" ? "Positive Impact" : featured.impact === "negative" ? "Negative Impact" : "Neutral"}
                </button>
              )}
              {featured.impactAreas?.map(area => (
                <button 
                  key={area}
                  onClick={()=>openImpactPopup(area)} 
                  className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Other Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {others.map(article=> (
            <div 
              key={article._id} 
              className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow group min-h-[280px]"
            >
              <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
                <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-base rounded-lg shadow-sm">
                  {article.type}
                </span>
                <span>{article.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                {article.headline}
              </h3>
              <p className="text-base text-slate-600 mb-5 leading-relaxed">{article.summary}</p>
              
              <div className="flex flex-wrap gap-2">
                {article.impactAreas?.map(area=> (
                  <button 
                    key={area} 
                    onClick={()=>openImpactPopup(area)} 
                    className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition font-medium"
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup Modal */}
      {openPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-bold text-xl text-slate-900">Related News Articles</h2>
              <button 
                onClick={()=>setOpenPopup(false)}
                className="p-2 hover:bg-slate-200 rounded-lg transition"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-6">
              {popupArticles.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No related articles found.
                </div>
              ) : (
                <div className="space-y-4">
                  {popupArticles.map(a=> (
                    <div 
                      key={a._id} 
                      className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50/30 transition"
                    >
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <span className="font-medium">{a.source}</span>
                        <span>•</span>
                        <span>{a.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="inline w-3 h-3"/> 
                          {a.readTime}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">{a.headline}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{a.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}