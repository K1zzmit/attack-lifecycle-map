import React from 'react';
import type { TimelineEvent } from '@/pages/Index';
import { useDraggable, useDroppable } from '@dnd-kit/core';

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
  depth = 0,
}) => {
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({
    id: event.id,
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: event.id,
  });

  // Combine drag and drop refs
  const setRefs = (element: HTMLDivElement) => {
    setDragRef(element);
    setDropRef(element);
  };

  const indentationStyle: React.CSSProperties = {
    marginLeft: `${depth * 2}rem`,
    position: 'relative',
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    zIndex: isDragging ? 50 : 1,
  };

  const getBorderColor = (depth: number, parentId?: string) => {
    // Vibrant rainbow color palette for parent-child relationships
    const colorPalette = {
      root: '#ea384c',      // Vibrant Red for root events
      pairs: [
        '#8B5CF6',         // Vivid Purple
        '#D946EF',         // Magenta Pink
        '#F97316',         // Bright Orange
        '#0EA5E9',         // Ocean Blue
        '#10B981',         // Emerald Green
        '#EAB308',         // Yellow
        '#EC4899',         // Pink
      ]
    };

    if (depth === 0) return colorPalette.root;
    
    // Use the parent ID to determine the color index
    // This ensures children of the same parent share the same color
    if (parentId) {
      const colorIndex = parseInt(parentId.slice(-3), 16) % colorPalette.pairs.length;
      return colorPalette.pairs[colorIndex];
    }

    // Fallback color if no parent ID
    return colorPalette.pairs[0];
  };

  return (
    <div 
      className="relative" 
      style={indentationStyle} 
      ref={setRefs}
      {...attributes}
      {...listeners}
    >
      <div
        className={`timeline-event mb-4 animate-fade-in p-4 rounded-none transition-all duration-200 ${
          isOver ? 'scale-95 shadow-lg ring-2 ring-primary' : ''
        }`}
        onClick={() => onClick(event)}
        style={{
          borderLeft: `4px solid ${getBorderColor(depth, event.parentId)}`,
          borderTop: '1px solid hsl(var(--border))',
          borderRight: '1px solid hsl(var(--border))',
          borderBottom: '1px solid hsl(var(--border))',
          position: 'relative',
          zIndex: 2,
          background: isOver ? 'hsl(var(--primary)/0.1)' : 'hsl(var(--card))',
          transform: isOver ? 'translateY(-4px)' : 'none',
        }}
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