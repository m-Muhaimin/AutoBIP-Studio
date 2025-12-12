
export enum Tab {
  LOGS = 'LOGS',
  DRAFTS = 'DRAFTS',
  SCHEDULED = 'SCHEDULED',
  POSTED = 'POSTED',
  ANALYTICS = 'ANALYTICS',
  INTEGRATIONS = 'INTEGRATIONS'
}

export enum PostTone {
  PROFESSIONAL = 'Professional',
  HUMBLE_BUILDER = 'Humble Builder',
  CONTRARIAN = 'Contrarian',
  DATA_FOCUSED = 'Data-Focused'
}

export enum ContentStrategy {
  STANDARD_UPDATE = 'Standard Update',
  BUILD_IN_PUBLIC = 'Build in Public Journey'
}

export interface ThreadItem {
  id: string;
  content: string;
  isMain: boolean;
}

export interface Draft {
  id: string;
  title: string;
  source: string; 
  sourceIcon: 'github' | 'linear' | 'jira' | 'news';
  content: ThreadItem[];
  status: 'draft' | 'scheduled' | 'posted';
  createdAt: Date;
  scheduledFor?: Date;
  imageUrl?: string;
  relatedActivities?: Activity[];
}

export type ActivityType = 'feature' | 'fix' | 'chore' | 'content';

export interface Activity {
  id: string;
  description: string;
  date: string;
  source: 'github' | 'linear' | 'jira';
  type: ActivityType;
  repoOrProject: string;
  selected: boolean;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AnalyticsMetric {
  label: string;
  value: string;
  trend: number; // percentage
  trendDirection: 'up' | 'down';
}

export interface IntegrationStatus {
  id: string;
  name: string;
  connected: boolean;
  lastSync?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'trend' | 'gap';
  timestamp: Date;
  actionQuery: string; // The topic to generate a draft about
}

export interface OnboardingData {
  hasConnectedGithub: boolean;
  productAreas: string[];
  logTypes: string[];
}
