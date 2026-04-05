import { motion } from 'framer-motion';
import SyllabusUpload from '@/components/SyllabusUpload';

const UploadSyllabus = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Upload Syllabus</h1>
        <p className="text-muted-foreground mt-1">Upload and manage syllabus PDF files for exam generation</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border p-6"
      >
        <SyllabusUpload />
      </motion.div>
    </div>
  );
};

export default UploadSyllabus;
