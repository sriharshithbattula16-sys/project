import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import FacultyDashboard from "@/pages/faculty/FacultyDashboard";
import GenerateExam from "@/pages/faculty/GenerateExam";
import FacultyResults from "@/pages/faculty/FacultyResults";
import UploadSyllabus from "@/pages/faculty/UploadSyllabus";
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentExams from "@/pages/student/StudentExams";
import AttemptExam from "@/pages/student/AttemptExam";
import StudentResults from "@/pages/student/StudentResults";
import PreviousPapers from "@/pages/student/PreviousPapers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Faculty routes — Delete route removed */}
              <Route path="/faculty" element={<ProtectedRoute allowedRole="faculty"><AppLayout /></ProtectedRoute>}>
                <Route index element={<FacultyDashboard />} />
                <Route path="generate" element={<GenerateExam />} />
                <Route path="upload-syllabus" element={<UploadSyllabus />} />
                <Route path="results" element={<FacultyResults />} />
              </Route>

              {/* Student routes — Previous Papers added */}
              <Route path="/student" element={<ProtectedRoute allowedRole="student"><AppLayout /></ProtectedRoute>}>
                <Route index element={<StudentDashboard />} />
                <Route path="exams" element={<StudentExams />} />
                <Route path="exam/:examId" element={<AttemptExam />} />
                <Route path="results" element={<StudentResults />} />
                <Route path="previous-papers" element={<PreviousPapers />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
