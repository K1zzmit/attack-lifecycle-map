import React from 'react';
import { Trash2, ArrowUp, ArrowDown, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TimelineEvent } from '@/pages/Index';
import { useToast } from '@/components/ui/use-toast';

interface EventActionsProps {
  onDelete: (eventId: string) => void;
  eventId: string;
  onUpdateEvent: (event: TimelineEvent) => void;
  event: TimelineEvent;
  events: TimelineEvent[];
  onEdit: () => void;
}

export const EventActions: React.FC<EventActionsProps> = ({ 
  onDelete, 
  eventId, 
  onUpdateEvent,
  event,
  events,
  onEdit
}) => {
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(eventId);
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = events.findIndex(e => e.id === eventId);
    if (currentIndex <= 0) {
      // If at the top, try to move up the parent chain
      if (event.parentId) {
        const parentEvent = events.find(e => e.id === event.parentId);
        if (parentEvent?.parentId) {
          // Move to be under the grandparent
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

    // Find the previous sibling with the same parent
    const previousSiblings = events.filter(e => e.parentId === event.parentId);
    const siblingIndex = previousSiblings.findIndex(e => e.id === eventId);
    if (siblingIndex > 0) {
      const previousSibling = previousSiblings[siblingIndex - 1];
      // Swap positions by updating timestamps
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
    const currentIndex = events.findIndex(e => e.id === eventId);
    if (currentIndex === events.length - 1) {
      // If at the bottom, try to move down the parent chain
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

    // Find the next sibling with the same parent
    const siblings = events.filter(e => e.parentId === event.parentId);
    const siblingIndex = siblings.findIndex(e => e.id === eventId);
    if (siblingIndex < siblings.length - 1) {
      const nextSibling = siblings[siblingIndex + 1];
      // Swap positions by updating timestamps
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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1" onClick={e => e.stopPropagation()}>
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
      <Button
        variant="ghost"
        size="icon"
        onClick={handleEdit}
        className="h-8 w-8"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className="h-8 w-8"
      >
        <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
      </Button>
    </div>
  );
};