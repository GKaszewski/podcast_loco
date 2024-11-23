import useAppStore from "../lib/store";
import PauseIcon from "../assets/icons/pause-icon";
import PlayIcon from "../assets/icons/play-icon";

const PlaybackControl = () => {
  const {
    status,
    currentPodcast,
    currentTimestamp,
    endTimestamp,
    play,
    pause,
    seekTo,
  } = useAppStore();

  const prettyTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    if (isNaN(minutes) || isNaN(seconds) || time === 0) return "--:--";

    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handlePlayPause = () => {
    if (!currentPodcast) return;

    if (status === "playing") {
      pause();
    } else {
      play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentPodcast) return;

    const timestamp = Number(e.target.value);
    if (isNaN(timestamp)) return;
    if (endTimestamp && timestamp > endTimestamp) return;

    seekTo(timestamp);
  };

  return (
    <footer
      id="audio-play-bar"
      className="flex items-center justify-around w-full gap-2 p-4 pt-8 bg-slate-900/40 ring-1 ring-indigo-600/60 backdrop-blur-2xl isolate"
    >
      <span className="text-white cursor-default">{currentPodcast?.title}</span>
      <button
        disabled={status === "stopped"}
        id="audio-play-button"
        className="p-2 rounded-md cursor-pointer bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
        onClick={handlePlayPause}
      >
        {status === "playing" ? (
          <PauseIcon className="stroke-white" />
        ) : (
          <PlayIcon className="stroke-white" />
        )}
      </button>
      <div className="w-full max-w-[calc(100%-200px)]">
        <input
          disabled={status === "stopped"}
          type="range"
          className="w-full disabled:opacity-30 accent-indigo-500 appearance-none bg-transparent
              [&::-webkit-slider-runnable-track]:rounded-lg [&::-webkit-slider-runnable-track]:bg-indigo-500/40
              [&::-moz-range-track]:rounded-lg [&::-moz-range-track]:bg-indigo-500/40
              [&::-moz-range-track"
          min="0"
          max={endTimestamp || 1}
          value={currentTimestamp || 0}
          onChange={handleSeek}
        />
        <span className="flex justify-between text-white">
          <span>{prettyTime(currentTimestamp || 0) || "--:--"}</span>
          <span>{prettyTime(endTimestamp || 0) || "--:--"}</span>
        </span>
      </div>
    </footer>
  );
};

export default PlaybackControl;
