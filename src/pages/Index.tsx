import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Timeline from "@/components/Timeline";
import Visualization from "@/components/Visualization";
import { useState } from "react";
import { v4 as uuidv4 } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  technique?: string;
  artifacts?: string[];
}

const Index = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  const handleAddEvent = () => {
    const newEvent: TimelineEvent = {
      id: uuidv4(),
      timestamp: new Date().toISOString().slice(0, 16),
      title: "",
      description: "",
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
      description: `Selected: ${event.title}`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Attack Lifecycle Visualization</h1>
        <p className="text-muted-foreground mt-2">
          Visualize and analyze the complete attack sequence
        </p>
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