import { Touchpoint } from './RawEvent';

export interface Journey {
  sessionId: string;
  userId: string;
  touchpoints: Touchpoint[];
  originalTouchpoints: Touchpoint[];
  startTime: string;
  endTime: string;
  duration: number;
  totalTouchpoints: number;
}

export interface JourneysResponse {
  success: boolean;
  data: Journey[];
  metadata: {
    totalJourneys: number;
    totalTouchpoints: number;
    processedAt: string;
  };
}
