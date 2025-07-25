/**
 * Developer tools and debugging utilities for EstateTracker
 */

import { env } from './env';

export interface DebugLog {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  data?: any;
  timestamp: Date;
  component?: string;
  userId?: string;
}

/**
 * Enhanced logging utility with filtering and formatting
 */
export class Logger {
  private static logs: DebugLog[] = [];
  private static readonly maxLogs = 1000;

  static debug(message: string, data?: any, component?: string): void {
    this.log('debug', message, data, component);
  }

  static info(message: string, data?: any, component?: string): void {
    this.log('info', message, data, component);
  }

  static warn(message: string, data?: any, component?: string): void {
    this.log('warn', message, data, component);
  }

  static error(message: string, data?: any, component?: string): void {
    this.log('error', message, data, component);
  }

  private static log(level: DebugLog['level'], message: string, data?: any, component?: string): void {
    const logEntry: DebugLog = {
      level,
      message,
      data,
      timestamp: new Date(),
      component,
    };

    // Add to internal log store
    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Console output with styling
    if (env.DEBUG_MODE) {
      const style = this.getConsoleStyle(level);
      const prefix = component ? `[${component}]` : '';
      
      console.log(
        `%c${level.toUpperCase()} ${prefix} ${message}`,
        style,
        data ? data : ''
      );
    }
  }

  private static getConsoleStyle(level: DebugLog['level']): string {
    const styles = {
      debug: 'color: #6B7280; font-weight: normal;',
      info: 'color: #3B82F6; font-weight: bold;',
      warn: 'color: #F59E0B; font-weight: bold;',
      error: 'color: #EF4444; font-weight: bold; background: #FEF2F2; padding: 2px 4px;'
    };
    return styles[level];
  }

  static getLogs(level?: DebugLog['level'], component?: string): DebugLog[] {
    return this.logs.filter(log => {
      return (!level || log.level === level) && (!component || log.component === component);
    });
  }

  static clearLogs(): void {
    this.logs = [];
  }

  static exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

/**
 * Performance profiler for component rendering and function execution
 */
export class Profiler {
  private static profiles: Map<string, number> = new Map();
  private static results: Map<string, number[]> = new Map();

  static start(name: string): void {
    this.profiles.set(name, performance.now());
  }

  static end(name: string): number {
    const startTime = this.profiles.get(name);
    if (!startTime) {
      Logger.warn(`Profiler: No start time found for "${name}"`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.profiles.delete(name);

    // Store result
    if (!this.results.has(name)) {
      this.results.set(name, []);
    }
    this.results.get(name)!.push(duration);

    Logger.debug(`Profiler: "${name}" took ${duration.toFixed(2)}ms`);
    return duration;
  }

  static getStats(name: string): { avg: number; min: number; max: number; count: number } | null {
    const durations = this.results.get(name);
    if (!durations || durations.length === 0) return null;

    return {
      avg: durations.reduce((a, b) => a + b, 0) / durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      count: durations.length
    };
  }

  static getAllStats(): Record<string, ReturnType<typeof Profiler.getStats>> {
    const stats: Record<string, ReturnType<typeof Profiler.getStats>> = {};
    for (const [name] of this.results) {
      stats[name] = this.getStats(name);
    }
    return stats;
  }

  static reset(): void {
    this.profiles.clear();
    this.results.clear();
  }
}

/**
 * Memory usage tracker
 */
export class MemoryTracker {
  static getUsage(): { used: number; total: number; percentage: number } | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize / (1024 * 1024), // MB
        total: memory.totalJSHeapSize / (1024 * 1024), // MB
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
      };
    }
    return null;
  }

  static monitor(intervalMs: number = 10000): () => void {
    const interval = setInterval(() => {
      const usage = this.getUsage();
      if (usage) {
        Logger.debug(`Memory Usage: ${usage.used.toFixed(1)}MB (${usage.percentage.toFixed(1)}%)`);
        
        // Warn if memory usage is high
        if (usage.percentage > 80) {
          Logger.warn('High memory usage detected', usage);
        }
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }
}

/**
 * Network request tracker
 */
export class NetworkTracker {
  private static requests: Map<string, {
    url: string;
    method: string;
    startTime: number;
    endTime?: number;
    status?: number;
    size?: number;
  }> = new Map();

  static trackRequest(id: string, url: string, method: string = 'GET'): void {
    this.requests.set(id, {
      url,
      method,
      startTime: performance.now()
    });
  }

  static trackResponse(id: string, status: number, size?: number): void {
    const request = this.requests.get(id);
    if (request) {
      request.endTime = performance.now();
      request.status = status;
      request.size = size;

      const duration = request.endTime - request.startTime;
      Logger.debug(`Network: ${request.method} ${request.url} - ${status} (${duration.toFixed(2)}ms)`);
    }
  }

  static getRequestStats(): {
    totalRequests: number;
    averageResponseTime: number;
    failedRequests: number;
    totalDataTransferred: number;
  } {
    const completed = Array.from(this.requests.values()).filter(r => r.endTime);
    
    const totalRequests = completed.length;
    const averageResponseTime = totalRequests > 0 
      ? completed.reduce((sum, r) => sum + (r.endTime! - r.startTime), 0) / totalRequests 
      : 0;
    const failedRequests = completed.filter(r => r.status && r.status >= 400).length;
    const totalDataTransferred = completed.reduce((sum, r) => sum + (r.size || 0), 0);

    return {
      totalRequests,
      averageResponseTime,
      failedRequests,
      totalDataTransferred
    };
  }
}

/**
 * Component render tracker
 */
export class RenderTracker {
  private static renders: Map<string, number> = new Map();

  static trackRender(componentName: string): void {
    const count = this.renders.get(componentName) || 0;
    this.renders.set(componentName, count + 1);
    
    if (env.DEBUG_MODE) {
      Logger.debug(`Render: ${componentName} (${count + 1} times)`);
    }
  }

  static getRenderCounts(): Record<string, number> {
    return Object.fromEntries(this.renders);
  }

  static reset(): void {
    this.renders.clear();
  }
}

/**
 * Error boundary integration for better error tracking
 */
export class ErrorTracker {
  private static errors: Array<{
    error: Error;
    componentStack?: string;
    timestamp: Date;
    userId?: string;
    userAgent: string;
    url: string;
  }> = [];

  static trackError(error: Error, componentStack?: string, userId?: string): void {
    const errorInfo = {
      error,
      componentStack,
      timestamp: new Date(),
      userId,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.errors.push(errorInfo);
    Logger.error('Error tracked', errorInfo);

    // In production, you might want to send this to an error reporting service
    if (env.ERROR_REPORTING && env.SENTRY_DSN) {
      // Integration with Sentry or similar service would go here
      console.log('Would send error to reporting service:', errorInfo);
    }
  }

  static getErrors(): typeof ErrorTracker.errors {
    return this.errors;
  }

  static clearErrors(): void {
    this.errors = [];
  }
}

/**
 * React DevTools-like component inspector
 */
export class ComponentInspector {
  static inspectComponent(element: HTMLElement): {
    tagName: string;
    className: string;
    id: string;
    attributes: Record<string, string>;
    computedStyles: Record<string, string>;
    dimensions: { width: number; height: number; top: number; left: number };
  } | null {
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    const computedStyles = window.getComputedStyle(element);
    
    // Get only relevant computed styles
    const relevantStyles = [
      'display', 'position', 'top', 'left', 'width', 'height',
      'margin', 'padding', 'border', 'background', 'color',
      'font-family', 'font-size', 'z-index'
    ];

    const styles: Record<string, string> = {};
    relevantStyles.forEach(prop => {
      styles[prop] = computedStyles.getPropertyValue(prop);
    });

    // Get all attributes
    const attributes: Record<string, string> = {};
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      attributes[attr.name] = attr.value;
    }

    return {
      tagName: element.tagName.toLowerCase(),
      className: element.className,
      id: element.id,
      attributes,
      computedStyles: styles,
      dimensions: {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left
      }
    };
  }

  static highlightElement(element: HTMLElement, duration: number = 2000): void {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: ${element.getBoundingClientRect().top}px;
      left: ${element.getBoundingClientRect().left}px;
      width: ${element.getBoundingClientRect().width}px;
      height: ${element.getBoundingClientRect().height}px;
      border: 2px solid #3B82F6;
      background: rgba(59, 130, 246, 0.1);
      pointer-events: none;
      z-index: 9999;
      transition: opacity 0.3s ease;
    `;

    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 300);
    }, duration);
  }
}

/**
 * Development utilities manager
 */
export class DevTools {
  private static memoryMonitor: (() => void) | null = null;

  static init(): void {
    if (!env.DEBUG_MODE) return;

    Logger.info('DevTools initialized');
    
    // Start memory monitoring
    this.memoryMonitor = MemoryTracker.monitor();

    // Add global devtools to window for browser console access
    (window as any).devTools = {
      logger: Logger,
      profiler: Profiler,
      memory: MemoryTracker,
      network: NetworkTracker,
      render: RenderTracker,
      error: ErrorTracker,
      inspector: ComponentInspector,
      
      // Convenience methods
      logs: () => Logger.getLogs(),
      stats: () => ({
        profiler: Profiler.getAllStats(),
        network: NetworkTracker.getRequestStats(),
        renders: RenderTracker.getRenderCounts(),
        memory: MemoryTracker.getUsage()
      }),
      
      clear: () => {
        Logger.clearLogs();
        Profiler.reset();
        RenderTracker.reset();
        ErrorTracker.clearErrors();
      }
    };

    console.log('%cEstateTracker DevTools Ready!', 'color: #10B981; font-weight: bold; font-size: 14px;');
    console.log('Access tools via: window.devTools');
  }

  static cleanup(): void {
    if (this.memoryMonitor) {
      this.memoryMonitor();
      this.memoryMonitor = null;
    }

    delete (window as any).devTools;
  }
}

// Export default tools collection
export default {
  Logger,
  Profiler,
  MemoryTracker,
  NetworkTracker,
  RenderTracker,
  ErrorTracker,
  ComponentInspector,
  DevTools
};
