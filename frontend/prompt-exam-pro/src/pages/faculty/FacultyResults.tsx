import { MOCK_EXAMS } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const FacultyResults = () => {
  const closedOrActive = MOCK_EXAMS.filter((e) => e.status !== "draft");

  const chartData = closedOrActive.map((e) => ({
    name: e.title.length > 20 ? e.title.slice(0, 20) + "…" : e.title,
    attempts: e.attempts,
    avgScore: Math.round(e.totalMarks * 0.7),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Results Overview</h1>
        <p className="text-muted-foreground">Aggregated performance data across all exams.</p>
      </div>

      {/* Chart */}
      <Card className="p-6 shadow-card">
        <h3 className="font-semibold mb-4">Exam Participation</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Bar dataKey="attempts" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Per-exam summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        {closedOrActive.map((exam) => (
          <Card key={exam.id} className="p-5 shadow-card">
            <h4 className="font-semibold mb-1">{exam.title}</h4>
            <p className="text-sm text-muted-foreground mb-3">{exam.subject}</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xl font-bold">{exam.attempts}</p>
                <p className="text-xs text-muted-foreground">Attempts</p>
              </div>
              <div>
                <p className="text-xl font-bold">{Math.round(exam.totalMarks * 0.72)}</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
              <div>
                <p className="text-xl font-bold text-success">{Math.round(exam.totalMarks * 0.92)}</p>
                <p className="text-xs text-muted-foreground">Top Score</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FacultyResults;
