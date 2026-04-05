import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { mockStudentResults, mockPerformanceTrend } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  const subjects = useMemo(() => {
    const subs = [...new Set(mockPerformanceTrend.map((p) => p.subject))];
    return ['All', ...subs];
  }, []);

  const filteredTrend = useMemo(() => {
    if (selectedSubject === 'All') return mockPerformanceTrend;
    return mockPerformanceTrend.filter((p) => p.subject === selectedSubject);
  }, [selectedSubject]);

  const getScoreBadge = (pct: number) => {
    if (pct >= 70) return 'bg-success/10 text-success';
    if (pct >= 50) return 'bg-warning/10 text-warning';
    return 'bg-destructive/10 text-destructive';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.username || user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-muted-foreground mt-1">Your exam dashboard at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard title="Completed Exams" value={mockStudentResults.length} icon={Target} color="success" />
        <StatCard title="Subjects" value={subjects.length - 1} icon={TrendingUp} color="accent" />
      </div>

      {/* Performance Trend with Subject Filter */}
      <div className="bg-card rounded-xl border p-6 mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-lg font-semibold text-card-foreground">Performance Trend</h2>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-lg border bg-background text-foreground text-sm focus:ring-2 focus:ring-accent transition-all"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="exam" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--accent))', r: 4 }}
                animationDuration={600}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-4">Recent Results</h2>
      <div className="grid gap-3">
        {mockStudentResults.map((result, i) => {
          const pct = Math.round((result.obtainedMarks / result.totalMarks) * 100);
          return (
            <motion.div
              key={result.examId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <h3 className="font-medium text-card-foreground">{result.examTitle}</h3>
                <p className="text-xs text-muted-foreground">{result.subject} · {result.submittedAt}</p>
              </div>
              <Badge variant="secondary" className={getScoreBadge(pct)}>{pct}%</Badge>
              <div className="text-right">
                <p className="text-lg font-bold text-accent">{result.obtainedMarks}/{result.totalMarks}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentDashboard;
