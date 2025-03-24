
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TopicBadge from '../ui-components/TopicBadge';
import FadeInSection from '../ui-components/FadeInSection';

const topicsData = [
  'Technology', 'Business', 'Science', 'Health', 'Entertainment', 
  'Sports', 'Politics', 'World', 'Environment', 'Education'
];

const PreferencesSection: React.FC = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container">
        <FadeInSection>
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Customize Your News Experience
            </h2>
            <p className="text-xl text-muted-foreground">
              Select topics of interest to get personalized news delivered to your dashboard.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={100}>
          <div className="mx-auto max-w-3xl bg-card border rounded-xl p-8 shadow-sm">
            <div className="flex flex-wrap gap-3 mb-8">
              {topicsData.map((topic, index) => (
                <TopicBadge
                  key={topic}
                  topic={topic}
                  size="lg"
                  active={selectedTopics.includes(topic)}
                  onClick={() => toggleTopic(topic)}
                />
              ))}
            </div>

            <div className="flex justify-center">
              <Link
                to="/preferences"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Set More Preferences <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
};

export default PreferencesSection;
