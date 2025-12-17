import { use, useEffect, useMemo } from "react";
import FooterCarousel from "./Footer";
import SlideProfileFooter from "./SlideProfileFooter";
import useMainStore from "../../store/useMainStore";
import { getLineHeight } from "../../utils/helpers";

const SlidePreview = ({ slideContent, svgPath }) => {
  const {
    typedTitle,
    typedText,
    themePrimary,
    themeSecondary,
    themeTertiary,
    themeBackground,
    isCenter,
    style,
    showTitle = true, showText = true
  } = slideContent;
  return (
    <div className="slide-preview text-[#000] w-full h-full relative">
      <div
        className="slide-preview-svg-content w-full h-full"
        style={{ backgroundColor: `${themeBackground}` }}
        dangerouslySetInnerHTML={{ __html: svgPath }}
      />
      <div className="slide-preview-content w-full h-full absolute top-0 left-0">
        {/* slide preview content */}
        <div className="mainContents select-none w-full h-full bg-[rgba(255, 0, 0, 0.2)] flex flex-col gap-[10px] justify-top text-black overflow-hidden relative shadow-[0_0px_10px_rgba(0,0,0,0.1)]">
          <div
            className={`p-[30px] mt-[0px] flex flex-col justify-center slide-content-box`}
            style={{ height: `calc(100% - ${isCenter}px)` }}
          >
            {/* slide title content */}
            {showTitle && typedTitle && (
              <p
                className={`mainContentsp mainContentst mainContentTitle m-0 mb-9 break-words text-[36px] ${style?.title?.fontsClass}`}
                style={{ color: themePrimary , fontSize: style?.title?.fontSize, lineHeight : `${parseInt(style?.title?.lineHeight)}px`}}
                dangerouslySetInnerHTML={{
                  __html: typedTitle.replace(/\n/g, "<br>"),
                }}
              />
            )}
            {/* slide text content */}
            {showText && typedText && (
              <p
                className={`mainContentsp  mainContentsc mainContentText m-0 break-words text-[18px] ${style?.content?.fontsClass}`}
                style={{ color: themeSecondary, fontSize: style?.content?.fontSize, lineHeight : `${parseInt(style?.content?.lineHeight)}px` }}
                dangerouslySetInnerHTML={{
                  __html: typedText.replace(/\n/g, "<br>"),
                }}
              />
            )}
          </div>
          {/* preview footer */}
          <SlideProfileFooter />
          {/* carousel footer */}
          <div
            id="carousel-footer"
            className="flex items-center w-full gap-[10px] absolute -bottom-[0px] left-0 pt-5"
          >
            <div className="flex-1 flex justify-center">
              <FooterCarousel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlidePreview;
