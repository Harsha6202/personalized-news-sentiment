
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Newspaper, Zap } from 'lucide-react';
import FadeInSection from '@/components/ui-components/FadeInSection';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32">
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <FadeInSection delay={100}>
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <Zap size={16} className="mr-1" /> Intelligent News Analysis
            </div>
          </FadeInSection>
          
          <FadeInSection delay={200}>
            <h1 className="font-bold tracking-tight mb-6">
              News that understands <span className="text-gradient">how you feel</span>
            </h1>
          </FadeInSection>
          
          <FadeInSection delay={300}>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience personalized news with advanced sentiment analysis. Discover insights, save time, and stay informed with content that matters to you.
            </p>
          </FadeInSection>
          
          <FadeInSection delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex h-12 items-center justify-center rounded-lg border bg-background px-6 font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Learn More
              </Link>
            </div>
          </FadeInSection>
        </div>
      </div>
      
      <FadeInSection delay={500} className="mt-16 md:mt-24">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Newspaper className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Personalized Feed</h3>
              <p className="text-muted-foreground">
                Content curated to your interests and preferences, updated in real-time.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Sentiment Analysis</h3>
              <p className="text-muted-foreground">
                Understand the emotional tone behind every article with advanced AI.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Smart Summaries</h3>
              <p className="text-muted-foreground">
                Get the key points from any article with AI-powered summarization.
              </p>
            </div>
          </div>
        </div>
      </FadeInSection>
      
      {/* Abstract background elements */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
    </section>
  );
};

export default HeroSection;
