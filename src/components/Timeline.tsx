import React, { useState } from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog } from "@/components/ui/dialog";
import type { TimelineEvent } from '@/pages/Index';
import { EventDialog } from './timeline/EventDialog';
import { EventItem } from './timeline/EventItem';

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

  // Get recent values for autocomplete
  const recentValues = {
    hosts: [...new Set(events.map(e => e.host).filter(Boolean) as string[])],
    users: [...new Set(events.map(e => e.user).filter(Boolean) as string[])],
    processes: [...new Set(events.map(e => e.process).filter(Boolean) as string[])],
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
              <EventItem
                key={event.id}
                event={event}
                onClick={handleEventClick}
                parentEvent={events.find(e => e.id === event.parentId)}
              />
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <EventDialog
          event={selectedEvent}
          events={events}
          onEventChange={setSelectedEvent}
          onSave={handleSave}
          recentValues={recentValues}
        />
      </Dialog>
    </>
  );
};

export default Timeline;