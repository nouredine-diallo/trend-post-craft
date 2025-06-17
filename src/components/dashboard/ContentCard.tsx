
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Image, 
  Video, 
  Send, 
  Clock, 
  Eye, 
  Calendar,
  Instagram,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';

const ContentCard = ({ content, onPublish, onSchedule }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'published': return 'bg-purple-100 text-purple-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'tiktok': return <Video className="h-4 w-4" />;
      default: return <Image className="h-4 w-4" />;
    }
  };

  const handlePublishClick = () => {
    onPublish(content.id, content.platforms);
  };

  const handleScheduleClick = () => {
    const scheduledTime = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours from now
    onSchedule(content.id, scheduledTime);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        {content.thumbnail ? (
          <img 
            src={content.thumbnail} 
            alt={content.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
            {content.type === 'video' ? (
              <Video className="h-12 w-12 text-purple-600" />
            ) : (
              <Image className="h-12 w-12 text-purple-600" />
            )}
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <Badge className={getStatusColor(content.status)}>
            {content.status}
          </Badge>
        </div>
        
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className="bg-white/90">
            {content.type === 'video' ? (
              <>
                <Video className="h-3 w-3 mr-1" />
                Video
              </>
            ) : (
              <>
                <Image className="h-3 w-3 mr-1" />
                Image
              </>
            )}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg leading-tight">{content.title}</CardTitle>
        <CardDescription className="text-sm">
          {content.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Platforms */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Platforms:</span>
          <div className="flex space-x-1">
            {content.platforms.map((platform) => (
              <div 
                key={platform}
                className="p-1 bg-gray-100 rounded"
                title={platform}
              >
                {getPlatformIcon(platform)}
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled time */}
        {content.scheduledFor && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(content.scheduledFor).toLocaleString()}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{content.title}</DialogTitle>
                <DialogDescription>{content.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {content.thumbnail && (
                  <img 
                    src={content.thumbnail} 
                    alt={content.title}
                    className="w-full rounded-lg"
                  />
                )}
                <div className="text-sm text-gray-600">
                  <p><strong>Type:</strong> {content.type}</p>
                  <p><strong>Platforms:</strong> {content.platforms.join(', ')}</p>
                  <p><strong>Status:</strong> {content.status}</p>
                  {content.scheduledFor && (
                    <p><strong>Scheduled:</strong> {new Date(content.scheduledFor).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {content.status === 'ready' && (
            <>
              <Button 
                size="sm" 
                onClick={handlePublishClick}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Publish
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleScheduleClick}
              >
                <Clock className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </>
          )}

          {content.status === 'generating' && (
            <Button size="sm" disabled className="flex-1">
              Generating...
            </Button>
          )}

          {content.status === 'scheduled' && (
            <Button size="sm" disabled variant="outline" className="flex-1">
              <Clock className="h-4 w-4 mr-2" />
              Scheduled
            </Button>
          )}

          {content.status === 'published' && (
            <Button size="sm" disabled variant="outline" className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Published
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentCard;
