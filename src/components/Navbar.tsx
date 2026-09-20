import React, { useState } from 'react';
import {
  Send,
  Power,
  RefreshCw,
  Globe,
  Settings,
  Key,
  MessageSquare,
  Activity,
  LayoutDashboard,
  Check,
  X,
  Server,
} from 'lucide-react';
import { AuthStatus, getBackendUrl, setBackendUrl } from '../api/client';
import { JarvisAiIcon } from './common/JarvisAiIcon';
import { cn } from '../lib/utils';

interface NavbarProps {
  status: AuthStatus | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  status,
  activeTab,
  setActiveTab,
  onOpenLogin,
  onLogout,
  onRefresh,
  loading,
}) => {
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [apiUrlInput, setApiUrlInput] = useState(getBackendUrl() || '');

  const tabs = [
    { id: 'dashboard', label: 'Boshqaruv', shortLabel: 'Boshqaruv', icon: <LayoutDashboard className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> },
    { id: 'settings', label: 'Sozlamalar', shortLabel: 'Sozlamalar', icon: <Settings className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> },
    { id: 'keys', label: 'Gemini Kalitlar', shortLabel: 'Kalitlar', icon: <Key className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> },
    { id: 'chats', label: 'Chatlar', shortLabel: 'Chatlar', icon: <MessageSquare className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> },
    { id: 'logs', label: 'Jurnal', shortLabel: 'Jurnal', icon: <Activity className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> },
  ];

  const handleSaveApiUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setBackendUrl(apiUrlInput.trim());
    setIsApiModalOpen(false);
    onRefresh();
  };

  const hasSession = !!status?.hasSession;
  const isConnected = !!status?.isConnected;

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#080C14]/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/60">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand with Futuristic AI Arc Reactor & Status Indicator */}
            <div
              className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer select-none group"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="relative">
                <JarvisAiIcon size="md" isPulse={isConnected || hasSession} />
                {/* Real-time Status Glow LED */}
                <span
                  className={cn(
                    'absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#080C14] transition-all duration-300',
                    isConnected
                      ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse'
                      : hasSession
                      ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.7)] animate-pulse'
                      : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]'
                  )}
                />
              </div>

              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-sky-300 transition-colors">
                  JARVIS
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-black tracking-wider bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-md shadow-sm shadow-cyan-500/30">
                  AI
                </span>
                <span
                  className={cn(
                    'inline-flex items-center px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold rounded-full border transition-colors',
                    isConnected
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : hasSession
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  )}
                >
                  {isConnected ? 'ONLAYN' : hasSession ? 'ULANMOQDA' : 'OFLAYN'}
                </span>
              </div>
            </div>

            {/* Desktop Navigation Tabs (Hidden on mobile < 768px) */}
            <nav className="hidden md:flex items-center p-1 bg-slate-900/70 border border-slate-800/80 rounded-2xl backdrop-blur-xl">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    )}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5">
              {/* API Settings Modal Trigger */}
              <button
                type="button"
                onClick={() => {
                  setApiUrlInput(getBackendUrl() || '');
                  setIsApiModalOpen(true);
                }}
                title="Backend API Manzili (Railway / Localhost)"
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition flex items-center space-x-1.5 text-xs font-mono"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden xl:inline text-[11px]">
                  {getBackendUrl().includes('localhost') ? 'Localhost:5000' : 'Railway Cloud'}
                </span>
              </button>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                title="Ma'lumotlarni yangilash"
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition disabled:opacity-50"
              >
                <RefreshCw className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4', loading && 'animate-spin text-sky-400')} />
              </button>

              {/* Telegram Connect / User Account Status */}
              {hasSession ? (
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs">
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full',
                        isConnected
                          ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                          : 'bg-sky-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]'
                      )}
                    />
                    <span className="font-semibold text-white truncate max-w-[85px] sm:max-w-[130px] text-[11px] sm:text-xs">
                      {status?.accountName || status?.accountUsername || 'Akkaunt'}
                    </span>
                  </div>

                  <button
                    onClick={onLogout}
                    title="Akkauntdan chiqish"
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition"
                  >
                    <Power className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white text-[11px] sm:text-xs font-bold shadow-lg shadow-sky-500/25 transition transform active:scale-95"
                >
                  <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Telegramga Ulanish</span>
                  <span className="sm:hidden">Ulanish</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Fixed Bottom Navigation Bar (< 768px / 320px friendly) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080C14]/95 backdrop-blur-2xl border-t border-slate-800/90 px-1 py-1 flex items-center justify-around shadow-2xl shadow-black/80 select-none pb-safe">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 min-w-0',
                isActive
                  ? 'text-sky-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              {/* Active Top Glow Line */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-sky-500 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
              )}

              <div
                className={cn(
                  'p-1 sm:p-1.5 rounded-xl transition-all',
                  isActive && 'bg-sky-500/15 shadow-sm shadow-sky-500/30 transform -translate-y-0.5'
                )}
              >
                {tab.icon}
              </div>
              <span className="text-[9px] sm:text-[10px] font-medium tracking-tight truncate w-full text-center mt-0.5">
                {tab.shortLabel}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Custom Railway / Local API Configuration Modal */}
      {isApiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0D1424]/95 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">Backend API Manzili</h3>
              </div>
              <button
                onClick={() => setIsApiModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveApiUrl} className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Frontend sizning qaysi backend xizmatingizga so'rov yuborishini belgilang:
              </p>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    setApiUrlInput('https://shaxsiytelegramai-production.up.railway.app')
                  }
                  className={cn(
                    'p-2.5 rounded-xl border text-left transition',
                    apiUrlInput.includes('railway.app') || !apiUrlInput
                      ? 'bg-sky-500/15 border-sky-500 text-sky-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  )}
                >
                  <span className="font-semibold block text-white">Railway Cloud (Tavsiya)</span>
                  <span className="text-[10px] font-mono opacity-80">shaxsiytelegramai-production...</span>
                </button>

                <button
                  type="button"
                  onClick={() => setApiUrlInput('http://localhost:5000')}
                  className={cn(
                    'p-2.5 rounded-xl border text-left transition',
                    apiUrlInput.includes('localhost') || apiUrlInput.includes('127.0.0.1')
                      ? 'bg-sky-500/15 border-sky-500 text-sky-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  )}
                >
                  <span className="font-semibold block text-white">Lokal Backend (Node)</span>
                  <span className="text-[10px] font-mono opacity-80">localhost:5000</span>
                </button>
              </div>

              {/* Custom Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  To'liq URL Manzil
                </label>
                <input
                  type="url"
                  placeholder="https://shaxsiytelegramai-production.up.railway.app"
                  value={apiUrlInput}
                  onChange={(e) => setApiUrlInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsApiModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-lg shadow-sky-500/25 transition flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Saqlash</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
