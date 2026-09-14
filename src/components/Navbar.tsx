import React, { useState } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  Plus,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Menu,
  Database,
} from "lucide-react";
import { LanguageCode, DICTIONARIES } from "../data/i18n";

interface NavbarProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenConnectModal: () => void;
  onOpenPublisher: () => void;
  onToggleMobileSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  connectedCount: number;
  backendConnected?: boolean;
  totalDbRecords?: number;
  onOpenDatabase?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  isDarkMode,
  onToggleDarkMode,
  onOpenConnectModal,
  onOpenPublisher,
  onToggleMobileSidebar,
  searchQuery,
  onSearchChange,
  connectedCount,
  backendConnected = true,
  totalDbRecords,
  onOpenDatabase,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = DICTIONARIES[currentLanguage];

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
  ];

  const notifications = [
    {
      id: "n1",
      title: "YouTube Video Synced",
      desc: "Cinematic Journey views hit 184.5K milestone",
      time: "14m ago",
      type: "success",
    },
    {
      id: "n2",
      title: "TikTok Token Warning",
      desc: "Re-authorization required for @auraclips",
      time: "2h ago",
      type: "warning",
    },
    {
      id: "n3",
      title: "Scheduled Release Ready",
      desc: "Echoes of Eternity master will dispatch in 4 days",
      time: "5h ago",
      type: "info",
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Universal Search Bar */}
        <div className="relative hidden w-72 sm:block md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="h-9 w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-8 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Full-Stack Database Status Badge */}
        <button
          onClick={onOpenDatabase}
          className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/80 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
          title="Backend Database Connected & Active"
        >
          <Database className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>DB Linked {totalDbRecords ? `(${totalDbRecords})` : ""}</span>
        </button>

        {/* Language Picker */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Globe className="h-4 w-4 text-slate-500" />
            <span className="uppercase">{currentLanguage}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl transition-all dark:border-slate-700 dark:bg-slate-800 z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-1.5 text-xs text-left transition ${
                    currentLanguage === lang.code
                      ? "bg-indigo-50 font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
                  {currentLanguage === lang.code && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark/Light Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500"></span>
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl transition-all dark:border-slate-700 dark:bg-slate-800 z-50">
              <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-700">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Activity Feed
                </span>
                <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                  {connectedCount} Connected
                </span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-2.5 rounded-lg p-2 transition hover:bg-slate-50 dark:hover:bg-slate-700/40"
                  >
                    {n.type === "warning" ? (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{n.title}</p>
                      <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{n.desc}</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <button
          onClick={onOpenConnectModal}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:border-indigo-800/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
        >
          <Zap className="h-3.5 w-3.5" />
          <span>{t.connectNetwork}</span>
        </button>

        <button
          onClick={onOpenPublisher}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.98] dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{t.publishContent}</span>
        </button>
      </div>
    </header>
  );
};
