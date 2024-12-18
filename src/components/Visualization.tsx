import React, { useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';

interface VisualizationProps {
  events: any[];
}

const Visualization: React.FC<VisualizationProps> = ({ events }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = React.useState(1);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  return (
    <Card className="h-full bg-background/50 backdrop-blur relative">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button variant="outline" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={containerRef}
        className="h-full overflow-hidden"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: '50% 0',
          transition: 'transform 0.2s ease-out',
        }}
      >
        {events.map((event) => (
          <div key={event.id} className="visualization-node">
            {/* Node content */}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Visualization;