import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  homeIcon,
  settingSideIcon,
  contentCreateIcon,
  schedulleIcon,
  extensionIcon,
  facebookIcon,
  featureIcon,
  supportIcon,
  settingsIcon,
  dashboardIcon,
  personalisationIcon,
  logoutIcon,
  promptsIcon,
  subscriptionIcon,
  profile,
} from "../../assets/images";
import { FiMenu, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import useMainStore from "../../store/useMainStore";
import Button from "./Button";
import { logoutUrl, settingsUrl, subscriptionUrl } from "../../utils/config";
import ImageComponent from "./Image";


export default function Sidebars() {
  const user = useMainStore((state) => state.data?.settings);
  const [isHovered, setIsHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const {getSubscription} = useMainStore();
  const [sidebarUrls, setSidebarUrls] = useState({facebook_url :"" ,feature_url :"", contact_url:""})
  useEffect(()=>{
    const fetchUrls =async()=>{
      const res = await getSubscription();
      if (res) {
        let facebook_url  = res?.facebook_url ?? ""; 
        let feature_url = res?.feature_url ?? "";
        let contact_url = res?.contact_url ?? ""
        setSidebarUrls({ facebook_url: facebook_url, feature_url: feature_url, contact_url: contact_url });
      }
    }
    fetchUrls();
  },[])
  const joinFacebookUrl = sidebarUrls?.facebook_url;
  const newFeaturesUrl = sidebarUrls?.feature_url;
  const contactSupportUrl = sidebarUrls?.contact_url;

  const buttonLinks = [
    { label: 'Settings', url: settingsUrl, icon: settingsIcon },
    { label: 'My Subscription', url: subscriptionUrl, icon: subscriptionIcon },
    { label: 'Join Our Facebook', url: joinFacebookUrl, icon: facebookIcon },
    { label: 'New Feature Request', url: newFeaturesUrl, icon: featureIcon },
    { label: 'Contact Support', url: contactSupportUrl, icon: supportIcon },
    { label: 'Log out', url: logoutUrl, icon: logoutIcon },
  ];

  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="sm:hidden fixed top-6 right-5 z-[1000] transition-all duration-300"
        onClick={toggleSidebar}
      >
        <div className="relative w-8 h-8">
          <FiMenu
            className={`absolute w-8 h-8 text-gray-800 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "opacity-0 scale-90 rotate-45" : "opacity-100 scale-100"}`}
          />
          <FiX
            className={`absolute w-8 h-8 text-gray-800 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-90 rotate-45"}`}
          />
        </div>
      </button>

      {/* Sidebar */}
      <nav
        className={`fixed top-20 z-999 h-screen bg-white border-r-2 border-gray-200 
        transition-all duration-500 ease-in-out flex flex-col
        ${isHovered ? "w-[230px]" : "w-[70px]"} 
        ${isSidebarOpen ? "left-0 opacity-100" : "-left-full opacity-0"} 
        sm:left-0 sm:opacity-100`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowProfileMenu(false);
        }}
      >
        {/* Nav Items */}
        <ul className="flex flex-col space-y-1 pt-1">
          {[
            // { to: "/", icon: dashboardIcon, label: "Dashboard" },
            { to: "/content-personalization", icon: personalisationIcon, label: "Content Personalization" },
            { to: "/content-generation", icon: contentCreateIcon, label: "Content Generation" },
            { to: "/schedule", icon: schedulleIcon, label: "Schedule" },
          ].map((item) => (
            <li key={item.to} className="group">
              {item.isExternal ? (
                <button
                  onClick={() => window.location.href = item.to}
                  className="flex items-center pl-6 pr-3 py-3 text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <img src={item.icon} className="w-5 h-5 mr-3" alt={item.label} />
                  <span
                    className={`overflow-hidden text-sm text-overflow-ellipsis transition-all ${isHovered ? "duration-1000" : "duration-300"} transform whitespace-nowrap
                      ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}`}
                  >
                    {item.label}
                  </span>
                </button>
              ) : (
                <Link
                  to={item.to}
                  className={`flex items-center pl-6 pr-3 py-3 text-gray-700 hover:bg-gray-100 ${location.pathname === item.to ? "bg-gray-200" : ""
                    }`}
                >
                  <img src={item.icon} className="w-5 h-5 mr-3" alt={item.label} />
                  <span
                    className={`overflow-hidden text-sm text-overflow-ellipsis transition-all ${isHovered ? "duration-1000" : "duration-300"} transform whitespace-nowrap
                      ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}`}
                  >
                    {item.label}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Profile Section + Dropdown */}
        <div
          className="relative sticky bottom-0 mt-auto p-4"
          onMouseEnter={() => setShowProfileMenu(true)}
          onMouseLeave={() => setShowProfileMenu(false)}
        >
          {/* Profile Area */}
          <div className="flex items-center cursor-pointer group">
            <ImageComponent
              src={user.headshot}
              fallbackSrc={profile}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <span
              className={`w-[65%] overflow-hidden text-overflow-ellipsis ml-3 text-sm text-gray-700 font-medium whitespace-nowrap transition-all transform 
              ${isHovered ? "duration-1000 opacity-100 translate-x-0" : "duration-300 opacity-0 -translate-x-5 pointer-events-none"}
            `}
            >
              {user.name}
            </span>
            <div
              className={`ml-auto transition-all transform 
              ${isHovered ? "duration-1000 opacity-100 translate-x-0" : "duration-300 opacity-0 -translate-x-5 pointer-events-none"}
            `}
            >
              {showProfileMenu ? (
                <FiChevronUp className="text-gray-500" />
              ) : (
                <FiChevronDown className="text-gray-500" />
              )}
            </div>
          </div>

          {showProfileMenu && (
            <div className="absolute bottom-12 right-0 w-48 bg-white shadow-md border border-gray-200 rounded-md z-[1001]">
              {buttonLinks.map(({ label, url, icon },index) => (
                <Button
                  key={label}
                  onClick={() => label.toLowerCase() === 'log out' ? window.location.href = url : window.open(url, '_blank') }
                  type="custom"
                  className={`w-full text-left block !px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                    index !== 0 ? 'mt-1' : ''
                  }`}
                  textClass="text-left"
                  iconPosition="left"
                  icon={<img src={icon} className="w-[17px] h-[17px] mx-auto mr-2" />}
                >
                  {label}
                </Button>
              ))}
            </div>
          )}
        </div>

      </nav >
    </>
  );
}
