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
import PropertyParametersSection from './PropertyParametersSection';
import PropertyDocumentsSection from './PropertyDocumentsSection';
import PropertyMediaSection from './PropertyMediaSection';

export default function PostPropertyModal({ isOpen, onClose, settings }) {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoFile, setVideoFile] = useState(null); // { name, size, dataUrl }
  const [propertyParams, setPropertyParams] = useState({
    title: '',
    size: '10',
    unit: 'Marla',
    frontWidth: '30 Ft',
    depth: '75 Ft',
    coveredArea: '2250',
    openArea: '400',
    facing: 'East',
    roadWidth: '30 Feet Wide Road',
    isCorner: false,
    bedrooms: '3',
    bathrooms: '3',
    kitchen: 'Modular Kitchen',
    drawingRoom: 'Separate Drawing Room',
    diningRoom: 'Attached Dining Area',
    floors: 'Double Story (G+1)',
    floorNumber: 'Full Independent House',
    parking: 'Covered Car Porch + 2-Wheeler',
    furnishingStatus: 'Semi-Furnished',
    balcony: 'Front Balcony',
    terrace: 'Private Independent Terrace',
    lift: 'Not Available',
    propertyCondition: 'Brand New / Ready to Move',
    waterSupply: '24x7 Submersible / Borewell',
    electricity: 'Domestic 24x7 Connection',
    sewerage: 'Underground Municipal Sewerage',
    boundaryWall: 'Four-Wall Constructed',
    gatedSociety: false,
    nearbyFacilities: ['School (within 1km)', 'Main Bus Stand']
  });

  const [documents, setDocuments] = useState({
    registry: 'Available',
    ownershipProof: 'Available',
    approvedMap: 'Not Checked',
    noc: 'Not Checked',
    propertyTax: 'Not Checked',
    electricityConnection: 'Available',
    bankLoan: 'Available',
    legalDispute: 'Available'
  });
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
    const effectiveSize = propertyParams.size || formData.size;
    if (!effectiveSize || !formData.expectedPrice) {
      alert("Please enter the property size and expected price.");
      return;
    }

    setIsSubmitting(true);

    const finalDimensions = propertyParams.frontWidth && propertyParams.depth 
      ? `${propertyParams.frontWidth} Front × ${propertyParams.depth} Depth` 
      : formData.dimensions;

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
      title: propertyParams.title?.trim() || `${effectiveSize} ${propertyParams.unit || formData.unit} ${formData.category} in ${formData.locality}`,
      size: `${effectiveSize} ${propertyParams.unit || formData.unit}`,
      unit: propertyParams.unit || formData.unit,
      frontWidth: propertyParams.frontWidth || '',
      depth: propertyParams.depth || '',
      dimensions: finalDimensions,
      coveredArea: propertyParams.coveredArea || '',
      openArea: propertyParams.openArea || '',
      bedrooms: propertyParams.bedrooms || '',
      bathrooms: propertyParams.bathrooms || '',
      kitchen: propertyParams.kitchen || '',
      drawingRoom: propertyParams.drawingRoom || '',
      diningRoom: propertyParams.diningRoom || '',
      floors: propertyParams.floors || '',
      floorNumber: propertyParams.floorNumber || '',
      parking: propertyParams.parking || '',
      furnishingStatus: propertyParams.furnishingStatus || '',
      balcony: propertyParams.balcony || '',
      terrace: propertyParams.terrace || '',
      lift: propertyParams.lift || '',
      propertyCondition: propertyParams.propertyCondition || '',
      waterSupply: propertyParams.waterSupply || '',
      electricity: propertyParams.electricity || '',
      sewerage: propertyParams.sewerage || '',
      boundaryWall: propertyParams.boundaryWall || '',
      gatedSociety: !!propertyParams.gatedSociety,
      isCorner: !!propertyParams.isCorner,
      nearbyFacilities: propertyParams.nearbyFacilities || [],
      documents: documents,
      roadWidth: propertyParams.roadWidth || formData.roadWidth,
      facing: propertyParams.facing || formData.facing,
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

              {/* SECTION 2: Pricing & Commercial Terms */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-[#005ca8]" />
                    <span>Price Demand & Terms</span>
                  </h3>
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

                {/* Remarks */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Property Description & Remarks (Optional)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Corner property, 2 sides open, borewell connection, modular kitchen, immediate possession..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                  ></textarea>
                </div>
              </div>

              {/* SECTION 3: Detailed Property Parameters (Smart Category Filtered) */}
              <div className="space-y-4">
                <PropertyParametersSection
                  formData={propertyParams}
                  onChange={setPropertyParams}
                  category={formData.category}
                />
              </div>

              {/* SECTION 4: Property Document Status Checklist */}
              <div className="space-y-4">
                <PropertyDocumentsSection
                  documents={documents}
                  onChange={setDocuments}
                />
              </div>

              {/* SECTION 5: Categorized Photos & Walkthrough Video */}
              <div className="space-y-4">
                <PropertyMediaSection
                  images={uploadedImages}
                  onImagesChange={setUploadedImages}
                  videoFile={videoFile}
                  onVideoFileChange={setVideoFile}
                  videoUrl={formData.videoUrl}
                  onVideoUrlChange={(val) => setFormData({ ...formData, videoUrl: val })}
                  category={formData.category}
                  maxImages={15}
                />
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
