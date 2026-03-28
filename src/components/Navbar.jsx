import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { FaEdit } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function Navbar({ user, onLogin, onLogout, members = [] }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  
  const isMemberPage = location.pathname.includes('/member/');
  const currentMember = members.find(m => location.pathname.includes(m.id)) || members[0];
  const isOwner = isMemberPage && currentMember && user?.email === currentMember.email;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  /** Handle the credential returned by Google's popup. */
  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) return;

    setLoginLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      if (res.ok) {
        const userData = await res.json();
        if (onLogin) onLogin(userData);
      } else {
        const error = await res.json();
        console.error('Login failed:', error.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    closeMobileMenu();
  };

  const triggerEditModal = () => {
    window.dispatchEvent(new Event('triggerOpenEditModal'));
    closeMobileMenu(); 
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm pointer-events-auto transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-6 py-4 lg:px-12 flex justify-between items-center w-full relative">
          
          {/* LOGO */}
          <div className="flex flex-col items-start lg:flex-1">
            <Link to="/" onClick={closeMobileMenu} className="text-2xl lg:text-3xl font-extrabold lowercase text-gray-900 tracking-tighter hover:opacity-70 transition-opacity">
              wong rajin.
            </Link>
            <span className="text-[9px] lg:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
              biodata kelompok
            </span>
          </div>

          {/* MENU DESKTOP */}
          <div className="hidden lg:flex flex-1 justify-center gap-10 group/nav">
            {members.map((member) => {
              const isActive = currentMember?.id === member.id;
              return (
                <Link 
                  key={member.id} 
                  to={`/member/${member.id}`} 
                  className={`relative group text-sm font-bold lowercase tracking-widest py-1 transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
                >
                  {member.alias}
                  <span className={`absolute left-0 bottom-0 h-[2px] bg-gray-900 transition-all duration-300 ease-out ${isActive ? 'w-full group-hover/nav:w-0 group-hover:!w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              );
            })}
          </div>

          {/* ACTION BAR DESKTOP */}
          <div className="hidden lg:flex flex-1 justify-end items-center gap-3">
            {isOwner && (
              <button 
                onClick={triggerEditModal} 
                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-gray-700 transition shadow-md"
              >
                <FaEdit /> Edit Profile
              </button>
            )}

            {user ? (
              <button 
                onClick={handleLogout} 
                className="text-xs font-bold uppercase tracking-widest text-red-600 border border-red-200 bg-white px-5 py-2.5 rounded-full hover:bg-red-50 hover:-translate-y-1 hover:shadow-md active:scale-95 transition-all duration-200"
              >
                Logout ({user.email?.split('@')[0]})
              </button>
            ) : (
              <div className={loginLoading ? 'opacity-50 pointer-events-none' : ''}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.error('Google login failed')}
                  size="medium"
                  shape="pill"
                  text="signin_with"
                  theme="outline"
                />
              </div>
            )}
          </div>

          {/* TOMBOL BURGER MOBILE */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-900 p-2 focus:outline-none hover:bg-gray-100 rounded-lg transition">
              <MenuIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* --- SIDEBAR MOBILE --- */}
      <div 
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMobileMenu}
      />

      <div 
        className={`fixed top-0 right-0 h-[100dvh] w-[260px] sm:w-[320px] bg-white/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col lg:hidden transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-end p-5 border-b border-gray-100/50">
          <button onClick={closeMobileMenu} className="text-gray-900 p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition">
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col px-8 py-6 gap-2 flex-grow overflow-y-auto">
          {members.map((member) => {
            const isActive = currentMember?.id === member.id;
            return (
              <Link 
                key={member.id} 
                to={`/member/${member.id}`} 
                onClick={closeMobileMenu} 
                className={`text-sm font-extrabold lowercase tracking-widest py-4 border-b border-gray-100/50 transition-colors ${isActive ? 'text-gray-900 pl-2 border-l-4 border-l-gray-900' : 'text-gray-400 hover:text-gray-900 hover:pl-2'}`}
              >
                {member.alias}
              </Link>
            );
          })}
        </div>
        
        <div className="p-6 border-t border-gray-100/50 bg-gray-50/50 flex flex-col gap-3">
          {isOwner && (
            <button onClick={triggerEditModal} className="w-full flex justify-center items-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-lg text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-gray-800 transition">
              <FaEdit /> Edit Profile
            </button>
          )}

          {user ? (
            <button onClick={handleLogout} className="w-full text-xs font-bold uppercase tracking-widest text-red-600 border border-red-200 bg-white px-6 py-4 rounded-lg shadow-sm hover:bg-red-50 active:scale-95 transition-all duration-200">
              Logout
            </button>
          ) : (
            <div className={`flex justify-center ${loginLoading ? 'opacity-50 pointer-events-none' : ''}`}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.error('Google login failed')}
                size="medium"
                shape="pill"
                text="signin_with"
                theme="outline"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}