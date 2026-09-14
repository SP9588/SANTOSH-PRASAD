export type PlatformCategory =
  | "SOCIAL"
  | "VIDEO"
  | "MUSIC"
  | "PODCAST"
  | "BUSINESS"
  | "COMMUNITY"
  | "PUBLISHING"
  | "DEVELOPER"
  | "CREATOR";

export type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "needs_reauthorization"
  | "expired"
  | "error"
  | "pending";

export type ContentType =
  | "video"
  | "short"
  | "image"
  | "audio"
  | "podcast"
  | "article"
  | "post"
  | "document"
  | "link";

export type PublicationStatus = "draft" | "scheduled" | "published" | "failed";

export interface PlatformCapabilities {
  profile: boolean;
  posts: boolean;
  videos: boolean;
  images: boolean;
  reels?: boolean;
  stories?: boolean;
  comments: boolean;
  messages: boolean;
  followers: boolean;
  analytics: boolean;
  publishing: boolean;
  scheduling: boolean;
  webhooks: boolean;
  musicMetadata?: boolean;
  podcastData?: boolean;
}

export interface Platform {
  id: string;
  name: string;
  slug: string;
  category: PlatformCategory;
  country?: string;
  regions: string[];
  description: string;
  official_url: string;
  developer_url: string;
  documentation_url: string;
  oauth_supported: boolean;
  api_supported: boolean;
  publishing_supported: boolean;
  analytics_supported: boolean;
  webhook_supported: boolean;
  music_distribution_supported: boolean;
  messaging_supported: boolean;
  status: "active" | "partner_only" | "beta" | "link_only";
  brandColor: string;
  iconName: string;
  capabilities: PlatformCapabilities;
  requiredScopes?: string[];
}

export interface PlatformConnection {
  id: string;
  platform_id: string;
  platform_name: string;
  platform_slug: string;
  external_account_id: string;
  account_name: string;
  username: string;
  profile_url: string;
  profile_image_url: string;
  token_expires_at: string;
  scopes: string[];
  status: ConnectionStatus;
  last_synced_at: string;
  created_at: string;
  healthScore: number; // 0-100
  followersCount?: number;
  rateLimitRemaining?: number;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  contentType: ContentType;
  media_url?: string;
  thumbnail_url?: string;
  status: PublicationStatus;
  scheduled_for?: string;
  published_at?: string;
  connected_platforms: string[]; // platform slugs
  external_urls?: Record<string, string>; // platform -> external deep link
  metrics?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    engagementRate?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ScheduledPost {
  id: string;
  content_id: string;
  title: string;
  platforms: string[];
  scheduled_time: string;
  status: PublicationStatus;
  thumbnail?: string;
  contentType: ContentType;
  isAiSuggestedTime?: boolean;
}

export interface InboxMessage {
  id: string;
  platform: string;
  platformSlug: string;
  senderName: string;
  senderAvatar: string;
  senderHandle: string;
  messageText: string;
  timestamp: string;
  isUnread: boolean;
  sentiment: "positive" | "neutral" | "inquiry" | "urgent";
  suggestedAiReply?: string;
  replies?: Array<{
    id: string;
    sender: "user" | "contact";
    text: string;
    timestamp: string;
  }>;
}

export interface TrackRelease {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  language: string;
  composer: string;
  lyricist: string;
  producer: string;
  isrc: string;
  upc: string;
  artwork_url: string;
  audio_url?: string;
  release_date: string;
  explicit: boolean;
  territories: string;
  status: "Draft" | "Review" | "Distributed" | "Live";
  dspPartners: Array<{
    name: string;
    status: "Delivered" | "Pending" | "Live" | "Processing";
    storeUrl?: string;
  }>;
}

export interface PodcastEpisode {
  id: string;
  podcastTitle: string;
  episodeTitle: string;
  episodeNumber: number;
  seasonNumber: number;
  description: string;
  duration: string;
  audioUrl: string;
  coverUrl: string;
  publishDate: string;
  status: "Draft" | "Scheduled" | "Published";
  transcriptSummary?: string;
  downloads: number;
}

export interface ShortLink {
  id: string;
  code: string;
  title: string;
  originalUrl: string;
  platform: string;
  clicks: number;
  created_at: string;
  last_clicked?: string;
}

export interface ApiHealthLog {
  id: string;
  platform: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  statusCode: number;
  latencyMs: number;
  timestamp: string;
  status: "success" | "warning" | "error";
  summary: string;
}

export type MusicRelease = TrackRelease;
export type SmartLink = ShortLink;

export interface ContentRepurposeResult {
  masterSummary: string;
  adaptations: Array<{
    platform_slug: string;
    platform_name: string;
    formattedContent: string;
    characterCount: number;
    hashtags: string[];
  }>;
  hashtags: string[];
  recommendedPostingTime: string;
}
