import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

interface ComboboxProps {
  items: string[];
  value: string;
  onSelect: (value: string) => void;
  onInputChange: (value: string) => void;
  placeholder?: string;
}

export function Combobox({ items = [], value, onSelect, onInputChange, placeholder }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const safeItems = items || [];

  const handleSelect = React.useCallback((currentValue: string) => {
    if (currentValue) {
      onSelect(currentValue);
      setOpen(false);
    }
  }, [onSelect]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || placeholder || "Select value..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Search or enter new value..." 
            value={value}
            onValueChange={onInputChange}
          />
          <CommandEmpty>No matching value found.</CommandEmpty>
          <CommandGroup>
            {safeItems.map((item) => (
              <CommandItem
                key={item}
                value={item}
                onSelect={handleSelect}
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