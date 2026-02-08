export interface ChecklistItem {
  id: number;
  description: string;
  completed: boolean;
  hasAudio: boolean;
  hasVideo: boolean;
  videoUrl?: string;
  timestamp?: string;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  line: string;
  status: 'completed' | 'in-progress' | 'pending' | 'delayed';
  progress: number;
  checklist: ChecklistItem[];
  estimatedCompletion?: string;
}

export interface Worker {
  id: string;
  name: string;
  status: 'active' | 'break' | 'offline';
  currentMachine?: Machine;
  completedMachines: string[];
  totalAssigned: number;
  glassConnected: boolean;
  batteryLevel: number;
  lastActivity: string;
}

export interface CompletedMachine {
  id: string;
  name: string;
  type: string;
  line: string;
  workerName: string;
  completedTime: string;
  completedDate: string;
}