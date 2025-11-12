import { useState, useEffect } from 'react';
import axios from 'axios';

// Simple in-memory cache
const CACHE = Object.create(null);

// Helpers to invalidate cache entries
export function invalidateCache(urlOrMatcher) {
  if (!urlOrMatcher) return;
  const keys = Object.keys(CACHE);
  if (typeof urlOrMatcher === 'function') {
    keys.forEach(k => { if (urlOrMatcher(k)) delete CACHE[k]; });
  } else if (typeof urlOrMatcher === 'string') {
    keys.forEach(k => { if (k.includes(urlOrMatcher)) delete CACHE[k]; });
  }
}

export function clearCache() {
  Object.keys(CACHE).forEach(k => delete CACHE[k]);
}

/**
 * useCachedFetch
 * - url: string | null
 * - axiosConfig: optional axios config (headers etc.)
 * - deps: array of dependencies to control re-fetch (defaults to [url])
 * - ttl: cache time-to-live in ms
 */
export default function useCachedFetch(url, axiosConfig = {}, deps = [], ttl = 60_000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    let alive = true;
    const cacheKey = url + '::' + JSON.stringify(axiosConfig || {});
    const cached = CACHE[cacheKey];
    if (cached && (Date.now() - cached.ts) < ttl) {
      setData(cached.data);
      setError(null);
      setLoading(false);
      return;
    }

    const source = axios.CancelToken.source();
    setLoading(true);
    axios.get(url, { cancelToken: source.token, ...axiosConfig })
      .then(res => {
        if (!alive) return;
        CACHE[cacheKey] = { data: res.data, ts: Date.now() };
        setData(res.data);
        setError(null);
      })
      .catch(err => {
        if (!alive) return;
        if (axios.isCancel(err)) return;
        setError(err);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
      source.cancel('component unmounted');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps && deps.length ? deps : [url]);

  return { data, loading, error };
}

// also export cache for debugging (non-enumerable in production)
export const __CACHE = CACHE;
