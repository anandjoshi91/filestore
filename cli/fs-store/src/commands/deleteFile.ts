import { LOG } from '../config/logger';
import { FileServerService } from '../services/fileServer';
import { Command } from './command';

export class DeleteFile implements Command {
  execute(id?: string): void {
    LOG.info(`Deleting file with id - ${id}`);
    if (id) {
      FileServerService.deleteFile(id);
    }
  }
}
