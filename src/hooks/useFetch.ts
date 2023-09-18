import { useEffect, useState } from 'react';

interface FetchState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export const useFetch = <T>(url: string | null, deps: any[]): FetchState<T> => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  useEffect(() => {
    if (!url) return; // Don't fetch if url is null

    const abortController = new AbortController();
    setState({ data: null, error: null, isLoading: true });

    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal: abortController.signal });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setState({ data, error: null, isLoading: false });
      } catch (error: any) {
        if (error?.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          setState({ data: null, error, isLoading: false });
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, deps);

  return state;
};
