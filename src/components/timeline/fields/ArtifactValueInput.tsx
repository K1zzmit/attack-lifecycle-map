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
  const [search, setSearch] = useState('');

  const filteredValues = recentValues.filter(item =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setSearch('');
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    onChange(newValue);
  };

  return (
    <div className="relative w-full">
      {recentValues.length > 0 ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {value || 'Select value...'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-2" align="start">
            <Input
              placeholder="Search or enter new value..."
              value={search}
              onChange={handleInputChange}
              className="mb-2"
            />
            <ScrollArea className="h-[200px]">
              {filteredValues.length === 0 && search && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No matches found
                </div>
              )}
              <div className="space-y-1">
                {filteredValues.map((item) => (
                  <Button
                    key={item}
                    variant="ghost"
                    className="w-full justify-start font-normal"
                    onClick={() => handleSelect(item)}
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
      ) : (
        <Input
          placeholder="Value"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
};