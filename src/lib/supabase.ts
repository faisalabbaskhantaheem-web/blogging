import { createClient } from '@supabase/supabase-js';
import { User, Article, Comment, Subscriber, Category } from '../types';

// Read configuration from env or fallback to user credentials
const SUPABASE_URL = ((import.meta as any).env.VITE_SUPABASE_URL || 'https://qycxiwkpkqaozdvugdox.supabase.co').replace(/\/$/, '');
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_TzQprz91OvK4hRTFzUZgdw_HcwSc15N';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verification state type
export interface SupabaseSyncStatus {
  connected: boolean;
  message: string;
  tables: {
    users: boolean;
    articles: boolean;
    comments: boolean;
    subscribers: boolean;
    categories: boolean;
  };
}

// Check if tables are available and we are correctly connected
export async function checkSupabaseConnection(): Promise<SupabaseSyncStatus> {
  const status: SupabaseSyncStatus = {
    connected: false,
    message: 'Checking...',
    tables: {
      users: false,
      articles: false,
      comments: false,
      subscribers: false,
      categories: false,
    }
  };

  try {
    // Attempt simple queries on each table
    const [resU, resA, resC, resS, resCat] = await Promise.all([
      supabase.from('_users_sync').select('id').limit(1),
      supabase.from('_articles_sync').select('id').limit(1),
      supabase.from('_comments_sync').select('id').limit(1),
      supabase.from('_subscribers_sync').select('id').limit(1),
      supabase.from('_categories_sync').select('id').limit(1)
    ]);

    status.tables.users = !resU.error;
    status.tables.articles = !resA.error;
    status.tables.comments = !resC.error;
    status.tables.subscribers = !resS.error;
    status.tables.categories = !resCat.error;

    // Wait! In case user hasn't created custom tables yet, we can try to fall back or support standard tables
    // We prefix them with jb_ or _sync to keep them isolated in user's DB. Let's use clean plural names.
    const [resU2, resA2, resC2, resS2, resCat2] = await Promise.all([
      supabase.from('users').select('id').limit(1),
      supabase.from('articles').select('id').limit(1),
      supabase.from('comments').select('id').limit(1),
      supabase.from('subscribers').select('id').limit(1),
      supabase.from('categories').select('id').limit(1)
    ]);

    if (!status.tables.users && !resU2.error) status.tables.users = true;
    if (!status.tables.articles && !resA2.error) status.tables.articles = true;
    if (!status.tables.comments && !resC2.error) status.tables.comments = true;
    if (!status.tables.subscribers && !resS2.error) status.tables.subscribers = true;
    if (!status.tables.categories && !resCat2.error) status.tables.categories = true;

    const anyTableLive = Object.values(status.tables).some(live => live);
    status.connected = true;
    
    if (anyTableLive) {
      status.message = 'Connected successfully! Tables are active and syncing live.';
    } else {
      status.message = 'Supabase API is connected, but local tables need to be created. Data will automatically falls back to local storage and sync once tables are online.';
    }
  } catch (err: any) {
    status.connected = false;
    status.message = `Connection failed: ${err?.message || 'Unknown error'}`;
  }

  return status;
}

// Generate complete PostgreSQL DDL instructions for the user to paste into Supabase SQL editor
export const SUPABASE_DDL_SQL = `-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'reader',
  avatar TEXT,
  bio TEXT,
  cover_image TEXT,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  social_links JSONB DEFAULT '{}'::jsonb,
  followers JSONB DEFAULT '[]'::jsonb,
  following JSONB DEFAULT '[]'::jsonb,
  joined_date TEXT,
  is_banned BOOLEAN DEFAULT false
);

-- 2. Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  content_blocks JSONB DEFAULT '[]'::jsonb,
  category TEXT DEFAULT 'Technology',
  tags JSONB DEFAULT '[]'::jsonb,
  author_id TEXT,
  author_name TEXT,
  author_avatar TEXT,
  cover_image TEXT,
  publish_date TEXT,
  reading_time TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  liked_by JSONB DEFAULT '[]'::jsonb,
  bookmarked_by JSONB DEFAULT '[]'::jsonb,
  comments_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  reactions JSONB DEFAULT '{"like":0,"heart":0,"fire":0,"brain":0}'::jsonb
);

-- 3. Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  author_email TEXT,
  content TEXT NOT NULL,
  date TEXT,
  approved BOOLEAN DEFAULT true,
  is_spam BOOLEAN DEFAULT false
);

-- 4. Subscribers Table
CREATE TABLE IF NOT EXISTS subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  joined_date TEXT
);

-- 5. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  color TEXT,
  count INTEGER DEFAULT 0
);

-- Enable write access mapping to anon roles
ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE articles FORCE ROW LEVEL SECURITY;
ALTER TABLE comments FORCE ROW LEVEL SECURITY;
ALTER TABLE subscribers FORCE ROW LEVEL SECURITY;
ALTER TABLE categories FORCE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON users FOR UPDATE USING (true);

CREATE POLICY "Allow public select articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Allow public insert articles" ON articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update articles" ON articles FOR UPDATE USING (true);
CREATE POLICY "Allow public delete articles" ON articles FOR DELETE USING (true);

CREATE POLICY "Allow public select comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update comments" ON comments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete comments" ON comments FOR DELETE USING (true);

CREATE POLICY "Allow public select subscribers" ON subscribers FOR SELECT USING (true);
CREATE POLICY "Allow public insert subscribers" ON subscribers FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert categories" ON categories FOR INSERT WITH CHECK (true);
`;

// Fetch values helpers (loads existing data when available, otherwise safe fallback)
export async function fetchUsersFromSupabase(): Promise<User[] | null> {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error || !data) return null;
    return data.map(u => ({
      ...u,
      coverImage: u.cover_image,
      followersCount: u.followers_count,
      followingCount: u.following_count,
      socialLinks: u.social_links || {},
      followers: u.followers || [],
      following: u.following || [],
      joinedDate: u.joined_date,
      isBanned: u.is_banned
    }));
  } catch {
    return null;
  }
}

export async function fetchArticlesFromSupabase(): Promise<Article[] | null> {
  try {
    const { data, error } = await supabase.from('articles').select('*');
    if (error || !data) return null;
    return data.map(a => ({
      ...a,
      contentBlocks: a.content_blocks || [],
      tags: a.tags || [],
      authorId: a.author_id,
      authorName: a.author_name,
      authorAvatar: a.author_avatar,
      coverImage: a.cover_image,
      publishDate: a.publish_date,
      readingTime: a.reading_time,
      likedBy: a.liked_by || [],
      bookmarkedBy: a.bookmarked_by || [],
      commentsCount: a.comments_count,
      reactions: a.reactions || { like: 0, heart: 0, fire: 0, brain: 0 }
    }));
  } catch {
    return null;
  }
}

export async function fetchCommentsFromSupabase(): Promise<Comment[] | null> {
  try {
    const { data, error } = await supabase.from('comments').select('*');
    if (error || !data) return null;
    return data.map(c => ({
      ...c,
      articleId: c.article_id,
      authorName: c.author_name,
      authorAvatar: c.author_avatar,
      authorEmail: c.author_email,
      isSpam: c.is_spam
    }));
  } catch {
    return null;
  }
}

export async function fetchSubscribersFromSupabase(): Promise<Subscriber[] | null> {
  try {
    const { data, error } = await supabase.from('subscribers').select('*');
    if (error || !data) return null;
    return data.map(s => ({
      id: s.id,
      email: s.email,
      joinedDate: s.joined_date
    }));
  } catch {
    return null;
  }
}

export async function fetchCategoriesFromSupabase(): Promise<Category[] | null> {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

// Upsert helpers
export async function saveUserToSupabase(user: User): Promise<boolean> {
  try {
    const dbUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      cover_image: user.coverImage,
      followers_count: user.followersCount,
      following_count: user.followingCount,
      social_links: user.socialLinks,
      followers: user.followers,
      following: user.following,
      joined_date: user.joinedDate,
      is_banned: !!user.isBanned
    };
    const { error } = await supabase.from('users').upsert([dbUser]);
    return !error;
  } catch {
    return false;
  }
}

export async function saveArticleToSupabase(article: Article): Promise<boolean> {
  try {
    const dbArticle = {
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      content_blocks: article.contentBlocks,
      category: article.category,
      tags: article.tags,
      author_id: article.authorId,
      author_name: article.authorName,
      author_avatar: article.authorAvatar,
      cover_image: article.coverImage,
      publish_date: article.publishDate,
      reading_time: article.readingTime,
      views: article.views,
      likes: article.likes,
      liked_by: article.likedBy,
      bookmarked_by: article.bookmarkedBy,
      comments_count: article.commentsCount,
      status: article.status,
      reactions: article.reactions
    };
    const { error } = await supabase.from('articles').upsert([dbArticle]);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteArticleFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function saveCommentToSupabase(comment: Comment): Promise<boolean> {
  try {
    const dbComment = {
      id: comment.id,
      article_id: comment.articleId,
      author_name: comment.authorName,
      author_avatar: comment.authorAvatar,
      author_email: comment.authorEmail,
      content: comment.content,
      date: comment.date,
      approved: !!comment.approved,
      is_spam: !!comment.isSpam
    };
    const { error } = await supabase.from('comments').upsert([dbComment]);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteCommentFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function saveSubscriberToSupabase(sub: Subscriber): Promise<boolean> {
  try {
    const dbSub = {
      id: sub.id,
      email: sub.email,
      joined_date: sub.joinedDate
    };
    const { error } = await supabase.from('subscribers').upsert([dbSub]);
    return !error;
  } catch {
    return false;
  }
}

export async function saveCategoryToSupabase(cat: Category): Promise<boolean> {
  try {
    const { error } = await supabase.from('categories').upsert([cat]);
    return !error;
  } catch {
    return false;
  }
}

// Bulk sync helper
export async function pushLocalDataToSupabase(
  users: User[],
  articles: Article[],
  comments: Comment[],
  subscribers: Subscriber[],
  categories: Category[]
): Promise<string> {
  let successCount = 0;
  let totalTasks = users.length + articles.length + comments.length + subscribers.length + categories.length;

  try {
    await Promise.all([
      ...users.map(u => saveUserToSupabase(u).then(ok => { if (ok) successCount++; })),
      ...articles.map(a => saveArticleToSupabase(a).then(ok => { if (ok) successCount++; })),
      ...comments.map(c => saveCommentToSupabase(c).then(ok => { if (ok) successCount++; })),
      ...subscribers.map(s => saveSubscriberToSupabase(s).then(ok => { if (ok) successCount++; })),
      ...categories.map(cat => saveCategoryToSupabase(cat).then(ok => { if (ok) successCount++; }))
    ]);
    return `Uploaded ${successCount} of ${totalTasks} records successfully to Supabase!`;
  } catch (err: any) {
    throw new Error(`Sync error: ${err?.message || 'Check database permissions / table rules'}`);
  }
}
