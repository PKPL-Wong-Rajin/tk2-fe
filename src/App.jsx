import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

import Navbar from './components/Navbar';
import Biodata from './pages/Biodata';
import { groupMembers } from './data/members';

const GOOGLE_CLIENT_ID = "CLIENT_ID_KAMU_DI_SINI.apps.googleusercontent.com";
const ALLOWED_EMAILS = ['email.kamu@gmail.com', 'email.teman@ui.ac.id'];

export default function App() {
  const [user, setUser] = useState(null);
  // FONT DIHAPUS DARI STATE AGAR FONT INTER DARI INDEX.HTML BISA BEKERJA
  const [theme, setTheme] = useState({
    bgColor: '#f3f4f6', 
  });

  const handleLogin = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
  };

  const isAuthorized = user && ALLOWED_EMAILS.includes(user.email);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <div 
          className="min-h-screen transition-colors duration-500" 
          style={{ backgroundColor: theme.bgColor }} // HANYA BACKGROUND SAJA
        >
          <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />

          {/* Tambahkan pt-24 agar konten tidak tertabrak Navbar yang fixed */}
          <main className="w-full pt-21">
            
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
    </GoogleOAuthProvider>
  );
}