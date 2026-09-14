import React, { useState } from "react";
import {
  RefreshCw,
  ExternalLink,
  Shield,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  KeyRound,
  Lock,
  Zap,
  Info,
} from "lucide-react";
import { PlatformConnection, ConnectionStatus } from "../../types";

interface ConnectionsViewProps {
  connections: PlatformConnection[];
  onSyncConnection: (id: string) => void;
  onDisconnectConnection: (id: string) => void;
  onReconnectConnection: (id: string) => void;
  onOpenConnectModal: () => void;
}

export const ConnectionsView: React.FC<ConnectionsViewProps> = ({
  connections,
  onSyncConnection,
  onDisconnectConnection,
  onReconnectConnection,
  onOpenConnectModal,
}) => {
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>("ALL");
  const [inspectingConn, setInspectingConn] = useState<PlatformConnection | null>(null);

  const filteredConnections = connections.filter((c) => {
    if (selectedStatusTab === "ALL") return true;
    return c.status === selectedStatusTab;
  });

  const getStatusBadge = (status: ConnectionStatus) => {
    switch (status) {
      case "connected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3" /> Healthy
          </span>
        );
      case "needs_reauthorization":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <AlertTriangle className="h-3 w-3" /> Reauth Required
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
            <AlertTriangle className="h-3 w-3" /> Token Expired
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Authorized Platform Connections
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your authenticated accounts, monitor token validity, inspect OAuth scopes, and trigger syncs.
          </p>
        </div>
        <button
          onClick={onOpenConnectModal}
          className="flex items-center gap-1.5 self-start rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          <Zap className="h-3.5 w-3.5" />
          <span>Connect New Account</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3 dark:border-slate-800">
        {[
          { label: "All Connections", value: "ALL", count: connections.length },
          {
            label: "Connected & Healthy",
            value: "connected",
            count: connections.filter((c) => c.status === "connected").length,
          },
          {
            label: "Needs Reauthorization",
            value: "needs_reauthorization",
            count: connections.filter((c) => c.status === "needs_reauthorization").length,
          },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedStatusTab(tab.value)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              selectedStatusTab === tab.value
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                selectedStatusTab === tab.value
                  ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                  : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Connections List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredConnections.map((conn) => {
          const isWarning =
            conn.status === "needs_reauthorization" || conn.status === "expired";
          return (
            <div
              key={conn.id}
              className={`flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition hover:shadow-md dark:bg-slate-900 ${
                isWarning
                  ? "border-amber-300 dark:border-amber-900/60"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div>
                {/* Header: Avatar, Name, Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={conn.profile_image_url}
                      alt={conn.account_name}
                      className="h-12 w-12 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {conn.platform_name}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {conn.username}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(conn.status)}
                </div>

                {/* Account Details & Health */}
                <div className="mt-4 space-y-2 rounded-xl bg-slate-50/70 p-3 text-xs dark:bg-slate-800/40">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Followers / Audience:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {conn.followersCount?.toLocaleString() || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Last Synced:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {new Date(conn.last_synced_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Token Health:</span>
                    <span
                      className={`font-semibold ${
                        conn.healthScore > 80
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {conn.healthScore}%
                    </span>
                  </div>
                </div>

                {/* Scopes Preview */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Granted Permissions ({conn.scopes.length})</span>
                    <button
                      onClick={() => setInspectingConn(conn)}
                      className="text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      Inspect
                    </button>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {conn.scopes.slice(0, 3).map((scope, idx) => (
                      <code
                        key={idx}
                        className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-mono text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      >
                        {scope}
                      </code>
                    ))}
                    {conn.scopes.length > 3 && (
                      <span className="text-[10px] text-slate-400">
                        +{conn.scopes.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <a
                  href={conn.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  title="Open on Platform"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Open</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSyncConnection(conn.id)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    title="Sync channel data now"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Sync</span>
                  </button>

                  {isWarning ? (
                    <button
                      onClick={() => onReconnectConnection(conn.id)}
                      className="flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-amber-500 shadow-xs"
                    >
                      <KeyRound className="h-3 w-3" />
                      <span>Re-auth</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onDisconnectConnection(conn.id)}
                      className="flex items-center gap-1 rounded-lg border border-rose-200 px-2 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                      title="Disconnect channel"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Architecture Footnote */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <Lock className="h-5 w-5" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white">
              OAuth 2.0 Security Architecture & Zero-Scraping Policy
            </h4>
            <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
              All tokens and refresh credentials are encrypted at rest using AES-256 on the backend server.
              Client secrets are never delivered to the browser bundle or exposed in JavaScript.
              Data is fetched only via authorized endpoints with valid consent scopes.
            </p>
          </div>
        </div>
      </div>

      {/* Inspect Connection Modal */}
      {inspectingConn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setInspectingConn(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {inspectingConn.platform_name} Connection Audit
            </h3>
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-500">External Account ID:</span>
                <code className="block mt-0.5 rounded bg-slate-100 p-1.5 font-mono text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                  {inspectingConn.external_account_id}
                </code>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Token Expiry:</span>
                <p className="mt-0.5 text-slate-800 dark:text-slate-200">
                  {new Date(inspectingConn.token_expires_at).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Authorized Scopes:</span>
                <ul className="mt-1 space-y-1">
                  {inspectingConn.scopes.map((s, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-1.5 rounded bg-slate-50 px-2 py-1 font-mono text-[11px] text-indigo-600 dark:bg-slate-800/80 dark:text-indigo-400"
                    >
                      <ShieldCheck className="h-3 w-3 text-emerald-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setInspectingConn(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-slate-900"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
