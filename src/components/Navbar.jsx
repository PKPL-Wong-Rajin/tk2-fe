import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaEdit, FaGoogle } from 'react-icons/fa';
import { groupMembers } from '../data/members.js';

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

export default function Navbar({ user, onLogin, onLogout }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState(localStorage.getItem('mock_google_email') || null);
  
  const isMemberPage = location.pathname.includes('/member/');
  const currentMember = groupMembers.find(m => location.pathname.includes(m.id)) || groupMembers[0];

  useEffect(() => {
    const handleAuthChange = () => {
      const email = localStorage.getItem('mock_google_email');
      setLoggedInEmail(email);
      if (email && onLogin) onLogin({ email });
    };
    
    // Sinkronisasi awal jika sudah ada data di local storage
    const initialEmail = localStorage.getItem('mock_google_email');
    if (initialEmail && !user && onLogin) onLogin({ email: initialEmail });

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, [onLogin, user]);

  const isOwner = isMemberPage && currentMember && loggedInEmail === currentMember.email;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // --- LOGIKA MOCK LOGIN / PROTOTYPE ---
  const handleMockLogin = () => {
    const email = prompt("🔧 PROTOTYPE MODE\nMasukkan email anggota (harus sama persis dengan di members.js) untuk test fitur Edit:");
    if (email) {
      localStorage.setItem('mock_google_email', email);
      window.dispatchEvent(new Event('authChange'));
    }
  };

  const handleMockLogout = () => {
    localStorage.removeItem('mock_google_email');
    window.dispatchEvent(new Event('authChange'));
    if (onLogout) onLogout();
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
            {groupMembers.map((member) => {
              const isActive = currentMember.id === member.id;
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

            {loggedInEmail ? (
              <button 
                onClick={handleMockLogout} 
                className="text-xs font-bold uppercase tracking-widest text-red-600 border border-red-200 bg-white px-5 py-2.5 rounded-full hover:bg-red-50 hover:-translate-y-1 hover:shadow-md active:scale-95 transition-all duration-200"
              >
                Logout ({loggedInEmail.split('@')[0]})
              </button>
            ) : (
              <button 
                onClick={handleMockLogin} 
                className="flex items-center gap-2 border border-gray-300 bg-white px-5 py-2.5 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-50 hover:-translate-y-1 hover:shadow-md active:scale-95 transition-all duration-200"
              >
                <FaGoogle className="text-blue-500" /> Login Dummy
              </button>
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
          {groupMembers.map((member) => {
            const isActive = currentMember.id === member.id;
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

          {loggedInEmail ? (
            <button onClick={() => { handleMockLogout(); closeMobileMenu(); }} className="w-full text-xs font-bold uppercase tracking-widest text-red-600 border border-red-200 bg-white px-6 py-4 rounded-lg shadow-sm hover:bg-red-50 active:scale-95 transition-all duration-200">
              Logout
            </button>
          ) : (
            <button onClick={() => { handleMockLogin(); closeMobileMenu(); }} className="w-full flex justify-center items-center gap-2 border border-gray-300 bg-white px-6 py-4 rounded-lg text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all duration-200">
              <FaGoogle className="text-blue-500" /> Login Dummy
            </button>
          )}
        </div>
      </div>
    </>
  );
}