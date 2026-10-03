import React from 'react';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Compass, 
  MessageCircle, 
  Phone, 
  ShieldCheck, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function PropertyCard({ 
  property, 
  settings, 
  onSelectProperty 
}) {
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

  const getBadgeColor = (badge) => {
    switch (badge?.toLowerCase()) {
      case 'hot deal':
        return 'bg-red-500 text-white';
      case 'luxury':
        return 'bg-purple-600 text-white';
      case 'high roi':
        return 'bg-emerald-600 text-white';
      case 'price dropped':
        return 'bg-amber-600 text-white';
      case 'for rent':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-slate-900 text-white';
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello! I am inquiring about this property on GurdaspurProperty.in:\n\n*${property.title}*\n• ID: ${property.id}\n• Location: ${property.location} (${property.cityArea})\n• Size: ${property.size} ${property.unit}\n• Quoted Price: ${property.pricePerUnit || formatPrice(property.price, property.purpose)}\n\nPlease share the exact location, registry status, and site visit timing.`
  );

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
      
      {/* Top Image Banner */}
      <div className="relative h-56 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelectProperty(property)}>
        <img 
          src={property.images?.[0] || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20"></div>

        {/* Badge on Top Left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          {property.badge && (
            <span className={`text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-md ${getBadgeColor(property.badge)}`}>
              {property.badge}
            </span>
          )}
          {property.verified && (
            <span className="text-[11px] font-bold bg-emerald-500/90 backdrop-blur-xs text-white px-2 py-1 rounded-md shadow-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified
            </span>
          )}
        </div>

        {/* Property ID on Top Right */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-white/20">
          {property.id}
        </div>

        {/* Bottom Price on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <div className="text-2xl font-black font-['Outfit'] tracking-tight drop-shadow-md">
              {formatPrice(property.price, property.purpose)}
            </div>
            {property.pricePerUnit && (
              <div className="text-xs text-emerald-300 font-semibold drop-shadow-sm">
                {property.pricePerUnit}
              </div>
            )}
          </div>
          <span className="text-xs bg-white/20 backdrop-blur-md px-2 py-1 rounded text-white font-medium border border-white/20">
            {property.purpose === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Locality & Type line */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {property.location}
            </span>
            <span className="capitalize text-slate-600 font-semibold">
              {property.category === 'kothi' ? 'Independent Kothi' : property.category}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectProperty(property)}
            className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 cursor-pointer font-['Outfit'] mb-2.5"
            title={property.title}
          >
            {property.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {property.description}
          </p>

          {/* Specs Bar (Marla, SqFt, Bedrooms, Facing) */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 text-center mb-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Area</div>
              <div className="text-xs font-black text-slate-800">
                {property.size} {property.unit}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Sq. Feet</div>
              <div className="text-xs font-bold text-slate-700">
                {property.sqft ? `${property.sqft.toLocaleString()} ft²` : '—'}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Facing</div>
              <div className="text-xs font-bold text-slate-700">
                {property.facing || 'East'}
              </div>
            </div>
          </div>

          {/* Amenities chips */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {property.amenities?.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                ✓ {amenity}
              </span>
            ))}
            {property.amenities?.length > 3 && (
              <span className="text-[10px] text-slate-400 font-semibold px-1 py-0.5">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          {/* Details Modal button */}
          <button
            onClick={() => onSelectProperty(property)}
            className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>View Full Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Direct WhatsApp CTA */}
          <a
            href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/30 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.03]"
            title="Inquire on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          {/* Quick Call CTA */}
          <a
            href={`tel:${settings.primaryPhone}`}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Call Consultant"
          >
            <Phone className="w-4 h-4 text-emerald-700" />
          </a>
        </div>

      </div>

    </div>
  );
}
