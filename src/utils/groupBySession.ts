import { RawEvent } from '../types/RawEvent';

/**
 * Groups raw events by sessionId
 * Pure function - does not mutate input
 * 
 * @param events - Array of raw events to group
 * @returns Map of sessionId to array of events
 */
export function groupBySession(events: RawEvent[]): Map<string, RawEvent[]> {
  const grouped = new Map<string, RawEvent[]>();

  for (const event of events) {
    const existing = grouped.get(event.sessionId);
    if (existing) {
      existing.push(event);
    } else {
      grouped.set(event.sessionId, [event]);
    }
  }

  return grouped;
}
