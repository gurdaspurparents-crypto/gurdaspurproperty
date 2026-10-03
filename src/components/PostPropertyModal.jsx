import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  MessageCircle, 
  Home, 
  MapPin, 
  IndianRupee, 
  Maximize2, 
  Sparkles,
  ShieldCheck,
  Lock,
  EyeOff,
  User,
  Phone,
  FileCheck2,
  Compass,
  ArrowRight,
  Layers,
  Info
} from 'lucide-react';
import { addLead } from '../utils/storage';
import { GURDASPUR_LOCALITIES } from '../data/initialProperties';

export default function PostPropertyModal({ isOpen, onClose, settings }) {
  const [step, setStep] = useState(1); // Step 1: Property Specs | Step 2: Confidential Details
  const [formData, setFormData] = useState({
    // Basic Property Details
    purpose: 'sell', // 'sell' | 'rent'
    category: 'plot', // 'plot' | 'kothi' | 'commercial' | 'land'
    locality: 'Tibri Road',
    subArea: '', // Public landmark (e.g., Near Army Cantt)
    
    // Specifications
    size: '',
    unit: 'Marla',
    dimensions: '', // Front x Depth
    roadWidth: '30 Feet Road',
    facing: 'East',
    registryStatus: '100% Pucca Registry & Clear Mutation',
    expectedPrice: '',
    isNegotiable: true,
    description: '',

    // STRICTLY CONFIDENTIAL - ADMIN ONLY
    exactLocation: '', // House #, Street #, Khasra #
    sellerName: '',
    phone: '',
    ownerRole: 'Owner' // 'Owner' | 'Family Member' | 'NRI Representative' | 'POA Holder'
  });

  const [submitted, setSubmitted] = useState(false);
  const [lastSubmittedLead, setLastSubmittedLead] = useState(null);

  if (!isOpen) return null;

  const cleanAdminPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.size || !formData.expectedPrice) {
      alert("Kripya property ka size aur expected price bharein.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.sellerName) {
      alert("Kripya apna naam aur phone number zaroor bharein.");
      return;
    }

    // Save lead into Admin local database
    const saved = addLead({
      name: formData.sellerName,
      phone: formData.phone,
      type: 'seller_listing',
      ownerRole: formData.ownerRole,
      purpose: formData.purpose,
      category: formData.category,
      locality: formData.locality,
      subArea: formData.subArea,
      exactLocation: formData.exactLocation || 'Shared on Call/WhatsApp', // STRICTLY CONFIDENTIAL
      size: `${formData.size} ${formData.unit}`,
      dimensions: formData.dimensions,
      roadWidth: formData.roadWidth,
      facing: formData.facing,
      registryStatus: formData.registryStatus,
      price: formData.expectedPrice,
      isNegotiable: formData.isNegotiable,
      notes: formData.description,
      isConfidential: true
    });

    setLastSubmittedLead(saved);
    setSubmitted(true);
  };

  const handleSendToWhatsApp = () => {
    const text = encodeURIComponent(
      `🔒 *CONFIDENTIAL PROPERTY SUBMISSION (Admin Eyes Only)*\n\n` +
      `👤 *Owner Details (PRIVATE):*\n` +
      `• Name: ${formData.sellerName}\n` +
      `• Mobile: ${formData.phone}\n` +
      `• Role: ${formData.ownerRole}\n\n` +
      `📍 *Confidential Location (NOT FOR WEBSITE):*\n` +
      `• Exact Address/Khasra: ${formData.exactLocation || 'Will share in private'}\n` +
      `• General Locality: ${formData.locality} (${formData.subArea || 'Gurdaspur'})\n\n` +
      `📐 *Property Specs:*\n` +
      `• Listing: ${formData.purpose === 'sell' ? 'For Sale' : 'For Rent'}\n` +
      `• Type: ${formData.category.toUpperCase()}\n` +
      `• Size: ${formData.size} ${formData.unit} ${formData.dimensions ? `(${formData.dimensions})` : ''}\n` +
      `• Road Width: ${formData.roadWidth}\n` +
      `• Facing: ${formData.facing}\n` +
      `• Registry: ${formData.registryStatus}\n` +
      `• Demand: ₹${formData.expectedPrice} ${formData.isNegotiable ? '(Negotiable)' : '(Fixed)'}\n` +
      `• Extra Notes: ${formData.description || 'N/A'}\n\n` +
      `⚠️ *Privacy Reminder:* As requested, keep my phone number & exact location confidential. Only coordinate deals via your office.`
    );
    window.open(`https://wa.me/${cleanAdminPhone}?text=${text}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* 99acres-Style Modern Header */}
        <div className="bg-[#071c35] text-white px-6 py-5 rounded-t-3xl flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <img 
              src="/logo.svg" 
              alt="Gurdaspur Property" 
              className="h-10 sm:h-12 w-auto object-contain brightness-110 shrink-0" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                  0% Commission to List
                </span>
                <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  100% Privacy Protected
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold font-['Outfit'] mt-1 text-white">
                Post Your Property in Gurdaspur (FREE)
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Confidentiality Assurance Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-start gap-2.5 text-xs text-amber-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong>Customer Privacy Rule:</strong> Aapka mobile number aur exact makan/khasra number website par <strong>kabhi public nahi kiya jayega</strong>. Ye details sirf hamare verified consultant office (Admin) ke pass rahengi.
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Saved Privately in Admin Portal
              </span>

              <h3 className="text-2xl font-black text-slate-900 font-['Outfit'] mt-3">
                Property Successfully Submitted!
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2 mb-6 leading-relaxed">
                Shukriya, <strong>{formData.sellerName}</strong>! Aapki property details hamare principal consultant ke pass secure database mein darj ho chuki hain. 
                <br/><br/>
                <span className="font-semibold text-slate-800">
                  Aapka contact number aur exact location kisi bhi visitor ko website par nahi dikhega.
                </span>
              </p>

              <div className="space-y-3 max-w-md mx-auto">
                <button
                  onClick={handleSendToWhatsApp}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                  <span>Send Photos & Verify on WhatsApp Directly</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <div>
              
              {/* Step Progression Tabs (99acres Style) */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`text-xs font-bold pb-1 transition-colors flex items-center gap-1.5 ${
                    step === 1 ? 'text-[#005ca8] border-b-2 border-[#005ca8]' : 'text-slate-400'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black">1</span>
                  <span>Property Details & Specs</span>
                </button>

                <button
                  type="button"
                  onClick={() => formData.size && formData.expectedPrice && setStep(2)}
                  className={`text-xs font-bold pb-1 transition-colors flex items-center gap-1.5 ${
                    step === 2 ? 'text-[#005ca8] border-b-2 border-[#005ca8]' : 'text-slate-400'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black">2</span>
                  <span>Confidential Owner Contact (Admin Only)</span>
                </button>
              </div>

              {/* STEP 1: Property Specifications */}
              {step === 1 && (
                <form onSubmit={handleNextStep} className="space-y-4">
                  
                  {/* Purpose Toggle */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      I Want To:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, purpose: 'sell' })}
                        className={`py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all border ${
                          formData.purpose === 'sell'
                            ? 'bg-[#005ca8] text-white border-[#005ca8] shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        🏡 Sell Property (Bechna Hai)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, purpose: 'rent' })}
                        className={`py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all border ${
                          formData.purpose === 'rent'
                            ? 'bg-[#005ca8] text-white border-[#005ca8] shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        🔑 Rent Out (Kiraye Par Dena Hai)
                      </button>
                    </div>
                  </div>

                  {/* Property Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Property Category:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'plot', label: 'Plot / Land', icon: '📐' },
                        { id: 'kothi', label: 'Kothi / House', icon: '🏰' },
                        { id: 'commercial', label: 'Commercial SCO', icon: '🏬' },
                        { id: 'land', label: 'Agricultural', icon: '🚜' }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat.id })}
                          className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 ${
                            formData.category === cat.id
                              ? 'bg-blue-50 text-[#005ca8] border-blue-400 shadow-2xs font-extrabold'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-base">{cat.icon}</span>
                          <span>{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* General Locality & Public Landmark */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        Gurdaspur Locality (Public)
                      </label>
                      <select
                        value={formData.locality}
                        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                      >
                        {GURDASPUR_LOCALITIES.filter(l => l !== 'All Localities').map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nearest Landmark / Colony Name (Public)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near St. Soldier School / Civil Lines"
                        value={formData.subArea}
                        onChange={(e) => setFormData({ ...formData, subArea: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Size & Units */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Property Size *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="any"
                          required
                          placeholder="e.g. 10 or 1500"
                          value={formData.size}
                          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                        <select
                          value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800"
                        >
                          <option value="Marla">Marla</option>
                          <option value="Kanal">Kanal</option>
                          <option value="Gaj">Gaj (Sq. Yd)</option>
                          <option value="Sq.Ft">Sq.Ft</option>
                          <option value="Acre">Acre</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Dimensions (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 30 × 75 ft"
                        value={formData.dimensions}
                        onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Price & Demand */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Expected Total Demand / Price (₹) *
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 3500000 (35 Lakh) or 16000 for rent"
                          value={formData.expectedPrice}
                          onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isNegotiable}
                          onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span>Negotiable</span>
                      </label>
                    </div>
                  </div>

                  {/* Next Step Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#005ca8] hover:bg-[#004885] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Confidential Owner Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </form>
              )}

              {/* STEP 2: Strictly Confidential Owner Details (Admin Eyes Only) */}
              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Red/Amber Confidential Alert Card */}
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-950">
                    <div className="flex items-center gap-2 font-black uppercase text-[11px] text-rose-700 mb-1">
                      <Lock className="w-4 h-4 text-rose-600" />
                      <span>Strictly Confidential • Admin Eyes Only</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-rose-900">
                      Neeche di gayi details (Aapka mobile number aur Makan/Khasra number) <strong>website par public kabhi nahi hogi</strong>. Sirf hamari official team aapse direct deal confirm karne ke liye contact karegi.
                    </p>
                  </div>

                  {/* Exact Address / Khasra No (Confidential) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                      Exact Address / Street / Khasra No. (Private to Admin) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House #42, Street #3, Opp Water Tank, Khasra #128/4"
                      value={formData.exactLocation}
                      onChange={(e) => setFormData({ ...formData, exactLocation: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-rose-200/80 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      🔒 Ye exact address website par nahi aayega, sirf Admin ke private portal mein save hoga.
                    </span>
                  </div>

                  {/* Owner Name & Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        Owner Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Gurpreet Singh"
                        value={formData.sellerName}
                        onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Who Are You?
                      </label>
                      <select
                        value={formData.ownerRole}
                        onChange={(e) => setFormData({ ...formData, ownerRole: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                      >
                        <option value="Owner (Malik)">Property Owner (Malik)</option>
                        <option value="Family Member">Family Member</option>
                        <option value="Power of Attorney Holder">Power of Attorney (POA) Holder</option>
                        <option value="NRI Representative">NRI Family Representative</option>
                      </select>
                    </div>
                  </div>

                  {/* Owner Mobile Number (Confidential) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      Owner Mobile / WhatsApp Number (Confidential) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-emerald-300 rounded-xl px-3 py-2.5 text-xs font-black text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                    <span className="text-[10px] text-emerald-700 mt-1 block font-medium">
                      ✓ No spam: Sirf verified deals ke liye consultant aapse connect karega.
                    </span>
                  </div>

                  {/* Legal / Registry Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                        Registry Document Status
                      </label>
                      <select
                        value={formData.registryStatus}
                        onChange={(e) => setFormData({ ...formData, registryStatus: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
                      >
                        <option value="100% Pucca Registry & Clear Mutation">100% Pucca Registry & Inteqaal</option>
                        <option value="Colony Demarcation (Plot Pillars Done)">Colony Demarcation & Pillars</option>
                        <option value="Direct Registry from Farmer/Landlord">Direct Farmer/Landlord Registry</option>
                        <option value="Power of Attorney (POA)">Power of Attorney (POA)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Road Width in Front
                      </label>
                      <select
                        value={formData.roadWidth}
                        onChange={(e) => setFormData({ ...formData, roadWidth: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
                      >
                        <option value="30 Feet Wide Road">30 Feet Road</option>
                        <option value="35 Feet Wide Road">35 Feet Road</option>
                        <option value="40 Feet Wide Road">40 Feet Road</option>
                        <option value="60+ Feet Main Highway">60+ Feet Highway Road</option>
                        <option value="20-25 Feet Colony Road">20-25 Feet Colony Road</option>
                      </select>
                    </div>
                  </div>

                  {/* Additional Remarks */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Additional Remarks / Demarcation Details (Optional)
                    </label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Corner plot, 2 sides open, borewell connection, immediate sale needed..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                    ></textarea>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="py-3 px-5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                    >
                      ← Back
                    </button>

                    <button
                      type="submit"
                      className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit Securely to Admin (100% Confidential)</span>
                    </button>
                  </div>

                </form>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
