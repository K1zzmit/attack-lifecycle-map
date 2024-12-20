import React from 'react';
import type { TimelineEvent } from '@/pages/Index';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface EventItemProps {
  event: TimelineEvent;
  onClick: (event: TimelineEvent) => void;
  onAddLinkedEvent: (parentEvent: TimelineEvent) => void;
  parentEvent?: TimelineEvent;
  depth?: number;
}

export const EventItem: React.FC<EventItemProps> = ({ 
  event, 
  onClick, 
  onAddLinkedEvent,
  parentEvent,
  depth = 0 
}) => {
  return (
    <div
      className={`timeline-event mb-8 animate-fade-in cursor-pointer hover:bg-accent/50 p-4 rounded-lg transition-colors`}
      style={{ marginLeft: `${depth * 2}rem` }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-sm text-muted-foreground">{event.timestamp}</div>
          <div className="font-medium">{event.title || "New Event"}</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAddLinkedEvent(event);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Link Event
        </Button>
      </div>
      
      {event.host && (
        <div className="text-sm mt-1">
          <span className="font-medium">Host:</span> {event.host}
          {event.hostIp && <span className="ml-1">({event.hostIp})</span>}
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
          {event.sha256 && (
            <div className="text-xs ml-4">
              <span className="font-medium">SHA256:</span> {event.sha256.substring(0, 8)}...
            </div>
          )}
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