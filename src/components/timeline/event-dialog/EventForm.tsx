import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TimelineEvent, Artifact } from '@/pages/Index';
import { MitreTacticField } from '../fields/MitreTacticField';
import { ArtifactField } from '../fields/ArtifactField';

interface EventFormProps {
  event: TimelineEvent;
  events: TimelineEvent[];
  onEventChange: (event: TimelineEvent) => void;
  recentArtifacts: { [key: string]: { value: string; linkedValue?: string }[] };
  newArtifactType: Artifact['type'];
  newArtifactName: string;
  newArtifactValue: string;
  newArtifactLinkedValue: string;
  setNewArtifactType: (type: Artifact['type']) => void;
  setNewArtifactName: (name: string) => void;
  setNewArtifactValue: (value: string) => void;
  setNewArtifactLinkedValue: (value: string) => void;
  handleAddArtifact: () => void;
  handleRemoveArtifact: (index: number) => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  events,
  onEventChange,
  recentArtifacts,
  newArtifactType,
  newArtifactName,
  newArtifactValue,
  newArtifactLinkedValue,
  setNewArtifactType,
  setNewArtifactName,
  setNewArtifactValue,
  setNewArtifactLinkedValue,
  handleAddArtifact,
  handleRemoveArtifact,
}) => {
  return (
    <div className="space-y-4">
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
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => handleRemoveArtifact(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <ArtifactField
          artifactType={newArtifactType}
          artifactName={newArtifactName}
          artifactValue={newArtifactValue}
          artifactLinkedValue={newArtifactLinkedValue}
          onTypeChange={setNewArtifactType}
          onNameChange={setNewArtifactName}
          onValueChange={setNewArtifactValue}
          onLinkedValueChange={setNewArtifactLinkedValue}
          onAdd={handleAddArtifact}
          recentArtifacts={recentArtifacts}
        />
      </div>
    </div>
  );
};