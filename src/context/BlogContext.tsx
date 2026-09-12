import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Article, Comment, Category, Subscriber, TrafficData } from '../types';
import { INITIAL_USERS, INITIAL_CATEGORIES, INITIAL_ARTICLES, INITIAL_COMMENTS } from '../data/mockData';
import {
  checkSupabaseConnection,
  fetchUsersFromSupabase,
  fetchArticlesFromSupabase,
  fetchCommentsFromSupabase,
  fetchSubscribersFromSupabase,
  fetchCategoriesFromSupabase,
  saveUserToSupabase,
  saveArticleToSupabase,
  deleteArticleFromSupabase,
  saveCommentToSupabase,
  deleteCommentFromSupabase,
  saveSubscriberToSupabase,
  saveCategoryToSupabase,
  pushLocalDataToSupabase,
  SupabaseSyncStatus
} from '../lib/supabase';

interface BlogContextType {
  currentUser: User | null;
  users: User[];
  articles: Article[];
  comments: Comment[];
  categories: Category[];
  subscribers: Subscriber[];
  darkMode: boolean;
  history: string[]; // Article IDs
  bookmarks: string[]; // Article IDs
  trafficStats: TrafficData[];
  
  // Supabase Backend info
  supabaseStatus: SupabaseSyncStatus | null;
  supabaseLoading: boolean;
  bulkSyncToSupabase: () => Promise<string>;
  refreshSupabaseStatus: () => Promise<void>;
  
  // Auth actions
  login: (email: string, rememberMe: boolean) => Promise<User>;
  register: (name: string, email: string, role: 'reader' | 'author') => Promise<User>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<string>;
  verifyEmailCode: (email: string, code: string) => Promise<boolean>;
  
  // Article Actions
  addArticle: (articleData: Partial<Article>) => Article;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  likeArticle: (id: string) => void;
  reactToArticle: (id: string, reaction: 'like' | 'heart' | 'fire' | 'brain') => void;
  viewArticle: (id: string) => void;
  toggleBookmark: (id: string) => void;
  addToHistory: (id: string) => void;
  
  // Comment Actions
  addComment: (articleId: string, content: string, guestName?: string, guestEmail?: string) => void;
  moderateComment: (commentId: string, action: 'approve' | 'delete' | 'spam') => void;
  
  // User Management
  updateUserProfile: (userId: string, data: Partial<User>) => void;
  manageUser: (userId: string, action: 'ban' | 'unban' | 'set_admin' | 'set_author' | 'delete') => void;
  toggleFollowAuthor: (authorId: string) => void;
  
  // Categories/Tags
  addCategory: (name: string, description: string) => void;
  
  // Newsletter
  subscribeNewsletter: (email: string) => Promise<string>;
  sendEmailCampaign: (subject: string, content: string) => void;
  
  // Theme
  toggleTheme: () => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Supabase live states
  const [supabaseLoading, setSupabaseLoading] = useState<boolean>(true);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseSyncStatus | null>(null);

  const refreshSupabaseStatus = async () => {
    try {
      const status = await checkSupabaseConnection();
      setSupabaseStatus(status);
    } catch {
      // ignore
    }
  };

  // Try loading from localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('jb_blog_dark_mode');
    return saved ? saved === 'true' : false;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('jb_blog_current_user');
    let user = saved ? JSON.parse(saved) : null;
    if (user && user.id === 'user-admin') {
      const freshAdmin = INITIAL_USERS.find(iu => iu.id === 'user-admin');
      if (freshAdmin) {
        user = {
          ...user,
          avatar: freshAdmin.avatar,
          followersCount: freshAdmin.followersCount
        };
      }
    }
    return user;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('jb_blog_users');
    const parsed = saved ? JSON.parse(saved) : INITIAL_USERS;
    return parsed.map((u: User) => {
      if (u.id === 'user-admin') {
        const freshAdmin = INITIAL_USERS.find(iu => iu.id === 'user-admin');
        if (freshAdmin) {
          return {
            ...u,
            avatar: freshAdmin.avatar,
            followersCount: freshAdmin.followersCount
          };
        }
      }
      return u;
    });
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('jb_blog_articles');
    const parsed = saved ? JSON.parse(saved) : INITIAL_ARTICLES;
    return parsed.map((a: Article) => {
      if (a.authorId === 'user-admin') {
        const freshAdmin = INITIAL_USERS.find(iu => iu.id === 'user-admin');
        if (freshAdmin) {
          return {
            ...a,
            authorAvatar: freshAdmin.avatar
          };
        }
      }
      return a;
    });
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('jb_blog_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('jb_blog_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    const saved = localStorage.getItem('jb_blog_subscribers');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'sub-1', email: 'hello@world.com', joinedDate: '2026-05-10' },
      { id: 'sub-2', email: 'tech_lover@design.io', joinedDate: '2026-06-01' }
    ];
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('jb_blog_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('jb_blog_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Keep localStorage synched
  useEffect(() => {
    localStorage.setItem('jb_blog_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('jb_blog_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('jb_blog_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('jb_blog_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('jb_blog_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  useEffect(() => {
    localStorage.setItem('jb_blog_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('jb_blog_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('jb_blog_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('jb_blog_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('jb_blog_current_user');
    }
  }, [currentUser]);

  // Load from Supabase on mount
  useEffect(() => {
    async function initSupabaseData() {
      try {
        const status = await checkSupabaseConnection();
        setSupabaseStatus(status);
        if (status.connected) {
          const hasLiveTables = Object.values(status.tables).some(live => live);
          if (hasLiveTables) {
            const [su, sa, sc, ss, scat] = await Promise.all([
              status.tables.users ? fetchUsersFromSupabase() : Promise.resolve(null),
              status.tables.articles ? fetchArticlesFromSupabase() : Promise.resolve(null),
              status.tables.comments ? fetchCommentsFromSupabase() : Promise.resolve(null),
              status.tables.subscribers ? fetchSubscribersFromSupabase() : Promise.resolve(null),
              status.tables.categories ? fetchCategoriesFromSupabase() : Promise.resolve(null),
            ]);
            
            if (su && su.length > 0) setUsers(su);
            if (sa && sa.length > 0) setArticles(sa);
            if (sc && sc.length > 0) setComments(sc);
            if (ss && ss.length > 0) setSubscribers(ss);
            if (scat && scat.length > 0) setCategories(scat);
          }
        }
      } catch (err) {
        console.error('Failed to pre-fetch Supabase backend tables:', err);
      } finally {
        setSupabaseLoading(false);
      }
    }
    
    initSupabaseData();
  }, []);

  const bulkSyncToSupabase = async (): Promise<string> => {
    try {
      const msg = await pushLocalDataToSupabase(users, articles, comments, subscribers, categories);
      await refreshSupabaseStatus();
      return msg;
    } catch (err: any) {
      throw err;
    }
  };

  // Traffic Stats (Mock traffic analytics data that reacts slightly with article views)
  const [trafficStats, setTrafficStats] = useState<TrafficData[]>([]);

  useEffect(() => {
    const baseViews = articles.reduce((sum, a) => sum + a.views, 0);
    const baseLikes = articles.reduce((sum, a) => sum + a.likes, 0);

    const stats: TrafficData[] = [
      { date: 'Mon', views: Math.round(baseViews * 0.12), likes: Math.round(baseLikes * 0.12), visitors: Math.round(baseViews * 0.08) },
      { date: 'Tue', views: Math.round(baseViews * 0.14), likes: Math.round(baseLikes * 0.13), visitors: Math.round(baseViews * 0.09) },
      { date: 'Wed', views: Math.round(baseViews * 0.16), likes: Math.round(baseLikes * 0.15), visitors: Math.round(baseViews * 0.11) },
      { date: 'Thu', views: Math.round(baseViews * 0.15), likes: Math.round(baseLikes * 0.14), visitors: Math.round(baseViews * 0.10) },
      { date: 'Fri', views: Math.round(baseViews * 0.18), likes: Math.round(baseLikes * 0.19), visitors: Math.round(baseViews * 0.13) },
      { date: 'Sat', views: Math.round(baseViews * 0.11), likes: Math.round(baseLikes * 0.10), visitors: Math.round(baseViews * 0.07) },
      { date: 'Sun', views: Math.round(baseViews * 0.14), likes: Math.round(baseLikes * 0.17), visitors: Math.round(baseViews * 0.10) }
    ];
    setTrafficStats(stats);
  }, [articles]);

  // Authentications
  const login = async (email: string, rememberMe: boolean): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (found) {
          if (found.isBanned) {
            reject(new Error('This account has been banned by administrators.'));
          } else {
            setCurrentUser(found);
            resolve(found);
          }
        } else {
          // If not found, let's auto-generate a reader or help them login as Faisal
          if (email.includes('admin') || email.toLowerCase() === 'faisalabbaskhantaheem@gmail.com') {
            const adminUser = users.find(u => u.role === 'admin');
            if (adminUser) {
              setCurrentUser(adminUser);
              resolve(adminUser);
              return;
            }
          }
          // Create user on-demand as a standard reader
          const name = email.split('@')[0];
          const newUser: User = {
            id: 'user-' + Date.now(),
            email: email,
            name: name.charAt(0).toUpperCase() + name.slice(1),
            role: 'reader',
            avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
            bio: 'Registered reader of JB Blogging. Knowledge explorer.',
            followersCount: 0,
            followingCount: 0,
            socialLinks: {},
            followers: [],
            following: [],
            joinedDate: new Date().toISOString().split('T')[0]
          };
          setUsers(prev => [...prev, newUser]);
          setCurrentUser(newUser);
          saveUserToSupabase(newUser);
          resolve(newUser);
        }
      }, 500);
    });
  };

  const register = async (name: string, email: string, role: 'reader' | 'author'): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          reject(new Error('A user with this email address already exists.'));
          return;
        }

        const newUser: User = {
          id: 'user-' + Date.now(),
          email,
          name,
          role,
          avatar: role === 'author' 
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          bio: role === 'author' 
            ? 'Professional content creator at JB Blogging.' 
            : 'Knowledge enthusiast and regular contributor.',
          followersCount: 0,
          followingCount: 0,
          socialLinks: {},
          followers: [],
          following: [],
          joinedDate: new Date().toISOString().split('T')[0]
        };

        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        saveUserToSupabase(newUser);
        resolve(newUser);
      }, 500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const requestPasswordReset = async (email: string): Promise<string> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`A verification link has been sent to ${email} (mock link).`);
      }, 600);
    });
  };

  const verifyEmailCode = async (email: string, code: string): Promise<boolean> => {
    return code === '123456' || code.length === 6;
  };

  // Article administration
  const addArticle = (articleData: Partial<Article>): Article => {
    const slug = (articleData.title || 'draft-' + Date.now())
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-');

    const author = currentUser || users.find(u => u.role === 'admin') || users[0];

    const newArticle: Article = {
      id: 'art-' + Date.now(),
      slug,
      title: articleData.title || 'Untitled Post',
      excerpt: articleData.excerpt || 'An overview of the newly written article.',
      content: articleData.content || '',
      contentBlocks: articleData.contentBlocks || [
        { type: 'paragraph', value: articleData.content || 'Start editing your article...' }
      ],
      category: articleData.category || 'Technology',
      tags: articleData.tags || [],
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      coverImage: articleData.coverImage || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1000&auto=format&fit=crop&q=80',
      publishDate: new Date().toISOString().split('T')[0],
      readingTime: `${Math.max(1, Math.ceil((articleData.content?.split(' ').length || 200) / 200))} min read`,
      views: 0,
      likes: 0,
      likedBy: [],
      bookmarkedBy: [],
      commentsCount: 0,
      status: articleData.status || 'draft',
      reactions: { like: 0, heart: 0, fire: 0, brain: 0 }
    };

    setArticles(prev => [newArticle, ...prev]);
    saveArticleToSupabase(newArticle);
    return newArticle;
  };

  const updateArticle = (updated: Article) => {
    setArticles(prev => prev.map(a => a.id === updated.id ? updated : a));
    saveArticleToSupabase(updated);
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    deleteArticleFromSupabase(id);
  };

  const likeArticle = (id: string) => {
    if (!currentUser) return;
    setArticles(prev => prev.map(a => {
      if (a.id === id) {
        const alreadyLiked = a.likedBy.includes(currentUser.id);
        const likedBy = alreadyLiked 
          ? a.likedBy.filter(uid => uid !== currentUser.id)
          : [...a.likedBy, currentUser.id];
        const likes = likedBy.length;
        
        const updatedArt = {
          ...a,
          likedBy,
          likes,
          reactions: {
            ...a.reactions,
            like: alreadyLiked ? Math.max(0, a.reactions.like - 1) : a.reactions.like + 1
          }
        };
        saveArticleToSupabase(updatedArt);
        return updatedArt;
      }
      return a;
    }));
  };

  const reactToArticle = (id: string, reaction: 'like' | 'heart' | 'fire' | 'brain') => {
    setArticles(prev => prev.map(a => {
      if (a.id === id) {
        const updatedArt = {
          ...a,
          reactions: {
            ...a.reactions,
            [reaction]: (a.reactions[reaction] || 0) + 1
          }
        };
        saveArticleToSupabase(updatedArt);
        return updatedArt;
      }
      return a;
    }));
  };

  const viewArticle = (id: string) => {
    setArticles(prev => prev.map(a => {
      if (a.id === id) {
        const updatedArt = { ...a, views: a.views + 1 };
        saveArticleToSupabase(updatedArt);
        return updatedArt;
      }
      return a;
    }));
  };

  const toggleBookmark = (id: string) => {
    if (!currentUser) return;
    setBookmarks(prev => {
      const isBookmarked = prev.includes(id);
      const updated = isBookmarked ? prev.filter(bid => bid !== id) : [...prev, id];
      
      // Update article bookmarked status list as well
      setArticles(artPrev => artPrev.map(a => {
        if (a.id === id) {
          const abm = a.bookmarkedBy || [];
          return {
            ...a,
            bookmarkedBy: isBookmarked 
              ? abm.filter(uid => uid !== currentUser.id)
              : [...abm, currentUser.id]
          };
        }
        return a;
      }));
      
      return updated;
    });
  };

  const addToHistory = (id: string) => {
    setHistory(prev => {
      const filtered = prev.filter(hid => hid !== id);
      return [id, ...filtered].slice(0, 50); // Keep last 50 read articles
    });
  };

  // Comments
  const addComment = (articleId: string, content: string, guestName?: string, guestEmail?: string) => {
    const authorName = currentUser ? currentUser.name : (guestName || 'Anonymous');
    const authorAvatar = currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80';
    const authorEmail = currentUser ? currentUser.email : (guestEmail || 'anonymous@guest.com');

    const newComment: Comment = {
      id: 'comm-' + Date.now(),
      articleId,
      authorName,
      authorAvatar,
      authorEmail,
      content,
      date: new Date().toISOString().split('T')[0],
      approved: currentUser?.role !== 'reader' && currentUser !== null, // auto-approve admins and authors
      isSpam: false
    };

    setComments(prev => [newComment, ...prev]);
    saveCommentToSupabase(newComment);

    // Update article comment counts
    setArticles(prev => prev.map(a => {
      if (a.id === articleId) {
        const updatedArt = { ...a, commentsCount: a.commentsCount + 1 };
        saveArticleToSupabase(updatedArt);
        return updatedArt;
      }
      return a;
    }));
  };

  const moderateComment = (commentId: string, action: 'approve' | 'delete' | 'spam') => {
    if (action === 'delete') {
      const comm = comments.find(c => c.id === commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      deleteCommentFromSupabase(commentId);
      if (comm) {
        setArticles(prev => prev.map(a => {
          if (a.id === comm.articleId) {
            const updatedArt = { ...a, commentsCount: Math.max(0, a.commentsCount - 1) };
            saveArticleToSupabase(updatedArt);
            return updatedArt;
          }
          return a;
        }));
      }
    } else {
      setComments(prev => prev.map(c => {
        if (c.id === commentId) {
          const updatedComm = {
            ...c,
            approved: action === 'approve',
            isSpam: action === 'spam'
          };
          saveCommentToSupabase(updatedComm);
          return updatedComm;
        }
        return c;
      }));
    }
  };

  // User Administration
  const updateUserProfile = (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, ...data };
        saveUserToSupabase(updated);
        return updated;
      }
      return u;
    }));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const manageUser = (userId: string, action: 'ban' | 'unban' | 'set_admin' | 'set_author' | 'delete') => {
    if (action === 'delete') {
      setUsers(prev => prev.filter(u => u.id !== userId));
      if (currentUser?.id === userId) {
        setCurrentUser(null);
      }
    } else {
      setUsers(prev => prev.map(u => {
        if (u.id === userId) {
          const updated = {
            ...u,
            isBanned: action === 'ban' ? true : action === 'unban' ? false : u.isBanned,
            role: action === 'set_admin' ? 'admin' : action === 'set_author' ? 'author' : u.role
          };
          saveUserToSupabase(updated);
          return updated;
        }
        return u;
      }));
    }
  };

  const toggleFollowAuthor = (authorId: string) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => {
      // Modify the target author
      if (u.id === authorId) {
        const alreadyFollowing = u.followers.includes(currentUser.id);
        const followers = alreadyFollowing
          ? u.followers.filter(uid => uid !== currentUser.id)
          : [...u.followers, currentUser.id];
        const updated = {
          ...u,
          followers,
          followersCount: followers.length
        };
        saveUserToSupabase(updated);
        return updated;
      }
      // Modify current user
      if (u.id === currentUser.id) {
        const alreadyFollowing = u.following.includes(authorId);
        const following = alreadyFollowing
          ? u.following.filter(aid => aid !== authorId)
          : [...u.following, authorId];
        
        // Also update currentUser context
        setTimeout(() => {
          setCurrentUser(curr => curr ? {
            ...curr,
            following,
            followingCount: following.length
          } : null);
        }, 0);

        const updated = {
          ...u,
          following,
          followingCount: following.length
        };
        saveUserToSupabase(updated);
        return updated;
      }
      return u;
    }));
  };

  const addCategory = (name: string, description: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-');
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-yellow-600',
      'from-rose-500 to-orange-600',
      'from-cyan-500 to-blue-600'
    ];
    const itemColor = colors[categories.length % colors.length];

    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name,
      slug,
      description,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
      color: itemColor,
      count: 0
    };

    setCategories(prev => [...prev, newCat]);
    saveCategoryToSupabase(newCat);
  };

  // Newsletter Subscribers
  const subscribeNewsletter = async (email: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const normalized = email.trim().toLowerCase();
        const exists = subscribers.find(s => s.email.toLowerCase() === normalized);
        if (exists) {
          reject(new Error('This email is already subscribed to our newsletter!'));
          return;
        }

        const newSub: Subscriber = {
          id: 'sub-' + Date.now(),
          email: normalized,
          joinedDate: new Date().toISOString().split('T')[0]
        };

        setSubscribers(prev => [newSub, ...prev]);
        saveSubscriberToSupabase(newSub);
        resolve('Thank you for subscribing to the JB Blogging newsletter!');
      }, 500);
    });
  };

  const sendEmailCampaign = (subject: string, content: string) => {
    console.log(`Sending email newsletter: "${subject}" to ${subscribers.length} subscribers.`);
  };

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <BlogContext.Provider value={{
      currentUser,
      users,
      articles,
      comments,
      categories,
      subscribers,
      darkMode,
      history,
      bookmarks,
      trafficStats,
      
      supabaseStatus,
      supabaseLoading,
      bulkSyncToSupabase,
      refreshSupabaseStatus,
      
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
      
      addCategory,
      subscribeNewsletter,
      sendEmailCampaign,
      
      toggleTheme
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
