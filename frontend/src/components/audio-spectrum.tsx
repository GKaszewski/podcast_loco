import { useEffect, useRef } from "react";
import useAppStore from "../lib/store";
import { useWindowSize } from "@uidotdev/usehooks";

const AudioSpectrum = () => {
  const currentPodcast = useAppStore((state) => state.currentPodcast);
  const audio = useAppStore((state) => state.audioElement);
  const setAudioContext = useAppStore((state) => state.setAudioContext);
  const setAnalyser = useAppStore((state) => state.setAnalyser);
  const setAudioSource = useAppStore((state) => state.setAudioSource);
  const discElement = useAppStore((state) => state.discImage);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { width, height } = useWindowSize();
  const view = useAppStore((state) => state.view);

  useEffect(() => {
    if (!audio || !canvasRef.current || !currentPodcast) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);

    setAudioContext(audioContext);
    setAnalyser(analyser);
    setAudioSource(source);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;

    const buffferLength = analyser.frequencyBinCount;

    const dataArray = new Uint8Array(buffferLength);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = discElement?.width ? discElement.width / 2 : 225;

    const draw = () => {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const angleStep = (2 * Math.PI) / buffferLength;

      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius,
        centerX,
        centerY,
        canvas.width / 2,
      );

      gradient.addColorStop(0, "#e7e5e4");
      gradient.addColorStop(0.5, "#f97316");
      gradient.addColorStop(1, "#fed7aa");

      ctx.strokeStyle = gradient;

      dataArray.forEach((value, index) => {
        const angle = index * angleStep;
        const barLength = radius + value / 2;

        const xStart = centerX + radius * Math.cos(angle);
        const yStart = centerY + radius * Math.sin(angle);
        const xEnd = centerX + barLength * Math.cos(angle);
        const yEnd = centerY + barLength * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        // ctx.strokeStyle = `rgb(${value + 100},50,150)`;
        ctx.lineWidth = 5;
        ctx.stroke();
      });
    };

    draw();

    return () => {
      source.disconnect();
      analyser.disconnect();
    };
  }, [audio, discElement, width, currentPodcast]);

  return (
    <div
      className={`${view === "home" ? "invisible" : ""} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none`}
    >
      <canvas
        ref={canvasRef}
        width={width! - 25 || 800}
        height={height! - 25 || 800}
        className="rounded-lg"
      />
    </div>
  );
};

export default AudioSpectrum;
