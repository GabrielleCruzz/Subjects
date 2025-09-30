import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SubjectDetail from './pages/SubjectDetail'
import Quiz from './pages/Quiz'
import Ranking from './pages/Ranking'
import Community from './pages/Community'
import Profile from './pages/Profile'
import Videos from './pages/Videos'
import VideoDetail from './pages/VideoDetail'
import UploadVideo from './pages/UploadVideo'
import { ProtectedRoute } from './components/ProtectedRoute'
import Games from './pages/Games'
import Hangman from './pages/Hangman'
import SourceCode from './pages/SourceCode'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminContent from './pages/admin/AdminContent'
import AdminRanking from './pages/admin/AdminRanking'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Quizzes from './pages/Quizzes'
import Tasks from './pages/Tasks'

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/source-code" element={<SourceCode />} />

              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={['student', 'teacher', 'admin']}
                  />
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/subjects/:subjectId"
                  element={<SubjectDetail />}
                />
                <Route path="/quiz/:quizId" element={<Quiz />} />
                <Route path="/quizzes" element={<Quizzes />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/community" element={<Community />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/videos/:videoId" element={<VideoDetail />} />
                <Route path="/games" element={<Games />} />
                <Route path="/games/hangman" element={<Hangman />} />
              </Route>

              <Route
                element={<ProtectedRoute allowedRoles={['teacher', 'admin']} />}
              >
                <Route path="/upload-video" element={<UploadVideo />} />
              </Route>
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="ranking" element={<AdminRanking />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
)

export default App
