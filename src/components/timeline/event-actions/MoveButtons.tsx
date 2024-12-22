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
    const currentIndex = events.findIndex(e => e.id === event.id);
    if (currentIndex <= 0) {
      if (event.parentId) {
        const parentEvent = events.find(e => e.id === event.parentId);
        if (parentEvent?.parentId) {
          onUpdateEvent({
            ...event,
            parentId: parentEvent.parentId
          });
          toast({
            title: "Event Moved",
            description: "Event moved up to parent level"
          });
        }
      }
      return;
    }

    const previousSiblings = events.filter(e => e.parentId === event.parentId);
    const siblingIndex = previousSiblings.findIndex(e => e.id === event.id);
    if (siblingIndex > 0) {
      const previousSibling = previousSiblings[siblingIndex - 1];
      onUpdateEvent({
        ...event,
        timestamp: previousSibling.timestamp
      });
      onUpdateEvent({
        ...previousSibling,
        timestamp: event.timestamp
      });
      toast({
        title: "Event Moved",
        description: "Event moved up"
      });
    }
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = events.findIndex(e => e.id === event.id);
    if (currentIndex === events.length - 1) {
      const nextParentCandidate = events.find(e => e.timestamp > event.timestamp && !e.parentId);
      if (nextParentCandidate) {
        onUpdateEvent({
          ...event,
          parentId: nextParentCandidate.id
        });
        toast({
          title: "Event Moved",
          description: "Event moved to next parent"
        });
      }
      return;
    }

    const siblings = events.filter(e => e.parentId === event.parentId);
    const siblingIndex = siblings.findIndex(e => e.id === event.id);
    if (siblingIndex < siblings.length - 1) {
      const nextSibling = siblings[siblingIndex + 1];
      onUpdateEvent({
        ...event,
        timestamp: nextSibling.timestamp
      });
      onUpdateEvent({
        ...nextSibling,
        timestamp: event.timestamp
      });
      toast({
        title: "Event Moved",
        description: "Event moved down"
      });
    }
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