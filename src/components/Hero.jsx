import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Crosshair, 
  Mic, 
  ChevronDown, 
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
  const [activeTab, setActiveTab] = useState('buy'); // 'buy', 'rent', 'new', 'commercial', 'plots'

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
    <div className="bg-[#071c35] text-white py-6 sm:py-8 border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* 99ACRES ICONIC SEARCH CARD */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-5 text-slate-900 border border-slate-200">
          
          {/* Top Tab Bar: Buy | Rent | New Launch | Commercial | Plots / Land | Post Property FREE */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-6 sm:gap-8">
              {[
                { id: 'buy', label: 'Buy' },
                { id: 'rent', label: 'Rent' },
                { id: 'new', label: 'New Launch', dot: true },
                { id: 'commercial', label: 'Commercial' },
                { id: 'plots', label: 'Plots / Land' }
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
                <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-2xs">
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
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
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
              className="hidden sm:flex p-2.5 rounded-xl text-slate-400 hover:text-[#005ca8] hover:bg-blue-50 transition-colors cursor-pointer"
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
              title="Quick Search Suggestion"
              className="hidden sm:flex p-2.5 rounded-xl text-slate-400 hover:text-[#005ca8] hover:bg-blue-50 transition-colors mr-2 cursor-pointer"
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
