import { useState, useEffect, useCallback } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaEnvelope, FaTimes } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

const AVAILABLE_SKILLS = [
  "HTML", "CSS", "JavaScript", "React", "NodeJS", 
  "Python", "Java", "PHP", "MySQL", "Figma", 
  "Tailwind", "Git", "GitHub"
];

const GOOGLE_FONTS = [
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Inter",
  "Raleway",
  "Nunito",
  "Playfair Display",
  "Merriweather",
  "Source Sans 3",
  "PT Sans",
  "Outfit",
  "Work Sans",
  "Rubik",
  "DM Sans",
  "Manrope",
  "Space Grotesk",
  "Josefin Sans",
  "Quicksand",
  "Bebas Neue",
  "Oswald",
  "Cabin",
  "Karla",
  "Fira Sans",
  "Bitter",
  "Libre Baskerville",
  "Crimson Text",
  "IBM Plex Sans",
  "JetBrains Mono",
];

const DEFAULT_LIGHT_COLOR = "#FEF4CE"; 
const DEFAULT_DARK_COLOR = "#EED0AD";
const DEFAULT_FONT_FAMILY = "Roboto";

function loadGoogleFont(fontFamily) {
  if (!fontFamily) return;
  const id = `gfont-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(id)) return;

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
}

export default function Biodata({ members = [], user, onBiodataUpdate, onBgColorChange }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const currentIndex = members.findIndex(m => m.id === id);
  const baseMember = currentIndex !== -1 ? members[currentIndex] : null;

  const [member, setMember] = useState(baseMember);
  
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [skillSearch, setSkillSearch] = useState('');
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (baseMember) {
      setMember(baseMember);
      if (onBgColorChange) onBgColorChange(baseMember.style?.bgColor || '#f3f4f6');
    }
  }, [baseMember]);

  // Load Google Font when member changes
  useEffect(() => {
    if (member?.style?.fontFamily) {
      loadGoogleFont(member.style.fontFamily);
    }
  }, [member?.style?.fontFamily]);

  const openEditModal = useCallback(() => {
    if(member) {
      setEditForm({
        ...member,
        skills: member.skills ? [...member.skills] : [],
        style: { ...member.style },
      });
      setSkillSearch('');
      setSaveError(null);
      setIsEditModalOpen(true);
    }
  }, [member]);

  useEffect(() => {
    window.addEventListener('triggerOpenEditModal', openEditModal);
    return () => window.removeEventListener('triggerOpenEditModal', openEditModal);
  }, [openEditModal]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSkillsModalOpen || isEditModalOpen || !member) return;
      if (e.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % members.length;
        navigate(`/member/${members[nextIndex].id}`);
      } else if (e.key === 'ArrowLeft') {
        const prevIndex = (currentIndex - 1 + members.length) % members.length;
        navigate(`/member/${members[prevIndex].id}`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, navigate, isSkillsModalOpen, isEditModalOpen, member, members]);

  if (!baseMember || !member) return <Navigate to="/" />;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      style: { ...prev.style, [name]: value },
    }));
    if (name === 'fontFamily') loadGoogleFont(value);
  };

  const addSkill = (skillName) => {
    setEditForm(prev => ({ ...prev, skills: [...(prev.skills || []), skillName] }));
    setSkillSearch('');
    setIsSkillDropdownOpen(false);
  };

  const removeSkill = (skillName) => {
    setEditForm(prev => ({ ...prev, skills: (prev.skills || []).filter(s => s !== skillName) }));
  };

  const availableToSelect = AVAILABLE_SKILLS.filter(skill => 
    skill.toLowerCase().includes(skillSearch.toLowerCase()) && 
    !(editForm.skills || []).some(s => s.toLowerCase() === skill.toLowerCase())
  );

  const saveEdits = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      const body = {
        description: editForm.description,
        photo: editForm.photo,
        email: editForm.email,
        linkedin: editForm.linkedin,
        github: editForm.github,
        downloadCv: editForm.downloadCv,
        portofolio: editForm.portofolio,
        skills: editForm.skills,
        style: {
          lightColor: editForm.style?.lightColor,
          darkColor: editForm.style?.darkColor,
          fontFamily: editForm.style?.fontFamily,
          bgColor: editForm.style?.bgColor,
        },
      };

      const res = await fetch(`${API_URL}/biodata/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const updatedMember = await res.json();
        setMember(updatedMember);
        setIsEditModalOpen(false);
        if (onBiodataUpdate) onBiodataUpdate(updatedMember);
      } else {
        const error = await res.json();
        setSaveError(error.message || 'Failed to save changes');
      }
    } catch (error) {
      setSaveError('Network error — please try again');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const nameCharacters = (member.alias || "NAME").split('');
  const getSkillLogo = (skillName) => {
    let key = skillName.toLowerCase().trim();
    if (key === 'nodejs') key = 'node'; 
    return skillLogos[key] || null;
  };

  const lightBg = member.style?.lightColor || DEFAULT_LIGHT_COLOR;
  const darkBg = member.style?.darkColor || DEFAULT_DARK_COLOR;
  const fontFamily = member.style?.fontFamily || DEFAULT_FONT_FAMILY;

  const isOwner = user?.email === member.email;

  return (
    <>
      {isOwner && (
        <div className="max-w-xl mx-auto mb-8 p-4 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center justify-between relative z-40">
          <span className="font-semibold text-gray-700">🎨 Mode Edit Warna Latar</span>
          <div className="flex items-center gap-3">
            <input 
              type="color" 
              value={member.style?.bgColor || '#f3f4f6'}
              onChange={(e) => {
                const newColor = e.target.value;
                setMember(prev => ({ ...prev, style: { ...prev.style, bgColor: newColor } }));
                if (onBgColorChange) onBgColorChange(newColor);
              }}
              onBlur={async () => {
                try {
                  const res = await fetch(`${API_URL}/biodata/${member.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ style: { bgColor: member.style?.bgColor } }),
                  });
                  if (res.ok) {
                    const updated = await res.json();
                    if (onBiodataUpdate) onBiodataUpdate(updated);
                  }
                } catch {}
              }}
              className="w-10 h-10 p-1 cursor-pointer rounded bg-white"
            />
            <span className="text-sm font-mono text-gray-500">{member.style?.bgColor || '#f3f4f6'}</span>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-[1400px] mx-auto min-h-screen lg:min-h-[700px] lg:h-[70dvh] bg-white overflow-hidden lg:overflow-visible font-sans flex flex-col lg:block pt-10 lg:pt-0 pb-6 lg:pb-0 lg:px-0">
      
      {/* BACKGROUND BLOCKS */}
      <div className="hidden lg:block absolute top-[12%] bottom-0 left-[6%] w-[20%] z-0 min-h-[600px] max-h-[900px] transition-colors duration-500" style={{ backgroundColor: lightBg }}></div>
      <div className="hidden lg:block absolute top-[12%] bottom-[24%] left-[26%] right-0 z-0 min-h-[350px] max-h-[550px] transition-colors duration-500" style={{ backgroundColor: lightBg }}></div>
      <div className="hidden lg:block absolute top-0 left-[26%] w-[28%] h-[55%] z-10 shadow-sm min-h-[450px] max-h-[650px] transition-colors duration-500" style={{ backgroundColor: darkBg }}></div>

      {/* MAIN CONTENT */}
      <div className="order-1 relative flex flex-col lg:flex-row items-center lg:items-stretch justify-center w-full lg:contents mb-6 lg:mb-0 gap-2 lg:gap-0 mt-4 lg:mt-0">
        <div className="absolute top-[-5%] bottom-0 left-[-50vw] right-[-50vw] z-0 lg:hidden rounded-b-[40px] transition-colors duration-500" style={{ backgroundColor: lightBg }}></div>

        {/* NAMA */}
        <div className="relative w-full lg:w-[20%] flex flex-col justify-center items-center lg:absolute lg:top-[15%] lg:left-[6%] z-20 pointer-events-none px-2 lg:px-0 mb-2 lg:mb-0 pt-4 lg:pt-0">
          <div className="w-fit flex flex-row flex-wrap lg:flex-col items-center justify-center lg:items-start lg:justify-start text-center gap-x-2 sm:gap-x-3 lg:gap-x-0">
            {nameCharacters.map((char, index) => (
              <h1 key={index} className="text-[12vw] sm:text-[60px] md:text-[80px] lg:text-[140px] font-outline text-transparent opacity-80 leading-none lg:leading-[0.80] tracking-widest uppercase">
                {char}
              </h1>
            ))}
          </div>
        </div>

        {/* FOTO */}
        <div className="relative isolate w-full lg:w-[28%] flex justify-center items-end lg:items-center lg:justify-center lg:absolute lg:top-[2%] lg:bottom-[24%] lg:left-[26%] z-10 mt-2 lg:mt-0">
          <div className="absolute bottom-0 left-[5%] right-[5%] sm:left-[15%] sm:right-[15%] h-[80%] z-[-1] lg:hidden rounded-t-[40px] transition-colors duration-500" style={{ backgroundColor: darkBg }}></div>
          <img 
            src={member.photo} 
            alt={member.name} 
            className="relative z-10 block h-[320px] sm:h-[350px] lg:h-auto w-auto lg:max-h-full object-contain drop-shadow-2xl mix-blend-normal lg:mix-blend-multiply px-6 sm:px-12 lg:px-0 transition-all duration-500"
            style={{ filter: 'grayscale(100%) contrast(120%)' }} 
          />
        </div>
      </div> 

      {/* DESKRIPSI — fontFamily applied here */}
      <div className="order-2 relative lg:absolute lg:top-[10%] lg:bottom-[30%] lg:left-[58%] lg:right-[4%] z-20 flex flex-col justify-center lg:bg-transparent px-6 py-6 mt-4 lg:p-0 lg:m-0 rounded-3xl lg:rounded-none lg:pr-4 text-center lg:text-left shadow-sm lg:shadow-none transition-colors duration-500" style={{ backgroundColor: window.innerWidth < 1024 ? lightBg : 'transparent' }}>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 lg:mb-4 leading-tight" style={{ fontFamily }}>
          {member.name} - {member.npm}
        </h2>
        <p className="text-[13px] lg:text-[14px] text-gray-800 mb-5 font-medium leading-relaxed max-w-md mx-auto lg:mx-0" style={{ fontFamily }}>
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

      {/* BOTTOM NAVIGATION */}
      <div className="order-3 relative lg:absolute lg:bottom-[10%] lg:left-[30%] lg:right-[6%] flex flex-row flex-wrap justify-center lg:grid lg:grid-cols-3 items-center z-20 mt-5 lg:mt-0 gap-x-8 gap-y-4 lg:gap-0">
        {[
          member.downloadCv && (
            <a key="cv" href={member.downloadCv} target="_blank" rel="noreferrer" className="text-[11px] lg:text-xs font-extrabold text-gray-900 uppercase border-b-[3px] border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 hover:-translate-y-1 transition-all duration-300 tracking-widest text-center">
              download cv
            </a>
          ),
          member.portofolio && (
            <a key="portfolio" href={member.portofolio} target="_blank" rel="noreferrer" className="text-[11px] lg:text-xs font-extrabold text-gray-900 uppercase border-b-[3px] border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 hover:-translate-y-1 transition-all duration-300 tracking-widest text-center">
              portfolio
            </a>
          ),
          member.skills && member.skills.length > 0 && (
            <button key="skills" onClick={() => setIsSkillsModalOpen(true)} className="text-[11px] lg:text-xs font-extrabold text-gray-900 uppercase border-b-[3px] border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 hover:-translate-y-1 transition-all duration-300 tracking-widest text-center cursor-pointer outline-none">
              skills
            </button>
          )
        ].filter(Boolean).map((btn, index) => {
          let alignClass = 'lg:justify-self-start';
          if (index === 1) alignClass = 'lg:justify-self-center';
          if (index === 2) alignClass = 'lg:justify-self-end';
          return <div key={btn.key} className={alignClass}>{btn}</div>;
        })}
      </div>

      {/* --- MODAL SKILLS (DISPLAY) --- */}
      {isSkillsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 transition-opacity duration-300 opacity-100">
          <div className="absolute inset-0" onClick={() => setIsSkillsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-[32px] p-8 lg:p-12 shadow-2xl transform scale-100 transition-transform relative z-10">
            <button onClick={() => setIsSkillsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all">
              <FaTimes className="h-5 w-5" />
            </button>
            <h3 className="text-3xl font-extrabold text-gray-900 mb-8 lowercase tracking-tighter shadow-text">skills.</h3>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {member.skills && member.skills.length > 0 ? (
                member.skills.map((skill, index) => {
                  const logoUrl = getSkillLogo(skill);
                  return (
                    <div key={index} className="flex flex-col items-center justify-center gap-3 p-5 text-gray-900 rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default w-28 h-32 text-center" style={{ backgroundColor: lightBg }}>
                      {logoUrl ? <img src={logoUrl} alt={`${skill} logo`} className="w-12 h-12 object-contain" /> : <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center text-gray-600 font-bold text-xl border border-gray-300">{skill.substring(0,1).toUpperCase()}</div>}
                      <span className="text-[10px] font-extrabold uppercase tracking-widest leading-tight">{skill}</span>
                    </div>
                  );
                })
              ) : <span className="text-gray-500 italic text-sm font-medium">Belum ada skill yang ditambahkan.</span>}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT PROFILE --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 lg:p-8 shadow-2xl relative z-10 max-h-[90vh] flex flex-col">
            
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-extrabold text-gray-900">Edit Profile</h3>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-all">
                <FaTimes className="h-6 w-6" />
              </button>
            </div>

            {saveError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
                {saveError}
              </div>
            )}

            <form onSubmit={saveEdits} className="overflow-y-auto pr-2 space-y-5 flex-1 custom-scrollbar">
              
              {/* STYLE: Colors + Font */}
              <div className="p-4 bg-gray-50 rounded-xl border space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Warna Utama (Krem)</label>
                    <div className="flex items-center gap-3">
                      <input type="color" name="lightColor" value={editForm.style?.lightColor || DEFAULT_LIGHT_COLOR} onChange={handleStyleChange} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                      <span className="text-sm font-mono text-gray-500">{editForm.style?.lightColor || DEFAULT_LIGHT_COLOR}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Warna Aksen (Coklat)</label>
                    <div className="flex items-center gap-3">
                      <input type="color" name="darkColor" value={editForm.style?.darkColor || DEFAULT_DARK_COLOR} onChange={handleStyleChange} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                      <span className="text-sm font-mono text-gray-500">{editForm.style?.darkColor || DEFAULT_DARK_COLOR}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Font Family</label>
                  <select
                    name="fontFamily"
                    value={editForm.style?.fontFamily || DEFAULT_FONT_FAMILY}
                    onChange={handleStyleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                    style={{ fontFamily: editForm.style?.fontFamily || DEFAULT_FONT_FAMILY }}
                  >
                    {GOOGLE_FONTS.map(font => (
                      <option key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-xs text-gray-400">Preview:</p>
                  <p className="text-sm text-gray-700 mt-1" style={{ fontFamily: editForm.style?.fontFamily || DEFAULT_FONT_FAMILY }}>
                    {member.name} — {member.description?.substring(0, 60)}...
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Link Foto Profil (URL)</label>
                  <input type="url" name="photo" value={editForm.photo || ''} onChange={handleFormChange} placeholder="https://..." className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Link CV (URL)</label>
                  <input type="url" name="downloadCv" value={editForm.downloadCv || ''} onChange={handleFormChange} placeholder="https://..." className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none" />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Skills (Cari dan Pilih)</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(editForm.skills || []).map(skill => (
                    <span key={skill} className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1 text-xs font-bold rounded-full">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-400 focus:outline-none"><FaTimes size={10} /></button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <input type="text" placeholder="Ketik untuk mencari skill..." value={skillSearch} onChange={(e) => setSkillSearch(e.target.value)} onFocus={() => setIsSkillDropdownOpen(true)} onBlur={() => setTimeout(() => setIsSkillDropdownOpen(false), 200)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none" />
                  {isSkillDropdownOpen && skillSearch && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                      {availableToSelect.length > 0 ? (
                        availableToSelect.map(skill => (
                          <div key={skill} onClick={() => addSkill(skill)} className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 font-medium border-b last:border-0">+ Tambahkan <span className="font-bold text-gray-900">{skill}</span></div>
                        ))
                      ) : <div className="p-4 text-center text-sm text-gray-500">Skill tidak ditemukan</div>}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Deskripsi Singkat</label>
                <textarea name="description" value={editForm.description || ''} onChange={handleFormChange} rows="3" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email</label>
                  <input type="email" name="email" value={editForm.email || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">LinkedIn URL</label>
                  <input type="url" name="linkedin" value={editForm.linkedin || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">GitHub URL</label>
                  <input type="url" name="github" value={editForm.github || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Link Portfolio (Opsional)</label>
                  <input type="url" name="portofolio" value={editForm.portofolio || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none" />
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-full transition" disabled={isSaving}>Batal</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 rounded-full shadow-md transition disabled:opacity-50" disabled={isSaving}>
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
    </>
  );
}