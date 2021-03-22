import { LOG } from '../config/logger';
import { FileServerService } from '../services/fileServer';
import { Command } from './command';

export class UploadFile implements Command {
  execute(filePath?: string): void {
    LOG.info(`Uploading file - ${filePath}`);
    if (filePath) {
      FileServerService.uploadFile(filePath);
    }
  }
}
