import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Edit3, 
  Phone, 
  MessageCircle, 
  Settings, 
  Building2, 
  Users, 
  RefreshCcw, 
  CheckCircle2,
  Save,
  Tag,
  Camera,
  Video,
  Play,
  Film,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  ClipboardCheck,
  QrCode,
  MapPin,
  BadgeCheck,
  AlertCircle,
  Clock,
  Sparkles,
  LogOut,
  Car,
  Zap,
  Droplets,
  Printer,
  UserCheck
} from 'lucide-react';
import { 
  getLeads, 
  deleteLead, 
  updateLead,
  saveProperties, 
  saveSettings, 
  resetToDefault 
} from '../utils/storage';
import { GURDASPUR_LOCALITIES } from '../data/initialProperties';
import FieldSurveyPortal from './FieldSurveyPortal';
import ExecutiveIdCardKit from './ExecutiveIdCardKit';

export default function AdminModal({ 
  isOpen, 
  onClose, 
  properties, 
  setProperties, 
  settings, 
  setSettings 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authRole, setAuthRole] = useState(null); // 'admin' | 'surveyor'
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'surveys' | 'leads' | 'id_cards' | 'settings'
  const [surveyFilter, setSurveyFilter] = useState('all'); // 'all' | 'pending' | 'approved'
  const [leads, setLeads] = useState([]);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [editLeadForm, setEditLeadForm] = useState(null);

  // Property Form State
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [propForm, setPropForm] = useState({
    title: '',
    category: 'plot',
    purpose: 'buy',
    price: '',
    pricePerUnit: '',
    size: '',
    unit: 'Marla',
    sqft: '',
    location: 'Tibri Road',
    cityArea: '',
    description: '',
    amenities: '30 Ft Wide Road, Immediate Registry, Clear Mutation',
    imageUrl: '/images/properties/gurdaspur_plotted_colony.jpg',
    images: [],
    videoUrl: '',
    badge: 'Hot Deal',
    verified: true,
    facing: 'East'
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({ ...settings });
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLeads(getLeads());
      setSettingsForm({ ...settings });
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const surveys = leads.filter(l => l.isSurvey || l.type === 'field_survey');
  const webLeads = leads.filter(l => !l.isSurvey && l.type !== 'field_survey');
  const pendingSurveysCount = surveys.filter(s => s.surveyStatus !== 'approved').length;

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanInput = pinInput.trim();
    if (cleanInput === '4051#' || cleanInput === settings.adminPin) {
      setIsAuthenticated(true);
      setAuthRole('admin');
      setPinError(false);
    } else if (cleanInput === '2026#' || cleanInput === (settings.surveyorPin || '2026#')) {
      setIsAuthenticated(true);
      setAuthRole('surveyor');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleDeleteProperty = (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      const updated = properties.filter(p => p.id !== id);
      setProperties(updated);
      saveProperties(updated);
    }
  };

  const handleToggleStatus = (id) => {
    const updated = properties.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'available' ? 'token_paid' : p.status === 'token_paid' ? 'sold' : 'available';
        return { ...p, status: nextStatus };
      }
      return p;
    });
    setProperties(updated);
    saveProperties(updated);
  };

  const handleEditClick = (prop) => {
    setEditingPropertyId(prop.id);
    setPropForm({
      title: prop.title,
      category: prop.category,
      purpose: prop.purpose,
      price: prop.price,
      pricePerUnit: prop.pricePerUnit || '',
      size: prop.size,
      unit: prop.unit,
      sqft: prop.sqft || '',
      location: prop.location,
      cityArea: prop.cityArea,
      description: prop.description,
      amenities: prop.amenities?.join(', ') || '',
      imageUrl: prop.images?.[0] || '',
      images: prop.images || [],
      videoUrl: prop.videoUrl || '',
      badge: prop.badge || 'Hot Deal',
      verified: prop.verified !== false,
      facing: prop.facing || 'East'
    });
    setShowPropertyForm(true);
  };

  const handleConvertLeadToProperty = (lead) => {
    setActiveTab('properties');
    setEditingPropertyId(null);
    const sizeNumber = lead.size ? lead.size.split(' ')[0] : '10';
    const unitName = lead.size && lead.size.includes('Kanal') ? 'Kanal' : 'Marla';
    const priceNum = parseFloat(lead.price) || 0;
    
    const leadImages = (lead.images && lead.images.length > 0) ? lead.images : [];
    const defaultCover = lead.category === 'kothi' 
      ? '/images/properties/gurdaspur_real_kothi.jpg'
      : lead.category === 'commercial'
      ? '/images/properties/gurdaspur_commercial_sco.jpg'
      : lead.category === 'land'
      ? '/images/properties/punjab_tubewell_farm.jpg'
      : '/images/properties/gurdaspur_plotted_colony.jpg';

    setPropForm({
      title: `${lead.size || '10 Marla'} ${lead.category === 'plot' ? 'Residential Plot' : lead.category === 'kothi' ? 'Modern Kothi' : lead.category === 'commercial' ? 'Commercial Space' : 'Land'} in ${lead.locality || 'Gurdaspur'}`,
      category: lead.category || 'plot',
      purpose: lead.purpose || 'buy',
      price: priceNum,
      pricePerUnit: priceNum >= 10000000 ? `₹${(priceNum / 10000000).toFixed(2)} Cr` : `₹${(priceNum / 100000).toFixed(2)} Lakh`,
      size: sizeNumber,
      unit: unitName,
      sqft: (parseFloat(sizeNumber) || 10) * (unitName === 'Marla' ? 225 : 5445),
      location: lead.locality || 'Tibri Road',
      cityArea: lead.subArea ? `${lead.subArea}, ${lead.locality}, Gurdaspur` : `Near ${lead.locality}, Gurdaspur`,
      description: lead.notes || `Prime verified ${lead.category || 'property'} located on ${lead.locality}. Road width: ${lead.roadWidth || '30 Feet'}. Clear government registry with authenticated mutation (Inteqaal). Direct deals handled via Travelx Gurdaspur Property Consultants.`,
      amenities: `${lead.roadWidth || '30 Ft Road'}, Immediate Registry, 100% Clear Mutation (Inteqaal), Verified Title`,
      imageUrl: leadImages.length > 0 ? leadImages[0] : defaultCover,
      images: leadImages.length > 0 ? leadImages : [defaultCover],
      videoUrl: lead.videoUrl || '',
      badge: 'Direct Listing',
      verified: true,
      facing: lead.facing || 'East'
    });
    setShowPropertyForm(true);
  };

  const handleApproveSurveyLead = (survey) => {
    const priceNum = parseFloat(survey.price) || 0;
    const isRent = survey.purpose === 'rent';
    const sizeStr = survey.size || (survey.category === 'room' ? '1 Room Set' : '10 Marla');
    const newId = `GP-${Math.floor(100 + Math.random() * 900)}`;

    const defaultCover = survey.category === 'room'
      ? '/images/properties/gurdaspur_real_kothi.jpg'
      : survey.category === 'kothi'
      ? '/images/properties/gurdaspur_real_kothi.jpg'
      : survey.category === 'commercial'
      ? '/images/properties/gurdaspur_commercial_sco.jpg'
      : survey.category === 'land'
      ? '/images/properties/punjab_tubewell_farm.jpg'
      : '/images/properties/gurdaspur_plotted_colony.jpg';

    const images = (survey.images && survey.images.length > 0) ? survey.images : [defaultCover];

    let desc = `${sizeStr} available for ${isRent ? 'immediate rent' : 'direct sale'} in ${survey.locality}, Gurdaspur. `;
    if (survey.subArea) desc += `Location / Landmark: ${survey.subArea}. `;
    if (isRent) {
      if (survey.electricityMeter) desc += `Electricity: ${survey.electricityMeter}. `;
      if (survey.waterSupply) desc += `Water Supply: ${survey.waterSupply}. `;
      if (survey.parking) desc += `Parking: ${survey.parking}. `;
      if (survey.tenantPreference) desc += `Preferred Tenant: ${survey.tenantPreference}. `;
      if (survey.securityDeposit) desc += `Security Deposit: ${survey.securityDeposit}. `;
    }
    if (survey.notes) desc += `${survey.notes}. `;
    desc += `Verified on-site visit by Gurdaspur Property field team. Direct deal, zero hidden brokerage.`;

    const amenities = [
      survey.parking || 'Parking Available',
      survey.waterSupply || 'Water Supply',
      survey.electricityMeter || 'Electricity Connection',
      'Verified Physical GPS Visit',
      'Direct Landlord Deal'
    ].filter(Boolean);

    const newProp = {
      id: newId,
      title: `${sizeStr} for ${isRent ? 'Rent' : 'Sale'} in ${survey.locality}`,
      category: survey.category || 'room',
      purpose: isRent ? 'rent' : 'buy',
      price: priceNum,
      pricePerUnit: isRent
        ? `₹${priceNum.toLocaleString('en-IN')}/month`
        : (priceNum >= 10000000 ? `₹${(priceNum / 10000000).toFixed(2)} Cr` : `₹${(priceNum / 100000).toFixed(2)} Lakh`),
      size: sizeStr,
      unit: survey.category === 'room' ? 'Room Set' : 'Marla',
      sqft: survey.category === 'room' ? 250 : 2250,
      location: survey.locality || 'Tibri Road',
      cityArea: survey.subArea ? `${survey.subArea}, ${survey.locality}, Gurdaspur` : `${survey.locality}, Gurdaspur`,
      description: desc,
      amenities: amenities,
      imageUrl: images[0],
      images: images,
      videoUrl: survey.videoUrl || '',
      badge: 'Field Verified',
      verified: true,
      facing: 'East',
      status: 'available',
      dateAdded: new Date().toISOString().split('T')[0]
    };

    const updatedProps = [newProp, ...properties];
    setProperties(updatedProps);
    saveProperties(updatedProps);

    const updatedLeads = updateLead(survey.id, { surveyStatus: 'approved' });
    setLeads(updatedLeads);

    alert(`✅ Survey Approved & Published Successfully!\n\nListing ID: ${newId}\n"${newProp.title}" is now LIVE on www.gurdaspurproperty.in!`);
  };

  const handleConvertSurveyToForm = (survey) => {
    setActiveTab('properties');
    setEditingPropertyId(null);
    const isRent = survey.purpose === 'rent';
    const priceNum = parseFloat(survey.price) || 0;
    const sizeStr = survey.size || (survey.category === 'room' ? '1 Room Set' : '10 Marla');

    const defaultCover = survey.category === 'room'
      ? '/images/properties/gurdaspur_real_kothi.jpg'
      : survey.category === 'kothi'
      ? '/images/properties/gurdaspur_real_kothi.jpg'
      : survey.category === 'commercial'
      ? '/images/properties/gurdaspur_commercial_sco.jpg'
      : survey.category === 'land'
      ? '/images/properties/punjab_tubewell_farm.jpg'
      : '/images/properties/gurdaspur_plotted_colony.jpg';

    const images = (survey.images && survey.images.length > 0) ? survey.images : [defaultCover];

    let desc = `${sizeStr} available for ${isRent ? 'immediate rent' : 'sale'} in ${survey.locality}, Gurdaspur. `;
    if (survey.subArea) desc += `Near ${survey.subArea}. `;
    if (isRent) {
      if (survey.electricityMeter) desc += `Electricity: ${survey.electricityMeter}. `;
      if (survey.waterSupply) desc += `Water Supply: ${survey.waterSupply}. `;
      if (survey.parking) desc += `Parking: ${survey.parking}. `;
      if (survey.tenantPreference) desc += `Preferred Tenant: ${survey.tenantPreference}. `;
    }
    if (survey.notes) desc += `${survey.notes}. `;

    setPropForm({
      title: `${sizeStr} for ${isRent ? 'Rent' : 'Sale'} in ${survey.locality}`,
      category: survey.category || 'room',
      purpose: isRent ? 'rent' : 'buy',
      price: priceNum,
      pricePerUnit: isRent
        ? `₹${priceNum.toLocaleString('en-IN')}/month`
        : (priceNum >= 10000000 ? `₹${(priceNum / 10000000).toFixed(2)} Cr` : `₹${(priceNum / 100000).toFixed(2)} Lakh`),
      size: sizeStr,
      unit: survey.category === 'room' ? 'Room Set' : 'Marla',
      sqft: survey.category === 'room' ? 250 : 2250,
      location: survey.locality || 'Tibri Road',
      cityArea: survey.subArea ? `${survey.subArea}, ${survey.locality}, Gurdaspur` : `${survey.locality}, Gurdaspur`,
      description: desc,
      amenities: `${survey.parking || 'Parking'}, ${survey.electricityMeter || 'Sub-Meter'}, Physical GPS Verified Visit, Direct Landlord Deal`,
      imageUrl: images[0],
      images: images,
      videoUrl: '',
      badge: 'Field Verified',
      verified: true,
      facing: 'East'
    });
    setShowPropertyForm(true);
  };

  const handleSaveProperty = (e) => {
    e.preventDefault();
    const amenitiesArray = propForm.amenities.split(',').map(a => a.trim()).filter(Boolean);
    const numericPrice = parseFloat(propForm.price) || 0;
    const numericSize = parseFloat(propForm.size) || 0;
    const numericSqft = parseFloat(propForm.sqft) || (propForm.unit === 'Marla' ? numericSize * 225 : numericSize * 5445);
    const resolvedImages = (propForm.images && propForm.images.length > 0)
      ? propForm.images
      : [propForm.imageUrl];

    if (propForm.imageUrl && resolvedImages[0] !== propForm.imageUrl) {
      resolvedImages[0] = propForm.imageUrl;
    }

    if (editingPropertyId) {
      const updated = properties.map(p => {
        if (p.id === editingPropertyId) {
          return {
            ...p,
            ...propForm,
            price: numericPrice,
            size: numericSize,
            sqft: numericSqft,
            amenities: amenitiesArray,
            images: resolvedImages,
            videoUrl: propForm.videoUrl || ''
          };
        }
        return p;
      });
      setProperties(updated);
      saveProperties(updated);
    } else {
      const newId = `GP-${Math.floor(100 + Math.random() * 900)}`;
      const newProp = {
        id: newId,
        ...propForm,
        price: numericPrice,
        size: numericSize,
        sqft: numericSqft,
        amenities: amenitiesArray,
        images: resolvedImages,
        videoUrl: propForm.videoUrl || '',
        status: 'available',
        dateAdded: new Date().toISOString().split('T')[0]
      };
      const updated = [newProp, ...properties];
      setProperties(updated);
      saveProperties(updated);
    }

    setShowPropertyForm(false);
    setEditingPropertyId(null);
  };

  const compressImageFile = (file) => {
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

  const handleDeleteLeadPhoto = (leadId, photoIndex, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete Photo #${photoIndex + 1}?`)) {
      const currentLead = leads.find(l => l.id === leadId);
      if (!currentLead) return;
      const updatedImages = (currentLead.images || []).filter((_, idx) => idx !== photoIndex);
      updateLead(leadId, { images: updatedImages });
      setLeads(getLeads());
    }
  };

  const handleAddPhotosToLead = async (leadId, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const currentLead = leads.find(l => l.id === leadId);
    const existingImages = currentLead?.images || [];
    const remainingSlots = 15 - existingImages.length;
    if (remainingSlots <= 0) {
      alert("Maximum 15 photos allowed per listing.");
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);
    const compressedList = await Promise.all(selectedFiles.map(compressImageFile));
    const validCompressed = compressedList.filter(Boolean);

    const updatedImages = [...existingImages, ...validCompressed];
    updateLead(leadId, { images: updatedImages });
    setLeads(getLeads());
    e.target.value = '';
  };

  const handleDeleteLead = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this lead?")) {
      deleteLead(id);
      setLeads(getLeads());
    }
  };

  const handleStartEditLead = (lead) => {
    setEditingLeadId(lead.id);
    setEditLeadForm({
      name: lead.name || '',
      phone: lead.phone || '',
      ownerRole: lead.ownerRole || 'Property Owner',
      purpose: lead.purpose || 'sell',
      category: lead.category || 'plot',
      locality: lead.locality || 'Tibri Road',
      subArea: lead.subArea || '',
      size: lead.size || '',
      dimensions: lead.dimensions || '',
      price: lead.price || '',
      isNegotiable: lead.isNegotiable !== false,
      exactLocation: lead.exactLocation || '',
      registryStatus: lead.registryStatus || '',
      notes: lead.notes || ''
    });
  };

  const handleSaveEditLead = (leadId, e) => {
    e.preventDefault();
    updateLead(leadId, editLeadForm);
    setLeads(getLeads());
    setEditingLeadId(null);
    setEditLeadForm(null);
  };

  const handleAddPhotosToPropForm = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const currentImages = propForm.images && propForm.images.length > 0
      ? propForm.images
      : (propForm.imageUrl ? [propForm.imageUrl] : []);
    const compressedList = await Promise.all(files.map(compressImageFile));
    const valid = compressedList.filter(Boolean);
    const updated = [...currentImages, ...valid];
    setPropForm({
      ...propForm,
      imageUrl: updated[0] || propForm.imageUrl,
      images: updated
    });
    e.target.value = '';
  };

  const handleDeletePropFormPhoto = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    const currentImages = propForm.images && propForm.images.length > 0
      ? propForm.images
      : (propForm.imageUrl ? [propForm.imageUrl] : []);
    const updated = currentImages.filter((_, idx) => idx !== index);
    setPropForm({
      ...propForm,
      imageUrl: updated[0] || '',
      images: updated
    });
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettings(settingsForm);
    saveSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all properties and settings to initial default?")) {
      resetToDefault();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 relative text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 rounded-t-3xl flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.svg" 
              alt="Gurdaspur Property" 
              className="h-10 w-auto object-contain brightness-110 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-['Outfit']">
                  {authRole === 'surveyor' 
                    ? 'Field Surveyor Mobile Portal' 
                    : 'Gurdaspur Property Admin Panel'}
                </h2>
                {isAuthenticated && (
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    authRole === 'surveyor' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {authRole === 'surveyor' ? 'Field Executive Mode' : 'Owner Master Control'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {authRole === 'surveyor' 
                  ? 'Door-to-door property logging with live GPS verification' 
                  : 'Manage listings, field surveys, leads & office settings'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setAuthRole(null);
                  setPinInput('');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Switch PIN / Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto py-8 text-center">
              <div className="flex justify-center mb-4">
                <img src="/logo.svg" alt="Gurdaspur Property" className="h-14 w-auto object-contain" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-['Outfit'] mb-1">
                Portal Authentication
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Enter your authorized security PIN to continue
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="password"
                  maxLength="8"
                  autoFocus
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-center text-3xl tracking-widest font-mono font-bold bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner"
                />

                {pinError && (
                  <p className="text-xs text-red-500 font-semibold bg-red-50 py-2 px-3 rounded-xl border border-red-200">
                    Incorrect security PIN. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Unlock Dashboard
                </button>
              </form>

              {/* Two-Tier PIN Guidance Box */}
              <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-3 text-left">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs mb-1">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Master Admin</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mb-1">
                    Full control, approvals, settings & website leads.
                  </div>
                  <code className="text-[11px] font-mono font-bold text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                    4051#
                  </code>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs mb-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Field Surveyor</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mb-1">
                    Mobile intake form with live GPS & camera upload.
                  </div>
                  <code className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                    2026#
                  </code>
                </div>
              </div>
            </div>
          ) : authRole === 'surveyor' ? (
            <FieldSurveyPortal 
              settings={settings} 
              onSurveySubmitted={() => setLeads(getLeads())}
              onLogout={() => {
                setIsAuthenticated(false);
                setAuthRole(null);
                setPinInput('');
              }}
            />
          ) : (
            <div>
              {/* Navigation Tabs */}
              <div className="flex flex-wrap border-b border-slate-200 pb-3 mb-6 gap-2">
                <button
                  onClick={() => { setActiveTab('properties'); setShowPropertyForm(false); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'properties' 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Properties ({properties.length})
                </button>

                <button
                  onClick={() => setActiveTab('surveys')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                    activeTab === 'surveys' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <ClipboardCheck className="w-4 h-4" />
                  Door Surveys ({surveys.length})
                  {pendingSurveysCount > 0 && (
                    <span className="bg-amber-400 text-amber-950 font-black text-[10px] px-1.5 py-0.2 rounded-full shadow-xs">
                      {pendingSurveysCount} pending
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('leads')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'leads' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Website Leads ({webLeads.length})
                </button>

                <button
                  onClick={() => setActiveTab('id_cards')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'id_cards' 
                      ? 'bg-purple-600 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  Staff ID & Cards
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'settings' 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Portal Settings
                </button>
              </div>

              {/* TAB 1: PROPERTIES */}
              {activeTab === 'properties' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">Active Listings in Gurdaspur</h3>
                      <p className="text-xs text-slate-400">Total {properties.length} properties displayed on website</p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingPropertyId(null);
                        setPropForm({
                          title: '',
                          category: 'plot',
                          purpose: 'buy',
                          price: '',
                          pricePerUnit: '',
                          size: '',
                          unit: 'Marla',
                          sqft: '',
                          location: 'Tibri Road',
                          cityArea: '',
                          description: '',
                          amenities: '30 Ft Road, Immediate Registry, Clear Mutation',
                          imageUrl: '/images/properties/gurdaspur_plotted_colony.jpg',
                          images: [],
                          videoUrl: '',
                          badge: 'Hot Deal',
                          verified: true,
                          facing: 'East'
                        });
                        setShowPropertyForm(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Property
                    </button>
                  </div>

                  {/* Add / Edit Form Modal inside */}
                  {showPropertyForm && (
                    <div className="mb-6 p-5 bg-slate-50 border-2 border-emerald-500/40 rounded-2xl animate-in fade-in">
                      <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
                        <h4 className="font-bold text-sm text-emerald-900 font-['Outfit']">
                          {editingPropertyId ? `Edit Property (${editingPropertyId})` : 'Add New Property Listing'}
                        </h4>
                        <button 
                          onClick={() => setShowPropertyForm(false)}
                          className="text-xs text-slate-400 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleSaveProperty} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Title</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 10 Marla Corner Plot on Tibri Road"
                              value={propForm.title}
                              onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Locality in Gurdaspur</label>
                            <select
                              value={propForm.location}
                              onChange={(e) => setPropForm({ ...propForm, location: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
                            >
                              {GURDASPUR_LOCALITIES.filter(l => l !== 'All Localities').map(l => (
                                <option key={l} value={l}>{l}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Category</label>
                            <select
                              value={propForm.category}
                              onChange={(e) => setPropForm({ ...propForm, category: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
                            >
                              <option value="plot">Plot</option>
                              <option value="kothi">Kothi / House</option>
                              <option value="commercial">Commercial / SCO</option>
                              <option value="land">Agricultural Land</option>
                              <option value="rent">Rental Property</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Purpose</label>
                            <select
                              value={propForm.purpose}
                              onChange={(e) => setPropForm({ ...propForm, purpose: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
                            >
                              <option value="buy">For Sale</option>
                              <option value="rent">For Rent</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Numeric Price (₹)</label>
                            <input
                              type="number"
                              required
                              placeholder="e.g. 3500000"
                              value={propForm.price}
                              onChange={(e) => setPropForm({ ...propForm, price: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Size (Value)</label>
                            <input
                              type="number"
                              required
                              placeholder="e.g. 10"
                              value={propForm.size}
                              onChange={(e) => setPropForm({ ...propForm, size: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Unit</label>
                            <select
                              value={propForm.unit}
                              onChange={(e) => setPropForm({ ...propForm, unit: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
                            >
                              <option value="Marla">Marla</option>
                              <option value="Kanal">Kanal</option>
                              <option value="Gaj">Gaj</option>
                              <option value="Acre">Acre</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Badge</label>
                            <select
                              value={propForm.badge}
                              onChange={(e) => setPropForm({ ...propForm, badge: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
                            >
                              <option value="Hot Deal">Hot Deal</option>
                              <option value="Luxury">Luxury</option>
                              <option value="High ROI">High ROI</option>
                              <option value="Price Dropped">Price Dropped</option>
                              <option value="Verified Land">Verified Land</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Image URL (Cover Photo)</label>
                            <input
                              type="text"
                              placeholder="https://..."
                              value={propForm.imageUrl}
                              onChange={(e) => setPropForm({ ...propForm, imageUrl: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Video Walkthrough URL (Optional)</label>
                            <input
                              type="text"
                              placeholder="https://youtu.be/... or Google Drive"
                              value={propForm.videoUrl || ''}
                              onChange={(e) => setPropForm({ ...propForm, videoUrl: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
                            />
                          </div>
                        </div>

                        {/* Listing Gallery Photos Upload & Delete */}
                        <div className="space-y-2 p-3 bg-white rounded-xl border border-slate-200">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] font-bold uppercase text-slate-600 flex items-center gap-1.5">
                              <Camera className="w-3.5 h-3.5 text-blue-600" />
                              <span>Listing Gallery Photos ({(propForm.images || []).length} Photos)</span>
                            </span>
                            <label className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs">
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Add Photos from Device</span>
                              <input 
                                type="file" 
                                multiple 
                                accept="image/*" 
                                onChange={handleAddPhotosToPropForm} 
                                className="hidden" 
                              />
                            </label>
                          </div>

                          {(propForm.images && propForm.images.length > 0) ? (
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                              {propForm.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-300 bg-slate-900 group shadow-xs">
                                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                  <span className="absolute bottom-0.5 left-0.5 bg-black/75 text-[8px] text-white px-1 rounded font-mono">
                                    {idx === 0 ? 'Cover' : `#${idx + 1}`}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeletePropFormPhoto(idx, e)}
                                    className="absolute top-0.5 right-0.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-md cursor-pointer transition-transform hover:scale-110"
                                    title="Delete photo"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">No gallery photos uploaded yet. Click "+ Add Photos from Device" above or enter a cover URL.</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Description</label>
                          <textarea
                            rows="2"
                            placeholder="Complete description of the property..."
                            value={propForm.description}
                            onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
                          ></textarea>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowPropertyForm(false)}
                            className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                          >
                            Save Listing
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Properties List Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase">
                        <tr>
                          <th className="p-3">Property</th>
                          <th className="p-3">Location</th>
                          <th className="p-3">Size</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {properties.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="p-3">
                              <div className="font-bold text-slate-900">{p.title}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{p.id} • {p.category}</div>
                            </td>
                            <td className="p-3 text-slate-700 font-medium">{p.location}</td>
                            <td className="p-3 text-slate-700 font-semibold">{p.size} {p.unit}</td>
                            <td className="p-3 text-emerald-700 font-bold">
                              ₹{(p.price >= 100000 ? (p.price / 100000).toFixed(2) + 'L' : p.price)}
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => handleToggleStatus(p.id)}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase cursor-pointer ${
                                  p.status === 'available'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : p.status === 'token_paid'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                                title="Click to toggle status"
                              >
                                {p.status || 'available'}
                              </button>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleEditClick(p)}
                                  className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                                  title="Edit"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProperty(p.id)}
                                  className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: FIELD SURVEYS (DOOR-TO-DOOR INTAKE) */}
              {activeTab === 'surveys' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-2xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                          Door-to-Door Intake
                        </span>
                        <h3 className="font-extrabold text-sm text-slate-900 font-['Outfit']">
                          Field Executive Survey Queue
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Verify GPS physical proof & photos, then 1-click publish to www.gurdaspurproperty.in
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-emerald-200 shadow-2xs shrink-0">
                      <button
                        onClick={() => setSurveyFilter('all')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          surveyFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        All ({surveys.length})
                      </button>
                      <button
                        onClick={() => setSurveyFilter('pending')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          surveyFilter === 'pending' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Pending ({pendingSurveysCount})
                      </button>
                      <button
                        onClick={() => setSurveyFilter('approved')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          surveyFilter === 'approved' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Live ({surveys.length - pendingSurveysCount})
                      </button>
                    </div>
                  </div>

                  {/* Surveys List */}
                  {surveys.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
                      <ClipboardCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-slate-700">No Field Surveys Yet</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                        When your field executive goes door-to-door in Gurdaspur and logs rooms or houses using PIN <strong className="text-slate-800">2026#</strong>, they will instantly appear here with physical GPS coordinates for your review.
                      </p>
                      <button
                        onClick={() => {
                          setAuthRole('surveyor');
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                      >
                        <span>Open Field Surveyor Portal View</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {surveys
                        .filter(s => {
                          if (surveyFilter === 'pending') return s.surveyStatus !== 'approved';
                          if (surveyFilter === 'approved') return s.surveyStatus === 'approved';
                          return true;
                        })
                        .map(survey => {
                          const cleanPhone = survey.phone?.replace(/[^0-9]/g, '');
                          const isApproved = survey.surveyStatus === 'approved';

                          return (
                            <div 
                              key={survey.id} 
                              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-xs space-y-3.5 ${
                                isApproved 
                                  ? 'bg-white border-slate-200' 
                                  : 'bg-amber-50/30 border-amber-300'
                              }`}
                            >
                              {/* Header */}
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-extrabold text-sm text-slate-900">
                                    {survey.size || '1 Room Set'} {survey.category === 'room' ? 'Room Set' : survey.category}
                                  </span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    survey.purpose === 'rent' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {survey.purpose === 'rent' ? 'For Rent' : 'For Sale'}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400">{survey.id}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {isApproved ? (
                                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>Approved & Live</span>
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                                      <Clock className="w-3 h-3 text-amber-700" />
                                      <span>Pending Owner Approval</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Surveyor & Date Info */}
                              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                                <div className="flex items-center gap-1.5">
                                  <UserCheck className="w-4 h-4 text-emerald-600" />
                                  <span>Surveyed by: <strong className="text-slate-800">{survey.surveyorName || 'Field Executive'}</strong></span>
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {survey.createdAt ? new Date(survey.createdAt).toLocaleString('en-IN') : 'Recent'}
                                </div>
                              </div>

                              {/* GPS Verification Badge */}
                              {survey.googleMapsUrl ? (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                      <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                                        <span>Proof of Physical Visit Verified (GPS Geotagged)</span>
                                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                                      </div>
                                      {survey.gpsCoordinates && (
                                        <div className="text-[11px] text-emerald-800 font-mono">
                                          Coordinates: {survey.gpsCoordinates.latitude}, {survey.gpsCoordinates.longitude} (±{survey.gpsCoordinates.accuracy}m accuracy)
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <a
                                    href={survey.googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Verify on Google Maps</span>
                                  </a>
                                </div>
                              ) : (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 flex items-center gap-2">
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                                  <span>No GPS coordinates tagged for this survey.</span>
                                </div>
                              )}

                              {/* Details Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                                <div className="space-y-1.5">
                                  <div>
                                    <strong>Landlord / Owner:</strong> <span className="font-bold text-slate-900">{survey.name}</span>
                                  </div>
                                  <div>
                                    <strong>Locality:</strong> <span className="font-semibold text-slate-900">{survey.locality}</span> {survey.subArea ? `(${survey.subArea})` : ''}
                                  </div>
                                  <div>
                                    <strong>Expected {survey.purpose === 'rent' ? 'Rent' : 'Price'}:</strong>{' '}
                                    <span className="font-black text-emerald-700 text-sm">
                                      ₹{Number(survey.price || 0).toLocaleString('en-IN')}{survey.purpose === 'rent' ? '/month' : ''}
                                    </span>{' '}
                                    {survey.isNegotiable ? '(Negotiable)' : '(Fixed)'}
                                  </div>
                                  {survey.purpose === 'rent' && survey.securityDeposit && (
                                    <div><strong>Security Deposit:</strong> {survey.securityDeposit}</div>
                                  )}
                                </div>

                                <div className="space-y-1.5">
                                  {survey.purpose === 'rent' && (
                                    <>
                                      <div><strong>Electricity:</strong> {survey.electricityMeter || 'Sub-Meter'}</div>
                                      <div><strong>Water Supply:</strong> {survey.waterSupply || '24x7 Submersible'}</div>
                                      <div><strong>Parking:</strong> {survey.parking || 'Available'}</div>
                                      <div><strong>Tenant Preference:</strong> {survey.tenantPreference || 'Family or Working'}</div>
                                    </>
                                  )}
                                  {survey.exactLocation && (
                                    <div><strong>Exact House / Street:</strong> {survey.exactLocation}</div>
                                  )}
                                </div>
                              </div>

                              {survey.notes && (
                                <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 italic">
                                  "{survey.notes}"
                                </div>
                              )}

                              {/* Photos Grid */}
                              {survey.images && survey.images.length > 0 && (
                                <div>
                                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Field Photos ({survey.images.length} Photos Captured)</span>
                                  </div>
                                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                    {survey.images.map((img, idx) => (
                                      <a
                                        key={idx}
                                        href={img}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-900 shadow-2xs block"
                                      >
                                        <img src={img} alt={`Field photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Action Row */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                  <a
                                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${survey.name}, I am contacting you from Gurdaspur Property Consultants regarding your ${survey.size || 'property'} for ${survey.purpose === 'rent' ? 'rent' : 'sale'} in ${survey.locality} surveyed by our executive.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
                                    <span>WhatsApp Landlord</span>
                                  </a>

                                  <a
                                    href={`tel:${survey.phone}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                                  >
                                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                                    <span>Call</span>
                                  </a>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  {!isApproved && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handleApproveSurveyLead(survey)}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/30 cursor-pointer transition-all hover:scale-[1.02]"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>✓ Approve & Publish Live</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleConvertSurveyToForm(survey)}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold text-xs cursor-pointer"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Customize & Publish</span>
                                      </button>
                                    </>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLead(survey.id)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-bold text-xs cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>

                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: WEBSITE LEADS */}
              {activeTab === 'leads' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">Website Customer & Seller Leads</h3>
                      <p className="text-xs text-slate-400">Direct inquiries & submissions from www.gurdaspurproperty.in</p>
                    </div>
                  </div>

                  {webLeads.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      No website leads received yet. As soon as a user submits the "Post Property" form, it will appear here.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {webLeads.map(lead => {
                        const cleanLeadPhone = lead.phone?.replace(/[^0-9]/g, '');
                        return (
                          <div key={lead.id} className="p-4 rounded-2xl border-2 border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs space-y-3">
                            
                            {/* Top Badge & ID Row */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-slate-900">{lead.name}</span>
                                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                  {lead.ownerRole || 'Owner'}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">{lead.id}</span>
                              </div>

                              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <Lock className="w-3 h-3 text-rose-600" />
                                <span>Confidential Lead • Admin Only</span>
                              </span>
                            </div>

                            {/* Middle Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                              
                              {/* Left Specs */}
                              <div className="space-y-1">
                                <div><strong>Property Type:</strong> <span className="uppercase font-bold text-slate-900">{lead.category || 'plot'}</span> ({lead.purpose === 'rent' ? 'For Rent' : 'For Sale'})</div>
                                <div><strong>General Locality:</strong> <span className="font-semibold text-slate-900">{lead.locality || 'Gurdaspur'}</span> {lead.subArea ? `(${lead.subArea})` : ''}</div>
                                <div><strong>Size & Dimensions:</strong> <span className="font-bold text-slate-900">{lead.size || 'N/A'}</span> {lead.dimensions ? `• ${lead.dimensions}` : ''}</div>
                                <div><strong>Expected Price:</strong> <span className="font-black text-emerald-700 text-sm">₹{lead.price || 'N/A'}</span> {lead.isNegotiable ? '(Negotiable)' : ''}</div>
                              </div>

                              {/* Right Private Location & Documents */}
                              <div className="space-y-1.5 bg-rose-50/70 border border-rose-200/80 rounded-xl p-2.5">
                                <div className="text-[10px] uppercase font-black text-rose-700 flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-rose-600" />
                                  <span>Strictly Private Location (Not on website):</span>
                                </div>
                                <div className="font-bold text-xs text-slate-900">
                                  {lead.exactLocation || 'Shared on Call/WhatsApp'}
                                </div>
                                {lead.registryStatus && (
                                  <div className="text-[11px] text-slate-600 pt-1 border-t border-rose-200/60">
                                    <strong>Registry:</strong> {lead.registryStatus}
                                  </div>
                                )}
                              </div>

                            </div>

                            {lead.notes && (
                              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600 italic">
                                "{lead.notes}"
                              </div>
                            )}

                            {/* Customer Uploaded Photos Preview (up to 15 photos) */}
                            <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                              <div className="text-[10px] uppercase font-bold text-slate-600 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Customer Uploaded Photos ({(lead.images || []).length} / 15 Photos):</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-slate-400 hidden sm:inline">Click thumbnail to view full resolution</span>
                                  <label 
                                    htmlFor={`add-photos-${lead.id}`}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer shadow-xs transition-colors"
                                    title="Add more photos from device"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>+ Add Photos</span>
                                  </label>
                                  <input
                                    type="file"
                                    id={`add-photos-${lead.id}`}
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => handleAddPhotosToLead(lead.id, e)}
                                    className="hidden"
                                  />
                                </div>
                              </div>

                              {lead.images && lead.images.length > 0 ? (
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 pt-1">
                                  {lead.images.map((img, i) => (
                                    <div 
                                      key={i} 
                                      className="relative aspect-square rounded-lg overflow-hidden border border-slate-300 shadow-2xs group bg-slate-900"
                                    >
                                      <a 
                                        href={img} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="block w-full h-full"
                                        title={`View Photo #${i + 1} in full resolution`}
                                      >
                                        <img src={img} alt={`Upload ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                      </a>
                                      
                                      <span className="absolute bottom-0.5 left-0.5 bg-black/75 text-[8px] text-white px-1 rounded font-mono">
                                        #{i + 1}
                                      </span>

                                      {/* Delete Photo Button (Top Right) */}
                                      <button
                                        type="button"
                                        onClick={(e) => handleDeleteLeadPhoto(lead.id, i, e)}
                                        className="absolute top-0.5 right-0.5 p-1 bg-red-600/90 hover:bg-red-700 text-white rounded-md shadow-md cursor-pointer transition-all hover:scale-110"
                                        title={`Delete Photo #${i + 1}`}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}

                                  {/* Add photo card inside grid if under limit */}
                                  {(lead.images || []).length < 15 && (
                                    <label
                                      htmlFor={`add-photos-${lead.id}`}
                                      className="aspect-square rounded-lg border-2 border-dashed border-emerald-400 bg-emerald-50/60 hover:bg-emerald-100 flex flex-col items-center justify-center text-emerald-800 cursor-pointer transition-all gap-0.5 text-center p-1"
                                      title="Add photo"
                                    >
                                      <Plus className="w-4 h-4 text-emerald-600" />
                                      <span className="text-[9px] font-black uppercase leading-none">Add</span>
                                    </label>
                                  )}
                                </div>
                              ) : (
                                <div className="py-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white">
                                  <p className="text-[11px] text-slate-500 mb-1.5">No photos attached yet.</p>
                                  <label
                                    htmlFor={`add-photos-${lead.id}`}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>+ Upload Property Photos</span>
                                  </label>
                                </div>
                              )}
                            </div>

                            {/* Customer Video Walkthrough Section */}
                            {(lead.videoUrl || lead.videoFile) ? (
                              <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3 space-y-2">
                                <div className="text-[10px] uppercase font-black text-purple-900 flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <Video className="w-3.5 h-3.5 text-purple-600" />
                                    <span>Customer Video Walkthrough</span>
                                  </div>
                                  <span className="bg-purple-200 text-purple-900 text-[9px] px-2 py-0.5 rounded-full font-bold">
                                    Walkthrough Available
                                  </span>
                                </div>

                                {lead.videoUrl && (
                                  <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-purple-200">
                                    <div className="text-xs text-slate-700 truncate font-mono text-[11px] max-w-sm">
                                      {lead.videoUrl}
                                    </div>
                                    <a
                                      href={lead.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg shrink-0 shadow-xs"
                                    >
                                      <Play className="w-3.5 h-3.5 fill-white" />
                                      <span>Watch Walkthrough Video</span>
                                    </a>
                                  </div>
                                )}

                                {lead.videoFile && (
                                  <div className="bg-white p-2.5 rounded-lg border border-purple-200 space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="font-bold text-slate-800 truncate">{lead.videoFile.name}</span>
                                      <span className="text-[10px] text-slate-500 font-medium">{lead.videoFile.size}</span>
                                    </div>
                                    {lead.videoFile.dataUrl && (
                                      <video 
                                        src={lead.videoFile.dataUrl} 
                                        controls 
                                        className="w-full max-h-48 rounded-lg bg-black object-contain shadow-inner"
                                      />
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                                <div className="flex items-center gap-1.5">
                                  <Video className="w-3.5 h-3.5 text-slate-400" />
                                  <span>No video attached by customer yet.</span>
                                </div>
                                <a
                                  href={`https://wa.me/${cleanLeadPhone}?text=${encodeURIComponent(`Hello ${lead.name}, please share a short video walkthrough of your property in ${lead.locality} on WhatsApp so we can attract serious verified buyers.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                                >
                                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                                  <span>Request Video on WhatsApp</span>
                                </a>
                              </div>
                            )}

                            {/* Inline Edit Form (when active) */}
                            {editingLeadId === lead.id && editLeadForm && (
                              <form onSubmit={(e) => handleSaveEditLead(lead.id, e)} className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-3">
                                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                                  <h4 className="text-xs font-bold text-amber-900 uppercase">Edit Lead Details ({lead.id})</h4>
                                  <button type="button" onClick={() => setEditingLeadId(null)} className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer">Cancel</button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Owner Name</label>
                                    <input 
                                      type="text" 
                                      value={editLeadForm.name} 
                                      onChange={(e) => setEditLeadForm({ ...editLeadForm, name: e.target.value })} 
                                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium" 
                                      required 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Phone Number</label>
                                    <input 
                                      type="text" 
                                      value={editLeadForm.phone} 
                                      onChange={(e) => setEditLeadForm({ ...editLeadForm, phone: e.target.value })} 
                                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium" 
                                      required 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Expected Price (₹)</label>
                                    <input 
                                      type="text" 
                                      value={editLeadForm.price} 
                                      onChange={(e) => setEditLeadForm({ ...editLeadForm, price: e.target.value })} 
                                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium" 
                                      required 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Size & Unit</label>
                                    <input 
                                      type="text" 
                                      value={editLeadForm.size} 
                                      onChange={(e) => setEditLeadForm({ ...editLeadForm, size: e.target.value })} 
                                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium" 
                                      required 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Locality</label>
                                    <select 
                                      value={editLeadForm.locality} 
                                      onChange={(e) => setEditLeadForm({ ...editLeadForm, locality: e.target.value })} 
                                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                                    >
                                      {GURDASPUR_LOCALITIES.filter(l => l !== 'All Localities').map(l => (
                                        <option key={l} value={l}>{l}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Colony / Landmark</label>
                                    <input 
                                      type="text" 
                                      value={editLeadForm.subArea} 
                                      onChange={(e) => setEditLeadForm({ ...editLeadForm, subArea: e.target.value })} 
                                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium" 
                                    />
                                  </div>
                                  <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Private Location (House #, Khasra #)</label>
                                    <input 
                                      type="text" 
                                      value={editLeadForm.exactLocation} 
                                      onChange={(e) => setEditLeadForm({ ...editLeadForm, exactLocation: e.target.value })} 
                                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium" 
                                    />
                                  </div>
                                  <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Description / Notes</label>
                                    <textarea 
                                      rows="2" 
                                      value={editLeadForm.notes} 
                                      onChange={(e) => setEditLeadForm({ ...editLeadForm, notes: e.target.value })} 
                                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium" 
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-1">
                                  <button type="button" onClick={() => setEditingLeadId(null)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 cursor-pointer">Cancel</button>
                                  <button type="submit" className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer">Save Changes</button>
                                </div>
                              </form>
                            )}

                            {/* Action Row */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                              <div className="flex items-center gap-2">
                                <a
                                  href={`https://wa.me/${cleanLeadPhone}?text=${encodeURIComponent(`Hello ${lead.name}, I am contacting you from Gurdaspur Property Consultants regarding your ${lead.size || ''} ${lead.category || 'property'} on ${lead.locality}.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
                                  <span>WhatsApp Owner ({lead.phone})</span>
                                </a>

                                <a
                                  href={`tel:${lead.phone}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                                >
                                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                                  <span>Call</span>
                                </a>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditLead(lead)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-bold text-xs transition-colors cursor-pointer"
                                  title="Edit lead details"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleConvertLeadToProperty(lead)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-[#005ca8] hover:bg-blue-100 border border-blue-200 font-bold text-xs transition-colors cursor-pointer"
                                  title="Add to website without customer phone or private house number"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ Publish to Website</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-bold text-xs transition-colors cursor-pointer"
                                  title="Permanently delete this lead"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Lead</span>
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: STAFF ID BADGE & VISITING CARDS */}
              {activeTab === 'id_cards' && (
                <div>
                  <ExecutiveIdCardKit settings={settings} />
                </div>
              )}

              {/* TAB 3: PORTAL SETTINGS */}
              {activeTab === 'settings' && (
                <div className="max-w-xl">
                  <h3 className="font-bold text-sm text-slate-800 mb-1">Consultant & Contact Information</h3>
                  <p className="text-xs text-slate-400 mb-4">Update WhatsApp number and agency contact details</p>

                  <form onSubmit={handleSaveSettings} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                        Agency / Consultant Name
                      </label>
                      <input
                        type="text"
                        value={settingsForm.consultantName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, consultantName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                          WhatsApp Number (with country code, e.g. 919888812345)
                        </label>
                        <input
                          type="text"
                          value={settingsForm.whatsappNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                          Calling Phone Number (Display)
                        </label>
                        <input
                          type="text"
                          value={settingsForm.primaryPhone}
                          onChange={(e) => setSettingsForm({ ...settingsForm, primaryPhone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                        Gurdaspur Office Address
                      </label>
                      <input
                        type="text"
                        value={settingsForm.officeAddress}
                        onChange={(e) => setSettingsForm({ ...settingsForm, officeAddress: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={settingsForm.email}
                          onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                          Master Admin PIN Code
                        </label>
                        <input
                          type="text"
                          value={settingsForm.adminPin}
                          onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800"
                        />
                        <span className="text-[10px] text-slate-400 block mt-1">Default: 4051# (Owner master control)</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <label className="block text-xs font-bold uppercase text-emerald-800 mb-1 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Field Surveyor PIN Code (Door-to-Door Staff)</span>
                      </label>
                      <input
                        type="text"
                        value={settingsForm.surveyorPin || '2026#'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, surveyorPin: e.target.value })}
                        className="w-full max-w-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800"
                      />
                      <p className="text-[11px] text-slate-500 mt-1.5">
                        Give this PIN to your field executive. It unlocks only the mobile survey form with GPS proof and camera uploads, keeping your financial settings and live website listings protected.
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        Save Settings
                      </button>

                      {settingsSaved && (
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Saved successfully!
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={handleResetData}
                        className="text-xs text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCcw className="w-3.5 h-3.5" />
                        Reset All Demo Data
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
