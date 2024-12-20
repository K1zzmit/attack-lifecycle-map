import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import type { Artifact } from '@/pages/Index';
import { ArtifactValueInput } from './ArtifactValueInput';

interface ArtifactFormProps {
  artifactType: Artifact['type'];
  artifactName: string;
  artifactValue: string;
  artifactLinkedValue: string;
  onTypeChange: (value: Artifact['type']) => void;
  onNameChange: (value: string) => void;
  onValueChange: (value: string) => void;
  onLinkedValueChange: (value: string) => void;
  onAdd: () => void;
  recentArtifacts: {
    [key: string]: { value: string; linkedValue?: string }[];
  };
}

export const ArtifactForm: React.FC<ArtifactFormProps> = ({
  artifactType,
  artifactName,
  artifactValue,
  artifactLinkedValue,
  onTypeChange,
  onNameChange,
  onValueChange,
  onLinkedValueChange,
  onAdd,
  recentArtifacts,
}) => {
  const showLinkedValue = artifactType === 'hostname' || 
                         artifactType === 'domain' || 
                         artifactType === 'file';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Select value={artifactType} onValueChange={onTypeChange}>
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
          value={artifactName}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      <ArtifactValueInput
        type={artifactType}
        value={artifactValue}
        onChange={onValueChange}
        recentValues={recentArtifacts[artifactType]?.map(a => a.value) || []}
      />

      {showLinkedValue && (
        <Input
          placeholder={
            artifactType === 'file'
              ? 'File Hash'
              : 'IP Address'
          }
          value={artifactLinkedValue}
          onChange={(e) => onLinkedValueChange(e.target.value)}
        />
      )}

      <Button 
        onClick={onAdd} 
        type="button" 
        className="w-full"
        disabled={!artifactName || !artifactValue}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Artifact
      </Button>
    </div>
  );
};