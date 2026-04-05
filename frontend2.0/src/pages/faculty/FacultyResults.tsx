import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockExams, mockStudentPerformances } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp, Eye, UserX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// All enrolled students (mock)
const allEnrolledStudents = [
  { studentId: 's1', studentName: 'Alex Chen', email: 'alex@exam.com' },
  { studentId: 's2', studentName: 'Maria Garcia', email: 'maria@exam.com' },
  { studentId: 's3', studentName: 'James Wilson', email: 'james@exam.com' },
  { studentId: 's4', studentName: 'Sarah Lee', email: 'sarah@exam.com' },
  { studentId: 's5', studentName: 'David Kim', email: 'david@exam.com' },
];

const FacultyResults = () => {
  const evaluated = mockExams.filter((e) => e.averageScore);
  const chartData = evaluated.map((e) => ({
    name: e.title.length > 20 ? e.title.slice(0, 20) + '…' : e.title,
    avgScore: e.averageScore,
    attempts: e.attempts,
  }));

  const [expandedExam, setExpandedExam] = useState<string | null>(null);

  const getStudentsForExam = (examId: string) => {
    const performances = mockStudentPerformances.filter((s) => s.examId === examId);
    const attemptedIds = new Set(performances.map((p) => p.studentId));

    return allEnrolledStudents.map((student) => {
      const perf = performances.find((p) => p.studentId === student.studentId);
      return {
        ...student,
        attempted: attemptedIds.has(student.studentId),
        score: perf?.score || 0,
        totalMarks: perf?.totalMarks || 0,
      };
    }).sort((a, b) => {
      if (a.attempted && !b.attempted) return -1;
      if (!a.attempted && b.attempted) return 1;
      return b.score - a.score;
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Results Overview</h1>
        <p className="text-muted-foreground mt-1">View aggregated performance across all exams</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Average Scores by Exam</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey="avgScore" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Avg Score %" animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid gap-4">
        {evaluated.map((exam) => {
          const students = getStudentsForExam(exam.id);
          const isExpanded = expandedExam === exam.id;

          return (
            <motion.div key={exam.id} layout className="bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all">
              <div className="p-5 flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground">{exam.title}</h3>
                  <p className="text-sm text-muted-foreground">{exam.subject} · {exam.attempts} students</p>
                </div>
                <div className="text-right mr-2">
                  <p className="text-2xl font-bold bg-gradient-to-r from-accent to-info bg-clip-text text-transparent">{exam.averageScore}%</p>
                  <p className="text-xs text-muted-foreground">avg score</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedExam(isExpanded ? null : exam.id)}
                  className="gap-2 hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {isExpanded ? 'Hide' : 'View Result'}
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </Button>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t"
                  >
                    <div className="p-4">
                      <h4 className="text-sm font-semibold text-card-foreground mb-3">All Enrolled Students</h4>
                      <div className="space-y-2">
                        {students.map((s, i) => (
                          <motion.div
                            key={s.studentId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                          >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              !s.attempted ? 'bg-destructive/10 text-destructive' :
                              i === 0 ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'
                            }`}>
                              {s.attempted ? i + 1 : <UserX className="w-3 h-3" />}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-card-foreground truncate">{s.studentName}</p>
                              <p className="text-xs text-muted-foreground">{s.email}</p>
                            </div>
                            {s.attempted ? (
                              <Badge variant="secondary" className={
                                Math.round((s.score / s.totalMarks) * 100) >= 70 ? 'bg-success/10 text-success' :
                                Math.round((s.score / s.totalMarks) * 100) >= 50 ? 'bg-warning/10 text-warning' :
                                'bg-destructive/10 text-destructive'
                              }>
                                {s.score}/{s.totalMarks} ({Math.round((s.score / s.totalMarks) * 100)}%)
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-destructive/10 text-destructive font-semibold">
                                Absent
                              </Badge>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FacultyResults;
