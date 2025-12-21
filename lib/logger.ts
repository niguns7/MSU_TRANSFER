import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'development' && !process.env.NEXT_RUNTIME
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'SYS:standard',
          },
        }
      : undefined,
});

export default logger;

export function generateTraceId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}