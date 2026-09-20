import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  badgeColor?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  label,
  placeholder = 'Tanlang...',
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className={cn('relative w-full space-y-1.5', isOpen ? 'z-50' : 'z-10', className)} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm transition-all duration-200',
          'bg-slate-950/70 border backdrop-blur-md',
          isOpen
            ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-lg shadow-sky-500/10'
            : 'border-slate-800 hover:border-slate-700',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        )}
      >
        <div className="flex items-center space-x-2.5 truncate">
          {selectedOption?.icon && (
            <span className="shrink-0 text-sky-400">{selectedOption.icon}</span>
          )}
          <div className="truncate">
            <span className="font-medium text-white truncate block">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          {selectedOption?.badge && (
            <span
              className={cn(
                'ml-2 px-2 py-0.5 text-[10px] font-semibold rounded-full shrink-0',
                selectedOption.badgeColor || 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              )}
            >
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ml-2',
            isOpen && 'transform rotate-180 text-sky-400'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 py-1.5 bg-[#0c1322] border border-slate-700/90 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] max-h-64 overflow-y-auto animate-fadeIn">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 text-left text-sm transition-colors duration-150',
                  isSelected
                    ? 'bg-sky-500/15 text-white font-medium border-l-2 border-sky-400'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                )}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  {option.icon && (
                    <span className={cn('shrink-0', isSelected ? 'text-sky-400' : 'text-slate-400')}>
                      {option.icon}
                    </span>
                  )}
                  <div className="truncate">
                    <div className="flex items-center space-x-2">
                      <span className="truncate">{option.label}</span>
                      {option.badge && (
                        <span
                          className={cn(
                            'px-2 py-0.5 text-[10px] font-semibold rounded-full',
                            option.badgeColor || 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          )}
                        >
                          {option.badge}
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-sky-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
