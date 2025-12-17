import { Link } from "react-router-dom";
import { logoutUrl, redirectionUrl } from "../../utils/config";

const LoginRedirectBox = ({ redirectUrl = redirectionUrl }) => {
  const ClearCookieFromBrowser =()=>{
    window.location.href = `${logoutUrl}`;
  }
  return (
    <section className="fixed top-0 left-0 w-full h-full flex justify-center items-center opacity-[0.7] z-999 bg-gray-700 py-20 dark:bg-dark">
      <div className="">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <div className="text-center flex justify-center items-center mt-4 relative">
              <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm text-center relative border-1 border-[#959595]">
                <h2 className="text-lg font-semibold mb-4">
                  You're Not Logged In
                </h2>
                <p className="text-sm mb-6 text-red-500">
                  It seems you're not logged in or your session has expired.
                  Please log in again to continue using Superlio.ai.
                </p>

                <div
                  className="w-fit sm:w-[283px] max-w-full justify-self-center flex flex-col items-center text-white px-[10px] py-[10px] text-[12px] font-bold transition duration-200 ease-in-out rounded-[20px] bg-[#614bfb] cursor-pointer hover:bg-[#8979FD]"
                  onClick={()=>ClearCookieFromBrowser()}
                >
                  <span>Login</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginRedirectBox;
