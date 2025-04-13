import pc from "picocolors"
import { LogEntry, LogLevel, Transport } from "../"

export interface ConsoleTransportOptions {
  /** Whether to show timestamps */
  showTimestamps?: boolean
  /** Whether to disable colors */
  noColor?: boolean
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

    // Combine all parts
    const fullMessage = `${timestamp}${levelStr} ${category}${entry.message}`

    // Apply color to the entire log line based on severity
    return this.colorize(levelColor, fullMessage)
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
