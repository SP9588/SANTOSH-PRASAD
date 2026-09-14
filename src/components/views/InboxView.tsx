import React, { useState } from "react";
import {
  Inbox,
  Send,
  Sparkles,
  Search,
  CheckCircle2,
  Trash2,
  Share2,
  CornerDownRight,
  MessageCircle,
} from "lucide-react";
import { InboxMessage } from "../../types";

interface InboxViewProps {
  messages: InboxMessage[];
  onReplyToMessage: (id: string, replyText: string) => void;
  onMarkAsRead: (id: string) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  messages,
  onReplyToMessage,
  onMarkAsRead,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("ALL");
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(
    messages[0] || null
  );
  const [replyText, setReplyText] = useState("");
  const [isAiDrafting, setIsAiDrafting] = useState(false);

  const filtered = messages.filter((m) => {
    if (selectedPlatform !== "ALL" && m.platformSlug !== selectedPlatform) return false;
    return true;
  });

  const handleAiDraft = () => {
    if (!selectedMessage) return;
    setIsAiDrafting(true);
    setTimeout(() => {
      if (selectedMessage.suggestedAiReply) {
        setReplyText(selectedMessage.suggestedAiReply);
      } else if (selectedMessage.sentiment === "positive") {
        setReplyText(
          `Thank you so much, ${selectedMessage.senderName}! Really appreciate you taking the time to connect. More exciting pieces coming soon!`
        );
      } else {
        setReplyText(
          `Thanks for reaching out! You can find the full setup and documentation in our studio notes. Let us know if you have any questions!`
        );
      }
      setIsAiDrafting(false);
    }, 600);
  };

  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return;
    onReplyToMessage(selectedMessage.id, replyText);
    setReplyText("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Unified Cross-Platform Inbox
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Monitor incoming comments, questions, and mentions across your connected channels with AI response assistance.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-3 dark:border-slate-800">
        {["ALL", "youtube", "instagram", "x", "linkedin", "tiktok"].map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPlatform(p)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold uppercase transition ${
              selectedPlatform === p
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Main Inbox 2-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Messages List (5 cols) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2 lg:col-span-5 max-h-[600px] overflow-y-auto">
          {filtered.map((msg) => {
            const isSelected = selectedMessage?.id === msg.id;
            return (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (msg.isUnread) onMarkAsRead(msg.id);
                }}
                className={`cursor-pointer rounded-xl p-3 transition ${
                  isSelected
                    ? "bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900"
                    : "hover:bg-slate-50 border border-transparent dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {msg.senderName}
                        </span>
                        {msg.isUnread && (
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {msg.platform} • {msg.senderHandle}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-semibold capitalize ${
                      msg.sentiment === "positive"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {msg.sentiment}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-600 line-clamp-2 dark:text-slate-300 leading-relaxed">
                  {msg.messageText}
                </p>
              </div>
            );
          })}
        </div>

        {/* Conversation / Reply View (7 cols) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 lg:col-span-7 flex flex-col justify-between">
          {selectedMessage ? (
            <div className="space-y-4">
              {/* Message Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedMessage.senderAvatar}
                    alt={selectedMessage.senderName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedMessage.senderName}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Via {selectedMessage.platform} ({selectedMessage.senderHandle}) • Received{" "}
                      {selectedMessage.timestamp}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {selectedMessage.sentiment} sentiment
                </span>
              </div>

              {/* Message Body */}
              <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-800 dark:bg-slate-800/60 dark:text-slate-200 leading-relaxed font-sans">
                {selectedMessage.messageText}
              </div>

              {/* Previous replies if any */}
              {selectedMessage.replies && selectedMessage.replies.length > 1 && (
                <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Thread History
                  </span>
                  {selectedMessage.replies.map((r) => (
                    <div
                      key={r.id}
                      className={`rounded-lg p-2 text-xs ${
                        r.sender === "user"
                          ? "bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200 ml-6"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 mr-6"
                      }`}
                    >
                      <span className="text-[10px] font-bold block opacity-70">
                        {r.sender === "user" ? "You" : selectedMessage.senderName} • {r.timestamp}
                      </span>
                      {r.text}
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Composer */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Direct Official Reply
                  </span>
                  <button
                    onClick={handleAiDraft}
                    disabled={isAiDrafting}
                    className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isAiDrafting ? "Drafting..." : "Suggest AI Response"}</span>
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply directly to ${selectedMessage.senderName} on ${selectedMessage.platform}...`}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:opacity-40"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <Inbox className="h-10 w-10" />
              <p className="mt-2 text-xs">Select a message from the list to view and reply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
