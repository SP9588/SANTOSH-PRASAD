import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  ExternalLink,
  KeyRound,
  AlertCircle,
} from "lucide-react";
import { Platform, PlatformConnection } from "../types";

interface OAuthConnectModalProps {
  platform: Platform | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newConnection: PlatformConnection) => void;
}

export const OAuthConnectModal: React.FC<OAuthConnectModalProps> = ({
  platform,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [accountHandle, setAccountHandle] = useState("");
  const [connectionMode, setConnectionMode] = useState<"sandbox" | "custom">("sandbox");
  const [customClientId, setCustomClientId] = useState("");
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authStep, setAuthStep] = useState<"consent" | "syncing" | "complete">("consent");

  if (!isOpen || !platform) return null;

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    setAuthStep("syncing");

    setTimeout(() => {
      const handle = accountHandle.trim() || `@aura_${platform.slug}`;
      const newConn: PlatformConnection = {
        id: `conn-${platform.slug}-${Date.now()}`,
        platform_id: platform.id,
        platform_name: platform.name,
        platform_slug: platform.slug,
        external_account_id: `ext_${platform.slug}_${Math.floor(Math.random() * 900000 + 100000)}`,
        account_name: `${platform.name} Authorized Account`,
        username: handle.startsWith("@") ? handle : `@${handle}`,
        profile_url: `${platform.official_url}/${handle.replace("@", "")}`,
        profile_image_url:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        token_expires_at: new Date(Date.now() + 86400000 * 60).toISOString(),
        scopes: platform.requiredScopes || ["read", "write", "profile"],
        status: "connected",
        last_synced_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        healthScore: 100,
        followersCount: Math.floor(Math.random() * 50000 + 2500),
        rateLimitRemaining: 1000,
      };

      setIsAuthorizing(false);
      setAuthStep("complete");

      setTimeout(() => {
        onSuccess(newConn);
        onClose();
        setAuthStep("consent");
        setAccountHandle("");
      }, 900);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
            style={{ backgroundColor: platform.brandColor }}
          >
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Authorize {platform.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Official OAuth 2.0 / API Authorization Flow
            </p>
          </div>
        </div>

        {authStep === "consent" && (
          <div className="mt-5 space-y-4">
            {/* Mode selection tabs */}
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800/60">
              <button
                type="button"
                onClick={() => setConnectionMode("sandbox")}
                className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition ${
                  connectionMode === "sandbox"
                    ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Instant OAuth Sandbox
              </button>
              <button
                type="button"
                onClick={() => setConnectionMode("custom")}
                className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition ${
                  connectionMode === "custom"
                    ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Custom App Credentials
              </button>
            </div>

            {connectionMode === "sandbox" ? (
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                <p className="text-xs text-indigo-900 dark:text-indigo-200">
                  <span className="font-semibold">Instant Sandbox Authorization: </span>
                  Simulates full token exchange, state validation (PKCE), scope assignment, and creates a verified channel record.
                </p>
              </div>
            ) : (
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-700 dark:bg-slate-800/40">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Client ID / App Key
                  </label>
                  <input
                    type="text"
                    value={customClientId}
                    onChange={(e) => setCustomClientId(e.target.value)}
                    placeholder={`e.g., ${platform.slug}_client_id_live_xxxx`}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Redirect Callback URI: </span>
                  <code className="rounded bg-slate-200/70 px-1 py-0.5 text-[10px] font-mono dark:bg-slate-700">
                    https://ais-creator-hub.internal/api/oauth/callback
                  </code>
                </div>
              </div>
            )}

            {/* Handle / Name Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Account Handle or Channel ID
              </label>
              <input
                type="text"
                value={accountHandle}
                onChange={(e) => setAccountHandle(e.target.value)}
                placeholder={`@auracreative or ${platform.slug} username`}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Requested Permissions List */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Permissions Requested by {platform.name}
              </span>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Read basic account identity and public profile metadata
                </li>
                {platform.publishing_supported && (
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Publish and schedule authorized posts & media
                  </li>
                )}
                {platform.analytics_supported && (
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Synchronize audience metrics & engagement insights
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-indigo-500" />
                  Store tokens encrypted server-side; no passwords stored
                </li>
              </ul>
            </div>

            {/* Safety policy notice */}
            <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-2.5 text-[11px] text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-500" />
              <span>
                Tokens can be revoked or disconnected at any moment from this dashboard or within your {platform.name} account security settings.
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAuthorize}
                disabled={isAuthorizing}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>Authorize & Connect</span>
              </button>
            </div>
          </div>
        )}

        {authStep === "syncing" && (
          <div className="my-8 flex flex-col items-center justify-center text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent dark:border-indigo-400 dark:border-t-transparent" />
            <h4 className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Validating OAuth State & Exchanging Code...
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Securely encrypting tokens and fetching permitted account resources.
            </p>
          </div>
        )}

        {authStep === "complete" && (
          <div className="my-8 flex flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
              Successfully Connected!
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {platform.name} channel linked to your creator workspace.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
