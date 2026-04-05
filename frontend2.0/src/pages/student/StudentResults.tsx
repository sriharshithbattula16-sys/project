import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockStudentResults } from '@/lib/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { CheckCircle, XCircle, MinusCircle, Clock, Lightbulb, AlertTriangle } from 'lucide-react';

const COLORS = ['hsl(152, 60%, 40%)', 'hsl(0, 72%, 51%)', 'hsl(215, 15%, 70%)'];

const StudentResults = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  const subjects = useMemo(() => {
    const subs = [...new Set(mockStudentResults.map((r) => r.subject))];
    return ['All', ...subs];
  }, []);

  const filteredResults = useMemo(() => {
    if (selectedSubject === 'All') return mockStudentResults;
    return mockStudentResults.filter((r) => r.subject === selectedSubject);
  }, [selectedSubject]);

  const [selectedExam, setSelectedExam] = useState(filteredResults[0]);

  // Update selected exam when filter changes
  useMemo(() => {
    if (!filteredResults.find((r) => r.examId === selectedExam?.examId)) {
      setSelectedExam(filteredResults[0]);
    }
  }, [filteredResults]);

  // Combined stats for "All" subjects
  const combinedStats = useMemo(() => {
    const totalMarks = filteredResults.reduce((a, r) => a + r.totalMarks, 0);
    const obtainedMarks = filteredResults.reduce((a, r) => a + r.obtainedMarks, 0);
    const totalQuestions = filteredResults.reduce((a, r) => a + r.totalQuestions, 0);
    const answered = filteredResults.reduce((a, r) => a + r.answered, 0);
    const correct = filteredResults.reduce((a, r) => a + r.correct, 0);
    const incorrect = filteredResults.reduce((a, r) => a + r.incorrect, 0);
    const skipped = filteredResults.reduce((a, r) => a + r.skipped, 0);
    const totalTime = filteredResults.reduce((a, r) => a + (r.timeTaken || 0), 0);
    const pct = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
    const accuracy = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    return { totalMarks, obtainedMarks, totalQuestions, answered, correct, incorrect, skipped, totalTime, pct, accuracy };
  }, [filteredResults]);

  if (!selectedExam && filteredResults.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">My Results</h1>
          <p className="text-muted-foreground mt-1">No results available for selected subject</p>
        </div>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-4 py-2.5 rounded-xl border bg-card text-foreground text-sm font-medium focus:ring-2 focus:ring-accent transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    );
  }

  // Stats: show combined when "All", individual when specific exam
  const showCombined = selectedSubject === 'All' || filteredResults.length > 1;
  const statsSource = selectedExam || filteredResults[0];

  const pieData = selectedExam ? [
    { name: 'Correct', value: selectedExam.correct },
    { name: 'Incorrect', value: selectedExam.incorrect },
    { name: 'Skipped', value: selectedExam.skipped },
  ] : [
    { name: 'Correct', value: combinedStats.correct },
    { name: 'Incorrect', value: combinedStats.incorrect },
    { name: 'Skipped', value: combinedStats.skipped },
  ];

  const barData = selectedExam?.questionResults?.map((qr, i) => ({
    name: `Q${i + 1}`,
    obtained: qr.obtainedMarks,
    total: qr.marks,
  }));

  // Use combined stats for the stat cards
  const displayPct = showCombined && !selectedExam ? combinedStats.pct : (selectedExam ? Math.round((selectedExam.obtainedMarks / selectedExam.totalMarks) * 100) : 0);
  const displayMarksObt = showCombined && !selectedExam ? combinedStats.obtainedMarks : (selectedExam?.obtainedMarks || 0);
  const displayMarksTotal = showCombined && !selectedExam ? combinedStats.totalMarks : (selectedExam?.totalMarks || 0);
  const displayAnswered = showCombined && !selectedExam ? combinedStats.answered : (selectedExam?.answered || 0);
  const displayTotalQ = showCombined && !selectedExam ? combinedStats.totalQuestions : (selectedExam?.totalQuestions || 0);
  const displayAccuracy = showCombined && !selectedExam ? combinedStats.accuracy : (selectedExam ? Math.round((selectedExam.correct / selectedExam.totalQuestions) * 100) : 0);
  const displayTime = showCombined && !selectedExam ? combinedStats.totalTime : (selectedExam?.timeTaken || 0);
  const timeMins = Math.floor(displayTime / 60);
  const timeSecs = displayTime % 60;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">My Results</h1>
        <p className="text-muted-foreground mt-1">Detailed performance analytics</p>
      </div>

      {/* Subject filter */}
      <div className="mb-6">
        <select
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setSelectedExam(null!);
          }}
          className="px-4 py-2.5 rounded-xl border bg-card text-foreground text-sm font-medium focus:ring-2 focus:ring-accent transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Exam selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filteredResults.length > 1 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedExam(null!)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              !selectedExam
                ? 'bg-gradient-to-r from-accent to-info text-accent-foreground shadow-glow'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            Combined
          </motion.button>
        )}
        {filteredResults.map((r) => (
          <motion.button
            key={r.examId}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedExam(r)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedExam?.examId === r.examId
                ? 'bg-gradient-to-r from-accent to-info text-accent-foreground shadow-glow'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            {r.examTitle}
          </motion.button>
        ))}
      </div>

      {/* Score summary */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedExam?.examId || 'combined'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6"
        >
          <div className="bg-card rounded-xl border p-4 text-center hover:shadow-lg transition-all hover:-translate-y-0.5 group">
            <p className="text-3xl font-bold bg-gradient-to-r from-accent to-info bg-clip-text text-transparent">{displayPct}%</p>
            <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground transition-colors">Overall Score</p>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center hover:shadow-lg transition-all hover:-translate-y-0.5 group">
            <p className="text-3xl font-bold text-card-foreground">{displayMarksObt}/{displayMarksTotal}</p>
            <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground transition-colors">Marks</p>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center hover:shadow-lg transition-all hover:-translate-y-0.5 group">
            <p className="text-3xl font-bold text-info">{displayAnswered}/{displayTotalQ}</p>
            <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground transition-colors">Answered</p>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center hover:shadow-lg transition-all hover:-translate-y-0.5 group">
            <p className="text-3xl font-bold text-success">{displayAccuracy}%</p>
            <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground transition-colors">Accuracy</p>
          </div>
          {displayTime > 0 && (
            <div className="bg-card rounded-xl border p-4 text-center hover:shadow-lg transition-all hover:-translate-y-0.5 group">
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-warning" />
                <p className="text-2xl font-bold text-card-foreground">{timeMins}:{String(timeSecs).padStart(2, '0')}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground transition-colors">Time Taken</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {barData && selectedExam && (
          <div className="bg-card rounded-xl border p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-card-foreground mb-4">Question-wise Performance</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="total" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="Total" animationDuration={600} />
                  <Bar dataKey="obtained" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Obtained" animationDuration={600} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="bg-card rounded-xl border p-6 hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-card-foreground mb-4">Answer Breakdown</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3} animationDuration={600}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Feedback */}
      {selectedExam?.type === 'descriptive' && selectedExam.questionResults && (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">AI Suggestions</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {selectedExam.questionResults
              .filter((qr) => qr.feedback)
              .map((qr, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <span><strong className="text-foreground">Q{i + 1}:</strong> {qr.feedback}</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Question breakdown — show ALL questions */}
      {selectedExam?.questionResults && (
        <div>
          <h3 className="font-semibold text-foreground mb-4">Question Breakdown</h3>
          <div className="space-y-3">
            {selectedExam.questionResults.map((qr, i) => (
              <motion.div
                key={qr.questionId}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card rounded-xl border p-4 hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {qr.status === 'correct' && <CheckCircle className="w-5 h-5 text-success" />}
                    {qr.status === 'incorrect' && <XCircle className="w-5 h-5 text-destructive" />}
                    {qr.status === 'partial' && <AlertTriangle className="w-5 h-5 text-warning" />}
                    {qr.status === 'skipped' && <MinusCircle className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">Q{i + 1}. {qr.questionText}</p>
                    {qr.topic && <p className="text-xs text-accent mt-0.5">Topic: {qr.topic}</p>}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-3 rounded-lg bg-muted/30 border">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Your Answer</p>
                        <p className="text-sm text-foreground">
                          {qr.yourAnswer || <span className="italic text-muted-foreground">Not attempted</span>}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg border ${qr.status === 'correct' ? 'bg-success/5 border-success/20' : 'bg-accent/5 border-accent/20'}`}>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Correct Answer</p>
                        <p className="text-sm text-foreground">{qr.correctAnswer || '—'}</p>
                      </div>
                    </div>
                    {qr.feedback && <p className="text-xs text-info mt-2 italic">{qr.feedback}</p>}
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">{qr.obtainedMarks}/{qr.marks}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentResults;
