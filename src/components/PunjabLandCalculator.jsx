import React, { useState } from 'react';
import { 
  Calculator, 
  X, 
  ArrowRightLeft, 
  HelpCircle, 
  Info,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function PunjabLandCalculator({ isOpen, onClose }) {
  const [standard, setStandard] = useState('225'); // '225' (Colony) or '272.25' (Revenue/Patwari)
  const [inputValue, setInputValue] = useState('10');
  const [inputUnit, setInputUnit] = useState('marla'); // marla, kanal, gaj, sqft, acre

  if (!isOpen) return null;

  const sqFtPerMarla = parseFloat(standard);
  const sqFtPerGaj = 9; // 1 Sq Yard = 9 Sq Ft always
  const marlaPerKanal = 20;
  const sqFtPerKanal = sqFtPerMarla * marlaPerKanal;
  const sqFtPerAcre = 43560; // Standard 1 Acre = 43,560 sq ft

  // Convert input to Sq. Feet first as common baseline
  const val = parseFloat(inputValue) || 0;
  let totalSqFt = 0;

  if (inputUnit === 'marla') {
    totalSqFt = val * sqFtPerMarla;
  } else if (inputUnit === 'kanal') {
    totalSqFt = val * sqFtPerKanal;
  } else if (inputUnit === 'gaj') {
    totalSqFt = val * sqFtPerGaj;
  } else if (inputUnit === 'sqft') {
    totalSqFt = val;
  } else if (inputUnit === 'acre') {
    totalSqFt = val * sqFtPerAcre;
  }

  // Calculate other units
  const marlas = totalSqFt / sqFtPerMarla;
  const kanals = totalSqFt / sqFtPerKanal;
  const gaj = totalSqFt / sqFtPerGaj;
  const acres = totalSqFt / sqFtPerAcre;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 relative text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-5 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Outfit']">Punjab Land Unit Converter</h2>
              <p className="text-xs text-amber-100">Marla • Kanal • Gaj • Sq.Ft • Acre Calculator</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          
          {/* Standard Selector Tab */}
          <div className="mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Select Measurement Standard (Marla Size)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStandard('225')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  standard === '225'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-sm">Colony / Town Planning</div>
                <div className={`text-xs mt-0.5 ${standard === '225' ? 'text-amber-100' : 'text-slate-500'}`}>
                  1 Marla = 225 Sq.Ft (25 Gaj)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStandard('272.25')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  standard === '272.25'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-sm">Revenue / Patwari Standard</div>
                <div className={`text-xs mt-0.5 ${standard === '272.25' ? 'text-amber-100' : 'text-slate-500'}`}>
                  1 Marla = 272.25 Sq.Ft (30.25 Gaj)
                </div>
              </button>
            </div>
            
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Gurdaspur residential societies mainly use 225 Sq.Ft per Marla, while agricultural registries use 272.25 Sq.Ft.</span>
            </p>
          </div>

          {/* Input Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Enter Value (Maap Daalo)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full text-2xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-amber-500"
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Select Unit
              </label>
              <select
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value)}
                className="w-full h-[58px] bg-slate-50 border-2 border-slate-200 rounded-xl px-3 text-base font-bold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="marla">Marla (ਮਰਲਾ)</option>
                <option value="kanal">Kanal (ਕਨਾਲ)</option>
                <option value="gaj">Gaj / Sq.Yards (ਗਜ਼)</option>
                <option value="sqft">Sq. Feet (ਸਕੇਅਰ ਫੁੱਟ)</option>
                <option value="acre">Acre / Killa (ਕਿੱਲਾ)</option>
              </select>
            </div>
          </div>

          {/* Real-time Converted Results Cards */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Converted Land Measurements:
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3 text-center">
                <div className="text-[11px] font-bold uppercase text-amber-800">Total Marla</div>
                <div className="text-xl font-black text-amber-900 mt-1 font-['Outfit']">
                  {marlas.toFixed(2).replace(/\.00$/, '')}
                </div>
                <div className="text-[10px] text-amber-700">Marlas</div>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3 text-center">
                <div className="text-[11px] font-bold uppercase text-emerald-800">Total Kanal</div>
                <div className="text-xl font-black text-emerald-900 mt-1 font-['Outfit']">
                  {kanals.toFixed(2).replace(/\.00$/, '')}
                </div>
                <div className="text-[10px] text-emerald-700">1 Kanal = 20 Marla</div>
              </div>

              <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-3 text-center">
                <div className="text-[11px] font-bold uppercase text-blue-800">Square Yards (Gaj)</div>
                <div className="text-xl font-black text-blue-900 mt-1 font-['Outfit']">
                  {Math.round(gaj).toLocaleString()}
                </div>
                <div className="text-[10px] text-blue-700">Gaj / Sq.Yards</div>
              </div>

              <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-2xl p-3 text-center">
                <div className="text-[11px] font-bold uppercase text-indigo-800">Square Feet</div>
                <div className="text-xl font-black text-indigo-900 mt-1 font-['Outfit']">
                  {Math.round(totalSqFt).toLocaleString()}
                </div>
                <div className="text-[10px] text-indigo-700">Sq. Feet (ft²)</div>
              </div>

              <div className="bg-purple-50/60 border border-purple-200/80 rounded-2xl p-3 text-center">
                <div className="text-[11px] font-bold uppercase text-purple-800">Acre / Killa</div>
                <div className="text-xl font-black text-purple-900 mt-1 font-['Outfit']">
                  {acres.toFixed(3)}
                </div>
                <div className="text-[10px] text-purple-700">1 Acre = 8 Kanal</div>
              </div>

              <div className="bg-slate-100 border border-slate-200 rounded-2xl p-3 text-center">
                <div className="text-[11px] font-bold uppercase text-slate-600">Standard Used</div>
                <div className="text-base font-bold text-slate-800 mt-1">
                  {standard} ft²
                </div>
                <div className="text-[10px] text-slate-500">per Marla</div>
              </div>

            </div>
          </div>

          {/* Quick Punjab Reference Cheat-sheet */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Punjab Revenue Land Table (ਪੰਜਾਬ ਜ਼ਮੀਨੀ ਮਾਪ):
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px]">
              <div>• 1 Karam = 5.5 Feet (66 inches)</div>
              <div>• 1 Sarsahi = 30.25 Sq. Feet</div>
              <div>• 1 Marla = 9 Sarsahis (272.25 Sq.Ft)</div>
              <div>• 1 Kanal = 20 Marlas (5,445 Sq.Ft)</div>
              <div>• 1 Killa / Acre = 8 Kanals (160 Marlas)</div>
              <div>• 1 Murabba = 25 Killas (200 Kanals)</div>
            </div>
          </div>

          {/* Close button */}
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Done / Close Converter
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
