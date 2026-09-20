import React from 'react';
import {
  ShieldCheck,
  MessageSquare,
  Zap,
  Clock,
  Key,
  Send,
  CheckCircle2,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import { AuthStatus, StatsData, SettingsData, GeminiKeyItem } from '../api/client';
import { CustomToggle } from './common/CustomToggle';
import { cn } from '../lib/utils';

interface StatusCardProps {
  status: AuthStatus | null;
  stats: StatsData | null;
  settings: SettingsData | null;
  keys?: GeminiKeyItem[];
  onToggleMasterAi: (enabled: boolean) => void;
  onUpdateSettings?: (updated: Partial<SettingsData>) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  status,
  stats,
  settings,
  keys = [],
  onToggleMasterAi,
  onUpdateSettings,
  onOpenLogin,
  onLogout,
  onNavigateTab,
}) => {
  const isMasterActive = settings?.isAiActive ?? true;
  const hasSession = !!status?.hasSession;
  const isConnected = !!status?.isConnected;

  const handleQuickSettingToggle = (field: keyof SettingsData, val: boolean) => {
    if (onUpdateSettings) {
      onUpdateSettings({ [field]: val });
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section: Account Card & Master AI Controller */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Left: Telegram Profile Card (2 cols on lg) */}
        <div
          className={cn(
            'lg:col-span-2 relative rounded-3xl p-4 sm:p-6 lg:p-7 backdrop-blur-2xl transition-all duration-300 overflow-hidden',
            hasSession
              ? 'bg-gradient-to-br from-[#0D1627]/90 via-[#0B111E]/90 to-[#0A0E1A]/95 border border-emerald-500/30 shadow-2xl shadow-emerald-950/20'
              : 'bg-gradient-to-br from-[#0E1528]/95 via-[#0C1220]/90 to-[#080C14]/95 border border-sky-500/25 shadow-2xl shadow-sky-950/30'
          )}
        >
          {/* Subtle Cyber Glow Orbs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5">
            {/* Account Info */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative shrink-0">
                <div
                  className={cn(
                    'w-13 h-13 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl shadow-xl transition-all duration-300',
                    hasSession
                      ? 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-500 text-white shadow-emerald-500/25 ring-2 ring-emerald-400/40'
                      : 'bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 text-white shadow-sky-500/25 ring-2 ring-sky-400/30'
                  )}
                >
                  {hasSession ? (
                    status?.accountName ? (
                      status.accountName.charAt(0).toUpperCase()
                    ) : (
                      'T'
                    )
                  ) : (
                    <Send className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  )}
                </div>

                {/* Status LED ring badge */}
                <span
                  className={cn(
                    'absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-[#080C14] flex items-center justify-center',
                    isConnected
                      ? 'bg-emerald-400 animate-pulse'
                      : hasSession
                      ? 'bg-sky-400 animate-pulse'
                      : 'bg-rose-500'
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-base sm:text-xl font-black text-white tracking-tight truncate max-w-[190px] sm:max-w-none">
                    {hasSession
                      ? status?.accountName || status?.accountUsername || 'Telegram Akkaunt'
                      : 'Telegram Akkaunt Ulanmagan'}
                  </h2>
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold border',
                      isConnected
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : hasSession
                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    )}
                  >
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full mr-1.5',
                        isConnected
                          ? 'bg-emerald-400 animate-pulse'
                          : hasSession
                          ? 'bg-sky-400 animate-pulse'
                          : 'bg-rose-400'
                      )}
                    />
                    {isConnected
                      ? 'Faol Sessiya'
                      : hasSession
                      ? 'Qayta ulanmoqda...'
                      : 'Kutilmoqda (Oflayn)'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  {hasSession ? (
                    <span className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {status?.accountUsername && (
                        <span className="font-semibold text-sky-400">@{status.accountUsername}</span>
                      )}
                      {status?.phoneNumber && (
                        <span className="font-mono text-slate-300">{status.phoneNumber}</span>
                      )}
                      <span className="text-slate-500">• ID: {status?.userId || 'Doimiy Sessiya'}</span>
                    </span>
                  ) : (
                    "Shaxsiy xabarlarga avtomatik javob berish uchun hisobingizni ulang"
                  )}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 w-full sm:w-auto">
              {hasSession ? (
                <button
                  onClick={onLogout}
                  className="w-full sm:w-auto text-center px-4 py-2 sm:py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs sm:text-sm font-semibold transition duration-200"
                >
                  Akkauntdan Chiqish
                </button>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="w-full sm:w-auto justify-center px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-sky-500/30 hover:shadow-sky-500/50 transition-all transform active:scale-95 flex items-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Telegramni Ulash</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Security Info Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>
                GramJS MTProto xavfsiz session string shifrlangan holda saqlanadi
              </span>
            </div>
            <div className="text-slate-500 hidden sm:block">
              Server qayta ishga tushganda avtomatik qayta ulanadi
            </div>
          </div>
        </div>

        {/* Right: Master AI Auto-Responder Toggle Card (1 col) */}
        <div className="relative bg-gradient-to-br from-[#0D1525]/90 to-[#0A0F1A]/95 border border-slate-800/90 rounded-3xl p-4 sm:p-6 lg:p-7 shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Boshqaruv Markazi
              </span>
              <span
                className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border',
                  isMasterActive
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                )}
              >
                {isMasterActive ? 'AI FAOL' : 'TO\'XTATILGAN'}
              </span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Bosh AI Auto-Responder
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {isMasterActive
                  ? "Barcha kelayotgan shaxsiy xabarlarga avtomatik insoniy uslubda javob berilmoqda."
                  : "AI faoliyati to'xtatilgan, hech qanday xabarga avtomatik javob yuborilmaydi."}
              </p>
            </div>
          </div>

          {/* Smooth Animated Custom Toggle Switch */}
          <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              {isMasterActive ? "AIni o'chirish" : "AIni yoqish"}
            </span>
            <CustomToggle
              checked={isMasterActive}
              onChange={onToggleMasterAi}
              size="lg"
              variant={isMasterActive ? 'emerald' : 'sky'}
              showIcon
            />
          </div>
        </div>
      </div>

      {/* Metrics Row: 4 Sleek Minimalist Cards with Glow & Hover Lift */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-5">
        {/* Metric 1: Total Responses */}
        <div className="group relative bg-[#0D1424]/80 border border-slate-800/80 hover:border-sky-500/40 rounded-2xl p-3 sm:p-4 lg:p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition duration-300 pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 truncate">Jami Javoblar</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition duration-300 shrink-0 ml-1">
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 text-xl sm:text-3xl font-black text-white tracking-tight">
            {stats?.totalResponses ?? 0}
          </div>
          <div className="mt-1 text-[10px] sm:text-[11px] text-emerald-400 font-medium flex items-center space-x-1 truncate">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span className="truncate">{stats?.successfulResponses ?? 0} ta muvaffaqiyatli</span>
          </div>
        </div>

        {/* Metric 2: Active Keys */}
        <div className="group relative bg-[#0D1424]/80 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-3 sm:p-4 lg:p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition duration-300 pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 truncate">Faol Kalitlar</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition duration-300 shrink-0 ml-1">
              <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 text-xl sm:text-3xl font-black text-white tracking-tight">
            {stats?.activeKeys ?? 0} <span className="text-slate-500 text-sm sm:text-lg font-normal">/ 4</span>
          </div>
          <div className="mt-1 text-[10px] sm:text-[11px] text-indigo-300 font-medium truncate">
            Round-robin rotatsiya
          </div>
        </div>

        {/* Metric 3: Average Latency */}
        <div className="group relative bg-[#0D1424]/80 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-3 sm:p-4 lg:p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition duration-300 pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 truncate">O'rtacha Tezlik</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition duration-300 shrink-0 ml-1">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 text-xl sm:text-3xl font-black text-white tracking-tight">
            {stats?.averageLatencyMs
              ? `${(stats.averageLatencyMs / 1000).toFixed(1)}s`
              : '1.8s'}
          </div>
          <div className="mt-1 text-[10px] sm:text-[11px] text-amber-400/90 font-medium truncate">
            Gemini 2.0 Flash
          </div>
        </div>

        {/* Metric 4: Human Typing Delay */}
        <div className="group relative bg-[#0D1424]/80 border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-3 sm:p-4 lg:p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition duration-300 pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 truncate">Typing Kechikish</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition duration-300 shrink-0 ml-1">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 text-xl sm:text-3xl font-black text-white tracking-tight">
            {settings?.typingDelayMin ?? 2}-{settings?.typingDelayMax ?? 4}s
          </div>
          <div className="mt-1 text-[10px] sm:text-[11px] text-emerald-400 font-medium truncate">
            Anti-ban taqlid
          </div>
        </div>
      </div>

      {/* Middle Interactive Blocks: Gemini Keys 4-Slot Visualizer & Live Rules Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        {/* Block A: 4-Slot Gemini API Key Visualizer */}
        <div className="bg-[#0D1424]/80 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                <Key className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">
                Gemini API Kalitlar Rotatsiyasi (4 Slot)
              </h3>
            </div>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('keys')}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center space-x-1"
              >
                <span>Boshqarish ({keys.length} ta)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 4 Visual Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((slotNum, idx) => {
              const keyItem = keys[idx];
              const isSlotActive = keyItem?.isActive;
              const isSlotCooldown = keyItem?.isCooldown;

              return (
                <div
                  key={slotNum}
                  className={cn(
                    'p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between',
                    keyItem
                      ? isSlotActive && !isSlotCooldown
                        ? 'bg-slate-900/90 border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                        : isSlotCooldown
                        ? 'bg-amber-950/20 border-amber-500/30'
                        : 'bg-slate-900/60 border-slate-800'
                      : 'bg-slate-950/40 border-slate-800/60 border-dashed'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Slot #{slotNum}
                    </span>
                    <span
                      className={cn(
                        'w-2.5 h-2.5 rounded-full',
                        keyItem
                          ? isSlotActive && !isSlotCooldown
                            ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                            : isSlotCooldown
                            ? 'bg-amber-400'
                            : 'bg-rose-500'
                          : 'bg-slate-700'
                      )}
                    />
                  </div>

                  {keyItem ? (
                    <div>
                      <div className="font-semibold text-xs text-white truncate">
                        {keyItem.label || `Gemini Key ${slotNum}`}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400 truncate mt-0.5">
                        {keyItem.maskedKey}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
                        <span className="text-emerald-400 font-semibold">
                          ✓ {keyItem.successCount}
                        </span>
                        {keyItem.failureCount > 0 && (
                          <span className="text-rose-400 font-semibold">
                            ✗ {keyItem.failureCount}
                          </span>
                        )}
                        <span className="text-sky-400 font-mono">
                          {isSlotCooldown ? 'Kutishda' : 'Faol'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-center text-slate-500 text-[11px]">
                      Zaxira slot bo'sh
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Block B: Active Rules with Direct Toggle Controls */}
        <div className="bg-[#0D1424]/80 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Sliders className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">
                Faol Qoidalar va Filtrlash
              </h3>
            </div>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('settings')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1"
              >
                <span>Barchasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Toggle: Private DMs */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Shaxsiy Chatlar</span>
                <span className="text-[10px] text-slate-400 block">DMs avto-javob</span>
              </div>
              <CustomToggle
                checked={settings?.privateDmsEnabled ?? true}
                onChange={(val) => handleQuickSettingToggle('privateDmsEnabled', val)}
                size="sm"
                variant="sky"
              />
            </div>

            {/* Toggle: Groups */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Guruhlar</span>
                <span className="text-[10px] text-slate-400 block">Guruhlarda ishlash</span>
              </div>
              <CustomToggle
                checked={settings?.groupsEnabled ?? false}
                onChange={(val) => handleQuickSettingToggle('groupsEnabled', val)}
                size="sm"
                variant="emerald"
              />
            </div>

            {/* Toggle: Mention Only in Groups */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Faqat Mention</span>
                <span className="text-[10px] text-slate-400 block">@belgilangandagina</span>
              </div>
              <CustomToggle
                checked={settings?.groupMentionOnly ?? true}
                onChange={(val) => handleQuickSettingToggle('groupMentionOnly', val)}
                size="sm"
                variant="indigo"
              />
            </div>

            {/* Toggle: Voice & Photo Alert */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Multimodal Alert</span>
                <span className="text-[10px] text-slate-400 block">Ovoz & rasm tahlili</span>
              </div>
              <CustomToggle
                checked={settings?.voiceAnalysisEnabled !== false}
                onChange={(val) => handleQuickSettingToggle('voiceAnalysisEnabled', val)}
                size="sm"
                variant="emerald"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
