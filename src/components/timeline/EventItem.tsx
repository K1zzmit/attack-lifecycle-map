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

  // Get border color based on depth
  const getBorderColor = (depth: number) => {
    switch(depth) {
      case 0:
        return 'border-[#ea384c]'; // Red for parent
      case 1:
        return 'border-[#0EA5E9]'; // Blue for first level
      case 2:
        return 'border-[#F97316]'; // Yellow/Orange for second level
      default:
        return 'border-[#0EA5E9]'; // Blue for deeper levels
    }
  };

  // Get connector color based on depth
  const getConnectorColor = (depth: number) => {
    switch(depth) {
      case 0:
        return '#ea384c'; // Red for parent
      case 1:
        return '#0EA5E9'; // Blue for first level
      case 2:
        return '#F97316'; // Yellow/Orange for second level
      default:
        return '#0EA5E9'; // Blue for deeper levels
    }
  };

  return (
    <div className="relative" style={indentationStyle}>
      {depth > 0 && (
        <>
          {/* Vertical connector */}
          <div 
            className="absolute"
            style={{
              left: '-1.25rem',
              top: '-1rem',
              width: '2px',
              height: '100%',
              background: getConnectorColor(depth),
              opacity: 0.8,
            }}
          />
          {/* Horizontal connector */}
          <div 
            className="absolute"
            style={{
              left: '-1.25rem',
              top: '1.5rem',
              width: '1.25rem',
              height: '2px',
              background: getConnectorColor(depth),
              opacity: 0.8,
            }}
          />
        </>
      )}
      <div
        className={`timeline-event mb-4 animate-fade-in cursor-pointer p-4 rounded-none border-2 ${getBorderColor(depth)}`}
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