import React, { useState } from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  technique?: string;
  artifacts?: string[];
}

interface TimelineProps {
  events: TimelineEvent[];
  onAddEvent: () => void;
  onSelectEvent: (event: TimelineEvent) => void;
  onUpdateEvent: (event: TimelineEvent) => void;
}

const Timeline: React.FC<TimelineProps> = ({ events, onAddEvent, onSelectEvent, onUpdateEvent }) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
    onSelectEvent(event);
  };

  const handleSave = () => {
    if (selectedEvent) {
      onUpdateEvent(selectedEvent);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="h-full bg-background/50 backdrop-blur">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Timeline</h2>
          <Button onClick={onAddEvent} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-10rem)] p-4">
          <div className="relative">
            <div className="timeline-connector" />
            {events.map((event) => (
              <div
                key={event.id}
                className="timeline-event mb-8 ml-8 animate-fade-in cursor-pointer hover:bg-accent/50 p-4 rounded-lg transition-colors"
                onClick={() => handleEventClick(event)}
              >
                <div className="text-sm text-muted-foreground">{event.timestamp}</div>
                <div className="font-medium">{event.title || "New Event"}</div>
                <div className="text-sm mt-1">{event.description}</div>
                {event.technique && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                      {event.technique}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="timestamp">Timestamp</Label>
              <Input
                id="timestamp"
                type="datetime-local"
                value={selectedEvent?.timestamp || ''}
                onChange={(e) => {
                  if (selectedEvent) {
                    setSelectedEvent({
                      ...selectedEvent,
                      timestamp: e.target.value,
                    });
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={selectedEvent?.title || ''}
                onChange={(e) => {
                  if (selectedEvent) {
                    setSelectedEvent({
                      ...selectedEvent,
                      title: e.target.value,
                    });
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={selectedEvent?.description || ''}
                onChange={(e) => {
                  if (selectedEvent) {
                    setSelectedEvent({
                      ...selectedEvent,
                      description: e.target.value,
                    });
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="technique">MITRE Technique</Label>
              <Input
                id="technique"
                value={selectedEvent?.technique || ''}
                onChange={(e) => {
                  if (selectedEvent) {
                    setSelectedEvent({
                      ...selectedEvent,
                      technique: e.target.value,
                    });
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Timeline;