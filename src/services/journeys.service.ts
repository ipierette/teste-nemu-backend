import path from 'path';
import { parseXlsx } from '../utils/parseXlsx';
import { groupBySession } from '../utils/groupBySession';
import { sortByDate } from '../utils/sortByDate';
import { removeMiddleDuplicates } from '../utils/removeMiddleDuplicates';
import { Journey, JourneysResponse } from '../types/Journey';
import { RawEvent, Touchpoint } from '../types/RawEvent';

export class JourneysService {
  private readonly xlsxFilePath: string;

  constructor() {
    this.xlsxFilePath = path.join(__dirname, '../../data/nemu-base-de-dados.xlsx');
  }

  public async processJourneys(): Promise<JourneysResponse> {
    try {
      const rawEvents = parseXlsx(this.xlsxFilePath);

      const groupedEvents = groupBySession(rawEvents);

      const journeys: Journey[] = [];

      for (const [sessionId, events] of groupedEvents.entries()) {
        const sortedEvents = sortByDate(events);
        const cleanedEvents = removeMiddleDuplicates(sortedEvents);
        
        const journey = this.buildJourney(sessionId, cleanedEvents);
        journeys.push(journey);
      }

      journeys.sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );

      const totalTouchpoints = journeys.reduce(
        (sum, journey) => sum + journey.totalTouchpoints,
        0
      );

      return {
        success: true,
        data: journeys,
        metadata: {
          totalJourneys: journeys.length,
          totalTouchpoints,
          processedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Journey processing failed: ${error.message}`);
      }
      throw new Error('Journey processing failed: Unknown error');
    }
  }

  private buildJourney(sessionId: string, events: RawEvent[]): Journey {
    const touchpoints: Touchpoint[] = events.map(event => ({
      channel: event.utm_source,
      timestamp: event.createdAt,
    }));

    const startTime = events[0].createdAt;
    const endTime = events.at(-1)!.createdAt;
    const duration = new Date(endTime).getTime() - new Date(startTime).getTime();

    const userId = `user_${sessionId}`;

    return {
      sessionId,
      userId,
      touchpoints,
      startTime,
      endTime,
      duration,
      totalTouchpoints: touchpoints.length,
    };
  }
}
