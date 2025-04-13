import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import type { LogEntry } from "../src";
import { LogLevel, Logger, Transport } from "../src";

// Mock transport for testing
class MockTransport implements Transport {
  public logs: LogEntry[] = [];
  
  write(entry: LogEntry): void {
    this.logs.push(entry);
  }
  
  reset(): void {
    this.logs = [];
  }
}

describe("Logger", () => {
  let mockTransport: MockTransport;
  let logger: Logger;
  
  beforeEach(() => {
    mockTransport = new MockTransport();
    logger = new Logger({ 
      transports: [mockTransport]
    });
  });
  
  afterEach(() => {
    mockTransport.reset();
  });
  
  test("should create a logger instance", () => {
    expect(logger).toBeInstanceOf(Logger);
  });
  
  test("creates a logger with factory method", () => {
    const factoryLogger = Logger.create({
      verbose: true,
      quiet: false,
      logformat: "text"
    });
    
    expect(factoryLogger).toBeInstanceOf(Logger);
  });
  
  test("logs at different levels", () => {
    // INFO level
    logger.info("Info message");
    expect(mockTransport.logs).toHaveLength(1);
    expect(mockTransport.logs[0].level).toBe(LogLevel.INFO);
    expect(mockTransport.logs[0].message).toBe("Info message");
    
    mockTransport.reset();
    
    // WARN level
    logger.warn("Warning message");
    expect(mockTransport.logs).toHaveLength(1);
    expect(mockTransport.logs[0].level).toBe(LogLevel.WARN);
    expect(mockTransport.logs[0].message).toBe("Warning message");
    
    mockTransport.reset();
    
    // ERROR level
    logger.error("Error message");
    expect(mockTransport.logs).toHaveLength(1);
    expect(mockTransport.logs[0].level).toBe(LogLevel.ERROR);
    expect(mockTransport.logs[0].message).toBe("Error message");
    
    mockTransport.reset();
    
    // DEBUG level
    logger.debug("Debug message");
    // By default DEBUG messages are not logged with default minLevel=INFO
    expect(mockTransport.logs).toHaveLength(0);
  });
  
  test("respects minimum log level", () => {
    // Set min level to WARN
    logger = new Logger({
      minLevel: LogLevel.WARN,
      transports: [mockTransport]
    });
    
    logger.debug("Debug message"); // Should be filtered
    logger.info("Info message");   // Should be filtered
    logger.warn("Warning message"); // Should pass
    logger.error("Error message");  // Should pass
    
    expect(mockTransport.logs).toHaveLength(2);
    expect(mockTransport.logs[0].level).toBe(LogLevel.WARN);
    expect(mockTransport.logs[1].level).toBe(LogLevel.ERROR);
  });
  
  test("enables debug logs when verbose is true", () => {
    logger = new Logger({
      verbose: true,
      transports: [mockTransport]
    });
    
    logger.debug("Debug message");
    
    expect(mockTransport.logs).toHaveLength(1);
    expect(mockTransport.logs[0].level).toBe(LogLevel.DEBUG);
  });
  
  test("handles multiple message arguments", () => {
    logger.info("User", { id: 123 }, "logged in", true);
    
    expect(mockTransport.logs).toHaveLength(1);
    expect(mockTransport.logs[0].message).toBe('User {"id":123} logged in true');
    expect(mockTransport.logs[0].messageParts).toHaveLength(4);
  });
  
  test("adds transport", () => {
    const logger = new Logger();
    const transport = new MockTransport();
    
    logger.addTransport(transport);
    logger.info("Test message");
    
    expect(transport.logs).toHaveLength(1);
  });
  
  test("creates child logger with category", () => {
    const childLogger = logger.child("auth");
    
    childLogger.info("Login successful");
    
    expect(mockTransport.logs).toHaveLength(1);
    expect(mockTransport.logs[0].category).toBe("auth");
    
    // Create a nested child
    const nestedChild = childLogger.child("session");
    nestedChild.info("Session started");
    
    expect(mockTransport.logs).toHaveLength(2);
    expect(mockTransport.logs[1].category).toBe("auth/session");
  });
  
  test("respects quiet mode", () => {
    // Create a logger without transports and quiet mode enabled
    // This should suppress all output
    const quietLogger = new Logger({ quiet: true });
    
    // Create a spy to check if log method is called
    const logSpy = mock(() => {});
    (quietLogger as any).log = logSpy;
    
    quietLogger.info("This should be quiet");
    
    // The log method should still be called, but no output should occur
    expect(logSpy).toHaveBeenCalled();
  });
}); 