import { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { groupMembers } from '../data/members.js';

// --- KAMUS LOGO SKILLS ---
const skillLogos = {
  html: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  css: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  js: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  react: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  node: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  php: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  mysql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  figma: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  tailwind: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  github: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
};

export default function Biodata() {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook untuk pindah halaman
  
  // Mencari index anggota saat ini untuk menentukan siapa sebelum & sesudahnya
  const currentIndex = groupMembers.findIndex(m => m.id === id);
  const member = currentIndex !== -1 ? groupMembers[currentIndex] : null;
  
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);

  // --- EFEK KEYBOARD NAVIGATION ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Abaikan jika modal skills sedang terbuka atau data member tidak ditemukan
      if (isSkillsModalOpen || !member) return;

      if (e.key === 'ArrowRight') {
        // Panah Kanan -> Anggota Selanjutnya (Loop ke awal jika di ujung)
        const nextIndex = (currentIndex + 1) % groupMembers.length;
        navigate(`/member/${groupMembers[nextIndex].id}`);
      } else if (e.key === 'ArrowLeft') {
        // Panah Kiri -> Anggota Sebelumnya (Loop ke akhir jika di awal)
        const prevIndex = (currentIndex - 1 + groupMembers.length) % groupMembers.length;
        navigate(`/member/${groupMembers[prevIndex].id}`);
      }
    };

    // Pasang 'telinga' ke seluruh halaman untuk mendeteksi pencetan keyboard
    window.addEventListener('keydown', handleKeyDown);

    // Bersihkan 'telinga' saat user pindah komponen agar tidak error
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, navigate, isSkillsModalOpen, member]);

  if (!member) return <Navigate to="/" />;

  const splitNameForOutline = (name) => {
    const alias = name || "NAME";
    const midPoint = Math.ceil(alias.length / 2);
    return { top: alias.substring(0, midPoint), bottom: alias.substring(midPoint) };
  };

  const { top: outlineTop, bottom: outlineBottom } = splitNameForOutline(member.alias);

  const getSkillLogo = (skillName) => {
    const key = skillName.toLowerCase().trim();
    return skillLogos[key] || null;
  };

  return (
    <div className="relative w-full max-w-[1400px] mx-auto min-h-screen lg:min-h-[700px] lg:h-[70dvh] bg-white overflow-hidden lg:overflow-visible font-sans flex flex-col lg:block pt-20 lg:pt-0 pb-12 lg:pb-0 px-4 lg:px-0">
      
      {/* --- BACKGROUND BLOCKS (DESKTOP) --- */}
      <div className="hidden lg:block absolute top-[12%] bottom-0 left-[6%] w-[20%] bg-[#FEF4CE] z-0 min-h-[600px] max-h-[900px]"></div>
      <div className="hidden lg:block absolute top-[12%] bottom-[24%] left-[26%] right-0 bg-[#FEF4CE] z-0 min-h-[350px] max-h-[550px]"></div>
      <div className="hidden lg:block absolute top-0 left-[26%] w-[28%] h-[55%] bg-[#EED0AD] z-10 shadow-sm min-h-[450px] max-h-[650px]"></div>

      {/* --- MAIN CONTENT --- */}
      
      {/* 1. WRAPPER MOBILE 1: Nama & Foto */}
      <div className="order-1 relative flex flex-row items-stretch justify-center w-full lg:contents mb-6 lg:mb-0">
        <div className="absolute top-[15%] bottom-0 left-[-50vw] right-[50%] bg-[#FEF4CE] z-0 lg:hidden"></div>
        <div className="absolute top-[15%] bottom-0 left-[50%] right-[-50vw] bg-[#EED0AD] z-0 lg:hidden"></div>

        <div className="relative w-1/2 flex flex-col justify-center items-end lg:block lg:absolute lg:top-[28%] lg:left-[3%] z-10 lg:z-20 pointer-events-none text-right lg:text-left pr-2 sm:pr-4 lg:pr-0">
          <div className="w-full text-right lg:text-left">
            <h1 className="text-[14vw] sm:text-[75px] md:text-[90px] lg:text-[140px] font-outline text-transparent opacity-80 leading-[0.85] tracking-widest uppercase break-words">
              {outlineTop}
            </h1>
            <h1 className="text-[14vw] sm:text-[75px] md:text-[90px] lg:text-[140px] font-outline text-transparent opacity-80 leading-[0.85] tracking-widest uppercase break-words">
              {outlineBottom}
            </h1>
          </div>
        </div>

        <div className="relative w-1/2 flex justify-start items-end lg:items-center lg:justify-center lg:absolute lg:top-[2%] lg:bottom-[24%] lg:left-[26%] lg:w-[28%] z-10 lg:z-20">
          <img 
            src={member.photo} 
            alt={member.name} 
            className="w-full h-auto lg:w-auto lg:h-auto lg:max-h-full object-contain drop-shadow-2xl mix-blend-multiply pl-1 lg:pl-0"
            style={{ filter: 'grayscale(100%) contrast(120%)' }} 
          />
        </div>
      </div> 

      {/* 3. Teks Deskripsi */}
      <div className="order-2 relative lg:absolute lg:top-[10%] lg:bottom-[30%] lg:left-[58%] lg:right-[4%] z-20 flex flex-col justify-center bg-[#FEF4CE] lg:bg-transparent px-6 py-8 mt-6 lg:p-0 lg:m-0 rounded-3xl lg:rounded-none lg:pr-4 text-center lg:text-left shadow-sm lg:shadow-none">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
          {member.name} - {member.npm}
        </h2>
        <p className="text-[13px] lg:text-[14px] text-gray-800 mb-8 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
          {member.description}
        </p>
        
        <div className="flex flex-col lg:block items-center">
          <div className="flex justify-center lg:justify-start gap-6 text-gray-900">
            {member.email && <a href={`mailto:${member.email}`} className="hover:text-gray-500 hover:-translate-y-1 transition-all duration-300"><FaEnvelope size={24} /></a>}
            {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" className="hover:text-gray-500 hover:-translate-y-1 transition-all duration-300"><FaLinkedin size={24} /></a>}
            {member.github && <a href={member.github} target="_blank" rel="noreferrer" className="hover:text-gray-500 hover:-translate-y-1 transition-all duration-300"><FaGithub size={24} /></a>}
          </div>
        </div>
      </div>

      {/* 4. --- BOTTOM NAVIGATION --- */}
      <div className="order-3 relative lg:absolute lg:bottom-[10%] lg:left-[30%] lg:right-[6%] flex flex-row flex-wrap justify-center lg:grid lg:grid-cols-3 items-center z-20 mt-10 lg:mt-0 gap-x-8 gap-y-4 lg:gap-0">
        
        {[
          member.downloadCv && (
            <a key="cv" href={member.downloadCv} className="text-[11px] lg:text-xs font-extrabold text-gray-900 uppercase border-b-[3px] border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 hover:-translate-y-1 transition-all duration-300 tracking-widest text-center">
              download cv
            </a>
          ),
          member.portofolio && (
            <a key="portfolio" href={member.portofolio} className="text-[11px] lg:text-xs font-extrabold text-gray-900 uppercase border-b-[3px] border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 hover:-translate-y-1 transition-all duration-300 tracking-widest text-center">
              portfolio
            </a>
          ),
          member.skills && member.skills.length > 0 && (
            <button key="skills" onClick={() => setIsSkillsModalOpen(true)} className="text-[11px] lg:text-xs font-extrabold text-gray-900 uppercase border-b-[3px] border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 hover:-translate-y-1 transition-all duration-300 tracking-widest text-center cursor-pointer outline-none">
              skills
            </button>
          )
        ]
        .filter(Boolean)
        .map((btn, index) => {
          let alignClass = 'lg:justify-self-start';
          if (index === 1) alignClass = 'lg:justify-self-center';
          if (index === 2) alignClass = 'lg:justify-self-end';

          return (
            <div key={btn.key} className={alignClass}>
              {btn}
            </div>
          );
        })}

      </div>

      {/* --- MODAL SKILLS --- */}
      {isSkillsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 transition-opacity duration-300 opacity-100">
          
          <div className="absolute inset-0" onClick={() => setIsSkillsModalOpen(false)}></div>

          <div className="bg-white w-full max-w-lg rounded-[32px] p-8 lg:p-12 shadow-2xl transform scale-100 transition-transform relative z-10">
            
            <button 
              onClick={() => setIsSkillsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-3xl font-extrabold text-gray-900 mb-8 lowercase tracking-tighter shadow-text">
              skills.
            </h3>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {member.skills && member.skills.length > 0 ? (
                member.skills.map((skill, index) => {
                  const logoUrl = getSkillLogo(skill);
                  
                  return (
                    <div 
                      key={index} 
                      className="flex flex-col items-center justify-center gap-3 p-5 bg-[#FEF4CE] text-gray-900 rounded-2xl border border-[#EED0AD]/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default w-28 h-32 text-center"
                    >
                      {logoUrl ? (
                        <img 
                          src={logoUrl} 
                          alt={`${skill} logo`} 
                          className="w-12 h-12 object-contain" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xl border border-gray-200">
                          {skill.substring(0,1).toUpperCase()}
                        </div>
                      )}
                      
                      <span className="text-[10px] font-extrabold uppercase tracking-widest leading-tight">
                        {skill}
                      </span>
                    </div>
                  );
                })
              ) : (
                <span className="text-gray-500 italic text-sm font-medium">Belum ada skill yang ditambahkan.</span>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}