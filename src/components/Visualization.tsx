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
    const event = (node.data?.label?.props?.event || {}) as TimelineEvent;
    
    if (event.isLateralMovement) {
      return '#ff6b6b';
    }

    const colorMap: Record<string, string> = {
      'Initial Access': '#ff0000',
      'Execution': '#00ff00',
      'Persistence': '#0000ff',
    };
    return colorMap[event.tactic as string] || '#666666';
  };

  return (
    <Card className="h-full bg-background/50 backdrop-blur relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        className="
          [&_.react-flow__controls]:!bg-black 
          [&_.react-flow__controls]:!border-white 
          [&_.react-flow__controls]:!border-[3px] 
          [&_.react-flow__controls]:!rounded-none 
          [&_.react-flow__controls]:!p-3
          [&_.react-flow__controls]:!shadow-none
          [&_.react-flow__controls-button]:!bg-black
          [&_.react-flow__controls-button]:!border-white
          [&_.react-flow__controls-button]:!border-2
          [&_.react-flow__controls-button]:!text-white
          [&_.react-flow__controls-button:hover]:!bg-[#333333]
          [&_.react-flow__controls-button]:!w-10
          [&_.react-flow__controls-button]:!h-10
          [&_.react-flow__controls-button]:!m-1
          [&_.react-flow__controls-button]:!rounded-none
          [&_.react-flow__controls-button]:!font-bold
          [&_.react-flow__controls]:![transform:scale(1.2)]
          [&_.react-flow__controls-button_svg]:!text-white
          [&_.react-flow__controls-button_svg]:!w-6
          [&_.react-flow__controls-button_svg]:!h-6
          [&_.react-flow__node]:!border-2 
          [&_.react-flow__node]:!border-border
          [&_.react-flow__edge-path]:!stroke-[3px]
          [&_.react-flow__edge.lateral]:!stroke-[#ff6b6b]
          [&_.react-flow__edge.lateral]:!animate-pulse
        "
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