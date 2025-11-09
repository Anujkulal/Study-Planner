import { useState, useEffect } from "react";
import { type StudySession } from "./types";
import { sessionsAPI } from "./api/sessions";
import { WeeklyCalendar } from "./components/WeeklyCalendar";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { SessionDialog } from "./components/SessionDialog";
import { Toaster } from "sonner";
import { Header } from "./components/Header";

const App = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await sessionsAPI.getAllSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log("Min Date: ", maxDate)
    loadSessions();
  }, []);

  const handleAddSession = (day?: string) => {
    setSelectedDay(day || null);
    setEditingSession(null);
    setDialogOpen(true);
  };

  const handleEditSession = (session: StudySession) => {
    setEditingSession(session);
    setSelectedDay(null);
    setDialogOpen(true);
  };

  const handleDeleteSession = async (id: string) => {
    try {
      // Show a confirmation dialog before deleting
      const confirmed = window.confirm('Are you sure you want to delete this session?');
      if (!confirmed) return;

      await sessionsAPI.deleteSession(id);
      await loadSessions();
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const handleSaveSession = async () => {
    await loadSessions();
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onAddSession={() => handleAddSession()} />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <ProgressDashboard sessions={sessions} />
        
        <WeeklyCalendar
          sessions={sessions}
          onAddSession={handleAddSession}
          onEditSession={handleEditSession}
          onDeleteSession={handleDeleteSession}
          loading={loading}
        />
      </main>

      <SessionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        session={editingSession}
        defaultDay={selectedDay}
        onSave={handleSaveSession}
      />

      <Toaster richColors position="top-center" />
    </div>
  );
};

export default App;