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
          <div className="grid gap-2">
            <Label htmlFor="host">Host</Label>
            <Select
              value={event.host || ''}
              onValueChange={(value) => onEventChange({ ...event, host: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select host" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_host">New Host...</SelectItem>
                {recentValues.hosts.map((host) => (
                  <SelectItem key={host} value={host}>
                    {host}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(event.host === 'new_host' || (!recentValues.hosts.includes(event.host || '') && event.host)) && (
              <Input
                value={event.host === 'new_host' ? '' : (event.host || '')}
                onChange={(e) => onEventChange({ ...event, host: e.target.value })}
                placeholder="Enter new host"
              />
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="user">User</Label>
            <Select
              value={event.user || ''}
              onValueChange={(value) => onEventChange({ ...event, user: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_user">New User...</SelectItem>
                {recentValues.users.map((user) => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(event.user === 'new_user' || (!recentValues.users.includes(event.user || '') && event.user)) && (
              <Input
                value={event.user === 'new_user' ? '' : (event.user || '')}
                onChange={(e) => onEventChange({ ...event, user: e.target.value })}
                placeholder="Enter new user"
              />
            )}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="process">Process</Label>
          <Select
            value={event.process || ''}
            onValueChange={(value) => onEventChange({ ...event, process: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select process" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new_process">New Process...</SelectItem>
              {recentValues.processes.map((process) => (
                <SelectItem key={process} value={process}>
                  {process}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(event.process === 'new_process' || (!recentValues.processes.includes(event.process || '') && event.process)) && (
            <Input
              value={event.process === 'new_process' ? '' : (event.process || '')}
              onChange={(e) => onEventChange({ ...event, process: e.target.value })}
              placeholder="Enter new process"
            />
          )}
        </div>
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
        <div className="grid gap-2">
          <Label htmlFor="technique">MITRE Technique</Label>
          <Input
            id="technique"
            value={event.technique || ''}
            onChange={(e) => onEventChange({ ...event, technique: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="parentId">Connected to Event</Label>
          <Select
            value={event.parentId || ''}
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