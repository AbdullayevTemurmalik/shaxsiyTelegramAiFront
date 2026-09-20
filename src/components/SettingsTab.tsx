import React, { useState } from 'react';
import {
  Save,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  Loader2,
  Bot,
  Cpu,
  Clock,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { SettingsData } from '../api/client';
import apiClient from '../api/client';
import { CustomSelect, SelectOption } from './common/CustomSelect';
import { CustomToggle } from './common/CustomToggle';
import { ConfirmModal } from './common/ConfirmModal';

interface SettingsTabProps {
  settings: SettingsData | null;
  onSave: (updated: Partial<SettingsData>) => Promise<void>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ settings, onSave }) => {
  const [form, setForm] = useState<SettingsData>({
    systemPrompt: settings?.systemPrompt || `Sen Telegram akkaunt egasining nomidan javob berayotgan shaxsiy yordamchisan. 
Suhbatdoshing bilan samimiy, do'stona, qisqa va tabiiy o'zbek tilida gaplash.
Hech qachon "Men sun'iy intellektman", "Men AI botman" kabi jumlalarni ishlatma. 
Haqiqiy inson qanday yozsa, xuddi shunday tabiiy, lo'nda va samimiy javob qaytar.`,
    privateDmsEnabled: settings?.privateDmsEnabled ?? true,
    groupsEnabled: settings?.groupsEnabled ?? false,
    groupMentionOnly: settings?.groupMentionOnly ?? true,
    channelsEnabled: settings?.channelsEnabled ?? false,
    typingDelayMin: settings?.typingDelayMin ?? 2,
    typingDelayMax: settings?.typingDelayMax ?? 4,
    maxContextMessages: settings?.maxContextMessages ?? 8,
    ownerCooldownMinutes: settings?.ownerCooldownMinutes ?? 10,
    geminiModel: settings?.geminiModel || 'gemini-3.6-flash',
    isAiActive: settings?.isAiActive ?? true,
    jarvisEnabled: settings?.jarvisEnabled ?? true,
    jarvisSystemPrompt: settings?.jarvisSystemPrompt ?? `Sening isming JARVIS. Sen egangga xizmat qiluvchi o'ta odobli, aqlli, tezkor va sadoqatli shaxsiy intellektual yordamchisan.
SENING ASOSIY VAZIFALARING:
1. Eganging bergan topshiriqlarini bajarish uchun mos instrumentlarni (Tools / Function Calling) chaqirish.
2. Natijalar haqida egangga "Bajarildi, ser", "Xabar yetkazildi", "Ma'lumotlar tayyor, ser" kabi qisqa, xushmuomala va aniq hisobot berish.
3. Keraksiz ortiqcha gaplarsiz, ixcham va oliyjanob muloqot qil.`,
    voiceAnalysisEnabled: settings?.voiceAnalysisEnabled ?? true,
    photoAnalysisEnabled: settings?.photoAnalysisEnabled ?? true,
    jarvisVoiceReplies: settings?.jarvisVoiceReplies ?? false,
    activeAiProvider: settings?.activeAiProvider || 'auto_rotate',
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetPromptType, setResetPromptType] = useState<'auto' | 'jarvis' | null>(null);

  const handleConfirmResetPrompt = () => {
    if (resetPromptType === 'auto') {
      setForm((prev) => ({
        ...prev,
        systemPrompt: `Sen Telegram akkaunt egasining nomidan javob berayotgan shaxsiy yordamchisan. 
Suhbatdoshing bilan samimiy, do'stona, qisqa va tabiiy o'zbek tilida gaplash.
Hech qachon "Men sun'iy intellektman", "Men AI botman" kabi jumlalarni ishlatma. 
Haqiqiy inson qanday yozsa, xuddi shunday tabiiy, lo'nda va samimiy javob qaytar.`,
      }));
    } else if (resetPromptType === 'jarvis') {
      setForm((prev) => ({
        ...prev,
        jarvisSystemPrompt: `Sening isming JARVIS. Sen egangga xizmat qiluvchi o'ta odobli, aqlli, tezkor va sadoqatli shaxsiy intellektual yordamchisan.
SENING ASOSIY VAZIFALARING:
1. Eganging bergan topshiriqlarini bajarish uchun mos instrumentlarni (Tools / Function Calling) chaqirish.
2. Natijalar haqida egangga "Bajarildi, ser", "Xabar yetkazildi", "Ma'lumotlar tayyor, ser" kabi qisqa, xushmuomala va aniq hisobot berish.
3. Keraksiz ortiqcha gaplarsiz, ixcham va oliyjanob muloqot qil.`,
      }));
    }
    setResetPromptType(null);
  };

  // Playground state
  const [testInput, setTestInput] = useState('Salom, qayerdasiz? Bugun uchrashamizmi?');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testLatency, setTestLatency] = useState<number | null>(null);
  const [testKeyUsed, setTestKeyUsed] = useState<string | null>(null);
  const [testingAi, setTestingAi] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await onSave(form);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleRunAiTest = async () => {
    if (!testInput.trim()) return;
    setTestingAi(true);
    setTestError(null);
    setTestResult(null);

    try {
      const res = await apiClient.testAi(form.systemPrompt, testInput.trim());
      if (res.success && res.data) {
        setTestResult(res.data.reply);
        setTestLatency(res.data.latencyMs);
        setTestKeyUsed(res.data.usedApiKey);
      }
    } catch (err: any) {
      setTestError(err.response?.data?.error || err.message || 'Xatolik yuz berdi.');
    } finally {
      setTestingAi(false);
    }
  };

  // Model options for CustomSelect
  const modelOptions: SelectOption[] = [
    {
      value: 'gemini-3.6-flash',
      label: 'Gemini 3.6 Flash',
      description: 'Eng tezkor, arzon va zamonaviy multimodal model (Tavsiya etiladi)',
      badge: 'Tavsiya',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      value: 'gemini-2.5-flash',
      label: 'Gemini 2.5 Flash',
      description: 'Tejamkor va barqaror muloqot modeli',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      value: 'gemini-2.5-pro',
      label: 'Gemini 2.5 Pro',
      description: 'Yuqori aql, murakkab mantiq va chuqur tahlil',
      badge: 'Pro',
      icon: <Cpu className="w-4 h-4" />,
    },
  ];

  // AI Provider options for CustomSelect
  const providerOptions: SelectOption[] = [
    {
      value: 'auto_rotate',
      label: 'Avtomatik Rotatsiya (Barcha AIlar)',
      description: 'Gemini 4x + OpenAI 3x + Grok 3x o\'rtasida uzluksiz yuklama taqsimoti',
      badge: 'Maksimal Barqarorlik',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      icon: <Bot className="w-4 h-4" />,
    },
    {
      value: 'gemini_only',
      label: 'Faqat Google Gemini (4x Kalit)',
      description: 'Gemini 3.6 Flash round-robin rotatsiyasi orqali',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      value: 'openai_only',
      label: 'Faqat OpenAI GPT-4o-mini (3x Kalit)',
      description: 'GPT-4o-mini API kalitlari rotatsiyasi orqali',
      icon: <Cpu className="w-4 h-4" />,
    },
    {
      value: 'grok_only',
      label: 'Faqat xAI Grok-2 (3x Kalit)',
      description: 'xAI Grok-2 API orqali',
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Top Sticky Action Bar */}
        <div className="bg-[#0D1424]/90 border border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              AI Userbot & Assistent Sozlamalari
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Qoidalarni, botning insoniy xatti-harakatini va ishlash maydonlarini boshqaring.
            </p>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
            {savedSuccess && (
              <span className="flex items-center space-x-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 sm:px-3 py-1.5 rounded-xl animate-fadeIn truncate">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="truncate">Saqlandi!</span>
              </span>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto justify-center flex items-center space-x-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-sky-500/25 transition transform active:scale-95"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saqlanmoqda...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>O'zgarishlarni Saqlash</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Grid of Settings Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1: AI Provider & Model Config */}
          <div className="bg-[#0D1424]/80 border border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-800/80 pb-4">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">AI Provayder va Model</h4>
                <p className="text-[11px] text-slate-400">Generatsiya qiluvchi sun'iy intellekt modeli</p>
              </div>
            </div>

            {/* Custom Select: AI Provider */}
            <CustomSelect
              label="Faol AI Provayderi"
              value={form.activeAiProvider || 'auto_rotate'}
              onChange={(val) => setForm({ ...form, activeAiProvider: val })}
              options={providerOptions}
            />

            {/* Custom Select: Gemini Model */}
            <CustomSelect
              label="Gemini Modeli"
              value={form.geminiModel}
              onChange={(val) => setForm({ ...form, geminiModel: val })}
              options={modelOptions}
            />

            {/* Master AI Toggle inside Card */}
            <div className="pt-2 border-t border-slate-800/80">
              <CustomToggle
                label="Bosh AI Faolligi"
                description="Butun avtomatik javob berish tizimini global yoqish yoki to'xtatish"
                checked={form.isAiActive}
                onChange={(val) => setForm({ ...form, isAiActive: val })}
                size="md"
                variant="sky"
                showIcon
              />
            </div>
          </div>

          {/* Card 2: Chat Scope & Rules */}
          <div className="bg-[#0D1424]/80 border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-800/80 pb-4">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Ishlash Qoidalari va Maydonlari</h4>
                <p className="text-[11px] text-slate-400">Qaysi chatlarda AI avtomatik javob berishi kerak</p>
              </div>
            </div>

            <div className="space-y-4">
              <CustomToggle
                label="Shaxsiy Chatlar (DMs)"
                description="Odamlar sizga to'g'ridan-to'g'ri yozganda AI nomingizdan javob beradi"
                checked={form.privateDmsEnabled}
                onChange={(val) => setForm({ ...form, privateDmsEnabled: val })}
                size="md"
                variant="sky"
              />

              <CustomToggle
                label="Guruhlar (Groups)"
                description="Guruhlardagi xabarlarga AI javob berishini yoqish"
                checked={form.groupsEnabled}
                onChange={(val) => setForm({ ...form, groupsEnabled: val })}
                size="md"
                variant="emerald"
              />

              {form.groupsEnabled && (
                <div className="pl-4 border-l-2 border-slate-800 animate-fadeIn">
                  <CustomToggle
                    label="Faqat Mention Bo'lganda (@tag)"
                    description="Guruhdagi har bir xabarga emas, faqat sizni belgilashganda javob beradi"
                    checked={form.groupMentionOnly}
                    onChange={(val) => setForm({ ...form, groupMentionOnly: val })}
                    size="sm"
                    variant="indigo"
                  />
                </div>
              )}

              <CustomToggle
                label="Kanallar (Channels)"
                description="Kanal muhokamalarida (kommentariyalarda) ishlash"
                checked={form.channelsEnabled}
                onChange={(val) => setForm({ ...form, channelsEnabled: val })}
                size="md"
                variant="indigo"
              />
            </div>
          </div>

          {/* Card 3: Human Simulation & Delays */}
          <div className="bg-[#0D1424]/80 border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-800/80 pb-4">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Insoniy Xatti-Harakat (Anti-Ban)</h4>
                <p className="text-[11px] text-slate-400">Typing taqlidi va egasi yozgandagi tanaffus</p>
              </div>
            </div>

            {/* Typing Delay Min - Max */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">
                  Xabar Yozish Taqlidi (Typing Simulation):
                </span>
                <span className="font-mono text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded-lg">
                  {form.typingDelayMin}s - {form.typingDelayMax}s
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Minimal (soniya)</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={form.typingDelayMin}
                    onChange={(e) =>
                      setForm({ ...form, typingDelayMin: parseInt(e.target.value, 10) || 1 })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Maksimal (soniya)</label>
                  <input
                    type="number"
                    min={2}
                    max={30}
                    value={form.typingDelayMax}
                    onChange={(e) =>
                      setForm({ ...form, typingDelayMax: parseInt(e.target.value, 10) || 2 })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Owner Cooldown & Context History */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Ega Cooldown (daqiqa):</span>
                  <span className="font-mono text-amber-400 font-bold">{form.ownerCooldownMinutes}m</span>
                </div>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={form.ownerCooldownMinutes}
                  onChange={(e) =>
                    setForm({ ...form, ownerCooldownMinutes: parseInt(e.target.value, 10) || 10 })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  O'zingiz qo'lda xabar yozganingizda AI shu muddatga to'xtaydi.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Kontekst Xotirasi:</span>
                  <span className="font-mono text-emerald-400 font-bold">{form.maxContextMessages} ta</span>
                </div>
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={form.maxContextMessages}
                  onChange={(e) =>
                    setForm({ ...form, maxContextMessages: parseInt(e.target.value, 10) || 8 })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Suhbat mavzusini eslab qolish uchun oxirgi xabarlar soni.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Multimodal Alerts & JARVIS Modules */}
          <div className="bg-[#0D1424]/80 border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-800/80 pb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Multimodal Monitoring & JARVIS</h4>
                <p className="text-[11px] text-slate-400">Ovoz, rasm tahlili va shaxsiy ijrochi yordamchi</p>
              </div>
            </div>

            <div className="space-y-4">
              <CustomToggle
                label="Ovozli Xabarlar Tahlili (Voice Alert)"
                description="Kimdir ovoz yuborsa, Gemini audio ichidagi nutqni matnga o'girib Izbrannoega hisobot qiladi"
                checked={form.voiceAnalysisEnabled}
                onChange={(val) => setForm({ ...form, voiceAnalysisEnabled: val })}
                size="md"
                variant="emerald"
              />

              <CustomToggle
                label="Rasmlar Tahlili (Photo Alert)"
                description="Kimdir rasm yuborsa, Gemini rasm ichidagi matn va obyektlarni tahlil qilib hisobot qiladi"
                checked={form.photoAnalysisEnabled}
                onChange={(val) => setForm({ ...form, photoAnalysisEnabled: val })}
                size="md"
                variant="sky"
              />

              <CustomToggle
                label="JARVIS Shaxsiy Assistent (Saved Messages)"
                description="Izbrannoega berilgan buyruqlaringizni Function Calling orqali bajaradi"
                checked={form.jarvisEnabled}
                onChange={(val) => setForm({ ...form, jarvisEnabled: val })}
                size="md"
                variant="indigo"
              />

              <CustomToggle
                label="JARVIS Ovozli Javob Qaytarsin (xAI TTS)"
                description="JARVIS natijalarni xAI TTS orqali sizga audio xabar qilib yuboradi"
                checked={form.jarvisVoiceReplies}
                onChange={(val) => setForm({ ...form, jarvisVoiceReplies: val })}
                size="sm"
                variant="indigo"
              />
            </div>
          </div>
        </div>

        {/* System Prompt Editors: Full Width */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prompt 1: Auto-Responder Prompt */}
          <div className="bg-[#0D1424]/80 border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-sky-400" />
                <h4 className="text-sm font-bold text-white">Auto-Responder System Prompt</h4>
              </div>
              <button
                type="button"
                onClick={() => setResetPromptType('auto')}
                title="Boshlang'ich holatga qaytarish"
                className="text-[11px] text-slate-400 hover:text-sky-400 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Qaytarish</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Bu prompt begonalar sizga yozganda AI o'zini qanday tutishi va qanday tilda javob berishini belgilaydi.
            </p>

            <textarea
              rows={8}
              value={form.systemPrompt}
              onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
              className="w-full p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs sm:text-sm font-mono text-sky-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 leading-relaxed"
            />
          </div>

          {/* Prompt 2: JARVIS Prompt */}
          <div className="bg-[#0D1424]/80 border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">JARVIS Assistent System Prompt</h4>
              </div>
              <button
                type="button"
                onClick={() => setResetPromptType('jarvis')}
                title="Boshlang'ich holatga qaytarish"
                className="text-[11px] text-slate-400 hover:text-indigo-400 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Qaytarish</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Saved Messages (Izbrannoe) ga buyruq berganingizda JARVIS sizga qanday ohangda javob berishini belgilaydi.
            </p>

            <textarea
              rows={8}
              value={form.jarvisSystemPrompt || ''}
              onChange={(e) => setForm({ ...form, jarvisSystemPrompt: e.target.value })}
              className="w-full p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs sm:text-sm font-mono text-indigo-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 leading-relaxed"
            />
          </div>
        </div>

        {/* AI Playground: Test Prompt in Real-Time */}
        <div className="bg-[#0D1424]/80 border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white">
                Prompt Sinov Maydoni (Real-time Playground)
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">
              Ushbu prompt bilan AI qanday javob qaytarishini sinab ko'ring
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Sinov uchun kiruvchi xabar:
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Masalan: Salom, bugun bo'shmisiz?"
                  className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
                <button
                  type="button"
                  disabled={testingAi || !testInput.trim()}
                  onClick={handleRunAiTest}
                  className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md shadow-sky-500/25 transition flex items-center space-x-1.5"
                >
                  {testingAi ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  <span>Tekshirish</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  AI Javobi:
                </label>
                {testLatency && (
                  <span className="text-[10px] text-amber-400 font-mono">
                    Tezlik: {(testLatency / 1000).toFixed(1)}s • {testKeyUsed}
                  </span>
                )}
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl min-h-[42px] text-xs">
                {testingAi ? (
                  <span className="text-slate-500 italic flex items-center space-x-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Gemini generatsiya qilmoqda...</span>
                  </span>
                ) : testError ? (
                  <span className="text-rose-400">{testError}</span>
                ) : testResult ? (
                  <span className="text-sky-200 font-medium">{testResult}</span>
                ) : (
                  <span className="text-slate-500 italic">
                    Sinov natijasi shu yerda ko'rinadi
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Reset Prompt Confirmation Modal */}
      <ConfirmModal
        isOpen={resetPromptType !== null}
        onClose={() => setResetPromptType(null)}
        onConfirm={handleConfirmResetPrompt}
        title={
          resetPromptType === 'auto'
            ? "Auto-responder promptini qaytarish"
            : "JARVIS promptini qaytarish"
        }
        description="Haqiqatan ham ushbu tizim promptini standart holatga qaytarmoqchimisiz? Yozgan barcha shaxsiy o'zgarishlaringiz o'chiriladi va asl holatiga keltiriladi."
        confirmText="Ha, qaytarish"
        cancelText="Yo'q, bekor qilish"
        variant="warning"
      />
    </div>
  );
};

export default SettingsTab;
