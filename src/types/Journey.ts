import { Touchpoint } from './RawEvent';

/**
 * Represents a processed user journey
 * Contains all touchpoints for a specific session with metadata
 */
export interface Journey {
  sessionId: string;
  userId: string;
  touchpoints: Touchpoint[];
  startTime: string;
  endTime: string;
  duration: number;
  totalTouchpoints: number;
}

/**
 * Response format for the /journeys endpoint
 */
export interface JourneysResponse {
  success: boolean;
  data: Journey[];
  metadata: {
    totalJourneys: number;
    totalTouchpoints: number;
    processedAt: string;
  };
}
