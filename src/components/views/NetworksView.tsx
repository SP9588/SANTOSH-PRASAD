import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Zap,
  Globe2,
  ExternalLink,
  Shield,
  CheckCircle2,
  Share2,
  SlidersHorizontal,
} from "lucide-react";
import { Platform, PlatformCategory } from "../../types";

interface NetworksViewProps {
  platforms: Platform[];
  connectedPlatformSlugs: string[];
  onSelectPlatform: (platform: Platform) => void;
  onConnectPlatform: (platform: Platform) => void;
  externalSearchQuery?: string;
}

export const NetworksView: React.FC<NetworksViewProps> = ({
  platforms,
  connectedPlatformSlugs,
  onSelectPlatform,
  onConnectPlatform,
  externalSearchQuery = "",
}) => {
  const [search, setSearch] = useState(externalSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [filterOAuthOnly, setFilterOAuthOnly] = useState(false);
  const [filterPublishingOnly, setFilterPublishingOnly] = useState(false);
  const [filterAnalyticsOnly, setFilterAnalyticsOnly] = useState(false);

  // Sync external search query if passed from top Navbar
  React.useEffect(() => {
    if (externalSearchQuery) {
      setSearch(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  const categories: { label: string; value: string }[] = [
    { label: "All Networks", value: "ALL" },
    { label: "Social", value: "SOCIAL" },
    { label: "Video", value: "VIDEO" },
    { label: "Music & DSPs", value: "MUSIC" },
    { label: "Podcasts", value: "PODCAST" },
    { label: "Business & Maps", value: "BUSINESS" },
    { label: "Community", value: "COMMUNITY" },
    { label: "Publishing & CMS", value: "PUBLISHING" },
    { label: "Developer", value: "DEVELOPER" },
    { label: "Creator & Design", value: "CREATOR" },
  ];

  const regions = [
    "ALL",
    "Global",
    "India",
    "North America",
    "Europe",
    "Asia",
  ];

  const filteredPlatforms = useMemo(() => {
    return platforms.filter((p) => {
      // Category match
      if (selectedCategory !== "ALL" && p.category !== selectedCategory) {
        return false;
      }
      // Region match
      if (selectedRegion !== "ALL") {
        const matchesRegion =
          p.regions.includes(selectedRegion) ||
          p.regions.includes("Global") ||
          (p.country && p.country.toLowerCase().includes(selectedRegion.toLowerCase()));
        if (!matchesRegion) return false;
      }
      // Flags
      if (filterOAuthOnly && !p.oauth_supported) return false;
      if (filterPublishingOnly && !p.publishing_supported) return false;
      if (filterAnalyticsOnly && !p.analytics_supported) return false;

      // Text query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCountry = (p.country || "").toLowerCase().includes(q);
        return matchesName || matchesCat || matchesDesc || matchesCountry;
      }

      return true;
    });
  }, [
    platforms,
    selectedCategory,
    selectedRegion,
    filterOAuthOnly,
    filterPublishingOnly,
    filterAnalyticsOnly,
    search,
  ]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Official Networks Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Browse {platforms.length} supported networks across 9 media categories. Official APIs, OAuth 2.0, and developer docs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {filteredPlatforms.length} Networks Shown
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        {/* Search row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by platform name, category, feature, or country (e.g., YouTube, Spotify, India)..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Region selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
              Region:
            </span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r === "ALL" ? "All Regions" : r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                selectedCategory === cat.value
                  ? "bg-indigo-600 text-white shadow-xs dark:bg-indigo-600"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Feature Checkboxes */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300 pt-1">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={filterOAuthOnly}
              onChange={(e) => setFilterOAuthOnly(e.target.checked)}
              className="h-3.5 w-3.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>OAuth 2.0 Enabled</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={filterPublishingOnly}
              onChange={(e) => setFilterPublishingOnly(e.target.checked)}
              className="h-3.5 w-3.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Direct Publishing API</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={filterAnalyticsOnly}
              onChange={(e) => setFilterAnalyticsOnly(e.target.checked)}
              className="h-3.5 w-3.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Official Analytics Sync</span>
          </label>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredPlatforms.map((platform) => {
          const isConnected = connectedPlatformSlugs.includes(platform.slug);
          return (
            <div
              key={platform.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800/80"
            >
              <div>
                {/* Top row: Brand icon & badges */}
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
                    style={{ backgroundColor: platform.brandColor }}
                  >
                    <Share2 className="h-6 w-6" />
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {isConnected ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" /> Connected
                      </span>
                    ) : platform.oauth_supported ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        <Zap className="h-3 w-3" /> OAuth 2.0
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        Link Only
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">
                      {platform.country || "Global"}
                    </span>
                  </div>
                </div>

                {/* Name & Category */}
                <div className="mt-3">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {platform.name}
                    </h3>
                  </div>
                  <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                    {platform.category}
                  </span>
                  <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed dark:text-slate-300">
                    {platform.description}
                  </p>
                </div>

                {/* Capability Pills */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {platform.capabilities.publishing && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Publish
                    </span>
                  )}
                  {platform.capabilities.analytics && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Insights
                    </span>
                  )}
                  {platform.capabilities.messages && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Inbox
                    </span>
                  )}
                  {platform.capabilities.webhooks && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Webhook
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  onClick={() => onSelectPlatform(platform)}
                  className="flex-1 rounded-xl border border-slate-200 py-1.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Details
                </button>
                {platform.oauth_supported ? (
                  <button
                    onClick={() => onConnectPlatform(platform)}
                    className="flex-1 rounded-xl bg-indigo-600 py-1.5 text-center text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                  >
                    {isConnected ? "Manage" : "Connect"}
                  </button>
                ) : (
                  <a
                    href={platform.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-slate-100 py-1.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <span>Visit</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredPlatforms.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <Globe2 className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
            No matching networks found
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Try adjusting your search query, clearing region filters, or resetting category filters.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("ALL");
              setSelectedRegion("ALL");
              setFilterOAuthOnly(false);
              setFilterPublishingOnly(false);
              setFilterAnalyticsOnly(false);
            }}
            className="mt-4 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
