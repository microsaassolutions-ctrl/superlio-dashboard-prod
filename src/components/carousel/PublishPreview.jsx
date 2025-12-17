import { useEffect } from 'react';
import SlidePreview from './SlidePreview';
import { getLineHeight } from '../../utils/helpers';

const PublishPreview = ({ slide ,svgPath}) => {
  const {titleSetting,contentSetting , id} = slide?.formate;
  // useEffect(()=>{
  //   if(titleSetting){
  //     let titleOuter = document.querySelectorAll("div.mainContents .mainContentst.mainContentTitle");
  //   }
  //   if(contentSetting){
  //     let contentOuter = document.querySelectorAll("div.mainContents .mainContentsp.mainContentText");
  //   }
  // },[titleSetting,contentSetting]);

  return (
    <div
      className={`preview-slide ${slide?.id} relative p-0 bg-white flex flex-col gap-[10px] justify-top text-black overflow-hidden shadow-[0_0px_10px_rgba(0,0,0,0.1)]`}
      style={{
        width: '400px',
        height: "500px",
        backgroundColor: slide.themeBackground,
      }}
    >
      <SlidePreview
        slideContent={{
          typedTitle: slide.typedTitle,
          typedText: slide.typedText,
          themePrimary: slide.themePrimary,
          themeSecondary: slide.themeSecondary,
          themeTertiary: slide.themeTertiary,
          themeBackground: slide.themeBackground,
          isCenter: slide.isCenter,
          showTitle: slide.showTitle,
          showText: slide.showText,
          style: {
            title: { fontSize: !titleSetting?.fontSize ? "36px" : titleSetting?.fontSize, lineHeight: !titleSetting?.fontSize ? "38px" : `${getLineHeight(titleSetting?.fontSize)}px`, fontsClass: !titleSetting?.fontFamilyClass ? "ql-font-poppins" :`${titleSetting?.fontFamilyClass}` },
            content: { fontSize: !contentSetting?.fontSize ? "18px" : contentSetting?.fontSize, lineHeight: !contentSetting?.fontSize ? "20px" : `${getLineHeight(contentSetting?.fontSize)}px`, fontsClass: !contentSetting?.fontFamilyClass ? "ql-font-inter" :`${contentSetting?.fontFamilyClass}`}
          }
        }}
        svgPath={svgPath}
      />
    </div>
  )
}

export default PublishPreview