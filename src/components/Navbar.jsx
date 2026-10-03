import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  MessageCircle, 
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
  const [buyersDropdownOpen, setBuyersDropdownOpen] = useState(false);

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-50 bg-[#071c35] text-white border-b border-slate-800 shadow-lg">
      
      {/* 99acres-Style Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Left: Brand Logo & City Selector Dropdown */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <img 
                src="/logo.svg" 
                alt="Gurdaspur Property" 
                className="h-10 sm:h-12 w-auto object-contain brightness-110 group-hover:scale-105 transition-transform" 
              />
            </a>

            {/* City Dropdown (Exact 99acres "All India ▾" style -> "Gurdaspur ▾") */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-colors border border-slate-700/60 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedLocality || "Gurdaspur"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-900 text-left">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                    Select Locality in Gurdaspur
                  </div>
                  {GURDASPUR_LOCALITIES.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        if (setSelectedLocality) setSelectedLocality(loc);
                        setCityDropdownOpen(false);
                        const el = document.getElementById('listings');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Center Links (99acres: For Buyers | For Tenants | For Owners | For Dealers | Insights [NEW]) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-200">
            
            <button
              onClick={() => {
                setActiveFilter("all");
                const el = document.getElementById('listings');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              For Buyers
            </button>

            <button
              onClick={() => {
                setActiveFilter("rent");
                const el = document.getElementById('listings');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              For Tenants
            </button>

            <button
              onClick={onOpenPostProperty}
              className="hover:text-white transition-colors cursor-pointer"
            >
              For Owners
            </button>

            <a
              href="#nri-desk"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>NRI Desk</span>
            </a>

            {/* Insights [NEW] Badge - 99acres hallmark */}
            <button
              onClick={onOpenStampDuty}
              className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Insights</span>
              <span className="bg-rose-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                NEW
              </span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            
            {/* 99acres-Style "Post property FREE" White Pill Button */}
            <button
              onClick={onOpenPostProperty}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-slate-900 font-extrabold text-xs shadow-md hover:bg-slate-100 transition-all cursor-pointer hover:scale-105"
            >
              <span>Post property</span>
              <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-1.5 py-0.2 rounded">
                FREE
              </span>
            </button>

            {/* Support / Customer Helpline (Headphone icon) */}
            <a
              href={`tel:${settings.primaryPhone}`}
              title={`Customer Helpline: ${settings.primaryPhone}`}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Headphones className="w-4 h-4" />
            </a>

            {/* User / Admin Login Icon */}
            <button
              onClick={onOpenAdmin}
              title="Admin Portal Login"
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-200 hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#071c35] px-4 pt-4 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            <button
              onClick={() => { setActiveFilter("all"); setMobileMenuOpen(false); const el = document.getElementById('listings'); if(el) el.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-left px-3 py-2 rounded-xl bg-slate-900 font-bold text-xs text-white"
            >
              🏢 For Buyers
            </button>
            <button
              onClick={() => { setActiveFilter("rent"); setMobileMenuOpen(false); const el = document.getElementById('listings'); if(el) el.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-left px-3 py-2 rounded-xl bg-slate-900 font-bold text-xs text-white"
            >
              🔑 For Tenants
            </button>
            <button
              onClick={() => { onOpenPostProperty(); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-xl bg-slate-900 font-bold text-xs text-white"
            >
              📝 For Owners
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); const el = document.getElementById('nri-desk'); if(el) el.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-left px-3 py-2 rounded-xl bg-slate-900 font-bold text-xs text-white"
            >
              ✈️ NRI Desk
            </button>
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => { onOpenStampDuty(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-blue-950 text-blue-200 font-bold text-xs border border-blue-800"
            >
              <span>Punjab Registry & Stamp Duty (2026)</span>
              <span>→</span>
            </button>

            <button
              onClick={() => { onOpenCalculator(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-950 text-amber-200 font-bold text-xs border border-amber-800"
            >
              <span>Marla / Kanal Land Converter</span>
              <span>→</span>
            </button>

            <div className="pt-3 flex justify-between items-center text-xs text-slate-400 border-t border-slate-800">
              <a href={`tel:${settings.primaryPhone}`} className="text-white font-bold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                {settings.primaryPhone}
              </a>
              <button
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                className="text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                Admin Login
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
