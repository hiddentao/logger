import { LogLevel, Logger } from '../src';
import { ConsoleTransport } from '../src/transports/console';

// Create a logger with console transport
const logger = new Logger({
  minLevel: LogLevel.DEBUG, // Show all logs
  transports: [
    new ConsoleTransport({ 
      showTimestamps: true,
      noColor: false 
    })
  ]
});

// Log at different levels
logger.debug('This is a debug message');
logger.info('This is an info message');
logger.warn('This is a warning message');
logger.error('This is an error message');

// Create a child logger with a category
const userLogger = logger.child('user');
userLogger.info('User logged in', { userId: 123, username: 'john_doe' });

// Create a nested child logger
const userAuthLogger = userLogger.child('auth');
userAuthLogger.warn('Failed login attempt', { userId: 456, reason: 'Invalid password' });

// Demonstrate multiple arguments
logger.info('Server started on port', 3000, 'with configuration', { env: 'development' }); 