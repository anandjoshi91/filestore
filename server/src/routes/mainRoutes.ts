import { Application } from 'express';
import { RouteHandler } from './routeHandler';

export class MainRoutes {
  private rh = new RouteHandler();
  private static BASE_URL = '/api';

  public route(app: Application) {
    // Health Check
    app.get(MainRoutes.BASE_URL + '/health', (req, res) =>
      res.status(200).json({ result: 'OK' })
    );

    // Upload a file
    app.post(MainRoutes.BASE_URL + '/files', this.rh.handleFileUpload);

    // Return meta data for all files
    app.get(MainRoutes.BASE_URL + '/files', this.rh.getAllFiles);

    // Download a given file
    app.get(MainRoutes.BASE_URL + '/files/:id', this.rh.getFileById);

    // Delete a given file
    app.delete(MainRoutes.BASE_URL + '/files/:id', this.rh.deleteFileById);
  }
}
