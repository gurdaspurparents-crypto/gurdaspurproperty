import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  PlusCircle, 
  ShieldCheck, 
  Calculator, 
  Menu, 
  X, 
  MapPin, 
  Lock, 
  Globe2, 
  FileCheck2, 
  TrendingUp, 
  Sparkles,
  Headphones,
  User,
  ChevronDown
} from 'lucide-react';
import { GURDASPUR_LOCALITIES } from '../data/initialProperties';

export default function Navbar({ 
  settings, 
  onOpenPostProperty, 
  onOpenCalculator, 
  onOpenStampDuty, 
  onOpenAdmin, 
  activeFilter, 
  setActiveFilter,
  selectedLocality,
  setSelectedLocality
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#06152b]/95 backdrop-blur-xl text-white border-b border-slate-800/80 shadow-2xl shadow-black/30">
      
      {/* Top Luxury Gradient Hairline */}
      <div className="h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-teal-400/20 w-full"></div>

      {/* Main Luxury Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Left: Brand Logo & Locality Dropdown */}
          <div className="flex items-center gap-3 sm:gap-5">
            
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group shrink-0">
              <div className="relative">
                <img 
                  src="/logo.svg" 
                  alt="Gurdaspur Property" 
                  className="h-10 sm:h-11 w-auto object-contain brightness-110 group-hover:scale-105 transition-all drop-shadow-[0_2px_12px_rgba(16,185,129,0.25)]" 
                />
              </div>
            </a>

            {/* City / Locality Selector Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-emerald-500/50 shadow-sm transition-all cursor-pointer group"
                title="Filter properties by locality in Gurdaspur"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                <span className="truncate max-w-[130px] font-semibold">{selectedLocality || "Gurdaspur"}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {cityDropdownOpen && (
                <div className="absolute top-full left-0 mt-2.5 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 text-slate-900 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                    <span>Localities in Gurdaspur</span>
                    <span className="text-emerald-600 font-bold">{GURDASPUR_LOCALITIES.length} Areas</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {GURDASPUR_LOCALITIES.map((loc) => {
                      const isCurrent = selectedLocality === loc;
                      return (
                        <button
                          key={loc}
                          onClick={() => {
                            if (setSelectedLocality) setSelectedLocality(loc);
                            setCityDropdownOpen(false);
                            const el = document.getElementById('listings');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                            isCurrent 
                              ? 'bg-emerald-50 text-emerald-800 font-bold' 
                              : 'hover:bg-slate-50 hover:text-emerald-700 text-slate-700'
                          }`}
                        >
                          <span>{loc}</span>
                          {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Center Links (Fintech / Luxury Style with soft micro-pills) */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-xs font-semibold text-slate-300">
            
            <button
              onClick={() => {
                setActiveFilter("all");
                const el = document.getElementById('listings');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'text-white bg-white/10 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              For Buyers
            </button>

            <button
              onClick={() => {
                setActiveFilter("rent");
                const el = document.getElementById('listings');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                activeFilter === 'rent'
                  ? 'text-white bg-white/10 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              For Tenants
            </button>

            <button
              onClick={onOpenPostProperty}
              className="px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              For Owners
            </button>

            {/* Land Converter */}
            <button
              onClick={onOpenCalculator}
              className="px-3 py-1.5 rounded-full text-slate-300 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>Land Converter</span>
            </button>

            {/* NRI Desk */}
            <a
              href="#nri-desk"
              className="px-3 py-1.5 rounded-full text-slate-300 hover:text-teal-300 hover:bg-teal-500/10 transition-all flex items-center gap-1.5"
            >
              <Globe2 className="w-3.5 h-3.5 text-teal-400" />
              <span>NRI Desk</span>
            </a>

            {/* Insights [NEW] Badge */}
            <button
              onClick={onOpenStampDuty}
              className="px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Insights</span>
              <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm shadow-rose-500/30">
                NEW
              </span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Highlighted "Post Property FREE" Luxury Glowing Button */}
            <button
              onClick={onOpenPostProperty}
              className="group relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:via-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/50 border border-emerald-300/80 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Post Your Property (100% Free)"
            >
              <PlusCircle className="w-4 h-4 text-slate-950 shrink-0 group-hover:rotate-90 transition-transform duration-300" />
              <span className="tracking-tight">Post Property</span>
              <span className="bg-slate-950 text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-inner tracking-wider animate-pulse">
                FREE
              </span>
            </button>

            {/* Support / Customer Helpline (Headphone icon) */}
            <a
              href={`tel:${settings.primaryPhone}`}
              title={`Customer Helpline: ${settings.primaryPhone}`}
              className="px-2.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-600 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <Headphones className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline text-[11px] font-bold text-slate-300">Help</span>
            </a>

            {/* User / Admin Login Pill */}
            <button
              onClick={onOpenAdmin}
              title="Admin Portal Login"
              className="px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-600 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline text-xs font-bold">Admin</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-slate-200 hover:bg-white/10 transition-colors"
              aria-label="Open Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/80 bg-[#06152b] px-4 pt-4 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Highlighted Mobile Post Property Button */}
          <button
            onClick={() => { onOpenPostProperty(); setMobileMenuOpen(false); }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-between border border-emerald-300 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-slate-950" />
              <span>Post Your Property (Free)</span>
            </span>
            <span className="bg-slate-950 text-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full animate-pulse">
              FREE
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            <button
              onClick={() => { setActiveFilter("all"); setMobileMenuOpen(false); const el = document.getElementById('listings'); if(el) el.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-left px-3 py-2.5 rounded-xl bg-slate-900/90 font-bold text-xs text-white border border-slate-800"
            >
              🏢 For Buyers
            </button>
            <button
              onClick={() => { setActiveFilter("rent"); setMobileMenuOpen(false); const el = document.getElementById('listings'); if(el) el.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-left px-3 py-2.5 rounded-xl bg-slate-900/90 font-bold text-xs text-white border border-slate-800"
            >
              🔑 For Tenants
            </button>
            <button
              onClick={() => { onOpenPostProperty(); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2.5 rounded-xl bg-slate-900/90 font-bold text-xs text-white border border-slate-800"
            >
              📝 For Owners
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); const el = document.getElementById('nri-desk'); if(el) el.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-left px-3 py-2.5 rounded-xl bg-slate-900/90 font-bold text-xs text-white border border-slate-800"
            >
              ✈️ NRI Desk
            </button>
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => { onOpenStampDuty(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-blue-950/80 text-blue-200 font-bold text-xs border border-blue-800/80"
            >
              <span>Punjab Registry & Stamp Duty (2026)</span>
              <span>→</span>
            </button>

            <button
              onClick={() => { onOpenCalculator(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-950/80 text-amber-200 font-bold text-xs border border-amber-800/80"
            >
              <span>Marla / Kanal Land Converter</span>
              <span>→</span>
            </button>

            <div className="pt-3 flex justify-between items-center text-xs text-slate-400 border-t border-slate-800">
              <a href={`tel:${settings.primaryPhone}`} className="text-white font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                {settings.primaryPhone}
              </a>
              <button
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                className="text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Lock className="w-3 h-3 text-emerald-400" />
                Admin Login
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
