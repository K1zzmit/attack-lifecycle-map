import React from 'react';
import type { TimelineEvent } from '@/pages/Index';

interface EventContentProps {
  event: TimelineEvent;
  parentEvent?: TimelineEvent;
}

export const EventContent: React.FC<EventContentProps> = ({ event, parentEvent }) => {
  return (
    <div className="flex-1">
      <div className="text-sm text-muted-foreground">{event.timestamp}</div>
      <div className="font-medium">{event.title || "New Event"}</div>
      
      {event.artifacts?.length > 0 && (
        <div className="mt-2 space-y-1">
          {event.artifacts.map((artifact, index) => (
            <div key={index} className="text-sm">
              <span className="font-medium">{artifact.name}:</span>{' '}
              {artifact.value}
              {artifact.linkedValue && (
                <span className="text-muted-foreground">
                  {' '}→ {artifact.linkedValue}
                </span>
              )}
            </div>
          ))}
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
          Parent: {parentEvent.title || 'Unknown Event'}
        </div>
      )}
    </div>
  );
};