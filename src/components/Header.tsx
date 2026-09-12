import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { Sun, Moon, Search, Menu, X, User as UserIcon, BookOpen, LogOut, Layout, Edit, ShieldCheck, Heart, Bookmark } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchTrigger: () => void;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onSearchTrigger, setSearchQuery }) => {
  const { currentUser, logout, darkMode, toggleTheme, bookmarks } = useBlog();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'articles', label: 'Explore Posts' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact & FAQ' }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setSearchQuery(searchVal);
      setActiveTab('search');
    }
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 glass-panel shadow-sm border-b transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home')}>
            <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-blue-200 dark:shadow-none">
              JB
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                JB Blogging
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                EXPLORE & INSPIRE
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-semibold transition-colors relative py-1 ${
                  activeTab === item.id || (item.id === 'articles' && activeTab === 'category')
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400'
                }`}
              >
                {item.label}
                {(activeTab === item.id || (item.id === 'articles' && activeTab === 'category')) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Action Tools */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Minimal Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search articles, tags..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className={`pl-9 pr-3 py-1.5 rounded-full text-xs bg-slate-100 hover:bg-slate-200/80 focus:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:focus:bg-slate-900 border border-transparent focus:border-blue-400 dark:focus:border-blue-500 outline-none transition-all duration-300 text-slate-800 dark:text-slate-200 ${
                  searchFocused ? 'w-56' : 'w-44'
                }`}
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </form>

            {/* Dark Mode toggle */}
            <button
              id="theme-toggler"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Bookmarks Counter Badge */}
            {currentUser && bookmarks.length > 0 && (
              <button 
                onClick={() => handleNavClick('dashboard')}
                className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                title="Bookmarked articles"
              >
                <Bookmark className="h-4.5 w-4.5 text-blue-500 fill-blue-500" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {bookmarks.length}
                </span>
              </button>
            )}

            {/* Auth section */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  onBlur={() => setTimeout(() => setUserDropdownOpen(false), 200)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/20"
                  />
                  <div className="hidden lg:block pr-2">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
                      {currentUser.name}
                    </p>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Layout className="h-4 w-4" /> My Dashboard
                    </button>

                    {currentUser.role === 'admin' || currentUser.role === 'author' ? (
                      <button
                        onClick={() => { setActiveTab('dashboard'); /* dashboard tab handle inside will route to article editor */ }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" /> Create New Post
                      </button>
                    ) : null}

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => { handleNavClick('admin'); }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-slate-800/80 flex items-center gap-2"
                      >
                        <ShieldCheck className="h-4 w-4" /> Supabase Database Sync
                      </button>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                    
                    <button
                      onClick={() => { logout(); handleNavClick('home'); }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="header-login-btn"
                  onClick={() => handleNavClick('auth')}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600"
                >
                  Log In
                </button>
                <button
                  id="header-reg-btn"
                  onClick={() => { handleNavClick('auth'); }}
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm transition-all shadow-blue-100 hover:shadow-md"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Right Bar controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => handleNavClick('search')}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t py-4 px-4 bg-white dark:bg-slate-900 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col space-y-3 mb-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2 rounded-xl text-sm font-semibold ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="border-t pt-4">
            {currentUser ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-3">
                  <img src={currentUser.avatar} alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{currentUser.name}</h4>
                    <p className="text-xs text-slate-500 capitalize">{currentUser.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full text-center py-2.5 rounded-xl border font-bold text-xs text-slate-700 dark:text-slate-300"
                >
                  My Dashboard
                </button>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="w-full text-center py-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 font-bold text-xs"
                  >
                    Supabase Database Sync
                  </button>
                )}
                <button
                  onClick={() => { logout(); handleNavClick('home'); }}
                  className="w-full py-2.5 text-center text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/10 rounded-xl"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-2">
                <button
                  onClick={() => handleNavClick('auth')}
                  className="w-full py-2.5 text-center rounded-xl border text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick('auth')}
                  className="w-full py-2.5 text-center rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
