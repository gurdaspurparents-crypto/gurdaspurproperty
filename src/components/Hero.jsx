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
  TrendingUp,
  Sparkles,
  Calculator,
  FileCheck2,
  BadgeCheck
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
  return (
    <div className="relative bg-slate-950 text-white pt-14 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[640px] flex flex-col justify-center">
      
      {/* High-Resolution Luxury Real Estate Background with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85" 
          alt="Luxury House Gurdaspur" 
          className="w-full h-full object-cover object-center scale-105 opacity-25 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 text-center w-full">
        
        {/* Top Trust Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-xl backdrop-blur-md">
          <BadgeCheck className="w-4 h-4 text-emerald-400" />
          <span>Gurdaspur's #1 Premier Real Estate & Tehsil Registry Network</span>
        </div>

        {/* Grand Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-['Outfit'] leading-[1.15] mb-5">
          Apne Shehar <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200 bg-clip-text text-transparent">Gurdaspur</span> Mein<br/>
          Sahi Plot, Luxury Kothi Ya Zameen Chunein
        </h1>

        <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 mb-10 font-normal leading-relaxed">
          Title-verified residential plots on Tibri Road, luxury bungalows on Jail Road, highway commercial SCOs, and agricultural farm lands with complete Tehsil Gurdaspur registry verification.
        </p>

        {/* Master Search Engine Card */}
        <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-5 sm:p-7 text-slate-900 border border-white/20">
          
          {/* Top Purpose Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200/80 pb-4 mb-6 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSelectedPurpose("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                selectedPurpose === "all"
                  ? "bg-slate-950 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Listings
            </button>
            <button
              onClick={() => setSelectedPurpose("buy")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                selectedPurpose === "buy"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🏡 Buy Property
            </button>
            <button
              onClick={() => setSelectedPurpose("rent")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                selectedPurpose === "rent"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🔑 For Rent
            </button>
            <button
              onClick={() => { setSelectedCategory("plot"); setSelectedPurpose("buy"); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                selectedCategory === "plot"
                  ? "bg-teal-700 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              📐 Plots Only
            </button>
            <button
              onClick={() => { setSelectedCategory("kothi"); setSelectedPurpose("buy"); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                selectedCategory === "kothi"
                  ? "bg-teal-700 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🏰 Luxury Kothis
            </button>
            <button
              onClick={() => { setSelectedCategory("land"); setSelectedPurpose("buy"); }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                selectedCategory === "land"
                  ? "bg-teal-700 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🚜 Agricultural Land
            </button>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            
            {/* Locality Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Gurdaspur Locality
              </label>
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-emerald-600" />
                Property Type
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
              >
                <option value="all">All Types (Plot, Kothi, SCO)</option>
                <option value="plot">Residential Plot</option>
                <option value="kothi">Luxury Kothi / House</option>
                <option value="commercial">Commercial / SCO / Showroom</option>
                <option value="land">Agricultural Land / Farmhouse</option>
                <option value="rent">Rental Properties</option>
              </select>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                Max Budget
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
              >
                <option value="any">Any Budget</option>
                <option value="20lakh">Under ₹20 Lakh</option>
                <option value="50lakh">Under ₹50 Lakh</option>
                <option value="1cr">Under ₹1 Crore</option>
                <option value="above1cr">₹1 Crore +</option>
              </select>
            </div>

            {/* Keyword / ID Search */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-emerald-600" />
                Keyword or Property ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Tibri, 10 Marla, GP-101"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-3 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Quick Shortcuts & Calculators Row underneath */}
          <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-slate-900">Hot Localities:</span>
              <button 
                onClick={() => { setSelectedLocality("Tibri Road"); setSelectedCategory("plot"); }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-semibold transition-colors"
              >
                Plots on Tibri Road
              </button>
              <button 
                onClick={() => { setSelectedLocality("Jail Road"); setSelectedCategory("kothi"); }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-semibold transition-colors"
              >
                Kothis on Jail Road
              </button>
              <button 
                onClick={() => { setSelectedLocality("Hanuman Chowk"); setSelectedCategory("commercial"); }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-semibold transition-colors"
              >
                Hanuman Chowk Shops
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenStampDuty}
                className="text-emerald-700 font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Punjab Registry Calculator</span>
              </button>

              <button
                onClick={onOpenCalculator}
                className="text-amber-800 font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-600" />
                <span>Marla / Kanal Tool</span>
              </button>
            </div>
          </div>

        </div>

        {/* 4 Pillars of Authority Numbers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-14 max-w-5xl mx-auto text-left">
          <div className="glass-dark rounded-2xl p-4.5 flex items-center gap-3.5 border border-white/10 shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-white font-['Outfit']">100% Verified</div>
              <div className="text-[11px] text-slate-400">Tehsil Registry & Inteqaal</div>
            </div>
          </div>

          <div className="glass-dark rounded-2xl p-4.5 flex items-center gap-3.5 border border-white/10 shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-white font-['Outfit']">₹120 Cr+</div>
              <div className="text-[11px] text-slate-400">Property Deals Closed</div>
            </div>
          </div>

          <div className="glass-dark rounded-2xl p-4.5 flex items-center gap-3.5 border border-white/10 shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-white font-['Outfit']">500+ Families</div>
              <div className="text-[11px] text-slate-400">Happy Gurdaspur Clients</div>
            </div>
          </div>

          <div className="glass-dark rounded-2xl p-4.5 flex items-center gap-3.5 border border-white/10 shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-white font-['Outfit']">15+ Years</div>
              <div className="text-[11px] text-slate-400">Local Market Experience</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
