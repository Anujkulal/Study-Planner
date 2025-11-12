import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Brain, TrendingUp, Target, Lightbulb, Loader2 } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface LearningInsights {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  productivity_score: number;
  consistency_score: number;
  focus_areas: string[];
}

export const AIInsights = () => {
  const [insights, setInsights] = useState<LearningInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const { sessions } = useSelector((state: RootState) => state.session);

  const analyzePatterns = async () => {
    if (!sessions || sessions.length < 5) {
      return;
    }

    setLoading(true);
    try {
      const result = await aiService.analyzeLearningPatterns(sessions);
      setInsights(result);
      console.log("Learning Insights: ", result);
    } catch (error) {
      console.error('Failed to analyze patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (sessions && sessions.length >= 5) {
  //     analyzePatterns();
  //   }
  // }, [sessions?.length]);

  if (!sessions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Learning Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length < 5) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Learning Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Complete at least 5 study sessions to unlock AI-powered insights about your learning patterns.
          </p>
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${(sessions.length / 5) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {sessions.length} / 5 sessions completed
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <Card className='h-full'>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Learning Insights
          </CardTitle>
          <Button 
            onClick={analyzePatterns} 
            // disabled={loading}
            disabled
            size="sm"
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Refresh Analysis'
            )}
          </Button>
        </CardHeader>

        {loading && !insights ? (
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          </CardContent>
        ) : insights && (
          <CardContent className="space-y-6">
            {/* Scores */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-3xl font-bold dark:text-green-400 text-gray-300">
                  {insights.productivity_score}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Productivity Score
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {insights.consistency_score}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Consistency Score
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold mb-3">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Your Strengths
              </h3>
              <div className="space-y-2">
                {insights.strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div >
              <h3 className="flex items-center gap-2 font-semibold mb-3">
                <Target className="h-4 w-4 text-orange-600" />
                Areas for Improvement
              </h3>
              <div className="space-y-2">
                {insights.weaknesses.map((weakness, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-orange-600">!</span>
                    <span>{weakness}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div >
              <h3 className="flex items-center gap-2 font-semibold mb-3">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                AI Recommendations
              </h3>
              <div className="space-y-2">
                {insights.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-muted rounded-lg text-sm">
                    {rec}
                  </div>
                ))}
              </div>
            </div>

            {/* Focus Areas */}
            <div >
              <h3 className="font-semibold mb-3">Focus On These Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {insights.focus_areas.map((subject, idx) => (
                  <Badge key={idx} variant="secondary">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};