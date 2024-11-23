import { useMemo } from "react";
import PauseIcon from "../assets/icons/pause-icon";
import PlayIcon from "../assets/icons/play-icon";
import { Podcast } from "../lib/types";
import useAppStore from "../lib/store";

const PodcastListElement = ({ podcast }: { podcast: Podcast }) => {
  const {
    setCurrentPodcast,
    currentPodcast,
    audioElement,
    status,
    setView,
    play,
    pause,
    stop,
  } = useAppStore();

  const isSelected = useMemo(
    () => currentPodcast?.id === podcast.id,
    [currentPodcast, podcast],
  );

  const style = `flex items-center justify-between p-4 rounded-md ${
    isSelected ? "bg-slate-900/60" : "bg-slate-900"
  }  backdrop-blur-3xl hover:ring-1 ring-indigo-600/60`;

  const handleOnClick = () => {
    if (!audioElement) return;

    if (isSelected && currentPodcast?.id === podcast.id) {
      if (status === "playing") {
        pause();
      } else {
        play();
      }
    }

    // if user clicks on a different podcast than the one playing or paused, set the new podcast
    if (currentPodcast?.id !== podcast.id) {
      stop();
      setCurrentPodcast(podcast);
      play();
      setView("podcast-detail");
    }
  };

  return (
    <li className={style}>
      <span className="text-white cursor-default">{podcast.title}</span>
      <button
        className="p-2 rounded-md cursor-pointer bg-slate-800 hover:bg-slate-700"
        onClick={handleOnClick}
      >
        {status === "playing" && isSelected ? (
          <PauseIcon className="stroke-white" />
        ) : (
          <PlayIcon className="stroke-white" />
        )}
      </button>
    </li>
  );
};

export default PodcastListElement;
