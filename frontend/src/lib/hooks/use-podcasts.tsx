import { useQuery } from '@tanstack/react-query';
import { fetchPodcasts } from '../api/fetch-podcasts';

export const usePodcasts = () => {
  const QUERY_KEY = 'podcasts';
  return useQuery({
    queryFn: () => fetchPodcasts(),
    queryKey: [QUERY_KEY],
  });
};
