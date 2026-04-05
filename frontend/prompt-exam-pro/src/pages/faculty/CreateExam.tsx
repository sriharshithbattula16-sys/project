import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GENERATED_QUESTIONS, Question } from "@/data/mockData";
import { Cloud, Loader2, Trash2, Plus, CheckCircle2, Sparkles, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateExam = () => {
  const { toast } = useToast();
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [examTitle, setExamTitle] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [duration, setDuration] = useState(60);
  const [randomize, setRandomize] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (["application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
        setSyllabusFile(file);
        toast({ title: "File uploaded", description: `${file.name} has been uploaded.` });
      } else {
        toast({ title: "Invalid file", description: "Please upload PDF, TXT, or DOC files only.", variant: "destructive" });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      setSyllabusFile(files[0]);
      toast({ title: "File uploaded", description: `${files[0].name} has been uploaded.` });
    }
  };

  const handleGenerateFromSyllabus = async () => {
    if (!syllabusFile) {
      toast({ title: "Error", description: "Please upload a syllabus file first.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setQuestions(GENERATED_QUESTIONS);
      toast({ title: "Success", description: "Questions generated from syllabus." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate questions.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: "New Question",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option A",
      marks: 1,
      type: "mcq"
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handlePublish = () => {
    if (!examTitle.trim()) {
      toast({ title: "Error", description: "Please enter an exam title.", variant: "destructive" });
      return;
    }
    if (!branch) {
      toast({ title: "Error", description: "Please select a branch.", variant: "destructive" });
      return;
    }
    if (!year) {
      toast({ title: "Error", description: "Please select a year.", variant: "destructive" });
      return;
    }
    if (questions.length === 0) {
      toast({ title: "Error", description: "Please add at least one question.", variant: "destructive" });
      return;
    }
    setPublished(true);
    toast({ title: "Success", description: `Exam "${examTitle}" has been published.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Create New Exam</h1>
        <p className="text-muted-foreground">Upload your syllabus and create questions for an exam.</p>
      </div>

      {/* Exam Details Form */}
      <Card className="p-6 shadow-card">
        <h3 className="font-semibold mb-4">Exam Details</h3>
        <div className="grid gap-4">
          <div>
            <Label>Exam Title *</Label>
            <Input 
              placeholder="e.g. Mid Semester Examination - Operating Systems" 
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Branch *</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cse">Computer Science</SelectItem>
                  <SelectItem value="ece">Electronics & Communication</SelectItem>
                  <SelectItem value="civil">Civil Engineering</SelectItem>
                  <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Year *</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Duration (minutes) *</Label>
              <Input 
                type="number" 
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={5}
                max={300}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={randomize}
                  onChange={(e) => setRandomize(e.target.checked)}
                  className="w-4 h-4 border-gray-300 rounded"
                />
                <span className="text-sm">Randomize Questions</span>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Upload Syllabus */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Download size={20} />
          <h3 className="font-semibold">Upload Syllabus</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Upload your syllabus as PDF or text file. AI will generate questions based on the content.</p>

        {!syllabusFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById("file-input")?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/50"
            }`}
          >
            <Cloud className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium mb-2">Drag & drop your syllabus here</p>
            <p className="text-sm text-muted-foreground">or browse files</p>
            <p className="text-xs text-muted-foreground mt-2">Supports PDF, DOC, TXT (max 10 MB)</p>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="border border-border rounded-lg p-4 flex items-center justify-between bg-success/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="text-success" size={20} />
              </div>
              <div>
                <p className="font-medium text-sm">{syllabusFile.name}</p>
                <p className="text-xs text-muted-foreground">{(syllabusFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSyllabusFile(null)}
              className="text-destructive hover:text-destructive"
            >
              Remove
            </Button>
          </div>
        )}

        <Button 
          onClick={handleGenerateFromSyllabus}
          disabled={!syllabusFile || loading}
          className="w-full mt-4 gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Generating Questions...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Questions from Syllabus
            </>
          )}
        </Button>
      </Card>

      {/* Exam Preview */}
      {(questions.length > 0 || examTitle || branch || year) && (
        <Card className="p-6 shadow-card bg-muted/30">
          <h3 className="font-semibold mb-4">Exam Preview</h3>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
              ⚠ DRAFT
            </Badge>
            {branch && <Badge variant="outline">{branch}</Badge>}
            {year && <Badge variant="outline">{year}</Badge>}
            {questions.length > 0 && <Badge variant="outline">📝 {questions.length} Questions</Badge>}
            {duration && <Badge variant="outline">⏱ {duration} mins</Badge>}
          </div>
        </Card>
      )}

      {/* Questions Section */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Questions ({questions.length})</h2>
            <Button variant="outline" size="sm" onClick={handleAddQuestion} className="gap-2">
              <Plus size={14} /> Add Question
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
                            opt === q.correctAnswer
                              ? "border-success/40 bg-success/5 text-success"
                              : "border-border"
                          }`}
                        >
                          {String.fromCharCode(65 + j)}. {opt}
                        </div>
                      ))}
                    </div>
                  )}
                  <Badge variant="outline" className="text-xs">{q.marks} marks</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteQuestion(q.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Publish Button */}
      {questions.length > 0 && !published && (
        <div className="flex gap-3">
          <Button onClick={handlePublish} className="flex-1">
            Publish Exam
          </Button>
          <Button variant="outline" onClick={() => setQuestions([])}>Clear Questions</Button>
        </div>
      )}

      {/* Published State */}
      {published && (
        <Card className="p-6 shadow-card bg-success/5 border-success/20 flex items-center gap-3">
          <CheckCircle2 className="text-success" size={24} />
          <div>
            <p className="font-semibold text-success">Exam Published Successfully!</p>
            <p className="text-sm text-muted-foreground">Students can now access "{examTitle}".</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CreateExam;
