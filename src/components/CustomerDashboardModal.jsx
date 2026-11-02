import React, { useState, useEffect } from 'react';
import { 
  X, 
  Home, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  PlusCircle, 
  MessageCircle, 
  Phone, 
  ShieldCheck, 
  RefreshCw, 
  LogOut,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { getLeads, getProperties, syncCloudData } from '../utils/storage';

export default function CustomerDashboardModal({
  isOpen,
  onClose,
  customerUser,
  onOpenPostProperty,
  onLogout,
  settings,
  onSelectProperty
}) {
  const [userLeads, setUserLeads] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCustomerProperties = async () => {
    if (!customerUser?.phone) return;
    setIsRefreshing(true);
    
    // Sync latest from cloud first
    try {
      await syncCloudData();
    } catch (e) {}

    const cleanUserPhone = customerUser.phone.replace(/[^0-9]/g, '').slice(-10);
    const allLeads = getLeads();
    const allLiveProps = getProperties();

    // Match leads by customer phone number
    const matched = allLeads.filter(l => {
      const leadPhone = (l.phone || '').replace(/[^0-9]/g, '').slice(-10);
      return leadPhone === cleanUserPhone;
    }).map(lead => {
      // Check if lead was approved and exists in live properties
      const isLive = lead.surveyStatus === 'approved' || lead.status === 'approved' ||
        allLiveProps.some(p => p.id === lead.id || (p.title === lead.title && p.price === lead.price));
      
      const liveProp = allLiveProps.find(p => p.id === lead.id || (p.title === lead.title && p.price === lead.price));

      return {
        ...lead,
        isLive,
        livePropertyId: liveProp?.id || null
      };
    });

    setUserLeads(matched);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (isOpen && customerUser?.phone) {
      fetchCustomerProperties();
    }
  }, [isOpen, customerUser]);

  if (!isOpen || !customerUser) return null;

  const cleanPhone = (settings?.whatsappNumber || '918146526257').replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-base">
              {customerUser.name ? customerUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white font-['Outfit']">
                  Customer Portal &amp; Property Status
                </h3>
                <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Logged in as: <strong>{customerUser.name || 'Property Owner'}</strong> (+91 {customerUser.phone})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="text-xs text-slate-600">
              You have submitted <strong>{userLeads.length}</strong> property listing{userLeads.length === 1 ? '' : 's'}.
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchCustomerProperties}
                disabled={isRefreshing}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh Status'}</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenPostProperty();
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Post New Property</span>
              </button>
            </div>
          </div>

          {/* Properties List */}
          {userLeads.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-3xl space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">No Properties Found Under +91 {customerUser.phone}</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  You haven't posted any property listings with this verified number yet, or your previous listing is being processed.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenPostProperty();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Your Property for Free</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userLeads.map((item, index) => {
                const isLive = item.isLive;
                return (
                  <div 
                    key={item.id || index}
                    className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-slate-300 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {item.id}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            {item.category || 'Residential'} • {item.purpose === 'sell' ? 'For Sale' : 'For Rent'}
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900 font-['Outfit'] mt-1">
                          {item.title || `${item.size || '10 Marla'} in ${item.locality || 'Gurdaspur'}`}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {item.locality || 'Gurdaspur'} {item.subArea ? `(${item.subArea})` : ''}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                          </span>
                        </div>
                      </div>

                      {/* Status Pill */}
                      <div className="sm:text-right shrink-0">
                        {isLive ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-black text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>APPROVED &amp; LIVE</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full font-black text-xs animate-pulse">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>UNDER OWNER REVIEW</span>
                          </div>
                        )}
                        <div className="text-xs font-extrabold text-slate-900 mt-1 font-mono">
                          Demand: ₹{item.price || 'Negotiable'}
                        </div>
                      </div>
                    </div>

                    {/* Status Description Box */}
                    <div className={`p-3 rounded-xl text-xs leading-relaxed flex items-start gap-2.5 ${
                      isLive 
                        ? 'bg-emerald-50/70 border border-emerald-200 text-emerald-900' 
                        : 'bg-amber-50/70 border border-amber-200 text-amber-900'
                    }`}>
                      {isLive ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Congratulations! Your listing is Live on www.gurdaspurproperty.in.</strong>
                            <p className="text-[11px] text-emerald-800 mt-0.5">
                              Genuine local &amp; NRI buyers in Gurdaspur can now view your property and contact our office directly for site inspections.
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Submitted &amp; Pending Owner Verification:</strong>
                            <p className="text-[11px] text-amber-800 mt-0.5">
                              Your property details have been received by the office. Our consultant is verifying revenue records / physical parameters before approving it live.
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Actions for this property */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <div className="text-[11px] text-slate-400">
                        {item.images?.length || 0} photos attached • {item.roadWidth || '30 Ft'} Road
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                            `Hello Gurdaspur Property, I am checking status of my property:\n• ID: ${item.id}\n• Title: ${item.title || item.size}\n• Demand: ₹${item.price}\nPlease expedite approval.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
                          <span>WhatsApp Status Query</span>
                        </a>

                        {isLive && item.livePropertyId && (
                          <button
                            onClick={() => {
                              onClose();
                              if (onSelectProperty) onSelectProperty(item.livePropertyId);
                            }}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View Live Card</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Bottom Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              if (onLogout) onLogout();
              onClose();
            }}
            className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Account</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
