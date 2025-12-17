import React, { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PublishPreview from "../carousel/PublishPreview";
import useMainStore from "../../store/useMainStore";
import { getStoredSVGs } from "../../utils/svgHelperIndexDB";

const PrevArrow = ({ onClick ,disabled}) => (
  <div
    className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-black text-white border border-white rounded-full cursor-pointer z-10 flex items-center justify-center opacity-[0.5] ${disabled && "!bg-[#ccc]"}`}
    onClick={onClick}
    style={{ width: 30, height: 30 }}
    disabled={disabled}
  >
    <FaChevronLeft size={15} />
  </div>
);

const NextArrow = ({ onClick ,disabled}) => (
  <div
    className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white border border-white rounded-full cursor-pointer z-10 flex items-center justify-center opacity-[0.5] ${disabled && "!bg-[#ccc]"}`}
    onClick={onClick}
    style={{ width: 30, height: 30 }}
    disabled={disabled}
  >
    <FaChevronRight size={15} />
  </div>
);

const ImageCarousel = ({ images }) => {
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: false,
    infinite: false,
    loop:false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    accessibility: true,
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlide(newIndex);
    },
    prevArrow: <PrevArrow disabled={currentSlide === 0}/>,
    nextArrow: <NextArrow disabled={currentSlide === images.length - 1}/>,
  };
  const carousels = useMainStore((state) => state?.data?.carousels);
  const visibleCarousels = carousels?.length && carousels?.filter((items)=> !items?.invisible);

  const [containerHeight, setContainerHeight] = useState("auto");
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const baseWidth = 400;
      const screenWidth = containerRef.current.offsetWidth;
      const newScale = Math.min(1, screenWidth / baseWidth);
      setScale(newScale);

      if (innerRef.current) {
        const originalHeight = innerRef.current.offsetHeight;
        setContainerHeight(originalHeight * newScale);
      }
    };

    window.addEventListener("resize", updateScale);
    updateScale();
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // ******************** NEW CODE ***************
  const generateSVGBackground = async (
    type,
    background,
    tertiary,
    primary,
    secondary,
    slideIndex
  ) => {
    if (!type) return null;
    const svgData = await getStoredSVGs();
    if (!svgData || Object.keys(svgData).length === 0) {
      console.warn("[SVG] No SVG data found in IndexedDB");
      return null;
    }

    const folderKey = type.trim().toUpperCase(); // Example: 'C-01', 'C-02'

    const folderData = svgData[folderKey];
    if (!folderData) {
      console.warn(`[SVG] Folder ${folderKey} not found`);
      return null;
    }

    const totalSlides = visibleCarousels?.length;

    let svgNumber = 1;

    if (slideIndex !== -1 && slideIndex === totalSlides - 1) {
      svgNumber = 10;
    } else if (slideIndex !== -1 && slideIndex !== 0) {
      const relativeIndex = (slideIndex - 1) % 8;
      svgNumber = relativeIndex + 2;
    }

    const svgString = folderData[svgNumber.toString()];
    if (!svgString) {
      console.warn(`[SVG] SVG number ${svgNumber} not found in ${folderKey}`);
      return null;
    }

    try {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgString, "image/svg+xml"); // ✅ correct
      const svgEl = svgDoc.querySelector("svg");
      if (!svgEl) throw new Error("Invalid SVG structure");

      const setColor = (elements, color) => {
        elements.forEach((el) => {
          if (el.hasAttribute("fill")) el.setAttribute("fill", color);
          if (el.hasAttribute("stroke")) el.setAttribute("stroke", color);
        });
      };

      setColor(svgDoc.querySelectorAll(".super_primary"), primary);
      setColor(svgDoc.querySelectorAll(".super_secondary"), secondary);
      setColor(svgDoc.querySelectorAll(".super_tertiary"), tertiary);
      setColor(svgDoc.querySelectorAll(".super_background"), background);

      const modifiedSvg = new XMLSerializer().serializeToString(svgDoc);
      return modifiedSvg;
    } catch (err) {
      console.error("[SVG Parse Error]", err.message);
      return null;
    }
  };

  const generateAllSlideBackgrounds = async ({
    settingsBackground,
    themeBackground,
    themeTertiary,
    themePrimary,
    themeSecondary,
  }) => {
    if (!settingsBackground.active || !visibleCarousels.length) return {};

    const backgrounds = {};
    for (let i = 0; i < visibleCarousels.length; i++) {
      const result = await generateSVGBackground(
        settingsBackground.type,
        themeBackground,
        themeTertiary,
        themePrimary,
        themeSecondary,
        i
      );
      backgrounds[visibleCarousels[i].id] = result;
    }
    return backgrounds;
  };

  //  ************* NEW CODE *****************
  const settingsBackground = useMainStore(
    (state) => state.data.theme.background
  );
  const themeBackground = useMainStore(
    (state) => state.data.theme.colors.background
  );
  const themeTertiary = useMainStore(
    (state) => state.data.theme.colors.tertiary
  );
  const themePrimary = useMainStore((state) => state.data.theme.colors.primary);
  const themeSecondary = useMainStore(
    (state) => state.data.theme.colors.secondary
  );
  const [slideBackgrounds, setSlideBackgrounds] = useState({});

  useEffect(() => {
    const applySvgBackgrounds = async () => {
      if (settingsBackground.active) {
        const backgrounds = await generateAllSlideBackgrounds({
          settingsBackground,
          themeBackground,
          themeTertiary,
          themePrimary,
          themeSecondary,
        });
        setSlideBackgrounds(backgrounds);
      } else {
        setSlideBackgrounds({});
      }
    };
    applySvgBackgrounds();
  }, [
    settingsBackground,
    themeBackground,
    themePrimary,
    themeSecondary,
    themeTertiary,
    carousels,
  ]);

  const [centerAlignContent, setCenterAlignContent] = useState("80");
  const sliderSettings = useMainStore((state) => state.data?.settings);
  useEffect(() => {
    const showHandle = sliderSettings?.showHandle;
    const showHeadshot = sliderSettings?.showHeadshot;
    const showName = sliderSettings?.showName;
    if(showHandle || showHeadshot || showName){
      setCenterAlignContent("80");
    }else{
      setCenterAlignContent("25");
    }
  }, [sliderSettings]);

  return (
    <div
      ref={containerRef}
      className="mt-4 w-full publish-preview-page"
      style={{ height: containerHeight }}
    >
      <div
        ref={innerRef}
        className="inner mx-auto border-[1px] border-[#9595952e]"
        style={{
          width: "400px",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <Slider ref={sliderRef} {...settings}>
          {visibleCarousels?.map((slide, index) => (
            <div
              key={index}
              className="w-full flex justify-center items-center relative"
            >
              <PublishPreview
                slide={{
                  typedTitle: slide.title,
                  typedText: slide.text,
                  themePrimary: themePrimary,
                  themeSecondary: themeSecondary,
                  themeTertiary: themeTertiary,
                  themeBackground: themeBackground,
                  isCenter: centerAlignContent,
                  showTitle: slide.showTitle,
                  showText: slide.showText,
                  slideObj : slide,
                  formate : { titleSetting : slide?.titleSetting , contentSetting : slide?.contentSetting ,id:slide.id}
                }}
                svgPath={slideBackgrounds[slide.id]}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ImageCarousel;
