import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PropertyCard from './components/PropertyCard';
import PropertyDetailModal from './components/PropertyDetailModal';
import PunjabLandCalculator from './components/PunjabLandCalculator';
import PunjabStampDutyCalculator from './components/PunjabStampDutyCalculator';
import PostPropertyModal from './components/PostPropertyModal';
import LocalitiesGuide from './components/LocalitiesGuide';
import NRIPropertyCorner from './components/NRIPropertyCorner';
import ConsultantServices from './components/ConsultantServices';
import ExploringRealEstateOptions from './components/ExploringRealEstateOptions';
import Testimonials from './components/Testimonials';
import AdminModal from './components/AdminModal';
import Footer from './components/Footer';

import { 
  getProperties, 
  getSettings, 
  saveProperties, 
  saveSettings 
} from './utils/storage';
import { PROPERTY_TYPES, GURDASPUR_LOCALITIES } from './data/initialProperties';
import { 
  Building2, 
  Filter, 
  RotateCcw, 
  MessageCircle, 
  Phone, 
  PlusCircle, 
  Calculator, 
  MapPin, 
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Globe2,
  ArrowUpRight
} from 'lucide-react';

export default function App() {
  const [properties, setProperties] = useState([]);
  const [settings, setSettings] = useState(getSettings());
  
  // Modals
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isStampDutyOpen, setIsStampDutyOpen] = useState(false);
  const [isPostPropertyOpen, setIsPostPropertyOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocality, setSelectedLocality] = useState('All Localities');
  const [selectedPurpose, setSelectedPurpose] = useState('all'); // 'all', 'buy', 'rent'
  const [budgetRange, setBudgetRange] = useState('any'); // 'any', '20lakh', '50lakh', '1cr', 'above1cr'
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'size'

  useEffect(() => {
    setProperties(getProperties());
    setSettings(getSettings());
  }, []);

  // Filter Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Search keyword / ID
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          prop.title?.toLowerCase().includes(q) ||
          prop.id?.toLowerCase().includes(q) ||
          prop.location?.toLowerCase().includes(q) ||
          prop.cityArea?.toLowerCase().includes(q) ||
          prop.description?.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Purpose (Buy / Rent)
      if (selectedPurpose !== 'all') {
        if (prop.purpose !== selectedPurpose) return false;
      }

      // Category
      if (selectedCategory !== 'all') {
        if (prop.category !== selectedCategory) return false;
      }

      // Locality
      if (selectedLocality !== 'All Localities') {
        if (prop.location !== selectedLocality && !prop.cityArea?.toLowerCase().includes(selectedLocality.toLowerCase())) {
          return false;
        }
      }

      // Budget
      if (budgetRange !== 'any') {
        const p = prop.price;
        if (budgetRange === '20lakh' && p > 2000000) return false;
        if (budgetRange === '50lakh' && p > 5000000) return false;
        if (budgetRange === '1cr' && p > 10000000) return false;
        if (budgetRange === 'above1cr' && p <= 10000000) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'size') return b.size - a.size;
      return 0; // Default featured order
    });
  }, [properties, searchQuery, selectedCategory, selectedLocality, selectedPurpose, budgetRange, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocality('All Localities');
    setSelectedPurpose('all');
    setBudgetRange('any');
    setSortBy('featured');
  };

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Navigation (99acres Top Bar) */}
      <Navbar
        settings={settings}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenStampDuty={() => setIsStampDutyOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeFilter={selectedCategory}
        setActiveFilter={setSelectedCategory}
        selectedLocality={selectedLocality}
        setSelectedLocality={setSelectedLocality}
      />

      {/* Hero Section with 99acres Floating Search Widget */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedLocality={selectedLocality}
        setSelectedLocality={setSelectedLocality}
        selectedPurpose={selectedPurpose}
        setSelectedPurpose={setSelectedPurpose}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        budgetRange={budgetRange}
        setBudgetRange={setBudgetRange}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenStampDuty={() => setIsStampDutyOpen(true)}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
      />

      {/* 99acres Iconic "GET STARTED WITH EXPLORING REAL ESTATE OPTIONS" Carousel */}
      <ExploringRealEstateOptions
        onSelectCategory={setSelectedCategory}
        onSelectPurpose={setSelectedPurpose}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        onOpenStampDuty={() => setIsStampDutyOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
      />

      {/* Main Listings Section */}
      <main id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {PROPERTY_TYPES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/25 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{cat.label}</span>
              {selectedCategory === cat.id && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>
          ))}

          {/* Quick Registry Calculator shortcut button */}
          <button
            onClick={() => setIsStampDutyOpen(true)}
            className="ml-auto shrink-0 hidden lg:inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer shadow-2xs"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-700" />
            <span>Punjab Registry & Stamp Duty Calculator</span>
          </button>
        </div>

        {/* Section Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
                Featured Properties in Gurdaspur
              </h2>
              <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full">
                {filteredProperties.length} Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Title-checked properties with authentic revenue records across Tibri Road, Jail Road, Trimmu Road, Dinanagar & surrounding areas
            </p>
          </div>

          {/* Sort & Reset Buttons */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="size">Largest Land Size</option>
            </select>

            {(searchQuery || selectedCategory !== 'all' || selectedLocality !== 'All Localities' || selectedPurpose !== 'all' || budgetRange !== 'any') && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer border border-emerald-200"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Listings Cards Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto p-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-2">
              No Properties Found Matching Your Criteria
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              We couldn't find active listings matching these exact filters in Gurdaspur. Many off-market plots and luxury kothis are kept private by owners.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Show All Properties
              </button>
              <a
                href={`https://wa.me/${cleanPhone}?text=Hi%20Gurdaspur%20Property,%20I%20have%20a%20specific%20property%20requirement%20in%20Gurdaspur.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/25"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                settings={settings}
                onSelectProperty={(prop) => setSelectedProperty(prop)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Gurdaspur Locality Market Intelligence Guide */}
      <LocalitiesGuide
        onSelectLocality={(loc) => {
          setSelectedLocality(loc);
          setSelectedCategory('all');
        }}
      />

      {/* Dedicated Overseas NRI Property Corner */}
      <div id="nri-desk">
        <NRIPropertyCorner settings={settings} />
      </div>

      {/* Tehsil Registry & Legal Advisory Services */}
      <ConsultantServices settings={settings} />

      {/* Client Testimonials & Social Proof */}
      <Testimonials />

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenStampDuty={() => setIsStampDutyOpen(true)}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        setSelectedLocality={(loc) => {
          setSelectedLocality(loc);
          setSelectedCategory('all');
        }}
      />

      {/* Floating Action Button: WhatsApp Chat */}
      <aside aria-label="Quick WhatsApp assistance" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-1.5">
        {/* Floating Live Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/90 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xl border border-slate-700/80 backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Online • Chat with Consultant</span>
        </div>

        <a
          href={`https://wa.me/${cleanPhone}?text=Hi%20Gurdaspur%20Property%20Consultants,%20I%20am%20looking%20for%20property%20in%20Gurdaspur.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs sm:text-sm shadow-2xl shadow-emerald-500/50 hover:scale-105 transition-all duration-300 group border-2 border-white/50"
          title="Chat directly on WhatsApp"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
          </div>
          <span>Chat on WhatsApp</span>
        </a>
      </aside>

      {/* Modals */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          settings={settings}
          onClose={() => setSelectedProperty(null)}
          onOpenCalculator={() => {
            setSelectedProperty(null);
            setIsCalculatorOpen(true);
          }}
        />
      )}

      {isCalculatorOpen && (
        <PunjabLandCalculator
          isOpen={isCalculatorOpen}
          onClose={() => setIsCalculatorOpen(false)}
        />
      )}

      {isStampDutyOpen && (
        <PunjabStampDutyCalculator
          isOpen={isStampDutyOpen}
          onClose={() => setIsStampDutyOpen(false)}
        />
      )}

      {isPostPropertyOpen && (
        <PostPropertyModal
          isOpen={isPostPropertyOpen}
          onClose={() => setIsPostPropertyOpen(false)}
          settings={settings}
        />
      )}

      {isAdminOpen && (
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          properties={properties}
          setProperties={setProperties}
          settings={settings}
          setSettings={setSettings}
        />
      )}

    </div>
  );
}
