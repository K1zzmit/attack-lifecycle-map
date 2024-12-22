import React, { useState } from 'react';
import {
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import type { TimelineEvent, Artifact } from '@/pages/Index';
import { EventForm } from './EventForm';
import { EventDetails } from './EventDetails';
import { DialogHeader } from './DialogHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EventDialogProps {
  event: TimelineEvent | null;
  events: TimelineEvent[];
  onEventChange: (event: TimelineEvent) => void;
  onSave: () => void;
  isEditMode: boolean;
}

export const EventDialog: React.FC<EventDialogProps> = ({
  event,
  events,
  onEventChange,
  onSave,
  isEditMode,
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

  if (!isEditMode) {
    return (
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader showDetails={false} onToggleDetails={() => {}} />
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            {event.searchQuery && <TabsTrigger value="search">Search Query</TabsTrigger>}
            {event.rawLog && <TabsTrigger value="log">Raw Log</TabsTrigger>}
            {event.attachedFile && <TabsTrigger value="file">Attachment</TabsTrigger>}
          </TabsList>
          <TabsContent value="details">
            <EventForm
              event={event}
              events={events}
              onEventChange={() => {}}
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
              readOnly={true}
            />
          </TabsContent>
          {event.searchQuery && (
            <TabsContent value="search" className="space-y-4">
              <h3 className="text-lg font-medium">Search Query</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-auto">
                {event.searchQuery}
              </pre>
            </TabsContent>
          )}
          {event.rawLog && (
            <TabsContent value="log" className="space-y-4">
              <h3 className="text-lg font-medium">Raw Log</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-auto font-mono text-sm">
                {event.rawLog}
              </pre>
            </TabsContent>
          )}
          {event.attachedFile && (
            <TabsContent value="file" className="space-y-4">
              <h3 className="text-lg font-medium">Attached File</h3>
              <p>{event.attachedFile}</p>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    );
  }

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
          readOnly={false}
        />
      )}

      <DialogFooter>
        <Button onClick={onSave}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  );
};