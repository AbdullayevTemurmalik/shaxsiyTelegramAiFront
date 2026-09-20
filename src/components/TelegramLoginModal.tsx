import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Lock,
  Key,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import apiClient from '../api/client';
import { PhoneInputWithCountry, Country, COUNTRIES } from './PhoneInputWithCountry';

interface TelegramLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Strict Uzbekistan Phone Formatter (+998 (XX) XXX-XX-XX)
export const formatUzbekPhone = (
  input: string
): { formatted: string; rawPhone: string; isValid: boolean } => {
  let digits = input.replace(/\D/g, '');

  // If user starts typing phone number without 998 prefix
  if (digits.length > 0 && !digits.startsWith('998')) {
    digits = '998' + digits;
  }

  // Cap at 12 digits: 998 (3) + subscriber (9)
  digits = digits.slice(0, 12);

  const rest = digits.slice(3); // 9 digits
  let formatted = '+998';

  if (rest.length > 0) {
    formatted += ` (${rest.slice(0, 2)}`;
  }
  if (rest.length >= 2) {
    formatted += ')';
  }
  if (rest.length > 2) {
    formatted += ` ${rest.slice(2, 5)}`;
  }
  if (rest.length > 5) {
    formatted += `-${rest.slice(5, 7)}`;
  }
  if (rest.length > 7) {
    formatted += `-${rest.slice(7, 9)}`;
  }

  const isValid = digits.length === 12;
  const rawPhone = digits.length >= 3 ? `+${digits}` : '';

  return { formatted, rawPhone, isValid };
};

export const TelegramLoginModal: React.FC<TelegramLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [apiId, setApiId] = useState('');
  const [apiHash, setApiHash] = useState('');
  const [phoneDisplay, setPhoneDisplay] = useState('+998 ');
  const [rawPhoneNumber, setRawPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    return COUNTRIES.find((c) => c.code === 'UZ') || COUNTRIES[0];
  });

  // Step 2 states
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneCodeHash, setPhoneCodeHash] = useState('');
  const [tempSessionString, setTempSessionString] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [needs2FA, setNeeds2FA] = useState(false);

  // Countdown timer for resend
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            setCanResend(true);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  // Step 1: Send confirmation code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedApiId = parseInt(apiId.trim(), 10);
    if (isNaN(parsedApiId)) {
      setError("API ID butun son (raqam) bo'lishi shart.");
      return;
    }

    if (!apiHash.trim()) {
      setError('API Hash maydonini to\'ldiring.');
      return;
    }

    if (!isPhoneValid || !rawPhoneNumber) {
      setError(`Iltimos, to'liq ${selectedCountry.name} telefon raqamini kiriting.`);
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.sendCode(parsedApiId, apiHash.trim(), rawPhoneNumber.trim());
      if (res.success && res.data?.phoneCodeHash) {
        setPhoneCodeHash(res.data.phoneCodeHash);
        if (res.data.tempSessionString) {
          setTempSessionString(res.data.tempSessionString);
        }
        setStep(2);
        setCountdown(60);
        setCanResend(false);
      } else {
        setError(res.message || 'Kodni yuborishda xatolik yuz berdi.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Tarmoq xatoligi yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Sign in with code / 2FA
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = phoneCode.trim();
    if (!cleanCode) {
      setError('Telegram yuborgan tasdiqlash kodini kiriting.');
      return;
    }

    if (needs2FA && !password.trim()) {
      setError('Ikki bosqichli autentifikatsiya (2FA) parolini kiriting.');
      return;
    }

    const parsedApiId = parseInt(apiId.trim(), 10);

    setLoading(true);
    try {
      const res = await apiClient.signIn(
        rawPhoneNumber.trim(),
        cleanCode,
        phoneCodeHash,
        password ? password.trim() : undefined,
        !isNaN(parsedApiId) ? parsedApiId : undefined,
        apiHash.trim() || undefined,
        tempSessionString || undefined
      );

      if (res.needs2FA) {
        setNeeds2FA(true);
        setError(res.message || 'Akkauntingizda 2FA (Облачный пароль) yoqilgan. Parolni kiriting.');
      } else if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.message || 'Kirishda xatolik.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Xatolik yuz berdi.';
      if (msg.includes('SESSION_PASSWORD_NEEDED')) {
        setNeeds2FA(true);
        setError('Akkauntingizda 2FA (Облачный пароль) mavjud. Parolni kiriting.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#0B111E]/98 border border-slate-700/80 rounded-2xl shadow-2xl shadow-sky-950/40 overflow-y-auto max-h-[94vh]">
        {/* Glow ambient highlight */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0B111E]/95 backdrop-blur-md px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 shrink-0">
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center space-x-1.5 sm:space-x-2 truncate">
                <span className="truncate">{step === 1 ? 'Telegramga Ulanish' : 'Kodni Tasdiqlash'}</span>
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                  {step === 1 ? '1/2' : '2/2'}
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                {step === 1
                  ? 'MTProto orqali sessiyani faollashtirish'
                  : 'Xavfsiz sessiya kalitini yaratish'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative p-4 sm:p-6 space-y-4">
          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start space-x-3 text-rose-400 text-xs animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              {/* Telegram Developer Info Banner */}
              <div className="p-3.5 rounded-xl bg-sky-500/5 border border-sky-500/20 text-xs text-slate-300 flex items-start space-x-3">
                <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span>
                    Telegram <strong>api_id</strong> va <strong>api_hash</strong> ni olish uchun rasmiy{' '}
                  </span>
                  <a
                    href="https://my.telegram.org"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 font-semibold hover:underline inline-flex items-center gap-0.5"
                  >
                    my.telegram.org
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span> saytida akkauntingiz bilan kiring.</span>
                </div>
              </div>

              {/* API ID input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Telegram API ID <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Masalan: 29384751"
                    value={apiId}
                    onChange={(e) => setApiId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition"
                  />
                </div>
              </div>

              {/* API Hash input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Telegram API Hash <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Masalan: 3fa98e21a812..."
                    value={apiHash}
                    onChange={(e) => setApiHash(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition"
                  />
                </div>
              </div>

              {/* International Phone Number Input with Country Selector & iPhone Underline Mask */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    Telefon Raqamingiz <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Davlat: <span className="font-medium text-sky-400">{selectedCountry.flag} {selectedCountry.name}</span>
                  </span>
                </div>

                <PhoneInputWithCountry
                  value={rawPhoneNumber}
                  onChange={(fullPhone, valid, formatted, country) => {
                    setRawPhoneNumber(fullPhone);
                    setIsPhoneValid(valid);
                    setPhoneDisplay(formatted);
                    setSelectedCountry(country);
                  }}
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isPhoneValid || !apiId.trim() || !apiHash.trim()}
                className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center space-x-2 transform active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Kod yuborilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Tasdiqlash Kodini Olish</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Phone info card */}
              <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl select-none">{selectedCountry.flag}</span>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Kodi yuborilgan raqam:</span>
                    <span className="font-mono font-bold text-white text-sm">{phoneDisplay}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError(null);
                  }}
                  className="text-xs text-sky-400 hover:underline font-medium"
                >
                  O'zgartirish
                </button>
              </div>

              {/* SMS / Telegram Code Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Telegram ilovasiga kelgan kod <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={10}
                    placeholder="1 2 3 4 5"
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full py-3 px-4 bg-slate-950/90 border border-slate-700 rounded-xl text-center text-xl font-mono font-bold tracking-[0.5em] text-sky-400 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/25 transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-center">
                  Telegram xizmat xabarnomasi yoki SMS orqali yuborilgan 5 xonali raqamli kod
                </p>
              </div>

              {/* 2FA Password Input if requested */}
              {needs2FA && (
                <div className="space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-amber-400 flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>2FA Ikki Bosqichli Parol</span>
                    </label>
                    <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      Majburiy
                    </span>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-amber-400/70" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Akkauntingiz bulut paroli"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-amber-500/40 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* 2FA Help & Instructions Card */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-200/90 leading-relaxed space-y-1.5">
                    <p className="font-bold text-amber-300 flex items-center gap-1">
                      <span>💡 2FA nima va agar parolni bilmasangiz nima qilish kerak?</span>
                    </p>
                    <p className="text-slate-300">
                      Bu Telegram ilovangizdagi <b>"Облачный пароль" (Bulutli parol)</b>. Telegram xavfsizlik protokoli uni talab qiladi.
                    </p>
                    <p className="text-slate-300">
                      👉 <b>Agar parolni unutgan bo'lsangiz yoki o'rnatmaganman deb o'ylasangiz:</b>
                      <br />
                      Telefoningizdagi Telegram ilovasiga kiring:
                      <br />
                      <span className="font-medium text-amber-300">Sozlamalar (Настройки) → Maxfiylik va xavfsizlik (Конфиденциальность) → Ikki bosqichli tasdiqlash (Облачный пароль)</span> bo'limiga o'tib, parolni <b>o'chirib qo'yishingiz (Отключить)</b> yoki tiklashingiz mumkin. O'chirgandan so'ng bu yerda parol so'ralmaydi.
                    </p>
                  </div>
                </div>
              )}

              {/* Resend Code info */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError(null);
                  }}
                  className="flex items-center space-x-1 text-slate-400 hover:text-white transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Orqaga qaytish</span>
                </button>

                {canResend ? (
                  <button
                    type="button"
                    onClick={(e) => handleSendCode(e)}
                    className="flex items-center space-x-1 text-sky-400 hover:underline font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Kodni qayta yuborish</span>
                  </button>
                ) : (
                  <span className="text-slate-500 font-mono">
                    Qayta yuborish: {countdown}s
                  </span>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs sm:text-sm font-semibold rounded-xl transition"
                >
                  Bekor qilish
                </button>

                <button
                  type="submit"
                  disabled={loading || !phoneCode.trim()}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 transform active:scale-95"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Ulanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Kirishni Yakunlash</span>
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
};

export default TelegramLoginModal;
