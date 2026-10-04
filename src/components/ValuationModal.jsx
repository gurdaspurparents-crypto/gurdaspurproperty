import React, { useState } from 'react';
import { 
  Calculator, 
  X, 
  TrendingUp, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  MessageCircle, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { GURDASPUR_LOCALITIES } from '../data/initialProperties';

export default function ValuationModal({ 
  isOpen, 
  onClose, 
  settings, 
  onOpenPostProperty 
}) {
  const [locality, setLocality] = useState('Tibri Road');
  const [propertyType, setPropertyType] = useState('plot'); // plot, kothi, commercial, land
  const [size, setSize] = useState('10');
  const [unit, setUnit] = useState('Marla'); // Marla, Kanal

  if (!isOpen) return null;

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  // Locality valuation benchmarks (in ₹ per Marla / Kanal)
  const LOCALITY_RATES = {
    'Tibri Road': {
      plot: { min: 320000, max: 450000, collector: 200000, growth: '+18%' },
      kothi: { min: 650000, max: 900000, collector: 350000, growth: '+16%' },
      commercial: { min: 800000, max: 1300000, collector: 450000, growth: '+22%' },
      land: { min: 450000, max: 700000, collector: 250000, growth: '+12%' }
    },
    'Jail Road': {
      plot: { min: 400000, max: 650000, collector: 280000, growth: '+15%' },
      kothi: { min: 750000, max: 1150000, collector: 420000, growth: '+17%' },
      commercial: { min: 1000000, max: 1600000, collector: 600000, growth: '+20%' },
      land: { min: 550000, max: 800000, collector: 300000, growth: '+14%' }
    },
    'Hanuman Chowk': {
      plot: { min: 600000, max: 950000, collector: 400000, growth: '+14%' },
      kothi: { min: 850000, max: 1300000, collector: 500000, growth: '+15%' },
      commercial: { min: 1500000, max: 2500000, collector: 850000, growth: '+25%' },
      land: { min: 600000, max: 900000, collector: 350000, growth: '+12%' }
    },
    'Dinanagar Bypass': {
      plot: { min: 350000, max: 520000, collector: 220000, growth: '+22%' },
      kothi: { min: 600000, max: 850000, collector: 320000, growth: '+18%' },
      commercial: { min: 750000, max: 1400000, collector: 420000, growth: '+28%' },
      land: { min: 400000, max: 650000, collector: 220000, growth: '+16%' }
    },
    'Trimmu Road': {
      plot: { min: 240000, max: 360000, collector: 150000, growth: '+12%' },
      kothi: { min: 500000, max: 750000, collector: 280000, growth: '+14%' },
      commercial: { min: 550000, max: 900000, collector: 320000, growth: '+18%' },
      land: { min: 450000, max: 700000, collector: 250000, growth: '+15%' } // Kanal rate approx
    },
    'Hardochhani Road': {
      plot: { min: 260000, max: 380000, collector: 160000, growth: '+16%' },
      kothi: { min: 520000, max: 780000, collector: 290000, growth: '+15%' },
      commercial: { min: 600000, max: 1000000, collector: 350000, growth: '+20%' },
      land: { min: 350000, max: 550000, collector: 200000, growth: '+12%' }
    },
    'Batala Road': {
      plot: { min: 300000, max: 480000, collector: 190000, growth: '+15%' },
      kothi: { min: 600000, max: 880000, collector: 330000, growth: '+16%' },
      commercial: { min: 900000, max: 1500000, collector: 500000, growth: '+24%' },
      land: { min: 400000, max: 650000, collector: 220000, growth: '+14%' }
    }
  };

  const currentRates = LOCALITY_RATES[locality]?.[propertyType] || {
    min: 280000,
    max: 420000,
    collector: 180000,
    growth: '+15%'
  };

  const numSize = parseFloat(size) || 1;
  // If unit is Kanal, 1 Kanal = 20 Marla for Marla-based rate multiplication
  const multiplier = unit === 'Kanal' ? numSize * 20 : numSize;

  const totalMin = Math.round(currentRates.min * multiplier);
  const totalMax = Math.round(currentRates.max * multiplier);
  const totalCollector = Math.round(currentRates.collector * multiplier);

  const formatLakhCr = (val) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(2)} Lakh`;
  };

  const whatsappInquiry = encodeURIComponent(
    `Hello Gurdaspur Property! I checked my property valuation on your portal:\n\n• Locality: ${locality}\n• Type: ${propertyType.toUpperCase()}\n• Size: ${size} ${unit}\n• Estimated Market Value: ${formatLakhCr(totalMin)} - ${formatLakhCr(totalMax)}\n\nI want to get an exact ground inspection & sell my property through your advisory.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 relative text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#005ca8] via-blue-800 to-indigo-900 text-white px-6 py-5 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-['Outfit']">Gurdaspur PropWorth™</h2>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full">
                  Instant Valuation
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Accurate market rates and Tehsil collector rate benchmarks
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          
          {/* Form Inputs Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            
            {/* Locality Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Select Locality
              </label>
              <div className="relative">
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {Object.keys(LOCALITY_RATES).map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="plot">Residential Plot</option>
                <option value="kothi">Built Villa / Kothi</option>
                <option value="commercial">Commercial SCO / Shop</option>
                <option value="land">Agricultural Land</option>
              </select>
            </div>

            {/* Land Size Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Property Size
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter size..."
              />
            </div>

            {/* Unit Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Measurement Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Marla">Marla (225 Sq.Ft / 25 Gaj)</option>
                <option value="Kanal">Kanal (20 Marla / 4,500 Sq.Ft)</option>
              </select>
            </div>

          </div>

          {/* Results Showcase Card */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-slate-50 border-2 border-blue-200/80 rounded-2xl p-5 mb-6 text-slate-900 shadow-sm">
            
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Estimated Market Value for {size} {unit}</span>
              </span>
              <span className="text-[11px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                {currentRates.growth} Growth Trend
              </span>
            </div>

            <div className="my-4 text-center">
              <div className="text-xs text-slate-500 font-semibold mb-1">
                Fair Market Price Range in {locality}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-blue-900 font-['Outfit']">
                {formatLakhCr(totalMin)} – {formatLakhCr(totalMax)}
              </div>
              <div className="text-xs text-slate-600 font-bold mt-1">
                Approx. {formatLakhCr(currentRates.min)} to {formatLakhCr(currentRates.max)} per Marla
              </div>
            </div>

            {/* Secondary Benchmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-blue-100 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Govt. Tehsil Collector Rate</div>
                <div className="text-sm font-black text-slate-800 mt-0.5">
                  {formatLakhCr(totalCollector)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Official circle rate for stamp duty registration</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Estimated Registry Duty</div>
                <div className="text-sm font-black text-emerald-700 mt-0.5">
                  {formatLakhCr(Math.round(totalCollector * 0.07))} (Male) / {formatLakhCr(Math.round(totalCollector * 0.05))} (Female)
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Stamp duty payable at Tehsil Gurdaspur</div>
              </div>
            </div>

          </div>

          {/* Action Strip */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href={`https://wa.me/${cleanPhone}?text=${whatsappInquiry}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
              <span>Get Ground Valuation on WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onClose();
                if (onOpenPostProperty) onOpenPostProperty();
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#005ca8] hover:bg-[#004885] text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>List Property for Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
