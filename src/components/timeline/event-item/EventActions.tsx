import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TimelineEvent } from '@/pages/Index';

interface EventActionsProps {
  onAddChild: (event: TimelineEvent) => void;
  onDelete: (eventId: string) => void;
  eventId: string;
}

export const EventActions: React.FC<EventActionsProps> = ({ onAddChild, onDelete, eventId }) => {
  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString().slice(0, 16),
      title: "",
      description: "",
      parentId: eventId,
      artifacts: [],
    };
    onAddChild(newEvent);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(eventId);
  };

  return (
    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleAddChild}
        title="Add Child Event"
      >
        <Plus className="h-4 w-4 text-primary hover:text-primary/80" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
      </Button>
    </div>
  );
};