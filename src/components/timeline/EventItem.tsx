import React from 'react';
import type { TimelineEvent } from '@/pages/Index';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface EventItemProps {
  event: TimelineEvent;
  events: TimelineEvent[];
  onClick: (event: TimelineEvent) => void;
  onDelete: (eventId: string) => void;
  parentEvent?: TimelineEvent;
  depth?: number;
  isLinkingMode?: boolean;
  isLinkSource?: boolean;
}

export const EventItem: React.FC<EventItemProps> = ({ 
  event, 
  events,
  onClick,
  onDelete,
  parentEvent,
  depth = 0,
  isLinkingMode = false,
  isLinkSource = false,
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

  const getBorderColor = (event: TimelineEvent, events: TimelineEvent[]): string => {
    // Color palette
    const colorPalette = [
      '#8B5CF6',  // Purple
      '#F97316',  // Orange
      '#0EA5E9',  // Blue
      '#10B981',  // Green
      '#EAB308',  // Yellow
      '#EC4899',  // Pink
      '#D946EF',  // Magenta
    ];

    // Get all ancestor colors to avoid using them
    const getAncestorColors = (currentEvent: TimelineEvent): string[] => {
      const colors: string[] = [];
      let current = currentEvent;
      
      while (current.parentId) {
        const parent = events.find(e => e.id === current.parentId);
        if (!parent) break;
        
        const parentColor = getBorderColorForEvent(parent);
        colors.push(parentColor);
        current = parent;
      }
      
      return colors;
    };

    // Helper function to get color for an event
    const getBorderColorForEvent = (evt: TimelineEvent): string => {
      if (!evt.parentId) {
        // Root events get color based on their ID
        return colorPalette[parseInt(evt.id.slice(-3), 16) % colorPalette.length];
      }

      // Find parent
      const parent = events.find(e => e.id === evt.parentId);
      if (!parent) return colorPalette[0];

      // Get parent's color
      const parentColor = getBorderColorForEvent(parent);
      
      // Get available colors (excluding ancestor colors)
      const ancestorColors = getAncestorColors(evt);
      const availableColors = colorPalette.filter(color => 
        !ancestorColors.includes(color) && color !== parentColor
      );

      // Use parent's ID to consistently select child color
      // This ensures all siblings get the same color
      return availableColors[parseInt(parent.id.slice(-3), 16) % availableColors.length];
    };

    return getBorderColorForEvent(event);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(event.id);
  };

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString().slice(0, 16),
      title: "",
      description: "",
      parentId: event.id,
      artifacts: [],
    };
    onClick(newEvent);
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
        } ${isLinkingMode ? 'cursor-pointer hover:ring-2 hover:ring-primary' : ''} ${
          isLinkSource ? 'ring-2 ring-primary bg-primary/10' : ''
        }`}
        onClick={() => onClick(event)}
        style={{
          borderLeft: `4px solid ${getBorderColor(event, events)}`,
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
        </div>
      </div>
    </div>
  );
};