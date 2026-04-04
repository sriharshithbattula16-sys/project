import { MOCK_EXAMS, MOCK_STUDENT_RESULTS } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";

const StudentExams = () => {
  const available = MOCK_EXAMS.filter((e) => e.status === "active");
  const completedIds = new Set(MOCK_STUDENT_RESULTS.map((r) => r.examId));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">My Exams</h1>
        <p className="text-muted-foreground">View available and completed examinations.</p>
      </div>

      <h2 className="text-lg font-semibold">Available</h2>
      <div className="grid gap-3">
        {available.map((exam) => {
          const done = completedIds.has(exam.id);
          return (
            <Card key={exam.id} className="flex items-center gap-4 p-5 shadow-card">
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{exam.title}</p>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                  <span>{exam.subject}</span>
                  <span className="capitalize">{exam.type === "mcq" ? "MCQ" : "Descriptive"}</span>
                  <span className="flex items-center gap-1"><Clock size={12} />{exam.duration} min</span>
                  <span>{exam.totalMarks} marks</span>
                </div>
              </div>
              {done ? (
                <Badge variant="outline" className="bg-success/10 text-success border-success/20 gap-1">
                  <CheckCircle2 size={12} /> Completed
                </Badge>
              ) : (
                <Link to={`/student/exam/${exam.id}`}>
                  <Button size="sm" className="gap-1">Start <ArrowRight size={14} /></Button>
                </Link>
              )}
            </Card>
          );
        })}
      </div>

      <h2 className="text-lg font-semibold">Completed</h2>
      <div className="grid gap-3">
        {MOCK_STUDENT_RESULTS.map((r) => (
          <Card key={r.examId} className="flex items-center gap-4 p-5 shadow-card">
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{r.examTitle}</p>
              <p className="text-sm text-muted-foreground">{r.subject} · {r.completedAt}</p>
            </div>
            {r.status === "evaluated" ? (
              <div className="text-right">
                <p className="font-bold">{r.scoredMarks}/{r.totalMarks}</p>
                <p className="text-xs text-muted-foreground">{Math.round((r.scoredMarks / r.totalMarks) * 100)}%</p>
              </div>
            ) : (
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Pending</Badge>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentExams;
