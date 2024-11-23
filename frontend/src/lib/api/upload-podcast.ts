import { Podcast } from '../types';
import base from './base';
import { PodcastPayload } from './types';

export const uploadPodcast = async (
  payload: PodcastPayload
): Promise<Podcast> => {
  const formData = new FormData();
  formData.append('file', payload.file);
  formData.append('title', payload.title);

  const response = await base.post<Podcast>('/podcasts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
