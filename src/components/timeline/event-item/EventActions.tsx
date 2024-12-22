import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TimelineEvent } from '@/pages/Index';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface EventActionsProps {
  onDelete: (eventId: string) => void;
  eventId: string;
  onUpdateEvent: (event: TimelineEvent) => void;
}

export const EventActions: React.FC<EventActionsProps> = ({ onDelete, eventId, onUpdateEvent }) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newEventTitle, setNewEventTitle] = React.useState("");
  const [newEventDescription, setNewEventDescription] = React.useState("");

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(eventId);
  };

  const handleAddChildClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  const handleCreateChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString().slice(0, 16),
      title: newEventTitle || "New Child Event",
      description: newEventDescription,
      parentId: eventId,
      artifacts: [],
    };
    onUpdateEvent(newEvent);
    setIsDialogOpen(false);
    setNewEventTitle("");
    setNewEventDescription("");
    toast({
      title: "Child Event Added",
      description: "A new child event has been created.",
    });
  };

  return (
    <>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAddChildClick}
          title="Add Child Event"
        >
          <Plus className="h-4 w-4 text-primary hover:text-primary/80" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent onClick={e => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Create Child Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Enter event title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                placeholder="Enter event description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateChild}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};