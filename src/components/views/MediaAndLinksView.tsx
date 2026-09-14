import React, { useState } from "react";
import {
  Music,
  Radio,
  Link2,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Play,
  Share2,
  TrendingUp,
  Headphones,
} from "lucide-react";
import { TrackRelease, PodcastEpisode, ShortLink } from "../../types";

interface MediaAndLinksViewProps {
  initialTab?: "music" | "podcasts" | "links";
  musicReleases: TrackRelease[];
  podcastEpisodes: PodcastEpisode[];
  smartLinks: ShortLink[];
  onOpenPublisher: () => void;
}

export const MediaAndLinksView: React.FC<MediaAndLinksViewProps> = ({
  initialTab = "music",
  musicReleases,
  podcastEpisodes,
  smartLinks,
  onOpenPublisher,
}) => {
  const [activeTab, setActiveTab] = useState<"music" | "podcasts" | "links">(initialTab);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Media & Global Distribution
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage music releases across DSPs, ingest podcast RSS feeds, and route smart links.
          </p>
        </div>

        <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => setActiveTab("music")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === "music"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Music className="h-3.5 w-3.5" />
            <span>Music Releases</span>
          </button>

          <button
            onClick={() => setActiveTab("podcasts")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === "podcasts"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Podcasts</span>
          </button>

          <button
            onClick={() => setActiveTab("links")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === "links"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            <span>Smart Links</span>
          </button>
        </div>
      </div>

      {/* MUSIC RELEASES TAB */}
      {activeTab === "music" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              DSP Master Catalog & Streaming Records
            </span>
            <button
              onClick={onOpenPublisher}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Register New Release</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {musicReleases.map((release) => (
              <div
                key={release.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  {/* Artwork & Header */}
                  <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
                    <img
                      src={release.artwork_url}
                      alt={release.title}
                      className="h-20 w-20 rounded-xl object-cover shadow-md"
                    />
                    <div>
                      <span className="rounded bg-indigo-500/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                        {release.genre}
                      </span>
                      <h3 className="mt-1 text-base font-bold">{release.title}</h3>
                      <p className="text-xs text-indigo-200">{release.artist}</p>
                      <span className="mt-1 block text-[10px] text-slate-400">
                        Release Date: {release.release_date}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-100 p-4 text-xs dark:border-slate-800">
                    <div>
                      <span className="block text-[10px] text-slate-400">ISRC Code</span>
                      <code className="font-mono text-indigo-600 dark:text-indigo-400">
                        {release.isrc}
                      </code>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400">UPC / EAN</span>
                      <code className="font-mono text-slate-600 dark:text-slate-300">
                        {release.upc}
                      </code>
                    </div>
                  </div>

                  {/* DSP Links */}
                  <div className="p-4 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Live DSP Sync Status
                    </span>
                    <div className="space-y-1.5">
                      {release.dspPartners.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800/60"
                        >
                          <div className="flex items-center gap-2">
                            <Headphones className="h-3.5 w-3.5 text-indigo-500" />
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {p.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">
                              {p.status}
                            </span>
                            {p.storeUrl && (
                              <a
                                href={p.storeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-indigo-600"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 bg-slate-50/60 p-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 flex justify-between items-center">
                  <span>Status: <strong className="capitalize text-emerald-600">{release.status}</strong></span>
                  <button
                    onClick={() => setActiveTab("links")}
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    View Smart Landing Page →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PODCASTS TAB */}
      {activeTab === "podcasts" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Official Creator RSS Feed Ingestion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                https://feeds.auracreator.com/podcast/master.xml
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              RSS Feed Validated & Synced
            </span>
          </div>

          <div className="space-y-4">
            {podcastEpisodes.map((ep) => (
              <div
                key={ep.id}
                className="flex flex-col sm:flex-row items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      Episode {ep.episodeNumber}
                    </span>
                    <span className="text-xs text-slate-400">{ep.duration}</span>
                    <span className="text-xs text-slate-400">• Published {ep.publishDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {ep.episodeTitle}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    {ep.description}
                  </p>

                  <div className="rounded-lg bg-slate-50 p-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">AI Transcript Summary: </span>
                    {ep.transcriptSummary}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="block text-xl font-bold text-slate-900 dark:text-white">
                    {ep.downloads.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400">Total Listens</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SMART LINKS & LINK-IN-BIO TAB */}
      {activeTab === "links" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Global Smart Link Manager & Bio Router
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Single links that dynamically detect device operating system and route to Spotify, Apple, or YouTube apps.
              </p>
            </div>
            <button
              onClick={() => alert("Create custom smart link modal")}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Smart Link</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {smartLinks.map((link) => (
              <div
                key={link.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {link.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Destination: {link.originalUrl}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                      {link.clicks.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-slate-400">Total Clicks</span>
                  </div>
                </div>

                {/* Short URL Box */}
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
                  <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    https://ais-creator.hub/l/{link.code}
                  </span>
                  <button
                    onClick={() => copyUrl(`https://ais-creator.hub/l/${link.code}`, link.id)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {copiedLink === link.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Target: {link.platform}</span>
                  <span>Last Click: {link.last_clicked || "Recently"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
