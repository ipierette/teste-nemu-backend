import * as XLSX from 'xlsx';
import { RawEvent, RawEventSchema } from '../types/RawEvent';
import { z } from 'zod';

/**
 * Parses an XLSX file and returns validated raw events
 * 
 * @param filePath - Absolute path to the XLSX file
 * @returns Array of validated RawEvent objects
 * @throws Error if file cannot be read or data is invalid
 */
export function parseXlsx(filePath: string): RawEvent[] {
  try {
    const workbook = XLSX.readFile(filePath);
    
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new Error('XLSX file contains no sheets');
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    if (!Array.isArray(rawData) || rawData.length === 0) {
      throw new Error('XLSX file contains no data');
    }

    const validatedEvents = rawData.map((row, index) => {
      try {
        return RawEventSchema.parse(row);
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(
            `Invalid data at row ${index + 2}: ${error.errors.map(e => e.message).join(', ')}`
          );
        }
        throw error;
      }
    });

    return validatedEvents;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse XLSX file: ${error.message}`);
    }
    throw new Error('Failed to parse XLSX file: Unknown error');
  }
}
