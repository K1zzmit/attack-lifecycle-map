import React, { useState } from 'react';
import Timeline from '@/components/Timeline';
import Visualization from '@/components/Visualization';
import { useToast } from '@/components/ui/use-toast';

interface Event {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  technique?: string;
  artifacts?: string[];
}

const Index = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      timestamp: '2024-04-10 09:15:00',
      title: 'Initial Access',
      description: 'Phishing email detected targeting finance department',
      technique: 'T1566.001 - Spearphishing Attachment',
    },
    {
      id: '2',
      timestamp: '2024-04-10 09:30:00',
      title: 'Execution',
      description: 'Malicious macro executed on WORKSTATION-01',
      technique: 'T1204.002 - Malicious File',
    },
  ]);

  const handleAddEvent = () => {
    const newEvent: Event = {
      id: String(events.length + 1),
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      title: 'New Event',
      description: 'Description of the new event',
    };
    setEvents([...events, newEvent]);
    toast({
      title: 'Event Added',
      description: 'A new event has been added to the timeline.',
    });
  };

  const handleSelectEvent = (event: Event) => {
    toast({
      title: 'Event Selected',
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
        <Timeline
          events={events}
          onAddEvent={handleAddEvent}
          onSelectEvent={handleSelectEvent}
        />
        <Visualization events={events} />
      </div>
    </div>
  );
};

export default Index;