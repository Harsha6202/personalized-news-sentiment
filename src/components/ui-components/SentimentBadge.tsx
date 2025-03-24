
import React from 'react';
import { cn } from '@/lib/utils';
import { SentimentType } from '@/types/news';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface SentimentBadgeProps {
  sentiment: SentimentType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showIcon?: boolean;
  className?: string;
}

const SentimentBadge: React.FC<SentimentBadgeProps> = ({
  sentiment,
  size = 'md',
  showLabel = true,
  showIcon = true,
  className,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const iconSizes = {
    sm: { size: 12 },
    md: { size: 14 },
    lg: { size: 16 },
  };

  const getColorClasses = (sentiment: SentimentType) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-sentiment-positive/10 text-sentiment-positive border-sentiment-positive/30';
      case 'neutral':
        return 'bg-sentiment-neutral/10 text-sentiment-neutral border-sentiment-neutral/30';
      case 'negative':
        return 'bg-sentiment-negative/10 text-sentiment-negative border-sentiment-negative/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getIcon = (sentiment: SentimentType) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp {...iconSizes[size]} className="mr-1" />;
      case 'neutral':
        return <Minus {...iconSizes[size]} className="mr-1" />;
      case 'negative':
        return <TrendingDown {...iconSizes[size]} className="mr-1" />;
      default:
        return null;
    }
  };

  const getLabel = (sentiment: SentimentType) => {
    switch (sentiment) {
      case 'positive':
        return 'Positive';
      case 'neutral':
        return 'Neutral';
      case 'negative':
        return 'Negative';
      default:
        return '';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-colors',
        sizeClasses[size],
        getColorClasses(sentiment),
        className
      )}
    >
      {showIcon && getIcon(sentiment)}
      {showLabel && <span>{getLabel(sentiment)}</span>}
    </span>
  );
};

export default SentimentBadge;
