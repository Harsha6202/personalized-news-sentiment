
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Plus, Save, RefreshCw } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import TopicBadge from '@/components/ui-components/TopicBadge';
import { UserPreferences } from '@/types/news';
import { fetchUserProfile, updateUserPreferences } from '@/utils/news-service';
import { toast } from '@/hooks/use-toast';
import FadeInSection from '@/components/ui-components/FadeInSection';

const commonTopics = [
  'Technology', 'Business', 'Science', 'Health', 'Entertainment', 
  'Sports', 'Politics', 'World', 'Environment', 'Education',
  'Finance', 'Art', 'Food', 'Travel', 'Fashion', 'Music',
  'Books', 'Gaming', 'Automotive', 'Real Estate'
];

const commonSources = [
  'BBC News', 'CNN', 'The New York Times', 'Reuters', 'Associated Press',
  'The Guardian', 'The Washington Post', 'Bloomberg', 'CNBC', 'TechCrunch',
  'Wired', 'National Geographic', 'The Economist', 'Time', 'Forbes'
];

const Preferences = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    topics: [],
    sources: [],
    keywords: [],
    excludeKeywords: []
  });
  
  const [newKeyword, setNewKeyword] = useState('');
  const [newExcludeKeyword, setNewExcludeKeyword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize preferences from user data when it loads
  React.useEffect(() => {
    if (user && user.preferences) {
      setPreferences(user.preferences);
    }
  }, [user]);
  
  const toggleTopic = (topic: string) => {
    setPreferences(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };
  
  const toggleSource = (source: string) => {
    setPreferences(prev => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source]
    }));
  };
  
  const addKeyword = () => {
    if (newKeyword.trim() && !preferences.keywords.includes(newKeyword.trim())) {
      setPreferences(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };
  
  const removeKeyword = (keyword: string) => {
    setPreferences(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };
  
  const addExcludeKeyword = () => {
    if (newExcludeKeyword.trim() && !preferences.excludeKeywords?.includes(newExcludeKeyword.trim())) {
      setPreferences(prev => ({
        ...prev,
        excludeKeywords: [...(prev.excludeKeywords || []), newExcludeKeyword.trim()]
      }));
      setNewExcludeKeyword('');
    }
  };
  
  const removeExcludeKeyword = (keyword: string) => {
    setPreferences(prev => ({
      ...prev,
      excludeKeywords: prev.excludeKeywords?.filter(k => k !== keyword)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await updateUserPreferences(preferences);
      toast({
        title: "Success",
        description: "Your preferences have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const resetPreferences = () => {
    if (user && user.preferences) {
      setPreferences(user.preferences);
      toast({
        title: "Reset",
        description: "Preferences have been reset to your saved settings.",
      });
    }
  };
  
  return (
    <MainLayout>
      <section className="py-10">
        <div className="container max-w-4xl">
          <FadeInSection>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Your News Preferences</h1>
              <p className="text-lg text-muted-foreground">
                Customize your news feed to match your interests
              </p>
            </div>
          </FadeInSection>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <FadeInSection delay={100} className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-medium mb-4">Topics of Interest</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Select topics you're interested in to personalize your news feed.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {commonTopics.map(topic => (
                    <TopicBadge
                      key={topic}
                      topic={topic}
                      size="lg"
                      active={preferences.topics.includes(topic)}
                      onClick={() => toggleTopic(topic)}
                    />
                  ))}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {preferences.topics.length} topic{preferences.topics.length !== 1 ? 's' : ''} selected
                </div>
              </FadeInSection>
              
              <FadeInSection delay={200} className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-medium mb-4">Preferred News Sources</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose which news sources you prefer to see articles from.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {commonSources.map(source => (
                    <button
                      key={source}
                      type="button"
                      onClick={() => toggleSource(source)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        preferences.sources.includes(source)
                          ? 'bg-primary/10 text-primary border-primary/30'
                          : 'bg-secondary text-secondary-foreground border-secondary'
                      }`}
                    >
                      {source}
                    </button>
                  ))}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {preferences.sources.length} source{preferences.sources.length !== 1 ? 's' : ''} selected
                </div>
              </FadeInSection>
              
              <FadeInSection delay={300} className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-medium mb-4">Keywords</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add keywords you're interested in to find more relevant content.
                    </p>
                    
                    <div className="flex mb-4">
                      <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        placeholder="Enter keyword..."
                        className="flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={addKeyword}
                        className="h-10 rounded-r-md border border-l-0 bg-primary px-3 text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {preferences.keywords.map(keyword => (
                        <div
                          key={keyword}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md border border-primary/30"
                        >
                          <span className="text-sm">{keyword}</span>
                          <button
                            type="button"
                            onClick={() => removeKeyword(keyword)}
                            className="text-primary hover:text-primary/80"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      
                      {preferences.keywords.length === 0 && (
                        <p className="text-sm text-muted-foreground">No keywords added yet.</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add keywords you want to exclude from your news feed.
                    </p>
                    
                    <div className="flex mb-4">
                      <input
                        type="text"
                        value={newExcludeKeyword}
                        onChange={(e) => setNewExcludeKeyword(e.target.value)}
                        placeholder="Enter keyword to exclude..."
                        className="flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={addExcludeKeyword}
                        className="h-10 rounded-r-md border border-l-0 bg-primary px-3 text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {preferences.excludeKeywords?.map(keyword => (
                        <div
                          key={keyword}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-destructive/10 text-destructive rounded-md border border-destructive/30"
                        >
                          <span className="text-sm">{keyword}</span>
                          <button
                            type="button"
                            onClick={() => removeExcludeKeyword(keyword)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      
                      {!preferences.excludeKeywords?.length && (
                        <p className="text-sm text-muted-foreground">No excluded keywords added yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={400} className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={resetPreferences}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 border border-input bg-background hover:bg-secondary"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </button>
                
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Preferences
                    </>
                  )}
                </button>
              </FadeInSection>
            </form>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Preferences;
