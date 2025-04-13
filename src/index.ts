/**
 * Logging levels in order of priority
 */
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

/**
 * Transport interface for logger output
 */
export interface Transport {
  /**
   * Write a log message to this transport
   */
  write(entry: LogEntry): void
}

/**
 * Log entry with all metadata
 */
export interface LogEntry {
  /** Timestamp when the log was created */
  timestamp: Date
  /** Log level */
  level: LogLevel
  /** Category/namespace for the log */
  category?: string
  /** Log message */
  message: string
  /** Original message parts before joining */
  messageParts: any[]
}

/**
 * Logger configuration options
 */
export interface LoggerOptions {
  /** Minimum logging level (defaults to INFO) */
  minLevel?: LogLevel
  /** Show debug logs when true */
  verbose?: boolean
  /** Log format (text or json) */
  logFormat?: "text" | "json"
  /** Category prefix for log messages */
  category?: string
  /** File path to write logs to */
  logFile?: string
  /** Disable console output when true */
  quiet?: boolean
  /** Array of transport instances */
  transports?: Transport[]
}

/**
 * Basic logger implementation with pluggable transports
 */
export class Logger {
  private options: LoggerOptions
  private transports: Transport[]

  constructor(options: LoggerOptions = {}) {
    this.options = {
      minLevel: LogLevel.INFO,
      verbose: false,
      logFormat: "text",
      category: "",
      quiet: false,
      ...options,
    }

    this.transports = this.options.transports || []
  }

  /**
   * Add a transport to this logger
   */
  addTransport(transport: Transport): void {
    this.transports.push(transport)
  }

  /**
   * Factory method to create a Logger instance from CLI options
   */
  static create(options: {
    verbose?: boolean
    quiet?: boolean
    logtime?: boolean
    logformat?: "text" | "json"
    logfile?: string
    transports?: Transport[]
    minLevel?: LogLevel
    [key: string]: any
  }): Logger {
    return new Logger({
      verbose: options.verbose,
      quiet: options.quiet,
      logFormat: options.logformat as "text" | "json",
      logFile: options.logfile,
      transports: options.transports,
      minLevel: options.minLevel,
    })
  }

  /**
   * Creates a child logger with a prefixed category
   */
  child(category: string): Logger {
    const parentCategory = this.options.category || ""
    const childCategory = parentCategory
      ? `${parentCategory}/${category}`
      : category

    // Create a new logger with the same options but different category
    const childLogger = new Logger({
      ...this.options,
      category: childCategory,
      // Don't pass transports in the constructor since we'll share them directly
      transports: [],
    })

    // Always share the same transports with the parent directly
    childLogger.transports = this.transports

    return childLogger
  }

  /**
   * Logs a message at DEBUG level
   */
  debug(...args: any[]): void {
    this.log(LogLevel.DEBUG, ...args)
  }

  /**
   * Logs a message at INFO level
   */
  info(...args: any[]): void {
    this.log(LogLevel.INFO, ...args)
  }

  /**
   * Logs a message at WARN level
   */
  warn(...args: any[]): void {
    this.log(LogLevel.WARN, ...args)
  }

  /**
   * Logs a message at ERROR level
   */
  error(...args: any[]): void {
    this.log(LogLevel.ERROR, ...args)
  }

  /**
   * Internal method to output log messages
   */
  private log(level: LogLevel, ...args: any[]): void {
    // Skip logging if below minimum level
    if (this.shouldSkipLevel(level)) {
      return
    }

    // Skip if quiet mode is enabled and no transports are available
    if (this.options.quiet && this.transports.length === 0) {
      return
    }

    // Create the log entry
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      category: this.options.category,
      message: args
        .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
        .join(" "),
      messageParts: args,
    }

    // Send to all transports
    this.transports.forEach((transport) => {
      transport.write(entry)
    })
  }

  /**
   * Determines if a log level should be skipped based on minimum level
   */
  private shouldSkipLevel(level: LogLevel): boolean {
    // Calculate the effective minimum level based on both minLevel and verbose options
    let effectiveMinLevel = this.options.minLevel || LogLevel.INFO

    // If verbose is true and minLevel is not explicitly set to something higher than DEBUG,
    // use DEBUG as the minimum level
    if (
      this.options.verbose &&
      (!this.options.minLevel || this.options.minLevel === LogLevel.INFO)
    ) {
      effectiveMinLevel = LogLevel.DEBUG
    }

    const levels = [
      LogLevel.DEBUG,
      LogLevel.INFO,
      LogLevel.WARN,
      LogLevel.ERROR,
    ]
    const minLevelIndex = levels.indexOf(effectiveMinLevel)
    const currentLevelIndex = levels.indexOf(level)

    return currentLevelIndex < minLevelIndex
  }
}
