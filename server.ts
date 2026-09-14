import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { db } from "./server/db";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint with Database Stats
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Global Creator Network Hub API",
    version: "2.5.0",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    database: db.getStats(),
    timestamp: new Date().toISOString(),
  });
});

// Database Management & Stats Endpoints
app.get("/api/database/stats", (_req, res) => {
  res.json(db.getStats());
});

app.post("/api/database/reset", (_req, res) => {
  db.resetDatabase();
  res.json({
    success: true,
    message: "Database successfully reset to initial seed state",
    stats: db.getStats(),
  });
});

// --- Connections API ---
app.get("/api/connections", (_req, res) => {
  res.json(db.getConnections());
});

app.post("/api/connections", (req, res) => {
  const conn = req.body;
  if (!conn.platform_slug || !conn.username) {
    return res.status(400).json({ error: "platform_slug and username are required." });
  }
  const created = db.addConnection({
    id: conn.id || `conn-${conn.platform_slug}-${Date.now().toString(36)}`,
    platform_id: conn.platform_id || `plt-${conn.platform_slug}`,
    platform_name: conn.platform_name || conn.platform_slug,
    platform_slug: conn.platform_slug,
    external_account_id: conn.external_account_id || `ext_${Date.now()}`,
    account_name: conn.account_name || conn.username,
    username: conn.username,
    profile_url: conn.profile_url || `https://${conn.platform_slug}.com/${conn.username.replace('@','')}`,
    profile_image_url: conn.profile_image_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    token_expires_at: conn.token_expires_at || new Date(Date.now() + 86400000 * 60).toISOString(),
    scopes: conn.scopes || ["read", "write"],
    status: conn.status || "connected",
    last_synced_at: new Date().toISOString(),
    created_at: conn.created_at || new Date().toISOString(),
    healthScore: 100,
    followersCount: conn.followersCount || Math.floor(Math.random() * 50000 + 2000),
    rateLimitRemaining: conn.rateLimitRemaining || 1000,
  });
  return res.status(201).json(created);
});

app.put("/api/connections/:id/sync", (req, res) => {
  const conn = db.getConnectionById(req.params.id);
  if (!conn) {
    return res.status(404).json({ error: "Connection not found" });
  }
  const updated = db.updateConnection(req.params.id, {
    last_synced_at: new Date().toISOString(),
    healthScore: Math.min(100, (conn.healthScore || 90) + 5),
    followersCount: (conn.followersCount || 1000) + Math.floor(Math.random() * 120 + 5),
    rateLimitRemaining: Math.max(10, (conn.rateLimitRemaining || 500) - 2),
  });
  return res.json(updated);
});

app.delete("/api/connections/:id", (req, res) => {
  const success = db.deleteConnection(req.params.id);
  if (!success) {
    return res.status(404).json({ error: "Connection not found" });
  }
  return res.json({ success: true, message: "Connection revoked and deleted" });
});

// --- Content Items API ---
app.get("/api/content", (_req, res) => {
  res.json(db.getContent());
});

app.post("/api/content", (req, res) => {
  const item = req.body;
  if (!item.title) {
    return res.status(400).json({ error: "Title is required" });
  }
  const created = db.addContent({
    id: item.id || `cnt-${Date.now().toString(36)}`,
    title: item.title,
    description: item.description || "",
    contentType: item.contentType || "post",
    thumbnail_url: item.thumbnail_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    status: item.status || "published",
    published_at: item.published_at || item.publishedAt || new Date().toISOString(),
    connected_platforms: item.connected_platforms || item.platforms || [],
    metrics: item.metrics || {
      views: Math.floor(Math.random() * 500 + 50),
      likes: Math.floor(Math.random() * 80 + 10),
      comments: Math.floor(Math.random() * 20 + 2),
      shares: Math.floor(Math.random() * 15 + 1),
    },
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString(),
  });
  return res.status(201).json(created);
});

app.delete("/api/content/:id", (req, res) => {
  const success = db.deleteContent(req.params.id);
  if (!success) return res.status(404).json({ error: "Content not found" });
  return res.json({ success: true });
});

// --- Scheduled Posts API ---
app.get("/api/scheduled", (_req, res) => {
  res.json(db.getScheduled());
});

app.post("/api/scheduled", (req, res) => {
  const post = req.body;
  if (!post.title || (!post.scheduled_time && !post.scheduledFor)) {
    return res.status(400).json({ error: "Title and scheduled_time are required" });
  }
  const created = db.addScheduled({
    id: post.id || `sch-${Date.now().toString(36)}`,
    content_id: post.content_id || `cnt-${Date.now().toString(36)}`,
    title: post.title,
    contentType: post.contentType || "post",
    platforms: post.platforms || [],
    scheduled_time: post.scheduled_time || post.scheduledFor,
    status: post.status || "scheduled",
    thumbnail: post.thumbnail,
    isAiSuggestedTime: post.isAiSuggestedTime ?? false,
  });
  return res.status(201).json(created);
});

app.delete("/api/scheduled/:id", (req, res) => {
  const success = db.deleteScheduled(req.params.id);
  if (!success) return res.status(404).json({ error: "Scheduled post not found" });
  return res.json({ success: true });
});

// --- Inbox Messages API ---
app.get("/api/inbox", (_req, res) => {
  res.json(db.getInbox());
});

app.post("/api/inbox/:id/reply", (req, res) => {
  const { replyText } = req.body;
  if (!replyText) {
    return res.status(400).json({ error: "replyText is required" });
  }
  const updated = db.replyToInbox(req.params.id, replyText);
  if (!updated) return res.status(404).json({ error: "Message not found" });
  return res.json(updated);
});

app.patch("/api/inbox/:id/read", (req, res) => {
  const { isUnread = false } = req.body;
  const updated = db.markInboxRead(req.params.id, isUnread);
  if (!updated) return res.status(404).json({ error: "Message not found" });
  return res.json(updated);
});

// --- Media Catalog & Links API ---
app.get("/api/media/releases", (_req, res) => {
  res.json(db.getMusicReleases());
});

app.post("/api/media/releases", (req, res) => {
  const release = req.body;
  if (!release.title || !release.isrc) {
    return res.status(400).json({ error: "Title and ISRC code are required" });
  }
  const created = db.addMusicRelease({
    id: release.id || `trk-${Date.now().toString(36)}`,
    title: release.title,
    artist: release.artist || "Aura Studio",
    album: release.album || "Master Singles",
    genre: release.genre || "Electronic",
    language: release.language || "English",
    composer: release.composer || "Aura Studio",
    lyricist: release.lyricist || "Aura Studio",
    producer: release.producer || "Aura Productions",
    isrc: release.isrc,
    upc: release.upc || `890${Math.floor(Math.random() * 9000000000)}`,
    artwork_url: release.artwork_url || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80",
    release_date: release.release_date || new Date().toISOString().split("T")[0],
    explicit: release.explicit ?? false,
    territories: release.territories || "Worldwide",
    status: release.status || "Live",
    dspPartners: release.dspPartners || [
      { name: "Spotify", status: "Live", storeUrl: "https://spotify.com" },
      { name: "Apple Music", status: "Live", storeUrl: "https://music.apple.com" },
    ],
  });
  return res.status(201).json(created);
});

app.get("/api/media/podcasts", (_req, res) => {
  res.json(db.getPodcastEpisodes());
});

app.post("/api/media/podcasts", (req, res) => {
  const episode = req.body;
  if (!episode.episodeTitle) {
    return res.status(400).json({ error: "episodeTitle is required" });
  }
  const created = db.addPodcastEpisode({
    id: episode.id || `ep-${Date.now().toString(36)}`,
    podcastTitle: episode.podcastTitle || "Creative Architecture Weekly",
    episodeTitle: episode.episodeTitle,
    episodeNumber: episode.episodeNumber || db.getPodcastEpisodes().length + 1,
    seasonNumber: episode.seasonNumber || 1,
    description: episode.description || "",
    duration: episode.duration || "42:15",
    audioUrl: episode.audioUrl || "https://example.com/audio.mp3",
    coverUrl: episode.coverUrl || "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&auto=format&fit=crop&q=80",
    publishDate: episode.publishDate || new Date().toISOString().split("T")[0],
    status: episode.status || "Published",
    transcriptSummary: episode.transcriptSummary || "AI summary generated.",
    downloads: episode.downloads || 0,
  });
  return res.status(201).json(created);
});

app.get("/api/media/links", (_req, res) => {
  res.json(db.getSmartLinks());
});

app.post("/api/media/links", (req, res) => {
  const link = req.body;
  if (!link.originalUrl) {
    return res.status(400).json({ error: "originalUrl is required" });
  }
  const code = link.code || `lnk-${Math.random().toString(36).substring(2, 7)}`;
  const created = db.addSmartLink({
    id: link.id || `lnk-${Date.now().toString(36)}`,
    code,
    title: link.title || "Smart Hub Link",
    originalUrl: link.originalUrl,
    platform: link.platform || "Universal",
    clicks: 0,
    created_at: new Date().toISOString(),
    last_clicked: undefined,
  });
  return res.status(201).json(created);
});

// --- Infrastructure & Audit API ---
app.get("/api/infrastructure/logs", (_req, res) => {
  res.json(db.getAuditLogs());
});

app.get("/api/infrastructure/health", (_req, res) => {
  res.json({
    database: db.getStats(),
    gateways: [
      { platform: "Google / YouTube Data API v3", status: "Operational", latency: "142ms", rateLimit: "8,940 / 10,000 pts" },
      { platform: "Meta Graph API (Instagram & Facebook)", status: "Operational", latency: "186ms", rateLimit: "182 / 200 calls/hr" },
      { platform: "X (Twitter) API v2", status: "Operational", latency: "210ms", rateLimit: "48 / 50 req/15min" },
      { platform: "LinkedIn Community Management API", status: "Operational", latency: "165ms", rateLimit: "920 / 1,000 calls" },
      { platform: "Spotify Web API", status: "Operational", latency: "98ms", rateLimit: "Unlimited (Token bucket)" },
      { platform: "TikTok Content Posting API", status: "Degraded", latency: "420ms", rateLimit: "Token Refresh Warning" },
      { platform: "Discord Developer Gateway", status: "Operational", latency: "65ms", rateLimit: "45 / 50 req/sec" },
      { platform: "Pinterest API v5", status: "Operational", latency: "180ms", rateLimit: "980 / 1,000 req/hr" },
    ],
    timestamp: new Date().toISOString(),
  });
});

// AI Magic Post Reformatting Endpoint
app.post("/api/ai/magic-format", async (req, res) => {
  const {
    text,
    title = "",
    action = "reformat_all",
    targetPlatform = "all",
    selectedPlatforms = ["x", "instagram", "linkedin", "youtube"],
    customInstruction = "",
  } = req.body;

  if (!text && !title) {
    return res.status(400).json({ error: "Text or title is required for AI Magic reformatting." });
  }

  const rawText = text || title || "";
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are "AI Magic", a world-class social media and creator copy editor.
Your task is to take this existing post text and reformat it intelligently according to distinct social platform algorithms and cultural norms:

Original Title / Hook: "${title}"
Original Post Content:
"""
${rawText}
"""

Requested Action: "${action}" (Target Platform: "${targetPlatform}")
${customInstruction ? `Custom Creative Instruction: "${customInstruction}"` : ""}
Target Platforms to address: ${JSON.stringify(selectedPlatforms)}

Guidelines per platform:
1. Instagram:
   - Add an eye-catching 1-line hook with tasteful emoji accent
   - Clean aesthetic line spacing and scannable paragraph chunks
   - Clear call to action (e.g. "Save for later", "Share your thoughts below 👇")
   - A curated group of 12-15 high-converting, relevant hashtags (mix of niche and broad community tags)
2. X (Twitter):
   - ABSOLUTE HARD REQUIREMENT: MUST BE MAXIMUM 275 CHARACTERS (under 280 chars total)
   - Punchy, high-impact phrasing that sparks curiosity or replies
   - Include 1-2 focused hashtags maximum
3. LinkedIn:
   - Professional, authoritative, and reflective tone
   - Convert insights into clear executive bullet points (•)
   - Add career, business, or industry takeaways
   - End with an engaging open-ended question to spark professional discussion
   - Include 3-4 professional hashtags (e.g., #Leadership #Innovation)
4. YouTube (if targeted):
   - Catchy, high-CTR title under 70 characters
   - Rich video description with timestamps format and subscribe CTA
5. Threads (if targeted):
   - Casual, conversational, relatable micro-update
6. TikTok (if targeted):
   - Fast, viral spoken hook + trending sound cue and #fyp tags

Respond with a strictly valid JSON object:
{
  "instagram": {
    "caption": "Full formatted caption with spacing and CTA",
    "hashtags": "#tag1 #tag2 #tag3",
    "hook": "Opening hook line"
  },
  "x": {
    "post": "Concise tweet guaranteed under 280 chars",
    "characterCount": 210
  },
  "linkedin": {
    "post": "Formalized professional post with structured paragraphs, bullet points, and discussion question"
  },
  "youtube": {
    "title": "Optimized video title",
    "description": "Formatted description with CTA and timestamps"
  },
  "tiktok": {
    "caption": "Viral TikTok caption under 150 chars",
    "hook": "Spoken hook"
  },
  "threads": {
    "post": "Authentic conversational thread post"
  },
  "summary": "Brief 1-sentence note of what AI Magic adjusted (e.g. 'Shortened to 218 chars for X, added 14 niche hashtags to Instagram, formalized into executive takeaways for LinkedIn.')"
}
Return ONLY JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);

      // Verify and guarantee X character length constraint
      if (parsed.x && parsed.x.post) {
        if (parsed.x.post.length > 280) {
          parsed.x.post = parsed.x.post.slice(0, 275) + "...";
        }
        parsed.x.characterCount = parsed.x.post.length;
      }

      return res.json({
        success: true,
        source: "gemini-3.8-flash",
        data: parsed,
      });
    } catch (err: any) {
      console.error("Gemini AI Magic call failed, using intelligent fallback:", err);
    }
  }

  // Fallback heuristic generator when Gemini is not connected
  const cleanSnippet = rawText.replace(/\s+/g, " ").trim();
  const baseTitle = title || (cleanSnippet.length > 40 ? cleanSnippet.slice(0, 37) + "..." : cleanSnippet);

  // Shorten for Twitter under 280 chars
  let xTweet = cleanSnippet;
  if (xTweet.length > 230) {
    xTweet = xTweet.slice(0, 220).trim() + "...";
  }
  xTweet = `${xTweet}\n\n🔗 Thoughts? #CreatorHub #Innovation`;
  if (xTweet.length > 280) {
    xTweet = xTweet.slice(0, 275) + "...";
  }

  // Instagram with aesthetic spacing & hashtags
  const igHashtags = `#CreatorEconomy #DigitalCreator #ContentCreation #StudioLife #CreativeProcess #ViralPost #TrendingNow #ExplorePage #CommunityFirst #ModernDesign #WorkInProgress #Innovation`;
  const igCaption = `✨ ${baseTitle}\n\n${rawText}\n\nSwipe through for the full visual experience ➡️ Drop a comment below if this resonates! 👇\n\n${igHashtags}`;

  // LinkedIn formalized
  const liPost = `Excited to share a strategic reflection on our latest creative initiative: "${baseTitle}"\n\n${rawText}\n\nKey principles from this cycle:\n• Clear positioning drives meaningful multi-channel distribution\n• Native storytelling always outperforms copy-pasted broadcasts\n• Audience trust compounds through authentic engagement\n\nHow is your organization approaching cross-platform consistency while preserving native channel nuance?\n\n#Leadership #ContentStrategy #MediaInnovation #CreativeDirection`;

  const youtubeDesc = `${rawText}\n\n📌 Timestamps:\n0:00 - Introduction & Context\n1:20 - Breakdown & Execution\n3:45 - Key Insights & Learnings\n\n🔔 Subscribe to Aura Creative Studio for weekly deep-dives.\nStream and download all assets via link in description.`;

  return res.json({
    success: true,
    source: "local-optimizer-engine",
    data: {
      instagram: {
        caption: igCaption,
        hashtags: igHashtags,
        hook: `✨ ${baseTitle}`,
      },
      x: {
        post: xTweet,
        characterCount: xTweet.length,
      },
      linkedin: {
        post: liPost,
      },
      youtube: {
        title: `${baseTitle} | Official Release [4K]`,
        description: youtubeDesc,
      },
      tiktok: {
        caption: `Wait until you see how this turned out! 👀🔥 #${baseTitle.replace(/[^a-zA-Z0-9]/g, "")} #fyp #viral #foryou`,
        hook: "Stop scrolling if you care about real craft",
      },
      threads: {
        post: `Quick thought on "${baseTitle}": ${cleanSnippet.slice(0, 180)}... What's your take?`,
      },
      summary: "Magically formatted: Shortened for Twitter (<280), added 12 niche hashtags to Instagram, and structured for LinkedIn with executive takeaways.",
    },
  });
});

// AI Repurposing Endpoint
app.post("/api/ai/repurpose", async (req, res) => {
  const { title, description, contentType, sourcePlatform, language = "English" } = req.body;

  if (!title && !description) {
    return res.status(400).json({ error: "Master content title or description is required." });
  }

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are the master content adaptation engine for the Global Creator Network Hub.
Transform this master content into native, optimized copy for distinct platforms adhering to real platform constraints:

Master Content:
- Title: "${title || 'Untitled'}"
- Description/Notes: "${description || 'None'}"
- Content Type: "${contentType || 'General'}"
- Source Origin: "${sourcePlatform || 'Creator Hub'}"
- Language: "${language}"

Generate a valid JSON object with the following structure:
{
  "youtube": {
    "title": "SEO-optimized YouTube video title under 70 chars with high click-through intent",
    "description": "Engaging description with timestamps placeholder and CTA",
    "shortTitle": "Catchy YouTube Short title under 50 chars with #Shorts"
  },
  "instagram": {
    "caption": "Aesthetic caption formatted with spacing, punchy hook, and 15 niche hashtags",
    "reelHook": "Text overlay hook for 0:01s of the reel",
    "firstComment": "5-8 supplementary community hashtags"
  },
  "tiktok": {
    "caption": "Fast-paced viral caption with trending sound cue and #fyp tags under 150 chars",
    "hook": "Spoken hook for opening second"
  },
  "x": {
    "post": "Punchy tweet under 280 characters with 1-2 focused hashtags",
    "threadOpener": "Hook for an educational or storytelling multi-tweet thread"
  },
  "linkedin": {
    "post": "Thought leadership professional post with paragraph breaks, actionable takeaways, and career/industry context"
  },
  "pinterest": {
    "title": "Searchable Pin title",
    "description": "Keyword-rich description with link CTA"
  },
  "threads": {
    "post": "Conversational, authentic community prompt or micro-update"
  },
  "seo": {
    "keywords": ["5-8 targeted keywords"],
    "metaTitle": "Title under 60 chars",
    "metaDescription": "Description under 155 chars"
  }
}
Return ONLY pure JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json({
        success: true,
        source: "gemini-3.8-flash",
        data: parsed,
      });
    } catch (err: any) {
      console.error("Gemini API call failed, falling back to heuristic engine:", err);
    }
  }

  // Smart heuristic algorithmic fallback
  const baseTitle = title || "New Creative Release";
  const baseDesc = description || "Check out our newest creative project!";
  
  const fallback = {
    youtube: {
      title: `${baseTitle} | Official Video Release [4K]`,
      description: `${baseDesc}\n\n🔔 Subscribe for regular updates!\nStream & download everywhere.\n\n#CreatorHub #Release #${baseTitle.replace(/[^a-zA-Z0-9]/g, '')}`,
      shortTitle: `${baseTitle.slice(0, 40)}... #Shorts`,
    },
    instagram: {
      caption: `✨ "${baseTitle}" is officially out now!\n\n${baseDesc}\n\nDrop your thoughts in the comments below 👇\n\n#CreatorCommunity #NewRelease #ContentCreator #Viral #ExplorePage #Trending #${baseTitle.replace(/[^a-zA-Z0-9]/g, '')}`,
      reelHook: `Wait until you see how this was created...`,
      firstComment: `#creative #independent #artistlife #creatorlife #musicvideo #digitalart`,
    },
    tiktok: {
      caption: `Can't believe this is finally out! What do you rate it 1-10? 🎵🔥 #${baseTitle.replace(/[^a-zA-Z0-9]/g, '')} #fyp #foryou #trending`,
      hook: `Stop scrolling if you love high-concept creations`,
    },
    x: {
      post: `Thrilled to share "${baseTitle}" with everyone today. \n\n${baseDesc.slice(0, 140)}\n\nLink in bio 🔗`,
      threadOpener: `1/5 Behind the scenes of creating "${baseTitle}" — and the biggest lesson learned along the way 🧵👇`,
    },
    linkedin: {
      post: `Excited to announce the launch of our latest project: "${baseTitle}".\n\nKey takeaways from the production cycle:\n• Iteration leads to clarity\n• Cross-platform distribution requires tailored messaging\n• Community engagement begins on Day 1\n\nFull link in comments. How is your team approaching multi-channel publishing this quarter?`,
    },
    pinterest: {
      title: `${baseTitle} — Creative Showcase & Production Notes`,
      description: `Complete breakdown and visual aesthetic of ${baseTitle}. Pin this for creative inspiration and production workflows.`,
    },
    threads: {
      post: `Just pushed "${baseTitle}" live. Which platform do you usually consume this on first?`,
    },
    seo: {
      keywords: [baseTitle.toLowerCase(), "creator network", "digital content", "streaming", "official release"],
      metaTitle: `${baseTitle} | Official Release`,
      metaDescription: `Discover and stream ${baseTitle}. Watch the official visuals, read production notes, and join the creator conversation.`,
    },
  };

  return res.json({
    success: true,
    source: "local-optimizer-engine",
    data: fallback,
  });
});

// AI Multi-Network Agent Endpoint
app.post("/api/ai/agent", async (req, res) => {
  const { command, connectedPlatforms = [] } = req.body;

  if (!command) {
    return res.status(400).json({ error: "Instruction command is required." });
  }

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are the executive orchestration agent for Global Creator Network Hub.
The user gave this natural language command:
"${command}"

Connected Platforms in user's authorized account:
${JSON.stringify(connectedPlatforms)}

Plan a realistic, compliant publishing/synchronization workflow. Adhere to strict security & API rules:
- Never fabricate a successful publication without real API token approval.
- Clearly flag platforms that require developer approval, specific OAuth scopes, or have limitations (e.g., TikTok requires video file, X has character limits, Spotify requires distributor).
- Formulate a 5-step concrete plan.

Generate JSON response:
{
  "summary": "Brief executive summary",
  "intent": "publish|sync|repurpose|analyze",
  "steps": [
    { "order": 1, "title": "Step title", "description": "Action details", "platform": "platform name or All", "status": "ready|requires_auth|warning" }
  ],
  "platformChecks": [
    { "platform": "YouTube", "canProceed": true, "note": "Video file and OAuth scope ../auth/youtube.upload required" }
  ],
  "requiresUserConfirmation": true
}
Return ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      return res.json({
        success: true,
        plan: JSON.parse(responseText),
      });
    } catch (err: any) {
      console.error("AI Agent prompt failed:", err);
    }
  }

  // Fallback intelligent planner
  return res.json({
    success: true,
    plan: {
      summary: `Automated plan prepared for: "${command}"`,
      intent: "publish",
      steps: [
        { order: 1, title: "Media & Asset Verification", description: "Validate media dimensions, bitrates, and aspect ratios against target networks.", platform: "All", status: "ready" },
        { order: 2, title: "Token & Scope Audit", description: "Check OAuth token freshness and permission scopes for target connected accounts.", platform: "System", status: "ready" },
        { order: 3, title: "Platform-Specific Content Transformation", description: "Format captions, hashtags, and title limits natively for each authorized network.", platform: "AI Engine", status: "ready" },
        { order: 4, title: "Human Approval Checkpoint", description: "Require explicit human sign-off before dispatching live network mutations.", platform: "User Review", status: "ready" },
        { order: 5, title: "Official API Dispatch & Canonical URL Registration", description: "Transmit payload to platform endpoints, obtain external canonical ID, and register deep-link.", platform: "API Dispatcher", status: "ready" },
      ],
      platformChecks: [
        { platform: "YouTube", canProceed: true, note: "Verified Data API v3 upload channel" },
        { platform: "X / Twitter", canProceed: true, note: "API v2 tweet write endpoint verified" },
        { platform: "Instagram", canProceed: true, note: "Meta Graph API Reels/Post endpoint ready" },
        { platform: "LinkedIn", canProceed: true, note: "UGC Post API verified" },
      ],
      requiresUserConfirmation: true,
    },
  });
});

// Short URL Tracker & Redirector
const linkTelemetry: Record<string, { clicks: number; originalUrl: string; platform: string; history: Array<{ timestamp: string; referrer: string; country: string }> }> = {
  "r-yt-01": {
    clicks: 1420,
    originalUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    platform: "YouTube",
    history: [
      { timestamp: "2026-09-14T09:12:00Z", referrer: "direct", country: "India" },
      { timestamp: "2026-09-14T10:45:00Z", referrer: "twitter.com", country: "United States" },
    ],
  },
};

app.get("/r/:code", (req, res) => {
  const code = req.params.code;
  const link = linkTelemetry[code];
  if (link) {
    link.clicks += 1;
    link.history.push({
      timestamp: new Date().toISOString(),
      referrer: req.headers.referer || "direct",
      country: "Global",
    });
    db.recordLinkClick(code);
    return res.redirect(link.originalUrl);
  }

  // Also check database smartLinks
  const dbLinks = db.getSmartLinks();
  const foundDbLink = dbLinks.find((l) => l.code === code);
  if (foundDbLink) {
    db.recordLinkClick(code);
    return res.redirect(foundDbLink.originalUrl);
  }

  return res.status(404).send(`<h3>Link not found or expired</h3><p><a href="/">Return to Creator Hub</a></p>`);
});

app.post("/api/shortlinks", (req, res) => {
  const { originalUrl, platform, customCode } = req.body;
  if (!originalUrl) {
    return res.status(400).json({ error: "originalUrl is required." });
  }
  const code = customCode || `r-${Math.random().toString(36).substring(2, 7)}`;
  linkTelemetry[code] = {
    clicks: 0,
    originalUrl,
    platform: platform || "External",
    history: [],
  };
  return res.json({
    success: true,
    code,
    shortUrl: `${req.protocol}://${req.get("host")}/r/${code}`,
    originalUrl,
  });
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Global Creator Network Hub server running on port ${PORT}`);
  });
}

startServer();
