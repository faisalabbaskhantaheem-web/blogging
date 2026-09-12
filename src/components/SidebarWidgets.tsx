import React from 'react';
import { useBlog } from '../context/BlogContext';
import { Article, Category, User } from '../types';
import { TrendingUp, Award, Flame, UserPlus, UserCheck, MessageSquare, Heart, Eye } from 'lucide-react';

interface SidebarWidgetsProps {
  onArticleClick: (article: Article) => void;
  onCategoryClick: (categoryName: string) => void;
  onAuthorClick?: (userId: string) => void;
}

export const SidebarWidgets: React.FC<SidebarWidgetsProps> = ({ 
  onArticleClick, 
  onCategoryClick, 
  onAuthorClick 
}) => {
  const { articles, categories, users, toggleFollowAuthor, currentUser } = useBlog();

  // Get top viewed/liked articles for Trending list
  const trendingArticles = [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  // Get top writers (role === author or admin)
  const topAuthors = users
    .filter(u => u.role === 'author' || u.role === 'admin')
    .slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* 1. Medium Style Trending Section Widget */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          Trending Conversations
        </h3>
        <div className="space-y-4">
          {trendingArticles.map((article, idx) => (
            <div 
              key={article.id} 
              onClick={() => onArticleClick(article)}
              className="flex items-start gap-3 cursor-pointer group"
            >
              <span className="text-2xl font-extrabold text-slate-200 dark:text-slate-800 group-hover:text-blue-500 transition-colors leading-none">
                0{idx + 1}
              </span>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  {article.category}
                </span>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>{article.authorName}</span>
                  <span>•</span>
                  <span>{article.readingTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Channel Badges Widget */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
          <Award className="h-4 w-4 text-emerald-500" />
          Popular Channels
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            // Count articles in this category
            const count = articles.filter(a => a.category.toLowerCase() === cat.name.toLowerCase() && a.status === 'published').length;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryClick(cat.name)}
                className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-slate-100 dark:border-slate-800 flex items-center gap-1.5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                {cat.name}
                <span className="bg-slate-200 dark:bg-slate-700 px-1 py-0.2 rounded text-[8px] text-slate-500">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Top Authors Showcased Widget with Following triggers */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
          <Flame className="h-4 w-4 text-pink-500" />
          Creators to Follow
        </h3>
        <div className="space-y-4.5">
          {topAuthors.map((author) => {
            const isFollowing = currentUser ? author.followers.includes(currentUser.id) : false;
            return (
              <div key={author.id} className="flex items-center justify-between gap-2.5">
                <div 
                  className="flex items-center gap-2.5 cursor-pointer group flex-grow"
                  onClick={() => onAuthorClick && onAuthorClick(author.id)}
                >
                  <img 
                    src={author.avatar} 
                    alt={author.name} 
                    className="h-9 w-9 rounded-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-blue-600 truncate leading-tight">
                      {author.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{author.followersCount} followers</p>
                  </div>
                </div>

                {currentUser && currentUser.id !== author.id && (
                  <button
                    onClick={() => toggleFollowAuthor(author.id)}
                    className={`px-2.5 py-1 rounded-full text-[9px] font-bold transition-all flex items-center gap-1 ${
                      isFollowing 
                        ? 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="h-3 w-3" /> Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3 w-3" /> Follow
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
