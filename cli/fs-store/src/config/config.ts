import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  fileServerHost: process.env.FS_HOST || 'http://localhost:3000',
};
