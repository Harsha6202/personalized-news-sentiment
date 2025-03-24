
export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface Article {
  id: string;
  title: string;
  source: string;
  author?: string;
  publishedAt: string;
  url: string;
  urlToImage?: string;
  description: string;
  content?: string;
  summary: string;
  sentiment: SentimentType;
  sentimentExplanation?: string;
  topics: string[];
  isRead?: boolean;
  isSaved?: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  topics: string[];
  sources: string[];
  keywords: string[];
  excludeKeywords?: string[];
}

export interface DashboardStats {
  totalArticles: number;
  readArticles: number;
  savedArticles: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}
