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
      image: "/images/properties/gurdaspur_real_kothi.jpg",
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
      image: "/images/properties/gurdaspur_drawing_room.jpg",
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
      image: "/images/properties/gurdaspur_commercial_sco.jpg",
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
      image: "/images/properties/sell_property_handover.jpg",
      action: onOpenPostProperty
    },
    {
      id: "plots",
      title: "Plots/Land",
      subtitle: "Residential & Agri",
      image: "/images/properties/gurdaspur_plotted_colony.jpg",
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
      badgeColor: "bg-blue-600",
      image: "/images/properties/punjab_stamp_duty_deed.jpg",
      action: onOpenStampDuty
    },
    {
      id: "nri",
      title: "NRI Property Desk",
      subtitle: "Drone & Jamabandi Care",
      badge: "NRI",
      badgeColor: "bg-emerald-600",
      image: "/images/properties/nri_drone_reconnaissance.jpg",
      action: () => {
        const el = document.getElementById('nri-desk');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  ];

  return (
    <section className="bg-white py-8 sm:py-10 border-b border-slate-200">
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
