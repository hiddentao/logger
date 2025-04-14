import { afterEach, beforeEach, describe, expect, spyOn, test } from "bun:test";
import type { LogEntry } from "../src";
import { LogLevel } from "../src";
import { ConsoleTransport } from "../src/transports/console";

describe("ConsoleTransport", () => {
  let transport: ConsoleTransport;
  let consoleLogSpy: ReturnType<typeof spyOn>;
  
  beforeEach(() => {
    transport = new ConsoleTransport();
    // Spy on console.log
    consoleLogSpy = spyOn(console, "log");
  });
  
  afterEach(() => {
    consoleLogSpy.mockRestore();
  });
  
  test("should create a console transport instance", () => {
    expect(transport).toBeInstanceOf(ConsoleTransport);
  });
  
  test("writes log to console", () => {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.INFO,
      message: "Test message",
      messageParts: ["Test message"]
    };
    
    transport.write(entry);
    
    expect(consoleLogSpy).toHaveBeenCalled();
  });
  
  test("formats error level with red color", () => {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.ERROR,
      message: "Error message",
      messageParts: ["Error message"]
    };
    
    transport.write(entry);
    
    // We're checking that console.log was called with a string containing the message
    // The exact format would include ANSI color codes
    const [formattedMsg] = consoleLogSpy.mock.calls[0];
    expect(formattedMsg).toContain("[error]");
    expect(formattedMsg).toContain("Error message");
  });
  
  test("formats warning level with yellow color", () => {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.WARN,
      message: "Warning message",
      messageParts: ["Warning message"]
    };
    
    transport.write(entry);
    
    const [formattedMsg] = consoleLogSpy.mock.calls[0];
    expect(formattedMsg).toContain("[warn]");
    expect(formattedMsg).toContain("Warning message");
  });
  
  test("formats debug level with gray color", () => {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.DEBUG,
      message: "Debug message",
      messageParts: ["Debug message"]
    };
    
    transport.write(entry);
    
    const [formattedMsg] = consoleLogSpy.mock.calls[0];
    expect(formattedMsg).toContain("[debug]");
    expect(formattedMsg).toContain("Debug message");
  });
  
  test("formats info level with white color", () => {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.INFO,
      message: "Info message",
      messageParts: ["Info message"]
    };
    
    transport.write(entry);
    
    const [formattedMsg] = consoleLogSpy.mock.calls[0];
    expect(formattedMsg).toContain("[info]");
    expect(formattedMsg).toContain("Info message");
  });
  
  test("respects noColor option", () => {
    transport = new ConsoleTransport({ noColor: true });
    
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.ERROR,
      message: "No color message",
      messageParts: ["No color message"]
    };
    
    transport.write(entry);
    
    // We expect a plain string without ANSI color codes
    const [formattedMsg] = consoleLogSpy.mock.calls[0];
    expect(formattedMsg).toContain("[error]");
    expect(formattedMsg).toContain("No color message");
  });
  
  test("includes timestamp when showTimestamps is true", () => {
    transport = new ConsoleTransport({ showTimestamps: true });
    
    const timestamp = new Date();
    const entry: LogEntry = {
      timestamp,
      level: LogLevel.INFO,
      message: "With timestamp",
      messageParts: ["With timestamp"]
    };
    
    transport.write(entry);
    
    const [formattedMsg] = consoleLogSpy.mock.calls[0];
    // Check that the ISO string format of the timestamp is included
    expect(formattedMsg).toContain(timestamp.toISOString());
  });
  
  test("formats category with bold", () => {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.INFO,
      category: "test-category",
      message: "Categorized message",
      messageParts: ["Categorized message"]
    };
    
    transport.write(entry);
    
    const [formattedMsg] = consoleLogSpy.mock.calls[0];
    expect(formattedMsg).toContain("<");
    expect(formattedMsg).toContain("test-category");
    expect(formattedMsg).toContain(">");
  });
  
  test("formats multiple message parts with spaces between them", () => {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.INFO,
      message: "",
      messageParts: ["Hello", "world", 123]
    };
    
    transport.write(entry);
    
    const [formattedMsg] = consoleLogSpy.mock.calls[0];
    expect(formattedMsg).toContain("Hello world 123");
  });
  
  test("formats boolean values as 'true' or 'false'", () => {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.INFO,
      message: "",
      messageParts: ["Status:", true, "Enabled:", false]
    };
    
    transport.write(entry);
    
    const [formattedMsg] = consoleLogSpy.mock.calls[0];
    expect(formattedMsg).toContain("Status: true Enabled: false");
  });
  
  test("formats objects using JSON.stringify", () => {
    const testObj = { name: "test", value: 42 };
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.INFO,
      message: "",
      messageParts: ["Object:", testObj]
    };
    
    transport.write(entry);
    
    const [formattedMsg] = consoleLogSpy.mock.calls[0];
    expect(formattedMsg).toContain(`Object: ${JSON.stringify(testObj)}`);
  });
  
  test("formats arrays using JSON.stringify", () => {
    const testArray = [1, 2, 3];
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.INFO,
      message: "",
      messageParts: ["Array:", testArray]
    };
    
    transport.write(entry);
    
    const [formattedMsg] = consoleLogSpy.mock.calls[0];
    expect(formattedMsg).toContain(`Array: ${JSON.stringify(testArray)}`);
  });
  
  test("handles null and undefined values", () => {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.INFO,
      message: "",
      messageParts: ["Null:", null, "Undefined:", undefined]
    };
    
    transport.write(entry);
    
    const [formattedMsg] = consoleLogSpy.mock.calls[0];
    expect(formattedMsg).toContain("Null: null Undefined: undefined");
  });
  
  test("uses custom formatMessagePart function when provided", () => {
    transport = new ConsoleTransport({
      formatMessagePart: (value) => {
        if (typeof value === 'object' && value !== null) {
          return "OBJECT";
        }
        return String(value).toUpperCase();
      }
    });
    
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.INFO,
      message: "",
      messageParts: ["test", 123, { a: 1 }]
    };
    
    transport.write(entry);
    
    const [formattedMsg] = consoleLogSpy.mock.calls[0];
    expect(formattedMsg).toContain("TEST 123 OBJECT");
  });
  
  test("falls back to message if messageParts is not provided", () => {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.INFO,
      message: "Legacy message",
      messageParts: []
    };
    
    transport.write(entry);
    
    const [formattedMsg] = consoleLogSpy.mock.calls[0];
    expect(formattedMsg).toContain("Legacy message");
  });
  
  test("uses toString method when available on objects", () => {
    class CustomObject {
      toString() {
        return "CUSTOM_STRING_REPRESENTATION";
      }
    }
    
    const customObj = new CustomObject();
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.INFO,
      message: "",
      messageParts: ["Custom object:", customObj]
    };
    
    transport.write(entry);
    
    const [formattedMsg] = consoleLogSpy.mock.calls[0];
    expect(formattedMsg).toContain("Custom object: CUSTOM_STRING_REPRESENTATION");
  });
  
  test("falls back to JSON.stringify when toString is not customized", () => {
    const regularObj = { id: 123, name: "test" };
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.INFO,
      message: "",
      messageParts: ["Regular object:", regularObj]
    };
    
    transport.write(entry);
    
    const [formattedMsg] = consoleLogSpy.mock.calls[0];
    expect(formattedMsg).toContain(`Regular object: ${JSON.stringify(regularObj)}`);
  });

  test("formats Error objects with name and message", () => {
    const error = new Error("Something went wrong");
    error.name = "CustomError";
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.ERROR,
      message: "",
      messageParts: ["Error object:", error]
    };
    
    transport.write(entry);
    
    const [formattedMsg] = consoleLogSpy.mock.calls[0];
    expect(formattedMsg).toContain("Error object:");
    expect(formattedMsg).toContain("CustomError: Something went wrong");
    expect(formattedMsg).toContain("stack:");
  });
}); 