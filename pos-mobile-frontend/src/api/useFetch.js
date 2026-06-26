import { useState, useEffect } from 'react';

/**
 * Generic data-fetching hook.
 *
 * Usage:
 *   const { data, loading, error } = useFetch(getProducts, []);
 *
 * @param {Function} fetchFn   - any function from client.js
 * @param {*}        fallback  - value to use while loading ([] for tables, {} for cards)
 * @param {Array}    deps      - re-fetch when these change (optional)
 */
export default function useFetch(fetchFn, fallback = null, deps = []) {
  const [data,    setData]    = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchFn()
      .then(result => { if (!cancelled) setData(result);  })
      .catch(err   => { if (!cancelled) setError(err.message); })
      .finally(()  => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
