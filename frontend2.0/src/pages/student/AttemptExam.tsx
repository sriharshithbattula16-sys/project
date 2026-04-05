import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockExams, mockQuestions } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Flag, ChevronLeft, ChevronRight, Send, Maximize, Minimize, ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import ExamTimer from '@/components/ExamTimer';
import QuestionNavigator from '@/components/QuestionNavigator';

const STORAGE_KEY = 'exam_answers_';

const AttemptExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const exam = mockExams.find((e) => e.id === examId);
  const questions = mockQuestions;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY + examId);
    return saved ? JSON.parse(saved) : {};
  });
  const [reviewSet, setReviewSet] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState((exam?.duration || 30) * 60);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploadPreviews, setUploadPreviews] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY + examId, JSON.stringify(answers));
  }, [answers, examId]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setCurrent((c) => Math.max(0, c - 1));
      if (e.key === 'ArrowRight') setCurrent((c) => Math.min(questions.length - 1, c + 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [questions.length]);

  const handleSubmit = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY + examId);
    toast.success(exam?.type === 'mcq' ? 'Exam submitted! Your results are ready.' : 'Answers submitted — pending AI evaluation.');
    navigate('/student/results');
  }, [exam, navigate, examId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleSubmit]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleImageUpload = (questionId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setUploadPreviews((prev) => ({ ...prev, [questionId]: url }));
        setAnswers((prev) => ({ ...prev, [questionId]: `[Image: ${file.name}]` }));
        toast.success('Image uploaded successfully');
      }
    };
    input.click();
  };

  if (!exam) return <p className="text-foreground">Exam not found</p>;

  const q = questions[current];
  const wordCount = (answers[q.id] || '').trim().split(/\s+/).filter(Boolean).length;

  const toggleReview = () => {
    setReviewSet((prev) => {
      const next = new Set(prev);
      next.has(q.id) ? next.delete(q.id) : next.add(q.id);
      return next;
    });
  };

  return (
    <div ref={containerRef} className={`${isFullscreen ? 'bg-background p-6' : ''}`}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">{exam.title}</h1>
          <p className="text-sm text-muted-foreground">{exam.subject} · {exam.type.toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={toggleFullscreen} className="w-9 h-9">
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
          <ExamTimer timeLeft={timeLeft} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-xl border p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Question {current + 1} of {questions.length} · {q.marks} marks</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleReview}
                className={`gap-1.5 ${reviewSet.has(q.id) ? 'text-warning' : 'text-muted-foreground'}`}
              >
                <Flag className="w-3.5 h-3.5" />
                {reviewSet.has(q.id) ? 'Flagged' : 'Flag'}
              </Button>
            </div>

            <p className="text-foreground font-medium text-lg mb-6">{q.text}</p>

            {q.type === 'mcq' && q.options ? (
              <div className="grid gap-3">
                {q.options.map((opt, oi) => (
                  <motion.button
                    key={oi}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      answers[q.id] === opt
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <span className="font-medium mr-3 text-muted-foreground">{String.fromCharCode(65 + oi)}.</span>
                    <span className="text-foreground">{opt}</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <Textarea
                  placeholder="Type your answer here..."
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  rows={6}
                  className="resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{wordCount} words</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleImageUpload(q.id)} className="gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" /> Upload Image
                    </Button>
                  </div>
                </div>
                {uploadPreviews[q.id] && (
                  <div className="relative inline-block">
                    <img src={uploadPreviews[q.id]} alt="Upload" className="max-h-40 rounded-lg border" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground"
                      onClick={() => {
                        setUploadPreviews((prev) => { const n = { ...prev }; delete n[q.id]; return n; });
                        setAnswers((prev) => { const n = { ...prev }; delete n[q.id]; return n; });
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            {current === questions.length - 1 ? (
              <Button onClick={handleSubmit} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <Send className="w-4 h-4" /> Submit Exam
              </Button>
            ) : (
              <Button onClick={() => setCurrent((c) => c + 1)} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="lg:w-56 shrink-0">
          <QuestionNavigator
            total={questions.length}
            current={current}
            answers={answers}
            reviewSet={reviewSet}
            questionIds={questions.map((q) => q.id)}
            onSelect={setCurrent}
          />
        </div>
      </div>
    </div>
  );
};

export default AttemptExam;
