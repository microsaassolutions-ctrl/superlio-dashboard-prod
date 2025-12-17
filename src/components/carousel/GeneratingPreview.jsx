import React, { useEffect, useRef, useState } from "react";
import useMainStore from "../../store/useMainStore";
import svgTemplates from "../../utils/svgTemplates";
import FooterCarousel from "./Footer";

const GeneratingPreview = ({ svgPath }) => {
  const previewRef = useRef(null);
  const themeBackground = useMainStore((state) => state.data.theme.colors.background);
  const themeTertiary = useMainStore((state) => state.data.theme.colors.tertiary);
  const themePrimary = useMainStore((state) => state.data.theme.colors.primary);
  const themeSecondary = useMainStore(
    (state) => state.data.theme.colors.secondary
  );
  const settingsBackground = useMainStore(
    (state) => state.data.theme.background
  );
  return (
    <div className="bg-white p-[7.5px] relative rounded-lg max-h-[515px] min-h-[515px] w-[415px]  shadow-[inset_0px_0px_10px_rgba(0,0,0,0.5)]">
      <div
        className="slide-preview-svg-content w-full h-full"
        style={{ backgroundColor: `${themeBackground}` }}
        dangerouslySetInnerHTML={{ __html: svgPath }}
      />
      <div className="slide-preview-content w-full h-full absolute top-0 left-0">
        <div
          className="mainContents select-none w-full h-full p-0 flex flex-col gap-[10px] justify-center text-black overflow-hidden relative shadow-[0_0px_10px_rgba(0,0,0,0.1)]"
          ref={previewRef}
        >
          <div className="p-[30px] mt-[40px]">
            <h3
              className="m-0 mb-9 text-5xl leading-[3rem] font-bold break-words animate-pulse"
              style={{ color: themePrimary }}
            >
              Carousel is being generated
              <span className="ml-2 flex space-x-1">
                <span className="animate-pulse">.</span>
                <span className="animate-pulse delay-150">.</span>
                <span className="animate-pulse delay-300">.</span>
              </span>
            </h3>
          </div>
          <div className="flex items-center w-full gap-[10px] absolute bottom-[10px] p-5"></div>
          <div className="flex items-center w-full gap-[10px] absolute bottom-[0px] left-0  pt-5 mb-2">
            <div className="flex-1 flex justify-center">
              <FooterCarousel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratingPreview;
