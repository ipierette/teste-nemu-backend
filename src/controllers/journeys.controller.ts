import { Request, Response, NextFunction } from 'express';
import { JourneysService } from '../services/journeys.service';

/**
 * Controller for journey-related endpoints
 * Follows Controller pattern - handles HTTP requests/responses
 */
export class JourneysController {
  private journeysService: JourneysService;

  constructor() {
    this.journeysService = new JourneysService();
  }

  /**
   * GET /journeys
   * Returns all processed journeys with metadata
   * 
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function for error handling
   */
  public getJourneys = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.journeysService.processJourneys();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
