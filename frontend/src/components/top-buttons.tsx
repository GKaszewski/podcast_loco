import BulbIcon from '../assets/icons/bulb-icon';
import BulbOffIcon from '../assets/icons/bulb-off-icon';
import DiscIcon from '../assets/icons/disc-icon';
import House from '../assets/icons/house-icon';
import useAppStore from '../lib/store';

const TopButtons = () => {
  const {
    isOverlayVisible,
    setIsOverlayVisible,
    view,
    setView,
    currentPodcast,
  } = useAppStore();

  const handleHouseClick = () => {
    if (view === 'home' && currentPodcast) {
      setView('podcast-detail');
    } else {
      setView('home');
    }
  };

  const handleBulbClick = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  return (
    <div className="absolute top-0 left-0 z-10 flex flex-col gap-2 m-2 md:m-8">
      <button
        className="flex items-center justify-center p-4 rounded-md cursor-pointer bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
        onClick={handleHouseClick}
        disabled={view === 'home' && !currentPodcast}
      >
        {view === 'home' && currentPodcast ? (
          <DiscIcon className="stroke-white" />
        ) : (
          <House className="stroke-white" />
        )}
      </button>
      <button
        className="flex items-center justify-center p-4 rounded-md cursor-pointer bg-slate-800 hover:bg-slate-700"
        onClick={handleBulbClick}
      >
        {isOverlayVisible ? (
          <BulbOffIcon className="stroke-white" />
        ) : (
          <BulbIcon className="stroke-white" />
        )}
      </button>
    </div>
  );
};

export default TopButtons;
