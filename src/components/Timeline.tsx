import React from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';

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
}

const Timeline: React.FC<TimelineProps> = ({ events, onAddEvent, onSelectEvent }) => {
  return (
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
              className="timeline-event mb-8 ml-8 animate-fade-in"
              onClick={() => onSelectEvent(event)}
            >
              <div className="text-sm text-muted-foreground">{event.timestamp}</div>
              <div className="font-medium">{event.title}</div>
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
  );
};

export default Timeline;