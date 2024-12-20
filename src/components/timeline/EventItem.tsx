import React from 'react';
import type { TimelineEvent } from '@/pages/Index';

interface EventItemProps {
  event: TimelineEvent;
  onClick: (event: TimelineEvent) => void;
  parentEvent?: TimelineEvent;
  depth?: number;
  isLastEvent?: boolean;
}

export const EventItem: React.FC<EventItemProps> = ({ 
  event, 
  onClick, 
  parentEvent,
  depth = 0,
  isLastEvent = false
}) => {
  // Calculate indentation based on depth
  const indentationStyle: React.CSSProperties = {
    marginLeft: `${depth * 2.5}rem`,
    position: 'relative',
  };

  return (
    <div className="relative" style={indentationStyle}>
      {/* Vertical line */}
      <div 
        className="timeline-connector absolute" 
        data-depth={depth}
        style={{
          left: '-1.25rem',
          top: depth === 0 ? '50%' : '0',
          bottom: isLastEvent ? '50%' : '0',
          height: 'auto'
        }}
      />
      {/* Horizontal line */}
      <div 
        className="absolute"
        style={{
          left: '-1.25rem',
          top: '50%',
          width: '1.25rem',
          height: '2px',
          background: 'hsl(var(--primary))',
          opacity: 0.8,
        }}
      />
      <div
        className={`timeline-event mb-4 animate-fade-in cursor-pointer p-4 rounded-lg transition-colors`}
        onClick={() => onClick(event)}
        data-depth={depth}
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
    </div>
  );
};