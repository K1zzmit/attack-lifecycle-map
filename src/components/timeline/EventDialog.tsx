import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TimelineEvent } from '@/pages/Index';
import { EntityField } from './fields/EntityField';
import { MitreTacticField } from './fields/MitreTacticField';

interface EventDialogProps {
  event: TimelineEvent | null;
  events: TimelineEvent[];
  onEventChange: (event: TimelineEvent) => void;
  onSave: () => void;
  recentValues: {
    hosts: string[];
    users: string[];
    processes: string[];
  };
}

export const EventDialog: React.FC<EventDialogProps> = ({
  event,
  events,
  onEventChange,
  onSave,
  recentValues,
}) => {
  if (!event) return null;

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Event</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="timestamp">Timestamp</Label>
          <Input
            id="timestamp"
            type="datetime-local"
            value={event.timestamp || ''}
            onChange={(e) => onEventChange({ ...event, timestamp: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={event.title || ''}
            onChange={(e) => onEventChange({ ...event, title: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <EntityField
            label="Host"
            field="host"
            event={event}
            onEventChange={onEventChange}
            recentValues={recentValues.hosts}
          />
          <EntityField
            label="User"
            field="user"
            event={event}
            onEventChange={onEventChange}
            recentValues={recentValues.users}
          />
        </div>
        <EntityField
          label="Process"
          field="process"
          event={event}
          onEventChange={onEventChange}
          recentValues={recentValues.processes}
        />
        <div className="grid gap-2">
          <Label htmlFor="commandLine">Command Line</Label>
          <Input
            id="commandLine"
            value={event.commandLine || ''}
            onChange={(e) => onEventChange({ ...event, commandLine: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sha256">SHA256</Label>
          <Input
            id="sha256"
            value={event.sha256 || ''}
            onChange={(e) => onEventChange({ ...event, sha256: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={event.description || ''}
            onChange={(e) => onEventChange({ ...event, description: e.target.value })}
          />
        </div>
        <MitreTacticField event={event} onEventChange={onEventChange} />
        <div className="grid gap-2">
          <Label htmlFor="parentId">Connected to Event</Label>
          <Select
            value={event.parentId || 'none'}
            onValueChange={(value) => {
              onEventChange({
                ...event,
                parentId: value === 'none' ? undefined : value,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select parent event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {events
                .filter(e => e.id !== event.id)
                .map(e => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.title || 'Untitled Event'}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Network Details</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="Proxy IP"
              value={event.networkDetails?.proxyIp || ''}
              onChange={(e) => onEventChange({
                ...event,
                networkDetails: {
                  ...event.networkDetails,
                  proxyIp: e.target.value,
                },
              })}
            />
            <Input
              placeholder="Port"
              type="number"
              value={event.networkDetails?.port || ''}
              onChange={(e) => onEventChange({
                ...event,
                networkDetails: {
                  ...event.networkDetails,
                  port: parseInt(e.target.value) || undefined,
                },
              })}
            />
            <Input
              placeholder="Destination IP"
              value={event.networkDetails?.destinationIp || ''}
              onChange={(e) => onEventChange({
                ...event,
                networkDetails: {
                  ...event.networkDetails,
                  destinationIp: e.target.value,
                },
              })}
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onSave}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  );
};