import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GENERATED_QUESTIONS, Question } from "@/data/mockData";
import { Sparkles, Loader2, Trash2, RefreshCw, Send, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const GenerateQuestions = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [examType, setExamType] = useState<"mcq" | "descriptive">("mcq");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examTitle, setExamTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [published, setPublished] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setPublished(false);
    
    try {
      const response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, examType })
      });
      
      const data = await response.json();
      
      if (response.ok && data.questions) {
        setQuestions(data.questions);
      } else {
        toast({ title: "Error", description: data.error || "Failed to generate questions", variant: "destructive" });
        setQuestions(GENERATED_QUESTIONS); // fallback for UI continuity
      }
    } catch (error) {
      toast({ title: "Connection Error", description: "Could not connect to the backend server. Is it running on port 5000?", variant: "destructive" });
      setQuestions(GENERATED_QUESTIONS); // fallback for UI continuity
    } finally {
      setExamTitle("AI-Generated: " + prompt.slice(0, 50));
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handlePublish = () => {
    if (!examTitle.trim()) {
      toast({ title: "Title required", description: "Please enter an exam title before publishing.", variant: "destructive" });
      return;
    }
    setPublished(true);
    toast({ title: "Exam Published!", description: "Students can now access this exam." });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Generate Questions</h1>
        <p className="text-muted-foreground">Describe the exam you want and AI will generate it for you.</p>
      </div>

      {/* Prompt Interface */}
      <Card className="p-6 shadow-card">
        <div className="space-y-4">
          {/* Type Toggle */}
          <div>
            <Label className="text-sm mb-2 block">Exam Type</Label>
            <div className="flex rounded-lg bg-muted p-1 w-fit">
              {(["mcq", "descriptive"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setExamType(t)}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-all capitalize ${
                    examType === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "mcq" ? "Multiple Choice" : "Descriptive"}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Area */}
          <div>
            <Label className="text-sm mb-2 block">Your Prompt</Label>
            <div className="relative">
              <Textarea
                placeholder='e.g. "Generate 10 multiple choice questions from Chapter 3 on Photosynthesis, medium difficulty"'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none pr-4 text-base"
              />
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Generate Questions
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="p-8 flex flex-col items-center gap-3 shadow-card">
          <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Sparkles className="animate-pulse-slow text-accent" size={24} />
          </div>
          <p className="font-medium">AI is generating your questions...</p>
          <p className="text-sm text-muted-foreground">This may take a few moments.</p>
        </Card>
      )}

      {/* Generated Questions */}
      {questions.length > 0 && !loading && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Generated Questions ({questions.length})</h2>
            <Button variant="outline" size="sm" onClick={handleGenerate} className="gap-2">
              <RefreshCw size={14} /> Regenerate
            </Button>
          </div>

          {questions.map((q, i) => (
            <Card key={q.id} className="p-4 shadow-card">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium mb-2">{q.text}</p>
                  {q.options && (
                    <div className="grid sm:grid-cols-2 gap-2 mb-2">
                      {q.options.map((opt, j) => (
                        <div
                          key={j}
                          className={`rounded-lg border px-3 py-2 text-sm ${
                            opt === q.correctAnswer ? "border-success/40 bg-success/5 text-success" : "border-border"
                          }`}
                        >
                          {String.fromCharCode(65 + j)}. {opt}
                        </div>
                      ))}
                    </div>
                  )}
                  <Badge variant="outline" className="text-xs">{q.marks} marks</Badge>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(q.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}

          {/* Publish Section */}
          {!published ? (
            <Card className="p-6 shadow-card border-accent/20">
              <h3 className="font-semibold mb-4">Publish Exam</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Exam Title</Label>
                  <Input value={examTitle} onChange={(e) => setExamTitle(e.target.value)} placeholder="Enter exam title" />
                </div>
                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} min={5} />
                </div>
              </div>
              <Button onClick={handlePublish} className="gap-2">
                <Send size={16} /> Publish Exam
              </Button>
            </Card>
          ) : (
            <Card className="p-6 shadow-card bg-success/5 border-success/20 flex items-center gap-3">
              <CheckCircle2 className="text-success" size={24} />
              <div>
                <p className="font-semibold text-success">Exam Published Successfully!</p>
                <p className="text-sm text-muted-foreground">Students can now access "{examTitle}".</p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default GenerateQuestions;
