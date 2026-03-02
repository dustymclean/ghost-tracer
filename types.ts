export enum EntityType {
  INDIVIDUAL = 'Individual',
  COMPANY = 'Company',
  UNKNOWN = 'Unknown'
}

export interface KeyStat {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface TimelineEvent {
  date: string;
  event: string;
  source?: string;
}

export interface Connection {
  name: string;
  roleOrRelation: string;
  strength: number; // 1-10
}

export interface OsintReport {
  targetName: string;
  entityType: EntityType;
  summary: string;
  confidenceScore: number;
  keyStats: KeyStat[];
  timeline: TimelineEvent[];
  connections: Connection[];
  riskFactors: string[];
  digitalFootprint: string[];
  sources: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export type ViewState = 'input' | 'analyzing' | 'dashboard';