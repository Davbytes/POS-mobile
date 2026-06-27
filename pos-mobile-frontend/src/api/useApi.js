import { useMemo } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import createApi from './client';

/**
 * Returns API methods that attach the Clerk session token to every request.
 *
 * Usage:
 *   const api = useApi();
 *   const { data } = useFetch(() => api.getProducts(), []);
 */
export default function useApi() {
  const { getToken } = useAuth();

  return useMemo(() => createApi(getToken), [getToken]);
}
