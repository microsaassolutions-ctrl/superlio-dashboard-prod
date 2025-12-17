import { Link } from "react-router-dom";
import { logo } from "../../assets/images";
import ImageComponent from "./Image";
import { extensionDownloadUrl, extensionImageUrl } from "../../utils/config";

const Header = () => {

  return (
    <>
      <header className="sticky top-0 z-999 flex w-full items-center bg-white shadow-gray-100 shadow-md">
        <div className="flex-1 w-full">
          <div className="relative flex items-center justify-between">
            <div className="w-fit max-w-full px-4 ml-4">
              <Link to="/" className="w-full py-5 flex items-center gap-2">
                <img
                  src={logo}
                  alt="logo"
                  className="w-[40px] h-[40px] object-cover"
                />
                <span className="font-bold text-xl gradient-title">Superlio.ai</span>
              </Link>
            </div>
            <div className="w-fit sm:w-[283px] max-w-full mr-16 sm:mr-4 flex flex-col items-center text-[#939393] px-[10px] py-[10px] text-[12px] font-bold transition duration-200 ease-in-out bg-[#f7f7f7] rounded-[20px] shadow-[3.2px_3.2px_8px_rgba(195,193,198,0.9),-3.2px_-3.2px_8px_#fff,4.8px_4.8px_8px_rgba(195,193,198,0.9),-3.2px_-3.2px_6.4px_#fff] hover:shadow-[inset_-2px_-2px_6px_rgba(255,255,255,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.4),inset_2px_2px_2px_rgba(255,255,255,0.05),inset_2px_2px_4px_rgba(0,0,0,0.1)]  cursor-pointer" onClick={() => {
              window.open(extensionDownloadUrl)
            }
            }
            >
              <span className="hidden sm:block ">Download our Extension with</span>
              <ImageComponent src={extensionImageUrl} className="w-[90px] h-auto" />
            </div>
          </div>
        </div>
      </header >
    </>
  );
};

export default Header;
