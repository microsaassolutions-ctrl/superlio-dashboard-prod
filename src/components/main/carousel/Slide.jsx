import React, {
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useState,
} from "react";
import useMainStore from "../../../store/useMainStore";
import domtoimage from "dom-to-image";
import "react-quill-new/dist/quill.snow.css";
import GeneratingPreview from "../../carousel/GeneratingPreview";
import _, { debounce } from "lodash";
import SlidePreview from "../../carousel/SlidePreview";
import { getStoredSVGs } from "../../../utils/svgHelperIndexDB";
import { getLineHeight } from "../../../utils/helpers";

function Slide({ isCenter }) {
  const [svgBgImage, setSvgBgImage] = useState(null);
  const slideRef = useRef(null);
  const typingIntervalRef = useRef(null);

  const [typedTitle, setTypedTitle] = useState("");
  const [typedText, setTypedText] = useState("");
  const [isTypingTitleDone, setIsTypingTitleDone] = useState(false);
  const [sharedDelay, setSharedDelay] = useState(30); // default value

  const { setData, fetchThemeBg } = useMainStore();
  const activeSlideId = useMainStore((state) => state.data.activeSlideId);
  const isUpdated = useMainStore((state) => state.data.isUpdated);
  const carousels = useMainStore((state) => state.data.carousels);
  const themeBackground = useMainStore((state) => state.data.theme.colors.background);
  const themeTertiary = useMainStore((state) => state.data.theme.colors.tertiary);
  const themePrimary = useMainStore((state) => state.data.theme.colors.primary);
  const showHeadshot = useMainStore((state) => state?.data?.settings?.showHeadshot);
  const showName = useMainStore((state) => state.data.settings.showName);
  const showHandle = useMainStore((state) => state.data.settings.showHandle);
  const themeSecondary = useMainStore(
    (state) => state.data.theme.colors.secondary
  );
  const settingsBackground = useMainStore(
    (state) => state.data.theme.background
  );

  const isGeneratingCarousel = useMainStore(
    (state) => state.data?.isGeneratingCarousel
  );
  const isAnimationNeeded = useMainStore(
    (state) => state.data?.isAnimationNeeded
  );

  const activeSlide = useMemo(
    () => carousels.find((slide) => slide.id === activeSlideId),
    [carousels, activeSlideId]
  );

  const debouncedSetIsUpdated = useMemo(
    () =>
      debounce(() => {
        setData("isUpdated", Math.random());
      }, 500),
    [setData]
  );

  // *************** NEW CODE *************
  const generateSVGBackground = async (type, background, tertiary, primary, secondary) => {
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

    const totalSlides = carousels.length;
    const slideIndex = carousels.findIndex(slide => slide.id === activeSlideId);

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
        elements.forEach(el => {
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

  useEffect(() => {
    const applySvgBackground = async () => {
      if (settingsBackground.active) {
        const result = await generateSVGBackground(
          settingsBackground.type,
          themeBackground,
          themeTertiary,
          themePrimary,
          themeSecondary
        );
        setSvgBgImage(result);
      } else {
        setSvgBgImage(null);
      }
    };
    applySvgBackground();
  }, [
    settingsBackground,
    themeBackground,
    themePrimary,
    themeSecondary,
    themeTertiary,
    activeSlideId,
  ]);

    const typeCharacterByCharacter = useCallback(
      (text, setter, delay, onComplete) => {
        let i = 0;
        clearInterval(typingIntervalRef.current);
        const currentTextRef = { current: "" };
        setter("");

        const debouncedDisableAnimation = _.debounce(() => {
          setData("isAnimationNeeded", false);
        }, 2000);

        const speedMultiplier = 1; // Adjust speed multiplier as needed

        typingIntervalRef.current = setInterval(() => {
          if (i < text.length) {
            if (text.substring(i, i + 4) === "<br>") {
              currentTextRef.current += "<br>";
              i += 4;
            }
            else if (text.charAt(i) === "\n") {
              currentTextRef.current += "<br>";
              i++;
            }
            // Regular character typing
            else {
              currentTextRef.current += text.charAt(i);
              i++;
            }

            setter(currentTextRef.current);
            debouncedDisableAnimation();
          } else {
            clearInterval(typingIntervalRef.current);
            onComplete?.();
            debouncedDisableAnimation();
          }
        }, delay * speedMultiplier);
      },
      [setData] // Added setData dependency for safety
    );

    useEffect(() => {
    if (!activeSlide) return;
    if (!isAnimationNeeded) {
      setTypedTitle(activeSlide.title || "");
      setTypedText(activeSlide.text || "");
      setIsTypingTitleDone(true);
      return;
    }

    const titleLength = activeSlide?.title?.length || 0;
    const textLength = activeSlide?.text?.length || 0;
    const totalChars = titleLength + textLength;
    const maxDuration = 4000;
    const delay = Math.max(Math.floor(maxDuration / totalChars), 20);
    setSharedDelay(delay);

    if (titleLength > 0) {
      setIsTypingTitleDone(false);
      setTypedText("")
      typeCharacterByCharacter(activeSlide.title, setTypedTitle, delay, () =>{
       
           typeCharacterByCharacter(activeSlide.text, setTypedText, () =>  setIsTypingTitleDone(true));
     } );
    } else {
      setIsTypingTitleDone(true);
    }
  }, [activeSlide?.title, activeSlide?.text, isAnimationNeeded]);

  useEffect(() => {
     if (!isAnimationNeeded && activeSlide?.text) {
      setTypedText(activeSlide.text);
    }
  }, [isTypingTitleDone, activeSlide?.text, isAnimationNeeded, sharedDelay]);
  if (isGeneratingCarousel) return <GeneratingPreview svgPath={svgBgImage} />;
  if (!activeSlide) return <div>No slide selected</div>;

  return (
    <div className="bg-white p-[7.5px] rounded-lg max-h-[515px] min-h-[515px] w-[415px] shadow-[inset_0px_0px_10px_rgba(0,0,0,0.5)]">
      <SlidePreview
        slideContent={{
          typedTitle: typedTitle,
          typedText: typedText,
          themePrimary: themePrimary,
          themeSecondary: themeSecondary,
          themeTertiary: themeTertiary,
          themeBackground: themeBackground,
          isCenter: isCenter,
          showTitle: activeSlide.showTitle,
          showText: activeSlide.showText,
          style: {
            title: { fontSize: !activeSlide?.titleSetting?.fontSize ? "36px" : activeSlide?.titleSetting?.fontSize, lineHeight: !activeSlide?.titleSetting?.fontSize ? "38px" : `${getLineHeight(activeSlide?.titleSetting?.fontSize)}px`, fontsClass: !activeSlide?.titleSetting?.fontFamilyClass ? "ql-font-poppins" :`${activeSlide?.titleSetting?.fontFamilyClass}` },
            content: { fontSize: !activeSlide?.contentSetting?.fontSize ? "18px" : activeSlide?.contentSetting?.fontSize, lineHeight: !activeSlide?.contentSetting?.fontSize ? "20px" : `${getLineHeight(activeSlide?.contentSetting?.fontSize)}px`, fontsClass: !activeSlide?.contentSetting?.fontFamilyClass ? "ql-font-inter" :`${activeSlide?.contentSetting?.fontFamilyClass}`}
          }
        }}
        svgPath={svgBgImage}
      />
    </div>
  );
}

export default Slide;
