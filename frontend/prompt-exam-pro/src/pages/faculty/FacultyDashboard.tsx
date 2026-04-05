import { MOCK_EXAMS } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Users, Clock, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const statusColor = (s: string) => {
  if (s === "active") return "bg-success/10 text-success border-success/20";
  if (s === "draft") return "bg-warning/10 text-warning border-warning/20";
  return "bg-muted text-muted-foreground border-border";
};

const FacultyDashboard = () => {
  const { user } = useAuth();
  const totalExams = MOCK_EXAMS.length;
  const activeExams = MOCK_EXAMS.filter((e) => e.status === "active").length;
  const totalAttempts = MOCK_EXAMS.reduce((s, e) => s + e.attempts, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="text-muted-foreground">Here's an overview of your examination activity.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Exams", value: totalExams, icon: <FileText size={18} />, color: "text-faculty" },
          { label: "Active Exams", value: activeExams, icon: <Clock size={18} />, color: "text-success" },
          { label: "Total Attempts", value: totalAttempts, icon: <Users size={18} />, color: "text-accent" },
        ].map((s) => (
          <Card key={s.label} className="p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <span className={`${s.color}`}>{s.icon}</span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Quick Action */}
      <Card className="p-6 shadow-card border-accent/20 bg-accent/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Sparkles size={22} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Create New Exam</h3>
            <p className="text-sm text-muted-foreground">Upload syllabus and generate questions with AI, or add questions manually.</p>
          </div>
          <Link to="/faculty/create-exam">
            <Button className="gap-2">
              Get Started <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Recent Exams */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Exams</h2>
          <Link to="/faculty/exams" className="text-sm text-accent hover:underline">View all</Link>
        </div>
        <div className="grid gap-3">
          {MOCK_EXAMS.slice(0, 3).map((exam) => (
            <Card key={exam.id} className="flex items-center gap-4 p-4 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{exam.title}</p>
                <p className="text-sm text-muted-foreground">{exam.subject} · {exam.questionCount} questions · {exam.duration} min</p>
              </div>
              <Badge variant="outline" className={statusColor(exam.status)}>{exam.status}</Badge>
              <span className="text-sm text-muted-foreground">{exam.attempts} attempts</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
