import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Home, 
  IndianRupee, 
  ShieldCheck, 
  FileCheck2, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  Calculator,
  BadgeCheck,
  Crosshair,
  Mic,
  ChevronDown,
  Building,
  LandPlot,
  X
} from 'lucide-react';
import { GURDASPUR_LOCALITIES } from '../data/initialProperties';

export default function Hero({ 
  searchQuery, 
  setSearchQuery, 
  selectedLocality, 
  setSelectedLocality, 
  selectedPurpose, 
  setSelectedPurpose, 
  selectedCategory, 
  setSelectedCategory, 
  budgetRange, 
  setBudgetRange,
  onOpenCalculator,
  onOpenStampDuty,
  onOpenPostProperty
}) {
  const [propertyTypeDropdownOpen, setPropertyTypeDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('buy'); // 'buy', 'rent', 'commercial', 'plots', 'projects'

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'buy') {
      setSelectedPurpose('buy');
      setSelectedCategory('all');
    } else if (tab === 'rent') {
      setSelectedPurpose('rent');
      setSelectedCategory('all');
    } else if (tab === 'commercial') {
      setSelectedPurpose('buy');
      setSelectedCategory('commercial');
    } else if (tab === 'plots') {
      setSelectedPurpose('buy');
      setSelectedCategory('plot');
    } else if (tab === 'projects') {
      setSelectedPurpose('buy');
      setSelectedCategory('kothi');
    }
  };

  const getDropdownLabel = () => {
    switch (selectedCategory) {
      case 'plot': return 'Residential Plots';
      case 'kothi': return 'Luxury Kothis';
      case 'commercial': return 'Commercial / SCO';
      case 'land': return 'Agricultural Land';
      case 'rent': return 'Rentals';
      default: return 'All Residential';
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const el = document.getElementById('listings');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative bg-[#071c35] text-white pt-8 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* 99acres-Style Panoramic Architectural Hero Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=85" 
          alt="Gurdaspur Real Estate" 
          className="w-full h-full object-cover object-center scale-105 opacity-20 filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071c35] via-[#071c35]/85 to-[#071c35]/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        
        {/* Top Header Row with Event / Expo Card (like 99acres Dubai Luxe Fest Banner) */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10 pt-2">
          
          {/* Left Title */}
          <div className="max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-500/30 text-blue-200 text-xs font-bold uppercase tracking-wider mb-3">
              <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Gurdaspur's #1 Dedicated Real Estate Network</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] tracking-tight leading-tight text-white">
              Apne Shehar <span className="text-emerald-400">Gurdaspur</span> Mein<br/>
              Sahi Plot, Kothi Ya Zameen Chunein
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg leading-relaxed">
              Verified residential plots on Tibri Road, luxury kothis on Jail Road, commercial SCOs, and agricultural lands with 100% Tehsil registry & mutation verification.
            </p>
          </div>

          {/* Right Top Promo Box (Exact 99acres Luxe Fest invitation style) */}
          <div className="bg-gradient-to-br from-blue-950/80 via-slate-900/90 to-blue-900/50 border border-blue-500/30 rounded-2xl p-5 max-w-md shadow-2xl backdrop-blur-md text-left w-full lg:w-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tehsil Registry & Property Fest 2026</span>
            </div>
            <h3 className="text-base font-extrabold text-white font-['Outfit']">
              Official Collector Rates & Fard Verification
            </h3>
            <p className="text-[11px] text-slate-300 mt-1">
              Visit Office: Travelx, Batala Road, Gurdaspur (Near Vishal Mega Mart). Direct consultant guidance without broker delays.
            </p>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-blue-800/40">
              <button
                onClick={onOpenStampDuty}
                className="text-xs font-bold text-blue-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Check Registry Rates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <a
                href="tel:+918146526257"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Call: +91 81465 26257
              </a>
            </div>
          </div>

        </div>

        {/* 99ACRES ICONIC FLOATING WHITE SEARCH WIDGET */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 text-slate-900 border border-slate-200 relative z-20">
          
          {/* Top Tab Bar: Buy | Rent | Commercial | Plots/Land | Projects | Post Property FREE */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-6 sm:gap-8">
              {[
                { id: 'buy', label: 'Buy' },
                { id: 'rent', label: 'Rent' },
                { id: 'new', label: 'New Launch', dot: true },
                { id: 'commercial', label: 'Commercial' },
                { id: 'plots', label: 'Plots/Land' },
                { id: 'projects', label: 'Projects' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative pb-3 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-[#005ca8] font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {tab.label}
                    {tab.dot && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    )}
                  </span>
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#005ca8] rounded-full"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Post Property FREE badge button on right of tab bar */}
            <div className="hidden sm:block shrink-0">
              <button
                onClick={onOpenPostProperty}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <span>Post Property</span>
                <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  FREE
                </span>
              </button>
            </div>
          </div>

          {/* Main Search Input Strip */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 bg-slate-50 rounded-2xl border border-slate-200 p-2 sm:p-2.5">
            
            {/* Segment 1: Category Dropdown (e.g. All Residential ▾) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPropertyTypeDropdownOpen(!propertyTypeDropdownOpen)}
                className="w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-3 bg-white sm:bg-transparent rounded-xl text-xs sm:text-sm font-extrabold text-slate-800 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <span>{getDropdownLabel()}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${propertyTypeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {propertyTypeDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-left">
                  {[
                    { id: 'all', label: 'All Residential' },
                    { id: 'plot', label: 'Residential Plots' },
                    { id: 'kothi', label: 'Luxury Kothis' },
                    { id: 'commercial', label: 'Commercial SCO / Shops' },
                    { id: 'land', label: 'Agricultural Land / Farm' },
                    { id: 'rent', label: 'Rental Properties' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(item.id);
                        setPropertyTypeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                        selectedCategory === item.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vertical Divider */}
            <div className="hidden sm:block w-px h-8 bg-slate-200 mx-2"></div>

            {/* Locality Selector Dropdown */}
            <div className="hidden lg:flex items-center gap-1.5 px-3">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer pr-4"
              >
                {GURDASPUR_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Vertical Divider */}
            <div className="hidden lg:block w-px h-8 bg-slate-200 mx-2"></div>

            {/* Segment 2: Search Input Box */}
            <div className="flex-1 flex items-center gap-2 px-3 py-1">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search "Tibri Road, Jail Road, Dinanagar Bypass, Trimmu..."'
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none py-2"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Segment 3: Crosshair / Near Me Icon */}
            <button
              type="button"
              onClick={() => {
                setSelectedLocality('Tibri Road');
                setSearchQuery('Tibri Road');
              }}
              title="Locate Prime Gurdaspur Area"
              className="hidden sm:flex p-2.5 rounded-xl text-slate-500 hover:text-[#005ca8] hover:bg-blue-50 transition-colors"
            >
              <Crosshair className="w-4 h-4" />
            </button>

            {/* Segment 4: Mic Icon */}
            <button
              type="button"
              onClick={() => {
                const terms = ["Tibri Road", "Jail Road", "Dinanagar Bypass", "Trimmu Road"];
                const random = terms[Math.floor(Math.random() * terms.length)];
                setSearchQuery(random);
              }}
              title="Voice Search Simulation"
              className="hidden sm:flex p-2.5 rounded-xl text-slate-500 hover:text-[#005ca8] hover:bg-blue-50 transition-colors mr-2"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Segment 5: Big Bold Blue Search Button */}
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-[#005ca8] hover:bg-[#004885] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Search</span>
            </button>

          </form>

          {/* Quick Filter Tag Links on Bottom */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-400">Popular Localities:</span>
              {["Tibri Road", "Jail Road", "Dinanagar Bypass", "Trimmu Road", "Hanuman Chowk"].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setSelectedLocality(loc);
                    setSearchQuery(loc);
                    const el = document.getElementById('listings');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  {loc}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onOpenStampDuty}
                className="text-blue-700 hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Punjab Stamp Duty Rates</span>
              </button>
              <button
                type="button"
                onClick={onOpenCalculator}
                className="text-emerald-700 hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                <span>Marla / Kanal Calculator</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
