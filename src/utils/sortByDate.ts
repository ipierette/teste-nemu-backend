import { RawEvent } from '../types/RawEvent';

/**
 * Sorts events by createdAt timestamp in ascending order
 * Pure function - returns new sorted array
 * 
 * @param events - Array of events to sort
 * @returns New array sorted by timestamp
 */
export function sortByDate(events: RawEvent[]): RawEvent[] {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateA - dateB;
  });
}
