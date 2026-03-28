import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Biodata from './pages/Biodata';
import { groupMembers } from './data/members';

// Nanti kamu bisa sesuaikan email ini
const ALLOWED_EMAILS = ['email.kamu@gmail.com', 'email.teman@ui.ac.id'];

export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState({
    bgColor: '#f3f4f6', 
  });

  // Menerima data email dari dummy login di Navbar
  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const isAuthorized = user && ALLOWED_EMAILS.includes(user.email);

  return (
    <Router>
      <div 
        className="min-h-screen transition-colors duration-500" 
        style={{ backgroundColor: theme.bgColor }}
      >
        <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />

        {/* pt-24 agar konten tidak tertabrak Navbar yang fixed */}
        <main className="w-full pt-24">
          
          {isAuthorized && (
            <div className="max-w-xl mx-auto mb-8 p-4 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center justify-between relative z-40">
              <span className="font-semibold text-gray-700">🎨 Mode Edit Warna Latar</span>
              <div className="flex gap-4">
                <input 
                  type="color" value={theme.bgColor}
                  onChange={(e) => setTheme({...theme, bgColor: e.target.value})}
                  className="w-10 h-10 p-1 cursor-pointer rounded bg-white"
                />
              </div>
            </div>
          )}

          <Routes>
            <Route path="/" element={<Navigate to={`/member/${groupMembers[0].id}`} replace />} />
            <Route path="/member/:id" element={<Biodata />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}