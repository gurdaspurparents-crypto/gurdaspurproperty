import React, { useState } from 'react';
import { 
  FileCheck2, 
  X, 
  Calculator, 
  Percent, 
  Sparkles, 
  Info, 
  Scale, 
  CheckCircle2,
  Building,
  UserCheck
} from 'lucide-react';

export default function PunjabStampDutyCalculator({ isOpen, onClose }) {
  const [propertyValue, setPropertyValue] = useState('3500000'); // 35 Lakh default
  const [ownerGender, setOwnerGender] = useState('female'); // female (5%), male (7%), joint (6%)
  const [areaType, setAreaType] = useState('urban'); // urban, rural

  if (!isOpen) return null;

  const numericValue = parseFloat(propertyValue) || 0;

  // Punjab Stamp duty rates:
  // Male: 7% (5% Stamp duty + 1% Social Security + 1% PIDB)
  // Female: 5% (3% Stamp duty + 1% Social Security + 1% PIDB) [Govt gives 2% discount for female buyers]
  // Joint: 6%
  let stampDutyRate = 0.07;
  if (ownerGender === 'female') stampDutyRate = 0.05;
  if (ownerGender === 'joint') stampDutyRate = 0.06;

  const stampDutyAmount = Math.round(numericValue * stampDutyRate);
  const registrationFee = Math.round(numericValue * 0.01); // 1% Punjab registration fee
  const facilitationFee = 2500; // Standard PLRS facilitation & mutation charges
  const totalRegistryCost = stampDutyAmount + registrationFee + facilitationFee;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 relative text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white px-6 py-5 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <FileCheck2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-['Outfit']">Punjab Registry & Stamp Duty Calculator</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-900 px-2 py-0.5 rounded-full">
                  2026 Updated
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">Tehsil Gurdaspur Official Registry & Registration Estimator</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Property Value Input */}
          <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center justify-between">
              <span>Total Registry / Agreement Value (₹)</span>
              <span className="text-emerald-700 font-semibold text-xs">
                ₹{numericValue.toLocaleString('en-IN')}
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-lg font-bold text-slate-400">₹</span>
              <input
                type="number"
                min="0"
                step="50000"
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value)}
                className="w-full text-2xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl pl-9 pr-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-600 font-['Outfit']"
                placeholder="3500000"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Collector/DC Rate or Actual Transaction Agreement Value (whichever is higher).
            </p>
          </div>

          {/* Gender / Ownership Selector with Punjab Rebate Highlight */}
          <div className="mb-6 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                Buyer Ownership Category (Punjab Govt Rules)
              </label>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-700" />
                Female 2% Discount
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setOwnerGender('female')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  ownerGender === 'female'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-sm">Female Buyer</div>
                <div className={`text-xs mt-0.5 ${ownerGender === 'female' ? 'text-emerald-100' : 'text-emerald-600 font-semibold'}`}>
                  Only 5% Total Duty
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOwnerGender('joint')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  ownerGender === 'joint'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-sm">Joint (Male + Female)</div>
                <div className={`text-xs mt-0.5 ${ownerGender === 'joint' ? 'text-emerald-100' : 'text-slate-500'}`}>
                  6% Total Duty
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOwnerGender('male')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  ownerGender === 'male'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-sm">Male Buyer</div>
                <div className={`text-xs mt-0.5 ${ownerGender === 'male' ? 'text-emerald-100' : 'text-slate-500'}`}>
                  7% Total Duty
                </div>
              </button>
            </div>
          </div>

          {/* Breakdown Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 mb-5 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center justify-between">
              <span>Estimated Registry Expense Breakdown</span>
              <span>Tehsil Gurdaspur</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-300">
                  Stamp Duty ({Math.round(stampDutyRate * 100)}% Punjab Govt)
                </span>
                <span className="font-bold text-sm text-white">
                  ₹{stampDutyAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-300">Registration Fee (1% at Tehsil)</span>
                <span className="font-bold text-sm text-white">
                  ₹{registrationFee.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-300">PLRS Facilitation, Computer & Mutation Fee</span>
                <span className="font-bold text-sm text-white">
                  ₹{facilitationFee.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 text-base font-extrabold text-emerald-400">
                <span>Total Approximate Government Cost</span>
                <span className="text-2xl font-black text-white font-['Outfit']">
                  ₹{totalRegistryCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Advisory Notice */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-slate-600 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>Advise from Gurdaspur Property Consultants:</strong> Adding a female co-owner saves <strong>2% direct stamp duty</strong> (₹{(numericValue * 0.02).toLocaleString('en-IN')} saving on this property). Our consultancy prepares legal drafts, verifies Fard/Inteqaal records, and handles appointment booking at Gurdaspur Sub-Registrar Office.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Done / Close Calculator
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
