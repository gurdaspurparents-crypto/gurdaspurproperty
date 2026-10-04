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
  User, 
  Phone, 
  FileCheck2, 
  Compass, 
  ArrowRight, 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Film, 
  ExternalLink, 
  FileVideo, 
  Loader2,
  Mail 
} from 'lucide-react';
import { addLead } from '../utils/storage';
import { GURDASPUR_LOCALITIES } from '../data/initialProperties';
import { sendPropertyPostNotification } from '../utils/notificationService';

export default function PostPropertyModal({ isOpen, onClose, settings }) {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoFile, setVideoFile] = useState(null); // { name, size, dataUrl }
  const [formData, setFormData] = useState({
    // Basic Property Details
    purpose: 'sell', // 'sell' | 'rent'
    category: 'plot', // 'plot' | 'kothi' | 'commercial' | 'land'
    locality: 'Tibri Road',
    subArea: '', // Landmark / Colony name
    
    // Specifications
    size: '',
    unit: 'Marla',
    dimensions: '', // Front x Depth
    roadWidth: '30 Feet Road',
    facing: 'East',
    registryStatus: '100% Clear Registry & Mutation',
    expectedPrice: '',
    isNegotiable: true,
    description: '',
    videoUrl: '', // YouTube / Google Drive / Reel link

    // Owner Contact Details
    exactLocation: '', // House #, Street #, Khasra #
    sellerName: '',
    phone: '',
    ownerRole: 'Property Owner' // 'Property Owner' | 'Family Member' | 'NRI Representative' | 'Power of Attorney (POA) Holder'
  });

  const [submitted, setSubmitted] = useState(false);
  const [lastSubmittedLead, setLastSubmittedLead] = useState(null);

  if (!isOpen) return null;

  const cleanAdminPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const MAX_PHOTOS = 15;

  // Client-side image compression to support 15 photos safely in storage
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
          resolve(dataUrl);
        };
        img.onerror = () => resolve(event.target.result);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const remainingSlots = MAX_PHOTOS - uploadedImages.length;
    if (remainingSlots <= 0) {
      alert("You can add a maximum of 15 photos.");
      return;
    }

    setIsCompressing(true);
    const selectedFiles = files.slice(0, remainingSlots);
    const compressedList = await Promise.all(selectedFiles.map(compressImage));
    const validImages = compressedList.filter(Boolean);

    setUploadedImages(prev => [...prev, ...validImages]);
    setIsCompressing(false);
  };

  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 25MB for browser storage
    if (file.size > 25 * 1024 * 1024) {
      alert("Video file size exceeds 25MB. For larger videos, please enter a YouTube/Drive link or send directly to the consultant via WhatsApp.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        dataUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sellerName || !formData.phone) {
      alert("Please enter your full name and phone number.");
      return;
    }
    if (!formData.size || !formData.expectedPrice) {
      alert("Please enter the property size and expected price.");
      return;
    }

    setIsSubmitting(true);

    const leadPayload = {
      name: formData.sellerName,
      phone: formData.phone,
      type: 'seller_listing',
      ownerRole: formData.ownerRole,
      purpose: formData.purpose,
      category: formData.category,
      locality: formData.locality,
      subArea: formData.subArea,
      exactLocation: formData.exactLocation || 'Shared on Call/WhatsApp',
      size: `${formData.size} ${formData.unit}`,
      dimensions: formData.dimensions,
      roadWidth: formData.roadWidth,
      facing: formData.facing,
      registryStatus: formData.registryStatus,
      price: formData.expectedPrice,
      isNegotiable: formData.isNegotiable,
      notes: formData.description,
      images: uploadedImages,
      videoUrl: formData.videoUrl,
      videoFile: videoFile ? { name: videoFile.name, size: videoFile.size, dataUrl: videoFile.dataUrl } : null,
      isConfidential: true
    };

    // Save lead into Admin local database
    const saved = addLead(leadPayload);

    // Dispatch email alert to navkiransharma@gmail.com
    await sendPropertyPostNotification(
      leadPayload, 
      settings?.email || 'navkiransharma@gmail.com'
    );

    setIsSubmitting(false);
    setLastSubmittedLead(saved);
    setSubmitted(true);
  };

  const handleSendToWhatsApp = () => {
    const videoDetails = formData.videoUrl 
      ? `• Video Walkthrough: ${formData.videoUrl}` 
      : (videoFile ? `• Video Walkthrough: ${videoFile.name} attached` : '• Video Walkthrough: Will share on WhatsApp');

    const text = encodeURIComponent(
      `📋 *NEW PROPERTY LISTING - GURDASPUR*\n\n` +
      `👤 *Owner Details:*\n` +
      `• Name: ${formData.sellerName}\n` +
      `• Mobile: ${formData.phone}\n` +
      `• Role: ${formData.ownerRole}\n\n` +
      `📍 *Location:*\n` +
      `• Address / Khasra: ${formData.exactLocation || 'Shared on Call'}\n` +
      `• Locality: ${formData.locality} (${formData.subArea || 'Gurdaspur'})\n\n` +
      `📐 *Property Specs:*\n` +
      `• Listing: ${formData.purpose === 'sell' ? 'For Sale' : 'For Rent'}\n` +
      `• Category: ${formData.category.toUpperCase()}\n` +
      `• Size: ${formData.size} ${formData.unit} ${formData.dimensions ? `(${formData.dimensions})` : ''}\n` +
      `• Road Width: ${formData.roadWidth}\n` +
      `• Facing: ${formData.facing}\n` +
      `• Registry: ${formData.registryStatus}\n` +
      `• Demand: ₹${formData.expectedPrice} ${formData.isNegotiable ? '(Negotiable)' : '(Fixed)'}\n` +
      `• Photos Attached: ${uploadedImages.length} Photos\n` +
      `${videoDetails}\n` +
      `• Notes: ${formData.description || 'N/A'}`
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
        
        {/* Header */}
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
                <span className="text-[10px] font-bold text-slate-300">
                  Verified Real Estate Portal
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

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Listing Received
              </span>

              <h3 className="text-2xl font-black text-slate-900 font-['Outfit'] mt-3">
                Property Successfully Submitted!
              </h3>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 my-4 max-w-md mx-auto text-xs text-emerald-950 text-left flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-emerald-900">
                    Instant Email Alert Sent to Admin
                  </div>
                  <div className="text-[11px] text-emerald-800 mt-0.5">
                    Your complete listing specifications have been forwarded to <strong>navkiransharma@gmail.com</strong> and saved in the priority verification queue.
                  </div>
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2 mb-6 leading-relaxed">
                Thank you, <strong>{formData.sellerName}</strong>! Our advisory desk will review your property and connect with you shortly.
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
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* SECTION 1: Basic Property Details */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#005ca8]" />
                    <span>Property Details</span>
                  </h3>
                </div>

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
                      🏡 Sell Property
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
                      🔑 Rent Out
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
                      { id: 'kothi', label: 'Villa / Kothi', icon: '🏰' },
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

                {/* Locality & Landmark */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      Locality / Area *
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
                      Colony / Landmark Name
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
              </div>

              {/* SECTION 2: Specifications & Pricing */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-[#005ca8]" />
                    <span>Specifications & Pricing</span>
                  </h3>
                </div>

                {/* Size & Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Property Size *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        required
                        placeholder="e.g. 10 or 1500"
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none"
                      >
                        <option value="Marla">Marla</option>
                        <option value="Kanal">Kanal</option>
                        <option value="Sq.Yd">Sq. Yards (Gaj)</option>
                        <option value="Sq.Ft">Sq. Feet</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Dimensions (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 30 x 75 ft"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Expected Total Demand / Price (₹) *</span>
                    <span className="text-slate-400 font-normal text-[11px]">e.g. 4500000 for 45 Lakh</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 3500000"
                      value={formData.expectedPrice}
                      onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2.5 text-xs font-black text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="isNegotiable"
                      checked={formData.isNegotiable}
                      onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="isNegotiable" className="text-xs text-slate-600 font-semibold cursor-pointer">
                      Price is negotiable for serious buyers
                    </label>
                  </div>
                </div>

                {/* Road Width, Facing & Registry Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-blue-600" />
                      Facing Direction
                    </label>
                    <select
                      value={formData.facing}
                      onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      <option value="East">East (Sunlight)</option>
                      <option value="North">North (Vastu)</option>
                      <option value="North-East">North-East</option>
                      <option value="West">West</option>
                      <option value="South">South</option>
                      <option value="North-West">North-West</option>
                      <option value="South-East">South-East</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                      Registry Status
                    </label>
                    <select
                      value={formData.registryStatus}
                      onChange={(e) => setFormData({ ...formData, registryStatus: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      <option value="100% Clean Registry & Mutation">Clear Registry & Mutation</option>
                      <option value="Colony Demarcation (Plot Pillars Done)">Colony Demarcation & Pillars</option>
                      <option value="Direct Registry from Landlord">Direct Landlord Registry</option>
                      <option value="Power of Attorney (POA)">Power of Attorney (POA)</option>
                    </select>
                  </div>
                </div>

                {/* Additional Remarks */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Property Description & Remarks (Optional)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Corner plot, 2 sides open, borewell connection, modular kitchen, immediate possession..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                  ></textarea>
                </div>
              </div>

              {/* SECTION 3: Photos & Video Walkthrough */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#005ca8]" />
                    <span>Property Photos & Video</span>
                  </h3>
                </div>

                {/* Photo Upload Area */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#005ca8]" />
                      <span>Upload Property Photos</span>
                    </label>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {uploadedImages.length} / {MAX_PHOTOS} Photos Added
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Add clear photos of the front elevation, road view, interiors, or boundary pillars. Listings with photos receive up to 5x higher buyer interest.
                  </p>

                  <div className="flex items-center gap-3">
                    <label className={`flex-1 flex items-center justify-center gap-2 border-2 border-dashed rounded-xl p-3 transition-all cursor-pointer ${
                      uploadedImages.length >= MAX_PHOTOS 
                        ? 'border-slate-200 bg-slate-100 cursor-not-allowed opacity-60' 
                        : 'border-blue-300 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50'
                    }`}>
                      {isCompressing ? (
                        <>
                          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                          <span className="text-xs font-bold text-blue-700">Processing Photos...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-bold text-blue-700">
                            {uploadedImages.length >= MAX_PHOTOS ? "15 Photo Limit Reached" : "Select Photos From Device"}
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        disabled={uploadedImages.length >= MAX_PHOTOS || isCompressing}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Thumbnail Gallery Preview Grid */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 pt-2">
                      {uploadedImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-300 shadow-2xs group">
                          <img 
                            src={img} 
                            alt={`Upload ${idx + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-110 transition-all text-xs shadow-sm cursor-pointer"
                            title="Remove Photo"
                          >
                            ×
                          </button>
                          <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Photos in your gallery? You can also forward them directly to our consultant on WhatsApp after submission.</span>
                  </div>
                </div>

                {/* Video Walkthrough Module */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-rose-600" />
                      <span>Property Video Walkthrough</span>
                    </label>
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full">
                      High Buyer Response
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Add a walkthrough video clip or link. Properties with video receive 3x faster buyer inquiries.
                  </p>

                  {/* Option 1: Walkthrough Video Link */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3 text-[#005ca8]" />
                      <span>Walkthrough Video Link (YouTube / Google Drive / Reels):</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtu.be/... or Google Drive video link"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Option 2: Upload Video File or Send on WhatsApp */}
                  <div className="pt-2 border-t border-slate-200/70">
                    <div className="text-[11px] font-bold text-slate-700 mb-2 flex items-center gap-1">
                      <FileVideo className="w-3 h-3 text-purple-600" />
                      <span>Or Attach Video File Directly:</span>
                    </div>

                    {videoFile ? (
                      <div className="bg-white p-3 rounded-xl border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-2.5 overflow-hidden w-full">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                            <Film className="w-5 h-5" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-slate-900 truncate">{videoFile.name}</div>
                            <div className="text-[10px] text-slate-500 font-medium">{videoFile.size} • Video clip attached successfully</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveVideo}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors shrink-0 cursor-pointer"
                        >
                          Remove Video
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <label className="flex items-center justify-center gap-2 border border-slate-300 hover:border-purple-500 rounded-xl p-3 bg-white hover:bg-purple-50/30 transition-all cursor-pointer">
                          <Upload className="w-4 h-4 text-purple-600 shrink-0" />
                          <span className="text-xs font-bold text-slate-700">Upload Video (Max 25MB)</span>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="hidden"
                          />
                        </label>

                        <a
                          href={`https://wa.me/${cleanAdminPhone}?text=${encodeURIComponent(`Hello! I want to share my property video walkthrough directly on WhatsApp for listing on GurdaspurProperty.in.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 border border-emerald-200 hover:border-emerald-500 rounded-xl p-3 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 text-xs font-bold transition-all text-center"
                        >
                          <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Send Video on WhatsApp</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 4: Contact Information */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#005ca8]" />
                    <span>Contact Information</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      Your Full Name *
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
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Exact Address / House No. / Khasra No.
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. House #42, Street #3, Opp Water Tank"
                      value={formData.exactLocation}
                      onChange={(e) => setFormData({ ...formData, exactLocation: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
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
                      <option value="Property Owner">Property Owner</option>
                      <option value="Family Member">Family Member</option>
                      <option value="Power of Attorney Holder">Power of Attorney (POA) Holder</option>
                      <option value="NRI Representative">NRI Family Representative</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting & Sending Email Alert...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Post Property Listing (FREE)</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
