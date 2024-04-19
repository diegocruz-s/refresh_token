import express, { Express } from 'express';
import { router as userRoutes } from './routes/userRoutes';

class AppController {
  app: Express;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  };

  routes () {
    this.app.use('/users', userRoutes);
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
