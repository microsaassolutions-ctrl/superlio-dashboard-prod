import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { Input, Checkbox } from "../../commons";
import useMainStore from "../../../store/useMainStore";
import ReactQuill from "react-quill-new";
import Quill from "quill";
import { disableCopyPasteCut, getLineHeight } from "../../../utils/helpers";
const Size = Quill.import("attributors/style/size");
const Font = Quill.import('formats/font');
// ***************** EDITOR FORMATING **************
// Whitelist for the all font size
Size.whitelist = ["10px", "12px", "14px", "16px", "18px", "20px", "22px", "24px", "26px", "28px", "30px", "32px", "34px", "36px", "38px", "40px", "42px", "44px", "46px", "48px", "50px", "52px", "54px", "56px", "58px", "60px", "62px", "64px", "66px", "68px", "70px", "72px"]
Quill.register(Size, true);

// Whitelist for the all font size
Font.whitelist = [ "antonio", "norwester", "playfair-display", "league-spartan", "league-gothic", "roboto--condensed", "bw-stretch", "cinzel", "bebasneue-regular", "oswald", "anton", 
 "merriweather", "lato", "roboto-slab", "lora", "onest", "urbanist", "biennale", "schabo", "tusker-grotesk", "fiorello-cg", "zuume-rough", "inter",
 "poppins", "dm-sans", "lexend", "switzer", "montserrat-bold", "lato-bold", "raleway", "gilroy", "rosario", "sf-pro", "morganite", "passion-one", "literaturnaya",
 "archivo-black", "helvetica-world", "dm-serif-display", "times-new-roman", "open-sauce", "tt-ramillas", "noto-serif-display", "tt-marxiana-antigua", "cooper-hewitt", "tt-knickerbockers", "tan-harmoni",
 "woodland", "garet", "the-youngest-script", "have-heart-one", "tc-milo", "satoshi", "libre-baskerville", "roboto", "montserrat", "kollektif",
 "open-sans", "helvetica", "product-sans", "arial-nova", "lazydog", "gotham", "garamond", "fredoka", "be-vietnam", "aileron", "tt-hoves",
 "arimo", "public-sans", "a-day-without-sun-text", "the-seasons", "arial", "agrandir", "cormorant-garamond", "arapey", "tt-drugs", "belleza",
 "school-bell", "chewy", "glacial-indifference"
];

Quill.register(Font, true);
// ************** MODULE FOR TITLE EDITOR **********************
const titleModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ align: "" },{ align: "center" },{ align: "right" }], //{ align: "justify" }
    [{
      font: [ "antonio", "norwester", "playfair-display", "league-spartan", "league-gothic", "roboto--condensed", "bw-stretch", "cinzel", "bebasneue-regular", "oswald", "anton", 
        "merriweather", "lato", "roboto-slab", "lora", "onest", "urbanist", "biennale", "schabo", "tusker-grotesk", "fiorello-cg", "zuume-rough", "inter",
        "poppins", "dm-sans", "lexend", "switzer", "montserrat-bold", "lato-bold", "raleway", "gilroy", "rosario", "sf-pro", "morganite", "passion-one", "literaturnaya",
        "archivo-black", "helvetica-world", "dm-serif-display", "times-new-roman", "open-sauce", "tt-ramillas", "noto-serif-display", "tt-marxiana-antigua", "cooper-hewitt", "tt-knickerbockers", "tan-harmoni",
        "woodland", "garet", "the-youngest-script", "have-heart-one", "tc-milo", "satoshi", "libre-baskerville", "roboto", "montserrat", "kollektif",
        "open-sans", "helvetica", "product-sans", "arial-nova", "lazydog", "gotham", "garamond", "fredoka", "be-vietnam", "aileron", "tt-hoves",
        "arimo", "public-sans", "a-day-without-sun-text", "the-seasons", "arial", "agrandir", "cormorant-garamond", "arapey", "tt-drugs", "belleza",
        "school-bell", "chewy", "glacial-indifference"
      ].sort()
    }],
    [{ size: ["22px", "24px", "26px", "28px", "30px", "32px", "34px", "36px", "38px", "40px", "42px", "44px", "46px", "48px", "50px", "52px", "54px", "56px", "58px", "60px", "62px", "64px", "66px", "68px", "70px", "72px"] }],
  ]
};
const titleFormats = ["bold", "italic", "underline", "align", "font", "size"];
// ************** MODULE FOR CONTENT EDITOR **********************
const contentModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ align: "" },{ align: "center" },{ align: "right" }], //{ align: "justify" }
    [{ list: "ordered" }, { list: "bullet" }],
    [{
      font: [ "antonio", "norwester", "playfair-display", "league-spartan", "league-gothic", "roboto--condensed", "bw-stretch", "cinzel", "bebasneue-regular", "oswald", "anton", 
        "merriweather", "lato", "roboto-slab", "lora", "onest", "urbanist", "biennale", "schabo", "tusker-grotesk", "fiorello-cg", "zuume-rough", "inter",
        "poppins", "dm-sans", "lexend", "switzer", "montserrat-bold", "lato-bold", "raleway", "gilroy", "rosario", "sf-pro", "morganite", "passion-one", "literaturnaya",
        "archivo-black", "helvetica-world", "dm-serif-display", "times-new-roman", "open-sauce", "tt-ramillas", "noto-serif-display", "tt-marxiana-antigua", "cooper-hewitt", "tt-knickerbockers", "tan-harmoni",
        "woodland", "garet", "the-youngest-script", "have-heart-one", "tc-milo", "satoshi", "libre-baskerville", "roboto", "montserrat", "kollektif",
        "open-sans", "helvetica", "product-sans", "arial-nova", "lazydog", "gotham", "garamond", "fredoka", "be-vietnam", "aileron", "tt-hoves",
        "arimo", "public-sans", "a-day-without-sun-text", "the-seasons", "arial", "agrandir", "cormorant-garamond", "arapey", "tt-drugs", "belleza",
        "school-bell", "chewy", "glacial-indifference"
      ].sort()
    }],
    [{ size: ["10px", "12px", "14px", "16px", "18px", "20px", "22px", "24px", "26px", "28px", "30px", "32px", "34px", "36px"] }],
  ]
};
const contentFormats = ["bold", "italic", "underline", "align", "list", "font", "size"];
// *************************************************

const stripOuterPTags = (str = "") => {
  const match = str.match(/^<p>(.*)<\/p>$/i);
  return match ? match[1].trim() : str.trim();
};

const ContentTab = () => {
  const quillRef = useRef(null);
  const quillTitleRef = useRef(null);

  const { data, setData } = useMainStore();
  const isGeneratingCarousel = useMainStore(
    (state) => state.data?.isGeneratingCarousel
  );
  const isAnimationNeeded = useMainStore(
    (state) => state.data?.isAnimationNeeded,
  );

  const isCarouselBusy = isGeneratingCarousel || isAnimationNeeded;

  // Find the active slide using useMemo for optimization
  const slide = useMemo(
    () => data.carousels.find((item) => item.id === data.activeSlideId),
    [data.carousels, data.activeSlideId]
  );

  // State for Quill Editor
  const [editorContent, setEditorContent] = useState(slide?.text || "");
  const [editorTitleContent, setEditorTitleContent] = useState(slide?.title || "");

  function formatEditorContent(text = "") {
    return text
      .replace(/\n/g, "<br>")
      // .replace(/<p>\s*<br>\s*<\/p>/g, "");
  }
  useEffect(() => {
    if (slide?.text !== editorContent) {
      setEditorContent(formatEditorContent(slide?.text)|| "");
    }
    if (slide?.title !== editorTitleContent) {
      setEditorTitleContent(formatEditorContent(slide?.title) || "");
    }
    // checkCombinedHeightLimit();
  }, [slide?.text, slide?.title]);

  useEffect(() => {
    if (!quillRef?.current) return;
    if (quillRef.current) {
      const editorContainer = quillRef.current.editingAreaRef.current;
      const editor = quillRef?.current?.getEditor?.();
      if (!editor) return;
      editor.enable(!isCarouselBusy);
      editorContainer.style.opacity = isCarouselBusy ? "0.5" : "1";
    }
    if (!quillTitleRef?.current) return;
    if (quillTitleRef.current) {
      const editorContainer = quillTitleRef?.current?.editingAreaRef?.current;
      const editor = quillTitleRef?.current?.getEditor?.();
      if (!editor) return;
      editor.enable(!isCarouselBusy);
      editorContainer.style.opacity = isCarouselBusy ? "0.5" : "1";
    }
  }, [isCarouselBusy]);

  useEffect(() => {
    if (isCarouselBusy) return;
    const interval = setInterval(() => {
      const titleEditor = quillTitleRef?.current?.getEditor?.();
      const contentEditor = quillRef?.current?.getEditor?.();
      if (!titleEditor || !contentEditor) return;
      if (titleEditor.getLength() > 1) {
        titleEditor.focus();
        titleEditor.formatText(0, titleEditor.getLength(), {
          size: !slide?.titleSetting?.fontSize ? '36px' : slide?.titleSetting?.fontSize,
          bold: true,
          font : !slide?.titleSetting?.fontFamily ? 'poppins' : slide?.titleSetting?.fontFamily
        });
        const elText = document.querySelector('div.mainContents .mainContentst.mainContentTitle');
        if (elText) {
          // if (slide?.titleSetting?.lineHeight) elText.style.lineHeight = `${getLineHeight(slide?.titleSetting?.lineHeight)}px`;
          const innerTags = elText.querySelectorAll("*");
          innerTags.forEach(tag => {
            const fontFamilyClass = !slide?.titleSetting?.fontFamily ? 'ql-font-poppins' : `ql-font-${slide?.titleSetting?.fontFamily}`;
            tag.classList.add(fontFamilyClass);
          });
        }
      }
      if (contentEditor.getLength() > 1) {
        contentEditor.focus();
        contentEditor.formatText(0, contentEditor.getLength(), {
          size: !slide?.contentSetting?.fontSize ? "18px" : slide?.contentSetting?.fontSize,
          font : !slide?.contentSetting?.fontFamily ? 'inter' : slide?.contentSetting?.fontFamily
        });
        const elText = document.querySelector('div.mainContents .mainContentsp.mainContentText');
        if (elText) {
          // if (slide?.contentSetting?.lineHeight) elText.style.lineHeight = `${getLineHeight(slide?.contentSetting?.lineHeight)}px`;
          const innerTags = elText.querySelectorAll("*");
          innerTags.forEach(tag => {
            const fontFamilyClass = !slide?.contentSetting?.fontFamily ? 'ql-font-inter' : `ql-font-${slide?.contentSetting?.fontFamily}`;
            tag.classList.add(fontFamilyClass);
          });
        }
      }
      clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [isCarouselBusy]);

  // Efficient Input Change Handler
  const handleInputChange = (key, value) => {
    if(isCarouselBusy) return
    const slideIndex = data.carousels.findIndex((s) => s.id === slide?.id);
    if (slide && slide[key] !== value) {
      setData(`carousels.${slideIndex}.${key}`, value);
    }
    if (key === 'title') {
      if (!quillTitleRef?.current) return;
      const editor = quillTitleRef?.current?.getEditor?.();
      if (!editor) return;
      const range = editor?.getSelection();
      if (range) {
        const format = editor?.getFormat(range);
        if (format.size || format.font) {
          const size = format.size;
          const fontFamily = format.font;
          const elText = document.querySelector('div.mainContents .mainContentst.mainContentTitle');
          if (elText) {
            if (size) elText.style.lineHeight = `${getLineHeight(size)}px`;
          }
          if (size) {
            setData(`carousels.${slideIndex}.titleSetting`, { 
              fontSize: size, 
              lineHeight: getLineHeight(size),
              fontFamily : fontFamily,
              fontFamilyClass : `ql-font-${fontFamily}`
            });
          }
        }
      }
    } else if (key === 'text') {
      if (!quillRef?.current) return;
      const editor = quillRef?.current?.getEditor?.();
      if (!editor) return;
      const range = editor?.getSelection();
      if (range) {
        const format = editor?.getFormat(range);
        if (format.size || format.font) {
          const size = format.size;
          const fontFamily = format.font;
          const elText = document.querySelector('div.mainContents .mainContentsp.mainContentText');
          if (elText) {
            if (size) elText.style.lineHeight = `${getLineHeight(size)}px`;
          }
          if (size) {
            setData(`carousels.${slideIndex}.contentSetting`, { fontSize: size ,lineHeight: getLineHeight(size),fontFamily : fontFamily, fontFamilyClass:`ql-font-${fontFamily}`});
          }
        }
      }
    }
  };

  // Toggle Checkbox State
  const handleCheckboxChange = useCallback(
    (key) => {
      const slideIndex = data.carousels.findIndex((s) => s.id === slide?.id);
      if (slide) {
        setData(`carousels.${slideIndex}.${key}`, !slide[key]);
      }
    },
    [data.carousels, slide, setData]
  );

  const activeIndex = data.carousels.findIndex((s) => s.id === slide?.id);
  const settings = useMainStore((state) => state.data.carousels[activeIndex]);

  useEffect(() => {
    if(isCarouselBusy) return
    const interval = setInterval(() => {
      if (!quillTitleRef.current || !quillRef?.current) return;
      const titleEditor = quillTitleRef?.current?.getEditor?.();
      const contentEditor = quillRef?.current?.getEditor?.();
      if (!contentEditor && !titleEditor) return;
      if (titleEditor && contentEditor) {
        if(titleEditor.getLength() > 1){
          titleEditor.formatText(0, titleEditor.getLength(), {
          size: !slide?.titleSetting?.fontSize ? '36px' : slide?.titleSetting?.fontSize,
          font : !slide?.titleSetting?.fontFamily ? 'poppins' : slide?.titleSetting?.fontFamily});
          titleEditor.focus();
          const editorOuter = document.querySelector('.mainContentsp.mainContentst.mainContentTitle');
          editorOuter.style.fontSize = `${slide?.titleSetting?.fontSize} !important`;
          editorOuter.style.lineHeight = `${getLineHeight(slide?.titleSetting?.fontSize)}px !important`;
        }
        if (contentEditor.getLength() > 1) {
          contentEditor.formatText(0, contentEditor.getLength(), {
          size: !slide?.contentSetting?.fontSize ? '18px' : slide?.contentSetting?.fontSize,
          font : !slide?.contentSetting?.fontFamily ? 'inter' : slide?.contentSetting?.fontFamily});
          contentEditor.focus();
          const editorOuter = document.querySelector('.mainContentsp.mainContentsc.mainContentText');
          editorOuter.style.fontSize = `${slide?.contentSetting?.fontSize} !important`;
          editorOuter.style.lineHeight = `${getLineHeight(slide?.contentSetting?.fontSize)} !important`;
        }
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activeIndex]);

  // ***********
  useEffect(() => {
    const cleanupEditor = disableCopyPasteCut(quillRef);
    const cleanupTitle = disableCopyPasteCut(quillTitleRef);
    return () => {
      cleanupEditor && cleanupEditor();
      cleanupTitle && cleanupTitle();
    };
  }, []);

  return (
    <>
      {/* Title Section */}
      <div className="flex justify-between items-center">
        Title
        <Checkbox
          checked={slide?.showTitle}
          onChange={() => handleCheckboxChange("showTitle")}
          custom
          color="#FF5733"
          disabled={isCarouselBusy}
        />
      </div>
      {/* <Input
        value={slide?.title}
        onChange={(e) => handleInputChange("title", e.target.value)}
        placeholder="Title"
        className="outline-none w-full my-2 p-2 border border-gray-300 rounded"
        disabled={isCarouselBusy}
      /> */}
      {/* Text Editor */}
      <div className="QuillTitle relative h-auto rounded-md">
        {/* ********************** Title Editor ***************************** */}
        <ReactQuill
          className="custom-quill"
          ref={quillTitleRef}
          theme="snow"
          modules={titleModules}
          formats={titleFormats}
          value={editorTitleContent}
          onChange={(value) => {
            setEditorTitleContent(value);
            handleInputChange("title", value);
          }}
        />
        {/* ********************** Title Editor ***************************** */}
      </div>
      {/* Content Section */}
      <div className="flex justify-between items-center mt-4">
        Content
        <Checkbox
          checked={slide?.showText}
          onChange={() => handleCheckboxChange("showText")}
          custom
          color="#FF5733"
          disabled={isCarouselBusy}
        />
      </div>
      {/* Text Editor */}
      {/* relative max-h-64 h-auto border-gray-300 rounded-md */}
      <div className="QuillContent relative h-auto border-gray-300 rounded-md">
        {/* ********************** Content Editor ***************************** */}
        <ReactQuill
          className="custom-quill"
          ref={quillRef}
          theme="snow"
          modules={contentModules}
          formats={contentFormats}
          value={editorContent}
          onChange={(value) => {
            setEditorContent(value);
            handleInputChange("text", value);
          }}
        />
        {/* ********************** Content Editor ***************************** */}
      </div>
    </>
  );
};

export default ContentTab;
