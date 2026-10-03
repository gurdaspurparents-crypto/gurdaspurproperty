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
  Scale,
  Clock,
  Navigation,
  Compass,
  CheckCircle2
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
            Why Choose <span className="text-emerald-400">Gurdaspur Property Consultants</span>?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Buying or selling real estate is one of life's most significant investments. We ensure every transaction is 100% legally verified, completely secure, and fully transparent.
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

        {/* Office & Direct Visit Consultation Showcase */}
        <div className="mt-16 bg-gradient-to-br from-slate-800/95 via-slate-800/70 to-slate-900/95 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
            
            {/* Left: Office Photo & Ambience */}
            <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[300px] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=85" 
                alt="Travelx Gurdaspur Property Office" 
                className="w-full h-full object-cover object-center filter brightness-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              
              <div className="absolute top-4 left-4">
                <span className="bg-emerald-600/95 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg shadow-md backdrop-blur-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  Official Consultation Desk
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-white font-extrabold text-lg font-['Outfit']">
                  Travelx Gurdaspur Office
                </div>
                <div className="text-slate-300 text-xs flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Batala Road, Gurdaspur</span>
                </div>
              </div>
            </div>

            {/* Right: Address Details & Fast Action CTA */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  Face-To-Face Deals & Registry Guidance
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white mt-1 mb-2">
                  Visit Our Gurdaspur Office
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                  Come sit with our senior property advisors. Review live Jamabandi fards, check collector rates, and verify plot demarcation before committing your funds.
                </p>

                {/* Info Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Head Office Location</div>
                      <div className="text-xs font-semibold text-white mt-0.5">
                        {settings.officeAddress}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Consultation Timings</div>
                      <div className="text-xs font-semibold text-white mt-0.5">
                        {settings.workingHours} (Mon - Sat)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-700/60">
                <a
                  href={`tel:${settings.primaryPhone}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-md"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>Call {settings.primaryPhone}</span>
                </a>

                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello! I would like to schedule an in-person meeting at your Travelx office on Batala Road, Gurdaspur.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/30"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <span>Book In-Person Meeting</span>
                </a>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Travelx, Batala Road, Near Vishal Mega Mart, Gurdaspur, Punjab 143521")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google Maps</span>
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
