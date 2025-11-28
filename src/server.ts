import express, { Application } from 'express';
import cors from 'cors';
import journeysRoutes from './routes/journeys.routes';
import { errorHandler } from './middlewares/errorHandler';

/**
 * Server configuration and initialization
 * Follows separation of concerns - configuration separate from business logic
 */
class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3001', 10);
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * Configure global middlewares
   */
  private setupMiddlewares(): void {
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    }));

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  /**
   * Configure application routes
   */
  private setupRoutes(): void {
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
      });
    });

    this.app.use('/api', journeysRoutes);
  }

  /**
   * Configure error handling middleware
   * Must be registered after routes
   */
  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  /**
   * Start the server
   */
  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
      console.log(`Health check available at http://localhost:${this.port}/health`);
      console.log(`Journeys endpoint available at http://localhost:${this.port}/api/journeys`);
    });
  }
}

const server = new Server();
server.start();

export default server;
