/**
 * GitSpace 3D — In-Memory LRU Cache with TTL Expiration
 * Developed by Kore (Backend Developer)
 * 
 * Provides O(1) read/write operations using JavaScript Map key ordering,
 * automatic time-to-live eviction, and max capacity constraints.
 */

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  addedAt: number;
}

export interface CacheStats {
  size: number;
  maxCapacity: number;
  hits: number;
  misses: number;
  evictions: number;
  defaultTtlMs: number;
}

export class LRUCache<T> {
  private map: Map<string, CacheEntry<T>>;
  private maxCapacity: number;
  private defaultTtlMs: number;
  private hits: number = 0;
  private misses: number = 0;
  private evictions: number = 0;

  /**
   * @param maxCapacity Maximum items before oldest entries are evicted (default 100)
   * @param defaultTtlMs Default time to live in milliseconds (default 15 minutes = 900,000ms)
   */
  constructor(maxCapacity: number = 100, defaultTtlMs: number = 15 * 60 * 1000) {
    this.map = new Map();
    this.maxCapacity = Math.max(1, maxCapacity);
    this.defaultTtlMs = defaultTtlMs;
  }

  /**
   * Retrieve an item from the cache.
   * If expired, removes the item and returns undefined.
   * If found and valid, refreshes LRU position and returns the value.
   */
  get(key: string): T | undefined {
    const entry = this.map.get(key);

    if (!entry) {
      this.misses++;
      return undefined;
    }

    const now = Date.now();
    if (now > entry.expiresAt) {
      // Expired entry
      this.map.delete(key);
      this.misses++;
      return undefined;
    }

    // Refresh LRU position by re-inserting
    this.map.delete(key);
    this.map.set(key, entry);
    this.hits++;
    return entry.value;
  }

  /**
   * Store an item in the cache with optional custom TTL.
   */
  set(key: string, value: T, ttlMs?: number): void {
    const ttl = ttlMs !== undefined ? ttlMs : this.defaultTtlMs;
    const now = Date.now();
    const expiresAt = now + ttl;

    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.maxCapacity) {
      // Evict oldest (first key in map iteration)
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
        this.evictions++;
      }
    }

    this.map.set(key, {
      value,
      expiresAt,
      addedAt: now,
    });
  }

  /**
   * Check if an unexpired key exists without updating LRU order.
   */
  has(key: string): boolean {
    const entry = this.map.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Remove a specific key.
   */
  delete(key: string): boolean {
    return this.map.delete(key);
  }

  /**
   * Clear all entries and reset counters.
   */
  clear(): void {
    this.map.clear();
  }

  /**
   * Current number of entries.
   */
  size(): number {
    this.purgeExpired();
    return this.map.size;
  }

  /**
   * Clean up all expired entries.
   */
  purgeExpired(): number {
    const now = Date.now();
    let purged = 0;
    for (const [key, entry] of this.map.entries()) {
      if (now > entry.expiresAt) {
        this.map.delete(key);
        purged++;
      }
    }
    return purged;
  }

  /**
   * Inspect cache telemetry.
   */
  getStats(): CacheStats {
    return {
      size: this.map.size,
      maxCapacity: this.maxCapacity,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      defaultTtlMs: this.defaultTtlMs,
    };
  }
}

// Global singleton instance for repository telemetry (persists across API invocations in memory)
export const repoTelemetryCache = new LRUCache<any>(100, 15 * 60 * 1000);
