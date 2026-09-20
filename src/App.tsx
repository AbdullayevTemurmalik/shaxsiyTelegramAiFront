import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StatusCard } from './components/StatusCard';
import { TelegramLoginModal } from './components/TelegramLoginModal';
import { SettingsTab } from './components/SettingsTab';
import { GeminiKeysTab } from './components/GeminiKeysTab';
import { ChatsTab } from './components/ChatsTab';
import { LogsTab } from './components/LogsTab';
import { ConfirmModal } from './components/common/ConfirmModal';
import apiClient, {
  AuthStatus,
  SettingsData,
  GeminiKeyItem,
  ChatItem,
  ActivityLogItem,
  StatsData,
} from './api/client';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [keys, setKeys] = useState<GeminiKeyItem[]>([]);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statusRes, settingsRes, keysRes, chatsRes, logsRes, statsRes] = await Promise.allSettled([
        apiClient.getStatus(),
        apiClient.getSettings(),
        apiClient.getKeys(),
        apiClient.getChats(),
        apiClient.getLogs(50),
        apiClient.getStats(),
      ]);

      if (statusRes.status === 'fulfilled' && statusRes.value.success) {
        setAuthStatus(statusRes.value.data);
      }
      if (settingsRes.status === 'fulfilled' && settingsRes.value.success) {
        setSettings(settingsRes.value.data);
      }
      if (keysRes.status === 'fulfilled' && keysRes.value.success) {
        setKeys(keysRes.value.data);
      }
      if (chatsRes.status === 'fulfilled' && chatsRes.value.success) {
        setChats(chatsRes.value.data);
      }
      if (logsRes.status === 'fulfilled' && logsRes.value.success) {
        setLogs(logsRes.value.data);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setStats(statsRes.value.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Auto-refresh stats and status every 10 seconds
    const timer = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(timer);
  }, [fetchData]);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  const handleOpenLogoutConfirm = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await apiClient.logout();
      setIsLogoutModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleToggleMasterAi = async (enabled: boolean) => {
    try {
      await apiClient.updateSettings({ isAiActive: enabled });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (updated: Partial<SettingsData>) => {
    const res = await apiClient.updateSettings(updated);
    if (res.success && res.data) {
      setSettings(res.data);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col relative selection:bg-sky-500/30 selection:text-sky-200">
      {/* Background Cyber Glow Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[140px]" />
      </div>

      {/* Top Navigation */}
      <Navbar
        status={authStatus}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleOpenLogoutConfirm}
        onRefresh={fetchData}
        loading={loading}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-6 md:py-8 pb-24 lg:pb-8 space-y-4 sm:space-y-6 md:space-y-8 overflow-x-hidden">
        {/* Connection status & Hero section (always visible on dashboard) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <StatusCard
              status={authStatus}
              stats={stats}
              settings={settings}
              keys={keys}
              onToggleMasterAi={handleToggleMasterAi}
              onUpdateSettings={handleSaveSettings}
              onOpenLogin={() => setIsLoginModalOpen(true)}
              onLogout={handleOpenLogoutConfirm}
              onNavigateTab={setActiveTab}
            />

            {/* Quick Activity Terminal Preview on Dashboard */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Oxirgi Xabarlar va Javoblar Jurnali
                </h3>
                <button
                  onClick={() => setActiveTab('logs')}
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
                >
                  Barcha jurnallar ({logs.length} ta) →
                </button>
              </div>

              <LogsTab logs={logs.slice(0, 5)} onRefresh={fetchData} compact />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <SettingsTab settings={settings} onSave={handleSaveSettings} />
        )}

        {activeTab === 'keys' && (
          <GeminiKeysTab keys={keys} onRefresh={fetchData} />
        )}

        {activeTab === 'chats' && (
          <ChatsTab chats={chats} onRefresh={fetchData} />
        )}

        {activeTab === 'logs' && (
          <LogsTab logs={logs} onRefresh={fetchData} />
        )}
      </main>

      {/* Telegram Login Modal with Strict Uzbekistan Phone Mask */}
      <TelegramLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsLoginModalOpen(false);
          fetchData();
        }}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        loading={loggingOut}
        title="Telegram akkauntidan chiqish"
        description="Haqiqatan ham ulangan Telegram akkauntidan chiqmoqchimisiz? Chiqqaningizdan so'ng AI xabarlarga avtomatik javob berishni to'xtatadi va qayta ulanish uchun yangi SMS kod olishingiz kerak bo'ladi."
        confirmText="Ha, akkauntdan chiqish"
        cancelText="Yo'q, qolish"
        variant="danger"
      />
    </div>
  );
}

export default App;
