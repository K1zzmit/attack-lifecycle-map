import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ALL_AVAILABLE_FIELDS, FieldName, getFieldLabel } from '@/lib/mitre-config';

interface FieldSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFields: FieldName[];
  onFieldsChange: (fields: FieldName[]) => void;
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  open,
  onOpenChange,
  selectedFields,
  onFieldsChange,
}) => {
  const handleToggleField = (field: FieldName) => {
    if (selectedFields.includes(field)) {
      onFieldsChange(selectedFields.filter(f => f !== field));
    } else {
      onFieldsChange([...selectedFields, field]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize Fields</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {ALL_AVAILABLE_FIELDS.map((field) => (
              <div key={field} className="flex items-center space-x-2">
                <Checkbox
                  id={field}
                  checked={selectedFields.includes(field)}
                  onCheckedChange={() => handleToggleField(field)}
                />
                <Label htmlFor={field}>{getFieldLabel(field)}</Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};