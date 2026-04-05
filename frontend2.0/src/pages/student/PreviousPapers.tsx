import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockStudentResults } from '@/lib/mockData';
import { ChevronDown, ChevronUp, FileText, CheckCircle, XCircle, MinusCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PreviousPapers = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [expandedExam, setExpandedExam] = useState<string | null>(null);

  const subjects = useMemo(() => {
    const subs = [...new Set(mockStudentResults.map((r) => r.subject))];
    return ['All', ...subs];
  }, []);

  const filteredResults = useMemo(() => {
    if (selectedSubject === 'All') return mockStudentResults;
    return mockStudentResults.filter((r) => r.subject === selectedSubject);
  }, [selectedSubject]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Previous Papers</h1>
        <p className="text-muted-foreground mt-1">Review your past exam attempts and answers</p>
      </div>

      {/* Subject filter */}
      <div className="mb-6">
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-4 py-2.5 rounded-xl border bg-card text-foreground text-sm font-medium focus:ring-2 focus:ring-accent transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {filteredResults.length === 0 && (
        <div className="bg-card rounded-xl border p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No previous papers found for this subject</p>
        </div>
      )}

      <div className="space-y-4">
        {filteredResults.map((result, i) => {
          const isExpanded = expandedExam === result.examId;
          const pct = Math.round((result.obtainedMarks / result.totalMarks) * 100);

          return (
            <motion.div
              key={result.examId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              layout
              className="bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-info/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground">{result.examTitle}</h3>
                  <p className="text-sm text-muted-foreground">{result.subject} · {result.submittedAt}</p>
                </div>
                <div className="text-right mr-2">
                  <p className={`text-xl font-bold ${pct >= 70 ? 'text-success' : pct >= 50 ? 'text-warning' : 'text-destructive'}`}>
                    {result.obtainedMarks}/{result.totalMarks}
                  </p>
                  <p className="text-xs text-muted-foreground">{pct}%</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedExam(isExpanded ? null : result.examId)}
                  className="gap-2 hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-all"
                >
                  {isExpanded ? 'Hide' : 'View'}
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </Button>
              </div>

              <AnimatePresence>
                {isExpanded && result.questionResults && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t"
                  >
                    <div className="p-5 space-y-3">
                      {result.questionResults.map((qr, qi) => (
                        <motion.div
                          key={qr.questionId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: qi * 0.04 }}
                          className="bg-muted/20 rounded-xl p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {qr.status === 'correct' && <CheckCircle className="w-5 h-5 text-success" />}
                              {qr.status === 'incorrect' && <XCircle className="w-5 h-5 text-destructive" />}
                              {qr.status === 'partial' && <AlertTriangle className="w-5 h-5 text-warning" />}
                              {qr.status === 'skipped' && <MinusCircle className="w-5 h-5 text-muted-foreground" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-card-foreground mb-3">
                                Q{qi + 1}. {qr.questionText}
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="p-3 rounded-lg bg-background border">
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
                            </div>
                            <span className="text-sm font-semibold text-muted-foreground">{qr.obtainedMarks}/{qr.marks}</span>
                          </div>
                        </motion.div>
                      ))}
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

export default PreviousPapers;
