import Loki from 'lokijs';
import * as del from 'del';
import _ from 'lodash';
import { config } from '../config/config';
import logger from '../utilities/logger';

const db = new Loki(`${config.upload.path}/${config.db.name}`, {
  persistenceMethod: 'fs',
});

export class DataBase {
  private static loadCollection(
    colName: string,
    db: Loki
  ): Promise<Loki.Collection<any>> {
    return new Promise((resolve) => {
      db.loadDatabase({}, () => {
        const _collection =
          db.getCollection(colName) || db.addCollection(colName);
        resolve(_collection);
      });
    });
  }

  private static processFileResponse(file: any) {
    if (!file) {
      return;
    }

    return {
      id: file.$loki,
      name: file.originalname,
      type: file.mimetype,
      size: `${Math.round((file.size / 1024) * 100) / 100} KB`,
      path: file.path,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  }

  public static async saveFileMetaData(file: Express.Multer.File) {
    const col = await DataBase.loadCollection(config.db.collection, db);
    const foundFile = col.find({ filename: _.get(file, 'filename') });
    let data;

    if (!_.isEmpty(foundFile)) {
      data = foundFile[0];
      col.update({ ...data, updatedAt: new Date() });
    } else {
      data = col.insert({ ...file, createdAt: new Date() });
    }

    db.saveDatabase();
    return {
      id: data.$loki,
      fileName: data.filename,
      originalName: data.originalname,
    };
  }

  public static async getAllFiles() {
    const col = await DataBase.loadCollection(config.db.collection, db);
    return _.map(col.data, (file) => {
      return this.processFileResponse(file);
    });
  }

  public static async getFileById(id: number) {
    const col = await DataBase.loadCollection(config.db.collection, db);
    const file = col.get(id);
    return this.processFileResponse(file);
  }

  static async deleteFileById(id: number) {
    const col = await DataBase.loadCollection(config.db.collection, db);
    const file = col.get(id);

    if (file == null) {
      throw new Error('Invalid request id');
    }

    col.remove(file);
    db.saveDatabase();
    del.sync(file.path);
    return file.originalname;
  }
}
