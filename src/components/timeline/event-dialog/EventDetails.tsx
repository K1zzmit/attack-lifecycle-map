import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import type { TimelineEvent } from '@/pages/Index';

interface EventDetailsProps {
  event: TimelineEvent;
  onEventChange: (event: TimelineEvent) => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onEventChange,
}) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onEventChange({
        ...event,
        attachedFile: file.name,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="searchQuery">Search Query Used</Label>
        <Input
          id="searchQuery"
          value={event.searchQuery || ''}
          onChange={(e) => onEventChange({ ...event, searchQuery: e.target.value })}
          placeholder="Enter the search query used to find this event"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="rawLog">Raw Log</Label>
        <Textarea
          id="rawLog"
          value={event.rawLog || ''}
          onChange={(e) => onEventChange({ ...event, rawLog: e.target.value })}
          placeholder="Paste the raw log data here"
          className="font-mono text-sm"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="file">Attach File</Label>
        <div className="flex items-center gap-2">
          <Input
            id="file"
            type="file"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('file')?.click()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {event.attachedFile || 'Upload File'}
          </Button>
          {event.attachedFile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEventChange({ ...event, attachedFile: undefined })}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};