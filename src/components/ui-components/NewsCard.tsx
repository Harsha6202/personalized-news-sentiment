
import React from 'react';
import { cn } from '@/lib/utils';
import { Article } from '@/types/news';
import SentimentBadge from './SentimentBadge';
import TopicBadge from './TopicBadge';
import { formatDistanceToNow } from 'date-fns';
import { Bookmark, Share2, Eye } from 'lucide-react';

interface NewsCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
  onSave?: (article: Article) => void;
  onShare?: (article: Article) => void;
  onView?: (article: Article) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  article,
  variant = 'default',
  className,
  onSave,
  onShare,
  onView,
}) => {
  // Format the published date
  const formatDate = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  // Determine which layout to use based on the variant
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'group p-4 border rounded-lg bg-card text-card-foreground hover:shadow-md transition-all duration-300',
          className
        )}
      >
        <div className="flex items-start gap-3">
          {article.urlToImage && (
            <div
              className="flex-shrink-0 w-16 h-16 rounded-md bg-center bg-cover"
              style={{ backgroundImage: `url(${article.urlToImage})` }}
            />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-base line-clamp-2 mb-1 group-hover:text-primary transition-colors">
              {article.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{article.source}</span>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
              <SentimentBadge sentiment={article.sentiment} size="sm" showLabel={false} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div
        className={cn(
          'group relative overflow-hidden rounded-xl bg-card text-card-foreground border',
          'transition-all duration-300 hover:shadow-xl',
          className
        )}
      >
        {article.urlToImage && (
          <div
            className="absolute inset-0 w-full h-full bg-center bg-cover"
            style={{ backgroundImage: `url(${article.urlToImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />
          </div>
        )}
        <div className="relative p-6 flex flex-col h-full min-h-[350px] justify-end z-10">
          <div className="flex gap-2 mb-3">
            <SentimentBadge sentiment={article.sentiment} />
            {article.topics.slice(0, 1).map((topic) => (
              <TopicBadge key={topic} topic={topic} />
            ))}
          </div>
          
          <h3 className="text-2xl font-medium mb-3 text-white">
            {article.title}
          </h3>
          
          <p className="line-clamp-2 mb-4 text-gray-200">
            {article.summary || article.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-300">
            <div className="flex items-center">
              <span className="font-medium">{article.source}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSave?.(article)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <Bookmark size={18} className={article.isSaved ? 'fill-white' : ''} />
              </button>
              <button
                onClick={() => onShare?.(article)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={() => onView?.(article)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <Eye size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        'group border rounded-lg bg-card text-card-foreground overflow-hidden',
        'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        className
      )}
    >
      {article.urlToImage && (
        <div
          className="w-full h-48 bg-center bg-cover"
          style={{ backgroundImage: `url(${article.urlToImage})` }}
        />
      )}
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          <SentimentBadge sentiment={article.sentiment} />
          {article.topics.slice(0, 2).map((topic) => (
            <TopicBadge key={topic} topic={topic} />
          ))}
        </div>
        
        <h3 className="text-xl font-medium mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {article.summary || article.description}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <span className="font-medium">{article.source}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSave?.(article)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Bookmark size={18} className={article.isSaved ? 'fill-primary' : ''} />
            </button>
            <button
              onClick={() => onShare?.(article)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={() => onView?.(article)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
