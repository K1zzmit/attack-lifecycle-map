import React from 'react';
import type { TimelineEvent } from '@/pages/Index';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { EventContent } from './event-item/EventContent';
import { EventActions } from './event-item/EventActions';

interface EventItemProps {
  event: TimelineEvent;
  events: TimelineEvent[];
  onClick: (event: TimelineEvent) => void;
  onDelete: (eventId: string) => void;
  onUpdateEvent: (event: TimelineEvent) => void;
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
  onUpdateEvent,
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
    const colorPalette = [
      '#8B5CF6', '#F97316', '#0EA5E9', '#10B981',
      '#EAB308', '#EC4899', '#D946EF',
    ];

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

    const getBorderColorForEvent = (evt: TimelineEvent): string => {
      if (!evt.parentId) {
        return colorPalette[parseInt(evt.id.slice(-3), 16) % colorPalette.length];
      }

      const parent = events.find(e => e.id === evt.parentId);
      if (!parent) return colorPalette[0];

      const parentColor = getBorderColorForEvent(parent);
      const ancestorColors = getAncestorColors(evt);
      const availableColors = colorPalette.filter(color => 
        !ancestorColors.includes(color) && color !== parentColor
      );

      return availableColors[parseInt(parent.id.slice(-3), 16) % availableColors.length];
    };

    return getBorderColorForEvent(event);
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
          <EventContent event={event} parentEvent={parentEvent} />
          <EventActions 
            eventId={event.id}
            onDelete={onDelete}
            onUpdateEvent={onUpdateEvent}
          />
        </div>
      </div>
    </div>
  );
};