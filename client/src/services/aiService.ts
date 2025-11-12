import type { StudySession } from "@/types";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for demo, use backend in production
});

export const aiService = {
  async generateStudySchedule(
    sessions: StudySession[],
    preferences: {
      studyGoalHours: number;
      preferredTimes: string[];
      subjects: string[];
    }
  ) {
    const prompt = `
Based on the following study history and preferences, generate an optimal weekly study schedule:

Past Sessions:
${sessions
  .map((s) => `- ${s.subject}: ${s.duration} mins on ${s.day}`)
  .join("\n")}

Preferences:
- Weekly goal: ${preferences.studyGoalHours} hours
- Preferred times: ${preferences.preferredTimes.join(", ")}
- Subjects to focus on: ${preferences.subjects.join(", ")}

Generate a balanced weekly study schedule in JSON format with the following structure:
{
  "schedule": [
    {
      "day": "2024-11-13",
      "subject": "Mathematics",
      "duration": 90,
      "startTime": "14:00",
      "reason": "Why this time is optimal"
    }
  ],
  "insights": "Overall insights about the schedule"
}
`;

    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert study planner that creates optimal, personalized study schedules.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  },

  async analyzeLearningPatterns(sessions: StudySession[]) {
    const completedSessions = sessions.filter((s) => s.status === "completed");

    const prompt = `Analyze the following study pattern and provide insights:

Study Sessions:
${completedSessions
  .map(
    (s) =>
      `- ${s.subject}: ${s.duration} mins on ${s.day}${
        s.notes ? ` (Notes: ${s.notes})` : ""
      }`
  )
  .join("\n")}

Provide analysis in JSON format:
{
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "productivity_score": 85,
  "consistency_score": 75,
  "focus_areas": ["subject that needs more attention"]
}`;

    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL,
      messages: [
        { role: "system", content: "You are a learning analytics expert." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  },

  async chatWithStudyAssistant(
    userMessage: string,
    context: {
      recentSessions: StudySession[];
      currentSubject?: string;
    }
  ) {
    const systemPrompt = `You are a helpful study assistant. You help students with:
- Study planning and scheduling
- Learning strategies
- Motivation and productivity tips
- Subject-specific guidance

Recent study context:
${context.recentSessions
  .slice(0, 5)
  .map((s) => `- ${s.subject}: ${s.duration} mins (${s.status})`)
  .join("\n")}
${
  context.currentSubject
    ? `\nCurrently studying: ${context.currentSubject}`
    : ""
}`;

    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.8,
    });

    return response.choices[0].message.content;
  },
};
