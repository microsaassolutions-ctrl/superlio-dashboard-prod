import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { addSlideIcon } from "../../assets/images";
import ImageComponent from "../commons/Image";
import useMainStore from "../../store/useMainStore";
import { Slide, Settings } from "./carousel/index";
import { Loading } from "../commons";
import { CarouselShimmer } from "../carousel";
import PreviewCard from "./carousel/PreviewCard";
import { getStoredSVGs } from "../../utils/svgHelperIndexDB";

const getItemStyle = (
  isDragging,
  draggableStyle,
  index,
  totalItems,
  backgroundColor,
  backgroundImage
) => {
  return {
    width: "90px",
    height: "118px",
    userSelect: "none",
    ...draggableStyle,
  };
};

export function Carousel() {
  const [generatingImages, setGeneratingImages] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loading] = useState(false);
  const [debouncedIsUpdating, setDebouncedIsUpdating] = useState(false);
  const { data, setData, addSlide, removeSlide, fetchCarousel } =
    useMainStore();
  const carousels = useMainStore((state) => state?.data?.carousels);
  const isRequested = useMainStore(
    (state) => state?.data?.requesting?.carousel
  );
  const topic = useMainStore((state) => state.data?.topic);
  const summary = useMainStore((state) => state.data?.summary);
  const isGeneratingCarousel = useMainStore(
    (state) => state.data?.isGeneratingCarousel
  );
  const isAnimationNeeded = useMainStore(
    (state) => state.data?.isAnimationNeeded
  );
  const isCarouselUpdating = useMainStore(
    (state) => state.data?.isCarouselUpdating
  );
  const { fetchThemeBg } = useMainStore();
  const isCarouselBusy = isGeneratingCarousel || isAnimationNeeded;

  const previewImgRef = useRef(null);

  useEffect(() => {
    if (previewImgRef.current) {
      previewImgRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [data.activeSlideId]);

  useEffect(() => {
    setData("activeTab", "carousel");
    if (carousels.length > 1) {
      setData("activeSlideId", data.activeSlideId);
    } else {
      // setData("activeTab", "post");
      // setLoading(true);
      if (isRequested) {
        console.log("Already Requested");
        return;
      }
      const autoGenerateCarousel = async () => {
        setGeneratingImages(true);
        setData("isGeneratingCarousel", true);
        setData("requesting.carousel", true);
        setData("isAnimationNeeded", true);
        const payload = {
          user_id: data?.settings?.id,
          topic: topic,
          content: summary,
          postType: "carousel",
          linkedin_postid: "",
        };

        const response = await fetchCarousel(payload);

        if (response && response?.carousel?.length > 0) {
          setData("whichToPost", "post");
          // setData("activeTab", "carousel");
          setData("isGeneratingCarousel", false);
        }

        setGeneratingImages(false);
      };

      autoGenerateCarousel();
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedIsUpdating(isAdding || isCarouselUpdating);
    }, 300);

    return () => clearTimeout(timeout);
  }, [isAdding, isCarouselUpdating]);

  const handleSlideChange = (slide) => {
    setData("activeSlideId", slide.id);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    let slides = [...carousels];

    // Extract first and last slides separately
    const firstSlide = slides[0];
    const lastSlide = slides[slides.length - 1];

    // Get only the draggable middle slides
    let middleSlides = slides.slice(1, -1);

    // Adjust indices because middleSlides starts at index 0
    const fromIndex = source.index;
    const toIndex = destination.index;

    if (fromIndex === toIndex) return;

    // Move dragged item within middleSlides
    const [movedSlide] = middleSlides.splice(fromIndex, 1);
    middleSlides.splice(toIndex, 0, movedSlide);

    // Reconstruct the full slides array
    const updatedSlides = [firstSlide, ...middleSlides, lastSlide];

    setData("carousels", updatedSlides);
  };
  const activeSlideId = useMainStore((state) => state.data.activeSlideId);
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


  // ************** NEW CODE ******************
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

    const totalSlides = carousels.length;
    // const slideIndex = carousels.findIndex(slide => slide.id === activeSlideId);

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

  const generateAllSlideBackgrounds = async () => {
    if (!settingsBackground.active || !carousels.length) return {};

    const backgrounds = {};
    for (let i = 0; i < carousels.length; i++) {
      const result = await generateSVGBackground(
        settingsBackground.type,
        themeBackground,
        themeTertiary,
        themePrimary,
        themeSecondary,
        i
      );
      backgrounds[carousels[i].id] = result;
    }
    return backgrounds;
  };

  const [slideBackgrounds, setSlideBackgrounds] = useState({});
  useEffect(() => {
    const applySvgBackgrounds = async () => {
      if (settingsBackground.active) {
        const backgrounds = await generateAllSlideBackgrounds();
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
  // ++++++++++++++ NEW CODE ++++++++++++++++++
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
    <div className="grid gap-10 w-[930px]">
      {loading && <Loading />}
      <div className="grid grid-cols-1 min-[930px]:grid-cols-2 gap-2 lg:gap-5 rounded-lg h-[1015px] min-[930px]:h-[515px]">
        <div className="w-full h-full grid overflow-x-auto overflow-y-hidden">
          <Slide isCenter={centerAlignContent} />
        </div>
        <Settings />
      </div>
      <div className="overflow-x-auto overflow-y-hidden mx-auto max-w-[320px] sm:max-w-[415px] md:max-w-[415px] lg:max-w-[850px] max-h-[130px] flex py-[6px] px-2 shadow-custom bg-[#E4EDF5] rounded-md custom-scrollbar">
        <div className="flex gap-2 w-min justify-center select-none">
          {carousels.length > 0 ? (
            <>
              {carousels.length > 0 && (
                <div className="relative">
                  <PreviewCard
                    activeSlideId={data?.activeSlideId}
                    slide={carousels?.[0]}
                    handleAction={(event) => {
                      event.stopPropagation();
                      if (debouncedIsUpdating) {
                        return;
                      }
                      if (
                        !window.confirm(
                          "Are you sure you want to delete this slide?"
                        )
                      ) {
                        return;
                      }
                      setIsAdding(true);
                      removeSlide(carousels?.[0]?.id);
                      setTimeout(() => {
                        setIsAdding(false);
                      }, 300);
                    }}
                    handleSlideChange={() => handleSlideChange(carousels?.[0])}
                    // debouncedIsUpdating={debouncedIsUpdating}
                    isRemove={false}
                    isHidden={true}
                    handleHide={(event) => {
                      event.stopPropagation();
                      const slide = carousels[0];
                      const updatedCarousels = carousels.map((item) =>
                        item.id === slide.id
                          ? { ...item, invisible: !item.invisible }
                          : item
                      );
                      setData("carousels", updatedCarousels);
                    }}
                    invisible={carousels?.[0]?.invisible}
                    previewSlideStyle={{
                      width: "90px",
                      height: "118px",
                    }}
                    stylePreviewImage={{
                      height: "500px",
                      width: "400px",
                      backgroundColor: themeBackground,
                      left: "-3px",
                    }}
                    previewContent={{
                      svgPath: slideBackgrounds[carousels?.[0]?.id],
                      titleText: carousels?.[0].title,
                      contentText: carousels?.[0].text,
                      themePrimary: themePrimary,
                      themeSecondary: themeSecondary,
                      themeTertiary: themeTertiary,
                      themeBackground: themeBackground,
                      isCenter: centerAlignContent,
                    }}
                  />
                </div>
              )}
              {/* ✅ DragDropContext for Middle Slides */}
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="carousel" direction="horizontal">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex w-min gap-[6px]"
                    >
                      {carousels.slice(1, -1).map((slide, index) => (
                        <Draggable
                          key={slide.id}
                          draggableId={String(slide.id)}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div className="relative">
                              <PreviewCard
                                isDragging={snapshot.isDragging}
                                ref={provided.innerRef}
                                draggableProps={{ ...provided.draggableProps }}
                                dragHandleProps={{
                                  ...provided.dragHandleProps,
                                }}
                                activeSlideId={data?.activeSlideId}
                                slide={slide}
                                handleAction={(event) => {
                                  event.stopPropagation();
                                  if (debouncedIsUpdating) {
                                    return;
                                  }
                                  if (
                                    !window.confirm(
                                      "Are you sure you want to delete this slide?"
                                    )
                                  ) {
                                    return;
                                  }
                                  setIsAdding(true);
                                  removeSlide(slide?.id);
                                  setTimeout(() => {
                                    setIsAdding(false);
                                  }, 300);
                                }}
                                handleSlideChange={() =>
                                  handleSlideChange(slide)
                                }
                                debouncedIsUpdating={debouncedIsUpdating}
                                isRemove={true}
                                isHidden={false}
                                previewSlideStyle={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style,
                                  index,
                                  carousels.length - 2,
                                  themeBackground,
                                  slideBackgrounds[slide?.id]
                                )}
                                stylePreviewImage={{
                                  height: "500px",
                                  width: "400px",
                                  backgroundColor: themeBackground,
                                  left: "-3px",
                                }}
                                invisible={null}
                                previewContent={{
                                  svgPath: slideBackgrounds[slide?.id],
                                  titleText: slide.title,
                                  contentText: slide.text,
                                  themePrimary: themePrimary,
                                  themeSecondary: themeSecondary,
                                  themeTertiary: themeTertiary,
                                  themeBackground: themeBackground,
                                  isCenter: centerAlignContent,
                                }}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              {/*  Add Slide Button */}
              <div className="min-w-[97px] min-h-[110px]" title="Add Slide">
                <ImageComponent
                  src={addSlideIcon}
                  alt="Add Slide"
                  className="w-full h-full shadow-md cursor-pointer"
                  onClick={async (e) => {
                    if (isAdding || isCarouselUpdating) {
                      return;
                    }
                    setIsAdding(true);
                    e.target.scrollIntoView();
                    await addSlide();
                    setTimeout(() => {
                      setIsAdding(false);
                    }, 300);
                  }}
                />
              </div>
              {/*  Last Slide  */}
              {carousels.length > 1 && (
                <PreviewCard
                  activeSlideId={data?.activeSlideId}
                  slide={carousels[carousels.length - 1]}
                  handleAction={(event) => {
                    event.stopPropagation();
                    if (debouncedIsUpdating) {
                      return;
                    }
                    if (
                      !window.confirm(
                        "Are you sure you want to delete this slide?"
                      )
                    ) {
                      return;
                    }
                    setIsAdding(true);
                    removeSlide(carousels[carousels.length - 1]?.id);
                    setTimeout(() => {
                      setIsAdding(false);
                    }, 300);
                  }}
                  handleSlideChange={() =>
                    handleSlideChange(carousels[carousels.length - 1])
                  }
                  isRemove={false}
                  isHidden={true}
                  handleHide={(event) => {
                    event.stopPropagation();
                    const slide = carousels[carousels.length - 1];
                    const updatedCarousels = carousels.map((item) =>
                      item.id === slide.id
                        ? { ...item, invisible: !item.invisible }
                        : item
                    );

                    setData("carousels", updatedCarousels);
                  }}
                  invisible={carousels[carousels.length - 1]?.invisible}
                  previewSlideStyle={{
                    width: "90px",
                    height: "118px",
                    backgroundColor: themeBackground,
                    backgroundImage:
                      slideBackgrounds[carousels[carousels.length - 1]?.id],
                    backgroundSize: "contain",
                  }}
                  stylePreviewImage={{
                    height: "500px",
                    width: "400px",
                    backgroundColor: themeBackground,
                    left: "-3px",
                  }}
                  previewContent={{
                    svgPath:
                      slideBackgrounds[carousels[carousels.length - 1]?.id],
                    titleText: carousels[carousels.length - 1].title,
                    contentText: carousels[carousels.length - 1].text,
                    themePrimary: themePrimary,
                    themeSecondary: themeSecondary,
                    themeTertiary: themeTertiary,
                    themeBackground: themeBackground,
                    isCenter: centerAlignContent,
                  }}
                />
              )}
            </>
          ) : (
            <CarouselShimmer />
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Carousel);
