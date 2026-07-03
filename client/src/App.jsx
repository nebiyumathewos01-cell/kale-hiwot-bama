import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Songs from './pages/Songs'
import SongDetail from './pages/SongDetail'
import Messages from './pages/Messages'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ManageSongs from './pages/admin/ManageSongs'
import ManageMessages from './pages/admin/ManageMessages'
import ManageMedia from './pages/admin/ManageMedia'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"          element={<Home />} />
        <Route path="/songs"     element={<Songs />} />
        <Route path="/songs/:id" element={<SongDetail />} />
        <Route path="/messages"  element={<Messages />} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Protected */}
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/songs"    element={<ProtectedRoute><ManageSongs /></ProtectedRoute>} />
        <Route path="/admin/messages" element={<ProtectedRoute><ManageMessages /></ProtectedRoute>} />
        <Route path="/admin/media"    element={<ProtectedRoute><ManageMedia /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}
