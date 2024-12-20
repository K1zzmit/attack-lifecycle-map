import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComboboxProps {
  items: string[];
  value: string;
  onSelect: (value: string) => void;
  onInputChange: (value: string) => void;
  placeholder?: string;
}

export function Combobox({ 
  items = [], 
  value, 
  onSelect, 
  onInputChange, 
  placeholder = "Select value..." 
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredItems = React.useMemo(() => {
    if (!search) return items;
    return items.filter(item => 
      item.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const handleSelect = (item: string) => {
    onSelect(item);
    onInputChange(item);
    setSearch("");
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    onInputChange(newValue);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search) {
      e.preventDefault();
      handleSelect(search);
    }
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2" align="start">
          <Input
            placeholder="Search or enter new value..."
            value={search}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="mb-2"
          />
          <ScrollArea className="h-[200px]">
            {filteredItems.length === 0 && search && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Press Enter to add "{search}"
              </div>
            )}
            <div className="space-y-1">
              {filteredItems.map((item) => (
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
    </div>
  );
}