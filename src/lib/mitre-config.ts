import { TimelineEvent } from "@/pages/Index";

export type FieldName = keyof TimelineEvent | 'networkDetails.proxyIp' | 'networkDetails.port' | 'networkDetails.destinationIp';

export interface TacticTemplate {
  name: string;
  requiredFields: FieldName[];
  optionalFields: FieldName[];
  description?: string;
}

export const TACTIC_TEMPLATES: Record<string, TacticTemplate> = {
  'Initial Access': {
    name: 'Initial Access',
    requiredFields: ['host', 'user', 'commandLine'],
    optionalFields: ['networkDetails.proxyIp', 'networkDetails.destinationIp', 'networkDetails.port', 'sha256'],
    description: 'The adversary is trying to get into your network.'
  },
  'Execution': {
    name: 'Execution',
    requiredFields: ['host', 'process', 'commandLine', 'user', 'sha256'],
    optionalFields: ['description'],
    description: 'The adversary is trying to run malicious code.'
  },
  'Persistence': {
    name: 'Persistence',
    requiredFields: ['host', 'process', 'commandLine', 'sha256'],
    optionalFields: ['description', 'user'],
    description: 'The adversary is trying to maintain their foothold.'
  },
  'Lateral Movement': {
    name: 'Lateral Movement',
    requiredFields: ['host', 'user', 'networkDetails.destinationIp', 'networkDetails.port', 'commandLine'],
    optionalFields: ['process', 'sha256'],
    description: 'The adversary is trying to move through your environment.'
  }
};

export const DEFAULT_FIELDS: FieldName[] = [
  'timestamp',
  'title',
  'host',
  'user',
  'description'
];

export const ALL_AVAILABLE_FIELDS: FieldName[] = [
  'timestamp',
  'title',
  'host',
  'user',
  'process',
  'commandLine',
  'sha256',
  'description',
  'networkDetails.proxyIp',
  'networkDetails.port',
  'networkDetails.destinationIp'
];

export const getFieldLabel = (field: FieldName): string => {
  const labels: Record<FieldName, string> = {
    'timestamp': 'Timestamp',
    'title': 'Title',
    'host': 'Host',
    'user': 'User',
    'process': 'Process',
    'commandLine': 'Command Line',
    'sha256': 'SHA256',
    'description': 'Description',
    'networkDetails.proxyIp': 'Proxy IP',
    'networkDetails.port': 'Port',
    'networkDetails.destinationIp': 'Destination IP'
  };
  return labels[field] || field;
};