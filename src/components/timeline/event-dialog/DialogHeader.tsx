import React from 'react';
import {
  DialogHeader as Header,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface DialogHeaderProps {
  showDetails: boolean;
  onToggleDetails: () => void;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  showDetails,
  onToggleDetails,
}) => {
  return (
    <Header>
      <div className="flex justify-between items-center">
        <DialogTitle>{showDetails ? "Event Details" : "Edit Event"}</DialogTitle>
        <Button
          variant="outline"
          onClick={onToggleDetails}
        >
          {showDetails ? "Edit Event" : "Additional Details"}
        </Button>
      </div>
      <DialogDescription>
        {showDetails 
          ? "View and edit additional event details"
          : "Add or modify event details and artifacts"
        }
      </DialogDescription>
    </Header>
  );
};