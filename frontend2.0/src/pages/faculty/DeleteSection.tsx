import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Search, FileText, BookOpen, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockExams, mockSyllabusFiles, mockStudentPerformances } from '@/lib/mockData';
import { toast } from 'sonner';

const DeleteSection = () => {
  const [exams, setExams] = useState(mockExams);
  const [syllabusFiles, setSyllabusFiles] = useState(mockSyllabusFiles);
  const [students] = useState(() => {
    const unique = new Map<string, { id: string; name: string; email: string }>();
    mockStudentPerformances.forEach((s) => unique.set(s.studentId, { id: s.studentId, name: s.studentName, email: s.email }));
    return Array.from(unique.values());
  });
  const [studentRecords, setStudentRecords] = useState(students);

  const [examSearch, setExamSearch] = useState('');
  const [syllabusSearch, setSyllabusSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteExam = async (id: string) => {
    setDeletingId(id);
    await new Promise((r) => setTimeout(r, 500));
    setExams((prev) => prev.filter((e) => e.id !== id));
    setDeletingId(null);
    toast.success('Exam deleted successfully');
  };

  const handleDeleteSyllabus = async (id: string) => {
    setDeletingId(id);
    await new Promise((r) => setTimeout(r, 500));
    setSyllabusFiles((prev) => prev.filter((f) => f.id !== id));
    setDeletingId(null);
    toast.success('Syllabus file deleted successfully');
  };

  const handleDeleteStudent = async (id: string) => {
    setDeletingId(id);
    await new Promise((r) => setTimeout(r, 500));
    setStudentRecords((prev) => prev.filter((s) => s.id !== id));
    setDeletingId(null);
    toast.success('Student record deleted successfully');
  };

  const filteredExams = exams.filter((e) => e.title.toLowerCase().includes(examSearch.toLowerCase()));
  const filteredSyllabus = syllabusFiles.filter((f) => f.name.toLowerCase().includes(syllabusSearch.toLowerCase()));
  const filteredStudents = studentRecords.filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Delete</h1>
        <p className="text-muted-foreground mt-1">Remove exams, syllabus files, and student records</p>
      </div>

      <div className="space-y-8">
        {/* Delete Exams */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-card-foreground">Delete Exams</h2>
          </div>
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search exams..."
              value={examSearch}
              onChange={(e) => setExamSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <AnimatePresence>
            <div className="space-y-2">
              {filteredExams.map((exam) => (
                <motion.div
                  key={exam.id}
                  layout
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{exam.title}</p>
                    <p className="text-xs text-muted-foreground">{exam.subject} · {exam.type.toUpperCase()} · {exam.createdAt}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteExam(exam.id)}
                    disabled={deletingId === exam.id}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    {deletingId === exam.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </motion.div>
              ))}
              {filteredExams.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No exams found</p>
              )}
            </div>
          </AnimatePresence>
        </motion.div>

        {/* Delete Syllabus PDFs */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-card-foreground">Delete Syllabus PDFs</h2>
          </div>
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search syllabus files..."
              value={syllabusSearch}
              onChange={(e) => setSyllabusSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <AnimatePresence>
            <div className="space-y-2">
              {filteredSyllabus.map((file) => (
                <motion.div
                  key={file.id}
                  layout
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.subject} · {formatSize(file.size)} · {file.uploadedAt}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSyllabus(file.id)}
                    disabled={deletingId === file.id}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    {deletingId === file.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </motion.div>
              ))}
              {filteredSyllabus.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No syllabus files found</p>
              )}
            </div>
          </AnimatePresence>
        </motion.div>

        {/* Delete Student Records */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-card-foreground">Delete Student Records</h2>
          </div>
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <AnimatePresence>
            <div className="space-y-2">
              {filteredStudents.map((student) => (
                <motion.div
                  key={student.id}
                  layout
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-semibold text-accent">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteStudent(student.id)}
                    disabled={deletingId === student.id}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    {deletingId === student.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </motion.div>
              ))}
              {filteredStudents.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No students found</p>
              )}
            </div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default DeleteSection;
