
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedNewsSection from '@/components/sections/FeaturedNewsSection';
import PreferencesSection from '@/components/sections/PreferencesSection';
import { Article } from '@/types/news';
import { fetchArticles } from '@/utils/news-service';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

const Index = () => {
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['featuredArticles'],
    queryFn: fetchArticles,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load articles. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error]);

  return (
    <MainLayout>
      <HeroSection />
      
      {!isLoading && articles && articles.length > 0 && (
        <FeaturedNewsSection articles={articles} />
      )}
      
      <PreferencesSection />
    </MainLayout>
  );
};

export default Index;
