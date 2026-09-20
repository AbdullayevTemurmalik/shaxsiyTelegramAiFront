import axios from 'axios';

export const DEFAULT_RAILWAY_URL = 'https://shaxsiytelegramai-production.up.railway.app';

export const getBackendUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Clean up any legacy or corrupt keys
    ['JARVIS_BACKEND_URL', 'BACKEND_URL', 'API_URL', 'apiUrl'].forEach((k) => {
      try { localStorage.removeItem(k); } catch (_) {}
    });

    const saved = localStorage.getItem('BACKEND_API_URL');
    if (saved && saved.trim() && saved !== 'null' && saved !== 'undefined') {
      const clean = saved.trim().replace(/\/+$/, '');
      // If legacy localhost or relative path was saved, clear it and use Railway
      if (
        clean.includes('localhost') ||
        clean.includes('127.0.0.1') ||
        clean.startsWith('/') ||
        !clean.startsWith('http')
      ) {
        try { localStorage.removeItem('BACKEND_API_URL'); } catch (_) {}
        return DEFAULT_RAILWAY_URL;
      }
      return clean;
    }
  }

  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    const cleanEnv = envUrl.trim().replace(/\/+$/, '');
    if (cleanEnv.startsWith('http') && !cleanEnv.includes('localhost')) {
      return cleanEnv;
    }
  }

  return DEFAULT_RAILWAY_URL;
};

export const setBackendUrl = (url: string): void => {
  if (typeof window !== 'undefined') {
    const clean = url ? url.trim().replace(/\/+$/, '') : '';
    if (clean && clean.startsWith('http') && !clean.includes('localhost')) {
      localStorage.setItem('BACKEND_API_URL', clean);
    } else {
      localStorage.removeItem('BACKEND_API_URL');
    }
  }
};

const getApiBaseUrl = (): string => {
  const custom = getBackendUrl();
  if (custom && custom.startsWith('http')) {
    return custom.replace(/\/+$/, '') + '/api';
  }
  return DEFAULT_RAILWAY_URL + '/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  return config;
});

export interface AuthStatus {
  isConnected: boolean;
  isConnecting: boolean;
  phoneNumber: string | null;
  accountName: string | null;
  accountUsername: string | null;
  userId: string | null;
  hasSession: boolean;
}

export interface SettingsData {
  id?: number;
  systemPrompt: string;
  privateDmsEnabled: boolean;
  groupsEnabled: boolean;
  groupMentionOnly: boolean;
  channelsEnabled: boolean;
  typingDelayMin: number;
  typingDelayMax: number;
  maxContextMessages: number;
  ownerCooldownMinutes: number;
  geminiModel: string;
  isAiActive: boolean;
  jarvisEnabled: boolean;
  jarvisSystemPrompt?: string | null;
  voiceAnalysisEnabled: boolean;
  photoAnalysisEnabled: boolean;
  jarvisVoiceReplies: boolean;
  activeAiProvider?: string;
}

export interface GeminiKeyItem {
  id: number;
  label: string;
  maskedKey: string;
  isActive: boolean;
  failureCount: number;
  successCount: number;
  lastUsedAt: string | null;
  lastError: string | null;
  cooldownUntil: string | null;
  isCooldown: boolean;
}

export interface ChatItem {
  id: number;
  chatId: string;
  title: string | null;
  chatType: string;
  isAiStopped: boolean;
  isOwnerActive: boolean;
  manualOverrideUntil: string | null;
  lastMessageAt: string | null;
}

export interface ActivityLogItem {
  id: number;
  chatId: string;
  chatTitle: string | null;
  senderName: string | null;
  incomingMessage: string;
  outgoingResponse: string | null;
  usedApiKey: string | null;
  latencyMs: number | null;
  status: 'SUCCESS' | 'ERROR' | 'SKIPPED' | 'REVOKED' | string;
  error: string | null;
  createdAt: string;
}

export interface JarvisActionLogItem {
  id: number;
  userCommand: string;
  actionType: string;
  target: string | null;
  result: string;
  status: string;
  createdAt: string;
}

export interface StatsData {
  totalResponses: number;
  successfulResponses: number;
  failedResponses: number;
  activeKeys: number;
  activeChats: number;
  averageLatencyMs: number;
}

export const apiClient = {
  // Auth
  getStatus: async () => (await api.get<{ success: boolean; data: AuthStatus }>('/auth/status')).data,
  sendCode: async (apiId: number, apiHash: string, phoneNumber: string) =>
    (await api.post<{ success: boolean; message: string; data: { phoneCodeHash: string; tempSessionString?: string } }>('/auth/send-code', { apiId, apiHash, phoneNumber })).data,
  signIn: async (
    phoneNumber: string,
    phoneCode: string,
    phoneCodeHash: string,
    password?: string,
    apiId?: number,
    apiHash?: string,
    tempSessionString?: string
  ) =>
    (
      await api.post<{ success: boolean; needs2FA?: boolean; message?: string }>('/auth/sign-in', {
        phoneNumber,
        phoneCode,
        phoneCodeHash,
        password,
        apiId,
        apiHash,
        tempSessionString,
      })
    ).data,
  logout: async () => (await api.post<{ success: boolean; message: string }>('/auth/logout')).data,

  // Settings
  getSettings: async () => (await api.get<{ success: boolean; data: SettingsData }>('/settings')).data,
  updateSettings: async (settings: Partial<SettingsData>) =>
    (await api.put<{ success: boolean; data: SettingsData }>('/settings', settings)).data,

  // Keys
  getKeys: async () => (await api.get<{ success: boolean; data: GeminiKeyItem[] }>('/keys')).data,
  addKey: async (apiKey: string, label?: string) =>
    (await api.post<{ success: boolean; message: string; data: any }>('/keys', { apiKey, label })).data,
  toggleKey: async (id: number) =>
    (await api.patch<{ success: boolean; data: any }>(`/keys/${id}/toggle`)).data,
  deleteKey: async (id: number) =>
    (await api.delete<{ success: boolean; message: string }>(`/keys/${id}`)).data,
  testKey: async (id: number) =>
    (await api.post<{ success: boolean; data: { success: boolean; message: string; latencyMs: number } }>(`/keys/${id}/test`)).data,
  resetAllKeyErrors: async () =>
    (await api.post<{ success: boolean; message: string }>('/keys/reset-errors')).data,

  // Chats
  getChats: async () => (await api.get<{ success: boolean; data: ChatItem[] }>('/chats')).data,
  toggleChat: async (chatId: string) =>
    (await api.patch<{ success: boolean; data: any }>(`/chats/${chatId}/toggle`)).data,
  clearChatOverride: async (chatId: string) =>
    (await api.patch<{ success: boolean; data: any }>(`/chats/${chatId}/clear-override`)).data,
  deleteOutgoingMessages: async (chatId: string, count: number = 1) =>
    (await api.post<{ success: boolean; message: string; deletedCount: number }>('/messages/delete', { chatId, count })).data,

  // Logs & Stats
  getLogs: async (limit = 50) => (await api.get<{ success: boolean; data: ActivityLogItem[] }>(`/logs?limit=${limit}`)).data,
  getJarvisLogs: async (limit = 50) => (await api.get<{ success: boolean; data: JarvisActionLogItem[] }>(`/logs/jarvis?limit=${limit}`)).data,
  getStats: async () => (await api.get<{ success: boolean; data: StatsData }>('/logs/stats')).data,
  clearLogs: async () => (await api.delete<{ success: boolean; message: string }>('/logs')).data,
  clearJarvisLogs: async () => (await api.delete<{ success: boolean; message: string }>('/logs/jarvis')).data,

  // Test AI
  testAi: async (prompt?: string, text?: string) =>
    (await api.post<{ success: boolean; data: { reply: string; usedApiKey: string; latencyMs: number } }>('/test-ai', { prompt, text })).data,
};

export default apiClient;
