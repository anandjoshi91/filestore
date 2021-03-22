import app from './config/app';
import logger from './utilities/logger';

const PORT = 3000;
app.listen(PORT, () => {
  logger.info(`Express server listening on port ${PORT}`);
});
