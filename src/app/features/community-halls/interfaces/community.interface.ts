import { Committee } from '@/features/committees/interfaces/committee.interface';

export interface CommunityHall {
  id: string;
  localId: string;
  name: string;
  committeeRef: string;
  committee: Committee;
}
