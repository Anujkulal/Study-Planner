import type { StudySession } from '../types';

const STORAGE_KEY = 'study_sessions';
const DELAY = 500; // Simulate network delay

// Helper to get sessions from localStorage
const getStoredSessions = (): StudySession[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Helper to save sessions to localStorage
const saveStoredSessions = (sessions: StudySession[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

// Simulate async delay
const delay = () => new Promise(resolve => setTimeout(resolve, DELAY));

export const sessionsAPI = {
  // Get all sessions
  getAllSessions: async (): Promise<StudySession[]> => {
    await delay();
    return getStoredSessions();
  },

  // Get sessions for a specific date range
  getSessionsByDateRange: async (startDate: string, endDate: string): Promise<StudySession[]> => {
    await delay();
    const sessions = getStoredSessions();
    return sessions.filter(s => s.day >= startDate && s.day <= endDate);
  },

  // Create a new session
  createSession: async (session: Omit<StudySession, 'id' | 'createdAt'>): Promise<StudySession> => {
    await delay();
    const sessions = getStoredSessions();
    const newSession: StudySession = {
      ...session,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    sessions.push(newSession);
    saveStoredSessions(sessions);
    return newSession;
  },

  // Update a session
  updateSession: async (id: string, updates: Partial<StudySession>): Promise<StudySession> => {
    await delay();
    const sessions = getStoredSessions();
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Session not found');
    
    sessions[index] = { ...sessions[index], ...updates };
    saveStoredSessions(sessions);
    return sessions[index];
  },

  // Delete a session
  deleteSession: async (id: string): Promise<void> => {
    await delay();
    const sessions = getStoredSessions();
    const filtered = sessions.filter(s => s.id !== id);
    saveStoredSessions(filtered);
  },
};