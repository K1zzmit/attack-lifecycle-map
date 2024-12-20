import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MITRE_TACTICS_AND_TECHNIQUES } from "@/lib/mitre";
import { TimelineEvent } from "@/pages/Index";

interface MitreTacticFieldProps {
  event: TimelineEvent;
  onEventChange: (event: TimelineEvent) => void;
}

export const MitreTacticField: React.FC<MitreTacticFieldProps> = ({ event, onEventChange }) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="tactic">MITRE Tactic</Label>
      <Select
        value={event.tactic || ''}
        onValueChange={(value) => onEventChange({ 
          ...event, 
          tactic: value,
          // Clear technique when tactic changes
          technique: undefined 
        })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select tactic" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(MITRE_TACTICS_AND_TECHNIQUES).map((tactic) => (
            <SelectItem key={tactic} value={tactic}>
              {tactic}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label htmlFor="technique">MITRE Technique</Label>
      <Select
        value={event.technique || ''}
        onValueChange={(value) => onEventChange({ ...event, technique: value })}
        disabled={!event.tactic}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select technique" />
        </SelectTrigger>
        <SelectContent>
          {event.tactic && MITRE_TACTICS_AND_TECHNIQUES[event.tactic]?.map((technique) => (
            <SelectItem key={technique} value={technique}>
              {technique}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};