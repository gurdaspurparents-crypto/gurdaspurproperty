import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PropertyCard from './components/PropertyCard';
import PropertyDetailModal from './components/PropertyDetailModal';
import PunjabLandCalculator from './components/PunjabLandCalculator';
import PostPropertyModal from './components/PostPropertyModal';
import ConsultantServices from './components/ConsultantServices';
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
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [properties, setProperties] = useState([]);
  const [settings, setSettings] = useState(getSettings());
  
  // Modals
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
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
      
      {/* Navigation */}
      <Navbar
        settings={settings}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeFilter={selectedCategory}
        setActiveFilter={setSelectedCategory}
      />

      {/* Hero with Search Bar */}
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
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
      />

      {/* Main Listings Section */}
      <main id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex-1 w-full">
        
        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {PROPERTY_TYPES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{cat.label}</span>
              {selectedCategory === cat.id && (
                <span className="w-2 h-2 rounded-full bg-white"></span>
              )}
            </button>
          ))}

          <button
            onClick={() => setIsCalculatorOpen(true)}
            className="ml-auto shrink-0 hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-amber-600" />
            <span>Punjab Unit Converter (Marla/Kanal)</span>
          </button>
        </div>

        {/* Section Header & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
                Featured Properties in Gurdaspur
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {filteredProperties.length} Available
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing verified listings across Tibri Road, Jail Road, Trimmu Road, Dinanagar & surrounding areas
            </p>
          </div>

          {/* Sort & Reset Buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="size">Largest Land Size</option>
            </select>

            {(searchQuery || selectedCategory !== 'all' || selectedLocality !== 'All Localities' || selectedPurpose !== 'all' || budgetRange !== 'any') && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Listings Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-xs max-w-lg mx-auto p-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-1">
              No Matching Properties Found
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              We couldn't find any properties matching your current filter criteria in Gurdaspur. Try adjusting your filters or contact our consultant for off-market listings.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Show All Properties
              </button>
              <a
                href={`https://wa.me/${cleanPhone}?text=Hi,%20I%20am%20looking%20for%20a%20specific%20property%20in%20Gurdaspur.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                Ask on WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Advisory & Tehsil Services Section */}
      <ConsultantServices settings={settings} />

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        setSelectedLocality={(loc) => {
          setSelectedLocality(loc);
          setSelectedCategory('all');
        }}
      />

      {/* Floating Action Button: Quick WhatsApp Contact */}
      <aside aria-label="Quick WhatsApp assistance" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <a
          href={`https://wa.me/${cleanPhone}?text=Hi%20Gurdaspur%20Property%20Consultant,%20I%20want%20to%20inquire%20about%20plots%20and%20houses%20in%20Gurdaspur.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all duration-300 group"
          title="Direct WhatsApp with Consultant"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 fill-white text-emerald-500" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping"></span>
          </div>
          <span className="hidden sm:inline">WhatsApp Consultant</span>
          <span className="sm:hidden">WhatsApp</span>
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
