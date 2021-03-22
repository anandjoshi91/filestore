import winston, { format } from 'winston';

const createLogger = (level = 'info') => {
  const formats = [
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
    format.colorize(),
  ];

  return winston.createLogger({
    level,
    transports: [
      new winston.transports.Console({
        format: format.combine(...formats),
      }),
    ],
  });
};

export default createLogger();
