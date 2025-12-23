
export const initialState = {
  activeTab: "post", //carousel, publish , post
  activeSlideId: null,
  isUpdated: Math.random(),
  isGenerating: false,
  isPostUpdating: false,
  isGeneratingCarousel: false,
  isCarouselUpdating: false,
  isAnimationNeeded: false,
  requesting: {
    carousel: false,
    post: false,
  },
  topic: "",
  isAnsweredQuestion: false,
  whichToPost: null,
  validTransitions: ["content", "post"],
  regenOptions: {
    post: [],
    carousel: [],
    hook: null,
    contentAndStyle: null,
    carouselHook: null,
    carouselContentAndStyle: null
  },
  settings: {
    id: null,
    headshot: null,
    showHeadshot: true,
    name: "",
    email: null,
    showName: true,
    handle: "My Handle",
    showHandle: true,
    requireBranding: true,
    threadId: "",
    niche: "",
  },
  theme: {
    colors: {
      primary: "",
      secondary: "",
      tertiary: "",
      background: "",
    },
    background: {
      type: "",
      active: true,
    },
  },
  suggestions: [],
  summary: "",
  persona: "",
  offerings: "",
  post: {
    text: "",
  },
  carousels: [],
  linkedInConnected: null, // null = unknown/loading, true = connected, false = not connected
  customMedia: null,
  user_fonts: {
    carousel: [
      { title: { id: 1, fontSize: "36px", fontFamily: 'poppins', fontFamilyClass: "ql-font-poppins" }, content: { id: 1, fontSize: "18px", fontFamily: 'inter', fontFamilyClass: "ql-font-inter" } },
      { title: { id: 2, fontSize: "36px", fontFamily: 'poppins', fontFamilyClass: "ql-font-poppins" }, content: { id: 2, fontSize: "18px", fontFamily: 'inter', fontFamilyClass: "ql-font-inter" } },
    ]
  }
};

export const carouselConfig = {
  showTitle: true,
  showText: true,
  invisible: false,
  activeSetting: "content",
  previewImg: "",
  titleSetting: { fontSize: "36px", lineHeight: '38', fontFamily: 'poppins', fontFamilyClass: "ql-font-poppins" },
  contentSetting: { fontSize: "18px", lineHeight: '20', fontFamily: 'inter', fontFamilyClass: "ql-font-inter" }
}