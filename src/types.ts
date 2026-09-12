export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'author' | 'reader';
  avatar: string;
  bio: string;
  coverImage?: string;
  followersCount: number;
  followingCount: number;
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  followers: string[]; // List of user IDs following this user
  following: string[]; // List of user IDs this user follows
  joinedDate: string;
  isBanned?: boolean;
}

export interface ReactionType {
  like: number;
  heart: number;
  fire: number;
  brain: number;
}

export interface ContentBlock {
  type: 'paragraph' | 'heading1' | 'heading2' | 'code' | 'quote' | 'image' | 'video';
  value: string;
  extra?: string; // For code language, image caption, etc.
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // fallback or simple representation
  contentBlocks: ContentBlock[];
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  coverImage: string;
  publishDate: string;
  readingTime: string;
  views: number;
  likes: number;
  likedBy: string[]; // User IDs who liked
  bookmarkedBy: string[]; // User IDs who bookmarked
  commentsCount: number;
  status: 'draft' | 'published';
  reactions: ReactionType;
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorAvatar: string;
  authorEmail: string;
  content: string;
  date: string;
  approved: boolean;
  isSpam: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  color: string;
  count: number;
}

export interface Subscriber {
  id: string;
  email: string;
  joinedDate: string;
}

export interface TrafficData {
  date: string;
  views: number;
  likes: number;
  visitors: number;
}
