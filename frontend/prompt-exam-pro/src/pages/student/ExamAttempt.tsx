import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MOCK_EXAMS } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Clock, ChevronLeft, ChevronRight, Flag, Send, Upload, CheckCircle2 } from "lucide-react";

const ExamAttempt = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const exam = MOCK_EXAMS.find((e) => e.id === examId);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState((exam?.duration ?? 30) * 60);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted || !exam) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(interval); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted, exam]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    toast({ title: exam?.type === "mcq" ? "Exam Submitted!" : "Answers Submitted", description: exam?.type === "mcq" ? "Your results are ready." : "Your answers are pending AI evaluation." });
  }, [exam, toast]);

  if (!exam || exam.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <p className="text-lg font-semibold mb-2">Exam not available</p>
        <p className="text-muted-foreground mb-4">This exam doesn't have questions yet or isn't available.</p>
        <Button variant="outline" onClick={() => navigate("/student")}>Back to Dashboard</Button>
      </div>
    );
  }

  if (submitted) {
    const correctCount = exam.type === "mcq"
      ? exam.questions.filter((q) => answers[q.id] === q.correctAnswer).length
      : 0;
    return (
      <div className="max-w-lg mx-auto py-12 animate-scale-in text-center">
        <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="text-success" size={32} />
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {exam.type === "mcq" ? "Results" : "Submitted Successfully"}
        </h1>
        {exam.type === "mcq" ? (
          <>
            <p className="text-4xl font-bold text-success my-4">
              {correctCount * (exam.totalMarks / exam.questions.length)}/{exam.totalMarks}
            </p>
            <p className="text-muted-foreground">
              You answered {correctCount} out of {exam.questions.length} correctly.
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">Your answers have been submitted and are pending AI evaluation. Results will appear in your analytics once ready.</p>
        )}
        <Button className="mt-6" onClick={() => navigate("/student")}>Back to Dashboard</Button>
      </div>
    );
  }

  const q = exam.questions[currentQ];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">{exam.title}</h1>
          <p className="text-sm text-muted-foreground">{exam.subject} · {exam.type === "mcq" ? "MCQ" : "Descriptive"}</p>
        </div>
        <div className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-sm font-bold ${timeLeft < 300 ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground"}`}>
          <Clock size={16} />
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
      </div>

      {/* Question Navigation Dots */}
      <div className="flex flex-wrap gap-2">
        {exam.questions.map((qItem, i) => (
          <button
            key={qItem.id}
            onClick={() => setCurrentQ(i)}
            className={`h-8 w-8 rounded-md text-xs font-medium transition-all border ${
              i === currentQ
                ? "bg-primary text-primary-foreground border-primary"
                : answers[qItem.id]
                ? "bg-success/10 text-success border-success/30"
                : "bg-card text-muted-foreground border-border hover:border-primary/50"
            } ${flagged.has(qItem.id) ? "ring-2 ring-warning" : ""}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <Card className="p-6 shadow-card">
        <div className="flex items-start justify-between mb-4">
          <Badge variant="outline">Question {currentQ + 1} of {exam.questions.length}</Badge>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{q.marks} marks</Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setFlagged((prev) => {
                  const n = new Set(prev);
                  n.has(q.id) ? n.delete(q.id) : n.add(q.id);
                  return n;
                });
              }}
              className={flagged.has(q.id) ? "text-warning" : "text-muted-foreground"}
            >
              <Flag size={16} />
            </Button>
          </div>
        </div>

        <p className="text-lg font-medium mb-6">{q.text}</p>

        {q.type === "mcq" && q.options ? (
          <div className="space-y-3">
            {q.options.map((opt, j) => (
              <button
                key={j}
                onClick={() => setAnswers((p) => ({ ...p, [q.id]: opt }))}
                className={`w-full text-left rounded-lg border p-4 text-sm font-medium transition-all ${
                  answers[q.id] === opt
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <span className="mr-3 font-mono">{String.fromCharCode(65 + j)}.</span>
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <Textarea
              placeholder="Type your answer here..."
              value={answers[q.id] || ""}
              onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
              className="min-h-[160px]"
            />
            <Button variant="outline" size="sm" className="gap-2">
              <Upload size={14} /> Upload Handwritten Answer
            </Button>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={currentQ === 0} onClick={() => setCurrentQ((p) => p - 1)} className="gap-2">
          <ChevronLeft size={16} /> Previous
        </Button>
        {currentQ < exam.questions.length - 1 ? (
          <Button onClick={() => setCurrentQ((p) => p + 1)} className="gap-2">
            Next <ChevronRight size={16} />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
            <Send size={16} /> Submit Exam
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExamAttempt;
