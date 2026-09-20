import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ChevronDown,
  Search,
  Check,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface Country {
  code: string; // ISO 2-letter
  name: string; // O'zbekcha / International name
  dialCode: string; // e.g. '+998'
  flag: string; // Emoji flag
  mask: string; // Formatting mask using '#' for digit slots
  digitCount: number; // Number of digits in national number
  placeholderExample: string;
}

export const COUNTRIES: Country[] = [
  // --- Central Asia & CIS (Priority) ---
  {
    code: 'UZ',
    name: "O'zbekiston",
    dialCode: '+998',
    flag: '🇺🇿',
    mask: '(##) ###-##-##',
    digitCount: 9,
    placeholderExample: '90 123 45 67',
  },
  {
    code: 'RU',
    name: 'Rossiya',
    dialCode: '+7',
    flag: '🇷🇺',
    mask: '(###) ###-##-##',
    digitCount: 10,
    placeholderExample: '999 123 45 67',
  },
  {
    code: 'KZ',
    name: 'Qozogʻiston',
    dialCode: '+7',
    flag: '🇰🇿',
    mask: '(###) ###-##-##',
    digitCount: 10,
    placeholderExample: '701 123 45 67',
  },
  {
    code: 'KG',
    name: 'Qirgʻiziston',
    dialCode: '+996',
    flag: '🇰🇬',
    mask: '(###) ###-###',
    digitCount: 9,
    placeholderExample: '555 123 456',
  },
  {
    code: 'TJ',
    name: 'Tojikiston',
    dialCode: '+992',
    flag: '🇹🇯',
    mask: '(##) ###-####',
    digitCount: 9,
    placeholderExample: '92 123 4567',
  },
  {
    code: 'TM',
    name: 'Turkmaniston',
    dialCode: '+993',
    flag: '🇹🇲',
    mask: '(##) ###-###',
    digitCount: 8,
    placeholderExample: '65 123 456',
  },
  {
    code: 'AZ',
    name: 'Ozarbayjon',
    dialCode: '+994',
    flag: '🇦🇿',
    mask: '(##) ###-##-##',
    digitCount: 9,
    placeholderExample: '50 123 45 67',
  },
  {
    code: 'BY',
    name: 'Belarus',
    dialCode: '+375',
    flag: '🇧🇾',
    mask: '(##) ###-##-##',
    digitCount: 9,
    placeholderExample: '29 123 45 67',
  },
  {
    code: 'UA',
    name: 'Ukraina',
    dialCode: '+380',
    flag: '🇺🇦',
    mask: '(##) ###-##-##',
    digitCount: 9,
    placeholderExample: '50 123 45 67',
  },
  {
    code: 'GE',
    name: 'Gruziya',
    dialCode: '+995',
    flag: '🇬🇪',
    mask: '(###) ###-###',
    digitCount: 9,
    placeholderExample: '599 123 456',
  },
  {
    code: 'AM',
    name: 'Armaniston',
    dialCode: '+374',
    flag: '🇦🇲',
    mask: '(##) ###-###',
    digitCount: 8,
    placeholderExample: '91 123 456',
  },

  // --- Middle East & Gulf ---
  {
    code: 'AE',
    name: 'BAA / Dubay',
    dialCode: '+971',
    flag: '🇦🇪',
    mask: '(##) ###-####',
    digitCount: 9,
    placeholderExample: '50 123 4567',
  },
  {
    code: 'SA',
    name: 'Saudiya Arabistoni',
    dialCode: '+966',
    flag: '🇸🇦',
    mask: '(##) ###-####',
    digitCount: 9,
    placeholderExample: '50 123 4567',
  },
  {
    code: 'TR',
    name: 'Turkiya',
    dialCode: '+90',
    flag: '🇹🇷',
    mask: '(###) ###-####',
    digitCount: 10,
    placeholderExample: '532 123 4567',
  },
  {
    code: 'QA',
    name: 'Qatar',
    dialCode: '+974',
    flag: '🇶🇦',
    mask: '#### ####',
    digitCount: 8,
    placeholderExample: '3312 3456',
  },
  {
    code: 'KW',
    name: 'Quvayt',
    dialCode: '+965',
    flag: '🇰🇼',
    mask: '#### ####',
    digitCount: 8,
    placeholderExample: '9123 4567',
  },
  {
    code: 'OM',
    name: 'Ummon',
    dialCode: '+968',
    flag: '🇴🇲',
    mask: '#### ####',
    digitCount: 8,
    placeholderExample: '9123 4567',
  },
  {
    code: 'BH',
    name: 'Bahrayn',
    dialCode: '+973',
    flag: '🇧🇭',
    mask: '#### ####',
    digitCount: 8,
    placeholderExample: '3612 3456',
  },
  {
    code: 'JO',
    name: 'Iordaniya',
    dialCode: '+962',
    flag: '🇯🇴',
    mask: '(#) ####-####',
    digitCount: 9,
    placeholderExample: '7 9123 4567',
  },
  {
    code: 'EG',
    name: 'Misr',
    dialCode: '+20',
    flag: '🇪🇬',
    mask: '(###) ###-####',
    digitCount: 10,
    placeholderExample: '100 123 4567',
  },

  // --- North America & Europe ---
  {
    code: 'US',
    name: 'AQSH (USA)',
    dialCode: '+1',
    flag: '🇺🇸',
    mask: '(###) ###-####',
    digitCount: 10,
    placeholderExample: '202 555 0123',
  },
  {
    code: 'CA',
    name: 'Kanada',
    dialCode: '+1',
    flag: '🇨🇦',
    mask: '(###) ###-####',
    digitCount: 10,
    placeholderExample: '416 555 0123',
  },
  {
    code: 'GB',
    name: 'Buyuk Britaniya (UK)',
    dialCode: '+44',
    flag: '🇬🇧',
    mask: '(####) ######',
    digitCount: 10,
    placeholderExample: '7911 123456',
  },
  {
    code: 'DE',
    name: 'Germaniya',
    dialCode: '+49',
    flag: '🇩🇪',
    mask: '(###) #######',
    digitCount: 10,
    placeholderExample: '151 1234567',
  },
  {
    code: 'FR',
    name: 'Fransiya',
    dialCode: '+33',
    flag: '🇫🇷',
    mask: '(#) ##-##-##-##',
    digitCount: 9,
    placeholderExample: '6 12 34 56 78',
  },
  {
    code: 'IT',
    name: 'Italiya',
    dialCode: '+39',
    flag: '🇮🇹',
    mask: '(###) #######',
    digitCount: 10,
    placeholderExample: '320 1234567',
  },
  {
    code: 'ES',
    name: 'Ispaniya',
    dialCode: '+34',
    flag: '🇪🇸',
    mask: '### ### ###',
    digitCount: 9,
    placeholderExample: '612 345 678',
  },
  {
    code: 'PL',
    name: 'Polsha',
    dialCode: '+48',
    flag: '🇵🇱',
    mask: '### ### ###',
    digitCount: 9,
    placeholderExample: '512 345 678',
  },
  {
    code: 'CH',
    name: 'Shveysariya',
    dialCode: '+41',
    flag: '🇨🇭',
    mask: '(##) ###-####',
    digitCount: 9,
    placeholderExample: '79 123 4567',
  },
  {
    code: 'SE',
    name: 'Shvetsiya',
    dialCode: '+46',
    flag: '🇸🇪',
    mask: '(##) ###-####',
    digitCount: 9,
    placeholderExample: '70 123 4567',
  },
  {
    code: 'NL',
    name: 'Niderlandiya',
    dialCode: '+31',
    flag: '🇳🇱',
    mask: '(#) ########',
    digitCount: 9,
    placeholderExample: '6 12345678',
  },
  {
    code: 'AT',
    name: 'Avstriya',
    dialCode: '+43',
    flag: '🇦🇹',
    mask: '(###) #######',
    digitCount: 10,
    placeholderExample: '664 1234567',
  },
  {
    code: 'CZ',
    name: 'Chexiya',
    dialCode: '+420',
    flag: '🇨🇿',
    mask: '### ### ###',
    digitCount: 9,
    placeholderExample: '601 123 456',
  },
  {
    code: 'RO',
    name: 'Ruminiya',
    dialCode: '+40',
    flag: '🇷🇴',
    mask: '(###) ###-###',
    digitCount: 9,
    placeholderExample: '712 345 678',
  },
  {
    code: 'GR',
    name: 'Gretsiya',
    dialCode: '+30',
    flag: '🇬🇷',
    mask: '(###) #######',
    digitCount: 10,
    placeholderExample: '691 2345678',
  },
  {
    code: 'PT',
    name: 'Portugaliya',
    dialCode: '+351',
    flag: '🇵🇹',
    mask: '### ### ###',
    digitCount: 9,
    placeholderExample: '912 345 678',
  },
  {
    code: 'HU',
    name: 'Vengriya',
    dialCode: '+36',
    flag: '🇭🇺',
    mask: '(##) ###-###',
    digitCount: 9,
    placeholderExample: '20 123 456',
  },
  {
    code: 'FI',
    name: 'Finlyandiya',
    dialCode: '+358',
    flag: '🇫🇮',
    mask: '(###) ######',
    digitCount: 9,
    placeholderExample: '401 234567',
  },
  {
    code: 'NO',
    name: 'Norvegiya',
    dialCode: '+47',
    flag: '🇳🇴',
    mask: '### ## ###',
    digitCount: 8,
    placeholderExample: '412 34 567',
  },
  {
    code: 'DK',
    name: 'Daniya',
    dialCode: '+45',
    flag: '🇩🇰',
    mask: '## ## ## ##',
    digitCount: 8,
    placeholderExample: '21 34 56 78',
  },

  // --- Asia & Pacific ---
  {
    code: 'KR',
    name: 'Janubiy Koreya',
    dialCode: '+82',
    flag: '🇰🇷',
    mask: '(##) ####-####',
    digitCount: 10,
    placeholderExample: '10 1234 5678',
  },
  {
    code: 'CN',
    name: 'Xitoy',
    dialCode: '+86',
    flag: '🇨🇳',
    mask: '(###) ####-####',
    digitCount: 11,
    placeholderExample: '138 1234 5678',
  },
  {
    code: 'JP',
    name: 'Yaponiya',
    dialCode: '+81',
    flag: '🇯🇵',
    mask: '(##) ####-####',
    digitCount: 10,
    placeholderExample: '90 1234 5678',
  },
  {
    code: 'IN',
    name: 'Hindiston',
    dialCode: '+91',
    flag: '🇮🇳',
    mask: '(#####) #####',
    digitCount: 10,
    placeholderExample: '98123 45678',
  },
  {
    code: 'MY',
    name: 'Malayziya',
    dialCode: '+60',
    flag: '🇲🇾',
    mask: '(##) ####-####',
    digitCount: 10,
    placeholderExample: '12 3456 7890',
  },
  {
    code: 'SG',
    name: 'Singapur',
    dialCode: '+65',
    flag: '🇸🇬',
    mask: '#### ####',
    digitCount: 8,
    placeholderExample: '8123 4567',
  },
  {
    code: 'ID',
    name: 'Indoneziya',
    dialCode: '+62',
    flag: '🇮🇩',
    mask: '(###) ###-####',
    digitCount: 10,
    placeholderExample: '812 345 6789',
  },
  {
    code: 'PK',
    name: 'Pokiston',
    dialCode: '+92',
    flag: '🇵🇰',
    mask: '(###) #######',
    digitCount: 10,
    placeholderExample: '300 1234567',
  },
  {
    code: 'TH',
    name: 'Tailand',
    dialCode: '+66',
    flag: '🇹🇭',
    mask: '(##) ###-####',
    digitCount: 9,
    placeholderExample: '81 234 5678',
  },
  {
    code: 'VN',
    name: 'Vetnam',
    dialCode: '+84',
    flag: '🇻🇳',
    mask: '(###) ###-###',
    digitCount: 9,
    placeholderExample: '912 345 678',
  },
  {
    code: 'AU',
    name: 'Avstraliya',
    dialCode: '+61',
    flag: '🇦🇺',
    mask: '(###) ###-###',
    digitCount: 9,
    placeholderExample: '412 345 678',
  },

  // --- Latin America & Africa ---
  {
    code: 'BR',
    name: 'Braziliya',
    dialCode: '+55',
    flag: '🇧🇷',
    mask: '(##) #####-####',
    digitCount: 11,
    placeholderExample: '11 91234 5678',
  },
  {
    code: 'MX',
    name: 'Meksika',
    dialCode: '+52',
    flag: '🇲🇽',
    mask: '(###) ###-####',
    digitCount: 10,
    placeholderExample: '55 1234 5678',
  },
  {
    code: 'ZA',
    name: 'Janubiy Afrika',
    dialCode: '+27',
    flag: '🇿🇦',
    mask: '(##) ###-####',
    digitCount: 9,
    placeholderExample: '71 123 4567',
  },
];

export const POPULAR_COUNTRY_CODES = ['UZ', 'RU', 'AE', 'US', 'KZ', 'KG', 'TR', 'SA'];

export interface PhoneInputWithCountryProps {
  value?: string; // e.g. '+998901234567' or empty
  onChange: (
    fullPhoneNumber: string,
    isValid: boolean,
    formattedDisplay: string,
    country: Country
  ) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export const PhoneInputWithCountry: React.FC<PhoneInputWithCountryProps> = ({
  value = '',
  onChange,
  disabled = false,
  autoFocus = false,
  className,
}) => {
  // Default to Uzbekistan (UZ)
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    return COUNTRIES.find((c) => c.code === 'UZ') || COUNTRIES[0];
  });

  const [rawDigits, setRawDigits] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync initial incoming value if provided (e.g. "+998901234567")
  useEffect(() => {
    if (value && value.startsWith('+')) {
      // Find matching country by dialCode
      // Sort countries by dialCode length descending (+998 before +9)
      const sorted = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
      const match = sorted.find((c) => value.startsWith(c.dialCode));
      if (match) {
        setSelectedCountry(match);
        const nationalPart = value.slice(match.dialCode.length).replace(/\D/g, '');
        setRawDigits(nationalPart.slice(0, match.digitCount));
        return;
      }
    }
  }, []);

  // Filtered countries for dropdown
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return COUNTRIES;
    const q = searchQuery.toLowerCase().trim().replace(/^\+/, '');
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.replace('+', '').includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isDropdownOpen]);

  // Generate tokens for iPhone-style visual underline display
  const { tokens, formattedDisplay, isValid } = useMemo(() => {
    const mask = selectedCountry.mask;
    const digitCount = selectedCountry.digitCount;
    const digits = rawDigits;
    const valid = digits.length === digitCount;

    interface MaskToken {
      type: 'separator' | 'digit' | 'cursor' | 'placeholder';
      char: string;
      isCurrent?: boolean;
    }

    const resultTokens: MaskToken[] = [];
    let digitIdx = 0;
    let formattedText = '';

    for (let i = 0; i < mask.length; i++) {
      const maskChar = mask[i];
      if (maskChar === '#') {
        if (digitIdx < digits.length) {
          const char = digits[digitIdx];
          resultTokens.push({ type: 'digit', char });
          formattedText += char;
        } else if (digitIdx === digits.length && isFocused) {
          resultTokens.push({ type: 'cursor', char: '_', isCurrent: true });
          formattedText += '_';
        } else {
          resultTokens.push({ type: 'placeholder', char: '_' });
          formattedText += '_';
        }
        digitIdx++;
      } else {
        resultTokens.push({ type: 'separator', char: maskChar });
        formattedText += maskChar;
      }
    }

    const fullFormatted = `${selectedCountry.dialCode} ${formattedText}`;
    return { tokens: resultTokens, formattedDisplay: fullFormatted, isValid: valid };
  }, [selectedCountry, rawDigits, isFocused]);

  // Notify parent on changes
  useEffect(() => {
    const fullPhoneNumber = rawDigits ? `${selectedCountry.dialCode}${rawDigits}` : '';
    onChange(fullPhoneNumber, isValid, formattedDisplay, selectedCountry);
  }, [selectedCountry, rawDigits, isValid, formattedDisplay]);

  // Handle direct text input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    const cleanDigits = inputVal.replace(/\D/g, '').slice(0, selectedCountry.digitCount);
    setRawDigits(cleanDigits);
  };

  // Smart Paste Handler: detects international prefixes
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').trim();
    if (!pastedText) return;

    // Check if pasted string starts with a '+' or dial code
    const digitsOnly = pastedText.replace(/\D/g, '');
    const withPlus = pastedText.startsWith('+') ? pastedText : `+${digitsOnly}`;

    const sortedCountries = [...COUNTRIES].sort(
      (a, b) => b.dialCode.length - a.dialCode.length
    );
    const matchedCountry = sortedCountries.find((c) => withPlus.startsWith(c.dialCode));

    if (matchedCountry) {
      setSelectedCountry(matchedCountry);
      const rest = withPlus.slice(matchedCountry.dialCode.length).replace(/\D/g, '');
      setRawDigits(rest.slice(0, matchedCountry.digitCount));
    } else {
      // Just take digits up to current country's limit
      setRawDigits(digitsOnly.slice(0, selectedCountry.digitCount));
    }
  };

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchQuery('');
    // Trim digits if new country has smaller limit
    setRawDigits((prev) => prev.slice(0, country.digitCount));
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <div className={cn('relative w-full select-none', className)} ref={containerRef}>
      {/* Outer Glow Wrapper */}
      <div
        className={cn(
          'relative flex items-center bg-[#0B111E]/95 border rounded-2xl transition-all duration-200 overflow-hidden',
          isFocused
            ? isValid
              ? 'border-emerald-500/80 ring-2 ring-emerald-500/25 shadow-lg shadow-emerald-500/10'
              : 'border-sky-500/80 ring-2 ring-sky-500/30 shadow-lg shadow-sky-500/15'
            : isValid
            ? 'border-emerald-500/50 shadow-md shadow-emerald-950/20'
            : 'border-slate-800 hover:border-slate-700/90'
        )}
      >
        {/* Ambient glow accent inside card */}
        <div
          className={cn(
            'absolute -top-12 -left-12 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-opacity duration-300',
            isValid ? 'bg-emerald-500/15 opacity-100' : isFocused ? 'bg-sky-500/15 opacity-100' : 'opacity-0'
          )}
        />

        {/* 1. Country Selector Trigger Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className={cn(
            'relative z-10 flex items-center space-x-2 pl-3.5 pr-3 py-3 hover:bg-slate-800/60 active:bg-slate-800/80 transition-all border-r border-slate-800/90 shrink-0 group focus:outline-none',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          title="Davlatni o'zgartirish"
        >
          <span className="text-xl sm:text-2xl filter drop-shadow-sm select-none leading-none">
            {selectedCountry.flag}
          </span>
          <span className="font-mono text-xs sm:text-sm font-bold text-sky-400 group-hover:text-sky-300 transition-colors">
            {selectedCountry.dialCode}
          </span>
          <ChevronDown
            className={cn(
              'w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform duration-200',
              isDropdownOpen && 'rotate-180 text-sky-400'
            )}
          />
        </button>

        {/* 2. Visual Layer & Native Hidden Input Container */}
        <div
          className="relative flex-1 flex items-center min-w-0 px-3 py-3 cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Real Transparent Input for Keyboard, Mobile Keypad, Cursor, and Paste */}
          <input
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="tel"
            disabled={disabled}
            autoFocus={autoFocus}
            value={rawDigits}
            onChange={handleInputChange}
            onPaste={handlePaste}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={selectedCountry.digitCount}
            className="absolute inset-0 w-full h-full opacity-0 cursor-text z-20"
            aria-label="Telefon raqami"
          />

          {/* iPhone / Telegram Style Visual Underline Display */}
          <div className="flex items-center font-mono tracking-wider text-sm sm:text-base select-none pointer-events-none overflow-x-auto no-scrollbar py-0.5">
            {tokens.map((token, idx) => {
              if (token.type === 'digit') {
                return (
                  <span
                    key={idx}
                    className="text-white font-bold transition-all duration-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                  >
                    {token.char}
                  </span>
                );
              }
              if (token.type === 'separator') {
                return (
                  <span key={idx} className="text-slate-400/90 font-medium px-0.5 select-none">
                    {token.char}
                  </span>
                );
              }
              if (token.type === 'cursor') {
                return (
                  <span
                    key={idx}
                    className="text-sky-400 font-extrabold border-b-2 border-sky-400 animate-pulse px-0.5"
                  >
                    _
                  </span>
                );
              }
              return (
                <span
                  key={idx}
                  className="text-zinc-600 font-normal px-0.5 select-none opacity-80"
                >
                  _
                </span>
              );
            })}
          </div>
        </div>

        {/* 3. Validation Status Badge (Right Side) */}
        <div className="relative z-10 pr-3.5 pl-1 flex items-center shrink-0">
          {isValid ? (
            <div className="flex items-center space-x-1.5 animate-fadeIn">
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                OK
              </span>
              <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-1 font-mono text-[11px] text-slate-500">
              <span
                className={cn(
                  'transition-colors',
                  rawDigits.length > 0 ? 'text-sky-400 font-medium' : 'text-slate-500'
                )}
              >
                {rawDigits.length}
              </span>
              <span>/</span>
              <span>{selectedCountry.digitCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Helper text below input */}
      <div className="flex items-center justify-between mt-1.5 px-1 text-[11px]">
        {isValid ? (
          <p className="text-emerald-400 font-medium flex items-center space-x-1 animate-fadeIn">
            <span>✓ {selectedCountry.name} raqami to'g'ri kiritildi</span>
          </p>
        ) : (
          <p className="text-slate-400">
            Standart: <span className="font-mono text-sky-400/90">{selectedCountry.dialCode} {selectedCountry.placeholderExample}</span>
          </p>
        )}
        <span className="text-[10px] text-slate-500 hidden sm:inline">
          {selectedCountry.name}
        </span>
      </div>

      {/* 4. Modern International Country Dropdown (Dark Glassmorphism) */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-full mt-2 w-full max-w-sm sm:max-w-md bg-[#0B111E]/98 border border-slate-700/90 rounded-2xl shadow-2xl shadow-sky-950/70 backdrop-blur-xl z-50 overflow-hidden animate-fadeIn"
        >
          {/* Dropdown Header & Search Bar */}
          <div className="p-3 border-b border-slate-800/80 bg-slate-900/60">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Davlat nomi yoki kodi (masalan: O'zbekiston, +998)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-950/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-white transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Access: Popular Countries */}
          {!searchQuery && (
            <div className="px-3 pt-2.5 pb-2 border-b border-slate-800/60 bg-slate-900/30">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>Tezkor tanlov</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_COUNTRY_CODES.map((code) => {
                  const c = COUNTRIES.find((item) => item.code === code);
                  if (!c) return null;
                  const isSelected = selectedCountry.code === c.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleSelectCountry(c)}
                      className={cn(
                        'px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition border',
                        isSelected
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm shadow-sky-500/20'
                          : 'bg-slate-800/60 text-slate-300 border-slate-700/50 hover:bg-slate-800 hover:text-white'
                      )}
                    >
                      <span className="text-sm">{c.flag}</span>
                      <span className="text-[11px] font-bold">{c.code}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{c.dialCode}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Country List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/40 custom-scrollbar">
            {filteredCountries.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <p>"{searchQuery}" bo'yicha hech qanday davlat topilmadi.</p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Iltimos, nomini yoki telefon kodini tekshiring.
                </p>
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = selectedCountry.code === c.code;
                return (
                  <button
                    key={`${c.code}-${c.dialCode}`}
                    type="button"
                    onClick={() => handleSelectCountry(c)}
                    className={cn(
                      'w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/70 transition group',
                      isSelected && 'bg-sky-500/10'
                    )}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="text-xl select-none shrink-0">{c.flag}</span>
                      <div className="min-w-0 truncate">
                        <span
                          className={cn(
                            'text-xs font-medium block truncate',
                            isSelected
                              ? 'text-sky-400 font-semibold'
                              : 'text-slate-200 group-hover:text-white'
                          )}
                        >
                          {c.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate font-mono">
                          Format: {c.placeholderExample}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0 ml-2">
                      <span className="font-mono text-xs text-sky-400 font-medium bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
                        {c.dialCode}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-sky-400 shrink-0" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneInputWithCountry;
