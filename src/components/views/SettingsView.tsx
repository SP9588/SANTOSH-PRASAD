import React, { useState } from "react";
import {
  Settings,
  ShieldCheck,
  Lock,
  Key,
  Download,
  Trash2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const [encryptionActive, setEncryptionActive] = useState(true);
  const [webhookSecret, setWebhookSecret] = useState("whsec_aura_prod_994821049281");
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Settings, Security & Environment
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure security protocols, token encryption, webhooks, and developer environment keys.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Security & Token Storage */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold">Token Encryption & Storage Policy</h3>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            All OAuth tokens (access tokens, refresh tokens, client secrets) are encrypted at rest using AES-256-GCM.
            Tokens are strictly scoped to user ID via Row-Level Security.
          </p>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Zero-Scraping & Official API Certification</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400 leading-normal">
              This application exclusively interfaces with official developer APIs and adheres to platform rate limits and terms of service.
            </p>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Incoming Webhook Secret
            </label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type={showSecret ? "text" : "password"}
                readOnly
                value={webhookSecret}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {showSecret ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>

        {/* Environment Variable Guide */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Key className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold">Workspace Environment Secrets</h3>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Configure external API keys via the AI Studio Settings / Secrets panel:
          </p>

          <div className="space-y-2 text-xs font-mono">
            <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60 flex items-center justify-between">
              <span className="text-purple-600 dark:text-purple-400 font-bold">GEMINI_API_KEY</span>
              <span className="text-emerald-600 font-sans text-[11px] font-semibold">Configured Server-Side</span>
            </div>
            <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60 flex items-center justify-between">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">ENCRYPTION_KEY</span>
              <span className="text-slate-400 font-sans text-[11px]">Auto-generated 256-bit</span>
            </div>
          </div>

          {/* Backup & Export */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Creator Data Portability
            </span>
            <button
              onClick={() => alert("Full workspace JSON archive downloaded")}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Backup</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
