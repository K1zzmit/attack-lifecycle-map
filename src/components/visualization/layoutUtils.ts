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

  const edges = events
    .filter(event => event.parentId)
    .map(event => {
      const isLateralMovement = event.isLateralMovement || events.find(e => e.id === event.parentId)?.isLateralMovement;
      
      return {
        id: `${event.parentId}-${event.id}`,
        source: event.parentId!,
        target: event.id,
        animated: isLateralMovement,
        className: isLateralMovement ? 'lateral' : undefined,
        style: { 
          stroke: isLateralMovement ? '#ff6b6b' : 'rgb(148, 163, 184)',
        },
      };
    });

  return { nodes, edges };
};