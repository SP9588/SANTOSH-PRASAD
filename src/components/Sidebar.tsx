import React from "react";
import {
  LayoutDashboard,
  Globe2,
  Share2,
  Send,
  FolderKanban,
  Sparkles,
  Calendar,
  Inbox,
  BarChart3,
  Music,
  Radio,
  Link2,
  Activity,
  ShieldCheck,
  Settings,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { LanguageCode, DICTIONARIES } from "../data/i18n";

export type ViewType =
  | "dashboard"
  | "networks"
  | "connections"
  | "publisher"
  | "content"
  | "ai-studio"
  | "calendar"
  | "inbox"
  | "analytics"
  | "music"
  | "podcasts"
  | "links"
  | "api-health"
  | "admin"
  | "settings";

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  currentLanguage: LanguageCode;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  connectedCount: number;
  unreadInboxCount: number;
  needsAttentionCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  currentLanguage,
  isMobileOpen,
  onCloseMobile,
  connectedCount,
  unreadInboxCount,
  needsAttentionCount,
}) => {
  const t = DICTIONARIES[currentLanguage];

  const navGroups = [
    {
      group: "MAIN",
      items: [
        { id: "dashboard", label: t.navDashboard, icon: LayoutDashboard },
        { id: "networks", label: t.navNetworks, icon: Globe2, badge: "80+" },
        {
          id: "connections",
          label: t.navConnections,
          icon: Share2,
          badge: `${connectedCount}`,
          alert: needsAttentionCount > 0,
        },
        { id: "publisher", label: t.navPublisher, icon: Send, highlight: true },
        { id: "content", label: t.navContent, icon: FolderKanban },
      ],
    },
    {
      group: "INTELLIGENCE & ENGAGEMENT",
      items: [
        { id: "ai-studio", label: t.navAiStudio, icon: Sparkles, badge: "Gemini 3.8" },
        { id: "calendar", label: t.navCalendar, icon: Calendar },
        {
          id: "inbox",
          label: t.navInbox,
          icon: Inbox,
          badge: unreadInboxCount > 0 ? `${unreadInboxCount}` : undefined,
        },
        { id: "analytics", label: t.navAnalytics, icon: BarChart3 },
      ],
    },
    {
      group: "MEDIA & DISTRIBUTION",
      items: [
        { id: "music", label: t.navMusic, icon: Music },
        { id: "podcasts", label: t.navPodcasts, icon: Radio },
        { id: "links", label: t.navLinks, icon: Link2 },
      ],
    },
    {
      group: "INFRASTRUCTURE & SECURITY",
      items: [
        { id: "api-health", label: t.navApiHealth, icon: Activity },
        { id: "admin", label: t.navAdmin, icon: ShieldCheck },
        { id: "settings", label: t.navSettings, icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto px-3 py-4">
      <div>
        {/* Brand Header */}
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white shadow-md shadow-indigo-500/20">
            <Share2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                Global Creator Hub
              </h1>
              <span className="rounded bg-indigo-100 px-1 py-0.2 text-[9px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                PRO
              </span>
            </div>
            <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
              Connect Once. Publish Everywhere.
            </p>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="space-y-5">
          {navGroups.map((group) => (
            <div key={group.group}>
              <div className="mb-1.5 px-2 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500">
                {group.group}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectView(item.id as ViewType);
                        onCloseMobile();
                      }}
                      className={`group relative flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-sm dark:bg-indigo-600"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`h-4 w-4 shrink-0 transition ${
                            isActive
                              ? "text-white"
                              : item.highlight
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "text-slate-500 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.alert && (
                          <ShieldAlert className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                        )}
                        {item.badge && (
                          <span
                            className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : item.id === "ai-studio"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                                : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account / Quota Footer */}
      <div className="mt-6 border-t border-slate-200 pt-3 dark:border-slate-800">
        <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-2.5 dark:border-slate-800/80 dark:bg-slate-800/50">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300">
            <span>OAuth Channels</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {connectedCount}/25
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${Math.min(100, (connectedCount / 25) * 100)}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              APIs Healthy
            </span>
            <span className="hover:underline cursor-pointer">Upgrade Plan</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex w-72 max-w-full flex-col bg-white shadow-2xl transition-all dark:bg-slate-900">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
