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
  isEditMode: boolean;
}

const Timeline: React.FC<TimelineProps> = ({ 
  events, 
  onAddEvent, 
  onSelectEvent, 
  onUpdateEvent,
  onDeleteEvent,
  isEditMode
}) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLinkingMode, setIsLinkingMode] = useState(false);
  const [linkSourceEvent, setLinkSourceEvent] = useState<TimelineEvent | null>(null);

  const handleEventClick = (event: TimelineEvent) => {
    if (isLinkingMode && isEditMode) {
      if (!linkSourceEvent) {
        setLinkSourceEvent(event);
        return;
      }

      // Prevent self-linking
      if (linkSourceEvent.id === event.id) {
        setIsLinkingMode(false);
        setLinkSourceEvent(null);
        return;
      }

      // Update the target event with the new parent
      const updatedEvent = {
        ...event,
        parentId: linkSourceEvent.id,
      };

      onUpdateEvent(updatedEvent);
      setIsLinkingMode(false);
      setLinkSourceEvent(null);
      return;
    }

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
        <TimelineHeader onAddEvent={onAddEvent} isEditMode={isEditMode} />
        <TimelineList
          events={events}
          onSelectEvent={handleEventClick}
          onUpdateEvent={onUpdateEvent}
          onDeleteEvent={onDeleteEvent}
          isLinkingMode={isLinkingMode}
          linkSourceEvent={linkSourceEvent}
          isEditMode={isEditMode}
        />
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <EventDialog
          event={selectedEvent}
          events={events}
          onEventChange={setSelectedEvent}
          onSave={handleSave}
          isEditMode={isEditMode}
        />
      </Dialog>
    </TimelineProvider>
  );
};

export default Timeline;