// src/models/Report.ts
export enum ReportStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

export enum TargetType {
  REPORT = 'REPORT',
  POST = 'POST',
  COMMENT = 'COMMENT',
  MESSAGE = 'MESSAGE',
  USER = 'USER',
}

export interface Report {
  id: number;
  reporterId: number | null;
  handleBy: number | null;
  targetType: TargetType;
  targetId: number;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt?: string | null;
}
