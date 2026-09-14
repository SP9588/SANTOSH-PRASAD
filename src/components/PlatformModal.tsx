import React from "react";
import {
  X,
  ExternalLink,
  Shield,
  Zap,
  Check,
  Ban,
  Code2,
  FileText,
  Globe,
  Share2,
} from "lucide-react";
import { Platform } from "../types";

interface PlatformModalProps {
  platform: Platform | null;
  onClose: () => void;
  onConnect: (platform: Platform) => void;
  isConnected: boolean;
}

export const PlatformModal: React.FC<PlatformModalProps> = ({
  platform,
  onClose,
  onConnect,
  isConnected,
}) => {
  if (!platform) return null;

  const caps = platform.capabilities;

  const capabilityRows = [
    { label: "Profile & Identity Read", val: caps.profile },
    { label: "Feed Posts & Status Updates", val: caps.posts },
    { label: "Video Publishing (Long/Standard)", val: caps.videos },
    { label: "Image & Carousel Publishing", val: caps.images },
    { label: "Short-form Reels / Shorts", val: Boolean(caps.reels) },
    { label: "Ephemeral Stories", val: Boolean(caps.stories) },
    { label: "Comment Moderation & Replies", val: caps.comments },
    { label: "Direct Messaging / Webhooks", val: caps.messages },
    { label: "Audience & Follower Metrics", val: caps.followers },
    { label: "Performance Insights & Analytics", val: caps.analytics },
    { label: "Direct Publishing API", val: caps.publishing },
    { label: "Scheduled Dispatch Queue", val: caps.scheduling },
    { label: "Real-time Event Webhooks", val: caps.webhooks },
    { label: "Music ISRC / DSP Metadata", val: Boolean(caps.musicMetadata) },
    { label: "Podcast RSS Ingestion", val: Boolean(caps.podcastData) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 pr-8">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
            style={{ backgroundColor: platform.brandColor }}
          >
            <Share2 className="h-7 w-7" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {platform.name}
              </h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {platform.category}
              </span>
              <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-slate-500 dark:border-slate-700 dark:text-slate-400">
                {platform.regions.join(", ")}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {platform.description}
            </p>
          </div>
        </div>

        {/* Canonical Hyperlinks to Official Portals */}
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <a
            href={platform.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-indigo-500" />
              Official Website
            </span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>

          <a
            href={platform.developer_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className="flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5 text-indigo-500" />
              Developer Portal
            </span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>

          <a
            href={platform.documentation_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-500" />
              API Documentation
            </span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
        </div>

        {/* API Capability Matrix */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Verified Official API Capability Matrix
            </h3>
            <span className="text-[10px] text-slate-400">
              Sourced from official platform specs
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
            {capabilityRows.map((row, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-white/60 dark:hover:bg-slate-700/40"
              >
                <span className="text-slate-700 dark:text-slate-300">
                  {row.label}
                </span>
                {row.val ? (
                  <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
                    <Check className="h-3.5 w-3.5" /> Supported
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-medium text-slate-400 dark:text-slate-500 text-[11px]">
                    <Ban className="h-3.5 w-3.5" /> Not supported
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scopes and Requirements */}
        {platform.requiredScopes && platform.requiredScopes.length > 0 && (
          <div className="mt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Required OAuth 2.0 Scopes
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {platform.requiredScopes.map((scope, idx) => (
                <code
                  key={idx}
                  className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-indigo-600 dark:bg-slate-800 dark:text-indigo-400"
                >
                  {scope}
                </code>
              ))}
            </div>
          </div>
        )}

        {/* Integration Status Notice */}
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/60 dark:bg-amber-950/20">
          <div className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <span className="font-semibold">Security & API Policy: </span>
              All credentials and access tokens are secured server-side with
              encryption. The Hub never scrapes, bypasses rate limits, or fabricates
              unauthorized capabilities.
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Close
          </button>

          {platform.oauth_supported ? (
            <button
              onClick={() => {
                onConnect(platform);
                onClose();
              }}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              <Zap className="h-4 w-4" />
              <span>{isConnected ? "Re-authorize Account" : "Connect Account"}</span>
            </button>
          ) : (
            <a
              href={platform.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 dark:bg-slate-700"
            >
              <span>Visit Platform Portal (Link Only)</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
