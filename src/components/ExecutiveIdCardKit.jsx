import React, { useState } from 'react';
import { 
  Printer, 
  ShieldCheck, 
  QrCode, 
  Phone, 
  MapPin, 
  Globe, 
  Sparkles, 
  User, 
  BadgeCheck, 
  FileText,
  Download
} from 'lucide-react';

export default function ExecutiveIdCardKit({ settings }) {
  const [executiveName, setExecutiveName] = useState('Authorized Field Executive');
  const [executivePhone, setExecutivePhone] = useState('+91 81465 26257');
  const [employeeId, setEmployeeId] = useState('GP-SURV-2026');
  const [validUntil, setValidUntil] = useState('31 Dec 2027');

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://www.gurdaspurproperty.in&color=071c35`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2.5 py-0.5 rounded-full">
            Credibility & Verification Kit
          </span>
          <h3 className="text-base font-extrabold text-slate-900 font-['Outfit'] mt-1">
            Staff ID Badge & Visiting Card Generator
          </h3>
          <p className="text-xs text-slate-500">
            Printable authorization credentials for your door-to-door field surveyors
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>Print Credentials / Cards</span>
        </button>
      </div>

      {/* Customization Inputs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
          Staff Details for Card Printing
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Executive Name</label>
            <input
              type="text"
              value={executiveName}
              onChange={(e) => setExecutiveName(e.target.value)}
              placeholder="e.g. Raman Kumar"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Mobile Number</label>
            <input
              type="text"
              value={executivePhone}
              onChange={(e) => setExecutivePhone(e.target.value)}
              placeholder="e.g. +91 98140XXXXX"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Employee Code</label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="GP-SURV-2026"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Validity Period</label>
            <input
              type="text"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              placeholder="31 Dec 2027"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Cards Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* CARD 1: Vertical Staff ID Badge */}
        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Official Field Staff ID Badge (Vertical Lanyard Format)
          </span>

          {/* Actual Printable Badge */}
          <div className="w-[280px] bg-white rounded-2xl overflow-hidden border-2 border-slate-300 shadow-xl text-center relative font-sans">
            {/* Badge Top Header */}
            <div className="bg-[#071c35] text-white p-3.5 pb-4 relative">
              <div className="flex justify-center mb-1">
                <img src="/logo.svg" alt="Logo" className="h-9 w-auto brightness-125" />
              </div>
              <div className="text-[10px] font-extrabold tracking-wider text-emerald-400 uppercase">
                Authorized Field Property Surveyor
              </div>
            </div>

            {/* Photo & Identity */}
            <div className="p-4 space-y-2">
              <div className="w-20 h-24 mx-auto rounded-xl border-2 border-dashed border-slate-300 bg-slate-100 flex flex-col items-center justify-center text-slate-400">
                <User className="w-8 h-8 text-slate-400" />
                <span className="text-[8px] font-bold text-slate-400 mt-1">AFFIX PHOTO</span>
              </div>

              <div>
                <h4 className="text-base font-black text-slate-900 font-['Outfit']">
                  {executiveName}
                </h4>
                <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                  ID: {employeeId}
                </div>
              </div>

              <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-semibold text-slate-800">Field Survey & Verification</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mobile:</span>
                  <span className="font-semibold text-slate-800">{executivePhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Valid Till:</span>
                  <span className="font-semibold text-slate-800">{validUntil}</span>
                </div>
              </div>

              {/* QR Verification */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
                <img src={qrCodeUrl} alt="QR Code" className="w-14 h-14 rounded-lg border border-slate-200" />
                <div className="text-left text-[9px] text-slate-500 leading-tight">
                  <strong className="text-slate-800 block">Scan to Verify:</strong>
                  Official website portal
                  <span className="text-emerald-700 font-bold block">gurdaspurproperty.in</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-slate-100 p-2 text-[9px] text-slate-500 border-t border-slate-200">
              Travelx, Batala Road, Gurdaspur • Helpline: {settings.primaryPhone}
            </div>
          </div>
        </div>

        {/* CARD 2: Visiting Card (Front & Back) */}
        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block text-center">
            Standard Visiting Card (3.5" × 2" Format)
          </span>

          {/* Visiting Card Front */}
          <div className="w-full max-w-sm mx-auto h-48 bg-gradient-to-br from-[#06152b] via-[#071c35] to-[#041224] text-white rounded-2xl p-4 shadow-xl border border-slate-700/80 flex flex-col justify-between relative overflow-hidden font-sans">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

            <div className="flex justify-between items-start">
              <div>
                <img src="/logo.svg" alt="Logo" className="h-9 w-auto brightness-110" />
                <div className="text-[10px] font-bold text-slate-300 mt-1">
                  Premier Real Estate & Advisory Desk
                </div>
              </div>
              <img src={qrCodeUrl} alt="QR" className="w-12 h-12 rounded-lg bg-white p-0.5 shrink-0" />
            </div>

            <div className="border-t border-white/10 pt-2 flex justify-between items-end">
              <div>
                <div className="text-sm font-black text-white font-['Outfit']">{executiveName}</div>
                <div className="text-[10px] font-semibold text-emerald-400">Field Property Surveyor</div>
                <div className="text-[10px] text-slate-300 mt-0.5">{executivePhone}</div>
              </div>

              <div className="text-right text-[9px] text-slate-300">
                <div className="font-bold text-white">Batala Road, Gurdaspur</div>
                <div className="text-[8px] text-slate-400">Near Vishal Mega Mart</div>
                <div className="text-emerald-400 font-bold text-[10px]">gurdaspurproperty.in</div>
              </div>
            </div>
          </div>

          {/* Visiting Card Back (Trust Checklist) */}
          <div className="w-full max-w-sm mx-auto h-48 bg-white text-slate-900 rounded-2xl p-4 shadow-xl border border-slate-200 flex flex-col justify-between font-sans">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span>0% Commission to List Your Property</span>
                <span className="text-slate-500">Verified Platform</span>
              </div>
              <div className="mt-2 space-y-1.5 text-[11px] text-slate-700 font-medium">
                <div className="flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Rooms & Houses Rented to Verified Tenants</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Plots, Kothis & Commercial Shops Sold Fast</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Tehsil Registry, Stamp Duty & Inteqaal Guidance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Dedicated NRI Property Advisory Desk</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100 text-[10px] font-bold text-slate-800">
              Helpline: {settings.primaryPhone} • www.gurdaspurproperty.in
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
