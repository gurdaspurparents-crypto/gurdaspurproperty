import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  MessageCircle,
  Lock
} from 'lucide-react';
import { GURDASPUR_LOCALITIES } from '../data/initialProperties';

export default function Footer({ 
  settings, 
  onOpenAdmin, 
  onOpenCalculator, 
  onOpenPostProperty,
  setSelectedLocality
}) {
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand & Office */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.svg" 
                alt="Gurdaspur Property" 
                className="h-14 w-auto object-contain brightness-110"
              />
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              Gurdaspur's dedicated real estate advisory and property discovery portal. We connect genuine buyers with title-verified plots, residential houses, commercial SCOs, and agricultural land.
            </p>

            <div className="space-y-2 pt-1 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{settings.officeAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href={`tel:${settings.primaryPhone}`} className="hover:text-white transition-colors">
                  {settings.primaryPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{settings.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Gurdaspur Localities */}
          <div>
            <h4 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider mb-4">
              Prime Localities
            </h4>
            <ul className="space-y-2">
              {["Tibri Road", "Jail Road", "Trimmu Road", "Hanuman Chowk", "Dinanagar Bypass", "Hardochhani Road"].map((loc) => (
                <li key={loc}>
                  <button 
                    onClick={() => {
                      setSelectedLocality(loc);
                      window.scrollTo({ top: 600, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    Properties on {loc}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services & Tools */}
          <div>
            <h4 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider mb-4">
              Services & Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenCalculator} className="text-amber-400 hover:text-amber-300 font-semibold text-left">
                  Punjab Land Unit Calculator
                </button>
              </li>
              <li>
                <button onClick={onOpenPostProperty} className="text-emerald-400 hover:text-emerald-300 font-semibold text-left">
                  Post Your Property (Free)
                </button>
              </li>
              <li>
                <span className="text-slate-400">Tehsil Registry Support</span>
              </li>
              <li>
                <span className="text-slate-400">Mutation (Inteqaal) Checks</span>
              </li>
              <li>
                <span className="text-slate-400">NRI Property Safeguard</span>
              </li>
              <li>
                <span className="text-slate-400">Home Loan Processing</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Contact */}
          <div>
            <h4 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider mb-4">
              Quick Connect
            </h4>
            <p className="text-slate-400 text-xs mb-4">
              Have questions about current circle rates or registry expenses? Reach out directly.
            </p>

            <a
              href={`https://wa.me/${cleanPhone}?text=Hi%20Gurdaspur%20Property,%20I%20have%20an%20inquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors w-full justify-center mb-2"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
              <span>Chat on WhatsApp</span>
            </a>

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 mt-2"
            >
              <Lock className="w-3 h-3" />
              <span>Consultant Admin Login</span>
            </button>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            © {new Date().getFullYear()} <strong>GurdaspurProperty.in</strong>. All Rights Reserved. Built for Gurdaspur real estate consultants & property seekers.
          </p>

          <p className="text-slate-400 max-w-md text-center md:text-right">
            Disclaimer: Property details and prices are provided for advisory and listing purposes. Always verify legal documents, title deeds, and mutation at the Gurdaspur Revenue Office / Tehsil before monetary transactions.
          </p>
        </div>

      </div>
    </footer>
  );
}
