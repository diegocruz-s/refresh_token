import 'dotenv/config';
import express, { Express } from 'express';
import { router as userRoutes } from './routes/userRoutes';
import { router as authRoutes } from './routes/authRoutes';

class AppController {
  app: Express;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  };

  routes () {
    this.app.use('/users', userRoutes);
    this.app.use('/auth', authRoutes);
  };

  cors () {   
    // Implement CORS
  };

  middlewares () {
    this.app.use(express.json());
  };

  listen (port: Number) {
    this.app.listen(port, () => {
      console.log(`Server running on PORT: ${port}`);
    });
  };
};

const appController = new AppController();

export {
  appController
};
