import React, { useState } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { TimelineEvent, Artifact } from '@/pages/Index';
import { MitreTacticField } from './fields/MitreTacticField';
import { ChevronDown, ChevronUp, X, Upload } from 'lucide-react';
import { ArtifactField } from './fields/ArtifactField';

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
  const [newArtifactType, setNewArtifactType] = useState<Artifact['type']>('custom');
  const [newArtifactName, setNewArtifactName] = useState('');
  const [newArtifactValue, setNewArtifactValue] = useState('');
  const [newArtifactLinkedValue, setNewArtifactLinkedValue] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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

  const handleArtifactValueChange = (value: string) => {
    console.log('EventDialog handleArtifactValueChange:', value);
    setNewArtifactValue(value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, we'll just store the file name. In a real application,
      // you'd want to handle file upload to a server and store the URL
      onEventChange({
        ...event,
        attachedFile: file.name,
      });
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogDescription>
          Add or modify event details and artifacts
        </DialogDescription>
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

        <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between">
              Additional Details
              {isDetailsOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            <div className="grid gap-2 mt-4">
              <Label htmlFor="searchQuery">Search Query Used</Label>
              <Input
                id="searchQuery"
                value={event.searchQuery || ''}
                onChange={(e) => onEventChange({ ...event, searchQuery: e.target.value })}
                placeholder="Enter the search query used to find this event"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rawLog">Raw Log</Label>
              <Textarea
                id="rawLog"
                value={event.rawLog || ''}
                onChange={(e) => onEventChange({ ...event, rawLog: e.target.value })}
                placeholder="Paste the raw log data here"
                className="font-mono text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="file">Attach File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file')?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {event.attachedFile || 'Upload File'}
                </Button>
                {event.attachedFile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEventChange({ ...event, attachedFile: undefined })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

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

          <ArtifactField
            artifactType={newArtifactType}
            artifactName={newArtifactName}
            artifactValue={newArtifactValue}
            artifactLinkedValue={newArtifactLinkedValue}
            onTypeChange={setNewArtifactType}
            onNameChange={setNewArtifactName}
            onValueChange={handleArtifactValueChange}
            onLinkedValueChange={setNewArtifactLinkedValue}
            onAdd={handleAddArtifact}
            recentArtifacts={recentArtifacts}
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onSave}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  );
};