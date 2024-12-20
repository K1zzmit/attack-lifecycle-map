import React from 'react';
import type { TimelineEvent } from '@/pages/Index';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface EventItemProps {
  event: TimelineEvent;
  onClick: (event: TimelineEvent) => void;
  onDelete: (eventId: string) => void;
  parentEvent?: TimelineEvent;
  depth?: number;
}

export const EventItem: React.FC<EventItemProps> = ({ 
  event, 
  onClick,
  onDelete,
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

  const getBorderColor = (parentId?: string) => {
    // Color palette for events
    const colorPalette = [
      '#8B5CF6',         // Vivid Purple
      '#F97316',         // Bright Orange
      '#0EA5E9',         // Ocean Blue
      '#10B981',         // Emerald Green
      '#EAB308',         // Yellow
      '#EC4899',         // Pink
      '#D946EF',         // Magenta Pink
    ];

    // If it's a root event (no parent), use a unique color based on its ID
    if (!parentId) {
      return colorPalette[parseInt(event.id.slice(-3), 16) % colorPalette.length];
    }
    
    // For child events, use the parent's ID to determine color
    // But ensure it's different from the parent's color
    const parentColor = colorPalette[parseInt(parentId.slice(-3), 16) % colorPalette.length];
    const availableColors = colorPalette.filter(color => color !== parentColor);
    const childColorIndex = parseInt(event.id.slice(-3), 16) % availableColors.length;
    return availableColors[childColorIndex];
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(event.id);
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
        className={`timeline-event mb-4 animate-fade-in p-4 rounded-none transition-all duration-200 group ${
          isOver ? 'scale-95 shadow-lg ring-2 ring-primary' : ''
        }`}
        onClick={() => onClick(event)}
        style={{
          borderLeft: `4px solid ${getBorderColor(event.parentId)}`,
          borderTop: '1px solid hsl(var(--border))',
          borderRight: '1px solid hsl(var(--border))',
          borderBottom: '1px solid hsl(var(--border))',
          position: 'relative',
          zIndex: 2,
          background: isOver ? 'hsl(var(--primary)/0.1)' : 'hsl(var(--card))',
          transform: isOver ? 'translateY(-4px)' : 'none',
        }}
      >
        <div className="flex justify-between items-start">
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
                Connected to: {parentEvent.title || 'Unknown Event'}
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
          </Button>
        </div>
      </div>
    </div>
  );
};