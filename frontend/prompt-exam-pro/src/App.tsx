import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import GenerateQuestions from "./pages/faculty/GenerateQuestions";
import ExamManagement from "./pages/faculty/ExamManagement";
import FacultyResults from "./pages/faculty/FacultyResults";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentExams from "./pages/student/StudentExams";
import ExamAttempt from "./pages/student/ExamAttempt";
import StudentAnalytics from "./pages/student/StudentAnalytics";

const queryClient = new QueryClient();

const FacultyLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRole="faculty">
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

const StudentLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRole="student">
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

const App = () => (

  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Faculty Routes */}
            <Route path="/faculty" element={<FacultyLayout><FacultyDashboard /></FacultyLayout>} />
            <Route path="/faculty/generate" element={<FacultyLayout><GenerateQuestions /></FacultyLayout>} />
            <Route path="/faculty/exams" element={<FacultyLayout><ExamManagement /></FacultyLayout>} />
            <Route path="/faculty/results" element={<FacultyLayout><FacultyResults /></FacultyLayout>} />

            {/* Student Routes */}
            <Route path="/student" element={<StudentLayout><StudentDashboard /></StudentLayout>} />
            <Route path="/student/exams" element={<StudentLayout><StudentExams /></StudentLayout>} />
            <Route path="/student/exam/:examId" element={<StudentLayout><ExamAttempt /></StudentLayout>} />
            <Route path="/student/analytics" element={<StudentLayout><StudentAnalytics /></StudentLayout>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
