import { MOCK_STUDENT_RESULTS } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["hsl(152,60%,40%)", "hsl(0,72%,51%)", "hsl(215,15%,47%)"];

const StudentAnalytics = () => {
  const evaluated = MOCK_STUDENT_RESULTS.filter((r) => r.status === "evaluated");

  const overallCorrect = evaluated.reduce((s, r) => s + r.correct, 0);
  const overallIncorrect = evaluated.reduce((s, r) => s + r.incorrect, 0);
  const overallSkipped = evaluated.reduce((s, r) => s + r.skipped, 0);

  const pieData = [
    { name: "Correct", value: overallCorrect },
    { name: "Incorrect", value: overallIncorrect },
    { name: "Skipped", value: overallSkipped },
  ];

  const barData = evaluated.map((r) => ({
    name: r.examTitle.length > 15 ? r.examTitle.slice(0, 15) + "…" : r.examTitle,
    scored: r.scoredMarks,
    total: r.totalMarks,
  }));

  const totalScored = evaluated.reduce((s, r) => s + r.scoredMarks, 0);
  const totalMax = evaluated.reduce((s, r) => s + r.totalMarks, 0);
  const overallPct = totalMax ? Math.round((totalScored / totalMax) * 100) : 0;

  // Question-wise breakdown from first exam that has it
  const detailed = MOCK_STUDENT_RESULTS.find((r) => r.questionResults && r.status === "evaluated");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Performance Analytics</h1>
        <p className="text-muted-foreground">Detailed breakdown of your exam performance.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Overall Score", value: `${overallPct}%` },
          { label: "Exams Taken", value: evaluated.length },
          { label: "Total Correct", value: overallCorrect },
          { label: "Accuracy", value: `${overallCorrect + overallIncorrect ? Math.round((overallCorrect / (overallCorrect + overallIncorrect)) * 100) : 0}%` },
        ].map((s) => (
          <Card key={s.label} className="p-4 shadow-card text-center">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-4">Score per Exam</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Bar dataKey="scored" name="Scored" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" name="Total" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-4">Answer Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Question-wise Breakdown */}
      {detailed?.questionResults && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Question Breakdown — {detailed.examTitle}</h2>
          <div className="grid gap-3">
            {detailed.questionResults.map((qr, i) => (
              <Card key={qr.questionId} className="p-4 shadow-card">
                <div className="flex items-start gap-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    qr.scored === qr.marks ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{qr.questionText}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                      <span>Your answer: <span className="text-foreground">{qr.yourAnswer}</span></span>
                      {qr.correctAnswer && <span>Correct: <span className="text-success">{qr.correctAnswer}</span></span>}
                    </div>
                  </div>
                  <Badge variant="outline" className={qr.scored === qr.marks ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}>
                    {qr.scored}/{qr.marks}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pending Exams */}
      {MOCK_STUDENT_RESULTS.some((r) => r.status === "pending") && (
        <Card className="p-5 shadow-card bg-warning/5 border-warning/20">
          <h3 className="font-semibold text-warning mb-2">Pending Evaluations</h3>
          {MOCK_STUDENT_RESULTS.filter((r) => r.status === "pending").map((r) => (
            <p key={r.examId} className="text-sm text-muted-foreground">{r.examTitle} — Awaiting AI evaluation</p>
          ))}
        </Card>
      )}
    </div>
  );
};

export default StudentAnalytics;
