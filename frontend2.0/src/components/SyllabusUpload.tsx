import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface UploadedFile {
  name: string;
  subject: string;
  size: number;
  uploadedAt: string;
  progress: number;
}

const SyllabusUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([
    { name: 'Biology_Syllabus_2026.pdf', subject: 'Biology', size: 2450000, uploadedAt: '2026-01-10', progress: 100 },
    { name: 'Chemistry_Organic_Notes.pdf', subject: 'Chemistry', size: 1820000, uploadedAt: '2026-01-15', progress: 100 },
    { name: 'Physics_Mechanics.pdf', subject: 'Physics', size: 3100000, uploadedAt: '2026-02-01', progress: 100 },
  ]);
  const [isDragging, setIsDragging] = useState(false);

  const simulateUpload = (file: UploadedFile) => {
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.name === file.name && f.progress < 100) {
            const newProgress = Math.min(f.progress + Math.random() * 30, 100);
            if (newProgress >= 100) {
              clearInterval(interval);
              toast.success(`${file.name} uploaded successfully`);
            }
            return { ...f, progress: newProgress };
          }
          return f;
        })
      );
    }, 300);
  };

  const handleFiles = useCallback((fileList: FileList) => {
    const newFiles = Array.from(fileList).map((f) => ({
      name: f.name,
      subject: 'General',
      size: f.size,
      uploadedAt: new Date().toLocaleDateString(),
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach(simulateUpload);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
    toast.success('File removed');
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          isDragging ? 'border-accent bg-accent/5 scale-[1.02]' : 'border-border hover:border-muted-foreground/40 hover:bg-muted/30'
        }`}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.pdf';
          input.multiple = true;
          input.onchange = (e) => {
            const f = (e.target as HTMLInputElement).files;
            if (f) handleFiles(f);
          };
          input.click();
        }}
      >
        <motion.div
          animate={{ scale: isDragging ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-accent' : 'text-muted-foreground'}`} />
        </motion.div>
        <p className="text-sm font-medium text-foreground">
          {isDragging ? 'Drop PDF files here' : 'Drag & drop syllabus PDFs or click to browse'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">PDF files only</p>
      </div>

      <AnimatePresence>
        {files.map((file) => (
          <motion.div
            key={file.name}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 bg-muted/30 rounded-lg px-4 py-3 border hover:bg-muted/50 transition-colors"
          >
            <FileText className="w-5 h-5 text-accent shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{file.subject} · {formatSize(file.size)} · {file.uploadedAt}</p>
              {file.progress < 100 && (
                <Progress value={file.progress} className="h-1.5 mt-1" />
              )}
            </div>
            {file.progress >= 100 && <CheckCircle className="w-4 h-4 text-success shrink-0" />}
            <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); removeFile(file.name); }}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SyllabusUpload;
