import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { FeedPage } from './pages/Feed/FeedPage'
import { UserProfilePage } from './pages/UserProfile/UserProfilePage'
import { AnalyticsDashboard } from './pages/AnalyticsDashboard/AnalyticsDashboard'
import { Leaderboard } from './pages/Leaderboard/Leaderboard'
import { Messages } from './pages/Messages/Messages'
import { ModerationDashboard } from './pages/ModerationDashboard/ModerationDashboard'
import { TipHistory } from './pages/TipHistory/TipHistory'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/profile/:username" element={<UserProfilePage />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/moderation" element={<ModerationDashboard />} />
          <Route path="/tips" element={<TipHistory />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
