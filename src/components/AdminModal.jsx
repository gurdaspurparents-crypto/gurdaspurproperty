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
  Tag
} from 'lucide-react';
import { 
  getLeads, 
  deleteLead, 
  saveProperties, 
  saveSettings, 
  resetToDefault 
} from '../utils/storage';
import { GURDASPUR_LOCALITIES } from '../data/initialProperties';

export default function AdminModal({ 
  isOpen, 
  onClose, 
  properties, 
  setProperties, 
  settings, 
  setSettings 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'leads' | 'settings'
  const [leads, setLeads] = useState([]);

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
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === settings.adminPin || pinInput === '1234') {
      setIsAuthenticated(true);
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
      badge: prop.badge || 'Hot Deal',
      verified: prop.verified !== false,
      facing: prop.facing || 'East'
    });
    setShowPropertyForm(true);
  };

  const handleSaveProperty = (e) => {
    e.preventDefault();
    const amenitiesArray = propForm.amenities.split(',').map(a => a.trim()).filter(Boolean);
    const numericPrice = parseFloat(propForm.price) || 0;
    const numericSize = parseFloat(propForm.size) || 0;
    const numericSqft = parseFloat(propForm.sqft) || (propForm.unit === 'Marla' ? numericSize * 225 : numericSize * 5445);

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
            images: [propForm.imageUrl]
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
        images: [propForm.imageUrl],
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

  const handleDeleteLead = (id) => {
    deleteLead(id);
    setLeads(getLeads());
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
        <div className="bg-slate-900 text-white px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-['Outfit']">Gurdaspur Property Portal Admin</h2>
              <p className="text-[11px] text-slate-400">Manage listings, WhatsApp leads & settings</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {!isAuthenticated ? (
            <div className="max-w-xs mx-auto py-12 text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-700">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] mb-1">
                Admin Authentication
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Enter your 4-digit security PIN (Default: <strong>1234</strong>)
              </p>

              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="password"
                  maxLength="6"
                  autoFocus
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN code"
                  className="w-full text-center text-2xl tracking-widest font-mono font-bold bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 text-slate-800 focus:outline-none focus:border-emerald-600"
                />

                {pinError && (
                  <p className="text-xs text-red-500 font-medium">
                    Incorrect PIN. Try default: 1234
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Unlock Admin Dashboard
                </button>
              </form>
            </div>
          ) : (
            <div>
              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 pb-3 mb-6 gap-2">
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
                  onClick={() => setActiveTab('leads')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'leads' 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Seller Leads ({leads.length})
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
                          imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
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

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Image URL</label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={propForm.imageUrl}
                            onChange={(e) => setPropForm({ ...propForm, imageUrl: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
                          />
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

              {/* TAB 2: SELLER LEADS */}
              {activeTab === 'leads' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">Customer & Seller Leads</h3>
                      <p className="text-xs text-slate-400">People who posted property or requested site visits</p>
                    </div>
                  </div>

                  {leads.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      No leads received yet. As soon as a user submits the "Post Property" form, it will appear here.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {leads.map(lead => {
                        const cleanLeadPhone = lead.phone?.replace(/[^0-9]/g, '');
                        return (
                          <div key={lead.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900">{lead.name}</span>
                                <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                                  {lead.type || 'Seller Lead'}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">{lead.id}</span>
                              </div>

                              <div className="text-xs text-slate-600 mt-1">
                                <strong>Phone:</strong> {lead.phone} • <strong>Location:</strong> {lead.locality || lead.location || 'Gurdaspur'} • <strong>Size:</strong> {lead.size || 'N/A'} • <strong>Price:</strong> {lead.price || 'N/A'}
                              </div>

                              {lead.notes && (
                                <p className="text-xs text-slate-500 italic mt-1">"{lead.notes}"</p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={`https://wa.me/${cleanLeadPhone}?text=Hello%20${encodeURIComponent(lead.name)},%20I%20saw%20your%20property%20listing%20on%20GurdaspurProperty.in`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
                                WhatsApp
                              </a>

                              <a
                                href={`tel:${lead.phone}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                Call
                              </a>

                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
                          Admin PIN Code
                        </label>
                        <input
                          type="text"
                          value={settingsForm.adminPin}
                          onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                        />
                      </div>
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
