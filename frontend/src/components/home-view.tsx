import PodcastList from './podcast-list';
import Avatar from '../assets/avatar.png';
import { usePodcasts } from '../lib/hooks/use-podcasts';

const HomeView = () => {
  const { data: podcasts, isFetching } = usePodcasts();

  return (
    <>
      <section className="flex items-center gap-2 p-8">
        <img
          className="object-cover object-center w-16 h-16 rounded-full select-none"
          src={Avatar}
          alt="avatar"
        />
        <h1 className="text-4xl text-white cursor-default hover:cool-text-gradient">
          Podcast
        </h1>
      </section>
      <section className="flex flex-col gap-2 w-full max-w-[600px] p-4">
        <h2 className="text-2xl text-white cursor-default hover:cool-text-gradient">
          Episodes
        </h2>
        {podcasts && <PodcastList podcasts={podcasts} />}
        {isFetching && <p className="text-white">Loading podcasts...</p>}
      </section>
    </>
  );
};

export default HomeView;
