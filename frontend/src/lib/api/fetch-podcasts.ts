import { Podcast } from '../types';
import base from './base';

const ROOT_URL = import.meta.env.VITE_ROOT_URL as string;

export const fetchPodcasts = async (): Promise<Podcast[]> => {
  const response = await base.get<Podcast[]>('/podcasts');
  return response.data.map((podcast) => {
    return {
      ...podcast,
      url: `${ROOT_URL}${podcast.url}`,
    };
  });
};
