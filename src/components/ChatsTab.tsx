import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  RefreshCw,
  Search,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { ChatItem } from '../api/client';
import apiClient from '../api/client';
import { CustomToggle } from './common/CustomToggle';

interface ChatsTabProps {
  chats: ChatItem[];
  onRefresh: () => void;
}

export const ChatsTab: React.FC<ChatsTabProps> = ({ chats, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleChat = async (chatId: string) => {
    try {
      await apiClient.toggleChat(chatId);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearOverride = async (chatId: string) => {
    try {
      await apiClient.clearChatOverride(chatId);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredChats = useMemo(() => {
    return chats.filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const title = (c.title || '').toLowerCase();
      return title.includes(q) || c.chatId.includes(q);
    });
  }, [chats, searchQuery]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Commands Instruction Banner */}
      <div className="bg-[#0D1424]/90 border border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-sky-400" />
              <span>Chatlar Boshqaruvi va Maxsus Buyruqlar</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Siz istalgan chatda Telegram ilovangiz orqali buyruq yozib ham AIni boshqara olasiz:
            </p>
          </div>

          <button
            onClick={onRefresh}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Yangilash</span>
          </button>
        </div>

        {/* 3 Quick Command Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="p-3 sm:p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <code className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
              /stop_ai
            </code>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Shu chatda AI auto-responder faoliyatini vaqtincha to'xtatadi.
            </p>
          </div>

          <div className="p-3 sm:p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <code className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              /start_ai
            </code>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              To'xtatilgan chatda AIni qayta faollashtiradi.
            </p>
          </div>

          <div className="p-3 sm:p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <code className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-lg border border-sky-500/20">
              /reset_context
            </code>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Chat xotirasini (kontekst tarixini) tozalaydi, AI yangidan suhbat boshlaydi.
            </p>
          </div>
        </div>
      </div>

      {/* Active Chats List Card */}
      <div className="bg-[#0D1424]/90 border border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-bold text-white">
              Faol Chatlar Ro'yxati ({chats.length} ta)
            </h4>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Chat nomi yoki ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {filteredChats.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Hozircha birorta chat bilan yozishma aniqlanmadi.</p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Yangi xabar kelganda chatlar avtomatik bu yerda ko'rinadi.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredChats.map((c) => {
              const isAiPaused = c.isAiStopped;
              const hasOverride = !!(c.isOwnerActive && c.manualOverrideUntil);

              return (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
                      {c.title ? c.title.charAt(0).toUpperCase() : 'C'}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs sm:text-sm text-white">
                          {c.title || `Chat ${c.chatId}`}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                          {c.chatType}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span className="font-mono">ID: {c.chatId}</span>
                        {hasOverride && (
                          <span className="inline-flex items-center space-x-1 text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md">
                            <Clock className="w-3 h-3" />
                            <span>Ega tanaffusi faol</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    {hasOverride && (
                      <button
                        onClick={() => handleClearOverride(c.chatId)}
                        title="Tanaffusni bekor qilish"
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Tanaffusni bekor qilish</span>
                      </button>
                    )}

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">
                        {isAiPaused ? "AI To'xtatilgan" : 'AI Faol'}
                      </span>
                      <CustomToggle
                        checked={!isAiPaused}
                        onChange={() => handleToggleChat(c.chatId)}
                        size="sm"
                        variant={!isAiPaused ? 'emerald' : 'sky'}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsTab;
