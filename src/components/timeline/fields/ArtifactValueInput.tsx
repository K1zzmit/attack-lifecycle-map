import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ArtifactValueInputProps {
  type: string;
  value: string;
  onChange: (value: string) => void;
  recentValues: string[];
}

export const ArtifactValueInput: React.FC<ArtifactValueInputProps> = ({
  value,
  onChange,
  recentValues,
}) => {
  // If we have recent values, show the select, otherwise show a regular input
  if (recentValues.length > 0) {
    return (
      <Select
        value={value || undefined}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select or enter value..." />
        </SelectTrigger>
        <SelectContent>
          {recentValues.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // If no recent values, show a regular input
  return (
    <Input
      placeholder="Value"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};