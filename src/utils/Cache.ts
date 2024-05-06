import { DateTime } from "luxon";

interface CachedObject<T> {
  readonly expires: DateTime;
  data: T;
}

export function BuildCache<T>(type: "localStorage" | "memory", fetcher: (k: string) => T): Cache<T> {
  switch (type) {
    case "localStorage":
      return new LocalStorageCache(fetcher);
    case "memory":
      return new MemoryCache(fetcher);
  }
}

export function BuildAsyncCache<T>(type: "localStorage", fetcher: (k: string) => Promise<T>): Cache<Promise<T>> {
  switch(type) {
    case "localStorage":
      return new LocalStorageAsyncCache(fetcher);
  }
}

export interface Cache<T> {
  getCachedItem(key: string, clearCache?: boolean): T;
  //getItemFromSource(key: string): T;
}

export interface AsyncCache<T> {
  getCachedItem(key: string, clearCache?: boolean): Promise<T>;
  //getItemFromSource(key: string): T;
}

class LocalStorageAsyncCache<T> implements AsyncCache<T> {
  #fetcher: (key: string) => Promise<T>;
  
  constructor(fetcher: (k: string) => Promise<T>) {
    this.#fetcher = fetcher;
  }

  #loadFromCache(key: string): CachedObject<T> | null {
    const sData = localStorage.getItem(key);
    if (sData) {
      return JSON.parse(sData) as CachedObject<T>;
    }
    return null;
  }

  #addToCache(key: string, data: CachedObject<T>) {
    const sData = JSON.stringify(data);
    localStorage.setItem(key, sData);
  }

  async getCachedItem(key: string, clearCache?: boolean | undefined): Promise<T> {
    const c = this.#loadFromCache(key);
    if (clearCache || !c || c.expires > DateTime.utc()) {
      const data: T = await this.getItemFromSource(key);
      const result = { expires: DateTime.utc().plus({ hours: 24 }), data };
      this.#addToCache(key, result);
      return data;
    }

    return c.data;
  }

  getItemFromSource(key: string): Promise<T> {
    return this.#fetcher(key);
  }
}

class LocalStorageCache<T> implements Cache<T> {
  #fetcher: (key: string) => T;

  constructor(fetcher: (k: string) => T) {
    this.#fetcher = fetcher;
  }

  #loadFromCache(key: string): CachedObject<T> | null {
    const sData = localStorage.getItem(key);
    if (sData) {
      return JSON.parse(sData) as CachedObject<T>;
    }
    return null;
  }

  #addToCache(key: string, data: CachedObject<T>) {
    const sData = JSON.stringify(data);
    localStorage.setItem(key, sData);
  }

  getCachedItem(key: string, clearCache?: boolean | undefined): T {
    const c = this.#loadFromCache(key);
    if (clearCache || !c || c.expires > DateTime.utc()) {
      const data = this.getItemFromSource(key);
      const result = { expires: DateTime.utc().plus({ hours: 24 }), data };
      this.#addToCache(key, result);
      return data;
    }

    return c.data;
  }

  getItemFromSource(key: string): T {
    return this.#fetcher(key);
  }
}

class MemoryCache<T> implements Cache<T> {
  #cache: Record<string, CachedObject<T>>;
  #fetcher: (key: string) => T;

  constructor(fetcher: (k: string) => T) {
    this.#cache = {};
    this.#fetcher = fetcher;
  }

  getCachedItem(key: string, clearCache?: boolean): T {
    const c = this.#cache[key];
    if (clearCache || !c || c.expires > DateTime.utc()) {
      const data = this.getItemFromSource(key);
      const result = { expires: DateTime.utc().plus({ hours: 24 }), data };
      this.#cache[key] = result;
      return data;
    }

    return c.data;
  }

  getItemFromSource(key: string): T {
    return this.#fetcher(key);
  }
}