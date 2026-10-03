import React from 'react';
import { 
  ChevronRight, 
  Sparkles, 
  TrendingUp, 
  FileCheck2, 
  Globe2, 
  Key, 
  LandPlot, 
  Home, 
  ArrowRight 
} from 'lucide-react';

export default function ExploringRealEstateOptions({ 
  onSelectCategory, 
  onSelectPurpose, 
  onOpenPostProperty, 
  onOpenStampDuty,
  onOpenCalculator
}) {
  const options = [
    {
      id: "buying",
      title: "Buying a home",
      subtitle: "Villas & Houses",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80",
      action: () => {
        onSelectPurpose("buy");
        onSelectCategory("kothi");
        const el = document.getElementById('listings');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: "renting",
      title: "Renting a home",
      subtitle: "Independent Floors",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=80",
      action: () => {
        onSelectPurpose("rent");
        const el = document.getElementById('listings');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: "invest",
      title: "Invest in Real Estate",
      subtitle: "Commercial SCO & Plots",
      badge: "NEW",
      badgeColor: "bg-rose-500",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=500&q=80",
      action: () => {
        onSelectCategory("commercial");
        const el = document.getElementById('listings');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: "sell",
      title: "Sell/Rent your property",
      bannerText: "Sell faster at the right price!",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80",
      action: onOpenPostProperty
    },
    {
      id: "plots",
      title: "Plots/Land",
      subtitle: "Residential & Agri",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=500&q=80",
      action: () => {
        onSelectCategory("plot");
        const el = document.getElementById('listings');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: "insights",
      title: "Explore Insights",
      subtitle: "Stamp Duty & Collector Rates",
      badge: "NEW",
      badgeColor: "bg-amber-500",
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=500&q=80",
      action: onOpenStampDuty
    },
    {
      id: "nri",
      title: "NRI Property Desk",
      subtitle: "Drone & Jamabandi Care",
      badge: "NRI",
      badgeColor: "bg-emerald-600",
      image: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=500&q=80",
      action: () => {
        const el = document.getElementById('nri-desk');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  ];

  return (
    <section className="bg-white pt-20 sm:pt-24 pb-12 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-500 font-['Outfit']">
            Get Started with Exploring Real Estate Options
          </h2>
          <div className="text-xs text-slate-400 hidden sm:block">
            Verified ground listings in Gurdaspur
          </div>
        </div>

        {/* Horizontal Scroll Carousel */}
        <div className="relative group">
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth">
            {options.map((opt) => (
              <div
                key={opt.id}
                onClick={opt.action}
                className="flex-shrink-0 w-44 sm:w-48 bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer group/card flex flex-col hover:-translate-y-1"
              >
                {/* Image Banner */}
                <div className="relative h-28 w-full overflow-hidden bg-slate-200">
                  <img 
                    src={opt.image} 
                    alt={opt.title}
                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {opt.badge && (
                    <span className={`absolute top-2 left-2 ${opt.badgeColor} text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm`}>
                      {opt.badge}
                    </span>
                  )}
                  {opt.bannerText && (
                    <div className="absolute top-2 left-2 right-2 bg-blue-900/90 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-xs leading-tight">
                      {opt.bannerText}
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="p-3 text-left flex-1 flex flex-col justify-between">
                  <div className="text-xs font-bold text-slate-900 group-hover/card:text-blue-600 transition-colors line-clamp-1 font-['Outfit']">
                    {opt.title}
                  </div>
                  {opt.subtitle && (
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {opt.subtitle}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right Scroll Arrow Indicator */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 hidden lg:flex w-10 h-10 rounded-full bg-white shadow-xl border border-slate-200 items-center justify-center text-slate-700 pointer-events-none group-hover:scale-110 transition-transform">
            <ChevronRight className="w-5 h-5 text-slate-700" />
          </div>
        </div>

      </div>
    </section>
  );
}
