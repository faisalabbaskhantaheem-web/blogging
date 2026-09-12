import React, { useState, useEffect } from 'react';
import { useBlog, BlogProvider } from './context/BlogContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SidebarWidgets } from './components/SidebarWidgets';
import { Testimonials } from './components/Testimonials';
import { GoogleMapsWidget } from './components/GoogleMapsWidget';
import { BlogEditor } from './components/BlogEditor';
import { Article, User, Comment, Category, Subscriber } from './types';
import { 
  Heart, Bookmark, MessageSquare, Share2, Eye, Calendar, Clock, 
  ChevronRight, ArrowRight, CornerDownRight, Tag, Filter, Grid, 
  List, SlidersHorizontal, BookOpen, AlertCircle, Sparkles, Send,
  User as UserIcon, LayoutDashboard, PlusCircle, ShieldAlert, CheckCircle,
  FileText, Activity, Users, Settings, Trash, Folder, Trash2, Ban, ShieldCheck, MailOpen,
  Database, RefreshCw, Upload
} from 'lucide-react';

function AppContent() {
  const {
    currentUser,
    users,
    articles,
    comments,
    categories,
    subscribers,
    history,
    bookmarks,
    trafficStats,
    
    login,
    register,
    logout,
    requestPasswordReset,
    verifyEmailCode,
    
    addArticle,
    updateArticle,
    deleteArticle,
    likeArticle,
    reactToArticle,
    viewArticle,
    toggleBookmark,
    addToHistory,
    
    addComment,
    moderateComment,
    
    updateUserProfile,
    manageUser,
    toggleFollowAuthor,
    subscribeNewsletter
  } = useBlog();

  // Navigation / Tabs state
  const [activeTab, setActiveTab] = useState<string>('home'); // 'home' | 'articles' | 'single-article' | 'author' | 'category' | 'search' | 'about' | 'contact' | 'auth' | 'dashboard' | 'admin'
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('Technology');
  
  // Search parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilterType, setSearchFilterType] = useState<'all' | 'title' | 'tags' | 'author'>('all');

  // Filter and Listing parameters
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [tagFilter, setTagFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('latest'); // 'latest' | 'views' | 'likes'
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [articlePage, setArticlePage] = useState(1);
  const itemsPerPage = 6;

  // Single Article TOC
  const [tocActiveBlock, setTocActiveBlock] = useState<number | null>(null);

  // Single Comment input state
  const [commentContent, setCommentContent] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [commentFeedback, setCommentFeedback] = useState('');

  // Authentication Panel sub-states
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'verify'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState<'reader' | 'author'>('reader');
  const [authPassword, setAuthPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [verifyCode, setVerifyCode] = useState('');

  // Dashboard / Editor States
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showEditorForm, setShowEditorForm] = useState(false);
  const [dashboardSubTab, setDashboardSubTab] = useState<'overview' | 'posts' | 'analytics' | 'settings'>('overview');

  // Contact form submission
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState('');

  const [faqExpanded, setFaqExpanded] = useState<number | null>(null);

  // Auto-fill active article on view
  const handleArticleView = (art: Article) => {
    setSelectedArticle(art);
    viewArticle(art.id);
    addToHistory(art.id);
    setActiveTab('single-article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Click on author routes
  const handleAuthorView = (userId: string) => {
    setSelectedAuthorId(userId);
    setActiveTab('author');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Click on category badge
  const handleCategoryView = (catName: string) => {
    setSelectedCategoryName(catName);
    setCategoryFilter(catName);
    setActiveTab('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save successfully
  const handleSaveArticleSuccess = () => {
    setShowEditorForm(false);
    setEditingArticle(null);
    setDashboardSubTab('posts');
    setAuthSuccess('Article successfully compiled and persisted!');
    setTimeout(() => setAuthSuccess(''), 4000);
  };

  // Handle local image file uploads and convert to schema-compliant base64 data URL
  const handleLocalImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onUploaded: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Please select an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onUploaded(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Complete email newsletter subscription form on home
  const [homeNewsletterEmail, setHomeNewsletterEmail] = useState('');
  const [homeNewsletterMsg, setHomeNewsletterMsg] = useState('');

  const handleHomeNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeNewsletterEmail) return;
    try {
      const msg = await subscribeNewsletter(homeNewsletterEmail);
      setHomeNewsletterMsg(msg);
      setHomeNewsletterEmail('');
    } catch (err: any) {
      setHomeNewsletterMsg(err.message || 'Subscription failed.');
    }
  };

  // Submit Contact Form
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess("Message sent successfully! Our administrative team will review your ticket within 2 hours.");
    setContactName('');
    setContactEmail('');
    setContactMsg('');
    setTimeout(() => setContactSuccess(''), 6000);
  };

  // Comment Creation
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    if (!selectedArticle) return;

    if (!currentUser && (!guestName.trim() || !guestEmail.trim())) {
      setCommentFeedback("Please provide your name and email to post a comment as guest.");
      return;
    }

    addComment(selectedArticle.id, commentContent.trim(), guestName, guestEmail);
    setCommentContent('');
    setGuestName('');
    setGuestEmail('');
    setCommentFeedback(currentUser ? "Comment published!" : "Comment submitted and pending administrative moderation!");
    setTimeout(() => setCommentFeedback(''), 4000);
  };

  // Authentication Handles
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    try {
      if (authMode === 'login') {
        const u = await login(authEmail, rememberMe);
        setAuthSuccess(`Welcome back, ${u.name}! Logging you in...`);
        setTimeout(() => {
          setAuthSuccess('');
          setActiveTab('home');
        }, 1200);
      } else if (authMode === 'register') {
        const u = await register(authName, authEmail, authRole);
        setAuthSuccess(`Account created for ${u.name}! Redirecting to verify your email...`);
        setTimeout(() => {
          setAuthMode('verify');
        }, 1500);
      } else if (authMode === 'forgot') {
        const msg = await requestPasswordReset(authEmail);
        setAuthSuccess(msg);
        setTimeout(() => {
          setAuthMode('verify');
        }, 1800);
      } else if (authMode === 'verify') {
        const valid = await verifyEmailCode(authEmail, verifyCode);
        if (valid) {
          setAuthSuccess("Email verification successful! Welcome to JB Blogging!");
          setTimeout(() => {
            setActiveTab('home');
          }, 1200);
        } else {
          setAuthError("Incorrect verification code. Please try using 123456.");
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication operation failed.');
    }
  };

  const listAllTags = () => {
    const all: string[] = [];
    articles.forEach(a => {
      a.tags.forEach(t => {
        if (!all.includes(t)) all.push(t);
      });
    });
    return all;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-[#0b0f19] dark:text-slate-100 selection:bg-blue-500 selection:text-white transition-all duration-300">
      
      {/* Header element */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSearchTrigger={() => setActiveTab('search')}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container Wrapper */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TOP LEVEL GLOBAL ALERTS */}
        {authSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-medium text-xs flex items-center gap-2 border border-emerald-200 dark:border-emerald-900/30 shadow-md">
            <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
            <span>{authSuccess}</span>
          </div>
        )}

        {/* ========================================================
            TAB 1: HOME PAGE
            ======================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            
            {/* HERO SECTION - GORGEOUS GRID BANNER */}
            <section className="relative overflow-hidden rounded-3xl glass-panel text-slate-800 dark:text-slate-100 py-12 px-6 sm:px-12 lg:px-16 border border-white/40 dark:border-slate-800/80 shadow-xl">
              {/* background atmospheric gradient visual decoration */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-full blur-3xl opacity-20 transform translate-x-20 -translate-y-20 select-none pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-500 to-pink-600 rounded-full blur-3xl opacity-10 transform -translate-x-20 translate-y-20 select-none pointer-events-none" />
              
              <div className="max-w-3xl relative z-10 space-y-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/15 border border-blue-500/25 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full tracking-widest uppercase">
                  <Sparkles className="h-3 w-3 animate-pulse" /> THE VOICE OF KNOWLEDGE IN 2026
                </span>
                
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-none text-slate-900 dark:text-white max-w-xl">
                  Discover Ideas, Share Knowledge, Inspire the World
                </h1>
                
                <p className="text-slate-650 dark:text-slate-300 text-xs sm:text-sm max-w-lg leading-relaxed font-light">
                  A modern, premium hub designed to explore cutting-edge engineering guidelines, venture startup playbooks, artificial intelligence developments, and professional design frameworks.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('articles')}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold font-mono tracking-wider flex items-center gap-2 shadow-sm relative overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Explore Articles <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (currentUser) {
                        setActiveTab('dashboard');
                      } else {
                        setActiveTab('auth');
                        setAuthMode('register');
                      }
                    }}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-805 text-white dark:text-slate-300 font-bold text-xs rounded-full border border-transparent hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    Join as Creator
                  </button>
                </div>
              </div>
            </section>

            {/* CHANNEL GRID / CATEGORIES */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-800 dark:text-white">Popular Topic Channels</h2>
                  <p className="text-xs text-slate-400">Join discussions led by expert staff panel members.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('articles')} 
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                >
                  View All Channels <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleCategoryView(cat.name)}
                    className="relative overflow-hidden group cursor-pointer rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-sm text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500/20"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
                    <div className="h-10 w-10 mx-auto rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm mb-3">
                      #
                    </div>
                    <h3 className="text-xs font-black text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{cat.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* HERO ARTICLE DISPLAY + SIDEBAR WIDGETS SECTION */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Top Articles Feed */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest">
                    Featured Masterclass Writing
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">2026 EDITION</span>
                </div>

                {/* Main large featured article banner */}
                {articles.filter(a => a.status === 'published').slice(0, 1).map((topArt) => (
                  <div 
                    key={topArt.id} 
                    onClick={() => handleArticleView(topArt)}
                    className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={topArt.coverImage} 
                        alt={topArt.title} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      <span className="absolute top-4 left-4 bg-blue-600 text-white font-extrabold text-[10px] uppercase py-1 px-2.5 rounded-full shadow-sm">
                        {topArt.category}
                      </span>
                    </div>
                    <div className="p-6 space-y-3.5">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <img src={topArt.authorAvatar} alt="Author" className="h-6 w-6 rounded-full object-cover" />
                          <span className="font-bold text-slate-700 dark:text-slate-300">{topArt.authorName}</span>
                        </div>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 shrink-0" /> {topArt.publishDate}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 shrink-0" /> {topArt.readingTime}</span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">
                        {topArt.title}
                      </h2>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light line-clamp-2">
                        {topArt.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1"><Eye className="h-4 w-4 text-slate-400" /> {topArt.views} reads</span>
                          <span className="flex items-center gap-1"><Heart className="h-4 w-4 text-pink-400 fill-pink-400/10" /> {topArt.likes} likes</span>
                          <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4 text-blue-400" /> {topArt.commentsCount} comments</span>
                        </div>
                        <span className="text-blue-600 dark:text-blue-400 font-extrabold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Read deep dive <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Sub features grid layout (items 2 and 3) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {articles.filter(a => a.status === 'published').slice(1, 3).map((art) => (
                    <div 
                      key={art.id}
                      onClick={() => handleArticleView(art)}
                      className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="aspect-video relative rounded-xl overflow-hidden mb-3">
                        <img src={art.coverImage} alt={art.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white font-extrabold text-[9px] uppercase py-0.5 px-2 rounded-full">
                          {art.category}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span className="font-semibold">{art.authorName}</span>
                          <span>•</span>
                          <span>{art.readingTime}</span>
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                          {art.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{art.excerpt}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Right Column: Widgets */}
              <div className="lg:col-span-4 select-none">
                <SidebarWidgets 
                  onArticleClick={handleArticleView}
                  onCategoryClick={handleCategoryView}
                  onAuthorClick={handleAuthorView}
                />
              </div>

            </section>

            {/* TESTIMONIALS SLIDER PANEL */}
            <Testimonials />

            {/* LOWER ADVERTISING NEWSLETTER GRID */}
            <section className="bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-purple-500/10 border border-blue-500/10 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 dark:from-slate-900 dark:to-slate-950">
              <div className="max-w-md">
                <h3 className="text-lg font-black text-slate-800 dark:text-white">Enjoying regular deep dives?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Get high-fidelity monthly guides on web algorithms, compiler guidelines, design typography directly in your inbox.
                </p>
              </div>

              <div>
                <form onSubmit={handleHomeNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="creator@design.io"
                    value={homeNewsletterEmail}
                    onChange={(e) => setHomeNewsletterEmail(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 outline-none w-52 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button type="submit" className="px-5 py-2 rounded-xl text-xs bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all">
                    Pledge Subscribe
                  </button>
                </form>
                {homeNewsletterMsg && (
                  <p className="text-[10px] mt-1.5 font-bold text-emerald-600 dark:text-emerald-450">{homeNewsletterMsg}</p>
                )}
              </div>
            </section>

          </div>
        )}

        {/* ========================================================
            TAB 2: BLOG LISTING PAGE (EXPLORE CHANNELS)
            ======================================================== */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-500" />
                Explore Articles
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Browse our collection of highly formatted writing, complete with code compilations, quotes, and visual graphics.
              </p>
            </div>

            {/* Filter Bar Controls */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                
                {/* Search query focus */}
                <div className="flex items-center gap-2 flex-grow max-w-sm">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="In-page fast filter..."
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent focus:border-blue-500 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>

                {/* Sorter selectors */}
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Filter className="h-4 w-4" /> Category:
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
                    >
                      <option value="All">All Categories</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5" /> Sort:
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
                    >
                      <option value="latest">Latest</option>
                      <option value="views">Most Viewed</option>
                      <option value="likes">Most Liked</option>
                    </select>
                  </div>

                  {/* layout toggler */}
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setLayoutMode('grid')}
                      className={`p-1.5 ${layoutMode === 'grid' ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setLayoutMode('list')}
                      className={`p-1.5 ${layoutMode === 'list' ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Articles feed list */}
            {(() => {
              // Filtering algorithm
              let filtered = articles
                .filter(a => a.status === 'published')
                .filter(a => {
                  if (categoryFilter !== 'All' && a.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
                  if (searchQuery.trim() && !a.title.toLowerCase().includes(searchQuery.toLowerCase()) && !a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                  return true;
                });

              // Sorting algorithm
              if (sortBy === 'views') {
                filtered.sort((a, b) => b.views - a.views);
              } else if (sortBy === 'likes') {
                filtered.sort((a, b) => b.likes - a.likes);
              } else {
                filtered.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
              }

              if (filtered.length === 0) {
                return (
                  <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-3 animate-bounce" />
                    <h3 className="text-base font-bold text-slate-850 dark:text-slate-150">No items found matching criteria</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Try resetting category filters or search parameters to discover other amazing published pieces.</p>
                  </div>
                );
              }

              return (
                <div className={layoutMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-4'}>
                  {filtered.map(art => (
                    <div
                      key={art.id}
                      onClick={() => handleArticleView(art)}
                      className={`group cursor-pointer bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 transition-all duration-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md ${
                        layoutMode === 'list' ? 'flex flex-col sm:flex-row p-4 gap-4' : 'flex flex-col justify-between'
                      }`}
                    >
                      
                      {/* Image section */}
                      <div className={layoutMode === 'list' ? 'w-full sm:w-56 shrink-0 aspect-video sm:aspect-auto h-36 rounded-xl overflow-hidden relative' : 'aspect-video relative overflow-hidden'}>
                        <img src={art.coverImage} alt={art.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                        <span className="absolute top-3 left-3 bg-blue-600 text-white font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-full">
                          {art.category}
                        </span>
                      </div>

                      {/* Content panel */}
                      <div className="p-4 flex flex-col justify-between flex-grow space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                            <span>{art.publishDate}</span>
                            <span>•</span>
                            <span>{art.readingTime}</span>
                          </div>
                          <h3 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                            {art.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{art.excerpt}</p>
                        </div>

                        {/* Author info footer */}
                        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-50 dark:border-slate-800">
                          <div className="flex items-center gap-1.5">
                            <img src={art.authorAvatar} alt="author" className="h-5 w-5 rounded-full object-cover" />
                            <span className="font-semibold text-slate-600 dark:text-slate-300">{art.authorName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2.5 text-[10px]">
                            <span className="flex items-center gap-0.5"><Eye className="h-3.5 w-3.5 text-slate-400" /> {art.views}</span>
                            <span className="flex items-center gap-0.5"><Heart className="h-3.5 w-3.5 text-pink-400" /> {art.likes}</span>
                          </div>
                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              );
            })()}

          </div>
        )}

        {/* ========================================================
            TAB 3: SINGLE BLOG DETAIL VIEW
            ======================================================== */}
        {activeTab === 'single-article' && selectedArticle && (
          <div className="space-y-6">
            
            {/* Breadcrumb strip */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
              <span className="hover:text-blue-500 cursor-pointer" onClick={() => setActiveTab('home')}>Home</span>
              <ChevronRight className="h-3 w-3" />
              <span className="hover:text-blue-500 cursor-pointer" onClick={() => setActiveTab('articles')}>Articles</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-600 dark:text-slate-300 truncate max-w-xs">{selectedArticle.title}</span>
            </div>

            {/* Floating interaction utilities sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
              
              {/* Left TOC / Reactions Sidebar (Stays sticky on desktop) */}
              <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-6 select-none bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                
                {/* Table of Contents */}
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">Chapter Outlines</h4>
                  <ul className="space-y-2 text-xs">
                    {selectedArticle.contentBlocks
                      .filter(b => b.type === 'heading1' || b.type === 'heading2')
                      .map((h, i) => (
                        <li 
                          key={i} 
                          onClick={() => setTocActiveBlock(i)}
                          className={`flex items-start gap-1 cursor-pointer transition-colors ${
                            tocActiveBlock === i 
                              ? 'text-blue-600 dark:text-blue-400 font-bold' 
                              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                          }`}
                        >
                          <CornerDownRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" />
                          <span className="line-clamp-1">{h.value}</span>
                        </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Engage Articles</h4>
                  
                  {/* Floating Action counters */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <button
                      onClick={() => likeArticle(selectedArticle.id)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                        currentUser && selectedArticle.likedBy.includes(currentUser.id)
                          ? 'border-pink-200 bg-pink-50 text-pink-600 dark:bg-pink-950/20'
                          : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-650'
                      }`}
                    >
                      <Heart className="h-4 w-4 fill-pink-500/10 text-pink-500" />
                      <span>{selectedArticle.likes}</span>
                    </button>

                    <button
                      onClick={() => toggleBookmark(selectedArticle.id)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                        currentUser && bookmarks.includes(selectedArticle.id)
                          ? 'border-blue-250 bg-blue-50 text-blue-600 dark:bg-blue-950/20'
                          : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-650'
                      }`}
                    >
                      <Bookmark className="h-4 w-4 text-blue-500" />
                      <span>Bookmark</span>
                    </button>
                  </div>
                </div>

                {/* Micro Reactions picker tool */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Reactions</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button onClick={() => reactToArticle(selectedArticle.id, 'heart')} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1">
                      ❤️ <span className="font-mono text-[9px] font-bold">{selectedArticle.reactions?.heart || 0}</span>
                    </button>
                    <button onClick={() => reactToArticle(selectedArticle.id, 'fire')} className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1">
                      🔥 <span className="font-mono text-[9px] font-bold">{selectedArticle.reactions?.fire || 0}</span>
                    </button>
                    <button onClick={() => reactToArticle(selectedArticle.id, 'brain')} className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1">
                      🧠 <span className="font-mono text-[9px] font-bold">{selectedArticle.reactions?.brain || 0}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Middle Primary Reading Column */}
              <div className="lg:col-span-9 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-150/40 dark:border-slate-800/80 shadow-sm space-y-6">
                
                {/* Channel & Metadata header */}
                <div className="flex flex-wrap items-center gap-3">
                  <span onClick={() => handleCategoryView(selectedArticle.category)} className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-full tracking-wider cursor-pointer">
                    {selectedArticle.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{selectedArticle.readingTime}</span>
                    <span>•</span>
                    <span>{selectedArticle.views} reads</span>
                  </div>
                </div>

                {/* Primary Title */}
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-850 dark:text-white leading-tight">
                  {selectedArticle.title}
                </h1>

                {/* Excerpt Summary bar */}
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic border-l-4 border-blue-500 pl-4 py-1">
                  "{selectedArticle.excerpt}"
                </p>

                {/* Writer details */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 select-none">
                  <div 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => handleAuthorView(selectedArticle.authorId)}
                  >
                    <img src={selectedArticle.authorAvatar} alt="Author" className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500/10 group-hover:scale-103" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">{selectedArticle.authorName}</h4>
                      <p className="text-[10px] text-slate-400">Published on {selectedArticle.publishDate}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleFollowAuthor(selectedArticle.authorId)}
                    className="px-3 py-1.5 rounded-full text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    Follow
                  </button>
                </div>

                {/* Banner illustration */}
                <img src={selectedArticle.coverImage} alt="Banner" className="w-full aspect-video sm:aspect-[21/9] object-cover rounded-2xl" />

                {/* Article blocks compilation render */}
                <article className="prose dark:prose-invert max-w-none pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-5">
                  {selectedArticle.contentBlocks && selectedArticle.contentBlocks.length > 0 ? (
                    selectedArticle.contentBlocks.map((block, idx) => (
                      <div key={idx} className="animate-in fade-in duration-300">
                        {block.type === 'paragraph' && (
                          <p className="whitespace-pre-wrap">{block.value}</p>
                        )}

                        {block.type === 'heading1' && (
                          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mt-8 mb-3 border-b pb-1">
                            {block.value}
                          </h2>
                        )}

                        {block.type === 'heading2' && (
                          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mt-6 mb-2">
                            {block.value}
                          </h3>
                        )}

                        {block.type === 'quote' && (
                          <blockquote className="my-6 p-5 border-l-4 border-blue-600 bg-slate-50 dark:bg-slate-800 rounded-r-2xl italic font-semibold text-slate-600 dark:text-slate-300">
                            "{block.value}"
                          </blockquote>
                        )}

                        {block.type === 'code' && (
                          <div className="bg-slate-900 border dark:border-slate-800/80 rounded-2xl overflow-hidden p-4 font-mono text-xs text-emerald-400 text-left relative my-4">
                            <span className="absolute right-4 top-2 text-[9px] text-slate-500 uppercase font-bold">
                              {block.extra || 'code'}
                            </span>
                            <pre className="overflow-x-auto">{block.value}</pre>
                          </div>
                        )}

                        {block.type === 'image' && (
                          <div className="my-6">
                            <img src={block.value} alt="Article supplement" className="w-full rounded-xl object-cover max-h-80" />
                            {block.extra && <p className="text-[10px] text-slate-400 text-center mt-1.5">{block.extra}</p>}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="whitespace-pre-wrap">{selectedArticle.content}</p>
                  )}
                </article>

                {/* Tags array */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {selectedArticle.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 bg-slate-105 rounded-lg text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* SOCIAL SHARING INTEGRATION MOCK */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/20 border flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs font-bold text-slate-500">Inspire your colleagues and developers?</span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                    <button onClick={() => alert("Copied private sharing link to clipboard!")} className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1">
                      <Share2 className="h-3.5 w-3.5" /> Copy Link
                    </button>
                    <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedArticle.title)}`, '_blank')} className="px-3 py-1.5 hover:bg-blue-50/50 text-blue-500 rounded-lg">
                      Twitter Share
                    </button>
                  </div>
                </div>

                {/* COMMENTS SECTION PANEL */}
                <section className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
                      Comments Thread ({comments.filter(c => c.articleId === selectedArticle.id && c.approved).length})
                    </h3>
                  </div>

                  {/* Comment trigger status feedback */}
                  {commentFeedback && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                      {commentFeedback}
                    </div>
                  )}

                  {/* Comment compilation listing */}
                  <div className="space-y-4">
                    {comments
                      .filter(c => c.articleId === selectedArticle.id && c.approved)
                      .map((comm) => (
                        <div key={comm.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex gap-3 text-xs">
                          <img src={comm.authorAvatar} alt="Commenter" className="h-8 w-8 rounded-full object-cover shrink-0" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-slate-800 dark:text-white">{comm.authorName}</h4>
                              <span className="text-[10px] text-slate-400">{comm.date}</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-350 leading-relaxed">{comm.content}</p>
                          </div>
                        </div>
                    ))}

                    {comments.filter(c => c.articleId === selectedArticle.id && c.approved).length === 0 && (
                      <p className="text-xs text-slate-400 italic">No approved comments posted yet. Spark the discussion below!</p>
                    )}
                  </div>

                  {/* Add content comment box Form */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/50 p-4 sm:p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold text-slate-755">Add Your Feedback</h4>
                    <form onSubmit={handleCommentSubmit} className="space-y-3.5">
                      
                      {!currentUser && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            required
                            placeholder="Your name"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full px-3 py-2 border bg-white dark:bg-slate-800 text-xs rounded-xl outline-none"
                          />
                          <input
                            type="email"
                            required
                            placeholder="Your professional email"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            className="w-full px-3 py-2 border bg-white dark:bg-slate-800 text-xs rounded-xl outline-none"
                          />
                        </div>
                      )}

                      <textarea
                        required
                        rows={3}
                        placeholder={currentUser ? "Write a helpful, constructive comment..." : "Share your analytical thoughts on this guide..."}
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="w-full p-4 bg-white dark:bg-slate-800 border rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500"
                      />

                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm"
                      >
                        Submit Review Comment
                      </button>
                    </form>
                  </div>

                </section>

                {/* Related posts suggestions list */}
                <section className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Recommended Readings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {articles
                      .filter(a => a.category === selectedArticle.category && a.id !== selectedArticle.id && a.status === 'published')
                      .slice(0, 2)
                      .map((art) => (
                        <div 
                          key={art.id}
                          onClick={() => handleArticleView(art)}
                          className="p-4 rounded-xl border hover:border-blue-500 cursor-pointer bg-slate-50/50 hover:bg-white dark:bg-slate-850 flex gap-3 text-xs transition-all"
                        >
                          <img src={art.coverImage} alt="Cover" className="h-16 w-16 object-cover rounded-lg shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[9px] font-bold text-blue-500 uppercase">{art.category}</span>
                            <h4 className="font-extrabold text-slate-800 dark:text-white truncate mt-0.5">{art.title}</h4>
                            <p className="text-[10px] text-slate-400 truncate-2 line-clamp-1">{art.excerpt}</p>
                          </div>
                        </div>
                    ))}
                  </div>
                </section>

              </div>

            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: SEARCH PAGE WITH ADVANCED SUGGESTIONS
            ======================================================== */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white">Search JB Blogging Archives</h1>
              <p className="text-xs text-slate-400 mt-1">Refine and look for exact topics, code snippets, or creator stats.</p>
            </div>

            {/* Advanced search parameters cards */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter keywords (e.g. React 19, CSS theme variables...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-medium border border-transparent focus:border-blue-500 outline-none flex-grow"
                />
                
                <select
                  value={searchFilterType}
                  onChange={(e) => setSearchFilterType(e.target.value as any)}
                  className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-705 outline-none border border-transparent"
                >
                  <option value="all">Search All Content</option>
                  <option value="title">Search Title Only</option>
                  <option value="tags">Search Tags Only</option>
                </select>
              </div>

              {/* Suggestions keywords triggers */}
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">Recommended Topics:</p>
                <div className="flex flex-wrap gap-1.5">
                  {['React19', 'GenerativeAI', 'Vite', 'Startups', 'TailwindCSS', 'TypeScript'].map(sc => (
                    <button
                      key={sc}
                      onClick={() => { setSearchQuery(sc); setSearchFilterType('all'); }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-md text-[10px] font-mono font-medium text-slate-600 dark:text-slate-350"
                    >
                      #{sc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results feed list block */}
            <div className="space-y-4">
              {(() => {
                const results = articles
                  .filter(a => a.status === 'published')
                  .filter(a => {
                    const normQuery = searchQuery.toLowerCase().trim();
                    if (!normQuery) return true;

                    if (searchFilterType === 'title') {
                      return a.title.toLowerCase().includes(normQuery);
                    } else if (searchFilterType === 'tags') {
                      return a.tags.some(t => t.toLowerCase().includes(normQuery));
                    }
                    return (
                      a.title.toLowerCase().includes(normQuery) || 
                      a.excerpt.toLowerCase().includes(normQuery) ||
                      a.tags.some(t => t.toLowerCase().includes(normQuery)) ||
                      a.authorName.toLowerCase().includes(normQuery)
                    );
                  });

                if (results.length === 0) {
                  return (
                    <div className="p-12 text-center bg-white dark:bg-slate-900 border rounded-3xl">
                      <p className="text-xs text-slate-400 italic">No articles match your query. Try searching another term.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.map(art => (
                      <div 
                        key={art.id}
                        onClick={() => handleArticleView(art)}
                        className="p-4 bg-white dark:bg-slate-900 border rounded-2xl flex gap-4 cursor-pointer hover:border-blue-500 transition-all shadow-sm"
                      >
                        <img src={art.coverImage} alt="Cover" className="h-20 w-20 shrink-0 object-cover rounded-xl" />
                        <div className="min-w-0 flex flex-col justify-between">
                          <div>
                            <span className="text-[8px] font-extrabold uppercase bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{art.category}</span>
                            <h3 className="font-extrabold text-xs sm:text-sm text-slate-850 dark:text-white truncate mt-1">{art.title}</h3>
                            <p className="text-[11px] text-slate-400 truncate line-clamp-1">{art.excerpt}</p>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                            <span>By {art.authorName}</span>
                            <span>•</span>
                            <span>{art.publishDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 5: CATEGORY / CHANNEL LEVEL SHOWCASE
            ======================================================== */}
        {activeTab === 'category' && (
          <div className="space-y-6">
            
            {/* Category header frame */}
            {categories.filter(c => c.name.toLowerCase() === selectedCategoryName.toLowerCase()).map(cat => (
              <div 
                key={cat.id}
                className="relative p-6 sm:p-10 rounded-3xl text-white overflow-hidden bg-slate-900"
              >
                {/* Visual cover image back */}
                <div className="absolute inset-0 bg-cover bg-center brightness-35 select-none pointer-events-none" style={{ backgroundImage: `url(${cat.image})` }} />
                
                <div className="relative z-10 max-w-xl space-y-2">
                  <span className="px-2 py-0.5 bg-blue-500 text-white font-extrabold text-[9px] rounded uppercase tracking-wider">ACTIVE CHANNEL</span>
                  <h1 className="text-2xl sm:text-4xl font-black">{cat.name} Category</h1>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">{cat.description}</p>
                </div>
              </div>
            ))}

            {/* Category sorting/search tools */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-slate-450">Active Posts under Selection: <span className="font-bold text-blue-500">{articles.filter(a => a.category.toLowerCase() === selectedCategoryName.toLowerCase() && a.status === 'published').length}</span></span>
              
              <button 
                onClick={() => setActiveTab('articles')}
                className="px-4 py-1.5 rounded-lg border text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Back to Grid View
              </button>
            </div>

            {/* Articles under category feed */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles
                .filter(a => a.category.toLowerCase() === selectedCategoryName.toLowerCase() && a.status === 'published')
                .map(art => (
                  <div
                    key={art.id}
                    onClick={() => handleArticleView(art)}
                    className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-video relative rounded-xl overflow-hidden mb-3">
                      <img src={art.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[8px] font-extrabold uppercase bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{art.category}</span>
                      <h3 className="font-bold text-xs text-slate-800 dark:text-white mt-1 group-hover:text-blue-500 truncate-2 line-clamp-2">{art.title}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{art.excerpt}</p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-3 border-t mt-3">
                      <span>By {art.authorName}</span>
                      <span>{art.readingTime}</span>
                    </div>
                  </div>
              ))}

              {articles.filter(a => a.category.toLowerCase() === selectedCategoryName.toLowerCase() && a.status === 'published').length === 0 && (
                <div className="col-span-3 p-12 text-center bg-white dark:bg-slate-900 border rounded-2xl">
                  <p className="text-xs text-slate-400 italic">No posts compiled under this channel yet. Contact as contributor to start writing!</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 6: AUTHOR SPECIFIC PROFILE PAGE
            ======================================================== */}
        {activeTab === 'author' && selectedAuthorId && (
          <div className="space-y-6">
            
            {/* Find Author detail info */}
            {users.filter(u => u.id === selectedAuthorId).map(author => {
              const isFollowing = currentUser ? author.followers.includes(currentUser.id) : false;
              const authorPosts = articles.filter(a => a.authorId === author.id && a.status === 'published');
              
              return (
                <div key={author.id} className="space-y-6">
                  
                  {/* Visual cover card */}
                  <div className="relative h-44 rounded-3xl bg-slate-800 overflow-hidden select-none">
                    <img 
                      src={author.coverImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop&q=80'} 
                      alt="Cover" 
                      className="w-full h-full object-cover opacity-60"
                    />
                  </div>

                  {/* Profile Detail header info */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm relative -mt-16 mx-4 relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                      
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                        <img 
                          src={author.avatar} 
                          alt="Avatar" 
                          className="h-24 w-24 rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-md bg-white shrink-0" 
                        />
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-extrabold text-[9px] rounded uppercase tracking-wider">{author.role}</span>
                          <h1 className="text-xl sm:text-2xl font-black text-slate-850 dark:text-white leading-none mt-1">{author.name}</h1>
                          <p className="text-xs text-slate-400 font-medium">Joined Platform on {author.joinedDate}</p>
                        </div>
                      </div>

                      {/* Follow stats triggers */}
                      <div className="flex items-center gap-3">
                        <div className="text-center bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl text-xs">
                          <span className="block font-black text-slate-800 dark:text-white font-mono">{author.followersCount}</span>
                          <span className="text-[10px] text-slate-400">Readers Following</span>
                        </div>

                        {currentUser && currentUser.id !== author.id ? (
                          <button
                            onClick={() => toggleFollowAuthor(author.id)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                              isFollowing 
                                ? 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {isFollowing ? 'unfollow' : 'Follow Creator'}
                          </button>
                        ) : null}
                      </div>

                    </div>

                    {/* Bio metadata */}
                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">About the Author</h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-light">{author.bio}</p>
                      
                      {/* Social link links handles */}
                      {author.socialLinks && Object.keys(author.socialLinks).length > 0 && (
                        <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 font-mono">
                          {author.socialLinks.twitter && <span>Twitter: @{author.socialLinks.twitter}</span>}
                          {author.socialLinks.github && <span>GitHub: @{author.socialLinks.github}</span>}
                          {author.socialLinks.website && <span className="text-blue-500">Website: {author.socialLinks.website}</span>}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Listings of published works */}
                  <div className="space-y-4">
                    <h2 className="text-base font-extrabold text-slate-800 dark:text-white border-b pb-2">Published Masterworks ({authorPosts.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {authorPosts.map(art => (
                        <div 
                          key={art.id}
                          onClick={() => handleArticleView(art)}
                          className="p-4 bg-white dark:bg-slate-900 border rounded-2xl flex gap-4 cursor-pointer hover:border-blue-500 transition-all shadow-sm"
                        >
                          <img src={art.coverImage} alt="Cover" className="h-20 w-20 shrink-0 object-cover rounded-xl" />
                          <div className="min-w-0 flex flex-col justify-between">
                            <div>
                              <span className="text-[8px] font-extrabold uppercase bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{art.category}</span>
                              <h3 className="font-extrabold text-xs sm:text-sm text-slate-850 dark:text-white truncate mt-1 leading-tight">{art.title}</h3>
                              <p className="text-[11px] text-slate-400 truncate line-clamp-1">{art.excerpt}</p>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                              <span>{art.readingTime}</span>
                              <span>•</span>
                              <span>{art.publishDate}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {authorPosts.length === 0 && (
                        <p className="text-xs text-slate-400 italic">No published articles authored by this account yet.</p>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}

          </div>
        )}

        {/* ========================================================
            TAB 7: ABOUT PAGE
            ======================================================== */}
        {activeTab === 'about' && (
          <div className="space-y-12">
            
            {/* Header philosophy */}
            <section className="text-center max-w-2xl mx-auto space-y-4">
              <span className="px-2.5 py-1 text-[9px] font-extrabold text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/10 rounded-full tracking-wider uppercase">
                ABOUT JB BLOGGING
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-850 dark:text-white tracking-tight leading-none">
                Empowering Creators & Technical Thinkers
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed dark:text-slate-400 font-light">
                JB Blogging was initiated in early 2026 as a dedicated channel for software architectures, economic trends, and UX frameworks, removing standard template noise to focus purely on structural wisdom.
              </p>
            </section>

            {/* Core Values / Mission Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
                <span className="text-2xl">🎯</span>
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Our Core Mission</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                  To provide software engineers, finance analysts, and design generalists an ultra-clean, noise-free typography environment to write, publish, and search advanced insights.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
                <span className="text-2xl">👁️</span>
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Comprehensive Vision</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                  Cultivating a global collective of validated expert creators who share realistic codes and bootstrap formulas, bypassing the surface-level clutter of typical generic portals.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
                <span className="text-2xl">🌱</span>
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Independent Growth</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                  Remaining 100% reader-supported, ad-free, and cookie-optional to sustain the highest research transparency and client privacy safeguards.
                </p>
              </div>

            </section>

            {/* The Founder's Journey Section */}
            <section id="founder-journey" className="bg-slate-50 dark:bg-slate-900/40 p-8 sm:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2 space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-500 block">
                  FOUNDING PHILOSOPHY
                </span>
                <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                  The Visionary Journey of Faisal Abbas
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                  JB Blogging was established under the leadership of Faisal Abbas to bridge the widening gap between high-level engineering methodologies and simple, accessible reading lists. In a world saturated with ephemeral posts and commercialized clicks, Faisal aimed to design a clean, ad-free haven for structured, raw knowledge dissemination.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                  What started as an experimental repository of code designs has transformed into an active ecosystem of builders, researchers, and professional creators. Under his direction, the platform continues to strictly safeguard its status as a premium independent publisher.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">
                    FA
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Faisal Abbas, Principal Founder & Chief Architect</span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-850 dark:text-slate-200">
                  Global Metrics
                </h4>
                <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-850/80">
                  <div className="pt-1">
                    <span className="text-[10px] uppercase text-slate-400 font-mono">Verified Channels</span>
                    <p className="text-lg font-black text-blue-600 dark:text-blue-400">4 Core Arenas</p>
                  </div>
                  <div className="pt-3">
                    <span className="text-[10px] uppercase text-slate-400 font-mono">Content Credence</span>
                    <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">100% Peer-Vetted</p>
                  </div>
                  <div className="pt-3">
                    <span className="text-[10px] uppercase text-slate-400 font-mono">Reader Community</span>
                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-450">Exponential Growth</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Engineering Principles & Ethics */}
            <section id="engineering-principles" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 shadow-sm space-y-3">
                <span className="text-xl">🛠️</span>
                <h4 className="text-sm font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">Aesthetic & Code Perfection</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                  Every pixel on JB Blogging is aligned to a perfect typography layout. We favor high-contrast reading elements, modern responsive transitions, Inter sans-serif paired with Space Grotesk interfaces, and absolute lightweight client-side payload caching.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 shadow-sm space-y-3">
                <span className="text-xl">🤝</span>
                <h4 className="text-sm font-extrabold text-slate-850 dark:text-white uppercase tracking-wider">Uncompromising Peer Code</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                  We verify our authors strictly based on prior industry execution logs. General comments, critiques, and review structures undergo structured moderation checks to maintain a calm, professional debate ecosystem free of spam.
                </p>
              </div>
            </section>

            {/* Interactive Team Members cards */}
            <section className="space-y-6">
              <h2 className="text-base font-extrabold text-slate-800 dark:text-white text-center">Meet the Editorial team</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {users.slice(0, 4).map(teamMember => (
                  <div 
                    key={teamMember.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-5 border text-center space-y-3 transition-transform hover:-translate-y-1 duration-200"
                  >
                    <img src={teamMember.avatar} alt="Team" className="h-16 w-16 rounded-full object-cover mx-auto ring-4 ring-slate-50 dark:ring-slate-800" />
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-white">{teamMember.name}</h4>
                      <p className="text-[9px] text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-wide">{teamMember.role}</p>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{teamMember.bio}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* ========================================================
            TAB 8: CONTACT & FAQ PAGE
            ======================================================== */}
        {activeTab === 'contact' && (
          <div className="space-y-12">
            
            {/* Header maps info */}
            <section className="text-center max-w-xl mx-auto space-y-3">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-[10px] font-extrabold rounded-full tracking-wider uppercase">GET IN TOUCH</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-850 dark:text-white">Contact HQ & Support</h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Have an inquiry about corporate subscription models, APIs, sitemaps, or author registration requirements? Let's connect.
              </p>
            </section>

            {/* Grid form and Interactive map embed */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Contact Form card (Left) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                <h3 className="font-extrabold text-sm text-slate-850">Direct Dispatch Ticket</h3>
                
                {contactSuccess && (
                  <p className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200">{contactSuccess}</p>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Your Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Faisal Abbas"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50/50 dark:bg-slate-800 outline-none" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Professional Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="you@company.me"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50/50 dark:bg-slate-800 outline-none" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Message Dispatch</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="State your business coordinates or account support request details..."
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="w-full p-3 border rounded-xl text-xs bg-slate-50/50 dark:bg-slate-800 outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                  >
                    Send Dispatch Message
                  </button>
                </form>
              </div>

              {/* Interactive SVG Google Maps (Right) */}
              <div className="lg:col-span-7">
                <GoogleMapsWidget />
              </div>

            </section>

            {/* FAQ Accordion Section */}
            <section className="space-y-6 max-w-3xl mx-auto">
              <h2 className="text-lg font-black text-slate-800 dark:text-white text-center flex items-center justify-center gap-2">
                ❓ Frequently Asked Questions
              </h2>

              <div className="space-y-3 select-none">
                {[
                  {
                    q: "How can I register as a validated writer on JB Blogging?",
                    a: "You can click on the 'Join as Creator' hero button, register as an author role option, and complete your profile. Your initial draft posts can be managed directly in your user workspace dashboard."
                  },
                  {
                    q: "Is there a maximum cap on blog post drafts and media files?",
                    a: "We currently offer unlimited article drafting and visual image upload management. Authors retain full operational rights over intellectual summaries published on our node servers."
                  },
                  {
                    q: "Are my subscription parameters and email secure?",
                    a: "Yes. In compliance with security directives, we validate headers, hash credentials, protect forms with XSS and CSRF safeguards, and completely avoid advertising telemetry lines."
                  },
                  {
                    q: "How does the Table of Contents get compiled on a single article?",
                    a: "Our rendering engine automatically scans the custom ContentBlocks of an article for heading tags, compiling them into a responsive navigation list overlay on the sticky left pane."
                  }
                ].map((faq, index) => {
                  const isOpen = faqExpanded === index;
                  return (
                    <div 
                      key={index} 
                      className="bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => setFaqExpanded(isOpen ? null : index)}
                        className="w-full text-left px-5 py-4 font-extrabold text-xs sm:text-sm text-slate-850 dark:text-slate-100 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-850"
                      >
                        <span>{faq.q}</span>
                        <span className="text-blue-500 font-bold">{isOpen ? '−' : '+'}</span>
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 pb-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light border-t pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        )}

        {/* ========================================================
            TAB 9: AUTHENTICATION (LOGIN, REGISTER, VERIFY)
            ======================================================== */}
        {activeTab === 'auth' && (
          <div className="max-w-md mx-auto my-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
              
              {/* Tab Title */}
              <div className="text-center space-y-1">
                <span className="h-10 w-10 mx-auto rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                  JB
                </span>
                <h1 className="text-xl font-extrabold text-slate-800 dark:text-white pt-2 leading-none">
                  {authMode === 'login' && 'Sign In to JB Blogging'}
                  {authMode === 'register' && 'Create Author Account'}
                  {authMode === 'forgot' && 'Reset Secure Password'}
                  {authMode === 'verify' && 'Secure Email Verification'}
                </h1>
                <p className="text-[11px] text-slate-400">
                  {authMode === 'login' && 'Discover cutting-edge engineering guidelines.'}
                  {authMode === 'register' && 'Become an expert writer on our board.'}
                  {authMode === 'forgot' && 'Provide your email coordinates to regain access.'}
                  {authMode === 'verify' && 'A verification code is required to complete.'}
                </p>
              </div>

              {/* Local Errors Alert */}
              {authError && (
                <div className="p-3 rounded-xl bg-orange-50 text-orange-700 text-xs font-semibold border border-orange-200">
                  {authError}
                </div>
              )}

              {/* Primary Authentication Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                
                {authMode === 'register' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-450 uppercase">Full Name</label>
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g. Elena Rodriguez"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-455 uppercase">Join role Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setAuthRole('reader')}
                          className={`py-2 text-center text-xs font-bold rounded-xl border ${
                            authRole === 'reader' ? 'border-blue-600 bg-blue-50/10 text-blue-600' : 'text-slate-500'
                          }`}
                        >
                          Reader Account
                        </button>
                        <button
                          type="button"
                          onClick={() => setAuthRole('author')}
                          className={`py-2 text-center text-xs font-bold rounded-xl border ${
                            authRole === 'author' ? 'border-blue-600 bg-blue-50/10 text-blue-600' : 'text-slate-500'
                          }`}
                        >
                          Author Account
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {(authMode !== 'verify') && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-450 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="faisalabbaskhantaheem@gmail.com"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border text-xs outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}

                {authMode === 'login' && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-extrabold text-slate-450 uppercase">Password</label>
                      <button 
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-[10px] font-bold text-blue-500 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border text-xs outline-none"
                    />
                  </div>
                )}

                {authMode === 'verify' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-450 uppercase">Enter Verification Code</label>
                    <input
                      type="text"
                      required
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      placeholder="Enter 123456"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border text-xs text-center font-mono font-bold tracking-widest outline-none"
                    />
                    <p className="text-[10px] text-slate-400 text-center font-sans mt-1">Hint: We have sent a mock validation code to your email. Enter **123456**.</p>
                  </div>
                )}

                {authMode === 'login' && (
                  <div className="flex items-center gap-2 select-none">
                    <input
                      type="checkbox"
                      id="rem"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="rem" className="text-[11px] font-semibold text-slate-500 cursor-pointer">Remember me on this browser next time</label>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  {authMode === 'login' && 'Sign In'}
                  {authMode === 'register' && 'Register Account'}
                  {authMode === 'forgot' && 'Send Reset Link'}
                  {authMode === 'verify' && 'Verify & Continue'}
                </button>
              </form>

              {/* Bottom login toggle triggers */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
                {authMode === 'login' ? (
                  <p>
                    Don't have a profile yet?{' '}
                    <button onClick={() => setAuthMode('register')} className="text-blue-500 font-bold hover:underline">
                      Register Here
                    </button>
                  </p>
                ) : (
                  <p>
                    Already validated?{' '}
                    <button onClick={() => setAuthMode('login')} className="text-blue-500 font-bold hover:underline">
                      Sign In Now
                    </button>
                  </p>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================
            TAB 10: USER DASHBOARD (REACTIVE CREATOR WORKSPACE)
            ======================================================== */}
        {activeTab === 'dashboard' && (
          currentUser ? (
            <div className="space-y-6">
              
              {/* Dashboard header card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={currentUser.avatar} alt="Avatar" className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <h1 className="text-lg font-black text-slate-850 dark:text-white">Welcome back, {currentUser.name}!</h1>
                    <p className="text-xs text-slate-400 capitalize">{currentUser.role} Control Console</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setEditingArticle(null); setShowEditorForm(true); }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm shadow-blue-10/20"
                  >
                    <PlusCircle className="h-4.5 w-4.5" /> Compose Post
                  </button>
                  <button 
                    onClick={() => logout()}
                    className="px-3 py-2 border rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50"
                  >
                    Log Out
                  </button>
                </div>
              </div>

              {/* Sub tabs list */}
              <div className="flex border-b text-xs select-none">
                <button
                  onClick={() => { setShowEditorForm(false); setDashboardSubTab('overview'); }}
                  className={`px-5 py-3 font-extrabold ${dashboardSubTab === 'overview' && !showEditorForm ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-450 hover:text-slate-700'}`}
                >
                  Overview & Stats
                </button>
                <button
                  onClick={() => { setShowEditorForm(false); setDashboardSubTab('posts'); }}
                  className={`px-5 py-3 font-extrabold relative ${dashboardSubTab === 'posts' && !showEditorForm ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-450 hover:text-slate-700'}`}
                >
                  My Articles
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                    {articles.filter(a => a.authorId === currentUser.id).length}
                  </span>
                </button>
                <button
                  onClick={() => { setShowEditorForm(false); setDashboardSubTab('analytics'); }}
                  className={`px-5 py-3 font-extrabold ${dashboardSubTab === 'analytics' && !showEditorForm ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-450 hover:text-slate-700'}`}
                >
                  Traffic Charts
                </button>
                <button
                  onClick={() => { setShowEditorForm(false); setDashboardSubTab('settings'); }}
                  className={`px-5 py-3 font-extrabold ${dashboardSubTab === 'settings' && !showEditorForm ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-450 hover:text-slate-700'}`}
                >
                  Profile Customizer
                </button>
              </div>

              {/* -------------------------------------------------------------
                  DASHBOARD SUB-CONTENT
                  ------------------------------------------------------------- */}
              {showEditorForm ? (
                <BlogEditor 
                  initialArticle={editingArticle}
                  onClose={() => setShowEditorForm(false)}
                  onSaveSuccess={handleSaveArticleSuccess}
                />
              ) : (
                <>
                  {/* SUB 1: OVERVIEW STATS */}
                  {dashboardSubTab === 'overview' && (
                    <div className="space-y-6">
                      
                      {/* Metric cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        <div className="p-5 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm space-y-1">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Estimated Drafts</span>
                          <span className="block text-2xl font-black font-mono text-blue-600">
                            {articles.filter(a => a.authorId === currentUser.id && a.status === 'draft').length}
                          </span>
                        </div>

                        <div className="p-5 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm space-y-1">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Live Publications</span>
                          <span className="block text-2xl font-black font-mono text-emerald-600">
                            {articles.filter(a => a.authorId === currentUser.id && a.status === 'published').length}
                          </span>
                        </div>

                        <div className="p-5 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm space-y-1">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Cumulative Reads</span>
                          <span className="block text-2xl font-black font-mono text-indigo-600">
                            {articles.filter(a => a.authorId === currentUser.id).reduce((s, a) => s + a.views, 0)}
                          </span>
                        </div>

                        <div className="p-5 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm space-y-1">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Followers Ledger</span>
                          <span className="block text-2xl font-black font-mono text-pink-600">
                            {currentUser.followersCount}
                          </span>
                        </div>

                      </div>

                      {/* Interactive bookmark guides lists */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Bookmarks saved */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border shadow-sm">
                          <h3 className="font-extrabold text-xs sm:text-sm text-slate-850 mb-4 flex items-center gap-2">
                            <Bookmark className="h-4.5 w-4.5 text-blue-500" />
                            Bookmarked Articles ({bookmarks.length})
                          </h3>
                          <div className="space-y-3">
                            {articles
                              .filter(a => bookmarks.includes(a.id))
                              .map(bArt => (
                                <div key={bArt.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl text-xs">
                                  <span onClick={() => handleArticleView(bArt)} className="font-extrabold text-slate-800 dark:text-white hover:text-blue-500 cursor-pointer truncate max-w-xs">{bArt.title}</span>
                                  <button onClick={() => toggleBookmark(bArt.id)} className="text-slate-400 hover:text-red-500">Unsave</button>
                                </div>
                            ))}

                            {bookmarks.length === 0 && (
                              <p className="p-3 text-xs text-slate-400 italic">No bookmarked saves found.</p>
                            )}
                          </div>
                        </div>

                        {/* Reading history list */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border shadow-sm">
                          <h3 className="font-extrabold text-xs sm:text-sm text-slate-850 mb-4 flex items-center gap-2">
                            <BookOpen className="h-4.5 w-4.5 text-indigo-500" />
                            Reading History ({history.length})
                          </h3>
                          <ul className="space-y-2 text-xs">
                            {articles
                              .filter(a => history.includes(a.id))
                              .slice(0, 5)
                              .map(hArt => (
                                <li key={hArt.id} onClick={() => handleArticleView(hArt)} className="hover:text-blue-500 cursor-pointer text-slate-650 flex items-center gap-2 truncate">
                                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                  <span className="truncate">{hArt.title}</span>
                                </li>
                            ))}
                            {history.length === 0 && (
                              <p className="p-3 text-xs text-slate-400 italic">No recently viewed logs.</p>
                            )}
                          </ul>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* SUB 2: POSTS COMPILATION LIST */}
                  {dashboardSubTab === 'posts' && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-sm text-slate-850">Manage compositions</h3>
                        <span className="text-xs text-slate-400">Published posts are displayed publicly on the web page.</span>
                      </div>

                      <div className="space-y-3">
                        {articles
                          .filter(a => a.authorId === currentUser.id)
                          .map(art => (
                            <div key={art.id} className="p-4 rounded-xl border flex items-center justify-between gap-4 text-xs">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.2 rounded-full font-bold text-[9px] uppercase ${
                                    art.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'
                                  }`}>
                                    {art.status}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">{art.publishDate}</span>
                                </div>
                                <h4 className="font-extrabold text-slate-800 dark:text-white truncate mt-1">{art.title}</h4>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button 
                                  onClick={() => handleArticleView(art)} 
                                  className="px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded font-semibold text-slate-600 dark:text-slate-350"
                                >
                                  View
                                </button>
                                <button 
                                  onClick={() => { setEditingArticle(art); setShowEditorForm(true); }}
                                  className="px-2.5 py-1.5 bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 rounded font-bold"
                                >
                                  Modify
                                </button>
                                <button 
                                  onClick={() => { if (confirm("Proceed to delete article draft files?")) deleteArticle(art.id); }}
                                  className="px-2.5 py-1.5 bg-red-50 text-red-650 hover:bg-red-100 rounded font-bold"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                        ))}

                        {articles.filter(a => a.authorId === currentUser.id).length === 0 && (
                          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed">
                            <p className="text-xs text-slate-450 italic">No posts composed by this creator profile yet. Get started now!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SUB 3: DETAILED GRAPH TRAFFIC ANALYTICS */}
                  {dashboardSubTab === 'analytics' && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5 space-y-6">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-850">Creator Audience Dynamics</h3>
                        <p className="text-xs text-slate-400 mt-1">Live weekly metrics representing reader impressions, reactions, and referral click logs.</p>
                      </div>

                      {/* STUNNING CUSTOM INTERACTIVE SVG CHART (D3 MOCK REPRESENTATION FLUSH WITH DIRECT CODES COMPILATION SAFETY) */}
                      <div className="p-4 bg-slate-900 rounded-2xl relative h-64 flex flex-col justify-between border border-slate-850">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>WEEKLY INTERACTION TIMELINE</span>
                          <span className="text-blue-400">● reads & visitors metrics</span>
                        </div>

                        {/* Interactive analytical vectors */}
                        <div className="flex-grow w-full h-full relative mt-4">
                          <svg viewBox="0 0 600 130" className="w-full h-full text-blue-500 overflow-visible" xmlns="http://www.w3.org/2000/svg">
                            {/* Grid guide rows */}
                            <line x1="0" y1="30" x2="600" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                            <line x1="0" y1="70" x2="600" y2="70" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                            <line x1="0" y1="110" x2="600" y2="110" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

                            {/* Polygon chart curves back */}
                            <polyline
                              fill="rgba(59, 130, 246, 0.1)"
                              stroke="#3b82f6"
                              strokeWidth="2.5"
                              points="
                                30,80
                                110,65
                                190,45
                                270,55
                                350,30
                                430,105
                                510,50
                                580,70
                              "
                            />

                            {/* Interactive tooltip coordinates dots */}
                            <circle cx="190" cy="45" r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
                            <circle cx="350" cy="30" r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
                            
                            <text x="190" y="25" textAnchor="middle" className="fill-blue-400 text-[8px] font-mono font-bold">peak (Wed: 4.2k)</text>
                          </svg>
                        </div>

                        {/* Timeline foot labels */}
                        <div className="grid grid-cols-7 text-center text-[10px] font-mono text-slate-500 pt-3 border-t border-slate-800">
                          <span>Mon</span>
                          <span>Tue</span>
                          <span>Wed</span>
                          <span>Thu</span>
                          <span>Fri</span>
                          <span>Sat</span>
                          <span>Sun</span>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* SUB 4: USER PROFILE CUSTOMIZER SETTINGS */}
                  {dashboardSubTab === 'settings' && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5 space-y-6">
                      <h3 className="font-extrabold text-sm text-slate-850">Customize public bio settings</h3>
                      
                      <form 
                        onSubmit={(e) => { 
                          e.preventDefault(); 
                          setAuthSuccess("Profile parameters compiled successfully!"); 
                          setTimeout(() => setAuthSuccess(''), 3000); 
                        }} 
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Avatar Upload */}
                          <div className="space-y-2 p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-800/40">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avatar Picture Customizer</label>
                            <div className="flex items-center gap-3">
                              <img src={currentUser.avatar} alt="Avatar Preview" className="h-10 w-10 rounded-full object-cover border border-slate-250 shadow-sm" />
                              <div className="flex-grow">
                                <label className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all active:scale-95 shadow-sm">
                                  <Upload className="h-3.5 w-3.5" />
                                  Upload from Gallery
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => handleLocalImageUpload(e, (dataUrl) => updateUserProfile(currentUser.id, { avatar: dataUrl }))} 
                                  />
                                </label>
                                <span className="text-[9px] text-slate-450 block mt-1">Accepts PNG, JPG, WebP.</span>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                              <span className="text-[9px] text-slate-400 block mb-1">Or paste direct Web Link instead</span>
                              <input 
                                type="text" 
                                value={currentUser.avatar}
                                onChange={(e) => updateUserProfile(currentUser.id, { avatar: e.target.value })}
                                className="px-2.5 py-1.5 bg-white dark:bg-slate-900 rounded-lg text-[10px] border w-full outline-none focus:ring-1 focus:ring-blue-500" 
                                placeholder="Paste picture URL..."
                              />
                            </div>
                          </div>
                          
                          {/* Profile Cover Banner Upload */}
                          <div className="space-y-2 p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-800/40">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Profile Cover Banner Customizer</label>
                            <div className="flex items-center gap-3">
                              {currentUser.coverImage ? (
                                <img src={currentUser.coverImage} alt="Banner Preview" className="h-10 w-16 rounded object-cover border border-slate-250 shadow-sm" />
                              ) : (
                                <div className="h-10 w-16 rounded bg-slate-250 dark:bg-slate-700 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[8px] text-slate-400 font-bold">No Cover</div>
                              )}
                              <div className="flex-grow">
                                <label className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all active:scale-95 shadow-sm">
                                  <Upload className="h-3.5 w-3.5" />
                                  Upload from Gallery
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => handleLocalImageUpload(e, (dataUrl) => updateUserProfile(currentUser.id, { coverImage: dataUrl }))} 
                                  />
                                </label>
                                <span className="text-[9px] text-slate-450 block mt-1">Accepts landscape banners.</span>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                              <span className="text-[9px] text-slate-400 block mb-1">Or paste direct Web Link instead</span>
                              <input 
                                type="text" 
                                value={currentUser.coverImage || ''}
                                onChange={(e) => updateUserProfile(currentUser.id, { coverImage: e.target.value })}
                                className="px-2.5 py-1.5 bg-white dark:bg-slate-900 rounded-lg text-[10px] text-slate-700 dark:text-slate-300 border w-full outline-none focus:ring-1 focus:ring-blue-500" 
                                placeholder="Paste banner URL..."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Full Public Name</label>
                          <input 
                            type="text" 
                            value={currentUser.name}
                            onChange={(e) => updateUserProfile(currentUser.id, { name: e.target.value })}
                            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border w-full outline-none" 
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Public Professional Bio Statement</label>
                          <textarea 
                            rows={3}
                            value={currentUser.bio}
                            onChange={(e) => updateUserProfile(currentUser.id, { bio: e.target.value })}
                            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border w-full outline-none" 
                          />
                        </div>

                        <button 
                          type="submit"
                          className="px-5 py-2 rounded-xl text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all"
                        >
                          Compile Changes
                        </button>
                      </form>
                    </div>
                  )}
                </>
              )}

            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl space-y-4 max-w-sm mx-auto">
              <ShieldAlert className="h-10 w-10 text-pink-500 mx-auto" />
              <h3 className="font-extrabold text-sm">Dashboard Login Required</h3>
              <p className="text-xs text-slate-400">Please authenticate to gain workspace authorization to compose guides.</p>
              <button 
                onClick={() => { setActiveTab('auth'); setAuthMode('login'); }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold"
              >
                Sign In
              </button>
            </div>
          )
        )}

      </main>

      {/* Global Footer component */}
      <Footer 
        setActiveTab={setActiveTab} 
        setSelectedCategory={setSelectedCategoryName} 
        setSelectedArticle={setSelectedArticle}
      />

    </div>
  );
}

export default function App() {
  return (
    <BlogProvider>
      <AppContent />
    </BlogProvider>
  );
}
