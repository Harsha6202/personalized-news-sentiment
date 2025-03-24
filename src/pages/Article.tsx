
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Bookmark, Share2, Calendar, User } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import SentimentBadge from '@/components/ui-components/SentimentBadge';
import TopicBadge from '@/components/ui-components/TopicBadge';
import { fetchArticleById, saveArticle } from '@/utils/news-service';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import FadeInSection from '@/components/ui-components/FadeInSection';

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchArticleById(id || ''),
    enabled: !!id,
  });
  
  const handleSaveArticle = async () => {
    if (!article) return;
    
    try {
      await saveArticle(article.id, !article.isSaved);
      
      // Update the UI optimistically
      article.isSaved = !article.isSaved;
      
      toast({
        title: article.isSaved ? "Article Saved" : "Article Removed",
        description: article.isSaved 
          ? "The article has been saved to your profile." 
          : "The article has been removed from your saved items.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the article. Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  const handleShareArticle = () => {
    if (!article) return;
    
    // In a real app, this would open a share dialog
    navigator.clipboard.writeText(article.url);
    toast({
      title: "Link Copied",
      description: "Article link has been copied to clipboard.",
    });
  };
  
  // Format the date in a readable format
  const formatDateLong = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4" />
            <div className="h-12 bg-muted rounded w-2/3 mb-6" />
            <div className="h-72 bg-muted rounded mb-6" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !article) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-3">Article Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 border border-input bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <section className="relative py-10">
        <div className="container max-w-4xl">
          <FadeInSection>
            <button
              onClick={() => navigate(-1)}
              className="mb-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 border border-input bg-background hover:bg-secondary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <SentimentBadge sentiment={article.sentiment} size="lg" />
              {article.topics.map(topic => (
                <TopicBadge key={topic} topic={topic} size="lg" />
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              <div className="flex items-center">
                <User size={16} className="mr-1" />
                <span>{article.author || article.source}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{formatDateLong(article.publishedAt)}</span>
              </div>
              <div className="flex-1" />
              <button
                onClick={handleSaveArticle}
                className="inline-flex items-center justify-center h-8 px-3 rounded-md border transition-colors hover:bg-secondary"
              >
                <Bookmark size={16} className={`mr-1.5 ${article.isSaved ? 'fill-primary text-primary' : ''}`} />
                <span>{article.isSaved ? 'Saved' : 'Save'}</span>
              </button>
              <button
                onClick={handleShareArticle}
                className="inline-flex items-center justify-center h-8 px-3 rounded-md border transition-colors hover:bg-secondary"
              >
                <Share2 size={16} className="mr-1.5" />
                <span>Share</span>
              </button>
            </div>
          </FadeInSection>
          
          {article.urlToImage && (
            <FadeInSection delay={200}>
              <div className="relative h-[400px] mb-8 overflow-hidden rounded-xl">
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </FadeInSection>
          )}
          
          <FadeInSection delay={300}>
            <div className="bg-card border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-medium mb-3">AI Summary</h2>
              <p className="text-lg leading-relaxed">{article.summary}</p>
            </div>
          </FadeInSection>
          
          <FadeInSection delay={400}>
            <div className="prose prose-lg max-w-none">
              <h2>Sentiment Analysis</h2>
              <div className="not-prose bg-secondary/50 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <SentimentBadge sentiment={article.sentiment} size="lg" />
                  <h3 className="text-lg font-medium">
                    This article has a {article.sentiment} sentiment
                  </h3>
                </div>
                {article.sentimentExplanation && (
                  <p className="text-muted-foreground">{article.sentimentExplanation}</p>
                )}
              </div>
              
              <h2>Full Article</h2>
              <p>{article.content || article.description}</p>
              
              <div className="mt-6 not-prose">
                <Link
                  to={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Read Original Article
                </Link>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </MainLayout>
  );
};

export default Article;
