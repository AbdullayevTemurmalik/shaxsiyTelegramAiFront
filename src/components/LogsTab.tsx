import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Trash2,
  RefreshCw,
  Zap,
  Bot,
  Mic,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Clock,
  Key,
  Inbox,
  Search,
} from 'lucide-react';
import { ActivityLogItem, JarvisActionLogItem } from '../api/client';
import apiClient from '../api/client';
import { CustomDatePicker } from './common/CustomDatePicker';
import { ConfirmModal } from './common/ConfirmModal';
import { cn } from '../lib/utils';

interface LogsTabProps {
  logs: ActivityLogItem[];
  onRefresh: () => void;
  compact?: boolean;
}

export const LogsTab: React.FC<LogsTabProps> = ({ logs, onRefresh, compact: _compact = false }) => {
  const [activeSubTab, setActiveSubTab] = useState<'auto_responder' | 'jarvis'>('auto_responder');
  const [jarvisLogs, setJarvisLogs] = useState<JarvisActionLogItem[]>([]);
  const [loadingJarvis, setLoadingJarvis] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'ERROR'>('ALL');

  const fetchJarvisLogs = async () => {
    setLoadingJarvis(true);
    try {
      const res = await apiClient.getJarvisLogs();
      if (res.success) {
        setJarvisLogs(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingJarvis(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'jarvis') {
      fetchJarvisLogs();
    }
  }, [activeSubTab]);

  const handleOpenClearConfirm = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmClear = async () => {
    setClearing(true);
    try {
      if (activeSubTab === 'auto_responder') {
        await apiClient.clearLogs();
        onRefresh();
      } else {
        await apiClient.clearJarvisLogs();
        fetchJarvisLogs();
      }
      setIsConfirmModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setClearing(false);
    }
  };

  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

  const handleDeleteTelegramMessage = async (chatId: string) => {
    if (!window.confirm("Ushbu xabarni Telegramdan barcha uchun o'chirmoqchimisiz?")) return;
    setDeletingChatId(chatId);
    try {
      const res = await apiClient.deleteOutgoingMessages(chatId, 1);
      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || "Xabarni o'chirishda xatolik");
      }
    } catch (err: any) {
      alert(err.response?.data?.error || err.message || "Xatolik yuz berdi");
    } finally {
      setDeletingChatId(null);
    }
  };

  // Filtered Auto-responder logs
  const filteredAutoLogs = useMemo(() => {
    return logs.filter((item) => {
      // Date filter
      if (selectedDate) {
        const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
        if (itemDate !== selectedDate) return false;
      }
      // Status filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const sender = (item.senderName || '').toLowerCase();
        const chat = (item.chatTitle || '').toLowerCase();
        const incoming = (item.incomingMessage || '').toLowerCase();
        const outgoing = (item.outgoingResponse || '').toLowerCase();
        if (!sender.includes(q) && !chat.includes(q) && !incoming.includes(q) && !outgoing.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [logs, selectedDate, statusFilter, searchQuery]);

  const getActionBadge = (actionType: string) => {
    switch (actionType) {
      case 'VOICE_ANALYSIS':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Mic className="w-3 h-3" />
            <span>Ovoz Tahlili</span>
          </span>
        );
      case 'PHOTO_ANALYSIS':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <ImageIcon className="w-3 h-3" />
            <span>Rasm Tahlili</span>
          </span>
        );
      case 'send_message_to_target':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <MessageSquare className="w-3 h-3" />
            <span>Xabar Yuborish</span>
          </span>
        );
      case 'get_recent_chat_messages':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Activity className="w-3 h-3" />
            <span>Chat Xulosasi</span>
          </span>
        );
      case 'delete_sent_messages':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Trash2 className="w-3 h-3" />
            <span>Xabarni O'chirish</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            {actionType}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Header */}
      <div className="relative z-30 bg-[#0D1424]/90 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Subtabs: Auto-Responder vs JARVIS */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-2xl w-fit">
            <button
              onClick={() => setActiveSubTab('auto_responder')}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
                activeSubTab === 'auto_responder'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Auto-Responder Jurnali</span>
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-black/30">
                {logs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('jarvis')}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
                activeSubTab === 'jarvis'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>JARVIS Amallar Tarixi</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={activeSubTab === 'auto_responder' ? onRefresh : fetchJarvisLogs}
              title="Yangilash"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              <RefreshCw className={cn('w-4 h-4', loadingJarvis && 'animate-spin text-sky-400')} />
            </button>

            <button
              onClick={handleOpenClearConfirm}
              disabled={clearing}
              title="Tozalash"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold transition disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tarixni Tozalash</span>
            </button>
          </div>
        </div>

        {/* Filter bar for Auto-responder */}
        {activeSubTab === 'auto_responder' && (
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Bar */}
              <div className="relative min-w-[200px] sm:min-w-[240px]">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Xabar yoki ism bo'yicha qidiruv..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center space-x-1 bg-slate-950/80 p-0.5 rounded-xl border border-slate-800">
                {(['ALL', 'SUCCESS', 'ERROR'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-[10px] font-bold transition',
                      statusFilter === st
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    {st === 'ALL' ? 'Hammasi' : st === 'SUCCESS' ? 'Muvaffaqiyatli' : 'Xatolik'}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Date Picker */}
            <div className="relative z-40">
              <CustomDatePicker
                selectedDate={selectedDate}
                onChange={(d) => setSelectedDate(d)}
                align="right"
              />
            </div>
          </div>
        )}
      </div>

      {/* Logs Feed Container */}
      <div className="space-y-3 relative z-10">
        {activeSubTab === 'auto_responder' ? (
          filteredAutoLogs.length === 0 ? (
            /* Minimalist Cyber Empty State */
            <div className="bg-[#0D1424]/60 border border-slate-800/80 rounded-3xl p-12 text-center backdrop-blur-xl">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-500 shadow-inner mb-4">
                <Inbox className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-white">Hozircha xabarlar jurnali bo'sh</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                Telegram akkauntingizga yangi shaxsiy xabar kelganda AI uni tahlil qilib, generatsiya qilgan javobi shu yerda real vaqtda paydo bo'ladi.
              </p>
            </div>
          ) : (
            filteredAutoLogs.map((log) => {
              const isSuccess = log.status === 'SUCCESS';
              const createdDate = new Date(log.createdAt);
              const timeStr = createdDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <div
                  key={log.id}
                  className={cn(
                    'bg-[#0D1424]/80 border rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-200 hover:border-slate-700/90',
                    isSuccess ? 'border-slate-800/90' : 'border-rose-500/30 bg-rose-950/10'
                  )}
                >
                  {/* Item Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500/20 to-blue-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-xs">
                        {log.senderName ? log.senderName.charAt(0).toUpperCase() : 'F'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs sm:text-sm text-white">
                            {log.senderName || 'Foydalanuvchi'}
                          </span>
                          {log.chatTitle && log.chatTitle !== log.senderName && (
                            <span className="text-[11px] text-slate-400">
                              ({log.chatTitle})
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ID: {log.chatId}
                        </span>
                      </div>
                    </div>

                    {/* Status & Latency Badges */}
                    <div className="flex items-center space-x-2">
                      {log.usedApiKey && (
                        <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-900 border border-slate-800 text-slate-300">
                          <Key className="w-3 h-3 text-sky-400" />
                          <span>{log.usedApiKey}</span>
                        </span>
                      )}

                      {log.latencyMs && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Zap className="w-3 h-3" />
                          <span>{(log.latencyMs / 1000).toFixed(1)}s</span>
                        </span>
                      )}

                      <span
                        className={cn(
                          'inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border',
                          log.status === 'REVOKED'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : isSuccess
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        )}
                      >
                        {log.status === 'REVOKED' ? (
                          <>
                            <Trash2 className="w-3 h-3" />
                            <span>O'chirilgan</span>
                          </>
                        ) : isSuccess ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Muvaffaqiyatli</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            <span>Xatolik</span>
                          </>
                        )}
                      </span>

                      <span className="text-[11px] text-slate-500 font-mono flex items-center space-x-1 pl-1">
                        <Clock className="w-3 h-3" />
                        <span>{timeStr}</span>
                      </span>
                    </div>
                  </div>

                  {/* Message exchange cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Incoming User Message */}
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Kelgan Xabar:
                      </span>
                      <p className="text-slate-200 leading-relaxed break-words whitespace-pre-wrap">
                        {log.incomingMessage}
                      </p>
                    </div>

                    {/* AI Generated Response */}
                    <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                          AI Qaytargan Javob:
                        </span>
                        {log.outgoingResponse && isSuccess && (
                          <button
                            onClick={() => handleDeleteTelegramMessage(log.chatId)}
                            disabled={deletingChatId === log.chatId}
                            title="Telegramdan barcha uchun o'chirish (Revoke)"
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[10px] font-medium text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{deletingChatId === log.chatId ? "O'chirilmoqda..." : "Telegramdan o'chirish"}</span>
                          </button>
                        )}
                      </div>
                      {log.outgoingResponse ? (
                        <p className="text-sky-100 leading-relaxed break-words whitespace-pre-wrap">
                          {log.outgoingResponse}
                        </p>
                      ) : (
                        <p className="text-rose-400 italic">
                          {log.error || 'Javob yuborilmadi (o\'tkazib yuborildi)'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )
        ) : (
          /* JARVIS Actions Feed */
          jarvisLogs.length === 0 ? (
            <div className="bg-[#0D1424]/60 border border-slate-800/80 rounded-3xl p-12 text-center backdrop-blur-xl">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner mb-4">
                <Bot className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-white">JARVIS amallari jurnali bo'sh</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                Saved Messages (Izbrannoe) ga kirib ovozli yoki matnli buyruq bersangiz, JARVIS ning bajargan amallari bu yerda qayd etiladi.
              </p>
            </div>
          ) : (
            jarvisLogs.map((jlog) => {
              const isSuccess = jlog.status === 'SUCCESS';
              const createdDate = new Date(jlog.createdAt);
              const timeStr = createdDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <div
                  key={jlog.id}
                  className="bg-[#0D1424]/80 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {getActionBadge(jlog.actionType)}
                      {jlog.target && (
                        <span className="text-xs font-semibold text-slate-300">
                          → {jlog.target}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                          isSuccess
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        )}
                      >
                        {jlog.status}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {timeStr}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                        Sizning Buyrug'ingiz:
                      </span>
                      <p className="text-slate-200 leading-relaxed break-words">
                        {jlog.userCommand}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
                      <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                        JARVIS Bajarilishi:
                      </span>
                      <p className="text-slate-200 leading-relaxed break-words font-mono text-[11px]">
                        {jlog.result}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmClear}
        loading={clearing}
        title={
          activeSubTab === 'auto_responder'
            ? "Auto-responder tarixini tozalash"
            : "JARVIS amallar tarixini tozalash"
        }
        description={
          activeSubTab === 'auto_responder'
            ? "Haqiqatan ham barcha Auto-responder xabarlar tarixini o'chirmoqchimisiz? Ushbu amal bajarilgach, barcha eski xabarlar va tahlil hisobotlari butunlay o'chiriladi."
            : "Haqiqatan ham barcha JARVIS amallar jurnalini o'chirmoqchimisiz? Ushbu amal bajarilgach, barcha ijro etilgan buyruqlar tarixi butunlay o'chiriladi."
        }
        confirmText="Ha, tozalash"
        cancelText="Yo'q, bekor qilish"
        variant="danger"
      />
    </div>
  );
};

export default LogsTab;
