import React, { useState, useEffect } from 'react';
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
import { Settings2 } from 'lucide-react';
import type { TimelineEvent } from '@/pages/Index';
import { EntityField } from './fields/EntityField';
import { MitreTacticField } from './fields/MitreTacticField';
import { FieldSelector } from './fields/FieldSelector';
import { 
  ALL_AVAILABLE_FIELDS, 
  DEFAULT_FIELDS, 
  FieldName, 
  TACTIC_TEMPLATES 
} from '@/lib/mitre-config';

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
  const [isFieldSelectorOpen, setIsFieldSelectorOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState<FieldName[]>(DEFAULT_FIELDS);

  useEffect(() => {
    if (event?.tactic && TACTIC_TEMPLATES[event.tactic]) {
      const template = TACTIC_TEMPLATES[event.tactic];
      setSelectedFields([
        ...template.requiredFields,
        ...template.optionalFields.filter(field => 
          event[field as keyof TimelineEvent] !== undefined
        )
      ]);
    }
  }, [event?.tactic]);

  if (!event) return null;

  const renderField = (field: FieldName) => {
    switch (field) {
      case 'timestamp':
        return (
          <div key={field} className="grid gap-2">
            <Label htmlFor="timestamp">Timestamp</Label>
            <Input
              id="timestamp"
              type="datetime-local"
              value={event.timestamp || ''}
              onChange={(e) => onEventChange({ ...event, timestamp: e.target.value })}
            />
          </div>
        );
      case 'title':
        return (
          <div key={field} className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={event.title || ''}
              onChange={(e) => onEventChange({ ...event, title: e.target.value })}
            />
          </div>
        );
      case 'host':
        return (
          <EntityField
            key={field}
            label="Host"
            field="host"
            event={event}
            onEventChange={onEventChange}
            recentValues={recentValues.hosts}
          />
        );
      case 'user':
        return (
          <EntityField
            key={field}
            label="User"
            field="user"
            event={event}
            onEventChange={onEventChange}
            recentValues={recentValues.users}
          />
        );
      case 'process':
        return (
          <EntityField
            key={field}
            label="Process"
            field="process"
            event={event}
            onEventChange={onEventChange}
            recentValues={recentValues.processes}
          />
        );
      case 'commandLine':
        return (
          <div key={field} className="grid gap-2">
            <Label htmlFor="commandLine">Command Line</Label>
            <Input
              id="commandLine"
              value={event.commandLine || ''}
              onChange={(e) => onEventChange({ ...event, commandLine: e.target.value })}
            />
          </div>
        );
      case 'sha256':
        return (
          <div key={field} className="grid gap-2">
            <Label htmlFor="sha256">SHA256</Label>
            <Input
              id="sha256"
              value={event.sha256 || ''}
              onChange={(e) => onEventChange({ ...event, sha256: e.target.value })}
            />
          </div>
        );
      case 'description':
        return (
          <div key={field} className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={event.description || ''}
              onChange={(e) => onEventChange({ ...event, description: e.target.value })}
            />
          </div>
        );
      case 'networkDetails.proxyIp':
      case 'networkDetails.port':
      case 'networkDetails.destinationIp':
        const networkField = field.split('.')[1] as keyof typeof event.networkDetails;
        return (
          <div key={field} className="grid gap-2">
            <Label>{networkField === 'proxyIp' ? 'Proxy IP' : 
                   networkField === 'port' ? 'Port' : 
                   'Destination IP'}</Label>
            <Input
              type={networkField === 'port' ? 'number' : 'text'}
              value={event.networkDetails?.[networkField] || ''}
              onChange={(e) => onEventChange({
                ...event,
                networkDetails: {
                  ...event.networkDetails,
                  [networkField]: networkField === 'port' ? 
                    parseInt(e.target.value) || undefined : 
                    e.target.value,
                },
              })}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle>Edit Event</DialogTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFieldSelectorOpen(true)}
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <MitreTacticField event={event} onEventChange={onEventChange} />
        
        {selectedFields.map(field => renderField(field))}
      </div>

      <DialogFooter>
        <Button onClick={onSave}>Save Changes</Button>
      </DialogFooter>

      <FieldSelector
        open={isFieldSelectorOpen}
        onOpenChange={setIsFieldSelectorOpen}
        selectedFields={selectedFields}
        onFieldsChange={setSelectedFields}
      />
    </DialogContent>
  );
};