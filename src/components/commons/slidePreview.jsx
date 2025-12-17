import React, { useRef, useEffect, useState } from "react";
import useMainStore from "../../store/useMainStore";
import { FooterCarousel, SlideProfileFooter } from "../carousel";

function SlidePreview({}) {
  const [svgBgImage, setSvgBgImage] = useState(null);
  const previewRef = useRef(null);
  const carousels = useMainStore((state) => state.data.carousels);
  const themeBackground = useMainStore((state) => state.data.theme.colors.background);
  const themeTertiary = useMainStore((state) => state.data.theme.colors.tertiary);
  const themePrimary = useMainStore((state) => state.data.theme.colors.primary);
  const themeSecondary = useMainStore(
    (state) => state.data.theme.colors.secondary
  );
  const settingsBackground = useMainStore(
    (state) => state.data.theme.background
  );
  const showHeadshot = useMainStore(
    (state) => state.data.settings.showHeadshot
  );
  const activeSlideId = useMainStore((state) => state.data.activeSlideId);
  const showName = useMainStore((state) => state.data.settings.showName);
  const showHandle = useMainStore((state) => state.data.settings.showHandle);
  const settingsName = useMainStore((state) => state.data.settings.name);
  const settingsHandle = useMainStore((state) => state.data.settings.handle);
  const setData = useMainStore((state) => state.setData);
  const isUpdated = useMainStore((state) => state.data.isUpdated);
  const {fetchThemeBg} = useMainStore()

  useEffect(() => {
    if (!Array.isArray(carousels)) return;

    const cleaned = carousels.filter(
      (item) => item?.id !== undefined && item?.id !== null
    );

    if (cleaned.length !== carousels.length) {
      setData("carousels", cleaned);
      setData("isUpdated", Math.random());
    }
  }, [carousels.length]);

  // useEffect(() => {
  //       const result=  generateSVGBackground( settingsBackground.type,
  //         themeBackground,
  //         themeTertiary,
  //         themePrimary,
  //         themeSecondary);
  //       setSvgBgImage(result);
  // }, [
  //   themeBackground,
  //   themeTertiary,
  //   themePrimary,
  //   themeSecondary,
  //   showHeadshot,
  //   showName,
  //   showHandle,
  //   settingsName,
  //   settingsHandle,
  //   settingsBackground.type,
  //   settingsBackground.active,
  //   isUpdated,
  //   activeSlideId,
  // ]);

  // const generateSVGBackground = async (type, background, tertiary, primary, secondary, activeSlideId) => {
  //   const themeBg = await fetchThemeBg();
  //   if (!type || !themeBg?.length) return null;

  //   const folderName = type.trim().toLowerCase().replace(/\s+/g, "_");

  //   let theme = themeBg.find(item => item.name.trim().toLowerCase() === type.trim().toLowerCase());

  //   // If theme folder not found
  //   if (!theme) {
  //     console.warn(`[SVG Background] No folder for: ${folderName}`);
  //     theme = themeBg[0];
  //     if (!theme) return null;
  //   }
  //   const totalSlides = carousels.length;
  //   const slideIndex = carousels.findIndex(slide => slide.id === activeSlideId);
  //   const currentSlide = slideIndex + 1;

  //   let svgNumber = 1;
  //   if (slideIndex == totalSlides - 1) {
  //     svgNumber = 10;
  //   }

  //   if (slideIndex !== 0 && slideIndex !== totalSlides - 1) {
  //     const relativeIndex = (slideIndex - 1) % 8; // 8 files: 2.svg to 9.svg
  //     svgNumber = relativeIndex + 2; // +2 because we want to start from 2.svg
  //   }

  //   const svgPath = `${theme.url}/${svgNumber}.svg`;
  //   try {
  //     const res = await fetch(svgPath);
  //     if (!res.ok) throw new Error("SVG not found");
  //     const svgText = await res.text();

  //     // Modify the SVG fill colors using DOMParser
  //     const parser = new DOMParser();
  //     const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
  //     const svgEl = svgDoc.querySelector("svg");
  //     if (!svgEl) throw new Error("Invalid SVG content");

  //     function setColor(elements, color) {
  //       elements.forEach(el => {
  //         if (el.hasAttribute("fill")) {
  //           el.setAttribute("fill", color);
  //         } else if (el.hasAttribute("stroke")) {
  //           el.setAttribute("stroke", color);
  //         }
  //       });
  //     }
  //     setColor(svgDoc.querySelectorAll(".super_primary"), primary);
  //     setColor(svgDoc.querySelectorAll(".super_secondary"), secondary);
  //     setColor(svgDoc.querySelectorAll(".super_tertiary"), tertiary);
  //     setColor(svgDoc.querySelectorAll(".super_background"), background);
      
  //     // Serialize and encode the modified SVG
  //     const modifiedSvg = new XMLSerializer().serializeToString(svgDoc);
  //     const base64Svg = btoa(unescape(encodeURIComponent(modifiedSvg)));
  //     setSvgBgImage(`url('data:image/svg+xml;base64,${base64Svg}')`)
  //     return `url('data:image/svg+xml;base64,${base64Svg}')`;
  //   } catch (err) {
  //     console.error("[SVG Background]", err.message);
  //     return null;
  //   }
  // };

  return (
    <div
      className="bg-white p-[7.5px] max-h-[515px]"
      ref={previewRef}
      style={{ }}
    >
      {carousels.map((slide) => (
        <div
          key={slide.id}
          className={`preview-slide ${slide.id}  select-none w-[400px]  h-[500px]  max-h-[500px] p-0 bg-white flex flex-col gap-[10px] justify-top text-black overflow-hidden relative shadow-[0_0px_10px_rgba(0,0,0,0.1)]`}
          style={{
            backgroundColor: themeBackground,
          }}
        >
          <div className="p-[30px] mt-[40px]">
            {slide.showTitle && (
              <p
                className="mainContentsp m-0 mb-9 text-[36px] leading-[3rem] font-bold break-words"
                style={{ color: themePrimary }}
                dangerouslySetInnerHTML={{
                  __html: slide.title,
                }}
              />
            )}
            {slide.showText && (
              <p
                className="mainContentsp m-0 text-[18px] font-semibold break-words"
                style={{ color: themeSecondary }}
                dangerouslySetInnerHTML={{ __html: slide.text }}
              />
            )}
          </div>

          <SlideProfileFooter />

          <div className="flex items-center w-full gap-[10px] absolute -bottom-[0px] left-0 pt-5">
            <div className="flex-1 flex justify-center">
              <FooterCarousel />
            </div>
          </div>
        </div>
      ))
      }
    </div >
  );
}

export default React.memo(SlidePreview);
