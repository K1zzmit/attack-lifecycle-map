import React from 'react';
import { DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import splStyle from 'react-syntax-highlighter/dist/esm/styles/hljs/vs2015';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import shell from 'react-syntax-highlighter/dist/esm/languages/hljs/shell';
import type { TimelineEvent } from '@/pages/Index';
import { EventForm } from './EventForm';
import { DialogHeader } from './DialogHeader';

// Register the languages
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('shell', shell);

interface ReadOnlyViewProps {
  event: TimelineEvent;
  events: TimelineEvent[];
  recentArtifacts: { [key: string]: { value: string; linkedValue?: string }[] };
}

const detectQueryLanguage = (query: string): string => {
  if (query.toLowerCase().includes('search') || query.toLowerCase().includes('index=')) {
    return 'shell'; // For Splunk queries
  }
  return 'sql'; // For KQL and other SQL-like queries
};

export const ReadOnlyView: React.FC<ReadOnlyViewProps> = ({
  event,
  events,
  recentArtifacts,
}) => {
  return (
    <DialogContent className="sm:max-w-[900px]">
      <DialogHeader showDetails={false} onToggleDetails={() => {}} />
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          {event.searchQuery && <TabsTrigger value="search">Search Query</TabsTrigger>}
          {event.rawLog && <TabsTrigger value="log">Raw Log</TabsTrigger>}
          {event.attachedFile && <TabsTrigger value="file">Attachment</TabsTrigger>}
        </TabsList>
        <TabsContent value="details">
          <EventForm
            event={event}
            events={events}
            onEventChange={() => {}}
            recentArtifacts={recentArtifacts}
            newArtifactType="custom"
            newArtifactName=""
            newArtifactValue=""
            newArtifactLinkedValue=""
            setNewArtifactType={() => {}}
            setNewArtifactName={() => {}}
            setNewArtifactValue={() => {}}
            setNewArtifactLinkedValue={() => {}}
            handleAddArtifact={() => {}}
            handleRemoveArtifact={() => {}}
            readOnly={true}
          />
        </TabsContent>
        {event.searchQuery && (
          <TabsContent value="search" className="space-y-4">
            <h3 className="text-lg font-medium">Search Query</h3>
            <div className="min-h-[200px] max-h-[400px] overflow-auto">
              <SyntaxHighlighter
                language={detectQueryLanguage(event.searchQuery)}
                style={splStyle}
                customStyle={{
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.25rem',
                }}
              >
                {event.searchQuery}
              </SyntaxHighlighter>
            </div>
          </TabsContent>
        )}
        {event.rawLog && (
          <TabsContent value="log" className="space-y-4">
            <h3 className="text-lg font-medium">Raw Log</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto font-mono text-sm">
              {event.rawLog}
            </pre>
          </TabsContent>
        )}
        {event.attachedFile && (
          <TabsContent value="file" className="space-y-4">
            <h3 className="text-lg font-medium">Attached File</h3>
            <p>{event.attachedFile}</p>
          </TabsContent>
        )}
      </Tabs>
    </DialogContent>
  );
};