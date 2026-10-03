import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  CheckCircle2, 
  MessageCircle, 
  Home, 
  MapPin, 
  IndianRupee, 
  Maximize2,
  Sparkles
} from 'lucide-react';
import { addLead } from '../utils/storage';
import { GURDASPUR_LOCALITIES } from '../data/initialProperties';

export default function PostPropertyModal({ isOpen, onClose, settings }) {
  const [formData, setFormData] = useState({
    sellerName: '',
    phone: '',
    purpose: 'sell',
    category: 'plot',
    locality: 'Tibri Road',
    size: '',
    unit: 'Marla',
    expectedPrice: '',
    description: ''
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.sellerName) return;

    addLead({
      name: formData.sellerName,
      phone: formData.phone,
      type: 'seller_listing',
      purpose: formData.purpose,
      category: formData.category,
      locality: formData.locality,
      size: `${formData.size} ${formData.unit}`,
      price: formData.expectedPrice,
      notes: formData.description
    });

    setSubmitted(true);
  };

  const handleSendToWhatsApp = () => {
    const text = encodeURIComponent(
      `*New Property Listing Submission on GurdaspurProperty.in:*\n\n` +
      `• *Owner Name:* ${formData.sellerName}\n` +
      `• *Phone:* ${formData.phone}\n` +
      `• *Listing For:* ${formData.purpose === 'sell' ? 'For Sale' : 'For Rent'}\n` +
      `• *Type:* ${formData.category}\n` +
      `• *Location:* ${formData.locality}, Gurdaspur\n` +
      `• *Size:* ${formData.size} ${formData.unit}\n` +
      `• *Expected Price:* ₹${formData.expectedPrice}\n` +
      `• *Details:* ${formData.description || 'N/A'}\n\n` +
      `Please contact me to list this on your portal & arrange genuine buyers.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 relative text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white px-6 py-5 rounded-t-3xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">Free Property Listing</span>
            <h2 className="text-xl font-bold font-['Outfit']">Post Your Property in Gurdaspur</h2>
            <p className="text-xs text-emerald-100 mt-0.5">Apni plot, kothi ya zameen bechne ya kiraye par dene ke liye submit karein</p>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-['Outfit']">
                Property Submitted Successfully!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 mb-6">
                Thank you, <strong>{formData.sellerName}</strong>. Your property details have been recorded in our consultant system. We will verify and contact you.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleSendToWhatsApp}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                  <span>Send Photos & Details on WhatsApp Now</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  Done & Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Your Name (Aapka Naam) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gurpreet Singh"
                    value={formData.sellerName}
                    onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98888 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Purpose & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Looking to (Purpose)
                  </label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="sell">Sell Property (Bechna Hai)</option>
                    <option value="rent">Rent Out (Kiraye Par Dena Hai)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Property Type
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="plot">Residential Plot</option>
                    <option value="kothi">Kothi / House / Villa</option>
                    <option value="commercial">Commercial Shop / SCO / Showroom</option>
                    <option value="land">Agricultural Land / Farmhouse</option>
                  </select>
                </div>
              </div>

              {/* Locality & Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Locality / Area in Gurdaspur
                  </label>
                  <select
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {GURDASPUR_LOCALITIES.filter(l => l !== 'All Localities').map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                    <option value="Other Area">Other / Outer Gurdaspur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Size (Maap)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-28 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="Marla">Marla</option>
                      <option value="Kanal">Kanal</option>
                      <option value="Gaj">Gaj</option>
                      <option value="Acre">Acre</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Expected Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Expected Price (Demanded Rate)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹35 Lakh or ₹3.5 Lakh/Marla"
                  value={formData.expectedPrice}
                  onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Extra Details */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Additional Details / Landmark (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Corner plot, 30 ft road, boundary wall done, registry in my name"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all cursor-pointer mt-2"
              >
                Submit Property Listing (Free)
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                🔒 Your contact details are kept secure and only used for genuine buyer inquiries.
              </p>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
