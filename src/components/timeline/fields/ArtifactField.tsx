import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import type { Artifact } from '@/pages/Index';
import { Combobox } from './Combobox';

interface ArtifactFieldProps {
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

export const ArtifactField: React.FC<ArtifactFieldProps> = ({
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
  const handleValueSelect = (selectedValue: string) => {
    console.log("ArtifactField handleValueSelect:", selectedValue);
    const artifact = recentArtifacts[artifactType]?.find(a => a.value === selectedValue);
    onValueChange(selectedValue);
    if (artifact?.linkedValue) {
      onLinkedValueChange(artifact.linkedValue);
    }
  };

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

      {recentArtifacts[artifactType]?.length > 0 ? (
        <Combobox
          items={recentArtifacts[artifactType].map(a => a.value)}
          value={artifactValue}
          onSelect={handleValueSelect}
          onInputChange={onValueChange}
          placeholder="Value"
        />
      ) : (
        <Input
          placeholder="Value"
          value={artifactValue}
          onChange={(e) => onValueChange(e.target.value)}
        />
      )}

      {(artifactType === 'hostname' || artifactType === 'domain' || artifactType === 'file') && (
        <Input
          placeholder={
            artifactType === 'hostname' || artifactType === 'domain'
              ? 'IP Address'
              : 'File Hash'
          }
          value={artifactLinkedValue}
          onChange={(e) => onLinkedValueChange(e.target.value)}
        />
      )}

      <Button onClick={onAdd} type="button" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Artifact
      </Button>
    </div>
  );
};