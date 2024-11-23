import PlaybackControl from "./components/playback-control";
import Audio from "./components/audio";
import HomeView from "./components/home-view";
import useAppStore from "./lib/store";
import PodcastDetailView from "./components/podcast-detail-view";
import TopButtons from "./components/top-buttons";
import Overlay from "./components/overlay";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AudioSpectrum from "./components/audio-spectrum";

const queryClient = new QueryClient();

function App() {
  const isOverlayVisible = useAppStore((state) => state.isOverlayVisible);
  const view = useAppStore((state) => state.view);

  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex flex-col items-center w-full min-h-screen bg-gradient-to-br from-slate-950 via-indigo-900 to-slate-900">
        <TopButtons />
        {isOverlayVisible && <Overlay />}
        {view === "podcast-detail" ? <PodcastDetailView /> : <HomeView />}
        <span className="flex-1"></span>
        <PlaybackControl />
        <AudioSpectrum />
        <Audio />
      </main>
    </QueryClientProvider>
  );
}

export default App;
