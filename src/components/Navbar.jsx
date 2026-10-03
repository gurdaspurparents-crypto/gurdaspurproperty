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
  Lock
} from 'lucide-react';

export default function Navbar({ 
  settings, 
  onOpenPostProperty, 
  onOpenCalculator, 
  onOpenAdmin,
  activeFilter,
  setActiveFilter
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200">
      {/* Top micro bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Gurdaspur's Trusted Property Network
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Serving Gurdaspur, Dinanagar, Batala, Dhariwal & surrounding areas
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="text-slate-400">Tehsil & Registry Guidance Available</span>
            <button 
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors text-xs cursor-pointer"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-['Outfit']">
                    Gurdaspur<span className="text-emerald-600">Property</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    .in
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Verified Real Estate & Property Advisory
                </p>
              </div>
            </a>
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-700">
            <button 
              onClick={() => { setActiveFilter("all"); window.scrollTo({ top: 600, behavior: "smooth" }); }}
              className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${activeFilter === "all" ? "text-emerald-700 bg-emerald-50" : "hover:text-emerald-600 hover:bg-slate-50"}`}
            >
              All Properties
            </button>
            <button 
              onClick={() => { setActiveFilter("plot"); window.scrollTo({ top: 600, behavior: "smooth" }); }}
              className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${activeFilter === "plot" ? "text-emerald-700 bg-emerald-50" : "hover:text-emerald-600 hover:bg-slate-50"}`}
            >
              Plots
            </button>
            <button 
              onClick={() => { setActiveFilter("kothi"); window.scrollTo({ top: 600, behavior: "smooth" }); }}
              className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${activeFilter === "kothi" ? "text-emerald-700 bg-emerald-50" : "hover:text-emerald-600 hover:bg-slate-50"}`}
            >
              Kothis / House
            </button>
            <button 
              onClick={() => { setActiveFilter("commercial"); window.scrollTo({ top: 600, behavior: "smooth" }); }}
              className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${activeFilter === "commercial" ? "text-emerald-700 bg-emerald-50" : "hover:text-emerald-600 hover:bg-slate-50"}`}
            >
              Commercial
            </button>
            <button 
              onClick={() => { setActiveFilter("land"); window.scrollTo({ top: 600, behavior: "smooth" }); }}
              className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${activeFilter === "land" ? "text-emerald-700 bg-emerald-50" : "hover:text-emerald-600 hover:bg-slate-50"}`}
            >
              Agri Land
            </button>
            <button 
              onClick={onOpenCalculator}
              className="px-3.5 py-2 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
            >
              <Calculator className="w-4 h-4 text-amber-600" />
              Punjab Unit Converter
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenPostProperty}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition-all cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              Post Property (Free)
            </button>

            <a
              href={`https://wa.me/${cleanPhone}?text=Hi%20Gurdaspur%20Property%20Consultant,%20I%20am%20looking%20for%20property%20in%20Gurdaspur.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
              <span className="hidden md:inline">WhatsApp Us</span>
              <span className="md:hidden">WhatsApp</span>
            </a>

            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <button 
              onClick={() => { setActiveFilter("all"); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg bg-slate-50 font-medium text-sm text-slate-800"
            >
              🏢 All Properties
            </button>
            <button 
              onClick={() => { setActiveFilter("plot"); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg bg-slate-50 font-medium text-sm text-slate-800"
            >
              📐 Plots
            </button>
            <button 
              onClick={() => { setActiveFilter("kothi"); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg bg-slate-50 font-medium text-sm text-slate-800"
            >
              🏡 Kothis / Houses
            </button>
            <button 
              onClick={() => { setActiveFilter("commercial"); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg bg-slate-50 font-medium text-sm text-slate-800"
            >
              🏬 Commercial
            </button>
          </div>

          <div className="space-y-2 pt-2">
            <button 
              onClick={() => { onOpenCalculator(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-amber-50 text-amber-900 font-bold text-sm"
            >
              <span className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-600" />
                Punjab Land Unit Converter (Marla/Kanal)
              </span>
              <span>→</span>
            </button>

            <button 
              onClick={() => { onOpenPostProperty(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Post Property For Sale / Rent
            </button>

            <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
              <a href={`tel:${settings.primaryPhone}`} className="flex items-center gap-1 text-slate-700 font-medium">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                {settings.primaryPhone}
              </a>
              <button 
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-900"
              >
                <Lock className="w-3 h-3" />
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
