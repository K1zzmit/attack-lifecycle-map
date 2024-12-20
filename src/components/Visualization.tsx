import React, { useEffect } from 'react';
import { Card } from './ui/card';
import type { TimelineEvent } from '@/pages/Index';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface VisualizationProps {
  events: TimelineEvent[];
}

const Visualization: React.FC<VisualizationProps> = ({ events }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    // Convert events to nodes and edges
    const newNodes = events.map((event) => ({
      id: event.id,
      type: 'default',
      data: { 
        label: (
          <div className="p-2 max-w-[300px]">
            <div className="font-medium truncate">{event.title || 'Untitled Event'}</div>
            <div className="text-xs text-muted-foreground truncate">{event.timestamp}</div>
            {event.host && (
              <div className="text-xs mt-1">
                <span className="font-medium">Host:</span> {event.host}
              </div>
            )}
            {event.user && (
              <div className="text-xs">
                <span className="font-medium">User:</span> {event.user}
              </div>
            )}
            {event.process && (
              <div className="text-xs">
                <span className="font-medium">Process:</span> {event.process}
              </div>
            )}
            {event.technique && (
              <div className="mt-1">
                <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                  {event.technique}
                </span>
              </div>
            )}
          </div>
        )
      },
      position: { 
        x: Math.random() * 500, 
        y: new Date(event.timestamp).getTime() / 100000
      },
      style: {
        width: 300,
      },
    }));

    const newEdges = events
      .filter(event => event.parentId)
      .map(event => ({
        id: `${event.parentId}-${event.id}`,
        source: event.parentId!,
        target: event.id,
        animated: true,
        style: { stroke: 'rgb(148, 163, 184)' },
      }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [events, setNodes, setEdges]);

  return (
    <Card className="h-full bg-background/50 backdrop-blur relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </Card>
  );
};

export default Visualization;