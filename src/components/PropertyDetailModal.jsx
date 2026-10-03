import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  IndianRupee, 
  Maximize2, 
  ShieldCheck, 
  MessageCircle, 
  Phone, 
  Calendar, 
  Compass, 
  CheckCircle2, 
  Share2,
  FileCheck,
  Check,
  Play,
  Video
} from 'lucide-react';
import { addLead } from '../utils/storage';

export default function PropertyDetailModal({ 
  property, 
  settings, 
  onClose,
  onOpenCalculator
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!property) return null;

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const formatPrice = (price, purpose) => {
    if (purpose === 'rent') return `₹${price.toLocaleString('en-IN')} / month`;
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2).replace(/\.00$/, '')} Crore`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryPhone) return;

    addLead({
      name: inquiryName || 'Website Inquirer',
      phone: inquiryPhone,
      type: 'inquiry',
      propertyId: property.id,
      propertyTitle: property.title,
      price: property.price,
      location: property.location,
      notes: `Interested in ${property.id}: ${property.title}`
    });

    setInquirySubmitted(true);
    setTimeout(() => {
      // Also trigger WhatsApp option
      const waMsg = encodeURIComponent(
        `Hi! I submitted an inquiry on GurdaspurProperty.in:\n\n*Name:* ${inquiryName || 'Buyer'}\n*Phone:* ${inquiryPhone}\n*Property:* ${property.title} (ID: ${property.id})\n\nPlease arrange a site visit or call me back.`
      );
      window.open(`https://wa.me/${cleanPhone}?text=${waMsg}`, '_blank');
    }, 800);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const images = property.images && property.images.length > 0 ? property.images : [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"
  ];

  const whatsappMessage = encodeURIComponent(
    `Hello! I want more details & site visit for:\n\n*${property.title}*\n• ID: ${property.id}\n• Location: ${property.location} (${property.cityArea})\n• Size: ${property.size} ${property.unit}\n• Price: ${property.pricePerUnit || formatPrice(property.price, property.purpose)}\n\nPlease share video, registry papers & seller meeting timing.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 relative text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Header with Close */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded">
              {property.id}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
              {property.purpose === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            {property.verified && (
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                Verified Title
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              title="Share Link"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">

          {/* Image Showcase */}
          <div className="mb-6">
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 shadow-md">
              <img 
                src={images[activeImageIndex]} 
                alt={property.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full">
                {activeImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail list */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-emerald-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Video Walkthrough Banner */}
            {property.videoUrl && (
              <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-200 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-purple-950">Property Video Walkthrough Available</div>
                    <div className="text-[10px] text-purple-700">Watch verified virtual tour of this property</div>
                  </div>
                </div>
                <a
                  href={property.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Watch Video Tour</span>
                </a>
              </div>
            )}
          </div>

          {/* Price & Title section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{property.cityArea}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-slate-900">
                {property.title}
              </h1>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="text-3xl font-black text-emerald-700 font-['Outfit']">
                {formatPrice(property.price, property.purpose)}
              </div>
              {property.pricePerUnit && (
                <div className="text-sm font-semibold text-slate-500">
                  {property.pricePerUnit}
                </div>
              )}
            </div>
          </div>

          {/* Quick Punjab Specs Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
              <div className="text-xs text-slate-400 font-bold uppercase">Land / Plot Size</div>
              <div className="text-base font-black text-slate-800 mt-0.5">
                {property.size} {property.unit}
              </div>
              <div className="text-[11px] text-slate-500">
                {property.sqft ? `${property.sqft.toLocaleString()} Sq.Ft` : 'Approx. dimensions'}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
              <div className="text-xs text-slate-400 font-bold uppercase">Facing Direction</div>
              <div className="text-base font-bold text-slate-800 mt-0.5">
                {property.facing || 'East Facing'}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">Vastu Compliant</div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
              <div className="text-xs text-slate-400 font-bold uppercase">Legal Status</div>
              <div className="text-base font-bold text-slate-800 mt-0.5">
                Clear Title
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">Immediate Registry</div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
              <div className="text-xs text-slate-400 font-bold uppercase">Loan Eligibility</div>
              <div className="text-base font-bold text-slate-800 mt-0.5">
                Up to 80%
              </div>
              <div className="text-[11px] text-slate-500">Major Banks (SBI, HDFC)</div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2 font-['Outfit']">
              Property Description & Highlights
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {property.description}
            </p>
          </div>

          {/* Key Amenities */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 font-['Outfit']">
              Features & Amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {property.amenities?.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Consultant Inquiry Form + WhatsApp Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Left Info */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Direct Consultant Assistance</span>
                <h4 className="text-xl font-bold font-['Outfit'] text-white mt-1">
                  Interested in this property?
                </h4>
                <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
                  Book a free site visit or get registry details directly with {settings.consultantName}.
                </p>

                <div className="flex flex-col gap-2">
                  <a
                    href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-transform hover:scale-[1.02] cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 fill-white text-emerald-500" />
                    <span>WhatsApp Inquiry for {property.id}</span>
                  </a>

                  <a
                    href={`tel:${settings.primaryPhone}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Call Now: {settings.primaryPhone}</span>
                  </a>
                </div>
              </div>

              {/* Right Quick Callback Form */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                  Or Request a Free Call Back
                </h5>

                {inquirySubmitted ? (
                  <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-emerald-200">Inquiry Received!</p>
                    <p className="text-xs text-emerald-300 mt-1">We will contact you shortly regarding property {property.id}.</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone / WhatsApp Number *"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Request Call Back & Site Visit
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
