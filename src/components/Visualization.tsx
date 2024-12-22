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
  GetMiniMapNodeAttribute,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TimelineNode } from './visualization/TimelineNode';
import { calculateLayout } from './visualization/layoutUtils';

interface VisualizationProps {
  events: TimelineEvent[];
}

const Visualization: React.FC<VisualizationProps> = ({ events }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const { nodes: layoutNodes, edges: layoutEdges } = calculateLayout(events);
    
    const nodesWithCustomRenderer = layoutNodes.map(node => ({
      ...node,
      data: { 
        label: <TimelineNode event={node.data.label as TimelineEvent} /> 
      }
    }));

    setNodes(nodesWithCustomRenderer);
    setEdges(layoutEdges);
  }, [events, setNodes, setEdges]);

  const getNodeColor: GetMiniMapNodeAttribute = (node) => {
    const colorMap: Record<string, string> = {
      'Initial Access': '#ff0000',
      'Execution': '#00ff00',
      'Persistence': '#0000ff',
    };
    return colorMap[node.data?.tactic as string] || '#666666';
  };

  return (
    <Card className="h-full bg-background/50 backdrop-blur relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        className="[&_.react-flow__node]:!border-2 [&_.react-flow__node]:!border-border [&_.react-flow__controls]:!bg-background/95 [&_.react-flow__controls-button]:!bg-background/95 [&_.react-flow__controls-button]:!text-foreground [&_.react-flow__controls-button:hover]:!bg-accent [&_.react-flow__controls-button]:!border-border [&_.react-flow__controls]:!border [&_.react-flow__controls]:!border-border [&_.react-flow__controls]:!rounded-md [&_.react-flow__controls]:!shadow-md"
      >
        <Background />
        <Controls />
        <MiniMap 
          className="!bg-background !border-border" 
          nodeColor={getNodeColor}
        />
      </ReactFlow>
    </Card>
  );
};

export default Visualization;