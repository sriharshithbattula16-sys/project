import { useNavigate } from 'react-router-dom';
import { mockExams } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const StudentExams = () => {
  const navigate = useNavigate();
  const available = mockExams.filter((e) => e.status === 'active');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">My Exams</h1>
        <p className="text-muted-foreground mt-1">Browse and attempt available exams</p>
      </div>

      <div className="grid gap-4">
        {available.map((exam, i) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.01 }}
            className="bg-card rounded-xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-card-foreground">{exam.title}</h3>
                <Badge variant="secondary" className="bg-accent/10 text-accent">{exam.type.toUpperCase()}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {exam.subject} · {exam.questionCount} questions · {exam.duration} min
                {exam.startTime && ` · Starts at ${exam.startTime}`}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate(`/student/exam/${exam.id}`)}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Start Exam
            </Button>
          </motion.div>
        ))}
        {available.length === 0 && (
          <p className="text-muted-foreground text-center py-8">No exams available at the moment</p>
        )}
      </div>
    </div>
  );
};

export default StudentExams;
