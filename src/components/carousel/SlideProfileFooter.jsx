import { ImageComponent } from "../commons";
import useMainStore from "../../store/useMainStore";
import { profile } from "../../assets/images";

const SlideProfileFooter = () => {
  const showHeadshot = useMainStore((state) => state.data.settings.showHeadshot);
  const showName = useMainStore((state) => state.data.settings.showName);
  const showHandle = useMainStore((state) => state.data.settings.showHandle);
  const settingsHeadshot = useMainStore((state) => state.data.settings.headshot);
  const settingsName = useMainStore((state) => state.data.settings.name);
  const settingsHandle = useMainStore((state) => state.data.settings.handle);
  // const proxy = "https://api.allorigins.win/raw?url=";

  // Do not render if nothing is enabled
  if (!showHeadshot && !showName && !showHandle) return null;
  return (
    <div className="absolute bottom-[30px] left-0 right-0 px-5" id="carousel-handler">
      <div className="flex items-center gap-3 w-fit max-w-full bg-white opacity-[0.8] backdrop-blur-sm rounded-lg shadow-md px-2 py-1">
        {showHeadshot && (
          <ImageComponent
            src={`${settingsHeadshot}`}
            fallbackSrc={profile}
            alt="Preview"
            className="w-8 h-8 object-cover rounded-full"
          />
        )}
        {(showName || showHandle) && (
          <div className="flex flex-col justify-center max-w-[200px]">
            {showName && (
              <h4
                className="text-[14px] font-bold leading-none truncate"
                style={{ color: '#000', height: '17px' }}
              >
                {settingsName}
              </h4>
            )}
            {showHandle && (
              <p
                className="text-[11px] leading-none truncate"
                style={{ color: '#000', height: '15px' }}
              >
                {settingsHandle}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideProfileFooter;
