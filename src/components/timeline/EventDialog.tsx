import React, { useState } from 'react';
import {
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import type { TimelineEvent, Artifact } from '@/pages/Index';
import { EventForm } from './event-dialog/EventForm';
import { EventDetails } from './event-dialog/EventDetails';
import { DialogHeader } from './event-dialog/DialogHeader';

interface EventDialogProps {
  event: TimelineEvent | null;
  events: TimelineEvent[];
  onEventChange: (event: TimelineEvent) => void;
  onSave: () => void;
}

export const EventDialog: React.FC<EventDialogProps> = ({
  event,
  events,
  onEventChange,
  onSave,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [newArtifactType, setNewArtifactType] = useState<Artifact['type']>('custom');
  const [newArtifactName, setNewArtifactName] = useState('');
  const [newArtifactValue, setNewArtifactValue] = useState('');
  const [newArtifactLinkedValue, setNewArtifactLinkedValue] = useState('');

  if (!event) return null;

  const recentArtifacts = events.reduce((acc, evt) => {
    evt.artifacts?.forEach(artifact => {
      if (!acc[artifact.type]) {
        acc[artifact.type] = [];
      }
      const existingArtifact = acc[artifact.type].find(a => a.value === artifact.value);
      if (!existingArtifact) {
        acc[artifact.type].push({
          value: artifact.value,
          linkedValue: artifact.linkedValue,
        });
      }
    });
    return acc;
  }, {} as { [key: string]: { value: string; linkedValue?: string }[] });

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
    <DialogContent className="sm:max-w-[900px]">
      <DialogHeader
        showDetails={showDetails}
        onToggleDetails={() => setShowDetails(!showDetails)}
      />

      {showDetails ? (
        <EventDetails
          event={event}
          onEventChange={onEventChange}
        />
      ) : (
        <EventForm
          event={event}
          events={events}
          onEventChange={onEventChange}
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
        />
      )}

      <DialogFooter>
        <Button onClick={onSave}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  );
};