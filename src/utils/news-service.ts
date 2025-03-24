import { Article, SentimentType, User, UserPreferences, DashboardStats } from '@/types/news';
import { executeGraphqlQuery } from './hasura-service';

// Function to fetch articles with authentication
export const fetchArticles = async (token: string): Promise<Article[]> => {
  try {
    const query = `
      query GetArticles {
        articles {
          id
          title
          source
          author
          publishedAt
          url
          urlToImage
          description
          content
          summary
          sentiment
          sentimentExplanation
          topics
          isRead
          isSaved
        }
      }
    `;

    const response = await executeGraphqlQuery<{ articles: Article[] }>(query, {}, token);
    return response.data.articles;
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    throw error;
  }
};

export const fetchArticleById = async (id: string, token: string): Promise<Article | null> => {
  try {
    const query = `
      query GetArticle($id: String!) {
        article(id: $id) {
          id
          title
          source
          author
          publishedAt
          url
          urlToImage
          description
          content
          summary
          sentiment
          sentimentExplanation
          topics
          isRead
          isSaved
        }
      }
    `;

    const response = await executeGraphqlQuery<{ article: Article | null }>(
      query, 
      { id }, 
      token
    );
    return response.data.article;
  } catch (error) {
    console.error('Failed to fetch article by ID:', error);
    throw error;
  }
};

export const fetchUserProfile = async (token: string): Promise<User> => {
  try {
    const query = `
      query GetUserProfile {
        user {
          id
          email
          name
          isEmailVerified
          preferences {
            topics
            sources
            keywords
            excludeKeywords
          }
        }
      }
    `;

    const response = await executeGraphqlQuery<{ user: User }>(query, {}, token);
    return response.data.user;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};

export const fetchDashboardStats = async (token: string): Promise<DashboardStats> => {
  try {
    const query = `
      query GetDashboardStats {
        dashboardStats {
          totalArticles
          readArticles
          savedArticles
          sentimentBreakdown {
            positive
            neutral
            negative
          }
        }
      }
    `;

    const response = await executeGraphqlQuery<{ dashboardStats: DashboardStats }>(
      query, 
      {}, 
      token
    );
    return response.data.dashboardStats;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    throw error;
  }
};

export const updateUserPreferences = async (
  preferences: UserPreferences, 
  token: string
): Promise<User> => {
  try {
    const mutation = `
      mutation UpdateUserPreferences($preferences: UserPreferencesInput!) {
        updateUserPreferences(preferences: $preferences) {
          id
          email
          name
          isEmailVerified
          preferences {
            topics
            sources
            keywords
            excludeKeywords
          }
        }
      }
    `;

    const response = await executeGraphqlQuery<{ updateUserPreferences: User }>(
      mutation, 
      { preferences }, 
      token
    );
    return response.data.updateUserPreferences;
  } catch (error) {
    console.error('Failed to update user preferences:', error);
    throw error;
  }
};

export const saveArticle = async (
  articleId: string, 
  saved: boolean, 
  token: string
): Promise<void> => {
  try {
    const mutation = `
      mutation SaveArticle($articleId: String!, $saved: Boolean!) {
        saveArticle(articleId: $articleId, saved: $saved) {
          success
        }
      }
    `;

    await executeGraphqlQuery<{ saveArticle: { success: boolean } }>(
      mutation, 
      { articleId, saved }, 
      token
    );
  } catch (error) {
    console.error('Failed to save article:', error);
    throw error;
  }
};

export const markArticleAsRead = async (
  articleId: string,
  token: string
): Promise<void> => {
  try {
    const mutation = `
      mutation MarkArticleAsRead($articleId: String!) {
        markArticleAsRead(articleId: $articleId) {
          success
        }
      }
    `;

    await executeGraphqlQuery<{ markArticleAsRead: { success: boolean } }>(
      mutation, 
      { articleId }, 
      token
    );
  } catch (error) {
    console.error('Failed to mark article as read:', error);
    throw error;
  }
};

// Mock data just for development/testing - will be removed in production
export const getMockArticles = (): Article[] => {
  return [
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
};
