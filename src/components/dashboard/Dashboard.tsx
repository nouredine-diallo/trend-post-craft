
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Settings, 
  LogOut, 
  Sparkles, 
  Image, 
  Video, 
  Clock,
  Send,
  TrendingUp,
  User
} from 'lucide-react';
import ContentCard from './ContentCard';
import SettingsPanel from './SettingsPanel';

const Dashboard = ({ user, onLogout }) => {
  const [todayContent, setTodayContent] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
  const [niche, setNiche] = useState('');

  useEffect(() => {
    const savedNiche = localStorage.getItem('contentland_niche');
    setNiche(savedNiche || 'tech');
    
    // Load today's content
    loadTodayContent();
  }, []);

  const loadTodayContent = () => {
    // Mock data for today's content
    const mockContent = [
      {
        id: '1',
        type: 'image',
        title: 'AI Revolution in 2024',
        description: 'Latest breakthrough in artificial intelligence is changing everything we know about machine learning.',
        status: 'ready',
        scheduledFor: '2024-01-15T14:00:00Z',
        platforms: ['instagram', 'twitter'],
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop'
      },
      {
        id: '2',
        type: 'video',
        title: 'Tech Trends Video',
        description: 'A quick overview of the hottest tech trends that are shaping our future.',
        status: 'generating',
        scheduledFor: '2024-01-15T16:00:00Z',
        platforms: ['tiktok', 'instagram'],
        thumbnail: null
      },
      {
        id: '3',
        type: 'image',
        title: 'Coding Best Practices',
        description: 'Essential coding practices every developer should know in 2024.',
        status: 'ready',
        scheduledFor: '2024-01-15T18:00:00Z',
        platforms: ['linkedin', 'twitter'],
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop'
      },
      {
        id: '4',
        type: 'image',
        title: 'Startup Success Tips',
        description: 'Key strategies that successful startups use to scale their business.',
        status: 'draft',
        scheduledFor: '2024-01-15T20:00:00Z',
        platforms: ['instagram', 'linkedin'],
        thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8edf?w=400&h=400&fit=crop'
      },
      {
        id: '5',
        type: 'video',
        title: 'Future of Work',
        description: 'How remote work and AI are reshaping the modern workplace.',
        status: 'scheduled',
        scheduledFor: '2024-01-15T22:00:00Z',
        platforms: ['tiktok', 'youtube'],
        thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=400&fit=crop'
      }
    ];
    
    setTodayContent(mockContent);
  };

  const generateTodayContent = async () => {
    setIsGenerating(true);
    
    // Simulate content generation
    toast({
      title: "Generating content...",
      description: "Fetching trending topics and creating your daily posts",
    });
    
    setTimeout(() => {
      setIsGenerating(false);
      loadTodayContent();
      toast({
        title: "Content generated!",
        description: "Your 5 daily posts are ready for review",
      });
    }, 3000);
  };

  const handlePublish = (contentId, platforms) => {
    toast({
      title: "Publishing content",
      description: `Publishing to ${platforms.join(', ')}...`,
    });
    
    // Update content status
    setTodayContent(prev => 
      prev.map(item => 
        item.id === contentId 
          ? { ...item, status: 'published' } 
          : item
      )
    );
  };

  const handleSchedule = (contentId, dateTime) => {
    toast({
      title: "Content scheduled",
      description: `Scheduled for ${new Date(dateTime).toLocaleString()}`,
    });
    
    setTodayContent(prev => 
      prev.map(item => 
        item.id === contentId 
          ? { ...item, status: 'scheduled', scheduledFor: dateTime } 
          : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">ContentLand</h1>
              <Badge variant="outline" className="capitalize">{niche}</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Today</p>
                      <p className="text-2xl font-bold text-gray-900">{todayContent.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Send className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Published</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {todayContent.filter(c => c.status === 'published').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Scheduled</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {todayContent.filter(c => c.status === 'scheduled').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ready</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {todayContent.filter(c => c.status === 'ready').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Generation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Today's Content</span>
                </CardTitle>
                <CardDescription>
                  Your daily 5 posts are generated automatically at 9 AM based on trending topics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-gray-600">
                    Last generated: {new Date().toLocaleString()}
                  </div>
                  <Button 
                    onClick={generateTodayContent} 
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isGenerating ? 'Generating...' : 'Regenerate Content'}
                  </Button>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {todayContent.map((content) => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      onPublish={handlePublish}
                      onSchedule={handleSchedule}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content History</CardTitle>
                <CardDescription>
                  View all your previously generated and published content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Content history will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
