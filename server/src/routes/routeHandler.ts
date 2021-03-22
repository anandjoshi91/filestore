import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import { DataBase } from '../services/database';
import { FileUploader } from '../services/fileUploader';
import logger from '../utilities/logger';

export class RouteHandler {
  async deleteFileById(req: Request, res: Response, next: NextFunction) {
    try {
      const fileName = await DataBase.deleteFileById(parseInt(req.params.id));
      return res
        .status(200)
        .json({ result: `File ${fileName} deleted successfully` });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
  async getFileById(req: Request, res: Response, next: NextFunction) {
    try {
      const file = await DataBase.getFileById(parseInt(req.params.id));

      if (!file || _.isEmpty(file)) {
        return res.status(404).json({ result: 'File not found' });
      }

      res.setHeader('Content-Type', _.get(file, 'type'));
      fs.createReadStream(path.join(_.get(file, 'path'))).pipe(res);
    } catch (err) {
      return res.status(400).json({ error: 'Bad request id' });
    }
  }
  public async getAllFiles(req: Request, res: Response, next: NextFunction) {
    const files = await DataBase.getAllFiles();
    return res.status(200).json({ result: files });
  }
  public handleFileUpload(req: Request, res: Response, next: NextFunction) {
    return FileUploader.uploadSingleFile(req, res);
  }
}
