import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Timeline from "@/components/Timeline";
import Visualization from "@/components/Visualization";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Eye, Edit2 } from "lucide-react";

export interface NetworkDetails {
  proxyIp?: string;
  port?: string;
  destinationIp?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  tactic?: string;
  technique?: string;
  parentId?: string;
  artifacts: Artifact[];
  order?: number;
  // Additional fields for event details
  searchQuery?: string;
  rawLog?: string;
  attachedFile?: string;
  // Legacy fields (to maintain compatibility)
  host?: string;
  user?: string;
  process?: string;
  sha256?: string;
  networkDetails?: NetworkDetails;
}

export interface Artifact {
  type: 'hostname' | 'domain' | 'file' | 'ip' | 'hash' | 'custom';
  name: string;
  value: string;
  linkedValue?: string;
}

const Index = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isEditMode, setIsEditMode] = useState(true);

  const handleAddEvent = () => {
    const newEvent: TimelineEvent = {
      id: uuidv4(),
      timestamp: new Date().toISOString().slice(0, 16),
      title: "",
      description: "",
      artifacts: [],
    };
    setEvents([...events, newEvent]);
    toast({
      title: "Event Added",
      description: "A new event has been added to the timeline.",
    });
  };

  const handleSelectEvent = (event: TimelineEvent) => {
    toast({
      title: "Event Selected",
      description: `Selected: ${event.title || 'Untitled Event'}`,
    });
  };

  const handleUpdateEvent = (updatedEvent: TimelineEvent) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    toast({
      title: "Event Updated",
      description: "The event has been successfully updated.",
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Attack Lifecycle Visualization</h1>
            <p className="text-muted-foreground mt-2">
              Visualize and analyze the complete attack sequence
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEditMode(!isEditMode)}
            className="gap-2"
          >
            {isEditMode ? (
              <>
                <Eye className="h-4 w-4" />
                Switch to View Mode
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4" />
                Switch to Edit Mode
              </>
            )}
          </Button>
        </div>
      </div>
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline" className="h-[calc(100vh-16rem)]">
          <Timeline
            events={events}
            onAddEvent={handleAddEvent}
            onSelectEvent={handleSelectEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            isEditMode={isEditMode}
          />
        </TabsContent>
        <TabsContent value="visualization" className="h-[calc(100vh-16rem)]">
          <Visualization events={events} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
