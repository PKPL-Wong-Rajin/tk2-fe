import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { groupMembers } from '../data/members.js';

// SVG Icon Burger (Garis Tiga)
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

// SVG Icon Close (Silang)
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function Navbar({ user, onLogin, onLogout }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const currentMember = groupMembers.find(m => location.pathname.includes(m.id)) || groupMembers[0];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Navbar Utama */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm pointer-events-auto transition-all duration-300">
        
        {/* Container Header (Gunakan lg: bukan md: agar menu burger muncul lebih awal) */}
        <div className="max-w-[1400px] mx-auto px-6 py-4 lg:px-12 flex justify-between items-center w-full relative">
          
          {/* KIRI: Logo (Selalu Tampil) */}
          <div className="flex flex-col items-start lg:flex-1">
            <Link to="/" onClick={closeMobileMenu} className="text-2xl lg:text-3xl font-extrabold lowercase text-gray-900 tracking-tighter hover:opacity-70 transition-opacity">
              wong rajin.
            </Link>
            <span className="text-[9px] lg:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
              biodata kelompok
            </span>
          </div>

          {/* --- TAMPILAN DESKTOP (Muncul di layar besar/lg) --- */}
          
          {/* TENGAH: Menu Desktop */}
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

          {/* KANAN: Tombol Login Desktop */}
          <div className="hidden lg:flex flex-1 justify-end">
            {user ? (
              <button onClick={onLogout} className="text-xs font-bold uppercase tracking-widest text-red-600 border border-red-200 bg-white px-6 py-3 rounded-lg hover:bg-red-50 hover:-translate-y-1 hover:shadow-md active:scale-95 transition-all duration-200">
                Logout
              </button>
            ) : (
              <div className="hover:-translate-y-1 hover:shadow-md active:scale-95 transition-all duration-200 rounded-md bg-white">
                <GoogleLogin onSuccess={onLogin} onError={() => console.error('Login Failed')} theme="outline" size="large" />
              </div>
            )}
          </div>

          {/* --- TOMBOL BURGER MOBILE --- */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-900 p-2 focus:outline-none hover:bg-gray-100 rounded-lg transition"
              aria-label="Buka Menu"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* --- SIDEBAR MENU (Geser dari Kanan) --- */}
      
      {/* Background Gelap (Backdrop) - Menutup menu jika diklik di luar sidebar */}
      <div 
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      />

      {/* Panel Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-[100dvh] w-[220px] sm:w-[320px] bg-white/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Bagian Atas Sidebar: Tombol Close */}
        <div className="flex justify-end p-5 border-b border-gray-100/50">
          <button 
            onClick={closeMobileMenu}
            className="text-gray-900 p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
            aria-label="Tutup Menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Isi Menu Sidebar */}
        <div className="flex flex-col px-8 py-6 gap-2 flex-grow overflow-y-auto">
          {groupMembers.map((member) => {
            const isActive = currentMember.id === member.id;
            return (
              <Link 
                key={member.id} 
                to={`/member/${member.id}`} 
                onClick={closeMobileMenu} 
                className={`text-sm font-extrabold lowercase tracking-widest py-4 border-b border-gray-100/50 transition-colors
                  ${isActive ? 'text-gray-900 pl-2 border-l-4 border-l-gray-900' : 'text-gray-400 hover:text-gray-900 hover:pl-2'}
                `}
              >
                {member.alias}
              </Link>
            );
          })}
        </div>
        
        {/* Bagian Bawah Sidebar: Tombol Login/Logout */}
        <div className="p-8 border-t border-gray-100/50 bg-gray-50/50">
          {user ? (
            <button 
              onClick={() => { onLogout(); closeMobileMenu(); }} 
              className="w-full text-xs font-bold uppercase tracking-widest text-red-600 border border-red-200 bg-white px-6 py-4 rounded-lg shadow-sm hover:bg-red-50 active:scale-95 transition-all duration-200"
            >
              Logout
            </button>
          ) : (
            <div className="w-full flex justify-center bg-white rounded-md shadow-sm">
              <GoogleLogin 
                onSuccess={(res) => { onLogin(res); closeMobileMenu(); }} 
                onError={() => console.error('Login Failed')} 
                theme="outline" 
                size="large" 
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}