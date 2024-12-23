import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TimelineEvent, Artifact } from '@/pages/Index';
import { MitreTacticField } from '../fields/MitreTacticField';
import { ArtifactSection } from './form/ArtifactSection';

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
  readOnly?: boolean;
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
  readOnly = false,
}) => {
  const formatTimestampForInput = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toISOString().slice(0, 19);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="timestamp">Timestamp</Label>
        <Input
          id="timestamp"
          type="datetime-local"
          value={formatTimestampForInput(event.timestamp)}
          onChange={(e) => onEventChange({ ...event, timestamp: e.target.value })}
          step="1"
          readOnly={readOnly}
          className={readOnly ? "bg-muted" : ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={event.title || ''}
          onChange={(e) => onEventChange({ ...event, title: e.target.value })}
          readOnly={readOnly}
          className={readOnly ? "bg-muted" : ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={event.description || ''}
          onChange={(e) => onEventChange({ ...event, description: e.target.value })}
          readOnly={readOnly}
          className={readOnly ? "bg-muted" : ""}
        />
      </div>

      {!readOnly && <MitreTacticField event={event} onEventChange={onEventChange} />}

      {!readOnly && (
        <div className="grid gap-2">
          <Label htmlFor="parentId">Parent</Label>
          <Select
            value={event.parentId || 'none'}
            onValueChange={(value) => {
              onEventChange({
                ...event,
                parentId: value === 'none' ? undefined : value,
              });
            }}
            disabled={readOnly}
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
      )}

      <ArtifactSection
        artifacts={event.artifacts}
        recentArtifacts={recentArtifacts}
        newArtifactType={newArtifactType}
        newArtifactName={newArtifactName}
        newArtifactValue={newArtifactValue}
        newArtifactLinkedValue={newArtifactLinkedValue}
        setNewArtifactType={setNewArtifactType}
        setNewArtifactName={setNewArtifactName}
        setNewArtifactValue={setNewArtifactValue}
        setNewArtifactLinkedValue={setNewArtifactLinkedValue}
        handleAddArtifact={handleAddArtifact}
        handleRemoveArtifact={handleRemoveArtifact}
        readOnly={readOnly}
      />
    </div>
  );
};