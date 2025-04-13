import { LogLevel, Logger } from './src';
import { ConsoleTransport } from './src/transports/console';

// Create a logger with console transport (no timestamps)
const logger = new Logger({
  minLevel: LogLevel.DEBUG,
  transports: [new ConsoleTransport()]
});

// Create a logger with timestamps
const timestampLogger = new Logger({
  transports: [new ConsoleTransport({ showTimestamps: true })]
});

// Create loggers with categories
const authLogger = logger.child('auth');
const dbLogger = logger.child('database');

// Create nested child loggers
const userAuthLogger = authLogger.child('user');
const adminAuthLogger = authLogger.child('admin');

// Demo different log levels and options
logger.debug('Debug message - gray color');
logger.info('Info message - white color');
logger.warn('Warning message - yellow color');
logger.error('Error message - red color');
timestampLogger.info('Message with timestamp');
authLogger.info('Message from auth category');
dbLogger.error('Database connection failed');
userAuthLogger.info('User authentication successful');
adminAuthLogger.warn('Admin failed login attempt'); 