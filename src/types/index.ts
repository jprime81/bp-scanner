export type ReadingSource = 'manual' | 'scanned';

export type BPCategory = 'normal' | 'elevated' | 'high_stage1' | 'high_stage2' | 'crisis';

export type ArmType = 'left' | 'right';

export type PositionType = 'sitting' | 'standing' | 'lying';

export interface BPReading {
  id?: number;
  timestamp: string; // ISO 8601 format
  systolic: number;
  diastolic: number;
  pulse: number;
  notes?: string;
  arm: ArmType;
  position: PositionType;
  source: ReadingSource;
  createdAt: string;
  updatedAt?: string;
}

export interface SyncLog {
  id?: number;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
  recordCount: number;
  errorMessage?: string;
}

export interface UserSettings {
  biometricEnabled: boolean;
  autoLockMinutes: number;
  defaultArm: ArmType;
  defaultPosition: PositionType;
  cloudBackupEnabled: boolean;
  healthSyncEnabled: boolean;
  reminderEnabled: boolean;
  reminderTime?: string;
}

export interface ChartDataPoint {
  date: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
}

export interface BPStatistics {
  min: { systolic: number; diastolic: number };
  max: { systolic: number; diastolic: number };
  average: { systolic: number; diastolic: number };
  count: number;
}

export interface BackupData {
  version: string;
  exportDate: string;
  readings: BPReading[];
  settings: UserSettings;
}
