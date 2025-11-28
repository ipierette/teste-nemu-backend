import { z } from 'zod';

/**
 * Schema validation for raw event data from XLSX
 * Ensures data integrity before processing
 */
export const RawEventSchema = z.object({
  utm_source: z.string().min(1, 'utm_source is required'),
  utm_campaign: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_content: z.string().optional(),
  sessionId: z.string().min(1, 'sessionId is required'),
  createdAt: z.string().min(1, 'createdAt is required'),
});

/**
 * Type representing a raw event from the XLSX file
 */
export type RawEvent = z.infer<typeof RawEventSchema>;

/**
 * Type for touchpoint in a journey
 */
export interface Touchpoint {
  channel: string;
  timestamp: string;
}
