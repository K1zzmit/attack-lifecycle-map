import React from 'react';
import type { TimelineEvent } from '@/pages/Index';

interface EventItemProps {
  event: TimelineEvent;
  onClick: (event: TimelineEvent) => void;
  parentEvent?: TimelineEvent;
  depth?: number;
}

export const EventItem: React.FC<EventItemProps> = ({ 
  event, 
  onClick, 
  parentEvent,
  depth = 0 
}) => {
  // Calculate indentation based on depth
  const indentationStyle: React.CSSProperties = {
    marginLeft: `${depth * 2}rem`,
    borderLeftWidth: depth > 0 ? '2px' : '0',
    borderLeftStyle: depth > 0 ? 'solid' : undefined,
    borderLeftColor: 'hsl(var(--border))',
    paddingLeft: depth > 0 ? '1rem' : '0',
  };

  // Determine background color based on depth
  const getBackgroundColorClass = () => {
    if (depth === 0) return 'hover:bg-accent/50';
    if (depth === 1) return 'hover:bg-primary/10';
    if (depth === 2) return 'hover:bg-secondary/10';
    return 'hover:bg-muted/50';
  };

  return (
    <div
      className={`timeline-event mb-4 animate-fade-in cursor-pointer ${getBackgroundColorClass()} p-4 rounded-lg transition-colors`}
      onClick={() => onClick(event)}
      style={indentationStyle}
    >
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
          Connected to: {parentEvent.title || 'Unknown Event'}
        </div>
      )}
    </div>
  );
};