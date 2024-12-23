import type { TimelineEvent } from '@/pages/Index';
import type { Node, Edge } from '@xyflow/react';

export const calculateLayout = (events: TimelineEvent[]): { nodes: Node[], edges: Edge[] } => {
  const nodeLevels = new Map<string, number>();
  const processedNodes = new Set<string>();
  
  const calculateLevels = (eventId: string, level: number) => {
    if (processedNodes.has(eventId)) return;
    
    nodeLevels.set(eventId, level);
    processedNodes.add(eventId);
    
    events
      .filter(event => event.parentId === eventId)
      .forEach(child => calculateLevels(child.id, level + 1));
  };

  events
    .filter(event => !event.parentId)
    .forEach(rootEvent => calculateLevels(rootEvent.id, 0));

  const nodesByLevel = new Map<number, string[]>();
  nodeLevels.forEach((level, nodeId) => {
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)?.push(nodeId);
  });

  // Increased spacing between nodes
  const horizontalSpacing = 400; // Increased from 250
  const verticalSpacing = 250;   // Increased from 200

  const nodes = events.map((event) => {
    const level = nodeLevels.get(event.id) || 0;
    const nodesAtLevel = nodesByLevel.get(level) || [];
    const indexAtLevel = nodesAtLevel.indexOf(event.id);
    
    return {
      id: event.id,
      type: 'default',
      data: { label: event },
      position: { 
        x: indexAtLevel * horizontalSpacing, 
        y: level * verticalSpacing
      },
      style: {
        width: 300,
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        border: '1px solid hsl(var(--border))',
      },
    };
  });

  const colorMap = new Map<string, string>();
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

  const edges = events
    .filter(event => event.parentId)
    .map(event => ({
      id: `${event.parentId}-${event.id}`,
      source: event.parentId!,
      target: event.id,
      animated: true,
      style: { stroke: event.parentId ? colorMap.get(event.parentId) || 'rgb(148, 163, 184)' : 'rgb(148, 163, 184)' },
    }));

  return { nodes, edges };
};