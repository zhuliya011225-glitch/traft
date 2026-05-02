export type PageId = 'dashboard' | 'trend' | 'workshop' | 'distribution' | 'growth' | 'settings' | 'profile' | 'security';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  role: string;
}

export interface TrendTopic {
  id: string;
  title: string;
  heat: number;
  score: number;
  tags: string[];
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  updatedAt: string;
  platform: string;
  status: 'draft' | 'published';
  type?: string;
  content?: string; // Adding content field for pre-filling
  expectedPublish?: string;
  stats?: {
    views?: string;
    likes?: string;
    saves?: string;
    leads?: string;
    playback?: string;
  };
}

export interface NavigationData {
  type: 'project' | 'topic';
  data: Project | TrendTopic;
}
