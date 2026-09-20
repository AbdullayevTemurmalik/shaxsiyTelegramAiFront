import React, { useState } from 'react';
import {
  Key,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Zap,
  Loader2,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { GeminiKeyItem } from '../api/client';
import apiClient from '../api/client';
import { CustomToggle } from './common/CustomToggle';
import { ConfirmModal } from './common/ConfirmModal';
import { cn } from '../lib/utils';

interface GeminiKeysTabProps {
  keys: GeminiKeyItem[];
  onRefresh: () => void;
}

export const GeminiKeysTab: React.FC<GeminiKeysTabProps> = ({ keys, onRefresh }) => {
  const [newKey, setNewKey] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [testingId, setTestingId] = useState<number | null>(null);
  const [testResults, setTestResults] = useState<{
    [id: number]: { success: boolean; latencyMs: number; message: string };
  }>({});

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;
    setAdding(true);
    setAddError(null);

    try {
      const res = await apiClient.addKey(newKey.trim(), newLabel.trim() || undefined);
      if (res.success) {
        setNewKey('');
        setNewLabel('');
        onRefresh();
      }
    } catch (err: any) {
      setAddError(err.response?.data?.error || err.message || 'Xatolik yuz berdi.');
    } finally {
      setAdding(false);
    }
  };

  const [deleteKeyId, setDeleteKeyId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleToggle = async (id: number) => {
    try {
      await apiClient.toggleKey(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDeleteConfirm = (id: number) => {
    setDeleteKeyId(id);
  };

  const executeDelete = async () => {
    if (!deleteKeyId) return;
    setDeleting(true);
    try {
      await apiClient.deleteKey(deleteKeyId);
      setDeleteKeyId(null);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleTestKey = async (id: number) => {
    setTestingId(id);
    try {
      const res = await apiClient.testKey(id);
      if (res.data) {
        setTestResults((prev) => ({
          ...prev,
          [id]: res.data,
        }));
      }
      onRefresh();
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [id]: {
          success: false,
          latencyMs: 0,
          message: err.response?.data?.error || err.message || 'Sinovda xatolik',
        },
      }));
    } finally {
      setTestingId(null);
    }
  };

  const [resettingErrors, setResettingErrors] = useState(false);

  const handleResetAllErrors = async () => {
    setResettingErrors(true);
    try {
      await apiClient.resetAllKeyErrors();
      setTestResults({});
      onRefresh();
    } catch (err) {
      console.error('Error resetting key errors:', err);
    } finally {
      setResettingErrors(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Overview & Slot Cards */}
      <div className="bg-[#0D1424]/90 border border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
              <Key className="w-5 h-5 text-sky-400" />
              <span>Google Gemini API Kalitlar Rotatsiyasi</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              4 ta kalit o'rtasida uzluksiz Round-Robin yuklama taqsimoti. Bir kalit limitga uchrasa, avtomatik keyingisiga o'tadi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {keys.some((k) => k.failureCount > 0) && (
              <button
                type="button"
                onClick={handleResetAllErrors}
                disabled={resettingErrors}
                title="Barcha kalitlardagi xatoliklar sonini tozalash"
                className="flex items-center space-x-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 transition disabled:opacity-50"
              >
                <RotateCcw className={cn('w-3.5 h-3.5', resettingErrors && 'animate-spin')} />
                <span>Xatolarni tozalash</span>
              </button>
            )}

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              <span>AI Studio Kalit Olish</span>
              <ExternalLink className="w-3 h-3 text-sky-400" />
            </a>

            <button
              onClick={onRefresh}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Visual Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 pt-2">
          {keys.map((k, idx) => {
            const isCooldown = k.isCooldown;
            const isTesting = testingId === k.id;
            const testRes = testResults[k.id];

            return (
              <div
                key={k.id}
                className={cn(
                  'rounded-2xl p-4.5 p-4 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden',
                  k.isActive && !isCooldown
                    ? 'bg-slate-900/80 border-emerald-500/30 shadow-lg shadow-emerald-950/10 hover:border-emerald-500/50'
                    : isCooldown
                    ? 'bg-amber-950/15 border-amber-500/30'
                    : 'bg-slate-900/50 border-slate-800 opacity-70'
                )}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Slot #{idx + 1}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full',
                          k.isActive && !isCooldown
                            ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                            : isCooldown
                            ? 'bg-amber-400'
                            : 'bg-rose-500'
                        )}
                      />
                      <span
                        className={cn(
                          'text-[10px] font-bold uppercase',
                          k.isActive && !isCooldown
                            ? 'text-emerald-400'
                            : isCooldown
                            ? 'text-amber-400'
                            : 'text-slate-500'
                        )}
                      >
                        {k.isActive && !isCooldown ? 'Faol' : isCooldown ? 'Kutish' : 'O\'chiq'}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                    {k.label}
                  </h4>
                  <div className="font-mono text-[11px] text-slate-400 truncate mt-0.5">
                    {k.maskedKey}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center space-x-1 text-emerald-400 font-semibold">
                    <CheckCircle className="w-3 h-3" />
                    <span>{k.successCount} ta javob</span>
                  </div>
                  <div className="flex items-center space-x-1 text-rose-400 font-semibold justify-end">
                    {k.failureCount > 0 && (
                      <>
                        <AlertTriangle className="w-3 h-3" />
                        <span>{k.failureCount} ta xato</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Live Test Result Badge */}
                {testRes && (
                  <div
                    className={cn(
                      'mt-2 p-2 rounded-xl text-[10px] font-mono flex items-center justify-between border',
                      testRes.success
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                    )}
                  >
                    <span>{testRes.success ? '✓ Aloqa barqaror' : '✗ Xato'}</span>
                    <span>{testRes.latencyMs}ms</span>
                  </div>
                )}

                {/* Actions Row */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      disabled={isTesting}
                      onClick={() => handleTestKey(k.id)}
                      title="Tezlikni sinash"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition disabled:opacity-50 text-[11px] flex items-center space-x-1"
                    >
                      <Zap className={cn('w-3 h-3 text-amber-400', isTesting && 'animate-spin')} />
                      <span>{isTesting ? '...' : 'Sinash'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDeleteConfirm(k.id)}
                      title="O'chirish"
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Custom Toggle Switch for Key */}
                  <CustomToggle
                    checked={k.isActive}
                    onChange={() => handleToggle(k.id)}
                    size="sm"
                    variant="emerald"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Key Form */}
      <div className="bg-[#0D1424]/80 border border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-2xl space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center space-x-2">
          <Plus className="w-4 h-4 text-sky-400" />
          <span>Yangi Gemini API Kalit Qo'shish</span>
        </h4>

        {addError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {addError}
          </div>
        )}

        <form onSubmit={handleAddKey} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Kalit Nomi (Ixtiyoriy)
            </label>
            <input
              type="text"
              placeholder="Masalan: Gemini Key 5"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              API Kalit (AIzaSy...) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="AIzaSy..."
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={adding || !newKey.trim()}
              className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-500/20 transition flex items-center justify-center space-x-1.5"
            >
              {adding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>Qo'shish</span>
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteKeyId !== null}
        onClose={() => setDeleteKeyId(null)}
        onConfirm={executeDelete}
        loading={deleting}
        title="API Kalitni o'chirish"
        description="Haqiqatan ham ushbu API kalitni rotatsiyadan o'chirib tashlamoqchimisiz? Kalit o'chirilsa, rotatsiya ro'yxatidan butunlay chiqariladi."
        confirmText="Ha, o'chirish"
        cancelText="Yo'q, bekor qilish"
        variant="danger"
      />
    </div>
  );
};

export default GeminiKeysTab;
