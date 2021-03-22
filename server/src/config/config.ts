import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  upload: {
    path: 'uploads',
  },

  db: {
    name: process.env.DB_NAME || 'fileMetaData.json',
    collection: process.env.COLLECTION_NAME || 'files',
  },
};
