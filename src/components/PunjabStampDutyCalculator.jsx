import React, { useState, useRef } from 'react';
import { 
  X, 
  RotateCcw, 
  Download, 
  Share2, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Info, 
  CheckCircle2, 
  Home, 
  Building2, 
  Wheat, 
  Square, 
  Layers, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck,
  Percent,
  Receipt
} from 'lucide-react';
import { 
  BUYER_TYPES, 
  PROPERTY_TYPES, 
  GURDASPUR_TEHSILS, 
  calculatePunjabRegistry, 
  formatIndianNumber 
} from '../utils/stampDutyEngine';

export default function PunjabStampDutyCalculator({ isOpen, onClose }) {
  // State
  const [agreementValue, setAgreementValue] = useState('3500000');
  const [collectorRate, setCollectorRate] = useState('');
  const [buyerType, setBuyerType] = useState('female');
  const [propertyType, setPropertyType] = useState('residential');
  const [district] = useState('Gurdaspur');
  const [tehsil, setTehsil] = useState('Gurdaspur (Main Tehsil)');
  
  // UI states
  const [showDetailedCalculation, setShowDetailedCalculation] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const resultRef = useRef(null);
  const inputRef = useRef(null);

  if (!isOpen) return null;

  // Calculation output from centralized engine
  const calculation = calculatePunjabRegistry({
    agreementValue,
    collectorRate,
    buyerType,
    propertyType,
    district,
    tehsil,
  });

  const propertyTypeIcons = {
    residential: Home,
    commercial: Building2,
    agricultural: Wheat,
    plot: Square,
    other: Layers,
  };

  const quickValuePresets = [
    { label: '₹20 Lakh', value: '2000000' },
    { label: '₹35 Lakh', value: '3500000' },
    { label: '₹50 Lakh', value: '5000000' },
    { label: '₹75 Lakh', value: '7500000' },
    { label: '₹1 Crore', value: '10000000' },
  ];

  const faqs = [
    {
      q: 'What is stamp duty in Punjab?',
      a: 'Stamp duty is a statutory state tax levied on property conveyance and title deed transfers in Punjab. It must be paid to the Punjab Revenue Department via e-stamping (Stock Holding Corporation of India / NGDRS portal) before getting the deed registered at the Sub-Registrar office.'
    },
    {
      q: 'How is property registration fee calculated?',
      a: 'The registration fee in Punjab is 1% of the property calculation value (the higher of the transaction agreement value or the applicable Collector/DC Rate). This fee is charged for officially recording the document in Tehsil records.'
    },
    {
      q: 'Is stamp duty calculated on agreement value or Collector Rate?',
      a: 'As per Punjab Revenue rules, stamp duty is always computed on whichever value is higher between the actual agreement/sale consideration value and the official Collector (DC) circle rate of that locality in Gurdaspur.'
    },
    {
      q: 'Do female buyers get a concession?',
      a: 'Yes. The Government of Punjab provides a significant 2% concession on stamp duty for female sole owners (indicative total duty 5% vs 7% for male owners). Joint ownership (male + female) qualifies for an indicative 6% rate.'
    },
    {
      q: 'What other charges are payable during property registration?',
      a: 'Besides stamp duty and the 1% registration fee, buyers pay Punjab Land Records Society (PLRS) computerization facilitation fees (₹2,500), Inteqaal/Mutation entry fees (₹300), and document pasting/scanning charges (₹200).'
    },
    {
      q: 'Is this calculator the final government payable amount?',
      a: 'No. This calculator provides an accurate estimate based on standard Punjab statutory rates and Tehsil Gurdaspur practices. Exact duty can vary based on specific deed classifications (e.g. gift deeds, family partition, mortgage deeds) or latest circle rate updates. Please verify the final figures with the Sub-Registrar or our legal desk before stamp paper purchase.'
    }
  ];

  const handleCalculateClick = () => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRecalculate = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleShareEstimate = async () => {
    const summaryText = `Punjab Property Registry Estimate (Gurdaspur)\n` +
      `--------------------------------\n` +
      `Property Value: ₹${formatIndianNumber(calculation.calculationValue)}\n` +
      `Buyer Category: ${calculation.buyerType.title} (${calculation.buyerType.ratePercent}% Indicative Duty)\n` +
      `Tehsil: ${tehsil}\n` +
      `--------------------------------\n` +
      `Estimated Total Govt Cost: ₹${formatIndianNumber(calculation.totalRegistryCost)}\n` +
      `• Base Stamp Duty (${calculation.stampDutyRate}%): ₹${formatIndianNumber(calculation.stampDutyAmount)}\n` +
      `• Social Security & PIDB Cess (2%): ₹${formatIndianNumber(calculation.cessAmount)}\n` +
      `• Registration Fee (1%): ₹${formatIndianNumber(calculation.registrationFee)}\n` +
      `• PLRS & Mutation Slabs: ₹${formatIndianNumber(calculation.facilitationCharges + calculation.mutationFee + calculation.otherCharges)}\n` +
      `--------------------------------\n` +
      `Calculated via GurdaspurProperty.in`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Punjab Property Registry Estimate',
          text: summaryText,
          url: window.location.href,
        });
        return;
      } catch (e) {
        // Fallback below
      }
    }

    // Share via WhatsApp
    const waUrl = `https://wa.me/?text=${encodeURIComponent(summaryText)}`;
    window.open(waUrl, '_blank');
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  const handleDownloadEstimate = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-slate-200 relative text-slate-900 font-sans flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Compact, Clean Fintech Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 sm:px-7 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-['Outfit']">
                Punjab Property Registry Calculator
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full shrink-0">
                2026 UPDATED
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Estimate Stamp Duty, Registration Fee & Other Charges
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-3"
            aria-label="Close Calculator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 space-y-6">

          {/* STEP 1: Property Value */}
          <section className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-black flex items-center justify-center">
                  1
                </span>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Property Value
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700">
                ₹{formatIndianNumber(calculation.calculationValue)}
              </span>
            </div>

            {/* Agreement / Transaction Value */}
            <div className="space-y-1.5 mb-3">
              <label className="block text-xs font-bold text-slate-800">
                Agreement / Transaction Value
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
                  ₹
                </span>
                <input
                  ref={inputRef}
                  type="number"
                  min="0"
                  step="50000"
                  value={agreementValue}
                  onChange={(e) => setAgreementValue(e.target.value)}
                  placeholder="3500000"
                  className="w-full h-12 text-lg sm:text-xl font-bold bg-white border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-9 pr-4 text-slate-900 transition-all font-['Outfit']"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Calculation is based on the applicable value as per Punjab rules.
              </p>
            </div>

            {/* Quick Value Presets */}
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {quickValuePresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setAgreementValue(preset.value)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    agreementValue === preset.value
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Collector / DC Rate (Optional) */}
            <div className="pt-3 border-t border-slate-200/80">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Collector / DC Rate <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <span className="text-[10px] text-slate-400">Official circle rate if known</span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={collectorRate}
                  onChange={(e) => setCollectorRate(e.target.value)}
                  placeholder="e.g. 3000000"
                  className="w-full h-11 text-base font-semibold bg-white border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-8 pr-4 text-slate-800 transition-all font-['Outfit']"
                />
              </div>
            </div>

            {/* Calculation Value Callout */}
            <div className="mt-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                  Calculation Value
                </span>
                <span className="text-base font-extrabold text-emerald-950 font-['Outfit']">
                  ₹{formatIndianNumber(calculation.calculationValue)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-emerald-800 font-medium bg-white/70 px-2 py-0.5 rounded-md border border-emerald-200">
                  Higher applicable value used for calculation
                </span>
              </div>
            </div>
          </section>

          {/* STEP 2: Buyer Type */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-black flex items-center justify-center">
                  2
                </span>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Buyer Type
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Punjab Govt ownership slabs</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BUYER_TYPES.map((b) => {
                const isSelected = buyerType === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBuyerType(b.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-2 border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/10'
                        : 'border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                    
                    <div className="font-extrabold text-sm text-slate-900">
                      {b.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {b.subtitle}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-emerald-800' : 'text-slate-700'}`}>
                        {b.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 px-1">
              <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Note: Indicative rates include Punjab Base Stamp Duty (3%–5%) plus statutory 1% Social Security Fund and 1% PIDB Cess. Additional statutory charges apply.
              </span>
            </p>
          </section>

          {/* STEP 3 & 4: Property Type and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* STEP 3: Property Type */}
            <section className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-black flex items-center justify-center">
                  3
                </span>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Property Type
                </h3>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                {PROPERTY_TYPES.map((pt) => {
                  const Icon = propertyTypeIcons[pt.id] || Home;
                  const isSelected = propertyType === pt.id;
                  return (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => setPropertyType(pt.id)}
                      className={`h-11 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{pt.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* STEP 4: Location */}
            <section className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-black flex items-center justify-center">
                    4
                  </span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Property Location
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  Currently optimized for Gurdaspur
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    District
                  </label>
                  <div className="h-11 px-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      Gurdaspur
                    </span>
                    <span className="text-[10px] text-slate-400">Fixed</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                    Tehsil
                  </label>
                  <select
                    value={tehsil}
                    onChange={(e) => setTehsil(e.target.value)}
                    className="w-full h-11 px-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-xs focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    {GURDASPUR_TEHSILS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

          </div>

          {/* Calculate CTA Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleCalculateClick}
              className="w-full h-13 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm sm:text-base tracking-wide shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Receipt className="w-5 h-5" />
              <span>CALCULATE REGISTRY COST</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </div>

          {/* STEP 5: Results Section */}
          <section 
            ref={resultRef}
            className="rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-b from-slate-900 to-slate-950 text-white p-5 sm:p-7 shadow-xl space-y-5"
          >
            {/* Header of Result */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
                  Estimated Registry Cost
                </span>
                <p className="text-xs text-slate-400">
                  Estimated Government & Registration Cost for {tehsil}
                </p>
              </div>

              {calculation.femaleSavings > 0 && (
                <div className="bg-emerald-950/80 border border-emerald-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 self-start sm:self-auto">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-emerald-300">
                    Saves ₹{formatIndianNumber(calculation.femaleSavings)} vs Male Buyer
                  </span>
                </div>
              )}
            </div>

            {/* Total Highlight */}
            <div className="bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400 block font-medium">
                  Total Estimated Payable
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white font-['Outfit'] tracking-tight">
                  ₹{formatIndianNumber(calculation.totalRegistryCost)}
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Based on applicable value of ₹{formatIndianNumber(calculation.calculationValue)}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:self-center">
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                  {calculation.buyerType.title} • {calculation.combinedStampRate}% Stamp Rate + Slabs
                </span>
              </div>
            </div>

            {/* Itemized Clean Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                <span className="text-slate-300">
                  Stamp Duty ({calculation.stampDutyRate}% Punjab Govt Base)
                </span>
                <span className="font-bold text-sm text-white font-['Outfit']">
                  ₹{formatIndianNumber(calculation.stampDutyAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                <span className="text-slate-300">
                  Applicable Cess / Development Charges (1% SSF + 1% PIDB)
                </span>
                <span className="font-bold text-sm text-white font-['Outfit']">
                  ₹{formatIndianNumber(calculation.cessAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                <span className="text-slate-300">
                  Registration Fee (1% at Tehsil Sub-Registrar)
                </span>
                <span className="font-bold text-sm text-white font-['Outfit']">
                  ₹{formatIndianNumber(calculation.registrationFee)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                <span className="text-slate-300">
                  Facilitation Charges (PLRS Computerization Slot)
                </span>
                <span className="font-bold text-sm text-white font-['Outfit']">
                  ₹{formatIndianNumber(calculation.facilitationCharges)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                <span className="text-slate-300">
                  Mutation Fee (Sub-Tehsil Inteqaal Entry)
                </span>
                <span className="font-bold text-sm text-white font-['Outfit']">
                  ₹{formatIndianNumber(calculation.mutationFee)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                <span className="text-slate-300">
                  Other Applicable Charges (Pasting & Scanning Slip)
                </span>
                <span className="font-bold text-sm text-white font-['Outfit']">
                  ₹{formatIndianNumber(calculation.otherCharges)}
                </span>
              </div>
            </div>

            {/* Expandable Detailed Calculation */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowDetailedCalculation(!showDetailedCalculation)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-emerald-400 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer border border-slate-700"
              >
                <span>{showDetailedCalculation ? 'Hide Detailed Calculation ↑' : 'View Detailed Calculation ↓'}</span>
                {showDetailedCalculation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDetailedCalculation && (
                <div className="mt-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs animate-in fade-in duration-200">
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                    Exact Formula & Calculation Breakdown
                  </div>
                  {calculation.breakdownSteps.map((step, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-900 last:border-none last:pb-0">
                      <div>
                        <div className="font-bold text-slate-200">{step.item} ({step.rate})</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{step.formula}</div>
                      </div>
                      <div className="font-bold text-emerald-400 sm:text-right font-['Outfit']">
                        ₹{formatIndianNumber(step.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Important Disclaimer */}
            <div className="pt-2">
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-slate-300 font-bold">Important:</strong> This calculator provides an estimated calculation based on the information entered and applicable rules. Actual charges may vary depending on property type, location, deed type, applicable Collector Rate and government notifications. Please verify the final amount with the concerned Sub-Registrar/Revenue Department before making payment.
              </div>
            </div>

            {/* Useful Actions: Recalculate, Download Estimate, Share Estimate */}
            <div className="pt-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={handleRecalculate}
                className="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>Recalculate</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadEstimate}
                className="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Estimate</span>
              </button>

              <button
                type="button"
                onClick={handleShareEstimate}
                className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedShare ? 'Shared via WhatsApp!' : 'Share Estimate'}</span>
              </button>
            </div>
          </section>

          {/* Trust Elements */}
          <section className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2.5">
              Why use this calculator?
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Easy calculation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transparent breakdown</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Updated for 2026</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Gurdaspur-focused</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mobile friendly</span>
              </div>
            </div>
          </section>

          {/* SEO-Friendly Content & FAQ Accordion */}
          <section className="space-y-4 pt-2 border-t border-slate-200">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 font-['Outfit']">
                Punjab Registry & Stamp Duty Calculator 2026
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Use this calculator to estimate property registration expenses in Punjab, including stamp duty, registration charges and other applicable fees.
              </p>
            </div>

            <div className="space-y-2">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div 
                    key={index} 
                    className="border border-slate-200 rounded-xl overflow-hidden bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full px-4 py-3 text-left font-bold text-xs text-slate-800 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Bottom Done / Close Button */}
          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Done / Close Calculator
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
