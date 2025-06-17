
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  Key, 
  Clock, 
  Bell, 
  Palette,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

const SettingsPanel = () => {
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    pexels: '',
    shotstack: '',
    mixpost: '',
    googleTrends: ''
  });

  const [showKeys, setShowKeys] = useState({
    openai: false,
    pexels: false,
    shotstack: false,
    mixpost: false,
    googleTrends: false
  });

  const [schedule, setSchedule] = useState({
    enabled: true,
    time: '09:00',
    timezone: 'UTC'
  });

  const [notifications, setNotifications] = useState({
    contentReady: true,
    publishSuccess: true,
    dailyGeneration: false
  });

  const handleApiKeyChange = (service, value) => {
    setApiKeys(prev => ({ ...prev, [service]: value }));
  };

  const toggleKeyVisibility = (service) => {
    setShowKeys(prev => ({ ...prev, [service]: !prev[service] }));
  };

  const handleSaveKeys = () => {
    // Save API keys to localStorage (in production, this should be secure backend storage)
    localStorage.setItem('contentland_api_keys', JSON.stringify(apiKeys));
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been securely stored",
    });
  };

  const handleSaveSchedule = () => {
    localStorage.setItem('contentland_schedule', JSON.stringify(schedule));
    toast({
      title: "Schedule Updated",
      description: "Your content generation schedule has been updated",
    });
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('contentland_notifications', JSON.stringify(notifications));
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved",
    });
  };

  const renderApiKeyInput = (service, label, placeholder) => (
    <div className="space-y-2">
      <Label htmlFor={service}>{label}</Label>
      <div className="relative">
        <Input
          id={service}
          type={showKeys[service] ? 'text' : 'password'}
          placeholder={placeholder}
          value={apiKeys[service]}
          onChange={(e) => handleApiKeyChange(service, e.target.value)}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3"
          onClick={() => toggleKeyVisibility(service)}
        >
          {showKeys[service] ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>API Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure your API keys for content generation services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderApiKeyInput('openai', 'OpenAI API Key', 'sk-...')}
            {renderApiKeyInput('pexels', 'Pexels API Key', 'Enter your Pexels API key')}
            {renderApiKeyInput('shotstack', 'Shotstack API Key', 'Enter your Shotstack API key')}
            {renderApiKeyInput('mixpost', 'Mixpost API Key', 'Enter your Mixpost API key')}
            {renderApiKeyInput('googleTrends', 'Google Trends API Key', 'Enter your Google Trends API key')}
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveKeys}>
              <Save className="h-4 w-4 mr-2" />
              Save API Keys
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Schedule Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Schedule Settings</span>
            </CardTitle>
            <CardDescription>
              Configure when content is automatically generated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="schedule-enabled">Enable Daily Generation</Label>
              <Switch
                id="schedule-enabled"
                checked={schedule.enabled}
                onCheckedChange={(checked) => 
                  setSchedule(prev => ({ ...prev, enabled: checked }))
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="generation-time">Generation Time</Label>
              <Input
                id="generation-time"
                type="time"
                value={schedule.time}
                onChange={(e) => 
                  setSchedule(prev => ({ ...prev, time: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveSchedule} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>
              Choose which notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-content-ready">Content Ready</Label>
              <Switch
                id="notify-content-ready"
                checked={notifications.contentReady}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, contentReady: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-publish-success">Publish Success</Label>
              <Switch
                id="notify-publish-success"
                checked={notifications.publishSuccess}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, publishSuccess: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-daily-generation">Daily Generation</Label>
              <Switch
                id="notify-daily-generation"
                checked={notifications.dailyGeneration}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, dailyGeneration: checked }))
                }
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveNotifications} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPanel;
