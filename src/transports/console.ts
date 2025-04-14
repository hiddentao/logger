import pc from "picocolors"
import { LogEntry, LogLevel, Transport } from "../"

export interface ConsoleTransportOptions {
  /** Whether to show timestamps */
  showTimestamps?: boolean
  /** Whether to disable colors */
  noColor?: boolean
  /** Custom formatter for message parts */
  formatMessagePart?: (value: any) => string
}

/**
 * Console transport for outputting logs to the terminal
 * with color formatting.
 */
export class ConsoleTransport implements Transport {
  private options: ConsoleTransportOptions

  constructor(options: ConsoleTransportOptions = {}) {
    this.options = {
      showTimestamps: false,
      noColor: false,
      formatMessagePart: undefined,
      ...options,
    }
  }

  /**
   * Write a log entry to the console
   */
  write(entry: LogEntry): void {
    // Format the log entry based on the level
    const formattedLog = this.formatLogEntry(entry)
    console.log(formattedLog)
  }

  /**
   * Format a log entry with colors
   */
  private formatLogEntry(entry: LogEntry): string {
    // Choose color based on level
    const levelColor = this.getLevelColor(entry.level)

    // Format timestamp if enabled
    const timestamp = this.options.showTimestamps
      ? entry.timestamp.toISOString() + " "
      : ""

    // Format level
    const levelStr = `[${entry.level.toLowerCase()}]`

    // Format category if present - make it bold
    const category = entry.category
      ? `<${this.options.noColor ? entry.category : pc.bold(entry.category)}> `
      : ""

    // Format message parts - fall back to message if messageParts is empty
    let messageParts = entry.messageParts || [];
    if (messageParts.length === 0 && entry.message) {
      messageParts = [entry.message];
    }
    const formattedMessage = this.formatMessageParts(messageParts)

    // Combine all parts
    const fullMessage = `${timestamp}${levelStr} ${category}${formattedMessage}`

    // Apply color to the entire log line based on severity
    return this.colorize(levelColor, fullMessage)
  }

  /**
   * Format message parts according to their types
   */
  private formatMessageParts(messageParts: any[]): string {
    if (!messageParts || messageParts.length === 0) {
      return ""
    }

    return messageParts
      .map((part) => {
        // Use custom formatter if provided
        if (this.options.formatMessagePart) {
          return this.options.formatMessagePart(part)
        }

        // Default formatting
        if (part === null) {
          return "null"
        }
        
        if (part === undefined) {
          return "undefined"
        }
        
        if (typeof part === "boolean") {
          return part ? "true" : "false"
        }
        
        if (typeof part === "string" || typeof part === "number") {
          return String(part)
        }
        
        if (typeof part === "object") {
          // Always use JSON.stringify for arrays
          if (Array.isArray(part)) {
            return JSON.stringify(part)
          }
          
          // Special handling for Error objects - include stack trace
          if (part instanceof Error) {
            return `${part.toString()}${part.stack ? `\nstack: ${part.stack}` : ''}`
          }
          
          // Check if object has a non-default toString method
          if (part.toString && part.toString !== Object.prototype.toString) {
            return part.toString()
          }
          return JSON.stringify(part)
        }
        
        return String(part)
      })
      .join(" ")
  }

  /**
   * Apply color function if colors are enabled
   */
  private colorize(colorFn: (text: string) => string, text: string): string {
    return this.options.noColor ? text : colorFn(text)
  }

  /**
   * Get the color function for a log level
   */
  private getLevelColor(level: LogLevel): (text: string) => string {
    switch (level) {
      case LogLevel.ERROR:
        return pc.red
      case LogLevel.WARN:
        return pc.yellow
      case LogLevel.DEBUG:
        return pc.gray
      case LogLevel.INFO:
      default:
        return pc.white
    }
  }
}
