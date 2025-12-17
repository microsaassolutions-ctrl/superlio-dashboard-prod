import clsx from "classnames";
import { RxCross2 } from "react-icons/rx";
import { forwardRef } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import SlidePreview from "../../carousel/SlidePreview";
import { getLineHeight } from "../../../utils/helpers";

const PreviewCard = forwardRef(
  (
    {
      provided,
      activeSlideId,
      slide,
      handleAction,
      handleSlideChange,
      debouncedIsUpdating,
      previewSlideStyle,
      stylePreviewImage,
      previewContent,
      draggableProps,
      dragHandleProps,
      isRemove,
      isHidden,
      handleHide,
      invisible,
    },
    ref
  ) => {
    const isActive = activeSlideId === slide?.id;

    return (
      <div
        ref={ref}
        {...draggableProps}
        {...dragHandleProps}
        style={previewSlideStyle}
        onClick={() => handleSlideChange(slide)}
        className={clsx(
          `relative h-[118px] w-[90px] overflow-hidden bg-gray-200 border-[1px] ${slide?.id}`,
          {
            "!border-[#614bfb] !rounded-[0px]": isActive,
            "!opacity-[0.6]": invisible,
          }
        )}
      >
        {!debouncedIsUpdating && isRemove && (
          <div
            role="button"
            aria-label="Remove Slide"
            tabIndex={0}
            className="absolute top-0 right-0 p-0.5 z-1 bg-white opacity-[0.6] cursor-pointer"
            onClick={handleAction}
            onKeyDown={(e) => handleAction(e)}
          >
            <RxCross2
              size={18}
              color="black"
              strokeWidth="1"
              title="Remove Slide"
            />
          </div>
        )}

        {/* hide Button */}
        {isHidden && (
          <div
            className="absolute top-0 right-0 p-0.5 z-1 cursor-p bg-white opacity-[0.6] cursor-pointer"
            onClick={(event) => handleHide(event)}
          >
            {invisible ? (
              <IoEyeOffOutline title="Show" size={18} color={"black"} />
            ) : (
              <IoEyeOutline title="Hide" size={18} color={"black"} />
            )}
          </div>
        )}
        <div
          className={`preview-slide ${slide?.id} absolute scale-[0.236] top-[0px] !transform-[translate(0px, 0px)] left-[-2.2px] origin-top-left p-0 bg-white flex flex-col gap-[10px] justify-top text-black overflow-hidden shadow-[0_0px_10px_rgba(0,0,0,0.1)]`}
          style={stylePreviewImage}
        >
          <div className="slide-preview text-[#000] w-full h-full relative">
            <div
              className="slide-preview-svg-content w-full h-full"
              style={{ backgroundColor: `${previewContent?.themeBackground}` }}
              dangerouslySetInnerHTML={{ __html: previewContent?.svgPath }}
            />
            <div className="slide-preview-content w-full h-full absolute top-0 left-0">
              <div
                className="mainContents select-none w-full h-full bg-[rgba(255, 0, 0, 0.2)] flex flex-col gap-[10px] justify-top text-black overflow-hidden relative shadow-[0_0px_10px_rgba(0,0,0,0.1)]"
              >
                <SlidePreview
                  slideContent={{
                    typedTitle: previewContent?.titleText,
                    typedText: previewContent?.contentText,
                    themePrimary: previewContent?.themePrimary,
                    themeSecondary: previewContent?.themeSecondary,
                    themeTertiary: previewContent?.themeTertiary,
                    themeBackground: previewContent?.themeBackground,
                    isCenter: previewContent?.isCenter,
                    showTitle: slide.showTitle,
                    showText: slide.showText,
                    style: {
                      title: { fontSize: !slide?.titleSetting?.fontSize ? "36px" : slide?.titleSetting?.fontSize, lineHeight: !slide?.titleSetting?.fontSize ? "38px" : `${getLineHeight(slide?.titleSetting?.fontSize)}px`, fontsClass: !slide?.titleSetting?.fontFamilyClass ? "ql-font-poppins" :`${slide?.titleSetting?.fontFamilyClass}` },
                      content: { fontSize: !slide?.contentSetting?.fontSize ? "18px" : slide?.contentSetting?.fontSize, lineHeight: !slide?.contentSetting?.fontSize ? "20px" : `${getLineHeight(slide?.contentSetting?.fontSize)}px`, fontsClass: !slide?.contentSetting?.fontFamilyClass ? "ql-font-inter" :`${slide?.contentSetting?.fontFamilyClass}`}
                    }
                  }}
                  svgPath={previewContent?.svgPath}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default PreviewCard;
