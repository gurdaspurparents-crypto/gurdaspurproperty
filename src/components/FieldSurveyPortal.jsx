import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Phone, 
  User, 
  Home, 
  Building2, 
  IndianRupee, 
  Loader2, 
  ShieldCheck, 
  ExternalLink, 
  LogOut, 
  PlusCircle, 
  Trash2, 
  Sparkles,
  Zap,
  Car,
  Droplets,
  Users,
  Video,
  Play,
  Film,
  Compass,
  FileVideo,
  Layers,
  AlertCircle
} from 'lucide-react';
import { GURDASPUR_LOCALITIES } from '../data/initialProperties';
import { addLead } from '../utils/storage';
import { sendFieldSurveyNotification } from '../utils/notificationService';

export default function FieldSurveyPortal({ settings, onSurveySubmitted, onLogout }) {
  // Executive Identity
  const [surveyorName, setSurveyorName] = useState(
    localStorage.getItem('gp_surveyor_name') || 'Field Executive 1'
  );
  const [surveyorPhone, setSurveyorPhone] = useState(
    localStorage.getItem('gp_surveyor_phone') || ''
  );

  // GPS Geotag
  const [gpsLocation, setGpsLocation] = useState(null);
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Property Details
  const [purpose, setPurpose] = useState('rent'); // 'rent' | 'sell'
  const [category, setCategory] = useState('room'); // 'room' | 'kothi' | 'plot' | 'commercial' | 'land'
  const [locality, setLocality] = useState('Tibri Road');
  const [subArea, setSubArea] = useState(''); // Landmark / Street / Colony
  const [exactLocation, setExactLocation] = useState(''); // House No. / Shop No. (Confidential)
  
  // Landlord Contact
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [ownerRole, setOwnerRole] = useState('Direct Landlord / Owner');

  // Specifications
  const [size, setSize] = useState('1 Room Set');
  const [dimensions, setDimensions] = useState('');
  const [roadWidth, setRoadWidth] = useState('30 Feet Road');
  const [facing, setFacing] = useState('East');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);

  // Rental Specifics
  const [securityDeposit, setSecurityDeposit] = useState('1 Month Advance');
  const [electricityMeter, setElectricityMeter] = useState('Separate Sub-Meter');
  const [waterSupply, setWaterSupply] = useState('24x7 Submersible');
  const [parking, setParking] = useState('2-Wheeler Inside');
  const [tenantPreference, setTenantPreference] = useState('Family or Working Professional');
  const [kitchenWashroom, setKitchenWashroom] = useState('Attached Washroom & Kitchen');
  const [availableFrom, setAvailableFrom] = useState('Immediately Available');
  const [notes, setNotes] = useState('');

  // Photos (up to 12)
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Video Walkthrough (File & Link)
  const [videoFile, setVideoFile] = useState(null); // { name, size, dataUrl }
  const [videoUrl, setVideoUrl] = useState(''); // YouTube / Drive / Reel link
  const [isVideoUploading, setIsVideoUploading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSurveyId, setLastSurveyId] = useState('');

  useEffect(() => {
    localStorage.setItem('gp_surveyor_name', surveyorName);
    if (surveyorPhone) localStorage.setItem('gp_surveyor_phone', surveyorPhone);
  }, [surveyorName, surveyorPhone]);

  // Capture Live GPS Coordinates
  const handleCaptureGPS = () => {
    if (!navigator.geolocation) {
      alert("GPS Geolocation is not supported by this device or browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const acc = Math.round(pos.coords.accuracy);
        const url = `https://www.google.com/maps?q=${lat},${lng}`;

        setGpsLocation({ latitude: lat, longitude: lng, accuracy: acc });
        setGoogleMapsUrl(url);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        console.warn("GPS error:", err);
        alert("Unable to acquire GPS location. Please ensure location/GPS access is enabled in your phone's browser settings.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Image Upload & Compression
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    const newImages = [];

    for (const file of files) {
      if (uploadedImages.length + newImages.length >= 12) break;
      const reader = new FileReader();
      const readPromise = new Promise((resolve) => {
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 1100;
            let width = img.width;
            let height = img.height;

            if (width > height && width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.75));
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });

      const compressed = await readPromise;
      newImages.push(compressed);
    }

    setUploadedImages((prev) => [...prev, ...newImages]);
    setIsUploading(false);
    e.target.value = '';
  };

  const handleRemovePhoto = (idx) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Video Upload Handler
  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert("Video file size exceeds 25MB. Please record a shorter walkthrough clip (30-60 seconds) or provide a Google Drive / YouTube link below.");
      return;
    }

    setIsVideoUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        dataUrl: reader.result
      });
      setIsVideoUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
  };

  // Submit Survey
  const handleSubmitSurvey = async (e) => {
    e.preventDefault();

    if (!ownerName.trim()) {
      alert("Please enter the Landlord / Owner Name.");
      return;
    }
    if (!ownerPhone.trim() || ownerPhone.replace(/[^0-9]/g, '').length < 10) {
      alert("Please enter a valid 10-digit mobile number for the landlord.");
      return;
    }
    if (!expectedPrice) {
      alert("Please enter the expected Rent or Sale Price.");
      return;
    }

    setIsSubmitting(true);

    const surveyData = {
      name: ownerName.trim(),
      phone: ownerPhone.trim(),
      alternatePhone: alternatePhone.trim(),
      ownerRole,
      type: 'field_survey',
      isSurvey: true,
      surveyStatus: 'pending_approval',
      surveyorName: surveyorName.trim(),
      surveyorPhone: surveyorPhone.trim(),
      purpose, // 'rent' or 'sell'
      category,
      locality,
      subArea: subArea.trim(),
      exactLocation: exactLocation.trim() || subArea.trim() || locality,
      size,
      dimensions: dimensions.trim(),
      roadWidth,
      facing,
      price: expectedPrice,
      isNegotiable,
      securityDeposit: purpose === 'rent' ? securityDeposit : null,
      electricityMeter: purpose === 'rent' ? electricityMeter : null,
      waterSupply: purpose === 'rent' ? waterSupply : null,
      parking,
      tenantPreference: purpose === 'rent' ? tenantPreference : null,
      kitchenWashroom: purpose === 'rent' ? kitchenWashroom : null,
      availableFrom,
      notes: notes.trim(),
      images: uploadedImages,
      videoFile,
      videoUrl: videoUrl.trim(),
      gpsCoordinates: gpsLocation,
      googleMapsUrl,
      createdAt: new Date().toISOString()
    };

    // Save into storage leads & sync to cloud
    const saved = await addLead(surveyData);
    setLastSurveyId(saved?.id || 'SURVEY-' + Date.now().toString().slice(-4));

    // Send instant email notification to owner (navkiransharma@gmail.com)
    await sendFieldSurveyNotification(surveyData, settings?.email || 'navkiransharma@gmail.com');

    if (onSurveySubmitted) onSurveySubmitted(saved);

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleResetForNext = () => {
    setSubmitted(false);
    setOwnerName('');
    setOwnerPhone('');
    setAlternatePhone('');
    setSubArea('');
    setExactLocation('');
    setExpectedPrice('');
    setDimensions('');
    setNotes('');
    setUploadedImages([]);
    setVideoFile(null);
    setVideoUrl('');
    setGpsLocation(null);
    setGoogleMapsUrl('');
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans max-w-xl mx-auto pb-4">
      
      {/* Surveyor Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Marketing Field Executive
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black font-['Outfit'] mt-1 text-white">
            Door-to-Door Property Intake
          </h2>
          <p className="text-xs text-slate-300">
            Log on-site rooms, kothis & plots with live GPS proof & video
          </p>
        </div>

        <button
          onClick={onLogout}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit</span>
        </button>
      </div>

      {submitted ? (
        /* Success Confirmation Screen */
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-4 animate-in fade-in duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              Survey Reference: {lastSurveyId}
            </span>
            <h3 className="text-xl font-black text-slate-900 font-['Outfit'] mt-2">
              Survey Successfully Recorded!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
              Great work, <strong>{surveyorName}</strong>! The property details for <strong>{ownerName}</strong> in <strong>{locality}</strong> have been logged with GPS proof and photos.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 text-left space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Queue Status:</span>
              <span className="font-bold text-amber-700 bg-amber-100/70 border border-amber-300 px-2 py-0.5 rounded-md">
                Pending Owner Review & Publish
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Email Alert:</span>
              <span className="font-semibold text-emerald-700">Dispatched to navkiransharma@gmail.com</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Media Attached:</span>
              <span className="font-semibold text-slate-800">
                {uploadedImages.length} Photos {videoFile ? '+ Walkthrough Video' : videoUrl ? '+ Video Link' : ''}
              </span>
            </div>
            {googleMapsUrl && (
              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span className="text-slate-500">GPS On-Site Proof:</span>
                <a 
                  href={googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-emerald-700 font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Verify Google Maps Pin</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          <button
            onClick={handleResetForNext}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Survey Next House / Room</span>
          </button>
        </div>
      ) : (
        /* Active Field Survey Form */
        <form onSubmit={handleSubmitSurvey} className="space-y-4">
          
          {/* Section 1: Executive Identity & GPS Physical Proof */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                Step 1: Executive ID & On-Site GPS Proof
              </span>
              <span className="text-[10px] text-slate-400">1 of 5</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Marketing Executive Name *
                </label>
                <input
                  type="text"
                  required
                  value={surveyorName}
                  onChange={(e) => setSurveyorName(e.target.value)}
                  placeholder="e.g. Raman Kumar"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Executive Mobile Number
                </label>
                <input
                  type="tel"
                  value={surveyorPhone}
                  onChange={(e) => setSurveyorPhone(e.target.value)}
                  placeholder="e.g. 98140XXXXX"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            {/* 1-Click Live GPS Satellite Tagging */}
            <div className="pt-1">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Proof of Physical Visit (GPS Geotag)</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Proves you visited on-site</span>
              </label>

              <button
                type="button"
                onClick={handleCaptureGPS}
                disabled={isLocating}
                className={`w-full py-3 px-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  gpsLocation
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-900 text-white shadow-md'
                }`}
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Acquiring GPS Satellite Coordinates...</span>
                  </>
                ) : gpsLocation ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>📍 GPS Tagged: {gpsLocation.latitude}, {gpsLocation.longitude} (±{gpsLocation.accuracy}m)</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>📍 Capture Exact GPS Location (Proof of Visit)</span>
                  </>
                )}
              </button>

              {gpsLocation && (
                <div className="mt-2 text-[11px] bg-emerald-50/80 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl flex items-center justify-between">
                  <span>Coordinates saved. Owner can open this exact location pin on Google Maps.</span>
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline flex items-center gap-1 shrink-0 ml-2">
                    Test Pin <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Property Purpose, Category & Pricing */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-blue-600" />
                Step 2: Listing Purpose, Category & Price
              </span>
              <span className="text-[10px] text-slate-400">2 of 5</span>
            </div>

            {/* Purpose: Rent vs Sell */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                Property Deal Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setPurpose('rent'); setCategory('room'); setSize('1 Room Set'); }}
                  className={`py-2.5 rounded-xl font-black text-xs border transition-all cursor-pointer ${
                    purpose === 'rent'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🔑 FOR RENT (Rooms / Kothi)
                </button>

                <button
                  type="button"
                  onClick={() => { setPurpose('sell'); setCategory('kothi'); setSize('10 Marla'); }}
                  className={`py-2.5 rounded-xl font-black text-xs border transition-all cursor-pointer ${
                    purpose === 'sell'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🏡 FOR SALE
                </button>
              </div>
            </div>

            {/* Category Selectable Chips */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                Property Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'room', label: 'Room Set / Floor' },
                  { id: 'kothi', label: 'Kothi / House' },
                  { id: 'plot', label: 'Plot / Land' },
                  { id: 'commercial', label: 'Shop / Commercial SCO' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer truncate ${
                      category === item.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size & Demand */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Size / Configuration *
                </label>
                <input
                  type="text"
                  required
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="e.g. 1 Room Set, 2 BHK, 10 Marla"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expected {purpose === 'rent' ? 'Monthly Rent (₹)' : 'Total Price (₹)'} *
                </label>
                <input
                  type="number"
                  required
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(e.target.value)}
                  placeholder={purpose === 'rent' ? 'e.g. 5500' : 'e.g. 3500000'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-black text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Front Road Width
                </label>
                <select
                  value={roadWidth}
                  onChange={(e) => setRoadWidth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                >
                  <option value="20 Feet Road">20 Feet Road</option>
                  <option value="30 Feet Wide Road">30 Feet Wide Road</option>
                  <option value="40 Feet Wide Road">40 Feet Wide Road</option>
                  <option value="Main GT / Highway Road">Main Highway / GT Road</option>
                  <option value="15 Feet Street">15 Feet Street</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Facing Direction
                </label>
                <select
                  value={facing}
                  onChange={(e) => setFacing(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                >
                  <option value="East">East (Sunrise)</option>
                  <option value="North">North</option>
                  <option value="North-East">North-East</option>
                  <option value="South">South</option>
                  <option value="West">West</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isNegotiableSurvey"
                checked={isNegotiable}
                onChange={(e) => setIsNegotiable(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label htmlFor="isNegotiableSurvey" className="text-xs text-slate-700 font-semibold cursor-pointer">
                Landlord is open to minor negotiation with serious parties
              </label>
            </div>

            {/* Rental Extras if Rent */}
            {purpose === 'rent' && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                <span className="font-bold text-slate-800 uppercase text-[10px] block tracking-wider">
                  Rental Specific Checklist
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Security Deposit
                    </label>
                    <input
                      type="text"
                      value={securityDeposit}
                      onChange={(e) => setSecurityDeposit(e.target.value)}
                      placeholder="e.g. 1 Month Advance / ₹10,000"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      Electricity Meter
                    </label>
                    <select
                      value={electricityMeter}
                      onChange={(e) => setElectricityMeter(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800"
                    >
                      <option value="Separate Sub-Meter">Separate Sub-Meter (Pay per unit)</option>
                      <option value="Shared Meter with Owner">Shared with Owner (50-50)</option>
                      <option value="Electricity Included in Rent">Included in Rent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                      <Users className="w-3 h-3 text-blue-500" />
                      Tenant Preference
                    </label>
                    <select
                      value={tenantPreference}
                      onChange={(e) => setTenantPreference(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800"
                    >
                      <option value="Family Only">Family Only</option>
                      <option value="Working Professionals / Bank Employees">Working Professionals Only</option>
                      <option value="Students / Bachelors Allowed">Bachelors / Students Allowed</option>
                      <option value="Females / Working Girls Only">Females / Girls Only</option>
                      <option value="Anyone Decent">Anyone Decent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                      <Car className="w-3 h-3 text-emerald-600" />
                      Parking Facility
                    </label>
                    <select
                      value={parking}
                      onChange={(e) => setParking(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800"
                    >
                      <option value="Car & 2-Wheeler Inside">Car & 2-Wheeler Inside Gate</option>
                      <option value="2-Wheeler Inside Gate">2-Wheeler Inside Only</option>
                      <option value="Street / Open Parking">Open Street Parking</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Kitchen & Washroom
                    </label>
                    <select
                      value={kitchenWashroom}
                      onChange={(e) => setKitchenWashroom(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800"
                    >
                      <option value="Attached Washroom & Kitchen">Attached Private Washroom & Kitchen</option>
                      <option value="Shared Washroom">Shared Washroom</option>
                      <option value="Room Only (No Kitchen)">Room Only (No Kitchen)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Available From
                    </label>
                    <input
                      type="text"
                      value={availableFrom}
                      onChange={(e) => setAvailableFrom(e.target.value)}
                      placeholder="e.g. Immediately or 1st of month"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Section 3: Landlord / Owner Contact & Exact Address */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                Step 3: Landlord Contact & Location
              </span>
              <span className="text-[10px] text-slate-400">3 of 5</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Landlord / Owner Name *
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Sardar Balwinder Singh"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Owner Primary Mobile *
                </label>
                <input
                  type="tel"
                  required
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="e.g. 98140XXXXX (10 Digits)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp / Alternate Number
                </label>
                <input
                  type="tel"
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  placeholder="e.g. 98765XXXXX"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Person Role
                </label>
                <select
                  value={ownerRole}
                  onChange={(e) => setOwnerRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
                >
                  <option value="Direct Landlord / Owner">Direct Landlord / Owner</option>
                  <option value="Family Member (Son/Wife)">Family Member</option>
                  <option value="Caretaker / Tenant vacating">Caretaker / Vacating Tenant</option>
                  <option value="Local Property Dealer">Local Property Dealer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gurdaspur Locality / Area *
                </label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                >
                  {GURDASPUR_LOCALITIES.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street / Colony / Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={subArea}
                  onChange={(e) => setSubArea(e.target.value)}
                  placeholder="e.g. Street 4, Near Tibri Gurudwara"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Exact House / Shop No. (Confidential)</span>
                <span className="text-[10px] text-slate-400">Kept private for office records</span>
              </label>
              <input
                type="text"
                value={exactLocation}
                onChange={(e) => setExactLocation(e.target.value)}
                placeholder="e.g. House #142-B, First Floor"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Section 4: MEDIA CAPTURE — BOTH PHOTOS & WALKTHROUGH VIDEO */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-rose-500" />
                Step 4: Media Capture (Photos & Video)
              </span>
              <span className="text-[10px] text-slate-400">4 of 5</span>
            </div>

            {/* Part A: Photos */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  <span>Property Photos (Camera / Gallery)</span>
                </label>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {uploadedImages.length} / 12 Photos
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">
                Snap photos of the front gate, room interior, bathroom, and street.
              </p>

              <div className="flex flex-wrap gap-2.5 items-center">
                <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 flex flex-col items-center justify-center text-blue-700 cursor-pointer transition-colors shrink-0">
                  <Camera className="w-6 h-6 mb-1 text-blue-600" />
                  <span className="text-[10px] font-bold">+ Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {uploadedImages.map((imgUrl, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-xs shrink-0 group">
                    <img src={imgUrl} alt={`Photo ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-full hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] px-1 rounded font-bold">
                      #{i + 1}
                    </span>
                  </div>
                ))}
              </div>

              {isUploading && (
                <div className="flex items-center gap-2 text-xs text-blue-700 mt-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Compressing photos for fast mobile upload...</span>
                </div>
              )}
            </div>

            {/* Part B: Walkthrough Video Module */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-rose-600" />
                  <span>Walkthrough Video Recording / Upload</span>
                </label>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full">
                  High Buyer Response
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Record a 30-60 second mobile walkthrough of the rooms or upload an existing clip.
              </p>

              {/* Video File Upload */}
              {!videoFile ? (
                <div>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/50 hover:bg-rose-50 rounded-xl p-3 transition-all cursor-pointer">
                    {isVideoUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 text-rose-600 animate-spin" />
                        <span className="text-xs font-bold text-rose-700">Attaching video file...</span>
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 text-rose-600" />
                        <span className="text-xs font-bold text-rose-800">
                          + Record / Upload Video File (Max 25MB)
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      disabled={isVideoUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                /* Video File Preview */
                <div className="bg-white border border-rose-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 truncate">
                      <FileVideo className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="truncate">{videoFile.name}</span>
                      <span className="text-slate-400 font-normal">({videoFile.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="text-red-600 hover:underline text-[11px] font-bold cursor-pointer"
                    >
                      Remove Video
                    </button>
                  </div>

                  {videoFile.dataUrl && (
                    <video
                      src={videoFile.dataUrl}
                      controls
                      className="w-full max-h-48 rounded-lg bg-black object-contain shadow-inner"
                    />
                  )}
                </div>
              )}

              {/* Video Link Option (YouTube / Drive / Reel) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 text-blue-600" />
                  <span>Or Paste Video Link (YouTube / Google Drive / Instagram Reel):</span>
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtu.be/... or Google Drive video link"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

          </div>

          {/* Section 5: Visit Notes & Handover Terms */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-teal-600" />
                Step 5: Visit Notes & Agreement Conditions
              </span>
              <span className="text-[10px] text-slate-400">5 of 5</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Landlord Demands, Keys Availability & Terms
              </label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Keys with owner on ground floor, 11-month agreement required, vegetarian only, clean airy rooms."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging Survey & Dispatching to Office...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>SUBMIT PROPERTY SURVEY (FOR APPROVAL)</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-2">
              🔒 Sent to Owner Verification Queue for 1-click approval & published on www.gurdaspurproperty.in.
            </p>
          </div>

        </form>
      )}

    </div>
  );
}
