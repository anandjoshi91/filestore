import { RestClient } from './restClient';
import { printTable } from 'console-table-printer';
import _ from 'lodash';
import { config } from '../config/config';
import { LOG } from '../config/logger';

export class FileServerService {
  private static restClient = new RestClient(config.fileServerHost);

  static setHost(host: string) {
    this.restClient.setHost(host);
  }

  static getHost() {
    return this.restClient.getHost();
  }

  static async listFiles() {
    try {
      const response = await this.restClient.getFilesOnServer();
      const filesInfo = _.map(response['result'], (file) => {
        return {
          id: file.id,
          file: file.name,
          size: file.size,
          created: file.createdAt,
          updated: file.updatedAt,
        };
      });
      printTable(filesInfo);
    } catch (err) {
      LOG.error(`Server error - ${err.message}`);
    }
  }

  static async uploadFile(filePath: string) {
    try {
      const response = await this.restClient.uploadFileOnServer(filePath);
      if (response['error']) {
        throw new Error(response['error']);
      }
      LOG.info(
        `File ${response['result'].originalName} uploaded successful. File id = ${response['result'].id}`
      );
    } catch (err) {
      LOG.error(`Server error - ${err.message}`);
    }
  }

  static async deleteFile(id: string) {
    try {
      const response = await this.restClient.deleteFileOnServer(id);
      if (response['error']) {
        throw new Error(response['error']);
      }

      LOG.info(response['result']);
    } catch (err) {
      LOG.error(`Server error - ${err.message}`);
    }
  }
}
