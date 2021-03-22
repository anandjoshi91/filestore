import multer from 'multer';
import sha1 from 'sha1';
import { Request, Response, NextFunction } from 'express';
import { fileFilter } from '../utilities/common';
import { DataBase } from './database';
import { config } from '../config/config';

export class FileUploader {
  private static multerUploader = multer({
    dest: `${config.upload.path}/`,
    storage: multer.diskStorage({
      filename: function (req, file, cb) {
        cb(null, sha1(file.originalname));
      },
      destination: function (req, file, cb) {
        cb(null, `./${config.upload.path}`);
      },
    }),
    fileFilter: fileFilter,
  }); // multer configuration

  private static upload = FileUploader.multerUploader.single('file'); // param name in upload request

  public static uploadSingleFile(req: Request, res: Response) {
    FileUploader.upload(req, res, async function (err: any) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Everything went fine. Save the file
      try {
        const data = await DataBase.saveFileMetaData(req.file);
        return res.status(201).json({ result: data });
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    });
  }
}
