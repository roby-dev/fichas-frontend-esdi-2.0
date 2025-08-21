import { AlertSignalChild } from './alert-signal-child.interface';

export interface BulkUpdateResponse {
  ok: boolean;
  message: string;
  data: AlertSignalChild[];
}
