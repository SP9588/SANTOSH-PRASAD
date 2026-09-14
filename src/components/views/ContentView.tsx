import React, { useState } from "react";
import {
  FolderKanban,
  Search,
  ExternalLink,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Calendar,
  Filter,
  Plus,
} from "lucide-react";
import { ContentItem } from "../../types";

interface ContentViewProps {
  contents: ContentItem[];
  onOpenPublisher: () => void;
}

export const ContentView: React.FC<ContentViewProps> = ({ contents, onOpenPublisher }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  const filtered = contents.filter((item) => {
    if (filterType !== "ALL" && item.contentType !== filterType) return false;
    if (searchTerm.trim()) {
      return (
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Content Library & Cross-Platform Assets
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            All your published master items, video compositions, posts, and distributed media assets.
          </p>
        </div>
        <button
          onClick={onOpenPublisher}
          className="flex items-center gap-1.5 self-start rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Content Item</span>
        </button>
      </div>

      {/* Filter row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search content by title or keyword..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {["ALL", "video", "post", "audio", "article"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase transition ${
                filterType === t
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Content Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              {/* Media Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                {item.thumbnail_url ? (
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="h-full w-full object-cover transition hover:scale-105 duration-300"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <FolderKanban className="h-10 w-10" />
                  </div>
                )}
                <span className="absolute top-2.5 right-2.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                  {item.contentType}
                </span>
              </div>

              {/* Title & Description */}
              <div className="p-4">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString()
                      : "Draft"}
                  </span>
                </div>
                <h3 className="mt-1.5 text-sm font-bold text-slate-900 line-clamp-1 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2 dark:text-slate-300">
                  {item.description}
                </p>

                {/* Platforms target badges */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {item.connected_platforms.map((p) => (
                    <span
                      key={p}
                      className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Metrics footer */}
            <div className="border-t border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="grid grid-cols-4 gap-1 text-center text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400">Views</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {item.metrics.views >= 1000
                      ? `${(item.metrics.views / 1000).toFixed(1)}K`
                      : item.metrics.views}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">Likes</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {item.metrics.likes >= 1000
                      ? `${(item.metrics.likes / 1000).toFixed(1)}K`
                      : item.metrics.likes}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">Comments</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {item.metrics.comments}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">Engage</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {item.metrics.engagementRate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
