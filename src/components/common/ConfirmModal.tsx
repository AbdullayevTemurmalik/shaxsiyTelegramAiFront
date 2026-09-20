import React, { useEffect } from 'react';
import { AlertTriangle, AlertCircle, X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Ha, o'chirish",
  cancelText = "Yo'q, bekor qilish",
  variant = 'danger',
  loading = false,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: 'bg-rose-500/15 border-rose-500/30 text-rose-400 shadow-rose-500/20',
      icon: <AlertTriangle className="w-6 h-6" />,
      confirmBtn: 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25',
    },
    warning: {
      iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-amber-500/20',
      icon: <AlertCircle className="w-6 h-6" />,
      confirmBtn: 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25',
    },
    info: {
      iconBg: 'bg-sky-500/15 border-sky-500/30 text-sky-400 shadow-sky-500/20',
      icon: <AlertCircle className="w-6 h-6" />,
      confirmBtn: 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/25',
    },
  };

  const currentStyle = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0"
        onClick={() => !loading && onClose()}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-[#0D1424]/95 border border-slate-700/80 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden p-6 space-y-5 animate-fadeIn z-10">
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div
              className={cn(
                'w-12 h-12 rounded-2xl border flex items-center justify-center shadow-lg shrink-0',
                currentStyle.iconBg
              )}
            >
              {currentStyle.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {title}
              </h3>
              <span className="text-[11px] font-semibold text-rose-400/90 uppercase tracking-wider block mt-0.5">
                Ogohlantirish
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description Body */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {description}
        </div>

        {/* Action Buttons: Cancel on left, Confirm on right */}
        <div className="flex items-center space-x-3 pt-1">
          <button
            type="button"
            autoFocus
            disabled={loading}
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs sm:text-sm font-semibold transition"
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={cn(
              'flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 transform active:scale-95 disabled:opacity-50',
              currentStyle.confirmBtn
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Bajarilmoqda...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
