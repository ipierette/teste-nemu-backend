import { RawEvent } from '../types/RawEvent';

export function removeMiddleDuplicates(events: RawEvent[]): RawEvent[] {
  if (events.length <= 2) {
    return [...events];
  }

  const result: RawEvent[] = [];
  const firstChannel = events[0].utm_source;
  const lastChannel = events[events.length - 1].utm_source;
  const seenInMiddle = new Set<string>();
  
  result.push(events[0]);

  for (let i = 1; i < events.length - 1; i++) {
    const channel = events[i].utm_source;
    
    if (channel !== firstChannel && channel !== lastChannel && !seenInMiddle.has(channel)) {
      result.push(events[i]);
      seenInMiddle.add(channel);
    }
  }

  result.push(events[events.length - 1]);

  return result;
}
