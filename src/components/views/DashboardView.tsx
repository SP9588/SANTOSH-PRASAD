import React from "react";
import {
  Users,
  Eye,
  Send,
  Calendar,
  Sparkles,
  TrendingUp,
  Share2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  Clock,
  Music,
} from "lucide-react";
import { PlatformConnection, ContentItem, ScheduledPost, Platform } from "../../types";

interface DashboardViewProps {
  connections: PlatformConnection[];
  contents: ContentItem[];
  scheduledPosts: ScheduledPost[];
  platforms: Platform[];
  onOpenConnectModal: () => void;
  onOpenPublisher: () => void;
  onOpenAiStudio: () => void;
  onSelectPlatform: (platform: Platform) => void;
  onNavigateToView: (view: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  connections,
  contents,
  scheduledPosts,
  platforms,
  onOpenConnectModal,
  onOpenPublisher,
  onOpenAiStudio,
  onSelectPlatform,
  onNavigateToView,
}) => {
  const totalFollowers = connections.reduce(
    (acc, curr) => acc + (curr.followersCount || 0),
    0
  );
  const needsReauthCount = connections.filter(
    (c) => c.status === "needs_reauthorization" || c.status === "expired"
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>AI-Powered Multi-Platform Orchestration</span>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">
            Connect Once. Create Once. Publish Everywhere.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
            Manage your authorized social, video, audio, publishing, and community channels.
            Transform master content into platform-native formats with Gemini AI.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenPublisher}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-indigo-900 shadow-md hover:bg-indigo-50 transition active:scale-95"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Create Universal Post</span>
            </button>
            <button
              onClick={onOpenAiStudio}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>AI Content Repurposer</span>
            </button>
            <button
              onClick={onOpenConnectModal}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Connect Channel</span>
            </button>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute right-0 -bottom-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-32 h-48 w-48 rounded-full bg-violet-500/20 blur-2xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Audience Reach
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              537.0K
            </span>
            <span className="flex items-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3 mr-0.5" /> +14.2%
            </span>
          </div>
          <span className="mt-1 block text-[11px] text-slate-400">
            Across 6 connected platforms
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Followers
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {(totalFollowers / 1000).toFixed(1)}K
            </span>
            <span className="flex items-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3 mr-0.5" /> +8.9%
            </span>
          </div>
          <span className="mt-1 block text-[11px] text-slate-400">
            Verified official sync
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Avg. Engagement Rate
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              9.1%
            </span>
            <span className="flex items-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              +1.8% vs benchmark
            </span>
          </div>
          <span className="mt-1 block text-[11px] text-slate-400">
            Top: Instagram Reels & YouTube
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Scheduled Queue
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {scheduledPosts.length} Posts
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Next in 4d
            </span>
          </div>
          <span className="mt-1 block text-[11px] text-slate-400">
            Auto-publishing configured
          </span>
        </div>
      </div>

      {/* Attention Required Banner (if any) */}
      {needsReauthCount > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                1 Connection Requires Reauthorization
              </h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">
                TikTok access token has expired according to platform security policy.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToView("connections")}
            className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-500"
          >
            Review Connections
          </button>
        </div>
      )}

      {/* Middle Split: Connected Channels Health & Scheduled Queue */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Connected Channels Panel (2 cols) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Authorized Accounts & Channel Health
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live official API status, token encryption, and synchronizations
              </p>
            </div>
            <button
              onClick={() => onNavigateToView("connections")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              View All ({connections.length}) →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {connections.map((conn) => {
              const isWarning =
                conn.status === "needs_reauthorization" || conn.status === "expired";
              return (
                <div
                  key={conn.id}
                  className="flex items-start justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={conn.profile_image_url}
                      alt={conn.account_name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {conn.platform_name}
                        </span>
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isWarning ? "bg-amber-400" : "bg-emerald-500"
                          }`}
                        />
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {conn.username}
                      </span>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{conn.followersCount?.toLocaleString()} followers</span>
                        <span>•</span>
                        <span>Health {conn.healthScore}%</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={conn.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Open on Platform"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scheduled Content Queue (1 col) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Upcoming Queue
            </h3>
            <button
              onClick={() => onNavigateToView("calendar")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Calendar →
            </button>
          </div>

          <div className="space-y-3">
            {scheduledPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 dark:border-slate-800 dark:bg-slate-800/40"
              >
                {post.thumbnail ? (
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                    {post.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(post.scheduled_time).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {post.isAiSuggestedTime && (
                      <span className="rounded bg-purple-100 px-1 py-0.2 font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                        AI Optimal
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex gap-1">
                    {post.platforms.map((p) => (
                      <span
                        key={p}
                        className="rounded bg-slate-200/70 px-1 py-0.2 text-[9px] font-semibold uppercase text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Platforms Directory Preview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Discover Supported Networks
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browse 80+ official integrations across Social, Video, Music, Podcasts, Business, Community, and Publishing
            </p>
          </div>
          <button
            onClick={() => onNavigateToView("networks")}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            <span>Explore All 80+ Networks</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {platforms.slice(0, 6).map((plat) => (
            <div
              key={plat.id}
              onClick={() => onSelectPlatform(plat)}
              className="group cursor-pointer rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 text-center transition hover:border-indigo-400 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-indigo-500"
            >
              <div
                className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-xs transition group-hover:scale-105"
                style={{ backgroundColor: plat.brandColor }}
              >
                <Share2 className="h-5 w-5" />
              </div>
              <h4 className="mt-2.5 truncate text-xs font-bold text-slate-900 dark:text-white">
                {plat.name}
              </h4>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {plat.category}
              </span>
              <div className="mt-2 flex justify-center">
                {plat.oauth_supported ? (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                    <Zap className="h-2.5 w-2.5" /> OAuth 2.0
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">Link Only</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
