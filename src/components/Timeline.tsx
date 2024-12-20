import React, { useState } from 'react';
import { Card } from './ui/card';
import { Dialog } from "@/components/ui/dialog";
import type { TimelineEvent } from '@/pages/Index';
import { EventDialog } from './timeline/EventDialog';
import { TimelineHeader } from './timeline/TimelineHeader';
import { TimelineList } from './timeline/TimelineList';
import { TimelineProvider } from './timeline/TimelineContext';

interface TimelineProps {
  events: TimelineEvent[];
  onAddEvent: () => void;
  onSelectEvent: (event: TimelineEvent) => void;
  onUpdateEvent: (event: TimelineEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ 
  events, 
  onAddEvent, 
  onSelectEvent, 
  onUpdateEvent,
  onDeleteEvent 
}) => {
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
    <TimelineProvider>
      <Card className="h-full bg-background/50 backdrop-blur">
        <TimelineHeader onAddEvent={onAddEvent} />
        <TimelineList
          events={events}
          onSelectEvent={handleEventClick}
          onUpdateEvent={onUpdateEvent}
          onDeleteEvent={onDeleteEvent}
        />
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <EventDialog
          event={selectedEvent}
          events={events}
          onEventChange={setSelectedEvent}
          onSave={handleSave}
        />
      </Dialog>
    </TimelineProvider>
  );
};

export default Timeline;