import { Clock } from 'lucide-react';

interface ExamTimerProps {
  timeLeft: number;
}

const ExamTimer = ({ timeLeft }: ExamTimerProps) => {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isLow = timeLeft < 300;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold transition-colors ${
        isLow ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-muted text-foreground'
      }`}
    >
      <Clock className="w-4 h-4" />
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  );
};

export default ExamTimer;
