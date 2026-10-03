import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Crosshair, 
  Mic, 
  ChevronDown, 
  ArrowRight, 
  Sparkles,
  X,
  FileCheck2,
  Calculator
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
  const [activeTab, setActiveTab] = useState('buy'); // 'buy', 'rent', 'new', 'commercial', 'plots', 'projects'

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'buy') {
      setSelectedPurpose('buy');
      setSelectedCategory('all');
    } else if (tab === 'rent') {
      setSelectedPurpose('rent');
      setSelectedCategory('all');
    } else if (tab === 'new') {
      setSelectedPurpose('buy');
      setSelectedCategory('kothi');
    } else if (tab === 'commercial') {
      setSelectedPurpose('buy');
      setSelectedCategory('commercial');
    } else if (tab === 'plots') {
      setSelectedPurpose('buy');
      setSelectedCategory('plot');
    } else if (tab === 'projects') {
      setSelectedPurpose('buy');
      setSelectedCategory('all');
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
    <div className="relative bg-[#071a33] text-white">
      
      {/* 99acres Top Panoramic Architectural Banner */}
      <div className="relative pt-5 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[220px] sm:min-h-[250px] flex flex-col justify-start">
        
        {/* Background Architectural Luxury Skyline with Soft Vignette */}
        <div className="absolute inset-0 z-0 flex items-center justify-between pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85" 
            alt="Luxury Architecture" 
            className="w-full h-full object-cover object-left opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071a33]/95 via-[#071a33]/70 to-[#071a33]/90"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#071a33]/40 via-transparent to-[#071a33]"></div>
        </div>

        {/* Content Container (Matches 99acres Banner Layout) */}
        <div className="max-w-6xl mx-auto relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 pt-1">
          
          {/* Left: Sleek Portal Badge & Title */}
          <div className="text-left max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-900/60 border border-blue-400/30 text-blue-200 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Gurdaspur Real Estate Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-['Outfit'] text-white tracking-tight">
              Find Verified Properties in <span className="text-emerald-400">Gurdaspur</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-1 max-w-sm">
              Authentic plots, modern villas, commercial SCOs & farm land with verified Tehsil mutation records.
            </p>
          </div>

          {/* Right: 99acres-Style Elegant Lounge & Tehsil Desk Card */}
          <div className="bg-[#0b2447]/70 border border-blue-400/25 rounded-2xl p-3.5 sm:p-4 text-left max-w-md w-full shadow-xl backdrop-blur-md">
            
            {/* Developer / Desk Emblems */}
            <div className="flex items-center justify-between text-[10px] font-extrabold text-blue-200 uppercase tracking-wider pb-1.5 border-b border-blue-800/40">
              <span className="text-amber-400">★ TRAVELX ADVISORY</span>
              <span className="text-slate-500">•</span>
              <span>TEHSIL DESK</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400">DIRECT VERIFICATION</span>
            </div>

            <h3 className="text-xs sm:text-sm font-extrabold text-white font-['Outfit'] mt-2">
              Gurdaspur Property Consultation Center
            </h3>
            
            <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 leading-snug">
              Travelx, Batala Road (Near Vishal Mega Mart), Gurdaspur, Punjab 143521.<br/>
              Direct Tehsil registry legal guidance &amp; Punjab collector rate analysis.
            </p>

            <div className="mt-2.5 flex items-center justify-between pt-1.5 border-t border-blue-800/40 text-xs">
              <button
                onClick={onOpenStampDuty}
                className="px-3 py-1 rounded-lg border border-blue-400/40 hover:bg-blue-600/20 text-blue-200 hover:text-white font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Check Registry Rates</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <a
                href="tel:+918146526257"
                className="font-bold text-emerald-400 hover:text-emerald-300 text-[11px]"
              >
                Call: +91 81465 26257
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* 99ACRES ICONIC FLOATING SEARCH CARD (Overlaps 50% on dark banner, 50% on white section) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-30 -mb-14 sm:-mb-16">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-slate-900 border border-slate-200">
          
          {/* Top Tab Bar: Buy | Rent | New Launch | Commercial | Plots/Land | Projects | Post Property FREE */}
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
                  <span className="flex items-center gap-1.5">
                    {tab.label}
                    {tab.dot && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    )}
                  </span>
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#005ca8] rounded-full"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Post Property FREE badge on the right of the tab bar */}
            <div className="hidden sm:block shrink-0">
              <button
                onClick={onOpenPostProperty}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#005ca8] transition-colors cursor-pointer"
              >
                <span>Post Property</span>
                <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                  FREE
                </span>
              </button>
            </div>
          </div>

          {/* Main Search Input Strip */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 bg-slate-50 rounded-2xl border border-slate-200 p-1.5 sm:p-2">
            
            {/* Segment 1: Category Dropdown (e.g. All Residential ▾) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPropertyTypeDropdownOpen(!propertyTypeDropdownOpen)}
                className="w-full sm:w-auto flex items-center justify-between gap-2.5 px-4 py-3 bg-white sm:bg-transparent rounded-xl text-xs sm:text-sm font-extrabold text-slate-800 hover:text-[#005ca8] transition-colors cursor-pointer"
              >
                <span>{getDropdownLabel()}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${propertyTypeDropdownOpen ? 'rotate-180' : ''}`} />
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
                          ? 'bg-blue-50 text-[#005ca8]'
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

            {/* Segment 2: Locality Dropdown Selector */}
            <div className="hidden lg:flex items-center gap-1.5 px-3">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer pr-3"
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

            {/* Segment 3: Search Input Box */}
            <div className="flex-1 flex items-center gap-2 px-3 py-1">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search "Tibri Road, Jail Road, Dinanagar Bypass..."'
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

            {/* Segment 4: Crosshair / Near Me Icon */}
            <button
              type="button"
              onClick={() => {
                setSelectedLocality('Tibri Road');
                setSearchQuery('Tibri Road');
              }}
              title="Locate Prime Gurdaspur Area"
              className="hidden sm:flex p-2.5 rounded-xl text-slate-400 hover:text-[#005ca8] hover:bg-blue-50 transition-colors"
            >
              <Crosshair className="w-4 h-4" />
            </button>

            {/* Segment 5: Voice Mic Icon */}
            <button
              type="button"
              onClick={() => {
                const terms = ["Tibri Road", "Jail Road", "Dinanagar Bypass", "Trimmu Road"];
                const random = terms[Math.floor(Math.random() * terms.length)];
                setSearchQuery(random);
              }}
              title="Voice Search Simulation"
              className="hidden sm:flex p-2.5 rounded-xl text-slate-400 hover:text-[#005ca8] hover:bg-blue-50 transition-colors mr-2"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Segment 6: Big Bold 99acres Blue Search Button */}
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-[#005ca8] hover:bg-[#004885] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Search</span>
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}
