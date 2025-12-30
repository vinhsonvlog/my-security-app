import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import UrlChecker from './pages/UrlChecker'
import CyberQuiz from './pages/CyberQuiz'
import Community from './pages/Community'
import { StyledEngineProvider } from '@mui/material/styles'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import Projects from './pages/Projects'
import Volunteer from './pages/Volunteer'
import RequestForm from './pages/RequestForm'
import Tracking from './pages/Tracking'
import Donation from './pages/Donation'
import Dashboard from './pages/Dashboard'
import VolunteerManagement from './pages/VolunteerManagement'
import PostDetail from './pages/PostDetail'
import ReportManagement from './pages/ReportManagement'
import EventManagement from './pages/EventManagement'
import EventDetail from './pages/EventDetail'
import CommunityManagement from './pages/CommunityManagement'
import Statistics from './pages/Statistics'
import Newsfeed from './pages/Newsfeed'
import BlacklistManagement from './pages/BlacklistManagement'
import NewsfeedManagement from './pages/NewsfeedManagement'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<UrlChecker />} />
        <Route path="/quiz" element={<CyberQuiz />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/:id" element={<PostDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<EventDetail />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/request" element={<RequestForm />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/volunteers" element={<VolunteerManagement />} />
        <Route path="/admin/reports" element={<ReportManagement />} />
        <Route path="/admin/events" element={<EventManagement />} />
        <Route path="/admin/community" element={<CommunityManagement />} />
        <Route path="/admin/blacklist" element={<BlacklistManagement />} />
        <Route path="/admin/statistics" element={<Statistics />} />
        <Route path="/admin/newsfeed" element={<NewsfeedManagement />} />
        <Route path="/newsfeed" element={<Newsfeed />} />
        <Route path="/report" element={<RequestForm />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{ position: 'relative' }}>
          <Navbar />

          <main className="grow" style={{ position: 'relative', zIndex: 1 }}>
            <AnimatedRoutes />
          </main>

          <Footer />
        </div>
      </Router>
    </StyledEngineProvider>
  )
}

export default App
