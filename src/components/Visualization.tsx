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
    // Create a map to store node levels
    const nodeLevels = new Map<string, number>();
    const processedNodes = new Set<string>();
    
    // Calculate node levels
    const calculateLevels = (eventId: string, level: number) => {
      if (processedNodes.has(eventId)) return;
      
      nodeLevels.set(eventId, level);
      processedNodes.add(eventId);
      
      // Find child nodes and process them
      events
        .filter(event => event.parentId === eventId)
        .forEach(child => calculateLevels(child.id, level + 1));
    };

    // Find root nodes (nodes without parents) and calculate their subtrees
    events
      .filter(event => !event.parentId)
      .forEach(rootEvent => calculateLevels(rootEvent.id, 0));

    // Group nodes by level
    const nodesByLevel = new Map<number, string[]>();
    nodeLevels.forEach((level, nodeId) => {
      if (!nodesByLevel.has(level)) {
        nodesByLevel.set(level, []);
      }
      nodesByLevel.get(level)?.push(nodeId);
    });

    // Convert events to nodes with calculated positions
    const newNodes = events.map((event) => {
      const level = nodeLevels.get(event.id) || 0;
      const nodesAtLevel = nodesByLevel.get(level) || [];
      const indexAtLevel = nodesAtLevel.indexOf(event.id);
      const spacing = 250;
      
      return {
        id: event.id,
        type: 'default',
        data: { 
          label: (
            <div className="p-2 max-w-[300px] bg-background text-foreground">
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
              {event.sha256 && (
                <div className="text-xs">
                  <span className="font-medium">SHA256:</span> {event.sha256.substring(0, 8)}...
                </div>
              )}
              {event.networkDetails && (
                <div className="text-xs mt-1">
                  {event.networkDetails.proxyIp && (
                    <div><span className="font-medium">Proxy:</span> {event.networkDetails.proxyIp}</div>
                  )}
                  {event.networkDetails.port && (
                    <div><span className="font-medium">Port:</span> {event.networkDetails.port}</div>
                  )}
                  {event.networkDetails.destinationIp && (
                    <div><span className="font-medium">Destination:</span> {event.networkDetails.destinationIp}</div>
                  )}
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
          x: indexAtLevel * spacing, 
          y: level * 200
        },
        style: {
          width: 300,
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
        },
      };
    });

    // Create a color map for parent events
    const colorMap = new Map();
    const colors = [
      'rgb(59, 130, 246)', // blue
      'rgb(16, 185, 129)', // green
      'rgb(239, 68, 68)',  // red
      'rgb(217, 70, 239)', // purple
      'rgb(245, 158, 11)', // orange
    ];
    let colorIndex = 0;

    events.forEach(event => {
      if (event.parentId && !colorMap.has(event.parentId)) {
        colorMap.set(event.parentId, colors[colorIndex % colors.length]);
        colorIndex++;
      }
    });

    const newEdges = events
      .filter(event => event.parentId)
      .map(event => ({
        id: `${event.parentId}-${event.id}`,
        source: event.parentId!,
        target: event.id,
        animated: true,
        style: { stroke: colorMap.get(event.parentId) || 'rgb(148, 163, 184)' },
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