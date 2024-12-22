import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TimelineEvent } from '@/pages/Index';
import { useToast } from '@/components/ui/use-toast';

interface EventActionsProps {
  onDelete: (eventId: string) => void;
  eventId: string;
  onUpdateEvent: (event: TimelineEvent) => void;
}

export const EventActions: React.FC<EventActionsProps> = ({ onDelete, eventId }) => {
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(eventId);
  };

  return (
    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
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