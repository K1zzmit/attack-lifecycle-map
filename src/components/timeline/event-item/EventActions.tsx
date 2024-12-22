import React from 'react';
import type { TimelineEvent } from '@/pages/Index';
import { MoveButtons } from '../event-actions/MoveButtons';
import { ActionButtons } from '../event-actions/ActionButtons';

interface EventActionsProps {
  eventId: string;
  onDelete: (eventId: string) => void;
  onUpdateEvent: (event: TimelineEvent) => void;
  event: TimelineEvent;
  events: TimelineEvent[];
  onEdit: () => void;
}

export const EventActions: React.FC<EventActionsProps> = ({
  eventId,
  onDelete,
  onUpdateEvent,
  event,
  events,
  onEdit,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(eventId);
  };

  return (
    <div 
      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1" 
      onClick={e => e.stopPropagation()}
    >
      <MoveButtons
        event={event}
        events={events}
        onUpdateEvent={onUpdateEvent}
      />
      <ActionButtons
        onEdit={(e) => {
          e?.stopPropagation();
          onEdit();
        }}
        onDelete={handleDelete}
      />
    </div>
  );
};