# @hiddentao/logger

A lightweight, flexible, and powerful logging library for JavaScript/TypeScript applications.

## Features

- **Simple API** - straightforward methods for different log levels (debug, info, warn, error)
- **Customizable transports** - easily route logs to different destinations (console, file, etc.)
- **Hierarchical logging** - create child loggers with categories for better organization
- **Colorized output** - easily distinguish between different log levels with color-coded console output
- **TypeScript support** - fully typed API with generated type definitions
- **Minimal dependencies** - lightweight with only essential dependencies
- **Configurable log levels** - control verbosity with minimum log level filtering

## Installation

```bash
# Using npm
npm install @hiddentao/logger

# Using yarn
yarn add @hiddentao/logger

# Using bun
bun add @hiddentao/logger
```

## Usage

### Basic usage

```typescript
import { Logger } from '@hiddentao/logger';
import { ConsoleTransport } from '@hiddentao/logger/transports/console';

// Create a logger with console transport
const logger = new Logger();
logger.addTransport(new ConsoleTransport({ showTimestamps: true }));

// Log at different levels
logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

### Controlling log levels

```typescript
import { Logger, LogLevel } from '@hiddentao/logger';
import { ConsoleTransport } from '@hiddentao/logger/transports/console';

// Create a logger that only shows warnings and errors
const logger = new Logger({ 
  minLevel: LogLevel.WARN,
  transports: [new ConsoleTransport()]
});

logger.debug('This will not be shown');
logger.info('This will not be shown either');
logger.warn('This warning will be displayed');
logger.error('This error will be displayed');
```

### Using categories

```typescript
import { Logger } from '@hiddentao/logger';
import { ConsoleTransport } from '@hiddentao/logger/transports/console';

// Create a base logger
const logger = new Logger({
  transports: [new ConsoleTransport()]
});

// Create child loggers with categories
const authLogger = logger.child('auth');
const apiLogger = logger.child('api');

// Logs will be prefixed with their categories
authLogger.info('User logged in'); // [info] <auth> User logged in
apiLogger.error('API request failed'); // [error] <api> API request failed

// Nested categories
const userApiLogger = apiLogger.child('users');
userApiLogger.info('User created'); // [info] <api/users> User created
```

### Handling objects and multiple arguments

```typescript
import { Logger } from '@hiddentao/logger';
import { ConsoleTransport } from '@hiddentao/logger/transports/console';

const logger = new Logger({
  transports: [new ConsoleTransport()]
});

// Log objects
logger.info({ user: 'john', id: 123 });

// Mix strings and objects
logger.info('User', { id: 123 }, 'logged in successfully');
```

## Developer Guide

### Setup

```bash
# Clone the repository
git clone https://github.com/hiddentao/logger.git
cd logger

# Install dependencies
bun install

# Run tests
bun test

# Build the package
bun run build
```

### Running Tests

```bash
# Run tests once
bun test

# Run tests in watch mode
bun test --watch
```

## License

Copyright (c) 2025 [Ramesh Nair](https://github.com/hiddentao)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
