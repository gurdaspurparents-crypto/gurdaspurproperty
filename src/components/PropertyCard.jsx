import React, { useState } from 'react';
import { 
  MapPin, 
  MessageCircle, 
  Phone, 
  ShieldCheck, 
  ArrowUpRight,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Compass,
  FileCheck2,
  Play,
  Calculator,
  FileText
} from 'lucide-react';

export default function PropertyCard({ 
  property, 
  settings, 
  onSelectProperty 
}) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const formatPrice = (price, purpose) => {
    if (purpose === 'rent') {
      return `₹${price.toLocaleString('en-IN')}/mo`;
    }
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getBadgeStyle = (badge) => {
    switch (badge?.toLowerCase()) {
      case 'hot deal':
        return 'bg-rose-600 text-white';
      case 'luxury villa':
        return 'bg-purple-700 text-white';
      case 'high roi commercial':
        return 'bg-emerald-700 text-white';
      case 'ready to move':
        return 'bg-amber-600 text-white';
      case 'farmhouse land':
        return 'bg-teal-700 text-white';
      case 'vip rental':
        return 'bg-blue-700 text-white';
      default:
        return 'bg-slate-900 text-white';
    }
  };

  const images = property.images && property.images.length > 0 ? property.images : [
    "/images/properties/gurdaspur_real_kothi.jpg"
  ];

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const calculateEstimatedEmi = (price, purpose) => {
    if (purpose === 'rent' || !price) return null;
    const loanAmount = price * 0.8;
    const monthlyRate = 0.085 / 12;
    const tenureMonths = 240;
    const emi = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
    );
    if (emi >= 100000) {
      return `₹${(emi / 100000).toFixed(2)}L/mo`;
    }
    return `₹${emi.toLocaleString('en-IN')}/mo`;
  };

  const estimatedEmi = calculateEstimatedEmi(property.price, property.purpose);

  const whatsappMessage = encodeURIComponent(
    `Hello Gurdaspur Property! I am interested in:\n\n*${property.title}*\n• Property ID: ${property.id}\n• Location: ${property.location} (${property.cityArea})\n• Size: ${property.size} ${property.unit}\n• Price: ${property.pricePerUnit || formatPrice(property.price, property.purpose)}\n\nPlease share the exact Google Maps location, registry verification papers & site visit timing.`
  );

  const whatsappFardMessage = encodeURIComponent(
    `Hello Gurdaspur Property! I want the Jamabandi Fard & Video Walkthrough for:\n\n*${property.title}*\n• Property ID: ${property.id}\n• Location: ${property.location}\n• Price: ${property.pricePerUnit || formatPrice(property.price, property.purpose)}\n\nPlease share the Tehsil mutation papers & video.`
  );

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col group hover:-translate-y-1.5 relative">
      
      {/* Top Image Showcase */}
      <div 
        className="relative h-60 sm:h-64 overflow-hidden bg-slate-900 cursor-pointer select-none" 
        onClick={() => onSelectProperty(property)}
      >
        <img 
          src={images[activeImgIndex]} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/* Gradient Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-black/20 to-black/30"></div>

        {/* Badges on Top Left */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 items-center z-10">
          {property.badge && (
            <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-md ${getBadgeStyle(property.badge)}`}>
              {property.badge}
            </span>
          )}
          {property.verified && (
            <span className="text-[11px] font-bold bg-emerald-600/95 backdrop-blur-md text-white px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5" />
              Verified Title
            </span>
          )}
          {property.videoUrl && (
            <span className="text-[11px] font-bold bg-purple-700/95 backdrop-blur-md text-white px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
              <Play className="w-3 h-3 fill-white" />
              Video Tour
            </span>
          )}
        </div>

        {/* Property ID on Top Right */}
        <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border border-white/20 z-10">
          {property.id}
        </div>

        {/* Slideshow Next/Prev Mini Controls (Visible on hover) */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={handlePrevImage}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/90 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute top-12 right-3.5 flex gap-1 z-10">
            {images.map((_, i) => (
              <span 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all ${activeImgIndex === i ? 'bg-emerald-400 w-3' : 'bg-white/60'}`}
              ></span>
            ))}
          </div>
        )}

        {/* Bottom Price banner on Image */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between text-white z-10">
          <div>
            <div className="text-2xl sm:text-3xl font-black font-['Outfit'] tracking-tight drop-shadow-md">
              {formatPrice(property.price, property.purpose)}
            </div>
            {property.pricePerUnit && (
              <div className="text-xs text-emerald-300 font-bold drop-shadow-sm">
                {property.pricePerUnit}
              </div>
            )}
          </div>
          <span className="text-[11px] uppercase tracking-wider bg-white/25 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-extrabold border border-white/25">
            {property.purpose === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Locality & Category */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5 font-medium">
            <span className="flex items-center gap-1 text-emerald-800 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {property.location}
            </span>
            <span className="capitalize text-slate-600 font-bold text-[11px]">
              {property.category === 'kothi' ? 'Independent Villa' : property.category}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectProperty(property)}
            className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 cursor-pointer font-['Outfit'] mb-2"
            title={property.title}
          >
            {property.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {property.description}
          </p>

          {/* Specs Matrix */}
          <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-slate-50 rounded-2xl border border-slate-100 text-center mb-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Area</div>
              <div className="text-xs font-black text-slate-900 mt-0.5">
                {property.size} {property.unit}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Sq. Feet</div>
              <div className="text-xs font-bold text-slate-700 mt-0.5">
                {property.sqft ? `${property.sqft.toLocaleString()} ft²` : '—'}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Facing</div>
              <div className="text-xs font-bold text-slate-700 mt-0.5 truncate px-1">
                {property.facing || 'East'}
              </div>
            </div>
          </div>

          {/* Dimensions / Road Width Pill */}
          {(property.dimensions || property.roadWidth) && (
            <div className="flex items-center justify-between text-[11px] text-slate-600 bg-emerald-50/50 px-3 py-1.5 rounded-xl border border-emerald-100/60 mb-4">
              <span className="font-semibold">{property.dimensions || 'Standard Frontage'}</span>
              <span className="font-bold text-emerald-800">{property.roadWidth || '30 Ft Wide Road'}</span>
            </div>
          )}

          {/* Amenities chips */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {property.amenities?.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                ✓ {amenity}
              </span>
            ))}
            {property.amenities?.length > 3 && (
              <span className="text-[10px] text-slate-400 font-bold px-1 py-0.5">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>

          {/* Housing.com Signature: Estimated EMI Pill */}
          {estimatedEmi && (
            <div className="flex items-center justify-between bg-blue-50/80 border border-blue-200/70 rounded-xl px-3 py-1.5 mb-2.5 text-xs">
              <div className="flex items-center gap-1.5 text-blue-950 font-bold">
                <Calculator className="w-3.5 h-3.5 text-[#005ca8]" />
                <span className="text-slate-600 font-semibold">Est. EMI:</span>
                <span className="font-extrabold text-[#005ca8]">{estimatedEmi}</span>
              </div>
              <span className="text-[10px] text-blue-700 font-semibold bg-blue-100/60 px-2 py-0.5 rounded-md">
                8.5% • 20 Yrs
              </span>
            </div>
          )}

          {/* 1-Click WhatsApp Video & Fard Request Button */}
          <a
            href={`https://wa.me/${cleanPhone}?text=${whatsappFardMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mb-3 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200/80 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Request Jamabandi Fard & Video</span>
          </a>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
          
          {/* Details Modal button */}
          <button
            onClick={() => onSelectProperty(property)}
            className="flex-1 py-2.5 px-3 rounded-xl border-2 border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>View Full Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Direct WhatsApp CTA */}
          <a
            href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.03]"
            title="Inquire on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          {/* Quick Call */}
          <a
            href={`tel:${settings.primaryPhone}`}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Call Consultant Directly"
          >
            <Phone className="w-4 h-4 text-emerald-700" />
          </a>

        </div>

      </div>

    </div>
  );
}
