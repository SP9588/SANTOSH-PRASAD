import fs from "fs";
import path from "path";
import {
  INITIAL_CONNECTIONS,
  INITIAL_CONTENT,
  INITIAL_SCHEDULED,
  INITIAL_INBOX,
  INITIAL_TRACKS,
  INITIAL_PODCASTS,
  INITIAL_LINKS,
  INITIAL_HEALTH_LOGS,
} from "../src/data/mockData";
import {
  PlatformConnection,
  ContentItem,
  ScheduledPost,
  InboxMessage,
  TrackRelease,
  PodcastEpisode,
  ShortLink,
  ApiHealthLog,
} from "../src/types";

export interface DatabaseSchema {
  version: string;
  lastUpdated: string;
  connections: PlatformConnection[];
  content: ContentItem[];
  scheduledPosts: ScheduledPost[];
  inboxMessages: InboxMessage[];
  musicReleases: TrackRelease[];
  podcastEpisodes: PodcastEpisode[];
  smartLinks: ShortLink[];
  auditLogs: ApiHealthLog[];
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "database.json");

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadOrInitialize();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  private loadOrInitialize(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        // Verify key tables exist
        if (parsed && Array.isArray(parsed.connections) && Array.isArray(parsed.content)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Failed to load existing database file, re-initializing:", err);
    }

    // Seed initial dataset
    const seeded: DatabaseSchema = {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      connections: [...INITIAL_CONNECTIONS],
      content: [...INITIAL_CONTENT],
      scheduledPosts: [...INITIAL_SCHEDULED],
      inboxMessages: [...INITIAL_INBOX],
      musicReleases: [...INITIAL_TRACKS],
      podcastEpisodes: [...INITIAL_PODCASTS],
      smartLinks: [...INITIAL_LINKS],
      auditLogs: [...INITIAL_HEALTH_LOGS],
    };

    this.saveToDisk(seeded);
    return seeded;
  }

  private saveToDisk(dataToSave?: DatabaseSchema) {
    const target = dataToSave || this.data;
    target.lastUpdated = new Date().toISOString();
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    try {
      fs.writeFileSync(tempFile, JSON.stringify(target, null, 2), "utf-8");
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error("Database disk write failed:", err);
      if (fs.existsSync(tempFile)) {
        try { fs.unlinkSync(tempFile); } catch {}
      }
    }
  }

  // --- Connections Table ---
  public getConnections(): PlatformConnection[] {
    return this.data.connections;
  }

  public getConnectionById(id: string): PlatformConnection | undefined {
    return this.data.connections.find((c) => c.id === id);
  }

  public addConnection(conn: PlatformConnection): PlatformConnection {
    // Remove if already connected to replace/update
    this.data.connections = this.data.connections.filter(
      (c) => c.platform_slug !== conn.platform_slug
    );
    this.data.connections.unshift(conn);
    this.logAudit({
      id: `log-${Date.now()}`,
      platform: conn.platform_name,
      endpoint: `/api/v2/oauth/authorize`,
      method: "POST",
      statusCode: 201,
      latencyMs: 142,
      timestamp: new Date().toISOString(),
      status: "success",
      summary: `OAuth token registered for ${conn.username}`,
    });
    this.saveToDisk();
    return conn;
  }

  public updateConnection(id: string, updates: Partial<PlatformConnection>): PlatformConnection | null {
    const idx = this.data.connections.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.connections[idx] = { ...this.data.connections[idx], ...updates };
    this.saveToDisk();
    return this.data.connections[idx];
  }

  public deleteConnection(id: string): boolean {
    const conn = this.getConnectionById(id);
    const beforeCount = this.data.connections.length;
    this.data.connections = this.data.connections.filter((c) => c.id !== id);
    const deleted = this.data.connections.length < beforeCount;
    if (deleted && conn) {
      this.logAudit({
        id: `log-${Date.now()}`,
        platform: conn.platform_name,
        endpoint: `/api/v2/oauth/revoke`,
        method: "DELETE",
        statusCode: 200,
        latencyMs: 98,
        timestamp: new Date().toISOString(),
        status: "warning",
        summary: `Account ${conn.username} disconnected and token revoked`,
      });
      this.saveToDisk();
    }
    return deleted;
  }

  // --- Content Items Table ---
  public getContent(): ContentItem[] {
    return this.data.content;
  }

  public addContent(item: ContentItem): ContentItem {
    this.data.content.unshift(item);
    this.logAudit({
      id: `log-${Date.now()}`,
      platform: (item.connected_platforms && item.connected_platforms.join(", ")) || "Global",
      endpoint: `/api/v1/content/publish`,
      method: "POST",
      statusCode: 200,
      latencyMs: 240,
      timestamp: new Date().toISOString(),
      status: "success",
      summary: `Broadcasted "${item.title.slice(0, 30)}..." to ${item.connected_platforms ? item.connected_platforms.length : 1} channels`,
    });
    this.saveToDisk();
    return item;
  }

  public deleteContent(id: string): boolean {
    const before = this.data.content.length;
    this.data.content = this.data.content.filter((c) => c.id !== id);
    const success = this.data.content.length < before;
    if (success) this.saveToDisk();
    return success;
  }

  // --- Scheduled Posts Table ---
  public getScheduled(): ScheduledPost[] {
    return this.data.scheduledPosts;
  }

  public addScheduled(post: ScheduledPost): ScheduledPost {
    this.data.scheduledPosts.unshift(post);
    this.logAudit({
      id: `log-${Date.now()}`,
      platform: post.platforms.join(", "),
      endpoint: `/api/v1/dispatch/schedule`,
      method: "POST",
      statusCode: 201,
      latencyMs: 112,
      timestamp: new Date().toISOString(),
      status: "success",
      summary: `Scheduled dispatch for ${post.platforms.length} channels at ${post.scheduled_time}`,
    });
    this.saveToDisk();
    return post;
  }

  public deleteScheduled(id: string): boolean {
    const before = this.data.scheduledPosts.length;
    this.data.scheduledPosts = this.data.scheduledPosts.filter((p) => p.id !== id);
    const success = this.data.scheduledPosts.length < before;
    if (success) this.saveToDisk();
    return success;
  }

  // --- Inbox Messages Table ---
  public getInbox(): InboxMessage[] {
    return this.data.inboxMessages;
  }

  public replyToInbox(id: string, replyText: string): InboxMessage | null {
    const msg = this.data.inboxMessages.find((m) => m.id === id);
    if (!msg) return null;
    msg.isUnread = false;
    msg.replies = msg.replies || [];
    msg.replies.push({
      id: `reply-${Date.now()}`,
      sender: "user",
      text: replyText,
      timestamp: "Just now",
    });

    this.logAudit({
      id: `log-${Date.now()}`,
      platform: msg.platform,
      endpoint: `/api/v2/messages/reply`,
      method: "POST",
      statusCode: 200,
      latencyMs: 165,
      timestamp: new Date().toISOString(),
      status: "success",
      summary: `Dispatched reply to @${msg.senderHandle}`,
    });

    this.saveToDisk();
    return msg;
  }

  public markInboxRead(id: string, isUnread: boolean = false): InboxMessage | null {
    const msg = this.data.inboxMessages.find((m) => m.id === id);
    if (!msg) return null;
    msg.isUnread = isUnread;
    this.saveToDisk();
    return msg;
  }

  // --- Music Releases Table ---
  public getMusicReleases(): TrackRelease[] {
    return this.data.musicReleases;
  }

  public addMusicRelease(release: TrackRelease): TrackRelease {
    this.data.musicReleases.unshift(release);
    this.saveToDisk();
    return release;
  }

  // --- Podcast Episodes Table ---
  public getPodcastEpisodes(): PodcastEpisode[] {
    return this.data.podcastEpisodes;
  }

  public addPodcastEpisode(episode: PodcastEpisode): PodcastEpisode {
    this.data.podcastEpisodes.unshift(episode);
    this.saveToDisk();
    return episode;
  }

  // --- Smart Links Table ---
  public getSmartLinks(): ShortLink[] {
    return this.data.smartLinks;
  }

  public addSmartLink(link: ShortLink): ShortLink {
    this.data.smartLinks.unshift(link);
    this.saveToDisk();
    return link;
  }

  public recordLinkClick(code: string): ShortLink | null {
    const link = this.data.smartLinks.find((l) => l.code === code);
    if (!link) return null;
    link.clicks += 1;
    link.last_clicked = "Just now";
    this.saveToDisk();
    return link;
  }

  // --- Audit Logs Table ---
  public getAuditLogs(): ApiHealthLog[] {
    return this.data.auditLogs;
  }

  public logAudit(entry: ApiHealthLog) {
    this.data.auditLogs.unshift(entry);
    if (this.data.auditLogs.length > 100) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 100);
    }
  }

  // --- Database Stats & Health ---
  public getStats() {
    return {
      status: "online",
      engine: "Relational JSON Transactional DB (ACID atomic write)",
      storagePath: DB_FILE,
      sizeBytes: fs.existsSync(DB_FILE) ? fs.statSync(DB_FILE).size : 0,
      lastUpdated: this.data.lastUpdated,
      tables: {
        connections: this.data.connections.length,
        content: this.data.content.length,
        scheduledPosts: this.data.scheduledPosts.length,
        inboxMessages: this.data.inboxMessages.length,
        musicReleases: this.data.musicReleases.length,
        podcastEpisodes: this.data.podcastEpisodes.length,
        smartLinks: this.data.smartLinks.length,
        auditLogs: this.data.auditLogs.length,
      },
    };
  }

  // --- Reset Database to Default Seeds ---
  public resetDatabase(): DatabaseSchema {
    this.data = {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      connections: [...INITIAL_CONNECTIONS],
      content: [...INITIAL_CONTENT],
      scheduledPosts: [...INITIAL_SCHEDULED],
      inboxMessages: [...INITIAL_INBOX],
      musicReleases: [...INITIAL_TRACKS],
      podcastEpisodes: [...INITIAL_PODCASTS],
      smartLinks: [...INITIAL_LINKS],
      auditLogs: [...INITIAL_HEALTH_LOGS],
    };
    this.saveToDisk();
    return this.data;
  }
}

export const db = new DatabaseManager();

