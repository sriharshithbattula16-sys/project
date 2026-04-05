import { motion } from 'framer-motion';
import { FileText, Clock } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { mockExams } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-success/10 text-success',
  closed: 'bg-destructive/10 text-destructive',
};

const FacultyDashboard = () => {
  const { user } = useAuth();
  const activeExams = mockExams.filter((e) => e.status === 'active').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your examination activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard title="Total Exams" value={mockExams.length} icon={FileText} color="accent" />
        <StatCard title="Active Exams" value={activeExams} icon={Clock} color="success" />
      </div>

      {/* Recent Exams Table — Avg column removed */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Exams</h2>
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Subject</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockExams.map((exam, i) => (
                  <motion.tr
                    key={exam.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4 font-medium text-card-foreground">{exam.title}</td>
                    <td className="p-4 text-muted-foreground">{exam.subject}</td>
                    <td className="p-4">
                      <Badge variant="secondary" className={statusColors[exam.status]}>{exam.status}</Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
