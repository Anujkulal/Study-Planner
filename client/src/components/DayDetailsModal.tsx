import { type StudySession } from "../types";
import { formatDate } from "../lib/dateUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, Pencil, Trash2, Clock, FileText } from "lucide-react";
import { cn } from "../lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { sessionsAPI } from "@/api/sessions";
import { toast } from "sonner";
import { useState } from "react";

interface DayDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  sessions: StudySession[];
  onAddSession: (day: string) => void;
  onEditSession: (session: StudySession) => void;
  onDeleteSession: (id: string) => void;
  onSessionUpdated?: () => void;
}

export const DayDetailsModal = ({
  open,
  onOpenChange,
  date,
  sessions,
  onAddSession,
  onEditSession,
  onDeleteSession,
  onSessionUpdated,
}: DayDetailsModalProps) => {
  const [updatingSessionId, setUpdatingSessionId] = useState<string | null>(
    null
  );

  if (!date) return null;

  const dateStr = formatDate(date);
  const daySessions = sessions.filter((s) => s.day === dateStr);
  console.log("Day sessions for", dateStr, daySessions);
  const totalMinutes = daySessions.reduce((sum, s) => sum + s.duration, 0);
  const completedCount = daySessions.filter(
    (s) => s.status === "completed"
  ).length;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleStatusChange = async (session: StudySession) => {
    try {
      setUpdatingSessionId(session.id);

      const newStatus =
        session.status === "completed" ? "pending" : "completed";

      await sessionsAPI.updateSession(session.id, {
        status: newStatus,
      });

      if (onSessionUpdated) {
        onSessionUpdated();
      }
    } catch (error) {
      console.error("Failed to update session status:", error);
      toast.error("Failed to update session status");
    } finally {
      setUpdatingSessionId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] backdrop-blur-lg bg-zinc-100/60 dark:bg-zinc-900/10 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {formatDisplayDate(date)}
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(totalMinutes)}</span>
            </div>
            <div>
              {completedCount} of {daySessions.length} completed
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            onClick={() => {
              onOpenChange(false);
              onAddSession(dateStr);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Study Session
          </Button>

          <ScrollArea className="h-[400px]">
            {daySessions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No study sessions for this day</p>
                <p className="text-sm mt-1">
                  Click the button above to add one
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {daySessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all",
                      session.status === "completed"
                        ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                        : "bg-card border-border"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {session.subject}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDuration(session.duration)}</span>
                          </div>
                          <Button
                            variant="ghost"
                            onClick={() => handleStatusChange(session)}
                            disabled={updatingSessionId === session.id}
                            className="h-6 px-2 -ml-2"
                          >
                            <Badge
                              variant={
                                session.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {session.status}
                            </Badge>
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            onOpenChange(false);
                            onEditSession(session);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => onDeleteSession(session.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {session.notes && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {session.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
