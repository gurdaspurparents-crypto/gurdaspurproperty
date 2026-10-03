import React from 'react';
import { 
  FileCheck2, 
  MapPin, 
  ShieldAlert, 
  BadgePercent, 
  Users2, 
  PhoneCall,
  MessageCircle,
  Landmark,
  Scale
} from 'lucide-react';

export default function ConsultantServices({ settings }) {
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const services = [
    {
      icon: FileCheck2,
      color: "from-emerald-500 to-teal-600",
      title: "Tehsil Registry & Inteqaal",
      desc: "Complete documentation support at Gurdaspur Tehsil. Legal title verification, Fard checking, stamp duty calculation, and swift Mutation (Inteqaal) clearance."
    },
    {
      icon: Scale,
      color: "from-blue-500 to-indigo-600",
      title: "Fair Market Valuation & DC Rates",
      desc: "Get transparent evaluation based on actual ground transactions. Know the genuine difference between Punjab Govt Collector/DC rates and realistic market demand."
    },
    {
      icon: ShieldAlert,
      color: "from-amber-500 to-orange-600",
      title: "NRI Property Care & Dispute Checks",
      desc: "Dedicated advisory for non-resident Punjabis. We inspect boundaries, verify unauthorized encroachments, handle tenant leasing, and safeguard your assets."
    },
    {
      icon: Landmark,
      color: "from-purple-500 to-pink-600",
      title: "Bank Home & Plot Loan Guidance",
      desc: "Fast-track loan files through our banking partners (SBI, HDFC, Punjab National Bank). Up to 80% financing on verified residential properties."
    }
  ];

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
            Professional Real Estate Advisory
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] mt-3 mb-4">
            Kyun Chunein <span className="text-emerald-400">Gurdaspur Property Consultants</span>?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Property khareedna ya bechna life ka sabse bada faisla hota hai. Hum ensure karte hain ki aapki deal 100% legal, safe aur transparent ho.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${srv.color} flex items-center justify-center text-white mb-5 shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-['Outfit'] group-hover:text-emerald-300 transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {srv.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Direct Call Banner */}
        <div className="mt-14 bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-xs">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-white">
              Koi Bhi Sawaal Ya Registry Enquiry Hai?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1">
              Direct baat karein hamare property consultant se aur free guidance lein.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 mt-2 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Office: {settings.officeAddress}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:${settings.primaryPhone}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-md"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>{settings.primaryPhone}</span>
            </a>

            <a
              href={`https://wa.me/${cleanPhone}?text=Hi%20Gurdaspur%20Property,%20I%20need%20consultancy%20for%20property%20deal.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/30"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
