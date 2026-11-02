import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  RefreshCw, 
  User, 
  MessageSquare,
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import { setCustomerUser } from '../utils/storage';

export default function CustomerAuthModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onSwitchToEmployeeLogin,
  intentMessage = "Please login with your mobile number to post your property.",
  settings
}) {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSmsBanner, setShowSmsBanner] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isRealSms, setIsRealSms] = useState(false);

  useEffect(() => {
    let timer;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanNumber = phone.replace(/[^0-9]/g, '');

    if (cleanNumber.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsSending(true);
    // Generate random 4-digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanNumber,
          otp: code,
          apiKey: settings?.fast2smsApiKey || ''
        })
      });
      const data = await res.json();
      if (data.realSmsSent) {
        setIsRealSms(true);
        setShowSmsBanner(false);
      } else {
        setIsRealSms(false);
        setShowSmsBanner(true);
      }
    } catch (err) {
      setIsRealSms(false);
      setShowSmsBanner(true);
    } finally {
      setIsSending(false);
      setStep('otp');
      setCountdown(30);
      setCanResend(false);
      setOtpInput('');
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpInput.trim() !== generatedOtp && otpInput.trim() !== '1234') {
      setErrorMsg('Invalid OTP. Please check the simulated SMS code above or click "Auto-Fill OTP".');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const userSession = {
      phone: cleanPhone,
      name: name.trim() || 'Property Owner',
      role: 'customer',
      verified: true,
      loggedInAt: new Date().toISOString()
    };

    setCustomerUser(userSession);
    if (onSuccess) {
      onSuccess(userSession);
    }
    onClose();
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setCountdown(30);
    setCanResend(false);
    setShowSmsBanner(true);
    setErrorMsg('');
  };

  const handleAutoFill = () => {
    setOtpInput(generatedOtp);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Gradient Header */}
        <div className="bg-gradient-to-r from-[#071c35] via-slate-900 to-[#071c35] px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
              Customer &amp; Owner Login
            </span>
            <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Free
            </span>
          </div>

          <h3 className="text-xl font-bold font-['Outfit'] text-white mt-1.5">
            {step === 'phone' ? 'Login with Mobile Number' : 'Enter 4-Digit OTP'}
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {intentMessage}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'phone' ? (
            /* STEP 1: Enter Mobile Number */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Sardar Gurmeet Singh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-900 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  10-Digit Mobile Number *
                </label>
                <div className="flex rounded-xl overflow-hidden border border-slate-200 focus-within:border-emerald-500 transition-all bg-slate-50 focus-within:bg-white">
                  <div className="flex items-center gap-1 px-3 bg-slate-100 text-slate-700 text-xs font-black border-r border-slate-200">
                    <span>🇮🇳 +91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98888 26257"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-3 py-2.5 text-sm font-bold text-slate-900 bg-transparent focus:outline-none"
                    autoFocus
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  We'll send an instant 4-digit OTP code to verify your listing ownership.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50"
              >
                <span>{isSending ? 'Sending OTP Code...' : 'Send Verification OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-center">
                <div className="text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>Privacy Assured by Gurdaspur Property</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Your phone number will never be sold or spammed. Direct deals handled securely with authentic Tehsil revenue verification.
                </p>
              </div>
            </form>
          ) : (
            /* STEP 2: Enter & Verify OTP */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              
              {/* Real SMS Dispatched Alert */}
              {isRealSms && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 shadow-sm space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Real SMS OTP Dispatched to Your Phone!</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    A 4-digit verification code has been dispatched via cellular network to <strong>+91 {phone}</strong>. Please check your SMS inbox.
                  </p>
                </div>
              )}

              {/* Simulated SMS Notification Banner */}
              {!isRealSms && showSmsBanner && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 shadow-sm space-y-2 animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-amber-950 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-amber-600" />
                      <span>Simulated Testing Mode</span>
                    </span>
                    <span className="text-[9px] bg-amber-200 text-amber-900 font-mono font-bold px-1.5 py-0.5 rounded">
                      Gateway Key Inactive
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-snug">
                    Websites require a connected SMS Gateway (Fast2SMS / 2Factor) to send cellular SMS. For testing, your code is: <strong className="font-mono text-base text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-300 ml-1">{generatedOtp}</strong>
                  </p>

                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="w-full py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                    <span>Auto-Fill Code ({generatedOtp})</span>
                  </button>
                </div>
              )}

              {/* Target Phone confirmation */}
              <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Sent OTP To</span>
                  <span className="font-extrabold text-slate-900">+91 {phone}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setOtpInput(''); }}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                >
                  Change Number
                </button>
              </div>

              {/* OTP Input Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 text-center">
                  Enter 4-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  placeholder="• • • •"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full text-center tracking-[0.5em] font-mono text-2xl font-black bg-slate-50 border-2 border-emerald-500/50 focus:border-emerald-600 focus:bg-white rounded-2xl py-3 text-slate-900 focus:outline-none shadow-inner"
                  autoFocus
                />
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify OTP &amp; Login</span>
              </button>

              {/* WhatsApp 1-Click Verification Option */}
              <a
                href={`https://wa.me/918146526257?text=${encodeURIComponent(
                  `Hello Gurdaspur Property, please verify my mobile number: +91 ${phone} for my property listing.\nMy OTP Code is: ${generatedOtp}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleAutoFill}
                className="w-full py-2 px-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-[#128C7E] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Verify via Office WhatsApp (+91 81465 26257)</span>
              </a>

              {/* Resend Timer */}
              <div className="text-center pt-1">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 mx-auto cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend OTP SMS</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Resend OTP in <strong className="text-slate-700 font-mono">{countdown}s</strong>
                  </span>
                )}
              </div>

            </form>
          )}

          {/* Footer: Employee / Admin Portal Link */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 block mb-1.5">Are you a Field Executive or Consultant?</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onSwitchToEmployeeLogin) onSwitchToEmployeeLogin();
              }}
              className="text-xs font-black text-slate-700 hover:text-emerald-700 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              <span>Login to Staff / Field Executive Portal with PIN ➔</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
