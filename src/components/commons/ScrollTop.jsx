import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useMainStore from "../../store/useMainStore";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const activeTab = useMainStore((state) => state.data.activeTab);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, activeTab]);

  return null;
};

export default ScrollToTop;