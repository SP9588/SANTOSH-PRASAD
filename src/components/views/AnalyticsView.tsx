import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  Eye,
  Share2,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { PlatformConnection } from "../../types";

interface AnalyticsViewProps {
  connections: PlatformConnection[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ connections }) => {
  const [timeRange, setTimeRange] = useState("30d");

  const platformDistribution = [
    { name: "YouTube", percentage: 42, reach: "248.5K", color: "#FF0000" },
    { name: "Instagram", percentage: 28, reach: "142.1K", color: "#E4405F" },
    { name: "Spotify", percentage: 16, reach: "84.2K", color: "#1DB954" },
    { name: "LinkedIn", percentage: 9, reach: "42.0K", color: "#0A66C2" },
    { name: "X (Twitter)", percentage: 5, reach: "20.2K", color: "#1D9BF0" },
  ];

  const handleExportData = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            reportDate: new Date().toISOString(),
            timeRange,
            summary: { totalReach: "537.0K", avgEngagement: "9.1%" },
            platforms: platformDistribution,
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `creator-analytics-${timeRange}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Cross-Platform Analytics Studio
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Unified audience metrics, engagement benchmarks, and multi-network performance insights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            {["7d", "30d", "90d"].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  timeRange === r
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {r === "7d" ? "Last 7 Days" : r === "30d" ? "Last 30 Days" : "Last Quarter"}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Net New Audience Growth
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              +38,420
            </span>
            <span className="flex items-center text-xs font-bold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> +21.4%
            </span>
          </div>
          <span className="mt-1 block text-[11px] text-slate-400">
            Leading network: Instagram (+18.2K)
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Aggregated Total Impressions
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              1.42M
            </span>
            <span className="flex items-center text-xs font-bold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> +14.8%
            </span>
          </div>
          <span className="mt-1 block text-[11px] text-slate-400">
            High video completion rate (78.4%)
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Estimated Creator Revenue
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              $8,420
            </span>
            <span className="flex items-center text-xs font-bold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> +9.3%
            </span>
          </div>
          <span className="mt-1 block text-[11px] text-slate-400">
            AdSense + DSP Royalties + Affiliates
          </span>
        </div>
      </div>

      {/* Platform Breakdown Bars */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Audience Reach Distribution by Network
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Proportion of total monthly audience impressions per platform
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            100% Normalized
          </span>
        </div>

        {/* Visual Stacked Progress Bar */}
        <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          {platformDistribution.map((p) => (
            <div
              key={p.name}
              title={`${p.name}: ${p.percentage}%`}
              style={{ width: `${p.percentage}%`, backgroundColor: p.color }}
              className="h-full transition-all duration-500 hover:opacity-85"
            />
          ))}
        </div>

        {/* Detailed Breakdown Rows */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
          {platformDistribution.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {p.name}
                </span>
              </div>

              <div className="text-right">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {p.reach}
                </span>
                <span className="block text-[10px] text-slate-400">
                  {p.percentage}% of total
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
