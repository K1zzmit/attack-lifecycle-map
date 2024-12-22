import { Plus, Link } from 'lucide-react';
import { Button } from '../ui/button';
import { useTimelineContext } from './TimelineContext';

interface TimelineHeaderProps {
  onAddEvent: () => void;
}

export const TimelineHeader = ({ onAddEvent }: TimelineHeaderProps) => {
  const { toast } = useTimelineContext();

  const handleQuickLink = () => {
    toast({
      title: "Quick Link Mode",
      description: "Click two events to link them together. The first event will be the parent.",
    });
  };

  return (
    <div className="p-4 border-b flex items-center justify-between">
      <h2 className="text-lg font-semibold">Timeline</h2>
      <div className="flex gap-2">
        <Button onClick={handleQuickLink} size="sm" variant="outline">
          <Link className="w-4 h-4 mr-2" />
          Quick Link
        </Button>
        <Button onClick={onAddEvent} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>
    </div>
  );
};