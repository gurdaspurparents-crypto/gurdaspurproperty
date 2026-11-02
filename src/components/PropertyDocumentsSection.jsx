import React from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  AlertCircle, 
  HelpCircle, 
  MinusCircle, 
  FileText, 
  Building2, 
  Landmark, 
  Zap, 
  Scale 
} from 'lucide-react';

export const DOCUMENT_KEYS = [
  { 
    id: 'registry', 
    name: 'Government Registry', 
    punjabiDesc: 'Sanad / Wasika / Sale Deed registered in Tehsil',
    icon: FileCheck2 
  },
  { 
    id: 'ownershipProof', 
    name: 'Ownership & Revenue Proof', 
    punjabiDesc: 'Fard Jamabandi / Inteqaal Mutation in Revenue Records',
    icon: Landmark 
  },
  { 
    id: 'approvedMap', 
    name: 'Approved Map / Layout', 
    punjabiDesc: 'Nagar Council / PUDA / MC sanctioned building map',
    icon: Building2 
  },
  { 
    id: 'noc', 
    name: 'NOC (No Objection Certificate)', 
    punjabiDesc: 'Clearance from competent urban authority',
    icon: ShieldCheck 
  },
  { 
    id: 'propertyTax', 
    name: 'Property Tax Clear Receipt', 
    punjabiDesc: 'Up-to-date Municipal Council property tax receipt',
    icon: FileText 
  },
  { 
    id: 'electricityConnection', 
    name: 'Electricity Connection Status', 
    punjabiDesc: 'Active PSPCL domestic/commercial meter in owner name',
    icon: Zap 
  },
  { 
    id: 'bankLoan', 
    name: 'Bank Loan Eligibility', 
    punjabiDesc: 'Clear mortgage-free title approved by major banks',
    icon: Landmark 
  },
  { 
    id: 'legalDispute', 
    name: 'Legal Dispute / Court Case', 
    punjabiDesc: '100% free of family litigation, stay orders or disputes',
    icon: Scale 
  }
];

export const STATUS_OPTIONS = [
  { 
    value: 'Available', 
    label: 'Available', 
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    btnActive: 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
  },
  { 
    value: 'Not Available', 
    label: 'Not Available', 
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    btnActive: 'bg-rose-600 text-white border-rose-600 shadow-xs' 
  },
  { 
    value: 'Not Checked', 
    label: 'Not Checked', 
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    btnActive: 'bg-amber-600 text-white border-amber-600 shadow-xs' 
  },
  { 
    value: 'Not Applicable', 
    label: 'Not Applicable', 
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    btnActive: 'bg-slate-700 text-white border-slate-700 shadow-xs' 
  }
];

export default function PropertyDocumentsSection({ documents = {}, onChange }) {
  const handleStatusChange = (docId, status) => {
    onChange({
      ...documents,
      [docId]: status
    });
  };

  return (
    <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            Property Legal Documents & Verification Status
          </span>
        </div>
        <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full uppercase">
          Due Diligence
        </span>
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed">
        Mark the physical availability of each government document. Verified documents protect buyers and accelerate property transactions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
        {DOCUMENT_KEYS.map((doc) => {
          const currentStatus = documents[doc.id] || 'Not Checked';
          const Icon = doc.icon;

          return (
            <div 
              key={doc.id} 
              className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                    <Icon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{doc.name}</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                    currentStatus === 'Available' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                      : currentStatus === 'Not Available'
                      ? 'bg-rose-50 text-rose-700 border-rose-300'
                      : currentStatus === 'Not Checked'
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-slate-50 text-slate-600 border-slate-300'
                  }`}>
                    {currentStatus}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                  {doc.punjabiDesc}
                </p>
              </div>

              {/* 4 Interactive Status Options */}
              <div className="grid grid-cols-4 gap-1 pt-1">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleStatusChange(doc.id, opt.value)}
                    className={`py-1 px-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer text-center truncate ${
                      currentStatus === opt.value
                        ? opt.btnActive
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label === 'Not Applicable' ? 'N/A' : opt.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
