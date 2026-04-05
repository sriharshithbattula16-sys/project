import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Send, Trash2, Edit3, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { mockQuestions, Question } from '@/lib/mockData';
import { toast } from 'sonner';
import EditQuestionDialog from '@/components/EditQuestionDialog';

const GenerateExam = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<Question[] | null>(null);
  const [examTitle, setExamTitle] = useState('');
  const [duration, setDuration] = useState('30');
  const [startTime, setStartTime] = useState('09:00');
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2500));
    setGenerated(mockQuestions);
    setExamTitle('Photosynthesis - Chapter 3');
    setLoading(false);
    toast.success('Questions generated successfully!');
  };

  const handleDelete = (id: string) => {
    setGenerated((prev) => prev?.filter((q) => q.id !== id) || null);
    toast.success('Question removed');
  };

  const handleSaveEdit = (updated: Question) => {
    setGenerated((prev) => prev?.map((q) => (q.id === updated.id ? updated : q)) || null);
    toast.success('Question updated');
  };

  const handlePublish = () => {
    toast.success('Exam published! Students can now access this exam.');
    setGenerated(null);
    setPrompt('');
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Generate Exam</h1>
        <p className="text-muted-foreground mt-1">Describe the exam you want and let AI create it for you</p>
      </div>

      {/* Prompt Interface — No MCQ/Descriptive toggle, no Common Settings */}
      <div className="bg-card rounded-xl border p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-foreground text-sm">Duration (minutes)</Label>
            <Input value={duration} onChange={(e) => setDuration(e.target.value)} type="number" className="mt-1" />
          </div>
          <div>
            <Label className="text-foreground text-sm">Exam Start Time</Label>
            <Input value={startTime} onChange={(e) => setStartTime(e.target.value)} type="time" className="mt-1" />
          </div>
        </div>

        <div className="relative">
          <Textarea
            placeholder='e.g. "Generate 10 multiple choice questions and 5 descriptive questions from Chapter 3 on Photosynthesis, medium difficulty"'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="resize-none pr-14 text-base"
          />
          <Button
            size="icon"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-card rounded-xl border p-8 flex flex-col items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-accent animate-pulse" />
            </div>
            <p className="text-foreground font-medium">Generating questions...</p>
            <p className="text-sm text-muted-foreground">AI is processing your prompt</p>
            <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden mt-2">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-info rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: 'linear' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Questions */}
      <AnimatePresence>
        {generated && !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Generated Questions</h2>
                <p className="text-sm text-muted-foreground">{generated.length} questions ready for review</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleGenerate} className="gap-2 hover:bg-accent/10 hover:text-accent hover:border-accent/30">
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                </Button>
                <Button size="sm" onClick={handlePublish} className="gap-2 bg-gradient-to-r from-accent to-info text-accent-foreground hover:opacity-90">
                  <CheckCircle className="w-3.5 h-3.5" /> Publish Exam
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {generated.map((q, i) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl border p-5 hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent/20 to-info/20 flex items-center justify-center text-xs font-semibold text-accent">
                          {i + 1}
                        </span>
                        <span className="text-xs text-muted-foreground">{q.marks} marks</span>
                      </div>
                      <p className="text-foreground font-medium">{q.text}</p>
                      {q.options && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, oi) => (
                            <div
                              key={oi}
                              className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                                opt === q.correctAnswer
                                  ? 'bg-success/10 border-success/30 text-success'
                                  : 'bg-muted/30 text-muted-foreground'
                              }`}
                            >
                              <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-accent hover:bg-accent/10" onClick={() => setEditQuestion(q)}>
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(q.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <EditQuestionDialog
        question={editQuestion}
        open={!!editQuestion}
        onClose={() => setEditQuestion(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default GenerateExam;
