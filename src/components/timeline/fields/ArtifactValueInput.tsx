import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [open, setOpen] = useState(false);

  // If we have recent values, show the combobox, otherwise show a regular input
  if (recentValues.length > 0) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value || "Select value..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <ScrollArea className="h-[200px]">
            <div className="space-y-1 p-2">
              {recentValues.map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start font-normal",
                    value === item && "bg-accent"
                  )}
                  onClick={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
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