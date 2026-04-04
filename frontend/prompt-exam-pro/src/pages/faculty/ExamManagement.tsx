import { MOCK_EXAMS } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { XCircle, Clock, FileText } from "lucide-react";

const statusColor = (s: string) => {
  if (s === "active") return "bg-success/10 text-success border-success/20";
  if (s === "draft") return "bg-warning/10 text-warning border-warning/20";
  return "bg-muted text-muted-foreground border-border";
};

const ExamManagement = () => {
  const { toast } = useToast();

  const handleClose = (title: string) => {
    toast({ title: "Exam Closed", description: `"${title}" has been closed.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Manage Exams</h1>
        <p className="text-muted-foreground">View and manage all your created examinations.</p>
      </div>

      <div className="grid gap-4">
        {MOCK_EXAMS.map((exam) => (
          <Card key={exam.id} className="p-5 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold truncate">{exam.title}</p>
                  <Badge variant="outline" className={statusColor(exam.status)}>{exam.status}</Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span>{exam.subject}</span>
                  <span className="capitalize">{exam.type === "mcq" ? "MCQ" : "Descriptive"}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {exam.duration} min</span>
                  <span>{exam.questionCount} questions · {exam.totalMarks} marks</span>
                  <span>{exam.attempts} attempts</span>
                </div>
              </div>
              {exam.status === "active" && (
                <Button variant="outline" size="sm" className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => handleClose(exam.title)}>
                  <XCircle size={14} /> Close
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExamManagement;
