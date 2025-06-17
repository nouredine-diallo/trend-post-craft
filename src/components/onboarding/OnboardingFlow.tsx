
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Sparkles } from 'lucide-react';

const OnboardingFlow = ({ onComplete }) => {
  const [selectedNiche, setSelectedNiche] = useState('');

  const niches = [
    { id: 'tech', name: 'Technology', description: 'AI, gadgets, software updates', emoji: '💻' },
    { id: 'fitness', name: 'Fitness & Health', description: 'Workouts, nutrition, wellness', emoji: '💪' },
    { id: 'business', name: 'Business & Finance', description: 'Startups, investing, productivity', emoji: '💼' },
    { id: 'lifestyle', name: 'Lifestyle', description: 'Fashion, travel, daily tips', emoji: '✨' },
    { id: 'food', name: 'Food & Cooking', description: 'Recipes, restaurants, cooking tips', emoji: '🍳' },
    { id: 'entertainment', name: 'Entertainment', description: 'Movies, music, celebrities', emoji: '🎬' },
    { id: 'education', name: 'Education', description: 'Learning, tutorials, skills', emoji: '📚' },
    { id: 'gaming', name: 'Gaming', description: 'Video games, esports, reviews', emoji: '🎮' },
  ];

  const handleComplete = () => {
    if (selectedNiche) {
      onComplete({ niche: selectedNiche });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Choose Your Niche</h1>
          <p className="text-white/80 text-lg">Select your content focus to get personalized trending topics</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Content Niche Selection</CardTitle>
            <CardDescription className="text-white/70">
              We'll generate trending content specifically for your chosen niche
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {niches.map((niche) => (
                <button
                  key={niche.id}
                  onClick={() => setSelectedNiche(niche.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedNiche === niche.id
                      ? 'border-white bg-white/20 scale-105'
                      : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{niche.emoji}</span>
                    <h3 className="font-semibold text-white">{niche.name}</h3>
                  </div>
                  <p className="text-white/70 text-sm">{niche.description}</p>
                  {selectedNiche === niche.id && (
                    <Badge className="mt-2 bg-white text-purple-600">Selected</Badge>
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleComplete}
                disabled={!selectedNiche}
                className="bg-white text-purple-600 hover:bg-white/90 px-8 py-3 text-lg"
              >
                Continue to Dashboard
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingFlow;
