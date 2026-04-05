import { motion } from 'framer-motion';

interface QuestionNavigatorProps {
  total: number;
  current: number;
  answers: Record<string, string>;
  reviewSet: Set<string>;
  questionIds: string[];
  onSelect: (index: number) => void;
}

const QuestionNavigator = ({ total, current, answers, reviewSet, questionIds, onSelect }: QuestionNavigatorProps) => {
  const getColor = (i: number) => {
    const qId = questionIds[i];
    if (i === current) return 'bg-accent text-accent-foreground ring-2 ring-accent/50';
    if (reviewSet.has(qId)) return 'bg-warning/15 text-warning border border-warning/40';
    if (answers[qId]) return 'bg-success/15 text-success border border-success/40';
    return 'bg-destructive/10 text-destructive border border-destructive/30';
  };

  return (
    <div className="bg-card rounded-xl border p-4">
      <h3 className="text-sm font-semibold text-card-foreground mb-3">Questions</h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(i)}
            className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${getColor(i)}`}
          >
            {i + 1}
          </motion.button>
        ))}
      </div>
      <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-success/15 border border-success/40" /> Answered</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-destructive/10 border border-destructive/30" /> Unanswered</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-warning/15 border border-warning/40" /> Review</div>
      </div>
    </div>
  );
};

export default QuestionNavigator;
