import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { TimelineEvent } from '@/pages/Index';
import { useToast } from '@/components/ui/use-toast';

interface MoveButtonsProps {
  event: TimelineEvent;
  events: TimelineEvent[];
  onUpdateEvent: (event: TimelineEvent) => void;
}

export const MoveButtons: React.FC<MoveButtonsProps> = ({
  event,
  events,
  onUpdateEvent,
}) => {
  const { toast } = useToast();

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Get siblings (events with same parent)
    const siblings = events.filter(e => e.parentId === event.parentId);
    const currentIndex = siblings.findIndex(e => e.id === event.id);
    
    if (currentIndex <= 0) {
      // If at top of siblings list and has a parent, move up to parent's level
      if (event.parentId) {
        const parentEvent = events.find(e => e.id === event.parentId);
        if (parentEvent?.parentId) {
          // Move to parent's parent
          onUpdateEvent({
            ...event,
            parentId: parentEvent.parentId
          });
          toast({
            title: "Event Moved Up",
            description: "Event moved up to parent level"
          });
        } else {
          // Make it a root event
          onUpdateEvent({
            ...event,
            parentId: undefined
          });
          toast({
            title: "Event Moved Up",
            description: "Event moved to root level"
          });
        }
      }
      return;
    }

    // Get the previous sibling's timestamp
    const previousSibling = siblings[currentIndex - 1];
    
    // Swap timestamps to reorder within current parent
    onUpdateEvent({
      ...event,
      timestamp: previousSibling.timestamp
    });
    onUpdateEvent({
      ...previousSibling,
      timestamp: event.timestamp
    });
    
    toast({
      title: "Event Moved Up",
      description: "Event moved up in the timeline"
    });
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Get siblings (events with same parent)
    const siblings = events.filter(e => e.parentId === event.parentId);
    const currentIndex = siblings.findIndex(e => e.id === event.id);
    
    if (currentIndex === siblings.length - 1) {
      // If at bottom of siblings list, make it a child of the previous sibling
      const previousSibling = siblings[currentIndex - 1];
      
      if (previousSibling) {
        onUpdateEvent({
          ...event,
          parentId: previousSibling.id
        });
        toast({
          title: "Event Moved Down",
          description: "Event is now a child of the previous sibling"
        });
      }
      return;
    }

    // Get the next sibling's timestamp
    const nextSibling = siblings[currentIndex + 1];
    
    // Swap timestamps to reorder within current parent
    onUpdateEvent({
      ...event,
      timestamp: nextSibling.timestamp
    });
    onUpdateEvent({
      ...nextSibling,
      timestamp: event.timestamp
    });
    
    toast({
      title: "Event Moved Down",
      description: "Event moved down in the timeline"
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleMoveUp}
        className="h-8 w-8"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleMoveDown}
        className="h-8 w-8"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    </>
  );
};