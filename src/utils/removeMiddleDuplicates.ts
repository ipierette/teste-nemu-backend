import { RawEvent } from '../types/RawEvent';

export function removeMiddleDuplicates(events: RawEvent[]): RawEvent[] {
  if (events.length <= 2) {
    return [...events];
  }

  const result: RawEvent[] = [events[0]];

  for (let i = 1; i < events.length - 1; i++) {
    const currentChannel = events[i].utm_source;
    const previousChannel = events[i - 1].utm_source;
    
    if (currentChannel !== previousChannel) {
      result.push(events[i]);
    }
  }

  result.push(events[events.length - 1]);

  return result;
}
