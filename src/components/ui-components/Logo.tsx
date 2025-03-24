
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn('font-medium flex items-center gap-2', sizeClasses[size], className)}>
      <div className="relative">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-primary animate-pulse-subtle" />
        </div>
      </div>
      <span className="font-serif tracking-tight">
        Pulse<span className="text-primary font-semibold">News</span>
      </span>
    </div>
  );
};

export default Logo;
