import React from 'react';
import { 
  TrendingUp, 
  MapPin, 
  ArrowUpRight, 
  ShieldCheck, 
  Building2,
  Sparkles
} from 'lucide-react';
import { LOCALITY_TRENDS } from '../data/initialProperties';

export default function LocalitiesGuide({ onSelectLocality }) {
  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gurdaspur Real Estate Market Intelligence</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
              Prime Investment Corridors in Gurdaspur
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Average circle & market rates across key residential and commercial sectors in Gurdaspur, verified through actual ground deals.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Updated for Q4 2026 • Tehsil Gurdaspur Circle Analysis
          </div>
        </div>

        {/* 4 Corridors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LOCALITY_TRENDS.map((loc, idx) => (
            <div 
              key={idx}
              className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-500/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${loc.accent}`}>
                    {loc.tag}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3" />
                    {loc.growth}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] group-hover:text-emerald-700 transition-colors mb-2">
                  {loc.name}
                </h3>

                {/* Price Display */}
                <div className="bg-white p-3 rounded-2xl border border-slate-200/60 mb-3 shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Current Market Range</div>
                  <div className="text-base font-black text-slate-900 font-['Outfit'] mt-0.5">
                    {loc.priceRange}
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {loc.highlights}
                </p>
              </div>

              <button
                onClick={() => {
                  const areaKey = loc.name.split(' ')[0]; // 'Tibri', 'Jail', 'Dinanagar', 'Trimmu'
                  onSelectLocality(areaKey);
                  const el = document.getElementById('listings');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all flex items-center justify-center gap-1 group/btn shadow-2xs cursor-pointer"
              >
                <span>Explore Properties Here</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
