import React, { useState } from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog } from "@/components/ui/dialog";
import type { TimelineEvent } from '@/pages/Index';
import { EventDialog } from './timeline/EventDialog';
import { EventItem } from './timeline/EventItem';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useToast } from './ui/use-toast';

interface TimelineProps {
  events: TimelineEvent[];
  onAddEvent: () => void;
  onSelectEvent: (event: TimelineEvent) => void;
  onUpdateEvent: (event: TimelineEvent) => void;
}

const Timeline: React.FC<TimelineProps> = ({ events, onAddEvent, onSelectEvent, onUpdateEvent }) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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

  // Function to calculate event depth
  const getEventDepth = (event: TimelineEvent): number => {
    let depth = 0;
    let currentEvent = event;
    
    while (currentEvent.parentId) {
      const parentEvent = events.find(e => e.id === currentEvent.parentId);
      if (!parentEvent) break;
      depth++;
      currentEvent = parentEvent;
    }
    
    return depth;
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const draggedEvent = events.find(e => e.id === active.id);
    const targetEvent = events.find(e => e.id === over.id);

    if (!draggedEvent || !targetEvent) return;

    // Prevent circular references
    let currentParent = targetEvent;
    while (currentParent.parentId) {
      if (currentParent.parentId === draggedEvent.id) {
        toast({
          title: "Invalid Operation",
          description: "Cannot create circular parent-child relationship",
          variant: "destructive",
        });
        return;
      }
      currentParent = events.find(e => e.id === currentParent.parentId) || currentParent;
    }

    // Update the parent-child relationship
    const updatedEvent = {
      ...draggedEvent,
      parentId: targetEvent.id,
    };

    onUpdateEvent(updatedEvent);
    
    toast({
      title: "Event Updated",
      description: `${draggedEvent.title || 'Event'} is now a child of ${targetEvent.title || 'Event'}`,
    });
  };

  // Organize events by their relationships
  const organizedEvents = events.map(event => ({
    ...event,
    depth: getEventDepth(event),
  }));

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
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="relative">
              {organizedEvents.map((event) => (
                <EventItem
                  key={event.id}
                  event={event}
                  onClick={handleEventClick}
                  parentEvent={events.find(e => e.id === event.parentId)}
                  depth={event.depth}
                />
              ))}
            </div>
          </DndContext>
        </ScrollArea>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <EventDialog
          event={selectedEvent}
          events={events}
          onEventChange={setSelectedEvent}
          onSave={handleSave}
        />
      </Dialog>
    </>
  );
};

export default Timeline;