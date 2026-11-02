import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Phone, 
  PlusCircle, 
  ShieldCheck, 
  Calculator, 
  Menu, 
  X, 
  MapPin, 
  Lock, 
  Globe2, 
  FileCheck2, 
  TrendingUp, 
  Sparkles,
  Headphones,
  User,
  ChevronDown,
  LogOut,
  Smartphone,
  CheckCircle2,
  KeyRound,
  ShieldAlert,
  Home,
  Share2
} from 'lucide-react';
import { GURDASPUR_LOCALITIES } from '../data/initialProperties';

export default function Navbar({ 
  settings, 
  onOpenPostProperty, 
  onOpenCalculator, 
  onOpenStampDuty, 
  onOpenAdmin, 
  activeFilter, 
  setActiveFilter,
  selectedLocality,
  setSelectedLocality,
  customerUser,
  onOpenCustomerLogin,
  onLogoutCustomer,
  onOpenCustomerDashboard
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#071c35] text-white border-b border-slate-800 shadow-xl">
      
      {/* Top Subtle Luxury Line */}
      <div className="h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-teal-400/20 w-full"></div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3">
          
          {/* Left: Brand Logo & City Selector Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group shrink-0">
              <img 
                src="/logo.svg" 
                alt="Gurdaspur Property" 
                className="h-12 sm:h-14 w-auto object-contain brightness-110 group-hover:scale-105 transition-transform drop-shadow-[0_2px_8px_rgba(16,185,129,0.2)]" 
              />
            </a>

            {/* City Dropdown (Exact 99acres style: "Gurdaspur ▾") */}
            <div className="relative hidden md:block shrink-0">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{selectedLocality && selectedLocality !== "All Localities" ? selectedLocality : "Gurdaspur"}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {cityDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-900 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-1.5 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 flex items-center justify-between">
                    <span>Localities in Gurdaspur</span>
                    <span className="text-emerald-700 font-bold">{GURDASPUR_LOCALITIES.length}</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {GURDASPUR_LOCALITIES.map((loc) => {
                      const isCurrent = selectedLocality === loc;
                      return (
                        <button
                          key={loc}
                          onClick={() => {
                            if (setSelectedLocality) setSelectedLocality(loc);
                            setCityDropdownOpen(false);
                            const el = document.getElementById('listings');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                            isCurrent
                              ? 'bg-emerald-50 text-emerald-800 font-bold'
                              : 'hover:bg-slate-50 hover:text-emerald-700 text-slate-700'
                          }`}
                        >
                          <span>{loc}</span>
                          {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Center Links (99acres-Style: For Buyers | For Tenants | For Owners | NRI Desk | Insights) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-medium text-slate-300 shrink min-w-0">
            
            <button
              onClick={() => {
                setActiveFilter("all");
                const el = document.getElementById('listings');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'text-white bg-white/10 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              For Buyers
            </button>

            <button
              onClick={() => {
                setActiveFilter("rent");
                const el = document.getElementById('listings');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'rent'
                  ? 'text-white bg-white/10 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              For Tenants
            </button>

            <button
              onClick={onOpenPostProperty}
              className="px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer whitespace-nowrap"
            >
              For Owners
            </button>

            {/* Land Converter (visible on xl screens to maintain clean spacing) */}
            <button
              onClick={onOpenCalculator}
              className="hidden xl:flex px-3 py-1.5 rounded-full text-slate-300 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>Land Converter</span>
            </button>

            <a
              href="#nri-desk"
              className="px-3 py-1.5 rounded-full text-slate-300 hover:text-teal-300 hover:bg-teal-500/10 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Globe2 className="w-3.5 h-3.5 text-teal-400" />
              <span>NRI Desk</span>
            </a>

          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Highlighted "Post Property FREE" Glowing Button */}
            <button
              onClick={onOpenPostProperty}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 border-2 border-emerald-300 ring-2 ring-emerald-400/30 hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              title="Post Your Property (100% Free)"
            >
              <PlusCircle className="w-4 h-4 text-slate-950 shrink-0" />
              <span>Post Property</span>
              <span className="bg-slate-950 text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse tracking-wider">
                FREE
              </span>
            </button>

            {/* Support / Customer Helpline (Headphone icon) */}
            <a
              href={`tel:${settings.primaryPhone}`}
              title={`Customer Helpline: ${settings.primaryPhone}`}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Headphones className="w-4 h-4" />
            </a>

            {/* Differentiated User / Customer & Admin Dropdown */}
            <div className="relative shrink-0" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                title={customerUser?.phone ? `Logged in: +91 ${customerUser.phone}` : "Account & Staff Login"}
                className={`p-2 sm:px-3 sm:py-1.5 rounded-full text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer border ${
                  customerUser?.phone
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-md shadow-emerald-950/50'
                    : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700/80'
                }`}
              >
                <div className="relative">
                  <User className={`w-4 h-4 ${customerUser?.phone ? 'text-emerald-400' : 'text-slate-300'}`} />
                  {customerUser?.phone && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#071c35] animate-pulse"></span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold">
                  {customerUser?.phone ? `+91 ${customerUser.phone.slice(-5)}` : 'Login'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-84 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 text-slate-900 text-left animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-slate-100">
                  {customerUser?.phone ? (
                    /* Customer Already Logged In */
                    <>
                      <div className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                            {customerUser.name ? customerUser.name.charAt(0).toUpperCase() : 'O'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-extrabold text-sm text-slate-900 truncate">
                              {customerUser.name || 'Property Owner'}
                            </div>
                            <div className="text-xs text-slate-500 font-mono">
                              +91 {customerUser.phone}
                            </div>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              OTP Verified Customer
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            if (onOpenCustomerDashboard) onOpenCustomerDashboard();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-2 transition-colors cursor-pointer border border-emerald-200/60"
                        >
                          <Home className="w-4 h-4 text-emerald-600" />
                          <span>📋 My Properties &amp; Status</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenPostProperty();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4 text-emerald-600" />
                          <span>+ Post Another Property (Free)</span>
                        </button>

                        <button
                          onClick={() => {
                            const link = `https://gurdaspurproperty.in/#post`;
                            navigator.clipboard.writeText(link);
                            alert(`✅ Direct Link Copied!\n\n${link}\n\nAap ise WhatsApp par kisi bhi property owner ko bhej sakte hain. Link kholte hi unka form khul jayega.`);
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-teal-800 bg-teal-50/70 hover:bg-teal-100 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Share2 className="w-4 h-4 text-teal-600" />
                          <span>📲 Copy Seller Share Link</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            if (onLogoutCustomer) onLogoutCustomer();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-600" />
                          <span>Logout Customer Account</span>
                        </button>
                      </div>

                      {/* Staff & Admin Section */}
                      <div className="p-2 pt-2.5">
                        <div className="px-3 pb-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                          Staff &amp; Office Access
                        </div>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenAdmin();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-slate-500" />
                            <span>Staff Survey / Admin PIN Portal</span>
                          </span>
                          <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                            PIN
                          </span>
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Not Logged In: Distinct Customer vs Staff Login Options */
                    <>
                      <div className="px-4 py-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Choose Login Type
                      </div>

                      {/* Option 1: Customer / Owner OTP Login */}
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            if (onOpenCustomerLogin) onOpenCustomerLogin();
                          }}
                          className="w-full text-left p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                              <Smartphone className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                                  Customer / Owner Login
                                </span>
                                <span className="text-[9px] font-black uppercase bg-emerald-600 text-white px-1.5 py-0.2 rounded-full">
                                  OTP
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">
                                Login with mobile number to post property for free &amp; get direct buyers.
                              </p>
                              <span className="inline-block mt-1.5 text-[11px] font-extrabold text-emerald-700 group-hover:underline">
                                Login with Mobile &amp; OTP ➔
                              </span>
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* Option 2: Employee / Field Staff / Admin PIN Login */}
                      <div className="p-2 pt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenAdmin();
                          }}
                          className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                              <Lock className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                                  Staff &amp; Master Admin
                                </span>
                                <span className="text-[9px] font-black uppercase bg-slate-800 text-slate-200 px-1.5 py-0.2 rounded-full">
                                  PIN
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">
                                Field Executive door surveys (2026#) and Owner Master Control (4051#).
                              </p>
                              <span className="inline-block mt-1.5 text-[11px] font-extrabold text-slate-800 group-hover:underline">
                                Enter Staff / Owner PIN ➔
                              </span>
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* Option 3: Quick Share Listing Link with Seller / Client */}
                      <div className="p-2 pt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            const link = `https://gurdaspurproperty.in/#post`;
                            navigator.clipboard.writeText(link);
                            alert(`✅ Direct Link Copied!\n\n${link}\n\nAap ise WhatsApp par kisi bhi property owner ko bhej sakte hain. Link open karte hi unka property form khul jayega.`);
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left p-2.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-950 border border-emerald-200 transition-all flex items-center justify-between text-xs font-bold cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-emerald-600" />
                            <span>Share Post Link with Owner</span>
                          </span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-extrabold">
                            Copy Link
                          </span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-200 hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#071c35] px-4 pt-4 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Highlighted Mobile Post Property Button */}
          <button
            onClick={() => { onOpenPostProperty(); setMobileMenuOpen(false); }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-between border-2 border-emerald-300 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-slate-950" />
              <span>Post Your Property (Free)</span>
            </span>
            <span className="bg-slate-950 text-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full animate-pulse">
              FREE
            </span>
          </button>

          {/* Customer Logged In Status Banner in Mobile Menu */}
          {customerUser?.phone ? (
            <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-600/50 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                    Customer Logged In
                  </span>
                  <span className="text-xs font-bold text-white">
                    +91 {customerUser.phone} {customerUser.name ? `(${customerUser.name})` : ''}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (onLogoutCustomer) onLogoutCustomer();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold"
                >
                  Logout
                </button>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenCustomerDashboard) onOpenCustomerDashboard();
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>📋 View My Properties &amp; Status</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (onOpenCustomerLogin) onOpenCustomerLogin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Customer Login (Mobile + OTP)</span>
              </span>
              <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-black">
                OTP
              </span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            <button
              onClick={() => { setActiveFilter("all"); setMobileMenuOpen(false); const el = document.getElementById('listings'); if(el) el.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-left px-3 py-2.5 rounded-xl bg-slate-900 font-bold text-xs text-white border border-slate-800"
            >
              🏢 For Buyers
            </button>
            <button
              onClick={() => { setActiveFilter("rent"); setMobileMenuOpen(false); const el = document.getElementById('listings'); if(el) el.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-left px-3 py-2.5 rounded-xl bg-slate-900 font-bold text-xs text-white border border-slate-800"
            >
              🔑 For Tenants
            </button>
            <button
              onClick={() => { onOpenPostProperty(); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2.5 rounded-xl bg-slate-900 font-bold text-xs text-white border border-slate-800"
            >
              📝 For Owners
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); const el = document.getElementById('nri-desk'); if(el) el.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-left px-3 py-2.5 rounded-xl bg-slate-900 font-bold text-xs text-white border border-slate-800"
            >
              ✈️ NRI Desk
            </button>
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => { onOpenStampDuty(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-blue-950 text-blue-200 font-bold text-xs border border-blue-800"
            >
              <span>Punjab Registry &amp; Stamp Duty (2026)</span>
              <span>→</span>
            </button>

            <button
              onClick={() => { onOpenCalculator(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-950 text-amber-200 font-bold text-xs border border-amber-800"
            >
              <span>Marla / Kanal Land Converter</span>
              <span>→</span>
            </button>

            <div className="pt-3 flex justify-between items-center text-xs text-slate-400 border-t border-slate-800">
              <a href={`tel:${settings.primaryPhone}`} className="text-white font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                {settings.primaryPhone}
              </a>
              <button
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                className="text-emerald-300 hover:text-white font-bold flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-900 border border-emerald-600/50 shadow-xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Field Staff &amp; Admin PIN</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
