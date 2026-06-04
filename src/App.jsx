import { Routes, Route } from 'react-router-dom'
import RootLayout from '@/layouts/RootLayout'
import AuthLayout from '@/layouts/AuthLayout'
import HomePage from '@/pages/HomePage'
import ProjectsPage from '@/pages/ProjectsPage'
import ProjectDetailPage from '@/pages/ProjectDetailPage'
import ExplorePage from '@/pages/ExplorePage'
import CommunityPage from '@/pages/CommunityPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import NotFoundPage from '@/pages/NotFoundPage'
import ProtectedRoute from '@/features/auth/ProtectedRoute'
import ProjectWizard from '@/features/projects/ProjectWizard'
import EditProjectPage from '@/pages/EditProjectPage'
import AboutPage from '@/pages/AboutPage'
import ContactPage from '@/pages/ContactPage'
import SettingsPage from '@/pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route path="/" element={<RootLayout />}>
        {/* Public */}
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />

        {/* Protected */}
        <Route path="explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
        <Route path="community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
        <Route path="projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
        <Route path="projects/create" element={<ProtectedRoute><ProjectWizard /></ProtectedRoute>} />
        <Route path="projects/:slug/edit" element={<ProtectedRoute><EditProjectPage /></ProtectedRoute>} />
        <Route path="projects/:slug" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
        <Route path="profile" element={
          <ProtectedRoute>
            <div className="min-h-screen pt-32 flex items-center justify-center text-gray-400 font-body">
              Profile page — Phase 3
            </div>
          </ProtectedRoute>
        }/>
        <Route path="settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }/>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}