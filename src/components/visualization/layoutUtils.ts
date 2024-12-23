import type { TimelineEvent } from '@/pages/Index';
import type { Node, Edge } from '@xyflow/react';

export const calculateLayout = (events: TimelineEvent[]): { nodes: Node[], edges: Edge[] } => {
  const nodeLevels = new Map<string, number>();
  const processedNodes = new Set<string>();
  
  // First pass: Calculate levels for non-lateral movement nodes
  const calculateLevels = (eventId: string, level: number) => {
    if (processedNodes.has(eventId)) return;
    
    nodeLevels.set(eventId, level);
    processedNodes.add(eventId);
    
    events
      .filter(event => event.parentId === eventId && !event.isLateralMovement)
      .forEach(child => calculateLevels(child.id, level + 1));
  };

  // Find root events and calculate their levels
  events
    .filter(event => !event.parentId)
    .forEach(rootEvent => calculateLevels(rootEvent.id, 0));

  // Second pass: Handle lateral movement nodes
  events
    .filter(event => event.isLateralMovement)
    .forEach(event => {
      // Place lateral movement nodes at level 0 (root level)
      nodeLevels.set(event.id, 0);
      processedNodes.add(event.id);
      
      // Calculate levels for their children
      events
        .filter(child => child.parentId === event.id)
        .forEach(child => calculateLevels(child.id, 1));
    });

  const nodesByLevel = new Map<number, string[]>();
  nodeLevels.forEach((level, nodeId) => {
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)?.push(nodeId);
  });

  const horizontalSpacing = 400;
  const verticalSpacing = 250;

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
        borderColor: event.isLateralMovement ? '#ff6b6b' : 'hsl(var(--border))',
        borderWidth: event.isLateralMovement ? '3px' : '1px',
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
    .map(event => {
      const isLateralMovement = event.isLateralMovement || events.find(e => e.id === event.parentId)?.isLateralMovement;
      const baseColor = event.parentId ? colorMap.get(event.parentId) || 'rgb(148, 163, 184)' : 'rgb(148, 163, 184)';
      
      return {
        id: `${event.parentId}-${event.id}`,
        source: event.parentId!,
        target: event.id,
        animated: isLateralMovement,
        className: isLateralMovement ? 'lateral' : undefined,
        style: { 
          stroke: isLateralMovement ? '#ff6b6b' : baseColor,
        },
      };
    });

  // Add additional edges to show lateral movement source
  const lateralMovementEdges = events
    .filter(event => event.isLateralMovement && event.parentId)
    .map(event => ({
      id: `lateral-${event.parentId}-${event.id}`,
      source: event.parentId!,
      target: event.id,
      animated: true,
      className: 'lateral',
      style: { 
        stroke: '#ff6b6b',
        strokeDasharray: '5,5',
      },
    }));

  return { 
    nodes, 
    edges: [...edges, ...lateralMovementEdges]
  };
};