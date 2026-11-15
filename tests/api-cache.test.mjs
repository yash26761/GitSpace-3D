import test from "node:test";
import assert from "node:assert/strict";

// In-Memory LRU Cache implementation test
class TestLRUCache {
  constructor(maxCapacity = 3, defaultTtlMs = 100) {
    this.map = new Map();
    this.maxCapacity = Math.max(1, maxCapacity);
    this.defaultTtlMs = defaultTtlMs;
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
  }

  get(key) {
    const entry = this.map.get(key);
    if (!entry) {
      this.misses++;
      return undefined;
    }
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      this.misses++;
      return undefined;
    }
    // Refresh LRU order
    this.map.delete(key);
    this.map.set(key, entry);
    this.hits++;
    return entry.value;
  }

  set(key, value, ttlMs) {
    const ttl = ttlMs !== undefined ? ttlMs : this.defaultTtlMs;
    const now = Date.now();
    const expiresAt = now + ttl;

    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.maxCapacity) {
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
        this.evictions++;
      }
    }

    this.map.set(key, { value, expiresAt, addedAt: now });
  }

  has(key) {
    const entry = this.map.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return false;
    }
    return true;
  }

  delete(key) {
    return this.map.delete(key);
  }

  size() {
    return this.map.size;
  }

  getStats() {
    return {
      size: this.map.size,
      maxCapacity: this.maxCapacity,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
    };
  }
}

test("LRU Cache — Basic set and get", () => {
  const cache = new TestLRUCache(5, 5000);
  cache.set("repo:facebook/react", { stars: 230000 });
  
  assert.equal(cache.has("repo:facebook/react"), true);
  const item = cache.get("repo:facebook/react");
  assert.deepEqual(item, { stars: 230000 });
  assert.equal(cache.getStats().hits, 1);
});

test("LRU Cache — Evicts least recently used when capacity is reached", () => {
  const cache = new TestLRUCache(3, 5000);
  cache.set("a", 1);
  cache.set("b", 2);
  cache.set("c", 3);

  // Access "a" so that "b" becomes the least recently used
  cache.get("a");

  // Add 4th item, should evict "b"
  cache.set("d", 4);

  assert.equal(cache.has("a"), true);
  assert.equal(cache.has("b"), false, "Key 'b' should have been evicted");
  assert.equal(cache.has("c"), true);
  assert.equal(cache.has("d"), true);
  assert.equal(cache.getStats().evictions, 1);
});

test("LRU Cache — Honors TTL expiration", async () => {
  const cache = new TestLRUCache(5, 40); // 40ms TTL
  cache.set("temp", "fastapi");

  assert.equal(cache.get("temp"), "fastapi");
  assert.equal(cache.has("temp"), true);

  // Wait 60ms to exceed TTL
  await new Promise((resolve) => setTimeout(resolve, 60));

  assert.equal(cache.get("temp"), undefined);
  assert.equal(cache.has("temp"), false);
  assert.equal(cache.getStats().misses, 1);
});
