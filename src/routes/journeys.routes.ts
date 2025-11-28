import { Router } from 'express';
import { JourneysController } from '../controllers/journeys.controller';

/**
 * Journeys routes configuration
 * Defines all journey-related endpoints
 */
const router = Router();
const journeysController = new JourneysController();

/**
 * GET /journeys
 * Returns all processed user journeys
 */
router.get('/journeys', journeysController.getJourneys);

export default router;
