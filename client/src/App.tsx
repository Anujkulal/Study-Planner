import { useState, useEffect } from "react";
import { type StudySession } from "./types";
import { WeeklyCalendar } from "./components/WeeklyCalendar";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { SessionDialog } from "./components/SessionDialog";
import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./redux/store";
import { clearMessages, deleteSession, getAllSessions } from "./redux/slices/sessionSlice";
import { AIInsights } from "./components/AIInsights";
import { AIScheduleGenerator } from "./components/AIScheduleGenerator";
import { AIStudyAssistant } from "./components/AIStudyAssistant";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { Bot, Home } from "lucide-react";
import { CustomCursor } from "./components/cursor/CustomCursor";
import { useNavigate } from "react-router-dom";

const App = () => {
  // const [sessions, setSessions] = useState<StudySession[]>([]);
  // const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, sessions } = useSelector((state: RootState) => state.session);

  useEffect(() => {
    dispatch(getAllSessions());
  }, [dispatch])

  useEffect(() => {
    if(!dialogOpen){
      dispatch(clearMessages())
    }
  }, [dialogOpen, dispatch])

  // const loadSessions = async () => {
  //   // setLoading(true);
  //   try {
  //     // const data = await sessionsAPI.getAllSessions();
  //      const result = await dispatch(getAllSessions()).unwrap();
  //     // setSessions(data);
  //   } catch (error) {
  //     console.error('Failed to load sessions:', error);
  //   } finally {
  //     // setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   // console.log("Min Date: ", maxDate)
  //   loadSessions();
  // }, []);

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

      // await sessionsAPI.deleteSession(id);
      await dispatch(deleteSession(id)).unwrap();
      // await loadSessions();
      dispatch(getAllSessions());
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

   const handleSessionUpdated = async () => {
    // await loadSessions();
    dispatch(getAllSessions());
    setDialogOpen(false);
  };

  const handleSaveSession = async () => {
    // await loadSessions();
    dispatch(getAllSessions());
    setDialogOpen(false);
    setEditingSession(null);
    setSelectedDay(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CustomCursor />

      <Header onAddSession={() => handleAddSession()} />

        <Button
        variant="outline"
        size="icon"
        onClick={() => navigate('/')}
        className="fixed top-20 left-4 z-50 rounded-full shadow-lg"
      >
        <Home className="h-4 w-4" />
      </Button>
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <ProgressDashboard sessions={sessions} />

        {/* AI Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <WeeklyCalendar
          sessions={sessions}
          onAddSession={handleAddSession}
          onEditSession={handleEditSession}
          onDeleteSession={handleDeleteSession}
          loading={loading}
          onSessionUpdated={handleSessionUpdated}
        />
          </div>
          <div className="space-y-4">
            <AIInsights />
            <AIScheduleGenerator />
          </div>
        </div>

        {/* AI Chat Assistant - Floating */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: showAIPanel ? 1 : 0 }}
          className="fixed bottom-12 right-4 w-96 z-50"
        >
          <AIStudyAssistant showAIPanel={showAIPanel} setShowAIPanel={setShowAIPanel}  />
        </motion.div>
        
        <Button
          onClick={() => setShowAIPanel(!showAIPanel)}
          className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
        
      </main>

      <SessionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        session={editingSession}
        defaultDay={selectedDay}
        onSave={handleSaveSession}
      />

      <Toaster richColors position="top-center" />
      
      {/* <ParticleTrailCursor /> */}
      {/* <BlobCursor /> */}
    </div>
  );
};

export default App;