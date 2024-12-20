import React from 'react';
import type { TimelineEvent } from '@/pages/Index';

interface EventItemProps {
  event: TimelineEvent;
  onClick: (event: TimelineEvent) => void;
  parentEvent?: TimelineEvent;
}

export const EventItem: React.FC<EventItemProps> = ({ event, onClick, parentEvent }) => {
  return (
    <div
      className="timeline-event mb-8 ml-8 animate-fade-in cursor-pointer hover:bg-accent/50 p-4 rounded-lg transition-colors"
      onClick={() => onClick(event)}
    >
      <div className="text-sm text-muted-foreground">{event.timestamp}</div>
      <div className="font-medium">{event.title || "New Event"}</div>
      {event.host && (
        <div className="text-sm mt-1">
          <span className="font-medium">Host:</span> {event.host}
        </div>
      )}
      {event.user && (
        <div className="text-sm">
          <span className="font-medium">User:</span> {event.user}
        </div>
      )}
      {event.process && (
        <div className="text-sm">
          <span className="font-medium">Process:</span> {event.process}
        </div>
      )}
      <div className="text-sm mt-1">{event.description}</div>
      {event.technique && (
        <div className="mt-2">
          <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded">
            {event.technique}
          </span>
        </div>
      )}
      {parentEvent && (
        <div className="mt-2 text-xs text-muted-foreground">
          Connected to: {parentEvent.title || 'Unknown Event'}
        </div>
      )}
    </div>
  );
};