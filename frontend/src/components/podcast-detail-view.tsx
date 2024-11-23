import useAppStore from "../lib/store";
import Avatar from "../assets/avatar.png";
import { useEffect, useRef } from "react";

const PodcastDetailView = () => {
  const discRef = useRef<HTMLImageElement | null>(null);
  const { status, togglePlayPause } = useAppStore();
  const setDiscImageElement = useAppStore((state) => state.setDiscImageElement);

  const discStyle = `object-cover object-center rounded-full h-60 w-60 md:w-[calc(100vw/3)] md:h-[calc(100vw/3)] ${
    status === "playing" ? "animate-spin drop-shadow-glow" : ""
  }`;

  useEffect(() => {
    setDiscImageElement(discRef.current);
  }, []);

  return (
    <section className="absolute flex flex-col items-center justify-center w-full h-full">
      <img
        ref={discRef}
        className={discStyle}
        src={Avatar}
        alt="podcast cover"
        onClick={togglePlayPause}
        role="button"
      />
    </section>
  );
};

export default PodcastDetailView;
