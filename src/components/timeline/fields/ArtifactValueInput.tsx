import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

  // If we have recent values, show the combobox
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
            {value || "Select or enter value..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput 
              placeholder="Search or enter new value..." 
              onValueChange={onChange}
              value={value}
            />
            <CommandEmpty>No value found. Type to add new.</CommandEmpty>
            <CommandGroup>
              {recentValues.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
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
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
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