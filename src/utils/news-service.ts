
import { Article, SentimentType, User, UserPreferences, DashboardStats } from '@/types/news';

// Mock data for testing purposes
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Tech Giant Announces Revolutionary AI-Powered Platform',
    source: 'TechCrunch',
    author: 'John Smith',
    publishedAt: '2023-08-15T08:30:00Z',
    url: 'https://example.com/article1',
    urlToImage: 'https://source.unsplash.com/random/800x600?tech',
    description: 'A major technology company has announced a new AI platform that promises to transform how businesses operate.',
    summary: 'A leading tech company unveiled a groundbreaking AI platform designed to revolutionize business operations through advanced machine learning capabilities.',
    sentiment: 'positive',
    sentimentExplanation: 'The article conveys enthusiasm about technological advancement and economic growth potential.',
    topics: ['Technology', 'AI', 'Business'],
    isRead: false,
    isSaved: false
  },
  {
    id: '2',
    title: 'Global Markets Face Uncertainty Amid Economic Concerns',
    source: 'Financial Times',
    author: 'Sarah Johnson',
    publishedAt: '2023-08-14T14:45:00Z',
    url: 'https://example.com/article2',
    urlToImage: 'https://source.unsplash.com/random/800x600?finance',
    description: 'Financial markets worldwide are experiencing volatility as economic indicators suggest potential challenges ahead.',
    summary: 'Global markets are showing signs of instability due to concerns about inflation, interest rates, and supply chain issues affecting multiple sectors.',
    sentiment: 'negative',
    sentimentExplanation: 'The article expresses worry about economic instability and market downturns.',
    topics: ['Finance', 'Economics', 'Markets'],
    isRead: true,
    isSaved: true
  },
  {
    id: '3',
    title: 'New Study Reveals Promising Treatment for Chronic Condition',
    source: 'Medical News Today',
    author: 'Dr. Michael Chen',
    publishedAt: '2023-08-14T09:15:00Z',
    url: 'https://example.com/article3',
    urlToImage: 'https://source.unsplash.com/random/800x600?medical',
    description: 'Researchers have identified a potential breakthrough treatment for a common chronic health condition.',
    summary: 'A clinical study has shown promising results for a new treatment approach to a widespread chronic condition, potentially improving quality of life for millions.',
    sentiment: 'positive',
    sentimentExplanation: 'The article conveys hope and optimism about medical advances improving health outcomes.',
    topics: ['Health', 'Medical Research', 'Science'],
    isRead: false,
    isSaved: false
  },
  {
    id: '4',
    title: 'Climate Change Report Warns of Accelerating Environmental Impact',
    source: 'Nature',
    author: 'Emma Roberts',
    publishedAt: '2023-08-13T16:20:00Z',
    url: 'https://example.com/article4',
    urlToImage: 'https://source.unsplash.com/random/800x600?climate',
    description: 'A new scientific assessment indicates that climate change effects are occurring faster than previously predicted.',
    summary: 'Latest climate research shows environmental changes accelerating at an alarming rate, with potentially severe consequences for ecosystems and communities worldwide.',
    sentiment: 'negative',
    sentimentExplanation: 'The article expresses alarm about environmental degradation and its consequences.',
    topics: ['Environment', 'Climate', 'Science'],
    isRead: false,
    isSaved: false
  },
  {
    id: '5',
    title: 'Sports Team Celebrates Historic Championship Victory',
    source: 'Sports Illustrated',
    author: 'James Wilson',
    publishedAt: '2023-08-13T22:05:00Z',
    url: 'https://example.com/article5',
    urlToImage: 'https://source.unsplash.com/random/800x600?sports',
    description: 'The underdog team has achieved an unexpected championship win, marking a significant moment in sports history.',
    summary: 'In a stunning upset, the underdog team secured a historic championship victory, overcoming significant challenges through teamwork and perseverance.',
    sentiment: 'positive',
    sentimentExplanation: 'The article conveys excitement, joy, and celebration of achievement.',
    topics: ['Sports', 'Entertainment'],
    isRead: true,
    isSaved: false
  },
  {
    id: '6',
    title: 'Political Leaders Discuss International Cooperation at Summit',
    source: 'Reuters',
    author: 'David Miller',
    publishedAt: '2023-08-12T11:30:00Z',
    url: 'https://example.com/article6',
    urlToImage: 'https://source.unsplash.com/random/800x600?politics',
    description: 'World leaders have gathered to address global challenges through diplomatic discussions.',
    summary: 'An international summit brought together key political figures to discuss trade relations, security concerns, and collaborative approaches to global issues.',
    sentiment: 'neutral',
    sentimentExplanation: 'The article presents a balanced view of diplomatic efforts without strong emotional bias.',
    topics: ['Politics', 'World', 'Diplomacy'],
    isRead: false,
    isSaved: true
  }
];

const mockUser: User = {
  id: 'user123',
  email: 'user@example.com',
  name: 'Test User',
  preferences: {
    topics: ['Technology', 'Health', 'Science'],
    sources: ['TechCrunch', 'Medical News Today', 'Nature'],
    keywords: ['AI', 'research', 'innovation']
  }
};

const mockDashboardStats: DashboardStats = {
  totalArticles: 24,
  readArticles: 10,
  savedArticles: 8,
  sentimentBreakdown: {
    positive: 14,
    neutral: 6,
    negative: 4
  }
};

// Simulate API calls with setTimeout
export const fetchArticles = (): Promise<Article[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockArticles);
    }, 800);
  });
};

export const fetchArticleById = (id: string): Promise<Article | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const article = mockArticles.find(a => a.id === id) || null;
      resolve(article);
    }, 500);
  });
};

export const fetchUserProfile = (): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUser);
    }, 600);
  });
};

export const fetchDashboardStats = (): Promise<DashboardStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDashboardStats);
    }, 700);
  });
};

export const updateUserPreferences = (preferences: UserPreferences): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedUser = { ...mockUser, preferences };
      resolve(updatedUser);
    }, 800);
  });
};

export const saveArticle = (articleId: string, saved: boolean): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would update the database
      const article = mockArticles.find(a => a.id === articleId);
      if (article) {
        article.isSaved = saved;
      }
      resolve();
    }, 500);
  });
};

export const markArticleAsRead = (articleId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would update the database
      const article = mockArticles.find(a => a.id === articleId);
      if (article) {
        article.isRead = true;
      }
      resolve();
    }, 500);
  });
};
