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
  const { toast } = useToast();

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

  const handleDelete = (eventId: string) => {
    // Check if the event has children
    const hasChildren = events.some(event => event.parentId === eventId);
    
    if (hasChildren) {
      toast({
        title: "Cannot Delete Event",
        description: "Please delete or reassign child events first",
        variant: "destructive",
      });
      return;
    }

    onDeleteEvent?.(eventId);
    toast({
      title: "Event Deleted",
      description: "The event has been successfully removed",
    });
  };

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

  // Sort events to maintain parent-child order
  const sortEvents = (eventsToSort: TimelineEvent[]): TimelineEvent[] => {
    const eventMap = new Map(eventsToSort.map(event => [event.id, event]));
    const rootEvents: TimelineEvent[] = [];
    const childEvents: TimelineEvent[] = [];

    // Separate root and child events
    eventsToSort.forEach(event => {
      if (!event.parentId) {
        rootEvents.push(event);
      } else {
        childEvents.push(event);
      }
    });

    // Sort root events by timestamp
    rootEvents.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    // Function to get all children of an event
    const getAllChildren = (parentId: string): TimelineEvent[] => {
      const children = childEvents.filter(event => event.parentId === parentId);
      children.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
      return children.reduce((acc, child) => {
        return [...acc, child, ...getAllChildren(child.id)];
      }, [] as TimelineEvent[]);
    };

    // Build the final sorted array
    const sortedEvents = rootEvents.reduce((acc, rootEvent) => {
      return [...acc, rootEvent, ...getAllChildren(rootEvent.id)];
    }, [] as TimelineEvent[]);

    return sortedEvents;
  };

  // Sort events before displaying
  const sortedEvents = sortEvents(events);

  // Organize events by their relationships
  const organizedEvents = sortedEvents.map(event => ({
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
                  events={events}  // Pass events prop here
                  onClick={handleEventClick}
                  onDelete={handleDelete}
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