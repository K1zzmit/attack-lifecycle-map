import React, { useState } from 'react';
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
import type { TimelineEvent, Artifact } from '@/pages/Index';
import { MitreTacticField } from './fields/MitreTacticField';
import { Plus, X } from 'lucide-react';

interface EventDialogProps {
  event: TimelineEvent | null;
  events: TimelineEvent[];
  onEventChange: (event: TimelineEvent) => void;
  onSave: () => void;
  recentValues?: {
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
}) => {
  const [newArtifactType, setNewArtifactType] = useState<Artifact['type']>('custom');
  const [newArtifactName, setNewArtifactName] = useState('');
  const [newArtifactValue, setNewArtifactValue] = useState('');
  const [newArtifactLinkedValue, setNewArtifactLinkedValue] = useState('');

  if (!event) return null;

  const handleAddArtifact = () => {
    if (!newArtifactName || !newArtifactValue) return;

    const newArtifact: Artifact = {
      type: newArtifactType,
      name: newArtifactName,
      value: newArtifactValue,
      linkedValue: newArtifactLinkedValue || undefined,
    };

    onEventChange({
      ...event,
      artifacts: [...(event.artifacts || []), newArtifact],
    });

    // Reset form
    setNewArtifactType('custom');
    setNewArtifactName('');
    setNewArtifactValue('');
    setNewArtifactLinkedValue('');
  };

  const handleRemoveArtifact = (index: number) => {
    onEventChange({
      ...event,
      artifacts: event.artifacts.filter((_, i) => i !== index),
    });
  };

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

        <div className="space-y-4">
          <Label>Artifacts</Label>
          <div className="grid gap-4">
            {event.artifacts?.map((artifact, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded">
                <div className="flex-1">
                  <div className="font-medium">{artifact.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {artifact.value}
                    {artifact.linkedValue && ` → ${artifact.linkedValue}`}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveArtifact(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={newArtifactType}
                onValueChange={(value: Artifact['type']) => setNewArtifactType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hostname">Hostname</SelectItem>
                  <SelectItem value="domain">Domain</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                  <SelectItem value="ip">IP</SelectItem>
                  <SelectItem value="hash">Hash</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Artifact name"
                value={newArtifactName}
                onChange={(e) => setNewArtifactName(e.target.value)}
              />
            </div>
            <Input
              placeholder="Value"
              value={newArtifactValue}
              onChange={(e) => setNewArtifactValue(e.target.value)}
            />
            {(newArtifactType === 'hostname' || newArtifactType === 'domain' || newArtifactType === 'file') && (
              <Input
                placeholder={
                  newArtifactType === 'hostname' || newArtifactType === 'domain'
                    ? 'IP Address'
                    : 'File Hash'
                }
                value={newArtifactLinkedValue}
                onChange={(e) => setNewArtifactLinkedValue(e.target.value)}
              />
            )}
            <Button onClick={handleAddArtifact} type="button" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Artifact
            </Button>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onSave}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  );
};