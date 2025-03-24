
import React from 'react';
import { cn } from '@/lib/utils';

interface TopicBadgeProps {
  topic: string;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const TopicBadge: React.FC<TopicBadgeProps> = ({
  topic,
  size = 'md',
  active = false,
  onClick,
  className,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-all duration-200',
        sizeClasses[size],
        onClick ? 'cursor-pointer hover:bg-secondary' : '',
        active
          ? 'bg-primary/10 text-primary border-primary/30'
          : 'bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/80',
        className
      )}
      onClick={onClick}
    >
      {topic}
    </span>
  );
};

export default TopicBadge;
