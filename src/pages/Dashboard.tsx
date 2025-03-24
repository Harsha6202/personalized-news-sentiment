
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  Filter, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart3,
  FileText,
  Clock,
  Bookmark
} from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import NewsCard from '@/components/ui-components/NewsCard';
import TopicBadge from '@/components/ui-components/TopicBadge';
import { Article, SentimentType } from '@/types/news';
import { fetchArticles, fetchDashboardStats, fetchUserProfile, saveArticle } from '@/utils/news-service';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSentiment, setSelectedSentiment] = useState<SentimentType | null>(null);
  
  const { data: articles, isLoading: isLoadingArticles } = useQuery({
    queryKey: ['dashboardArticles'],
    queryFn: fetchArticles,
  });
  
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });
  
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });
  
  // Get all unique topics from the articles
  const allTopics = articles 
    ? [...new Set(articles.flatMap(article => article.topics))]
    : [];
  
  // Filter articles based on selected topics and sentiment
  const filteredArticles = articles ? articles.filter(article => {
    const matchesTopic = selectedTopics.length === 0 || 
      article.topics.some(topic => selectedTopics.includes(topic));
    
    const matchesSentiment = !selectedSentiment || 
      article.sentiment === selectedSentiment;
    
    return matchesTopic && matchesSentiment;
  }) : [];
  
  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };
  
  const setSentimentFilter = (sentiment: SentimentType | null) => {
    setSelectedSentiment(sentiment === selectedSentiment ? null : sentiment);
  };
  
  const handleSaveArticle = async (article: Article) => {
    try {
      await saveArticle(article.id, !article.isSaved);
      
      // Update the UI optimistically
      if (articles) {
        const updatedArticle = articles.find(a => a.id === article.id);
        if (updatedArticle) {
          updatedArticle.isSaved = !updatedArticle.isSaved;
        }
      }
      
      toast({
        title: article.isSaved ? "Article Removed" : "Article Saved",
        description: article.isSaved 
          ? "The article has been removed from your saved items." 
          : "The article has been saved to your profile.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the article. Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  const handleShareArticle = (article: Article) => {
    // In a real app, this would open a share dialog
    navigator.clipboard.writeText(article.url);
    toast({
      title: "Link Copied",
      description: "Article link has been copied to clipboard.",
    });
  };
  
  return (
    <MainLayout>
      <section className="py-10">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              {/* User Welcome Section */}
              {!isLoadingUser && user && (
                <div className="bg-card rounded-lg border p-4">
                  <h2 className="text-lg font-medium mb-2">
                    Welcome, {user.name || user.email}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your personalized news dashboard
                  </p>
                  
                  {!isLoadingStats && stats && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex flex-col p-2 rounded-md bg-secondary">
                        <span className="text-muted-foreground">Articles</span>
                        <span className="font-medium">{stats.totalArticles}</span>
                      </div>
                      <div className="flex flex-col p-2 rounded-md bg-secondary">
                        <span className="text-muted-foreground">Read</span>
                        <span className="font-medium">{stats.readArticles}</span>
                      </div>
                      <div className="flex flex-col p-2 rounded-md bg-secondary">
                        <span className="text-muted-foreground">Saved</span>
                        <span className="font-medium">{stats.savedArticles}</span>
                      </div>
                      <div className="flex flex-col p-2 rounded-md bg-secondary">
                        <span className="text-muted-foreground">Topics</span>
                        <span className="font-medium">{user.preferences.topics.length}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Stats Section */}
              {!isLoadingStats && stats && (
                <div className="bg-card rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 size={16} className="text-primary" />
                    <h3 className="font-medium">Sentiment Breakdown</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-sentiment-positive" />
                        <span className="text-sm">Positive</span>
                      </div>
                      <span className="text-sm font-medium">{stats.sentimentBreakdown.positive}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Minus size={14} className="text-sentiment-neutral" />
                        <span className="text-sm">Neutral</span>
                      </div>
                      <span className="text-sm font-medium">{stats.sentimentBreakdown.neutral}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown size={14} className="text-sentiment-negative" />
                        <span className="text-sm">Negative</span>
                      </div>
                      <span className="text-sm font-medium">{stats.sentimentBreakdown.negative}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Topics Filter */}
              <div className="bg-card rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={16} className="text-primary" />
                  <h3 className="font-medium">Topics</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {allTopics.map(topic => (
                    <TopicBadge
                      key={topic}
                      topic={topic}
                      active={selectedTopics.includes(topic)}
                      onClick={() => toggleTopic(topic)}
                    />
                  ))}
                </div>
              </div>
              
              {/* Sentiment Filter */}
              <div className="bg-card rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Filter size={16} className="text-primary" />
                  <h3 className="font-medium">Sentiment</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-sm transition-colors ${
                      selectedSentiment === 'positive'
                        ? 'bg-sentiment-positive/10 text-sentiment-positive border-sentiment-positive/30'
                        : 'bg-secondary text-secondary-foreground border-secondary'
                    }`}
                    onClick={() => setSentimentFilter('positive')}
                  >
                    <TrendingUp size={14} />
                    <span>Positive</span>
                  </button>
                  
                  <button
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-sm transition-colors ${
                      selectedSentiment === 'neutral'
                        ? 'bg-sentiment-neutral/10 text-sentiment-neutral border-sentiment-neutral/30'
                        : 'bg-secondary text-secondary-foreground border-secondary'
                    }`}
                    onClick={() => setSentimentFilter('neutral')}
                  >
                    <Minus size={14} />
                    <span>Neutral</span>
                  </button>
                  
                  <button
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-sm transition-colors ${
                      selectedSentiment === 'negative'
                        ? 'bg-sentiment-negative/10 text-sentiment-negative border-sentiment-negative/30'
                        : 'bg-secondary text-secondary-foreground border-secondary'
                    }`}
                    onClick={() => setSentimentFilter('negative')}
                  >
                    <TrendingDown size={14} />
                    <span>Negative</span>
                  </button>
                </div>
              </div>
              
              {/* Quick Links */}
              <div className="bg-card rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-primary" />
                  <h3 className="font-medium">Quick Access</h3>
                </div>
                
                <div className="space-y-2">
                  <Link
                    to="/dashboard?filter=recent"
                    className="flex items-center gap-2 p-2 hover:bg-secondary rounded-md w-full text-sm"
                  >
                    <Clock size={14} />
                    <span>Recently Added</span>
                  </Link>
                  
                  <Link
                    to="/dashboard?filter=saved"
                    className="flex items-center gap-2 p-2 hover:bg-secondary rounded-md w-full text-sm"
                  >
                    <Bookmark size={14} />
                    <span>Saved Articles</span>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-9 space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full rounded-lg border bg-white px-10 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              
              {/* Articles Grid */}
              {isLoadingArticles ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="border rounded-lg bg-card overflow-hidden animate-pulse">
                      <div className="w-full h-48 bg-muted" />
                      <div className="p-5 space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                        <div className="space-y-2">
                          <div className="h-3 bg-muted rounded w-full" />
                          <div className="h-3 bg-muted rounded w-full" />
                          <div className="h-3 bg-muted rounded w-2/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {filteredArticles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="rounded-full bg-muted p-3 mb-3">
                        <Search className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">No articles found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your filters or search terms
                      </p>
                      <button
                        onClick={() => {
                          setSelectedTopics([]);
                          setSelectedSentiment(null);
                        }}
                        className="text-sm text-primary hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredArticles.map(article => (
                        <NewsCard
                          key={article.id}
                          article={article}
                          onSave={() => handleSaveArticle(article)}
                          onShare={() => handleShareArticle(article)}
                          onView={() => {
                            // In a real app, this would navigate to the article detail page
                            window.open(article.url, '_blank');
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Dashboard;
