import React, { useState } from "react";
import {
  Send,
  Calendar,
  Sparkles,
  Wand2,
  Undo2,
  Copy,
  Check,
  Zap,
  Sliders,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Hash,
  HelpCircle,
  Share2,
  MessageSquare,
  ThumbsUp,
  Heart,
  Repeat2,
  Bookmark,
  RefreshCw,
} from "lucide-react";
import { PlatformConnection, ScheduledPost, ContentItem } from "../../types";
import { api } from "../../services/api";

interface PublisherViewProps {
  connections: PlatformConnection[];
  onPublishNow: (newPost: ContentItem) => void;
  onSchedulePost: (newSchedule: ScheduledPost) => void;
  onRepurposeWithAi: (title: string, desc: string) => void;
}

export const PublisherView: React.FC<PublisherViewProps> = ({
  connections,
  onPublishNow,
  onSchedulePost,
  onRepurposeWithAi,
}) => {
  const [title, setTitle] = useState("Echoes of Eternity — Master Release");
  const [caption, setCaption] = useState(
    "Excited to share our newest hybrid composition, blending neoclassical strings with analog modular synthesizers. Stream it now on your favorite platform!"
  );
  const [mediaUrl, setMediaUrl] = useState(
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80"
  );
  const [hashtags, setHashtags] = useState("#MusicProducer #NewMusic #AudioEngineering #AmbientMusic");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "youtube",
    "instagram",
    "x",
    "linkedin",
  ]);
  const [scheduleDate, setScheduleDate] = useState("2026-09-20T18:00");
  const [activePreviewPlatform, setActivePreviewPlatform] = useState<string>("instagram");

  // Platform-specific adaptations
  const [xPost, setXPost] = useState(
    "Thrilled to announce our new release 'Echoes of Eternity'. Neoclassical strings meet modular synthesis. Listen now 🔗👇"
  );
  const [ytTitle, setYtTitle] = useState("Echoes of Eternity | Official 4K Spatial Audio Release");
  const [ytDescription, setYtDescription] = useState(
    "Full studio recording of 'Echoes of Eternity'.\n\n0:00 - Introduction\n1:15 - Cello Cadenza\n3:40 - Synthesis Climax\n\nStream on Spotify, Apple Music & Tidal."
  );
  const [igCaption, setIgCaption] = useState(
    "✨ 'Echoes of Eternity' is officially out worldwide!\n\nThis piece took 6 months of live orchestra recording and analog tape processing. Turn up your headphones for the spatial mix.\n\nDrop a 🎵 if you've listened!"
  );
  const [liPost, setLiPost] = useState(
    "Proud to announce the release of our new production, 'Echoes of Eternity'.\n\nIndependent creative distribution requires treating each platform as a unique community. Here is how we adapted our acoustic workflows for spatial audio.\n\nFull release link in comments."
  );

  // AI Magic states
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  const [activeMagicAction, setActiveMagicAction] = useState<string>("reformat_all");
  const [magicBanner, setMagicBanner] = useState<{
    message: string;
    model: string;
    timestamp: string;
  } | null>(null);
  const [customInstruction, setCustomInstruction] = useState("");
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // History state for Undo AI Magic
  const [historySnapshot, setHistorySnapshot] = useState<{
    caption: string;
    hashtags: string;
    xPost: string;
    igCaption: string;
    liPost: string;
    ytTitle: string;
    ytDescription: string;
  } | null>(null);

  const samplePresets = [
    {
      label: "🎵 Music / Audio Launch",
      title: "Echoes of Eternity — Master Release",
      caption: "Excited to share our newest hybrid composition, blending neoclassical strings with analog modular synthesizers. Stream it now on your favorite platform!",
    },
    {
      label: "🚀 Tech / App Milestone",
      title: "V2.5 Architecture Launch: Zero-Latency Real-Time Sync",
      caption: "Today we shipped our new multi-region database replication engine. Over 100,000 queries per second with sub-50ms latency across North America and Europe. Huge shoutout to the engineering team for 3 weeks of grueling stress tests.",
    },
    {
      label: "💡 Creator Growth Insight",
      title: "Why Cross-Platform Publishing Fails (And How We Fixed It)",
      caption: "Stop copy-pasting the exact same tweet into LinkedIn and Instagram. Twitter demands crisp brevity under 280 characters. Instagram thrives on aesthetic spacing, visual hooks, and community hashtags. LinkedIn requires thought leadership and professional takeaways. Tailor your message to the medium.",
    },
  ];

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApplyPreset = (preset: { title: string; caption: string }) => {
    setTitle(preset.title);
    setCaption(preset.caption);
  };

  const handleRunAiMagic = async (
    action: string = "reformat_all",
    targetPlatform: string = "all"
  ) => {
    if (!caption.trim() && !title.trim()) {
      alert("Please enter a title or caption first to use AI Magic.");
      return;
    }

    // Save previous state for undo capability
    setHistorySnapshot({
      caption,
      hashtags,
      xPost,
      igCaption,
      liPost,
      ytTitle,
      ytDescription,
    });

    setIsMagicLoading(true);
    setActiveMagicAction(action);
    setMagicBanner(null);

    try {
      const response = await api.magicFormatPost({
        text: caption,
        title: title,
        action: action,
        targetPlatform: targetPlatform,
        selectedPlatforms: selectedPlatforms,
        customInstruction: customInstruction.trim() || undefined,
      });

      if (response && response.data) {
        const data = response.data;

        // Apply platform changes according to target
        if (targetPlatform === "all" || targetPlatform === "instagram") {
          if (data.instagram?.caption) {
            setIgCaption(data.instagram.caption);
          }
          if (data.instagram?.hashtags) {
            setHashtags(data.instagram.hashtags);
          }
        }

        if (targetPlatform === "all" || targetPlatform === "x") {
          if (data.x?.post) {
            setXPost(data.x.post);
          }
        }

        if (targetPlatform === "all" || targetPlatform === "linkedin") {
          if (data.linkedin?.post) {
            setLiPost(data.linkedin.post);
          }
        }

        if (targetPlatform === "all" || targetPlatform === "youtube") {
          if (data.youtube?.title) {
            setYtTitle(data.youtube.title);
          }
          if (data.youtube?.description) {
            setYtDescription(data.youtube.description);
          }
        }

        setMagicBanner({
          message:
            data.summary ||
            "Post reformatted for all target platforms with platform-specific hashtags, brevity limits, and executive tone.",
          model: response.source || "gemini-3.8-flash",
          timestamp: new Date().toLocaleTimeString(),
        });

        // Switch preview to the targeted platform if specific
        if (targetPlatform !== "all" && ["instagram", "x", "linkedin", "youtube"].includes(targetPlatform)) {
          setActivePreviewPlatform(targetPlatform);
        }
      }
    } catch (err: any) {
      console.error("AI Magic execution error:", err);
      alert("AI Magic encountered an issue: " + (err.message || "Unknown error"));
    } finally {
      setIsMagicLoading(false);
    }
  };

  const handleUndoMagic = () => {
    if (!historySnapshot) return;
    setCaption(historySnapshot.caption);
    setHashtags(historySnapshot.hashtags);
    setXPost(historySnapshot.xPost);
    setIgCaption(historySnapshot.igCaption);
    setLiPost(historySnapshot.liPost);
    setYtTitle(historySnapshot.ytTitle);
    setYtDescription(historySnapshot.ytDescription);
    setHistorySnapshot(null);
    setMagicBanner({
      message: "Reverted changes to pre-AI state.",
      model: "Snapshot Restore",
      timestamp: new Date().toLocaleTimeString(),
    });
    setTimeout(() => setMagicBanner(null), 4000);
  };

  const togglePlatform = (slug: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(slug) ? prev.filter((p) => p !== slug) : [...prev, slug]
    );
  };

  const handlePublish = () => {
    const newItem: ContentItem = {
      id: `cnt-${Date.now()}`,
      title,
      description: caption,
      contentType: "video",
      thumbnail_url: mediaUrl,
      status: "published",
      published_at: new Date().toISOString(),
      connected_platforms: selectedPlatforms,
      metrics: { views: 0, likes: 0, comments: 0, shares: 0, engagementRate: "0%" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onPublishNow(newItem);
  };

  const handleSchedule = () => {
    const newScheduled: ScheduledPost = {
      id: `sch-${Date.now()}`,
      content_id: `cnt-${Date.now()}`,
      title,
      platforms: selectedPlatforms,
      scheduled_time: scheduleDate || new Date(Date.now() + 86400000).toISOString(),
      status: "scheduled",
      thumbnail: mediaUrl,
      contentType: "video",
      isAiSuggestedTime: true,
    };
    onSchedulePost(newScheduled);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl flex items-center gap-2">
            Universal Publisher & Adaptation Studio
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Craft master content and natively format for each destination platform with Gemini-powered AI Magic.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRunAiMagic("reformat_all", "all")}
            disabled={isMagicLoading}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:brightness-110 active:scale-95 disabled:opacity-50 transition"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isMagicLoading ? "animate-spin" : ""}`} />
            <span>{isMagicLoading ? "AI Magic Working..." : "✨ Run AI Magic"}</span>
          </button>

          <button
            onClick={() => onRepurposeWithAi(title, caption)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <span>AI Studio Full Flow</span>
          </button>
        </div>
      </div>

      {/* AI Magic Interactive Studio Banner */}
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/80 via-indigo-50/50 to-white p-5 shadow-xs dark:border-purple-900/50 dark:from-purple-950/30 dark:via-indigo-950/20 dark:to-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100 dark:border-purple-900/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-500/30">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  AI Magic: Multi-Platform Reformatter
                </span>
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transform any existing post into platform-native copy adhering to real algorithms, limits & audiences.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {historySnapshot && (
              <button
                onClick={handleUndoMagic}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
              >
                <Undo2 className="h-3.5 w-3.5" />
                <span>Undo AI Magic</span>
              </button>
            )}

            <button
              onClick={() => setShowCustomPrompt(!showCustomPrompt)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                showCustomPrompt
                  ? "border-purple-400 bg-purple-100/70 text-purple-800 dark:border-purple-800 dark:bg-purple-900/50 dark:text-purple-200"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>{showCustomPrompt ? "Hide Custom Prompt" : "Custom Instructions"}</span>
            </button>
          </div>
        </div>

        {/* Quick Magic Reformat Pills */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
            Quick Actions:
          </span>

          <button
            onClick={() => handleRunAiMagic("reformat_all", "all")}
            disabled={isMagicLoading}
            className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-3 py-1.5 text-xs font-semibold text-purple-700 shadow-xs hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800/80 dark:bg-slate-800/80 dark:text-purple-300 transition"
          >
            <Zap className="h-3.5 w-3.5 text-purple-500" />
            <span>⚡ Reformat All Platforms</span>
          </button>

          <button
            onClick={() => handleRunAiMagic("instagram_hashtags", "instagram")}
            disabled={isMagicLoading}
            className="flex items-center gap-1.5 rounded-xl border border-pink-200 bg-white px-3 py-1.5 text-xs font-semibold text-pink-700 shadow-xs hover:border-pink-300 hover:bg-pink-50 dark:border-pink-800/80 dark:bg-slate-800/80 dark:text-pink-300 transition"
          >
            <Hash className="h-3.5 w-3.5 text-pink-500" />
            <span>📸 Instagram Hashtags & Spacing</span>
          </button>

          <button
            onClick={() => handleRunAiMagic("twitter_shorten", "x")}
            disabled={isMagicLoading}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-xs hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 transition"
          >
            <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">&lt;280</span>
            <span>🐦 Shorten for Twitter / X</span>
          </button>

          <button
            onClick={() => handleRunAiMagic("linkedin_formalize", "linkedin")}
            disabled={isMagicLoading}
            className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-xs hover:border-blue-300 hover:bg-blue-50 dark:border-blue-800/80 dark:bg-slate-800/80 dark:text-blue-300 transition"
          >
            <span className="text-xs">💼</span>
            <span>LinkedIn Formalizer & Bullets</span>
          </button>

          <button
            onClick={() => handleRunAiMagic("youtube_seo", "youtube")}
            disabled={isMagicLoading}
            className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-xs hover:border-rose-300 hover:bg-rose-50 dark:border-rose-800/80 dark:bg-slate-800/80 dark:text-rose-300 transition"
          >
            <span className="text-xs">🎥</span>
            <span>YouTube Title & Timestamps</span>
          </button>
        </div>

        {/* Optional Custom Instructions Input */}
        {showCustomPrompt && (
          <div className="mt-3.5 rounded-xl border border-purple-200 bg-white/90 p-3 dark:border-purple-900/60 dark:bg-slate-900/90 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-purple-900 dark:text-purple-200">
                Custom Creative Directive for Gemini:
              </label>
              <span className="text-[11px] text-slate-400">
                e.g. "Add a giveaway announcement", "Emphasize early bird pricing"
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="Give specific tone instructions or context..."
                className="flex-1 rounded-lg border border-purple-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                onClick={() => handleRunAiMagic("custom", "all")}
                disabled={isMagicLoading || !customInstruction.trim()}
                className="rounded-lg bg-purple-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-purple-500 disabled:opacity-50"
              >
                Apply Directive
              </button>
            </div>
          </div>
        )}

        {/* AI Magic Feedback Banner */}
        {magicBanner && (
          <div className="mt-3.5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 text-xs text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold">AI Magic Reformat Complete</span>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                  Model: {magicBanner.model} · {magicBanner.timestamp}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-emerald-800 dark:text-emerald-300">
                {magicBanner.message}
              </p>
            </div>
          </div>
        )}

        {/* Fast Sample Post Presets */}
        <div className="mt-3 flex items-center gap-2 pt-2 border-t border-purple-100/60 dark:border-purple-900/30">
          <span className="text-[10px] font-semibold text-slate-400">Try Sample Posts:</span>
          <div className="flex flex-wrap gap-1.5">
            {samplePresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleApplyPreset(preset)}
                className="rounded-lg bg-white/70 px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-white hover:text-indigo-600 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-300 border border-slate-200/60 dark:border-slate-800 transition"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Form: Master Editor & Customizations (7 cols) */}
        <div className="space-y-5 lg:col-span-7">
          {/* Target Platforms Selector */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Target Authorized Channels ({selectedPlatforms.length} Selected)
              </span>
              <span className="text-[11px] text-slate-400">Click to toggle channels</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {connections.map((conn) => {
                const isSelected = selectedPlatforms.includes(conn.platform_slug);
                return (
                  <button
                    key={conn.id}
                    onClick={() => togglePlatform(conn.platform_slug)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-300 ring-2 ring-indigo-500/20"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{conn.platform_name}</span>
                    <span className="text-[10px] font-normal text-slate-400">
                      ({conn.username})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Master Post Editor */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Master Post Source
              </span>
              <span className="text-[11px] text-slate-400">
                Base text transformed by AI Magic
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Master Title / Hook
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your master post a title..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Master Caption / Description
                </label>
                <span className="text-[10px] text-slate-400">{caption.length} characters</span>
              </div>
              <textarea
                rows={4}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your core description, notes, or story..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Media / Artwork URL
                </label>
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Default Hashtags
                  </label>
                  <button
                    onClick={() => handleRunAiMagic("instagram_hashtags", "instagram")}
                    disabled={isMagicLoading}
                    className="text-[10px] font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center gap-1"
                  >
                    <Wand2 className="h-3 w-3" /> Magic Tags
                  </button>
                </div>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#tags"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Platform-Specific Transformation Section with Inline AI Magic */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  Platform-Specific Native Variations
                </h3>
                <p className="text-[11px] text-slate-400">
                  Each variation is fine-tuned to native character limits, hashtag density, and tone
                </p>
              </div>
            </div>

            {/* X (Twitter) Variation */}
            {selectedPlatforms.includes("x") && (
              <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 space-y-2.5 bg-slate-50/40 dark:bg-slate-900/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-black dark:bg-white" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      X (Twitter) Post
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        xPost.length <= 280
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                      }`}
                    >
                      {xPost.length}/280 {xPost.length <= 280 ? "✓ Safe" : "⚠ Over limit"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyText(xPost, "x")}
                      className="rounded-lg border border-slate-200 bg-white p-1 text-slate-500 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      title="Copy text"
                    >
                      {copiedKey === "x" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleRunAiMagic("twitter_shorten", "x")}
                      disabled={isMagicLoading}
                      className="flex items-center gap-1 rounded-lg bg-purple-100 px-2.5 py-1 text-[11px] font-bold text-purple-700 hover:bg-purple-200 dark:bg-purple-950/80 dark:text-purple-300 transition"
                    >
                      <Wand2 className="h-3 w-3" />
                      <span>AI Magic: Shorten (&lt;280)</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={xPost}
                  onChange={(e) => setXPost(e.target.value)}
                  placeholder="Draft your punchy post under 280 chars..."
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed"
                />
              </div>
            )}

            {/* Instagram Variation */}
            {selectedPlatforms.includes("instagram") && (
              <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 space-y-2.5 bg-slate-50/40 dark:bg-slate-900/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Instagram Reel / Feed Caption
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {igCaption.length} / 2,200 chars
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyText(`${igCaption}\n\n${hashtags}`, "instagram")}
                      className="rounded-lg border border-slate-200 bg-white p-1 text-slate-500 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      title="Copy text"
                    >
                      {copiedKey === "instagram" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleRunAiMagic("instagram_hashtags", "instagram")}
                      disabled={isMagicLoading}
                      className="flex items-center gap-1 rounded-lg bg-pink-100 px-2.5 py-1 text-[11px] font-bold text-pink-700 hover:bg-pink-200 dark:bg-pink-950/80 dark:text-pink-300 transition"
                    >
                      <Wand2 className="h-3 w-3" />
                      <span>AI Magic: Add Hashtags & Hook</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={igCaption}
                  onChange={(e) => setIgCaption(e.target.value)}
                  placeholder="Instagram caption with aesthetic spacing..."
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed"
                />
              </div>
            )}

            {/* LinkedIn Variation */}
            {selectedPlatforms.includes("linkedin") && (
              <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 space-y-2.5 bg-slate-50/40 dark:bg-slate-900/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      LinkedIn Professional Post
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Thought leadership tone
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyText(liPost, "linkedin")}
                      className="rounded-lg border border-slate-200 bg-white p-1 text-slate-500 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      title="Copy text"
                    >
                      {copiedKey === "linkedin" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleRunAiMagic("linkedin_formalize", "linkedin")}
                      disabled={isMagicLoading}
                      className="flex items-center gap-1 rounded-lg bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-200 dark:bg-blue-950/80 dark:text-blue-300 transition"
                    >
                      <Wand2 className="h-3 w-3" />
                      <span>AI Magic: Formalize for LinkedIn</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={liPost}
                  onChange={(e) => setLiPost(e.target.value)}
                  placeholder="Professional post with executive takeaways..."
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed"
                />
              </div>
            )}

            {/* YouTube Variation */}
            {selectedPlatforms.includes("youtube") && (
              <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 space-y-2.5 bg-slate-50/40 dark:bg-slate-900/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      YouTube Video Metadata & SEO
                    </span>
                    <span className="text-[10px] text-slate-400">High-CTR Title</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyText(`${ytTitle}\n\n${ytDescription}`, "youtube")}
                      className="rounded-lg border border-slate-200 bg-white p-1 text-slate-500 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      title="Copy text"
                    >
                      {copiedKey === "youtube" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleRunAiMagic("youtube_seo", "youtube")}
                      disabled={isMagicLoading}
                      className="flex items-center gap-1 rounded-lg bg-rose-100 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-200 dark:bg-rose-950/80 dark:text-rose-300 transition"
                    >
                      <Wand2 className="h-3 w-3" />
                      <span>AI Magic: Optimize SEO</span>
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={ytTitle}
                  onChange={(e) => setYtTitle(e.target.value)}
                  placeholder="Catchy YouTube Title (under 70 chars)"
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white font-medium"
                />

                <textarea
                  rows={3}
                  value={ytDescription}
                  onChange={(e) => setYtDescription(e.target.value)}
                  placeholder="YouTube Description & Timestamps"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed"
                />
              </div>
            )}
          </div>

          {/* Schedule & Action Row */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSchedule}
                className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Schedule Post</span>
              </button>

              <button
                onClick={handlePublish}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 active:scale-95"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Publish Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Device Preview Simulator (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Live Device Preview
                </span>
                <p className="text-[10px] text-slate-400">Simulates real platform UX</p>
              </div>
              <div className="flex items-center gap-1">
                {["instagram", "x", "youtube", "linkedin"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setActivePreviewPlatform(p)}
                    className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase transition ${
                      activePreviewPlatform === p
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Mobile Mockup Card */}
            <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-inner dark:border-slate-800 dark:bg-slate-950">
              {/* Device status header */}
              <div className="flex items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 py-2 text-[10px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                <span>9:41 AM</span>
                <span className="uppercase text-[9px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
                  {activePreviewPlatform} Feed
                </span>
                <span>100% 🔋</span>
              </div>

              {/* Instagram Feed Preview */}
              {activePreviewPlatform === "instagram" && (
                <div className="bg-white p-3 dark:bg-slate-900">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-pink-500"
                      alt="avatar"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-900 dark:text-white">
                        auravisuals
                      </span>
                      <span className="block text-[10px] text-slate-400">Original Audio</span>
                    </div>
                  </div>

                  <img
                    src={mediaUrl}
                    alt="preview"
                    className="aspect-square w-full rounded-lg object-cover"
                  />

                  <div className="mt-2.5 flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                      <MessageSquare className="h-5 w-5" />
                      <Share2 className="h-5 w-5" />
                    </div>
                    <Bookmark className="h-5 w-5" />
                  </div>

                  <div className="mt-2 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                    <span className="font-bold mr-1.5">auravisuals</span>
                    {igCaption}
                  </div>
                  <span className="mt-1 block text-[11px] text-indigo-600 dark:text-indigo-400 font-medium break-words">
                    {hashtags}
                  </span>
                </div>
              )}

              {/* X (Twitter) Preview */}
              {activePreviewPlatform === "x" && (
                <div className="bg-white p-4 dark:bg-slate-900">
                  <div className="flex items-start gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                      className="h-9 w-9 rounded-full object-cover"
                      alt="avatar"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Aura Creative
                        </span>
                        <span className="text-[11px] text-slate-400">@auracreative · 1m</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                        {xPost}
                      </p>
                      <img
                        src={mediaUrl}
                        alt="media"
                        className="mt-2.5 aspect-video w-full rounded-xl object-cover"
                      />
                      <div className="mt-3 flex items-center justify-between text-slate-400 text-xs">
                        <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> 18</span>
                        <span className="flex items-center gap-1"><Repeat2 className="h-4 w-4" /> 42</span>
                        <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> 219</span>
                        <span className="flex items-center gap-1"><Bookmark className="h-4 w-4" /></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* YouTube Preview */}
              {activePreviewPlatform === "youtube" && (
                <div className="bg-white dark:bg-slate-900">
                  <img src={mediaUrl} alt="yt" className="aspect-video w-full object-cover" />
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {ytTitle}
                    </h4>
                    <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500">
                      <span>Aura Creative Studio</span>
                      <span>•</span>
                      <span>248K subscribers</span>
                    </div>
                    <div className="mt-2 rounded-lg bg-slate-100 p-2 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300 whitespace-pre-line line-clamp-4">
                      {ytDescription}
                    </div>
                  </div>
                </div>
              )}

              {/* LinkedIn Preview */}
              {activePreviewPlatform === "linkedin" && (
                <div className="bg-white p-3.5 dark:bg-slate-900">
                  <div className="flex items-center gap-2.5 mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                      className="h-8 w-8 rounded-full object-cover"
                      alt="avatar"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-900 dark:text-white">
                        Aura Studio Official
                      </span>
                      <span className="block text-[10px] text-slate-400">18,200 followers · Now</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                    {liPost}
                  </p>
                  <img src={mediaUrl} alt="media" className="mt-2.5 aspect-video w-full rounded-lg object-cover" />
                  <div className="mt-2 flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-2 dark:border-slate-800">
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> Like</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> Comment</span>
                    <span className="flex items-center gap-1"><Repeat2 className="h-3.5 w-3.5" /> Repost</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
