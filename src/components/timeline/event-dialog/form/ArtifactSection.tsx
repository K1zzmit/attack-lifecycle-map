import React from 'react';
import { Label } from '@/components/ui/label';
import type { Artifact } from '@/pages/Index';
import { ArtifactField } from '../../fields/ArtifactField';

interface ArtifactSectionProps {
  artifacts?: Artifact[];
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

export const ArtifactSection: React.FC<ArtifactSectionProps> = ({
  artifacts,
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
      <Label>Artifacts</Label>
      <div className="grid gap-4">
        {artifacts?.map((artifact, index) => (
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
  );
};