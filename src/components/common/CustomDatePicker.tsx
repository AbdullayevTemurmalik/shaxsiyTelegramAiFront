import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CustomDatePickerProps {
  selectedDate: string | null; // YYYY-MM-DD or null
  onChange: (date: string | null) => void;
  preset?: string;
  onPresetChange?: (preset: string) => void;
  align?: 'left' | 'right';
  className?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  onChange,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calendar navigation state
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];

  const daysOfWeek = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

  // Days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-based

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const d = new Date(year, month, day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const handleSelectPreset = (type: 'today' | 'yesterday' | 'all') => {
    if (type === 'all') {
      onChange(null);
    } else if (type === 'today') {
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      onChange(`${yyyy}-${mm}-${dd}`);
    } else if (type === 'yesterday') {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      onChange(`${yyyy}-${mm}-${dd}`);
    }
    setIsOpen(false);
  };

  const formatDisplay = (isoStr: string | null) => {
    if (!isoStr) return 'Barcha sanalar';
    const [y, m, d] = isoStr.split('-');
    return `${parseInt(d, 10)} ${monthNames[parseInt(m, 10) - 1]} ${y}`;
  };

  return (
    <div
      className={cn('relative inline-block', isOpen ? 'z-50' : 'z-20', className)}
      ref={containerRef}
    >
      <div className="flex items-center space-x-1">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition duration-200',
            'bg-slate-950/70 border backdrop-blur-md',
            isOpen
              ? 'border-sky-500 ring-2 ring-sky-500/20 text-white'
              : 'border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
          )}
        >
          <CalendarIcon className="w-3.5 h-3.5 text-sky-400" />
          <span>{formatDisplay(selectedDate)}</span>
        </button>

        {selectedDate && (
          <button
            type="button"
            onClick={() => onChange(null)}
            title="Sanani tozalash"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-[100] mt-2 w-[280px] sm:w-72 max-w-[calc(100vw-1.5rem)] p-3.5 bg-[#0c1322] border border-slate-700/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] animate-fadeIn',
            align === 'left' ? 'left-0' : 'right-0'
          )}
        >
          {/* Quick Presets */}
          <div className="flex items-center justify-between gap-1 pb-3 mb-3 border-b border-slate-800">
            <button
              type="button"
              onClick={() => handleSelectPreset('today')}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-800/80 hover:bg-sky-500/20 hover:text-sky-300 text-[11px] font-medium text-slate-300 transition text-center"
            >
              Bugun
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('yesterday')}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-800/80 hover:bg-sky-500/20 hover:text-sky-300 text-[11px] font-medium text-slate-300 transition text-center"
            >
              Kecha
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('all')}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] font-medium text-slate-300 transition text-center"
            >
              Barchasi
            </button>
          </div>

          {/* Month & Year Navigation */}
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-white">
              {monthNames[month]} {year}
            </span>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {daysOfWeek.map((day) => (
              <span key={day} className="text-[10px] font-semibold text-slate-500">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <span key={`empty-${i}`} className="w-7 h-7" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;
              const isToday =
                today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    'w-7 h-7 rounded-lg text-xs font-medium transition flex items-center justify-center mx-auto',
                    isSelected
                      ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30'
                      : isToday
                      ? 'border border-sky-500/50 text-sky-400 hover:bg-sky-500/10'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
