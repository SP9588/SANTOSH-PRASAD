import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Plus,
  Share2,
} from "lucide-react";
import { ScheduledPost } from "../../types";

interface CalendarViewProps {
  scheduledPosts: ScheduledPost[];
  onOpenPublisher: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  scheduledPosts,
  onOpenPublisher,
}) => {
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);

  // Generate 7 days for the selected week
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDate = new Date();
  const currentDayIndex = (currentDate.getDay() + 6) % 7; // Monday is 0

  const calendarDays = daysOfWeek.map((dayName, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - currentDayIndex + idx + selectedWeekOffset * 7);
    return {
      name: dayName,
      dateNum: d.getDate(),
      fullDateStr: d.toISOString().split("T")[0],
      isToday:
        selectedWeekOffset === 0 && d.getDate() === currentDate.getDate(),
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Content Publishing Calendar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Orchestrate your multi-platform queue, visualize scheduled releases, and discover AI-recommended posting windows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Week navigation */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setSelectedWeekOffset((w) => w - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
              {selectedWeekOffset === 0
                ? "This Week"
                : selectedWeekOffset > 0
                ? `+${selectedWeekOffset} Weeks`
                : `${selectedWeekOffset} Weeks`}
            </span>
            <button
              onClick={() => setSelectedWeekOffset((w) => w + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={onOpenPublisher}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid (Week View) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
          {calendarDays.map((day) => {
            const dayPosts = scheduledPosts.filter((p) =>
              p.scheduled_time.startsWith(day.fullDateStr)
            );

            return (
              <div
                key={day.name}
                className={`min-h-[220px] rounded-xl border p-2.5 transition flex flex-col justify-between ${
                  day.isToday
                    ? "border-indigo-400 bg-indigo-50/30 dark:border-indigo-800 dark:bg-indigo-950/20"
                    : "border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30"
                }`}
              >
                <div>
                  {/* Day Label */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                    <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                      {day.name}
                    </span>
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        day.isToday
                          ? "bg-indigo-600 text-white"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {day.dateNum}
                    </span>
                  </div>

                  {/* AI Peak Recommendation window pill */}
                  <div className="my-2 rounded bg-purple-50 px-1.5 py-1 text-[9px] font-medium text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5" />
                    <span>Peak: 6:00 PM</span>
                  </div>

                  {/* Posts for this day */}
                  <div className="space-y-2">
                    {dayPosts.map((post) => (
                      <div
                        key={post.id}
                        className="rounded-lg border border-slate-200 bg-white p-2 shadow-xs dark:border-slate-700 dark:bg-slate-800 transition hover:scale-[1.02]"
                      >
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(post.scheduled_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <h4 className="mt-1 text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {post.title}
                        </h4>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {post.platforms.map((p) => (
                            <span
                              key={p}
                              className="rounded bg-indigo-50 px-1 py-0.2 text-[8px] font-bold uppercase text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onOpenPublisher}
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 py-1 text-[10px] font-medium text-slate-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Post</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
