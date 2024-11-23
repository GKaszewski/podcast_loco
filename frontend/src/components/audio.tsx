import { useEffect, useRef } from 'react';
import useAppStore from '../lib/store';

const Audio = () => {
  const {
    setAudioElement,
    setStatus,
    setCurrentTimestamp,
    setEndTimestamp,
    setCurrentPodcast,
  } = useAppStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setAudioElement(audioRef.current);
  }, []);

  const onLoadedMetadata = () => {
    if (!audioRef.current) return;
    setEndTimestamp(audioRef.current.duration);
  };

  const onEnded = () => {
    setStatus('stopped');
    setCurrentTimestamp(null);
    setEndTimestamp(null);
    setCurrentPodcast(null);
  };

  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTimestamp(audioRef.current.currentTime);
  };

  return (
    <audio
      ref={audioRef}
      className="hidden"
      onLoadedMetadata={onLoadedMetadata}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
    />
  );
};

export default Audio;
