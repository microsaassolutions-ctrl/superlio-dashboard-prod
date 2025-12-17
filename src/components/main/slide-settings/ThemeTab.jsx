import React, { useCallback, useEffect, useState } from "react";
import Slider from "react-slick";
import { BoxComponent, ColorPallete, ColorPicker } from "../../commons";
import { PaletteCollection } from "../../../utils/helpers";
import { dots, triangle, circle, blobs } from "../../../assets/images";
import useMainStore from "../../../store/useMainStore";
import { debounce } from "lodash";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getStoredSVGs, getStoredThemeConfig } from "../../../utils/svgHelperIndexDB";
const PrevArrow = ({ onClick }) => (
  <div
    className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-black text-white border border-white rounded-full cursor-pointer z-10 flex items-center justify-center opacity-[0.5]"
    onClick={onClick}
    style={{ width: 18, height: 18 }}
  >
    <FaChevronLeft size={10} />
  </div>
);

const NextArrow = ({ onClick }) => (
  <div
    className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-black text-white border border-white rounded-full cursor-pointer z-10 flex items-center justify-center opacity-[0.5]"
    onClick={onClick}
    style={{ width: 18, height: 18 }}
  >
    <FaChevronRight size={10} />
  </div>
);

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  accessibility: true,
  arrows: true,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
};

// const imageComponents = themeBg.map((item, index) => ({
//   imgSrc: `${item.url}/1.svg`,
//   title: item.name,
//   colors: {
//     primary: item.primary,
//     secondary: item.secondary,
//     tertiary: item.tertiary,
//     background: item.background,
//   }
// }));
const ThemeTab = () => {
  const { data, setData, fetchThemeBg } = useMainStore();
  const colors = useMainStore((state) => state.data.theme.colors);;
  const [activeImage, setActiveImage] = useState(data.theme.background.type);
  const [imageComponents, setImageComponents] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  // const handleColorChange = (key, value) => {
  //   setData("theme.colors", { ...data.theme.colors, [key]: value });
  // };
  const handleColorChange = useCallback(
    debounce((key, value) => {
      setData("theme.colors", { ...data.theme.colors, [key]: value });
    }, 200),
    [colors]
  );

  const [activePalette,setActivePalette] = useState(0);
  useEffect(()=>{
    // colors
    const matchingIndex = PaletteCollection?.findIndex(cl =>
      cl?.primary === colors.primary &&
      cl?.secondary === colors.secondary &&
      cl?.background === colors.background &&
      cl?.tertiary === colors.tertiary
    );
    setActivePalette(matchingIndex)
  },[colors])

  const handlePaletteClick = (colors) => {
    setData("theme.colors", colors);
  };

  const handleBgImageClick = (title, item) => {
    setActiveImage(title);
    setData("theme.colors", item.colors);
    setData("theme.background", { type: title, active: true });
    // setActiveImage((prev) => (prev === title ? null : title));
    // setData("theme.background", { type: title, active: activeImage !== title });
  };
 
  useEffect(() => {
    const fetchDataFromDB = async () => {
      const themeBg = await getStoredThemeConfig();
      const storedSVGs = await getStoredSVGs();
      if (!storedSVGs) return;

      const imageList = [];
      for (const themeItem of themeBg) {
        const svgGroup = storedSVGs[themeItem.name];
        if (!svgGroup) continue;

        const firstKey = Object.keys(svgGroup)[0];
        if (!firstKey) continue;

        imageList.push({
          svgContent: svgGroup[firstKey],
          title: themeItem.name,
          colors: {
            primary: themeItem.primary,
            secondary: themeItem.secondary,
            tertiary: themeItem.tertiary,
            background: themeItem.background
          }
        });
      }

      const i = imageList.findIndex(item => item.title === activeImage);
      const calculatedIndex = i > 3 ? i - (i % 4) : 0;

      setImageComponents(imageList);
      setActiveIndex(calculatedIndex);
    };

    fetchDataFromDB();
  }, [activeImage]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="w-full self-center justify-self-center min-h-[70px]">
        {imageComponents.length > 0 && (
          <Slider {...{ ...sliderSettings, initialSlide: activeIndex }}>
          {imageComponents.map((item, index) => (
            <div key={index} className="px-1">
              <div className="flex justify-center">
                <div className={`relative w-[35px] sm:w-[50px] h-[70px]`}>
                  <div className="flex items-center justify-center max-h-[100%] pt-[3px]">
                    <div
                      // src={imageSrc}
                      alt="Box Image"
                      className={`theme-box-svg sm:w-full object-cover cursor-pointer transition-all duration-300 border-[2px] border-[#c8c8c8] ${activeImage === item.title ? "!border-[#614bfb]" :""}
                        rounded-lg w-[50px] h-[50px]`}
                      onClick={() => handleBgImageClick(item.title, item)}
                        dangerouslySetInnerHTML={{ __html: item.svgContent }}
                    />
                  </div>
                  {item.title && (
                    <div className={`py-1 text-center text-black text-gray-700 text-[10px] font-semibold cursor-pointer`} onClick={() => handleBgImageClick(item.title, item)}>
                      <p className={`truncate text-[8px]  ${activeImage === item.title ? "text-[#614bfb] scale-115" : "text-black scale-100"}`} title={item.title}>{item.title}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>)}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {["primary", "tertiary", "secondary", "background"].map((colorKey) => (
          <ColorPicker
            key={colorKey}
            label={colorKey.charAt(0).toUpperCase() + colorKey.slice(1)}
            color={data?.theme?.colors?.[colorKey]}
            onChange={(e) => handleColorChange(colorKey, e)}
            containerClass="items-start gap-1 px-0"
            inputClass="border-1 border-[#c8c8c8]"
            labelClass="text-[#3a3a3a]"
            textClass="w-[60px] sm:w-[90px] text-xs"
          />
        ))}
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-[#3a3a3a]">
          Color Palette
        </h3>
        <div className="grid grid-cols-4 gap-2 overflow-y-auto">
          {PaletteCollection?.map((palette, i) => (
            <ColorPallete
              key={i}
              active={i === activePalette}
              primary={palette.primary}
              secondary={palette.secondary}
              tertiary={palette.tertiary}
              background={palette.background}
              onClick={() => handlePaletteClick(palette)}
              containerClass="p-1 border border-[#c8c8c8] rounded-[3px]"
            />
          ))}
        </div>
      </div>
    </div >
  );
};

export default ThemeTab;
