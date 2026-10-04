import React from 'react';
import { 
  Globe2, 
  ShieldCheck, 
  Camera, 
  FileText, 
  Scale, 
  MessageCircle, 
  Phone,
  Plane,
  Building
} from 'lucide-react';

export default function NRIPropertyCorner({ settings }) {
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const nriServices = [
    {
      icon: Camera,
      title: "Physical & Drone Inspection",
      desc: "Live video calls and HD aerial drone footage of your plots or agricultural land in Gurdaspur so you know the exact ground reality from Canada, UK, or USA."
    },
    {
      icon: ShieldCheck,
      title: "Encroachment & Possession Defense",
      desc: "Regular boundary wall maintenance, signboard installation, and immediate intervention in case of unauthorized possession attempts."
    },
    {
      icon: FileText,
      title: "Revenue & Tehsil Fard Checking",
      desc: "Complete Jamabandi, Inteqaal (Mutation) verification and title search at Gurdaspur Sub-Registrar to ensure clean ownership without hidden disputes."
    },
    {
      icon: Scale,
      title: "Power of Attorney (POA) Transactions",
      desc: "100% legal assistance in executing Special/General Power of Attorney through Indian High Commissions abroad for safe property sale or purchase."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden border-y border-slate-800">
      
      {/* Decorative World Map Grid / Dots */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:28px_28px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Pill & Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span>Dedicated NRI Real Estate Cell • Gurdaspur</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] tracking-tight mb-5">
            Overseas Punjabis Trust Us with Their <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">Land & Legacy</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Managing ancestral properties or buying new high-growth assets in Gurdaspur while living in Canada, UK, Australia, or USA can be stressful. We act as your reliable, on-ground legal eyes and ears.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {nriServices.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Drone & Ground Verification Visual Card */}
        <div className="mb-16 bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 relative h-64 sm:h-80 overflow-hidden">
              <img 
                src="/images/properties/nri_drone_reconnaissance.jpg" 
                alt="NRI Drone Inspection in Gurdaspur"
                className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-emerald-500 text-slate-950 font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                  <Camera className="w-3.5 h-3.5" />
                  Live Ground & Drone Reconnaissance
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 sm:p-8">
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
                Full Transparency for Non-Resident Indians
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white mt-1 mb-3">
                Live Video Tours & Drone Reconnaissance
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                Before sending earnest money or registry payments, receive 4K drone videography showing current neighborhood development, approach road status, boundary pillars, and utility connections.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200">GPS Demarcation</span>
                </div>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200">Live WhatsApp Call</span>
                </div>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200">Jamabandi Verification</span>
                </div>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200">POA Sale Legal Care</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NRI VIP Contact Banner */}
        <div className="bg-gradient-to-r from-emerald-900/50 via-teal-900/40 to-slate-900/90 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 backdrop-blur-md">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Direct NRI Desk • Timezone Flexible
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">
              Own Property in Gurdaspur or Looking to Invest?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/80 max-w-xl">
              Schedule a private WhatsApp video consultation with our principal consultant. We share verified revenue records, current market rates, and high-yielding opportunities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={`https://wa.me/${cleanPhone}?text=Hi%20Gurdaspur%20Property,%20I%20am%20an%20NRI%20looking%20for%20property%20assistance%20in%20Gurdaspur.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950 text-emerald-500" />
              <span>Connect on WhatsApp NRI Desk</span>
            </a>

            <a
              href={`tel:${settings.primaryPhone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Direct Calling: {settings.primaryPhone}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
