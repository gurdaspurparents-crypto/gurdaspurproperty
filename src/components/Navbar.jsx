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
  Sparkles
} from 'lucide-react';

export default function Navbar({ 
  settings, 
  onOpenPostProperty, 
  onOpenCalculator, 
  onOpenStampDuty,
  onOpenAdmin,
  activeFilter,
  setActiveFilter
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200">
      
      {/* Top micro bar with live ticker and NRI tag */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Gurdaspur's Leading Real Estate & Tehsil Registry Advisory
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Serving Gurdaspur, Dinanagar, Batala, Dhariwal & surrounding areas
            </span>
          </div>

          <div className="flex items-center gap-5">
            <button 
              onClick={onOpenStampDuty}
              className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Punjab Stamp Duty Rates (2026)</span>
            </button>
            <span className="text-slate-600">|</span>
            <a 
              href="#nri-desk" 
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold transition-colors"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>NRI Property Desk</span>
            </a>
            <span className="text-slate-600">|</span>
            <button 
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors text-xs cursor-pointer"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group">
              <img 
                src="/logo.svg" 
                alt="Gurdaspur Property" 
                className="h-12 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-bold text-slate-700">
            <button 
              onClick={() => { setActiveFilter("all"); const el = document.getElementById('listings'); if(el) el.scrollIntoView({ behavior: "smooth" }); }}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${activeFilter === "all" ? "text-emerald-800 bg-emerald-50 shadow-2xs" : "hover:text-emerald-700 hover:bg-slate-50"}`}
            >
              All Listings
            </button>
            <button 
              onClick={() => { setActiveFilter("plot"); const el = document.getElementById('listings'); if(el) el.scrollIntoView({ behavior: "smooth" }); }}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${activeFilter === "plot" ? "text-emerald-800 bg-emerald-50 shadow-2xs" : "hover:text-emerald-700 hover:bg-slate-50"}`}
            >
              Plots
            </button>
            <button 
              onClick={() => { setActiveFilter("kothi"); const el = document.getElementById('listings'); if(el) el.scrollIntoView({ behavior: "smooth" }); }}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${activeFilter === "kothi" ? "text-emerald-800 bg-emerald-50 shadow-2xs" : "hover:text-emerald-700 hover:bg-slate-50"}`}
            >
              Luxury Kothis
            </button>
            <button 
              onClick={() => { setActiveFilter("commercial"); const el = document.getElementById('listings'); if(el) el.scrollIntoView({ behavior: "smooth" }); }}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${activeFilter === "commercial" ? "text-emerald-800 bg-emerald-50 shadow-2xs" : "hover:text-emerald-700 hover:bg-slate-50"}`}
            >
              Commercial
            </button>
            <button 
              onClick={() => { setActiveFilter("land"); const el = document.getElementById('listings'); if(el) el.scrollIntoView({ behavior: "smooth" }); }}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${activeFilter === "land" ? "text-emerald-800 bg-emerald-50 shadow-2xs" : "hover:text-emerald-700 hover:bg-slate-50"}`}
            >
              Agricultural Land
            </button>

            {/* Punjab Calculators Dropdown / Buttons */}
            <button 
              onClick={onOpenStampDuty}
              className="px-3 py-2 rounded-xl text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 flex items-center gap-1.5 transition-all cursor-pointer border border-emerald-200/60"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Registry Cost</span>
            </button>

            <button 
              onClick={onOpenCalculator}
              className="px-3 py-2 rounded-xl text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center gap-1.5 transition-all cursor-pointer border border-amber-200/80"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-700" />
              <span>Marla/Kanal Tool</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenPostProperty}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition-all cursor-pointer shadow-xs hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              <span>Post Property (Free)</span>
            </button>

            <a
              href={`https://wa.me/${cleanPhone}?text=Hi%20Gurdaspur%20Property,%20I%20am%20looking%20for%20property%20consultation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.03] cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
              <span className="hidden md:inline">WhatsApp: {settings.primaryPhone}</span>
              <span className="md:hidden">WhatsApp</span>
            </a>

            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-6 space-y-3 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <button 
              onClick={() => { setActiveFilter("all"); setMobileMenuOpen(false); const el = document.getElementById('listings'); if(el) el.scrollIntoView({ behavior: "smooth" }); }}
              className="text-left px-3 py-2.5 rounded-xl bg-slate-50 font-bold text-xs text-slate-800"
            >
              🏢 All Properties
            </button>
            <button 
              onClick={() => { setActiveFilter("plot"); setMobileMenuOpen(false); const el = document.getElementById('listings'); if(el) el.scrollIntoView({ behavior: "smooth" }); }}
              className="text-left px-3 py-2.5 rounded-xl bg-slate-50 font-bold text-xs text-slate-800"
            >
              📐 Plots Only
            </button>
            <button 
              onClick={() => { setActiveFilter("kothi"); setMobileMenuOpen(false); const el = document.getElementById('listings'); if(el) el.scrollIntoView({ behavior: "smooth" }); }}
              className="text-left px-3 py-2.5 rounded-xl bg-slate-50 font-bold text-xs text-slate-800"
            >
              🏡 Luxury Kothis
            </button>
            <button 
              onClick={() => { setActiveFilter("commercial"); setMobileMenuOpen(false); const el = document.getElementById('listings'); if(el) el.scrollIntoView({ behavior: "smooth" }); }}
              className="text-left px-3 py-2.5 rounded-xl bg-slate-50 font-bold text-xs text-slate-800"
            >
              🏬 Commercial SCO
            </button>
          </div>

          <div className="space-y-2 pt-1">
            <button 
              onClick={() => { onOpenStampDuty(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-emerald-50 text-emerald-950 font-bold text-xs border border-emerald-200"
            >
              <span className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-700" />
                Punjab Registry & Stamp Duty Calculator (2026)
              </span>
              <span>→</span>
            </button>

            <button 
              onClick={() => { onOpenCalculator(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-amber-50 text-amber-950 font-bold text-xs border border-amber-200"
            >
              <span className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-700" />
                Punjab Land Unit Converter (Marla/Kanal)
              </span>
              <span>→</span>
            </button>

            <button 
              onClick={() => { onOpenPostProperty(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/30"
            >
              <PlusCircle className="w-4 h-4" />
              Post Your Property For Sale / Rent
            </button>

            <div className="pt-3 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100">
              <a href={`tel:${settings.primaryPhone}`} className="flex items-center gap-1.5 text-slate-800 font-bold">
                <Phone className="w-4 h-4 text-emerald-600" />
                {settings.primaryPhone}
              </a>
              <button 
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-900"
              >
                <Lock className="w-3.5 h-3.5" />
                Admin Login
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
