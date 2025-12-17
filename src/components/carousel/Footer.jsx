import React, { useEffect, useState } from "react";
import { logo } from "../../assets/images";
import { ImageComponent } from "../commons";
import useMainStore from "../../store/useMainStore";

const FooterCarousel = ({ }) => {
  const { data } = useMainStore();
  const [branding, setBranding] = useState(true);
  useEffect(() => {
    let isBranding = data?.settings?.requireBranding ?? true;
    setBranding(isBranding);
  }, [data]);
  return (
    <div className="mainContentF w-fit mx-auto px-[5px] py-[0px] mb-1 backdrop-blur-sm bg-white opacity-[0.6] rounded-[6px] shadow-md">
      {branding && (
        <p
          className="m-0 w-full text-[0.6rem] font-semibold text-gray-500 break-keep text-center flex items-center justify-center"
        >
          <span className="italic text-black">Made with</span>
          <ImageComponent
            src={logo}
            alt="Superlio Logo"
            className="inline-block w-3 h-3 align-middle relative mx-[2px]"
          />
          <span className="gradient-title p-0">Superlio.ai</span>
        </p>
      )}
    </div>
  );
};

export default FooterCarousel;
