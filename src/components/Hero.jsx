import React from 'react';
import { 
  Search, 
  MapPin, 
  Home, 
  IndianRupee, 
  ShieldCheck, 
  FileCheck, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp
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
  onOpenPostProperty
}) {
  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
      
      {/* Decorative Glow Blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        
        {/* City Tagline pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-inner">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Gurdaspur's #1 Property & Registry Advisory Portal</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Outfit'] leading-tight mb-4">
          Apne Shehar <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">Gurdaspur</span> Mein<br className="hidden sm:block"/>
          Sahi Plot, Kothi Ya Zameen Chunein
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 font-normal">
          Explore genuine, title-verified residential plots, luxury villas, highway commercial spaces, and agricultural land with direct consultant support.
        </p>

        {/* Search & Filter Box */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-900 border border-slate-100">
          
          {/* Top Purpose Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5 overflow-x-auto">
            <button
              onClick={() => setSelectedPurpose("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedPurpose === "all"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Listings
            </button>
            <button
              onClick={() => setSelectedPurpose("buy")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedPurpose === "buy"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🏡 Buy Property
            </button>
            <button
              onClick={() => setSelectedPurpose("rent")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedPurpose === "rent"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🔑 For Rent
            </button>
            <button
              onClick={() => { setSelectedCategory("plot"); setSelectedPurpose("buy"); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === "plot"
                  ? "bg-teal-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              📐 Plots Only
            </button>
            <button
              onClick={() => { setSelectedCategory("land"); setSelectedPurpose("buy"); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === "land"
                  ? "bg-teal-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🚜 Agriculture Land
            </button>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            
            {/* Locality Selector */}
            <div className="relative">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Gurdaspur Locality
              </label>
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {GURDASPUR_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-emerald-600" />
                Property Type
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">All Types (Plot, Kothi, SCO)</option>
                <option value="plot">Residential Plot</option>
                <option value="kothi">Kothi / House</option>
                <option value="commercial">Commercial / SCO / Shop</option>
                <option value="land">Agricultural Land</option>
                <option value="rent">Rental Properties</option>
              </select>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                Max Budget
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="any">Any Budget</option>
                <option value="20lakh">Under ₹20 Lakh</option>
                <option value="50lakh">Under ₹50 Lakh</option>
                <option value="1cr">Under ₹1 Crore</option>
                <option value="above1cr">₹1 Crore +</option>
              </select>
            </div>

            {/* Search Keyword / Action */}
            <div className="flex flex-col justify-end">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <Search className="w-3.5 h-3.5 text-emerald-600" />
                Search / ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Tibri, 10 Marla, GP-101"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Quick Shortcuts underneath */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-slate-700">Quick Searches in Gurdaspur:</span>
              <button 
                onClick={() => { setSelectedLocality("Tibri Road"); setSelectedCategory("plot"); }}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
              >
                Plots on Tibri Road
              </button>
              <button 
                onClick={() => { setSelectedLocality("Jail Road"); setSelectedCategory("kothi"); }}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
              >
                Kothi on Jail Road
              </button>
              <button 
                onClick={() => { setSelectedLocality("Hanuman Chowk"); setSelectedCategory("commercial"); }}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
              >
                Shops near Hanuman Chowk
              </button>
            </div>

            <button
              onClick={onOpenCalculator}
              className="text-amber-700 font-bold hover:underline flex items-center gap-1"
            >
              Need to convert Marla to Sq.Ft? Check Punjab Land Calculator →
            </button>
          </div>

        </div>

        {/* 4 Pillars of Trust */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto text-left">
          <div className="bg-slate-800/60 backdrop-blur-xs border border-slate-700/60 rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">100% Title Verified</p>
              <p className="text-[11px] text-slate-400">Tehsil record checked</p>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs border border-slate-700/60 rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Full Registry Support</p>
              <p className="text-[11px] text-slate-400">Inteqaal & legal help</p>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs border border-slate-700/60 rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">True Market Valuation</p>
              <p className="text-[11px] text-slate-400">Fair DC vs market rate</p>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs border border-slate-700/60 rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">NRI Services</p>
              <p className="text-[11px] text-slate-400">Care & dispute checks</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
