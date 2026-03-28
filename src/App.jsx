import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Biodata from './pages/Biodata';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function App() {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageBgColor, setPageBgColor] = useState('#f3f4f6');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, biodataRes] = await Promise.all([
          fetch(`${API_URL}/auth/me`, { credentials: 'include' }),
          fetch(`${API_URL}/biodata`, { credentials: 'include' }),
        ]);

        if (meRes.ok) {
          const userData = await meRes.json();
          setUser(userData);
        }

        if (biodataRes.ok) {
          const biodataData = await biodataRes.json();
          setMembers(biodataData);
        }
      } catch {

      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {

    }
    setUser(null);
  };

  const handleBiodataUpdate = (updatedMember) => {
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Router>
      <div 
        className="min-h-screen transition-colors duration-500" 
        style={{ backgroundColor: pageBgColor }}
      >
        <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} members={members} />

        <main className="w-full pt-24">
          <Routes>
            <Route path="/" element={
              members.length > 0 
                ? <Navigate to={`/member/${members[0].id}`} replace /> 
                : <div className="text-center text-gray-500 mt-20">Loading members...</div>
            } />
            <Route path="/member/:id" element={
              <Biodata 
                members={members} 
                user={user} 
                onBiodataUpdate={handleBiodataUpdate}
                onBgColorChange={setPageBgColor}
              />
            } />
          </Routes>
        </main>

      </div>
    </Router>
  );
}