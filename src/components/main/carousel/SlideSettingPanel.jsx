import React, { useEffect, useRef, useState } from "react";
import { Button, Loading, RegenerationReason } from "../../commons";
import { ContentTab, SettingsTab, ThemeTab } from "../slide-settings";
import useMainStore from "../../../store/useMainStore";
import {
  contentIcon,
  contentIconActive,
  settingIcon,
  settingIconActive,
  themeIcon,
  themeIconActive,
} from "../../../assets/images";
import { errorToaster } from "../../../utils/toaster";
import { regenSuggestions } from "../../../utils/helpers";

function Settings() {
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const topic = useMainStore((state) => state.data?.topic);
  const summary = useMainStore((state) => state.data?.summary);

  const { data, setData, regenerateCarousel } = useMainStore();
  const { carousels } = data;
  const isGeneratingCarousel = useMainStore(
    (state) => state.data?.isGeneratingCarousel
  );
  const isAnimationNeeded = useMainStore(
    (state) => state.data?.isAnimationNeeded,
  );
  const isCarouselUpdating = useMainStore(
    (state) => state.data?.isCarouselUpdating,
  );

  const isCarouselBusy = isGeneratingCarousel || isAnimationNeeded;

  const prevSlideIdRef = useRef(null);

  // Ensure we always have an active slide
  const activeSlide = carousels.length > 0 ? carousels[0] : null;
  const activeTab = activeSlide?.activeSetting || "content";

  useEffect(() => {
    if (
      activeSlide &&
      carousels.length === 1 &&
      prevSlideIdRef.current !== activeSlide.id
    ) {
      setData("activeSlideId", activeSlide.id);
      prevSlideIdRef.current = activeSlide.id;
    }
  }, [carousels, activeSlide, setData]);

  const handleInputChange = (field, value) => {
    if (activeSlide) {
      setData(`carousels[0].${field}`, value);
    }
  };

  const handleCheckboxChange = (field) => {
    if (activeSlide) {
      setData(`carousels[0].${field}`, !activeSlide[field]);
    }
  };

  const handleTabChange = (tab) => {
    if (activeSlide && activeSlide.activeSetting !== tab) {
      const updatedCarousels = [...carousels];

      updatedCarousels[0] = {
        ...activeSlide,
        activeSetting: tab,
      };

      setData("carousels", updatedCarousels);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "content":
        return (
          <ContentTab
            slide={activeSlide}
            handleInputChange={handleInputChange}
            handleCheckboxChange={handleCheckboxChange}
          />
        );
      case "settings":
        return <SettingsTab />;
      case "theme":
        return <ThemeTab />;
      default:
        return null;
    }
  };

  const handleButtonClick = (action) => {
    switch (action) {
      case "Regenerate":
        console.log("Regenerating content...");
        break;
      case "Skip":
        console.log("Skipping...");
        setData("whichToPost", "post");
        setData("activeTab", "publish");
        break;
      case "Publish":
        console.log("Publishing...");

        if (Array.isArray(carousels) && carousels.length >= 2) {
          const isArrayOfObjects = carousels.every(item => typeof item === "object" && item !== null);
          const hasVisibleItem = carousels.some(item => item.invisible === false);

          if (isArrayOfObjects && hasVisibleItem) {
            setData("whichToPost", "carousel");
            setData("activeTab", "publish");
          } else {
            console.warn("Validation failed: At least one Slide must be visible.");
            errorToaster("At least one Slide must be visible for you to Publish with Carousel")
          }
        } else {
          console.warn("Validation failed: carousel must be an array of max 2 items.");
        }

        break;
      default:
        console.warn("Unknown action:", action);
        break;
    }
  };

  const regenerateHandle = async (reason) => {
    if (!topic.trim()) {
      errorToaster("The Topic Field  cannot be empty.");
      return;
    }
    // setLoading(true);
    try {
      const payload = {
        user_id: data?.settings?.id,
        topic,
        content: carousels,
        reason: reason,
        length: carousels.length,
        postType: "Carousel",
        linkedin_postid: "",
      };

      const updatedCarousels = [...carousels];

      updatedCarousels[0] = {
        ...activeSlide,
        activeSetting: "content",
      };
      setIsHovered(false)
      setData("carousels", updatedCarousels);
      const result = await regenerateCarousel(payload);
      if (!result) {
        errorToaster("Failed to re-generate post. Please try again.");
        return console.warn("Failed to generate post. Please try again.");
      }
    } catch (error) {
      errorToaster("Failed to re-generate post. Please try again.");
      console.error("Error generating:", error);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="max-w-[415px] relative grid grid-cols-[75%_25%] w-full h-full rounded-lg text-black shadow-custom ">
      {loading && <Loading />}
      <div className="bg-white p-5 rounded-tl-lg rounded-bl-lg">
        <h2 className="m-1 primary-color font-bold text-xl">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h2>
        <hr className="mb-6 text-[#c8c8c8]" />
        {renderActiveTab()}
      </div>

      <div className="bg-[#E4EDF5] flex flex-col items-center justify-between rounded-tr-lg rounded-br-lg">
        <div className="w-full bg-[#E4EDF5] flex flex-col items-center">
          {["content", "settings", "theme"].map((tab) => (
            <Button
              key={tab}
              type="custom"
              iconPosition="top"
              icon={
                activeTab === tab
                  ? tab === "content"
                    ? contentIconActive
                    : tab === "settings"
                      ? settingIconActive
                      : themeIconActive
                  : tab === "content"
                    ? contentIcon
                    : tab === "settings"
                      ? settingIcon
                      : themeIcon
              }
              hideIcon={false}
              onClick={() => handleTabChange(tab)}
              className={`py-3 px-0 text-sm w-[80%] my-1 rounded ${activeTab === tab
                ? "bg-primary-color text-white font-bold hover:bg-[#8979FD] transition"
                : "bg-[#E4EDF5]"
                } ${isCarouselBusy ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{ padding: "12px 0px" }}
              disabled={isCarouselBusy}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
        <div
          className="w-full bg-[#E4EDF5] flex flex-col items-center rounded-tr-lg rounded-br-lg overflow-hidden"
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered && (
            <RegenerationReason
              type={1}
              reasons={regenSuggestions}
              onClick={regenerateHandle}
              className="right-[70px] max-w-[300px] w-max sm:right-[85px] lg:right-[100px]"
            />
          )}

          {["Regenerate", "Skip", "Publish"].map((tab) => {
            const isDisabled = tab !== "Skip" ? isCarouselBusy : false;

            return tab === "Regenerate" ? (
              <Button
                key={tab}
                type="custom"
                onClick={() => handleButtonClick(tab)}
                className={`py-3 px-0 text-[12px] sm:text-sm w-[90%] my-1 rounded bg-primary-color text-white font-normal hover:bg-[#8979FD] transition ${isCarouselBusy ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                style={{ padding: "12px 0px" }}
                onMouseEnter={() => setIsHovered(true)}
                disabled={isCarouselBusy}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ) : (
              <Button
                key={tab}
                type="custom"
                onClick={() => handleButtonClick(tab)}
                className={`py-3 px-0 text-sm w-[90%] my-1 rounded bg-primary-color text-white font-normal hover:bg-[#8979FD] transition ${isDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                style={{ padding: "12px 0px" }}
                onMouseEnter={() => setIsHovered(false)}
                disabled={isDisabled}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            )
          }
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
