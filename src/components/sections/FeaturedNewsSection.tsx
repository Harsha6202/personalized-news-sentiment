
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import NewsCard from '@/components/ui-components/NewsCard';
import { Article } from '@/types/news';
import FadeInSection from '../ui-components/FadeInSection';

interface FeaturedNewsSectionProps {
  articles: Article[];
}

const FeaturedNewsSection: React.FC<FeaturedNewsSectionProps> = ({ articles }) => {
  // Slice the first article for the featured spot, and the next 4 for the grid
  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1, 5);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Featured News</h2>
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm font-medium text-primary"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FadeInSection delay={100} className="md:col-span-2 lg:col-span-2">
            <NewsCard article={featuredArticle} variant="featured" />
          </FadeInSection>

          <div className="flex flex-col gap-6 md:col-span-1 lg:col-span-1">
            {gridArticles.map((article, index) => (
              <FadeInSection key={article.id} delay={150 + index * 50}>
                <NewsCard article={article} variant="compact" />
              </FadeInSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNewsSection;
