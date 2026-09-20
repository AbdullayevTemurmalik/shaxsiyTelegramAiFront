import React from 'react';
import { cn } from '../../lib/utils';
import { Check, X } from 'lucide-react';

interface CustomToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'sky' | 'emerald' | 'indigo';
  showIcon?: boolean;
  className?: string;
}

export const CustomToggle: React.FC<CustomToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  size = 'md',
  variant = 'sky',
  showIcon = false,
  className,
}) => {
  const sizeConfig = {
    sm: {
      track: 'w-9 h-5',
      knob: 'w-3.5 h-3.5',
      translate: 'translate-x-4',
      iconSize: 'w-2.5 h-2.5',
    },
    md: {
      track: 'w-11 h-6',
      knob: 'w-4.5 h-4.5 w-[18px] h-[18px]',
      translate: 'translate-x-5',
      iconSize: 'w-3 h-3',
    },
    lg: {
      track: 'w-14 h-7.5 h-[30px]',
      knob: 'w-6 h-6',
      translate: 'translate-x-6.5 translate-x-[26px]',
      iconSize: 'w-3.5 h-3.5',
    },
  };

  const variantGlow = {
    sky: 'bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg shadow-sky-500/25',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25',
    indigo: 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25',
  };

  const currentSize = sizeConfig[size];

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={cn(
        'flex items-center justify-between gap-3 select-none',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group',
        className
      )}
    >
      {(label || description) && (
        <div className="flex-1 pr-2">
          {label && (
            <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white transition block">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[11px] sm:text-xs text-slate-400 group-hover:text-slate-300 transition block mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={cn(
          'relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080C14]',
          currentSize.track,
          checked ? variantGlow[variant] : 'bg-slate-800 border border-slate-700/80 hover:bg-slate-750'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-flex items-center justify-center rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out',
            currentSize.knob,
            checked ? currentSize.translate : 'translate-x-0.5'
          )}
        >
          {showIcon && (
            checked ? (
              <Check className={cn(currentSize.iconSize, 'text-sky-600 stroke-[3]')} />
            ) : (
              <X className={cn(currentSize.iconSize, 'text-slate-400 stroke-[2]')} />
            )
          )}
        </span>
      </button>
    </div>
  );
};
