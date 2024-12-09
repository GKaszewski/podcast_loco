<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { store } from './store/store.svelte';

  const isHome = $derived(store.view === 'home');

  let canvas = $state<HTMLCanvasElement>();
  let ctx = $state<CanvasRenderingContext2D>();

  let discElement = $state<HTMLImageElement>();
  let radius = $state<number>(54);

  const currentView = $derived(store.view);

  let analyser = $state<AnalyserNode>();
  let bufferLength = $state<number>();
  let dataArray = $state<Uint8Array>();
  let animationFrame = $state<number>();

  const handleResize = () => {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (animationFrame) cancelAnimationFrame(animationFrame);
    if (discElement) radius = discElement.width / 2 || 255;

    draw();
  };

  const draw = () => {
    if (!ctx || !canvas || !dataArray || !bufferLength) return;

    animationFrame = requestAnimationFrame(draw);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    analyser?.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const angleStep = (Math.PI * 2) / bufferLength;

    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      radius,
      centerX,
      centerY,
      canvas.width / 2
    );

    gradient.addColorStop(0, '#e7e5e4');
    gradient.addColorStop(0.5, '#f97316');
    gradient.addColorStop(1, '#fed7aa');

    ctx.strokeStyle = gradient;

    dataArray.forEach((value, index) => {
      if (!ctx) return;
      const angle = index * angleStep;
      const barLength = radius + value / 2;

      const xStart = centerX + radius * Math.cos(angle);
      const yStart = centerY + radius * Math.sin(angle);
      const xEnd = centerX + barLength * Math.cos(angle);
      const yEnd = centerY + barLength * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(xStart, yStart);
      ctx.lineTo(xEnd, yEnd);
      ctx.lineWidth = 5;
      ctx.stroke();
    });
  };

  onMount(() => {
    window.addEventListener('resize', handleResize);

    const audioContext = store.audioContext;
    if (!audioContext) return;

    analyser = audioContext.createAnalyser();
    store.audioSource?.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;

    draw();
  });

  $effect(() => {
    if (currentView === 'podcast-detail') {
      discElement = document.getElementById(
        'podcast-cover'
      ) as HTMLImageElement;
      radius = discElement?.width / 2 || 255;
    }
  });

  onDestroy(() => {
    analyser?.disconnect();
    window.removeEventListener('resize', handleResize);
  });
</script>

<div
  class="{isHome
    ? 'invisible'
    : ''} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-full h-full"
>
  <canvas bind:this={canvas} class="w-full h-full"></canvas>
</div>
