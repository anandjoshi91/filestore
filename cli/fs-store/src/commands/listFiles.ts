import { LOG } from '../config/logger';
import { FileServerService } from '../services/fileServer';
import { Command } from './command';

export class ListFiles implements Command {
  execute() {
    LOG.info(`Listing files...`);
    FileServerService.listFiles();
  }
}
