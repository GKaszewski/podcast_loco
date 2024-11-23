import { Podcast } from '../lib/types';
import PodcastListElement from './podcast-list-element';

const PodcastList = ({ podcasts }: { podcasts: Podcast[] }) => {
  return (
    <ul className="flex flex-col gap-2">
      {podcasts.map((podcast) => (
        <PodcastListElement
          key={`podcast-${podcast.title}`}
          podcast={podcast}
        />
      ))}
    </ul>
  );
};

export default PodcastList;
