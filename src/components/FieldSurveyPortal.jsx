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
  Users
} from 'lucide-react';
import { GURDASPUR_LOCALITIES } from '../data/initialProperties';
import { addLead } from '../utils/storage';
import { sendFieldSurveyNotification } from '../utils/notificationService';

export default function FieldSurveyPortal({ settings, onSurveySubmitted, onLogout }) {
  const [surveyorName, setSurveyorName] = useState(
    localStorage.getItem('gp_surveyor_name') || 'Field Executive 1'
  );
  const [gpsLocation, setGpsLocation] = useState(null);
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Form Fields
  const [purpose, setPurpose] = useState('rent'); // 'rent' | 'sell'
  const [category, setCategory] = useState('room'); // 'room' | 'kothi' | 'plot' | 'commercial'
  const [locality, setLocality] = useState('Tibri Road');
  const [subArea, setSubArea] = useState(''); // Landmark / Street / House No.
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [size, setSize] = useState('1 Room Set');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [securityDeposit, setSecurityDeposit] = useState('1 Month Advance');
  
  // Rental specifics
  const [electricityMeter, setElectricityMeter] = useState('Separate Sub-Meter');
  const [waterSupply, setWaterSupply] = useState('24x7 Submersible');
  const [parking, setParking] = useState('2-Wheeler Inside');
  const [tenantPreference, setTenantPreference] = useState('Family or Working Professional');
  const [notes, setNotes] = useState('');

  // Photos
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSurveyId, setLastSurveyId] = useState('');

  useEffect(() => {
    localStorage.setItem('gp_surveyor_name', surveyorName);
  }, [surveyorName]);

  // Capture Live GPS Coordinates
  const handleCaptureGPS = () => {
    if (!navigator.geolocation) {
      alert("GPS Geolocation is not supported by this device/browser.");
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
        alert("Unable to acquire GPS location. Please check that GPS/Location access is enabled in your mobile phone settings.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Image Upload & Compression
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    const newImages = [];

    for (const file of files) {
      if (uploadedImages.length + newImages.length >= 8) break;
      const reader = new FileReader();
      const readPromise = new Promise((resolve) => {
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 1000;
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
  };

  const handleRemovePhoto = (idx) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== idx));
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
      type: 'field_survey',
      isSurvey: true,
      surveyStatus: 'pending_approval',
      surveyorName: surveyorName.trim(),
      purpose, // 'rent' or 'sell'
      category,
      locality,
      subArea: subArea.trim(),
      exactLocation: subArea.trim() || locality,
      size,
      price: expectedPrice,
      isNegotiable,
      securityDeposit: purpose === 'rent' ? securityDeposit : null,
      electricityMeter: purpose === 'rent' ? electricityMeter : null,
      waterSupply: purpose === 'rent' ? waterSupply : null,
      parking,
      tenantPreference: purpose === 'rent' ? tenantPreference : null,
      notes: notes.trim(),
      images: uploadedImages,
      gpsCoordinates: gpsLocation,
      googleMapsUrl,
      createdAt: new Date().toISOString()
    };

    // Save into Admin leads
    const saved = addLead(surveyData);
    setLastSurveyId(saved?.id || 'SURVEY-' + Date.now().toString().slice(-4));

    // Send instant email to owner (navkiransharma@gmail.com)
    await sendFieldSurveyNotification(surveyData, settings?.email || 'navkiransharma@gmail.com');

    if (onSurveySubmitted) onSurveySubmitted(saved);

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleResetForNext = () => {
    setSubmitted(false);
    setOwnerName('');
    setOwnerPhone('');
    setSubArea('');
    setExpectedPrice('');
    setNotes('');
    setUploadedImages([]);
    setGpsLocation(null);
    setGoogleMapsUrl('');
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans max-w-xl mx-auto">
      
      {/* Surveyor Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Field Executive Mode
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black font-['Outfit'] mt-1 text-white">
            Door-to-Door Property Survey
          </h2>
          <p className="text-xs text-slate-300">
            Intake form for Gurdaspur room rentals & property listings
          </p>
        </div>

        <button
          onClick={onLogout}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit</span>
        </button>
      </div>

      {submitted ? (
        /* Success Screen */
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-4 animate-in fade-in duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              Survey Logged: {lastSurveyId}
            </span>
            <h3 className="text-xl font-black text-slate-900 font-['Outfit'] mt-2">
              Property Survey Recorded!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
              Great job, <strong>{surveyorName}</strong>! The details for <strong>{ownerName}</strong> ({locality}) have been logged into the Owner Verification Queue.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-700 text-left space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Pending Owner Approval</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Notification:</span>
              <span className="font-semibold text-emerald-700">Sent to navkiransharma@gmail.com</span>
            </div>
            {googleMapsUrl && (
              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span className="text-slate-500">GPS Proof:</span>
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold flex items-center gap-1 hover:underline">
                  <span>View Map Pin</span>
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
          
          {/* Section 1: Executive Identity & GPS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                Executive Identification
              </span>
              <span className="text-[10px] text-slate-400">Step 1 of 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Surveyor Name / Staff ID *
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

              {/* 1-Click Live GPS Tagging */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Proof of Physical Visit (GPS)
                </label>
                <button
                  type="button"
                  onClick={handleCaptureGPS}
                  disabled={isLocating}
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    gpsLocation
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-900 text-white shadow-sm'
                  }`}
                >
                  {isLocating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Acquiring GPS Satellite...</span>
                    </>
                  ) : gpsLocation ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">GPS Tagged (±{gpsLocation.accuracy}m)</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span>📍 Tag Current Location</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {gpsLocation && (
              <div className="text-[11px] bg-emerald-50 text-emerald-800 p-2 rounded-xl flex items-center justify-between">
                <span>Coordinates: {gpsLocation.latitude}, {gpsLocation.longitude}</span>
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline flex items-center gap-1">
                  Test Pin <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Section 2: Property Type & Pricing */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-blue-600" />
                Listing Purpose & Category
              </span>
              <span className="text-[10px] text-slate-400">Step 2 of 4</span>
            </div>

            {/* Purpose: Rent vs Sell */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                Available For
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
                  🔑 FOR RENT (Room / House)
                </button>

                <button
                  type="button"
                  onClick={() => { setPurpose('sell'); setCategory('plot'); setSize('10 Marla'); }}
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
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'room', label: 'Room / Floor' },
                  { id: 'kothi', label: 'Full Kothi / House' },
                  { id: 'plot', label: 'Plot / Land' },
                  { id: 'commercial', label: 'Commercial / Shop' }
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
                  Size / Config *
                </label>
                <input
                  type="text"
                  required
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="e.g. 1 BHK, 2 Rooms, 10 Marla"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
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
                  placeholder={purpose === 'rent' ? 'e.g. 6500' : 'e.g. 3500000'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Rental Extras if Rent */}
            {purpose === 'rent' && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2.5 text-xs">
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
                      <option value="Separate Sub-Meter">Separate Sub-Meter</option>
                      <option value="Shared Meter with Owner">Shared with Owner</option>
                      <option value="Included in Rent">Included in Rent</option>
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
                      <option value="Students / Bachelors Allowed">Bachelors Allowed</option>
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
                      <option value="Car & 2-Wheeler Inside">Car & 2-Wheeler Inside</option>
                      <option value="2-Wheeler Inside Gate">2-Wheeler Only</option>
                      <option value="Street / Open Parking">Street Parking Only</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Landlord / Owner Contact (Crucial for Owner Control) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                Landlord / Owner Contact
              </span>
              <span className="text-[10px] text-slate-400">Step 3 of 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Owner Full Name *
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
                  Owner Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="e.g. 98140XXXXX"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                />
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
                  House No. / Street / Landmark
                </label>
                <input
                  type="text"
                  value={subArea}
                  onChange={(e) => setSubArea(e.target.value)}
                  placeholder="e.g. Street 4, Near Gurudwara"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Live Photos & Notes */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-rose-500" />
                Live Camera Photos from Field
              </span>
              <span className="text-[10px] text-slate-400">Step 4 of 4</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Take photo of Front Gate, Street, or Rooms (Max 8 photos)
              </label>

              <div className="flex flex-wrap gap-2.5 items-center">
                <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:text-emerald-600 cursor-pointer transition-colors shrink-0">
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold">+ Snap / Add</span>
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
                      className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-full hover:bg-red-700 transition-colors shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] px-1 rounded">
                      #{i + 1}
                    </span>
                  </div>
                ))}
              </div>

              {isUploading && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 mt-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Compressing photos...</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Landlord Notes / Key Agreement Conditions
              </label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Keys with owner upstairs, available immediately, prefers vegetarian tenants"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging Survey & Alerting Owner...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>SUBMIT FIELD SURVEY (FOR APPROVAL)</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-2">
              🔒 Submissions enter the Owner Verification Queue before going live publicly.
            </p>
          </div>

        </form>
      )}

    </div>
  );
}
