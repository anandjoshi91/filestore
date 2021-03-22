import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import swaggerUi  from 'swagger-ui-express';
import { MainRoutes } from '../routes/mainRoutes';
import httpLogger from '../utilities/httpLogger';

const swaggerDoc = require('./../../swagger.json');

class App {
  public app: express.Application;
  private mainRoutes: MainRoutes = new MainRoutes();

  constructor() {
    this.app = express();
    this.configure();
  }

  private configure(): void {
    // support application/json type post data
    this.app.use(bodyParser.json());

    // support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.json({ limit: '20mb' }));
    this.app.use(cors());
    this.app.use(httpLogger);
    this.mainRoutes.route(this.app);
    this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
  }
}

export default new App().app;
