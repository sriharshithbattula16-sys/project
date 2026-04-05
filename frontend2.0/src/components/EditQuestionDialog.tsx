import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Question } from '@/lib/mockData';

interface EditQuestionDialogProps {
  question: Question | null;
  open: boolean;
  onClose: () => void;
  onSave: (updated: Question) => void;
}

const EditQuestionDialog = ({ question, open, onClose, onSave }: EditQuestionDialogProps) => {
  const [text, setText] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [marks, setMarks] = useState(2);

  useEffect(() => {
    if (question) {
      setText(question.text);
      setOptions(question.options || []);
      setCorrectAnswer(question.correctAnswer || '');
      setMarks(question.marks);
    }
  }, [question]);

  if (!question) return null;

  const handleSave = () => {
    onSave({
      ...question,
      text,
      options: options.length > 0 ? options : undefined,
      correctAnswer: correctAnswer || undefined,
      marks,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-foreground">Question Text</Label>
            <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className="mt-1" />
          </div>
          <div>
            <Label className="text-foreground">Marks</Label>
            <Input type="number" value={marks} onChange={(e) => setMarks(Number(e.target.value))} className="mt-1 w-24" />
          </div>
          {question.type === 'mcq' && (
            <>
              {options.map((opt, i) => (
                <div key={i}>
                  <Label className="text-foreground">Option {String.fromCharCode(65 + i)}</Label>
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const next = [...options];
                      next[i] = e.target.value;
                      setOptions(next);
                    }}
                    className="mt-1"
                  />
                </div>
              ))}
              <div>
                <Label className="text-foreground">Correct Answer</Label>
                <select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-md border bg-background text-foreground text-sm"
                >
                  {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuestionDialog;
