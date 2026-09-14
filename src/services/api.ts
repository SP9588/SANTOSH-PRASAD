import {
  PlatformConnection,
  ContentItem,
  ScheduledPost,
  InboxMessage,
  TrackRelease,
  PodcastEpisode,
  ShortLink,
  ApiHealthLog,
} from "../types";

export interface DatabaseStats {
  status: string;
  engine: string;
  storagePath: string;
  sizeBytes: number;
  lastUpdated: string;
  tables: {
    connections: number;
    content: number;
    scheduledPosts: number;
    inboxMessages: number;
    musicReleases: number;
    podcastEpisodes: number;
    smartLinks: number;
    auditLogs: number;
  };
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`API error ${res.status}: ${errorText}`);
  }

  return res.json();
}

export const api = {
  // Health & Database
  async getHealth(): Promise<{
    status: string;
    geminiConfigured: boolean;
    database: DatabaseStats;
    timestamp: string;
  }> {
    return request("/api/health");
  },

  async getDatabaseStats(): Promise<DatabaseStats> {
    return request("/api/database/stats");
  },

  async resetDatabase(): Promise<{ success: boolean; message: string; stats: DatabaseStats }> {
    return request("/api/database/reset", { method: "POST" });
  },

  // Connections
  async getConnections(): Promise<PlatformConnection[]> {
    return request("/api/connections");
  },

  async createConnection(conn: Partial<PlatformConnection>): Promise<PlatformConnection> {
    return request("/api/connections", {
      method: "POST",
      body: JSON.stringify(conn),
    });
  },

  async syncConnection(id: string): Promise<PlatformConnection> {
    return request(`/api/connections/${id}/sync`, { method: "PUT" });
  },

  async deleteConnection(id: string): Promise<{ success: boolean }> {
    return request(`/api/connections/${id}`, { method: "DELETE" });
  },

  // Content Items
  async getContent(): Promise<ContentItem[]> {
    return request("/api/content");
  },

  async createContent(item: Partial<ContentItem>): Promise<ContentItem> {
    return request("/api/content", {
      method: "POST",
      body: JSON.stringify(item),
    });
  },

  async deleteContent(id: string): Promise<{ success: boolean }> {
    return request(`/api/content/${id}`, { method: "DELETE" });
  },

  // Scheduled Posts
  async getScheduled(): Promise<ScheduledPost[]> {
    return request("/api/scheduled");
  },

  async createScheduled(post: Partial<ScheduledPost>): Promise<ScheduledPost> {
    return request("/api/scheduled", {
      method: "POST",
      body: JSON.stringify(post),
    });
  },

  async deleteScheduled(id: string): Promise<{ success: boolean }> {
    return request(`/api/scheduled/${id}`, { method: "DELETE" });
  },

  // Inbox Messages
  async getInbox(): Promise<InboxMessage[]> {
    return request("/api/inbox");
  },

  async replyToInbox(id: string, replyText: string): Promise<InboxMessage> {
    return request(`/api/inbox/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({ replyText }),
    });
  },

  async markInboxRead(id: string, isUnread: boolean): Promise<InboxMessage> {
    return request(`/api/inbox/${id}/read`, {
      method: "PATCH",
      body: JSON.stringify({ isUnread }),
    });
  },

  // Media Catalog & Smart Links
  async getMusicReleases(): Promise<TrackRelease[]> {
    return request("/api/media/releases");
  },

  async createMusicRelease(release: Partial<TrackRelease>): Promise<TrackRelease> {
    return request("/api/media/releases", {
      method: "POST",
      body: JSON.stringify(release),
    });
  },

  async getPodcastEpisodes(): Promise<PodcastEpisode[]> {
    return request("/api/media/podcasts");
  },

  async createPodcastEpisode(episode: Partial<PodcastEpisode>): Promise<PodcastEpisode> {
    return request("/api/media/podcasts", {
      method: "POST",
      body: JSON.stringify(episode),
    });
  },

  async getSmartLinks(): Promise<ShortLink[]> {
    return request("/api/media/links");
  },

  async createSmartLink(link: Partial<ShortLink>): Promise<ShortLink> {
    return request("/api/media/links", {
      method: "POST",
      body: JSON.stringify(link),
    });
  },

  // Infrastructure
  async getAuditLogs(): Promise<ApiHealthLog[]> {
    return request("/api/infrastructure/logs");
  },

  async getInfrastructureHealth(): Promise<{
    database: DatabaseStats;
    gateways: Array<{ platform: string; status: string; latency: string; rateLimit: string }>;
    timestamp: string;
  }> {
    return request("/api/infrastructure/health");
  },

  // AI services
  async magicFormatPost(payload: {
    text: string;
    title?: string;
    action?: string;
    targetPlatform?: string;
    selectedPlatforms?: string[];
    customInstruction?: string;
  }) {
    return request<{ success: boolean; source: string; data: any }>("/api/ai/magic-format", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async repurposeContent(payload: {
    title: string;
    description: string;
    contentType: string;
    sourcePlatform: string;
    language?: string;
  }) {
    return request<{ success: boolean; source: string; data: any }>("/api/ai/repurpose", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async runAIAgent(command: string, connectedPlatforms: any[]) {
    return request<{ success: boolean; plan: any }>("/api/ai/agent", {
      method: "POST",
      body: JSON.stringify({ command, connectedPlatforms }),
    });
  },
};
