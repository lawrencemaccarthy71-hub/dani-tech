import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, Loader2, AlertCircle, Timer } from 'lucide-react';
import { verifyPassword, setAdminSession, isAdminAuthenticated, isLockedOut, getLockoutRemainingMs } from './auth';

/**
 * AdminLoginPage — full-screen branded login screen for Dani Tech admin access.
 * Automatically redirects to /admin if a session already exists.
 */
export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [lockoutMs, setLockoutMs] = useState(() => getLockoutRemainingMs());

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutMs <= 0) return;
    const interval = setInterval(() => {
      const remaining = getLockoutRemainingMs();
      setLockoutMs(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutMs]);

  const lockoutMinutes = Math.ceil(lockoutMs / 60000);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || isLoading || isLockedOut()) return;

    setIsLoading(true);
    setError('');

    // Small delay to show loading state (also prevents timing attacks)
    await new Promise((r) => setTimeout(r, 600));

    const valid = await verifyPassword(password);

    if (valid) {
      setAdminSession();
      navigate('/admin', { replace: true });
    } else {
      setIsLoading(false);
      const remaining = getLockoutRemainingMs();
      if (remaining > 0) {
        setLockoutMs(remaining);
        setError(`Too many failed attempts. Locked for ${Math.ceil(remaining / 60000)} minute(s).`);
      } else {
        setError('Invalid credentials. Access denied.');
      }
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] flex flex-col items-center justify-center p-4">
      {/* Background glow orbs */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#0066ff]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-10 w-64 h-64 bg-[#ffb77d]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top brand bar */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0066ff] to-[#00dce6] p-[1.5px] shadow-lg flex items-center justify-center">
          <div className="w-full h-full bg-[#0e0e10] rounded-[9px] flex items-center justify-center">
            <span className="font-mono font-black text-sm text-[#00dce6] tracking-tighter">DT</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-['Geist',sans-serif] text-lg font-bold text-[#e5e1e4] tracking-tight">
            Dani Tech
          </span>
          <span className="text-[9px] font-mono text-[#8c90a1] -mt-0.5 tracking-wider uppercase">
            Admin Portal
          </span>
        </div>
      </div>

      {/* Login card with shake animation */}
      <div
        className={`w-full max-w-sm bg-[#1c1b1d] border border-[#424656]/40 rounded-2xl shadow-2xl overflow-hidden transition-all ${
          shake ? 'animate-[shake_0.5s_ease-in-out]' : ''
        }`}
        style={shake ? { animation: 'shake 0.5s ease-in-out' } : {}}
      >
        {/* Card header */}
        <div className="p-6 bg-[#201f21] border-b border-[#424656]/30 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#2a2a2c] border border-[#424656]/40 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-[#b3c5ff]" />
          </div>
          <h1 className="font-['Geist',sans-serif] text-xl font-semibold text-[#e5e1e4]">
            Staff Portal Access
          </h1>
          <p className="text-xs text-[#8c90a1] mt-1 font-mono">
            Dani Tech Hub — East Legon, Accra
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Lockout banner */}
            {lockoutMs > 0 && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
                <Timer className="w-4 h-4 shrink-0" />
                <span>Too many attempts. Try again in <strong>{lockoutMinutes} min</strong>.</span>
              </div>
            )}

            {/* Error banner */}
            {error && lockoutMs <= 0 && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Password field */}
            <div>
              <label className="block text-xs font-mono text-[#c2c6d8] uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  disabled={lockoutMs > 0}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder={lockoutMs > 0 ? 'Account temporarily locked…' : 'Enter admin password'}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#131315] border border-[#424656]/40 text-[#e5e1e4] text-sm focus:outline-none focus:border-[#0066ff] transition-colors font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c90a1] hover:text-[#c2c6d8] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !password || lockoutMs > 0}
              className="w-full py-3 rounded-xl bg-[#0066ff] hover:bg-[#0054d6] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate</span>
                </>
              )}
            </button>
          </form>

          {/* Security note */}
          <p className="text-[10px] text-[#424656] text-center mt-4 font-mono">
            Session expires after 2h inactivity or tab close • SHA-256 secured
          </p>
        </div>
      </div>

      {/* Back to store link */}
      <Link
        to="/"
        className="mt-8 flex items-center gap-1.5 text-xs text-[#8c90a1] hover:text-[#c2c6d8] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dani Tech Store</span>
      </Link>

      {/* Shake keyframe injected via style tag */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
};
