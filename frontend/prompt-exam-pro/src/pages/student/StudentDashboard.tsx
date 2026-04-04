import { MOCK_EXAMS, MOCK_STUDENT_RESULTS } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { FileText, Trophy, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const StudentDashboard = () => {
  const { user } = useAuth();
  const available = MOCK_EXAMS.filter((e) => e.status === "active");
  const completed = MOCK_STUDENT_RESULTS.filter((r) => r.status === "evaluated");
  const avgScore = completed.length
    ? Math.round(completed.reduce((s, r) => s + (r.scoredMarks / r.totalMarks) * 100, 0) / completed.length)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.name?.split(" ")[0]}</h1>
        <p className="text-muted-foreground">Here's your exam overview and performance summary.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Available Exams", value: available.length, icon: <FileText size={18} />, color: "text-student" },
          { label: "Completed", value: MOCK_STUDENT_RESULTS.length, icon: <Trophy size={18} />, color: "text-accent" },
          { label: "Avg Score", value: `${avgScore}%`, icon: <TrendingUp size={18} />, color: "text-success" },
        ].map((s) => (
          <Card key={s.label} className="p-5 shadow-card">
            <div className={`mb-3 ${s.color}`}>{s.icon}</div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Available Exams */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Available Exams</h2>
          <Link to="/student/exams" className="text-sm text-accent hover:underline">View all</Link>
        </div>
        <div className="grid gap-3">
          {available.map((exam) => (
            <Card key={exam.id} className="flex items-center gap-4 p-4 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{exam.title}</p>
                <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                  <span>{exam.subject}</span>
                  <span className="capitalize">{exam.type === "mcq" ? "MCQ" : "Descriptive"}</span>
                  <span className="flex items-center gap-1"><Clock size={12} />{exam.duration} min</span>
                </div>
              </div>
              <Link to={`/student/exam/${exam.id}`}>
                <Button size="sm" className="gap-1">
                  Start <ArrowRight size={14} />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Results</h2>
          <Link to="/student/analytics" className="text-sm text-accent hover:underline">View analytics</Link>
        </div>
        <div className="grid gap-3">
          {MOCK_STUDENT_RESULTS.map((r) => (
            <Card key={r.examId} className="flex items-center gap-4 p-4 shadow-card">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{r.examTitle}</p>
                <p className="text-sm text-muted-foreground">{r.subject}</p>
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
    </div>
  );
};

export default StudentDashboard;
