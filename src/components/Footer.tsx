import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { 
  Mail, 
  Facebook, 
  Twitter, 
  Github, 
  Linkedin, 
  ShieldAlert, 
  FileText, 
  Globe, 
  X, 
  Search, 
  Trash2, 
  LogOut, 
  Lock, 
  ShieldCheck, 
  Eye, 
  ListFilter,
  Layers,
  FileCheck2,
  LockKeyhole
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setSelectedCategory?: (cat: string) => void;
  setSelectedArticle?: (art: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, setSelectedCategory, setSelectedArticle }) => {
  const { subscribeNewsletter, categories, articles, deleteArticle } = useBlog();
  const [emailVal, setEmailVal] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  // Admin Drawer UI States
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  
  const [isAdminSlotCreated, setIsAdminSlotCreated] = useState<boolean>(() => {
    return localStorage.getItem('admin_slot_created') === 'true';
  });
  
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('admin_panel_logged_in') === 'true';
  });

  // Registration & Login inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  // Writings List Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const handleSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailVal.trim()) return;
    try {
      const msg = await subscribeNewsletter(emailVal.trim());
      setStatus({ type: 'success', message: msg });
      setEmailVal('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Subscription failed.' });
    }
  };

  const handleCatClick = (catName: string) => {
    if (setSelectedCategory) {
      setSelectedCategory(catName);
    }
    setActiveTab('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Account Handlers
  const handleAdminRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    const formattedEmail = regEmail.trim().toLowerCase();
    if (formattedEmail !== 'faisalabbaskhantaheem@gmail.com') {
      setAdminError("Only the platform owner's email address (faisalabbaskhantaheem@gmail.com) is authorized to claim this administrative slot.");
      return;
    }

    if (!regName.trim() || !regPassword.trim()) {
      setAdminError("Please provide both name and security password / PIN.");
      return;
    }

    // Save of credentials
    localStorage.setItem('admin_slot_created', 'true');
    localStorage.setItem('admin_master_name', regName.trim());
    localStorage.setItem('admin_master_email', 'faisalabbaskhantaheem@gmail.com');
    localStorage.setItem('admin_master_password', regPassword.trim());
    localStorage.setItem('admin_panel_logged_in', 'true');

    setIsAdminSlotCreated(true);
    setIsAdminLoggedIn(true);
    setAdminSuccess("Master Administrative Profile claimed and unlocked successfully! Welcome Faisal.");
    
    // Clear forms
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    
    setTimeout(() => setAdminSuccess(''), 4005);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    const formattedEmail = loginEmail.trim().toLowerCase();
    const savedPassword = localStorage.getItem('admin_master_password');

    if (formattedEmail !== 'faisalabbaskhantaheem@gmail.com') {
      setAdminError("Permission Denied: Only Faisal's email (faisalabbaskhantaheem@gmail.com) can log in as Admin.");
      return;
    }

    if (loginPassword !== savedPassword) {
      setAdminError("Incorrect master security password / PIN.");
      return;
    }

    localStorage.setItem('admin_panel_logged_in', 'true');
    setIsAdminLoggedIn(true);
    setAdminSuccess("Access Granted. Secure Session Established.");
    
    setLoginEmail('');
    setLoginPassword('');
    
    setTimeout(() => setAdminSuccess(''), 4005);
  };

  const handleAdminLogout = () => {
    localStorage.setItem('admin_panel_logged_in', 'false');
    setIsAdminLoggedIn(false);
    setAdminSuccess("Terminal Securely Locked.");
    setTimeout(() => setAdminSuccess(''), 3000);
  };

  const inspectArticle = (art: any) => {
    if (setSelectedArticle) {
       setSelectedArticle(art);
    }
    setActiveTab('single-article');
    setIsAdminPanelOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteWriting = (id: string, title: string) => {
    if (window.confirm(`Are you absolutely sure you want to permanently expel: "${title}"?`)) {
      deleteArticle(id);
      setAdminSuccess(`Deleted writing "${title}" successfully.`);
      setTimeout(() => setAdminSuccess(''), 3000);
    }
  };

  // Filter calculations
  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (art.excerpt && art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Support category filter
    const matchesCategory = selectedCat === 'All' || art.category === selectedCat;
    return matchesSearch && matchesCategory;
  });

  const cumulativeViews = articles.reduce((sum, art) => sum + (art.views || 0), 0);
  const cumulativeLikes = articles.reduce((sum, art) => sum + (art.likes || 0), 0);

  return (
    <footer id="app-footer" className="bg-slate-900 text-slate-300 dark:bg-slate-950 mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Upper Newsletter Subscription Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12 border-b border-slate-800">
          <div className="lg:col-span-2 max-w-xl">
            <h3 className="text-xl font-extrabold text-white tracking-tight sm:text-2xl">
              Stay ahead with engineering insight lists
            </h3>
            <p className="mt-2 text-slate-400 text-sm">
              Subscribe to the JB Blogging newsletter to receive monthly compilations of pristine articles about code design, AI models, and startup dynamics. No spam, reject anytime.
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <form onSubmit={handleSub} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <div className="relative flex-grow">
                <input
                  type="email"
                  required
                  placeholder="Enter your professional email"
                  value={emailVal}
                  onChange={(e) => setEmailVal(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 active:scale-95"
              >
                Subscribe
              </button>
            </form>
            {status.type === 'success' && (
              <p className="text-emerald-400 text-xs font-semibold mt-2">{status.message}</p>
            )}
            {status.type === 'error' && (
              <p className="text-amber-400 text-xs font-semibold mt-2">{status.message}</p>
            )}
          </div>
        </div>

        {/* Middle Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => handleTabClick('home')}>
              <span className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                JB
              </span>
              <span className="font-extrabold text-lg tracking-tight text-white">
                JB Blogging
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Discover Ideas, Share Knowledge, Inspire the World. JB Blogging is a modern hub where technical pioneers publish structured tutorials, startup models, and generative intelligence logs.
            </p>
            <div className="flex items-center space-x-3 text-slate-400">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h4 className="text-xs font-extrabold text-white tracking-widest uppercase mb-4">
              Explore JB Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleTabClick('home')} className="hover:text-blue-400 transition-colors text-left text-slate-400 hover:underline">
                  Home Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleTabClick('articles')} className="hover:text-blue-400 transition-colors text-left text-slate-400 hover:underline">
                  Explore Articles
                </button>
              </li>
              <li>
                <button onClick={() => handleTabClick('about')} className="hover:text-blue-400 transition-colors text-left text-slate-400 hover:underline">
                  Our Story & Mission
                </button>
              </li>
              <li>
                <button onClick={() => handleTabClick('contact')} className="hover:text-blue-400 transition-colors text-left text-slate-400 hover:underline">
                  Contact Support / FAQ
                </button>
              </li>
              <li>
                <button onClick={() => handleTabClick('auth')} className="hover:text-blue-400 transition-colors text-left text-slate-400 hover:underline">
                  Claim Author Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Categories Quick Link */}
          <div>
            <h4 className="text-xs font-extrabold text-white tracking-widest uppercase mb-4">
              Popular Channels
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <button 
                    onClick={() => handleCatClick(category.name)} 
                    className="hover:text-blue-400 transition-colors text-left text-slate-400 hover:underline"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Site Info */}
          <div>
            <h4 className="text-xs font-extrabold text-white tracking-widest uppercase mb-4">
              Resources & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-400">
                <FileText className="h-3.5 w-3.5 text-blue-500" />
                <span className="hover:text-white cursor-pointer">Privacy Guidelines</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <ShieldAlert className="h-3.5 w-3.5 text-emerald-500" />
                <span className="hover:text-white cursor-pointer">Terms of Service</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <Globe className="h-3.5 w-3.5 text-indigo-500" />
                <span className="hover:text-white cursor-pointer">Sitemap Directive</span>
              </li>
              <li className="text-slate-500 pt-2 border-t border-slate-800">
                Host Domain: <span className="font-mono text-[10px] text-slate-400 block break-all">jbblogging.studio.run</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Final Base Panel */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JB Blogging Corporation. Created & Designed for real-world publication.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="cursor-default">Security Protocol</span>
            <span className="text-slate-650 opacity-50">|</span>
            <button
              onClick={() => {
                setIsAdminPanelOpen(true);
                setAdminError('');
                setAdminSuccess('');
              }}
              className="text-slate-400 hover:text-blue-400 transition-all font-semibold flex items-center gap-1 cursor-pointer bg-slate-800/40 hover:bg-slate-800 px-3 py-1 rounded-lg border border-slate-700/60"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-blue-500 animate-pulse" /> 
              Admin Control System
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================
          ADMIN PANEL MASTER DRAWER / DRAWER PORTAL
          ======================================================== */}
      {isAdminPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/80 backdrop-blur-sm transition-opacity">
          {/* Backdrop Closer */}
          <div className="absolute inset-0" onClick={() => setIsAdminPanelOpen(false)} />

          {/* Actual Drawer Container */}
          <div className="relative w-full md:w-[650px] lg:w-[750px] bg-slate-950 text-white h-screen shadow-2xl flex flex-col z-10 border-l border-slate-800 animate-slide-in p-6 overflow-hidden">
            
            {/* Header Area */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-500" />
                <h2 className="font-extrabold text-sm uppercase tracking-wide text-slate-205">
                  Platform Admin System
                </h2>
              </div>
              <button 
                onClick={() => setIsAdminPanelOpen(false)}
                className="p-1.5 hover:bg-slate-900 rounded-full transition-all text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Alert / Notification banners */}
            {adminError && (
              <div className="my-3 p-3 bg-red-950/60 border border-red-900 rounded-xl text-red-200 text-xs font-medium">
                ⚠️ {adminError}
              </div>
            )}
            {adminSuccess && (
              <div className="my-3 p-3 bg-emerald-950/60 border border-emerald-900 rounded-xl text-emerald-200 text-xs font-semibold">
                🛡️ {adminSuccess}
              </div>
            )}

            {/* Core Drawer Content Blocks */}
            <div className="flex-grow overflow-y-auto py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">

              {/* CASE 1: Admin account not created yet (Single Claimable Slot) */}
              {!isAdminSlotCreated && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-blue-900/40 bg-blue-950/20 text-slate-300">
                    <div className="flex gap-2 items-center text-blue-400 font-bold text-xs mb-1">
                      <LockKeyhole className="h-4 w-4 text-blue-400" />
                      MASTER REGISTRATION SLOT: AVAILABLE [1 ONLY]
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      The Master Administrative account hasn't been initialized yet. This single slot allows registration of the primary owner profile. Once initialized, registration locks down forever.
                    </p>
                  </div>

                  <form onSubmit={handleAdminRegister} className="space-y-4 max-w-md bg-slate-900/50 p-5 rounded-2xl border border-slate-800/80">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Initialize Master Administrative Profile</h3>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">Full Name</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Faisal Abbas"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-white placeholder-slate-650"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">Admin Email Coordinate</label>
                      <input 
                        type="email"
                        required
                        placeholder="faisalabbaskhantaheem@gmail.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-white placeholder-slate-650"
                      />
                      <span className="text-[9px] text-slate-500 block leading-tight mt-0.5">Note: Verification limits enforce email to match platform credentials exactly.</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">Create Security Admin Password / PIN</label>
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-white placeholder-slate-650"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-98"
                    >
                      Initialize & Register Master Slot
                    </button>
                  </form>
                </div>
              )}

              {/* CASE 2: Account exists, but Admin is NOT active logged in */}
              {isAdminSlotCreated && !isAdminLoggedIn && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                    <div className="flex gap-2 items-center text-amber-500 font-bold text-xs mb-1">
                      <Lock className="h-4 w-4" />
                      SECURE LOCK: ADM SYSTEM CLAIMED
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      Administrative slots are locked down. Secondary profile creations are strictly blacklisted. Submit your master parameters to access the database writings controller.
                    </p>
                  </div>

                  <form onSubmit={handleAdminLogin} className="space-y-4 max-w-md bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Master Secure Identity verification</h3>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">Master Account Email</label>
                      <input 
                        type="email"
                        required
                        placeholder="faisalabbaskhantaheem@gmail.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-white placeholder-slate-650"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">Security PIN / Password</label>
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-white placeholder-slate-650"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-98"
                    >
                      Authenticate Admin Console
                    </button>
                  </form>
                </div>
              )}

              {/* CASE 3: Admin is logged in (Show Master Workspace Panel) */}
              {isAdminSlotCreated && isAdminLoggedIn && (
                <div className="space-y-6">
                  
                  {/* Master Info Strip */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-black text-blue-400 text-sm">
                        FA
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white">Faisal Abbas</h4>
                        <p className="text-[10px] text-slate-400 font-mono">faisalabbaskhantaheem@gmail.com</p>
                      </div>
                    </div>

                    <button 
                      onClick={handleAdminLogout}
                      className="px-3 py-1.5 bg-red-950 hover:bg-red-900 border border-red-900 text-red-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-all"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Lock Terminal
                    </button>
                  </div>

                  {/* Summary aggregate info statistics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
                      <span className="text-[10px] font-mono text-slate-450 uppercase block">Platform Writings</span>
                      <span className="text-xl font-black text-slate-100">{articles.length}</span>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
                      <span className="text-[10px] font-mono text-slate-455 uppercase block">Accumulated Reads</span>
                      <span className="text-xl font-black text-blue-450">{cumulativeViews}</span>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-1">
                      <span className="text-[10px] font-mono text-slate-455 uppercase block">Appreciations</span>
                      <span className="text-xl font-black text-emerald-450">{cumulativeLikes}</span>
                    </div>
                  </div>

                  {/* Core Content Area: View and moderate all writings on the platform */}
                  <div className="space-y-4">
                    
                    {/* Header box with search & filter bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/30 p-3 rounded-xl border border-slate-800">
                      <div className="relative flex-grow">
                        <input 
                          type="text" 
                          placeholder="Search writings by title, author, keyword..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs outline-none focus:border-indigo-600 text-white placeholder-slate-500"
                        />
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                      </div>

                      <div className="flex items-center gap-2">
                        <ListFilter className="h-4 w-4 text-slate-400" />
                        <select 
                          value={selectedCat} 
                          onChange={(e) => setSelectedCat(e.target.value)}
                          className="px-2 py-1.5 bg-slate-950 border border-slate-800 text-xs rounded-lg outline-none cursor-pointer text-slate-300 focus:indigo-600"
                        >
                          <option value="All">All Channels</option>
                          <option value="Technology">Technology</option>
                          <option value="Design">Design</option>
                          <option value="Startups">Startups</option>
                          <option value="Finance & Markets">Finance & Markets</option>
                        </select>
                      </div>
                    </div>

                    {/* Writings Interactive Catalog Box */}
                    <div className="space-y-3">
                      <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                        Platform Writings Directory ({filteredArticles.length})
                      </h3>

                      {filteredArticles.length === 0 ? (
                        <div className="p-8 text-center bg-slate-900/20 border border-slate-850 rounded-xl text-xs text-slate-400 font-medium">
                          No writings fit current search filter filters.
                        </div>
                      ) : (
                        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-850/60 space-y-2 pr-1">
                          {filteredArticles.map(art => (
                            <div 
                              key={art.id} 
                              className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/20 hover:bg-slate-900/40 transition-colors flex items-center justify-between gap-4 text-xs"
                            >
                              <div className="min-w-0 flex-grow space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded bg-blue-950/40 text-[9px] font-bold text-blue-400 border border-blue-900/30 uppercase">
                                    {art.category}
                                  </span>
                                  <span className="text-[10px] text-slate-450 font-mono">
                                    {art.publishDate}
                                  </span>
                                </div>
                                
                                <h4 className="font-extrabold text-white truncate text-xs leading-snug">
                                  {art.title}
                                </h4>

                                <div className="flex items-center gap-3 text-[10px] text-slate-400 flex-wrap">
                                  <span>Author: <strong className="text-slate-300 font-bold">{art.authorName}</strong></span>
                                  <span className="opacity-50">•</span>
                                  <span>{art.views || 0} reads</span>
                                  <span className="opacity-50">•</span>
                                  <span>{art.likes || 0} likes</span>
                                  <span className="opacity-50">•</span>
                                  <span className={`font-semibold uppercase tracking-widest text-[8px] ${art.status === 'published' ? 'text-emerald-400' : 'text-amber-500'}`}>
                                    {art.status}
                                  </span>
                                </div>
                              </div>

                              {/* Interactive admin console buttons */}
                              <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <button 
                                  onClick={() => inspectArticle(art)}
                                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-white rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 text-[10px] font-bold"
                                >
                                  <Eye className="h-3 w-3 text-blue-400" />
                                  View
                                </button>
                                <button 
                                  onClick={() => handleDeleteWriting(art.id, art.title)}
                                  className="p-1.5 bg-red-950/20 hover:bg-red-900/40 border border-red-900/30 hover:border-red-800 rounded-lg text-red-400 transition-all active:scale-95 cursor-pointer"
                                  title="Expel writing permanently"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* Footer lock note */}
            <div className="pt-4 border-t border-slate-900 text-center text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" /> Double encryption secure administrative connection. Port 3000.
            </div>

          </div>
        </div>
      )}

    </footer>
  );
};
