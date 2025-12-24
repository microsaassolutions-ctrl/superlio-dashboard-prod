/* eslint-disable no-undef */
import React, { use, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  ImageComponent,
  Loading,
  ImageCarousel,
  Overlay,
  ScheduleCard,
  PdfPreview,
} from "../commons";
import { deleteReq, get, post } from "../../api/apiService";
import {
  globeIcon,
  linkedInIcon,
  blueLikeIcon,
  redHeartIcon,
  likeIcon,
  commentIcon,
  repostIcon,
  shareIcon,
  profile,
} from "../../assets/images";
import useMainStore from "../../store/useMainStore";
import { useNavigate } from "react-router-dom";
import { errorToaster, successToaster } from "../../utils/toaster";
import ShowMoreText from "react-show-more-text";
import { exportCarouselToPDF, fileToBase64 } from "../../utils/generatePdf";
// DEPRECATED: Extension imports removed - now using API OAuth
// import { extensionDownloadUrl, extensionId, extensionImageUrl } from "../../utils/config";
import { apiURL } from "../../utils/config";
import { showMessagesSequentially } from "../../utils/helpers";
import { AiOutlineClose } from "react-icons/ai";
import { FaImage, FaVideo, FaFilePdf } from "react-icons/fa";
import domtoimage from "dom-to-image";
import PostLoader from "../commons/PostLoader";
import { startBackgroundUpload, setupUploadWarning } from "../../utils/uploadManager";

const Publish = ({ subscriptData }) => {
  const [openPostScheduleCard, setOpenPostScheduleCard] = useState(false);
  const [publishSuccessText, setPublishSuccessText] = useState(
    "Your post has been published"
  );
  const [extensionNotActive, setExtensionNotActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [whichToPost, setWhichToPost] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [publishType, setPublishType] = useState("instant");
  const [postPayload, setPostPayload] = useState(null);
  const [, setUploadedCarousel] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState({ message: "Please wait", progress: 0 });
  const [inProccedPost, setInProccesPost] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const navigate = useNavigate();
  const { data, setData, publishPost, checkPublishPosts, deletePost } = useMainStore();
  const userEmail = data?.settings && data?.settings?.email;
  const [isExpired, setIsExpired] = useState(true);
  const [expriryDate, setExpriryDate] = useState(true);
  const newPostIdRef = useRef(null);

  useEffect(() => {
    let expiryDateStr = subscriptData?.scheadule_date;
    setExpriryDate(expiryDateStr);
    let expiryDate = new Date(expiryDateStr) < new Date();
    setIsExpired(expiryDate);
  }, [subscriptData]);

  const carousels = useMainStore((state) => state?.data?.carousels);
  const customMedia = useMainStore((state) => state?.data?.customMedia);
  const visibleCarousels = carousels?.length && carousels?.filter((items) => !items?.invisible);
  useEffect(() => {
    setData("activeTab", "publish");
    if (data.whichToPost) {
      setWhichToPost(data.whichToPost);
    }
  }, []);

  const [processedShown, setProcessedShown] = useState(false);
  const timeoutRef = useRef(null); // <-- add this line
  useEffect(() => {
    const handlePostComplete = async (event) => {
      const { data: eventData } = event;
      if (eventData?.type !== "POST_COMPLETE_FROM_EXTENSION") {
        // setLoading(false);
        // errorToaster(
        //   "Superlio.ai extension not found or the message could not be sent.."
        // );
        return;
      }
      if (!eventData.success) {
        if (eventData.message && timeoutRef.current !== null) {
          let postId = newPostIdRef?.current ?? null;
          errorToaster(
            eventData.message || "LinkedIn post failed with unknown error."
          );
          if (postId) {
            await deletePost(postId);
          }
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
          setLoading(false);
          setLoadingMsg({ message: "Please wait...", progress: 0 });
          return;
        }
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        setLoading(false);
        setLoadingMsg({ message: "Please wait...", progress: 0 });
        errorToaster(
          eventData.message || "LinkedIn post failed with unknown error."
        );
        return;
      }
      //Clear the timeout if extension responds
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        setLoading(false);
        setLoadingMsg({ message: "Please wait...", progress: 0 });
        navigate("/content-generation");
      }
      if (processedShown) {
        return;
      }
      if (publishType === "schedule") {
        const formattedDate = new Date(postPayload?.postDate).toLocaleDateString(
          "en-US",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        );

        const formattedTime = new Date(
          `1970-01-01T${postPayload.postTime}`
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        setOpenPostScheduleCard(false);
        successToaster(`Your post is Scheduled for ${formattedDate} , ${formattedTime}`)
        navigate("/schedule");
      } else {
        // let postId = newPostIdRef?.current
        // if(postId === eventData?.data?.postId){
        //   successToaster(`Your post is published`)
        //   navigate("/content-generation");
        // }
        successToaster(`Your post is published`)
        navigate("/content-generation");
      }
    };

    window.addEventListener("message", handlePostComplete);
    return () => window.removeEventListener("message", handlePostComplete);
  }, [postPayload, publishType]);

  // Helper function to convert an image URL to base64 via backend proxy (for CORS bypass)
  const imgToBase64ViaProxy = async (imgUrl) => {
    try {
      // Use API proxy to fetch external images (bypasses CORS)
      const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const proxyUrl = isLocalDev
        ? `http://127.0.0.1:3001/content/proxy-image?url=${encodeURIComponent(imgUrl)}`
        : `${apiURL}/content/proxy-image?url=${encodeURIComponent(imgUrl)}`;

      // Note: Don't use credentials: 'include' as it breaks CORS with wildcard origin
      const response = await fetch(proxyUrl);
      const data = await response.json();

      if (data.success && data.data) {
        return data.data;
      }
      throw new Error('Proxy failed');
    } catch (error) {
      console.warn(`Could not convert image: ${imgUrl}`, error);
      return imgUrl; // Fallback to original
    }
  };

  // Helper function to convert all external images in an element to base64
  const convertExternalImages = async (element) => {
    const images = element.querySelectorAll('img');
    for (const img of images) {
      const src = img.getAttribute('src');
      // Check if it's an external URL (not local or already base64)
      if (src && !src.startsWith('data:') && !src.startsWith('/') && !src.startsWith('blob:') && !src.startsWith('http://localhost')) {
        try {
          const base64 = await imgToBase64ViaProxy(src);
          img.setAttribute('src', base64);
        } catch (err) {
          console.warn(`Could not convert image: ${src}`, err);
        }
      }
    }
  };

  const generateImages = async () => {
    const slides = document.querySelectorAll('.slick-slider.slick-initialized .slick-slide:not(.slick-cloned)');

    const promises = Array.from(slides).map(async (slide, index) => {
      try {
        // Convert external images to base64 before capture
        await convertExternalImages(slide);

        const width = 1080;
        const height = 1350;
        const scale = (width / slide.offsetWidth);

        const dataUrl = await domtoimage.toPng(slide, {
          width: width,
          height: height,
          style: {
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${slide.offsetWidth}px`,
            height: `${slide.offsetHeight}px`
          },
          cacheBust: true // Force fresh fetch of resources
        });

        const blob = await (await fetch(dataUrl)).blob();
        const blobUrl = URL.createObjectURL(blob);
        console.log(`Image ${index + 1} generated successfully`);
        return blobUrl;
      } catch (err) {
        console.error(`Error generating image for slide ${index + 1}:`, err);
        return null; // or handle differently if needed
      }
    });

    const images = await Promise.all(promises);
    // Filter out any failed (null) results if needed
    return images.filter(Boolean);
  };

  let userFonts = {
    "carousel": [
      {
        "title": { "id": visibleCarousels[0]?.id, "fontSize": visibleCarousels[0]?.titleSetting?.fontSize, "fontFamily": visibleCarousels[0]?.titleSetting?.fontFamily, "fontFamilyClass": visibleCarousels[0]?.titleSetting?.fontFamilyClass ? visibleCarousels[0]?.titleSetting?.fontFamilyClass : `ql-font-${visibleCarousels[0]?.titleSetting?.fontFamily}` },
        "content":
          { "id": visibleCarousels[0]?.id, "fontSize": visibleCarousels[0]?.contentSetting?.fontSize, "fontFamily": visibleCarousels[0]?.contentSetting?.fontFamily, "fontFamilyClass": visibleCarousels[0]?.contentSetting?.fontFamilyClass ? visibleCarousels[0]?.contentSetting?.fontFamilyClass : `ql-font-${visibleCarousels[0]?.contentSetting?.fontFamily}` }

      },
      {
        "title": { "id": visibleCarousels[1]?.id, "fontSize": visibleCarousels[1]?.titleSetting?.fontSize, "fontFamily": visibleCarousels[1]?.titleSetting?.fontFamily, "fontFamilyClass": visibleCarousels[1]?.titleSetting?.fontFamilyClass ? visibleCarousels[1]?.titleSetting?.fontFamilyClass : `ql-font-${visibleCarousels[1]?.titleSetting?.fontFamily}` },
        "content":
          { "id": visibleCarousels[1]?.id, "fontSize": visibleCarousels[1]?.contentSetting?.fontSize, "fontFamily": visibleCarousels[1]?.contentSetting?.fontFamily, "fontFamilyClass": visibleCarousels[1]?.contentSetting?.fontFamilyClass ? visibleCarousels[1]?.contentSetting?.fontFamilyClass : `ql-font-${visibleCarousels[1]?.contentSetting?.fontFamily}` }

      }
    ]
  }
  // ################################
  const mediaGeneratedRef = useRef(false);
  const generatedMediaRef = useRef(null);

  // Subscribe to Zustand linkedInConnected state (persisted in localStorage)
  // This gives us instant UI without waiting for API call
  const linkedInConnectedFromStore = useMainStore((state) => state.data.linkedInConnected);

  // Use Zustand cached value as the source of truth for UI
  const isLinkedInConnected = linkedInConnectedFromStore;

  useEffect(() => {
    // Verify LinkedIn status in background and update store if changed
    checkLinkedInStatus();
  }, []);

  const checkLinkedInStatus = async () => {
    try {
      const response = await get('/linkedin/status');
      const isConnected = response?.connected && !response?.expired;
      // Update Zustand store (persisted) so next page load is instant
      setData("linkedInConnected", isConnected);
    } catch (error) {
      console.error("Error checking LinkedIn status:", error);
      setData("linkedInConnected", false);
    }
  };

  // Helper to generate filename from topic
  const getCarouselFilename = () => {
    const topic = data?.topic || "LinkedIn_Carousel";
    // Sanitize: alphanumerics, spaces, hyphens, underscores only. Limit length.
    const sanitized = topic.replace(/[^a-zA-Z0-9\s-_]/g, "").trim().replace(/\s+/g, "_").substring(0, 50);
    return `${sanitized}.pdf`;
  };

  // Pre-generate carousel PDF in background when user enters publish page
  const isPreGeneratingRef = useRef(false);
  useEffect(() => {
    const preGenerateCarousel = async () => {
      // Only pre-generate if it's a carousel and not already generated
      if (whichToPost !== "carousel" || mediaGeneratedRef.current) {
        return;
      }

      // Wait for DOM to be ready (1 second delay for carousel to render)
      await new Promise(resolve => setTimeout(resolve, 1000));

      isPreGeneratingRef.current = true;
      console.log('[Carousel] Pre-generating PDF in background...');

      try {
        const images = await generateImages();
        const filename = getCarouselFilename();
        const file = await exportCarouselToPDF(images, filename);
        const media = {
          filename: file.name,
          fileSize: file.size,
          type: file.type,
          base64: await fileToBase64(file),
        };
        generatedMediaRef.current = media;
        mediaGeneratedRef.current = true;
        console.log('[Carousel] Pre-generation complete! Ready for instant publish.');
      } catch (error) {
        console.error('[Carousel] Pre-generation failed:', error);
        // Will retry at publish time
      } finally {
        isPreGeneratingRef.current = false;
      }
    };

    preGenerateCarousel();
  }, [whichToPost]);

  const handleConnectLinkedIn = async () => {
    try {
      setLoading(true);
      const response = await get('/linkedin/auth-url');
      if (response?.url) {
        window.location.href = response.url;
      } else {
        errorToaster("Failed to get LinkedIn authorization URL");
        setLoading(false);
      }
    } catch (error) {
      console.error("LinkedIn Auth Error:", error);
      errorToaster("Failed to initiate LinkedIn connection");
      setLoading(false);
    }
  };

  const [isScheduling, setIsScheduling] = useState(false);

  const handleApiPublish = async ({ schedule = false, selectedDate, selectedTime } = {}) => {
    // Set loading state IMMEDIATELY on click - before any async work
    if (schedule) {
      setIsScheduling(true);
    } else {
      setLoading(true);
    }

    try {
      console.time('[Publish] Total Duration');
      console.time('[Publish] 1. Content Preparation');
      // 1. Prepare Content - Use getState() to get fresh value from store (avoids stale closure)
      const freshData = useMainStore.getState().data;
      const content = freshData?.post?.text?.replace(/<br\s*\/?>/gi, "\n");
      if (!content) {
        errorToaster("Post content cannot be empty.");
        if (schedule) setIsScheduling(false); else setLoading(false);
        return;
      }
      console.timeEnd('[Publish] 1. Content Preparation');

      // 2. Prepare Media (Reuse existing logic)
      console.time('[Publish] 2. Media Preparation');
      let media = null;
      let images = null;

      // Handle custom uploaded media
      if (whichToPost === "media" && customMedia) {
        media = {
          filename: customMedia.filename,
          fileSize: customMedia.size,
          type: customMedia.type,
          base64: customMedia.base64,
        };
      } else if (whichToPost === "carousel") {
        // Check if pre-generation is in progress - wait for it
        if (isPreGeneratingRef.current) {
          if (!schedule) setLoadingMsg({ message: "Waiting for carousel preparation...", progress: 30 });
          // Wait for pre-generation to complete (poll every 200ms, max 30 seconds)
          let waitCount = 0;
          while (isPreGeneratingRef.current && waitCount < 150) {
            await new Promise(resolve => setTimeout(resolve, 200));
            waitCount++;
          }
        }

        // Use cached media if available
        if (mediaGeneratedRef.current) {
          media = generatedMediaRef.current;
        } else {
          // Pre-generation didn't complete or failed, generate now
          try {
            if (!schedule) setLoadingMsg({ message: "Generating carousel images...", progress: 20 });
            images = await generateImages();

            if (!schedule) setLoadingMsg({ message: "Converting to PDF...", progress: 50 });
            const filename = getCarouselFilename();
            const file = await exportCarouselToPDF(images, filename);

            if (!schedule) setLoadingMsg({ message: "Preparing for upload...", progress: 70 });
            media = {
              filename: file.name,
              fileSize: file.size,
              type: file.type,
              base64: await fileToBase64(file),
            };
            generatedMediaRef.current = media;
            mediaGeneratedRef.current = true;
          } catch (error) {
            console.error('Carousel generation error:', error);
            errorToaster("Failed to generate carousel media.");
            if (schedule) setIsScheduling(false); else setLoading(false);
            return;
          }
        }
      }
      console.timeEnd('[Publish] 2. Media Preparation');

      // 3. Send to API - include user_config and user_fonts for font persistence
      console.time('[Publish] 3. Payload & Validation');

      // Build user_fonts from carousel slides to persist font choices
      // carousel[0] = first/last slide fonts, carousel[1] = middle slide fonts
      const carousels = data?.carousels || [];
      const firstSlide = carousels[0];
      const secondSlide = carousels[1]; // Use slide 2 fonts for middle slides
      const userFonts = {
        carousel: [
          {
            title: firstSlide?.titleSetting || { fontSize: "36px", fontFamily: 'poppins', fontFamilyClass: "ql-font-poppins" },
            content: firstSlide?.contentSetting || { fontSize: "18px", fontFamily: 'inter', fontFamilyClass: "ql-font-inter" }
          },
          {
            title: secondSlide?.titleSetting || { fontSize: "36px", fontFamily: 'poppins', fontFamilyClass: "ql-font-poppins" },
            content: secondSlide?.contentSetting || { fontSize: "18px", fontFamily: 'inter', fontFamilyClass: "ql-font-inter" }
          },
        ]
      };

      let payload = {
        content,
        media,
        user_config: {
          theme: data?.theme?.background?.type,
          themeColors: {
            primary: data?.theme?.colors?.primary,
            secondary: data?.theme?.colors?.secondary,
            tertiary: data?.theme?.colors?.tertiary,
            background: data?.theme?.colors?.background,
          },
        },
        user_fonts: userFonts,
      };

      let endpoint = '/linkedin/publish';

      if (schedule) {
        if (!selectedDate || !selectedTime) {
          errorToaster("Please select a date and time.");
          setIsScheduling(false);
          return;
        }

        // Combine date and time
        const localDateTime = new Date(`${selectedDate}T${selectedTime}`);

        // Validate future time (client-side check)
        if (localDateTime <= new Date()) {
          errorToaster("Scheduled time must be in the future.");
          setIsScheduling(false);
          return;
        }

        // Part 1.2 + 1.2a: Validate scheduled date is not beyond plan expiry (+1 day grace)
        const planExpiryDate = new Date(subscriptData?.scheadule_date);
        // Add 1-day grace period: allow scheduling up to end of expiry day
        planExpiryDate.setDate(planExpiryDate.getDate() + 1);
        planExpiryDate.setHours(23, 59, 59, 999); // End of grace day

        if (localDateTime > planExpiryDate) {
          const displayExpiry = new Date(subscriptData?.scheadule_date);
          const formattedExpiry = displayExpiry.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          });
          errorToaster(`You cannot schedule a post after your plan expires (${formattedExpiry}).`);
          setIsScheduling(false);
          return;
        }

        // Convert to UTC ISO string
        const utcDateTime = localDateTime.toISOString();

        payload.scheduled_at = utcDateTime;
        endpoint = '/linkedin/schedule';
      }

      // Show sending message
      console.timeEnd('[Publish] 3. Payload & Validation');
      console.log('[Publish] Payload size:', JSON.stringify(payload).length, 'bytes');

      // STEP 1: Pre-validate (quick check for limits, plan expiry)
      console.time('[Publish] Pre-validate');
      if (!schedule) setLoadingMsg({ message: "Checking limits...", progress: 85 });

      try {
        const validatePayload = {
          type: schedule ? 'schedule' : 'publish',
          scheduled_at: schedule ? payload.scheduled_at : undefined,
        };
        const validateResponse = await post('/linkedin/pre-validate', validatePayload);
        console.timeEnd('[Publish] Pre-validate');

        if (!validateResponse?.success) {
          // Validation failed - show error on Publish page
          errorToaster(validateResponse?.message || "Validation failed");
          if (schedule) {
            setIsScheduling(false);
          } else {
            setLoading(false);
          }
          return;
        }
      } catch (validateError) {
        console.error('[Publish] Pre-validate error:', validateError);
        errorToaster(validateError?.response?.data?.message || "Failed to validate. Please try again.");
        if (schedule) {
          setIsScheduling(false);
        } else {
          setLoading(false);
        }
        return;
      }

      // STEP 2: Validation passed - start background upload and navigate immediately
      const localToken = localStorage.getItem("superlioAccessToken");

      // Prepare post data for display in My Posts
      const postData = {
        content: content?.substring(0, 100) + (content?.length > 100 ? '...' : ''),
        type: whichToPost === 'carousel' ? 'carousel' : (whichToPost === 'media' ? 'media' : 'text'),
        mediaType: media?.type || null, // Actual MIME type (e.g., video/mp4, image/jpeg, application/pdf)
        scheduled_at: schedule ? payload.scheduled_at : null,
        isScheduled: schedule,
      };

      // Start background upload (fire-and-forget)
      console.time('[Publish] 4. Background Upload Started');
      startBackgroundUpload({
        endpoint,
        payload,
        token: localToken,
        postData,
      });
      console.timeEnd('[Publish] 4. Background Upload Started');
      console.timeEnd('[Publish] Total Duration');

      // Navigate immediately - user will see upload progress in My Posts
      if (schedule) {
        setIsScheduling(false);
      } else {
        setLoading(false);
      }

      successToaster(schedule ? "Scheduling post..." : "Uploading to LinkedIn...");
      setOpenPostScheduleCard(false);
      navigate("/my-post");

    } catch (error) {
      console.error("API Publish Error:", error);
      errorToaster(error?.message || "Failed to process post");
      if (schedule) {
        setIsScheduling(false);
      } else {
        setLoading(false);
        setLoadingMsg({ message: "Please wait", progress: 0 });
      }
    }
  };

  const handlePublish = async ({
    selectedDate,
    selectedTime,
    schedule = false,
  } = {}) => {

    try {
      setOpenPostScheduleCard(false);
      setLoading(true);
      setLoadingMsg({ message: "Please wait", progress: 0 });
      const localToken = localStorage.getItem("superlioAccessToken");
      const isExtensionActive = await checkExtensionInstalled(extensionId);
      if (!isExtensionActive) {
        // ######## check ##########
        errorToaster("Your Extension is not active!");
        console.log('Your Extension is not active!');
        // ######## check ##########
        setExtensionNotActive(true);
        setLoading(false);
        return;
      }

      const currentType = schedule ? "schedule" : "instant";
      let specificDate = new Date();
      let year = specificDate.getFullYear();
      let month = String(specificDate.getMonth() + 1).padStart(2, '0');
      let day = String(specificDate.getDate()).padStart(2, '0');
      let formattedDate = `${year}-${month}-${day}`;
      let scheduleData = {
        schedule_date: currentType === "schedule" ? selectedDate : formattedDate,
      };
      const res = await checkPublishPosts(scheduleData);
      if (!res?.today_post_limit) {
        // ######## check ##########
        errorToaster("You have reached our daily Limit of Posting.");
        console.log(res?.error);
        // ######## check ##########
        setLoading(false);
        return false;
      }

      setPublishType(currentType);
      showMessagesSequentially(setLoadingMsg, { skipToMessageNumber: 0 });
      setOpenPostScheduleCard(false);
      let media = null;
      let images = null;
      // Handle carousel media generation
      if (whichToPost === "carousel" && !mediaGeneratedRef.current) {
        try {
          images = await generateImages();
          const file = await exportCarouselToPDF(images, "MyLinkedInCarousel.pdf");
          media = {
            filename: file.name,
            fileSize: file.size,
            type: file.type,
            base64: await fileToBase64(file),
          };
          // Store generated media and mark as generated
          generatedMediaRef.current = media;
          mediaGeneratedRef.current = true;
        } catch (error) {
          console.log('Carousel generation error:', error);
          errorToaster("Failed to generate carousel media. Please try again.");
          setLoading(false);
          setLoadingMsg({ message: "Please wait", progress: 0 });
          return;
        }
      } else if (whichToPost === "carousel" && mediaGeneratedRef.current) {
        // Reuse previously generated media
        media = generatedMediaRef.current;
      }

      const commonPayload = {
        user_id: data?.settings?.id,
        topic: data?.topic,
        content: {
          post: data?.post?.text,
          carousel: whichToPost === "carousel" ? images : null,
        },
        postType: data?.whichToPost || "post",
        publishType: currentType,
        linkedin_postid: "",
        user_config: {
          theme: data?.theme?.background?.type,
          themeColors: {
            primary: data?.theme?.colors?.primary,
            secondary: data?.theme?.colors?.secondary,
            tertiary: data?.theme?.colors?.tertiary,
            background: data?.theme?.colors?.background,
          },
        },
        user_fonts: userFonts,
      };
      // show messages when upload and procced
      const showProcessed = () => {
        if (!processedShown) {
          successToaster("Your post is being processed.");
          setLoading(false);
          setLoadingMsg({ message: "Please wait...", progress: 0 });
          setProcessedShown(true);
          if (currentType === "schedule") {
            navigate("/schedule");
          } else {
            navigate("/content-generation");
          }
        }
      };

      // If not scheduling, set post payload and initiate LinkedIn action
      if (!schedule) {
        setPostPayload(commonPayload);
        try {
          const result = await publishPost(commonPayload, null);
          if (!result) {
            console.warn("Failed to generate post. Please try again.");
            return;
          }
          const postId = result?.data?.post_id ?? null;
          newPostIdRef.current = postId;
          // Set the timeout and store it in the ref
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          showMessagesSequentially(setLoadingMsg, 7);
          timeoutRef.current = setTimeout(() => {
            showProcessed(); // show after 15s if no response
            timeoutRef.current = null;
          }, 15000);
          chrome.runtime.sendMessage(
            extensionId,
            {
              action: "OPENLINKEDIN",
              content: data?.post?.text?.replace(/<br\s*\/?>/gi, "\n"),
              time: null,
              media,
              title: data?.topic,
              email: userEmail,
              post_id: postId,
              token: localToken,
              postType: currentType,
            },
            () => { }
          );
        } catch (error) {
          // ######## check ##########
          console.log('Publish Post :', error)
          errorToaster(error.message)
          // ######## check ##########
          setLoadingMsg({ message: "Please wait", progress: 0 });
          setLoading(false);
        }
      } else {
        const now = new Date();
        const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
        const isValidSchedule = () => {
          if (isNaN(selectedDateTime)) return false;
          const expiry = new Date(expriryDate);
          expiry.setHours(23, 59, 59, 999);
          const minTime = new Date(now);
          minTime.setMinutes(now.getMinutes() + 8);
          return selectedDateTime >= minTime && selectedDateTime <= expiry;
        };
        if (!isValidSchedule()) {
          errorToaster("Please select a time at least 10 minutes from now.");
          setLoading(false);
          setLoadingMsg({ message: "Please wait", progress: 0 });
          return;
        }
        setPostPayload({
          ...commonPayload,
          postDate: selectedDate,
          postTime: selectedTime,
        });
        const schedulPayload = {
          ...commonPayload,
          postDate: selectedDate,
          postTime: selectedTime,
        };
        setUploadedCarousel(media);
        try {
          const result = await publishPost(schedulPayload, "");
          if (!result) {
            console.warn("Failed to generate post. Please try again.");
            return;
          }
          const postId = result?.data?.post_id ?? null;
          newPostIdRef.current = postId;
          // Set the timeout and store it in the ref
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          showMessagesSequentially(setLoadingMsg, 7);
          timeoutRef.current = setTimeout(() => {
            showProcessed(); // show after 15s if no response
            timeoutRef.current = null;
          }, 15000);
          chrome.runtime.sendMessage(
            extensionId,
            {
              action: "OPENLINKEDIN",
              content: data?.post?.text?.replace(/<br\s*\/?>/gi, "\n"),
              time: selectedDateTime,
              media,
              title: data?.topic,
              email: userEmail,
              post_id: postId,
              token: localToken,
              postType: currentType,
            },
            () => { }
          );
        } catch (error) {
          // ######## check ##########
          console.log('Schedule Post :', error);
          errorToaster(error.message);
          // ######## check ##########
          setLoading(false);
          setLoadingMsg({ message: "Please wait", progress: 0 });
        }
      }
    } catch (error) {
      // ######## check ##########
      console.log('Handle publish :', error);
      // errorToaster(error.message);
      // ######## check ##########
      setLoading(false);
      setLoadingMsg({ message: "Please wait", progress: 0 });
    }
  };


  return (
    <div
      className="flex flex-col items-center justify-between w-[100%] h-auto min-h-[493px] bg-white rounded-lg shadow-custom mt-2 p-4 font-sans text-gray-800"
      style={{
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'translateY(-10px)' : 'translateY(0)',
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
      }}
    >
      {/* PostLoader removed - using inline button loaders instead */}
      <div
        className={`flex flex-col justify-center w-full max-w-[750px] bg-white rounded-lg mt-4 p-4 font-sans text-gray-800 ${extensionNotActive ? "" : "border-1 border-[#959595]"} `}
        style={{
          maxWidth: extensionNotActive ? "561px" : "",
          minHeight: extensionNotActive ? "230px" : "",
        }}
      >
        {!extensionNotActive ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <ImageComponent
                  src={data?.settings?.headshot}
                  fallbackSrc={profile}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-[15px] font-bold">
                      {data?.settings?.name}
                    </h4>
                    <ImageComponent
                      src={linkedInIcon}
                      alt="LinkedIn Icon"
                      className="w-5 h-5 rounded-lg shadow-md"
                    />
                  </div>

                  {/* <p className="text-[12px] text-gray-600">
                    {data?.settings?.handle}
                  </p> */}
                  <div className="flex items-center gap-1">
                    <p className="text-[12px] text-gray-600">Now • </p>
                    <ImageComponent
                      src={globeIcon}
                      alt="Public"
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div
              className={`mt-3 text-[15px] leading-relaxed whitespace-pre-wrap select-none`}
            >
              {whichToPost === "post" ? (
                <ShowMoreText
                  lines={6}
                  more="more"
                  less="Show less"
                  className="w-full"
                  anchorClass="show-more-less-clickable cursor-pointer"
                  onClick={(isExpanded) => {
                  }}
                  expanded={false}
                  truncatedEndingComponent={"... "}
                >
                  {/* <p>{data?.post?.text}</p> */}
                  <p
                    dangerouslySetInnerHTML={{
                      __html: data?.post?.text?.replace(/\n/g, "<br>"),
                    }}
                  />
                </ShowMoreText>
              ) : whichToPost === "media" && customMedia ? (
                <>
                  <div>
                    <ShowMoreText
                      lines={2}
                      more="more"
                      less="Show less"
                      className="w-full"
                      anchorClass="show-more-less-clickable cursor-pointer"
                      onClick={(isExpanded) => {
                      }}
                      expanded={false}
                      truncatedEndingComponent={"... "}
                    >
                      <p
                        dangerouslySetInnerHTML={{
                          __html: data?.post?.text?.replace(/\n/g, "<br>"),
                        }}
                      />
                    </ShowMoreText>
                  </div>
                  {/* Custom Media Preview */}
                  <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                    {customMedia.mediaType === "image" ? (
                      <img
                        src={customMedia.base64}
                        alt={customMedia.filename}
                        className="w-full max-h-[400px] object-contain bg-gray-50"
                      />
                    ) : customMedia.mediaType === "video" ? (
                      <video
                        src={customMedia.base64}
                        controls
                        className="w-full max-h-[400px] object-contain bg-gray-900"
                      />
                    ) : customMedia.mediaType === "document" ? (
                      <PdfPreview
                        base64={customMedia.base64}
                        filename={customMedia.filename}
                        maxHeight={400}
                      />
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <ShowMoreText
                      lines={2}
                      more="more"
                      less="Show less"
                      className="w-full"
                      anchorClass="show-more-less-clickable cursor-pointer"
                      onClick={(isExpanded) => {
                      }}
                      expanded={false}
                      truncatedEndingComponent={"... "}
                    >
                      {/* <p>{data?.post?.text}</p> */}
                      <p
                        dangerouslySetInnerHTML={{
                          __html: data?.post?.text?.replace(/\n/g, "<br>"),
                        }}
                      />
                    </ShowMoreText>
                  </div>
                  {carousels?.length > 0 && visibleCarousels?.length > 0 && (
                    <div className="container mx-auto flex justify-center">
                      <ImageCarousel images={visibleCarousels} />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Reactions */}
            <div>
              <div className=" py-2 flex justify-between items-center border-b-1 border-[#B9B9B9]">
                <div className=" py-2 flex items-center justify-between">
                  <div className="self-center flex items-center gap-1  relative w-8 h-4">
                    <ImageComponent
                      src={blueLikeIcon}
                      alt="Like"
                      className="w-[18px] h-[18px] absolute left-0 top-0"
                    //   style={{ clipPath: "inset(0 30% 0 0)" }}
                    />
                    <ImageComponent
                      src={redHeartIcon}
                      alt="Heart"
                      className="w-[18px] h-[18px] absolute left-3 top-0"
                    />
                  </div>
                  <p className="secondary-color text-[15px]">57</p>
                </div>
                <div className="flex gap-2">
                  <p className="secondary-color text-[15px]">76 comments</p>
                  <span className="text-[15px]">.</span>
                  <p className="secondary-color text-[15px]">8 reposts</p>
                </div>
              </div>
              {/* Actions */}
              <div className="mt-2 flex justify-around text-gray-600">
                <button
                  // onClick={handleLike}
                  className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded-md"
                >
                  <ImageComponent
                    src={likeIcon}
                    alt="Public"
                    className="w-4 h-4"
                  />
                  <span className="md:inline hidden">Like</span>
                </button>
                <button className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded-md">
                  <ImageComponent
                    src={commentIcon}
                    alt="Public"
                    className="w-4 h-4"
                  />
                  <span className="md:inline hidden">Comment</span>
                </button>
                <button className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded-md">
                  <ImageComponent
                    src={repostIcon}
                    alt="Public"
                    className="w-4 h-4"
                  />
                  <span className="md:inline hidden"> Repost</span>
                </button>
                <button className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded-md">
                  <ImageComponent
                    src={shareIcon}
                    alt="Public"
                    className="w-4 h-4"
                  />
                  <span className="md:inline hidden"> Send</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center flex justify-center items-center mt-4 relative">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm text-center relative border-1 border-[#959595]">
              {/* Cross Icon */}
              <AiOutlineClose
                onClick={() => setExtensionNotActive(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 cursor-pointer text-xl"
                title="Close"
              />

              <h2 className="text-lg font-semibold mb-4">Extension Not Active</h2>
              <p className="text-sm mb-6 text-red-500">
                Superlio.ai extension is not found or might be inactive.
              </p>

              <div
                className="w-fit sm:w-[283px] max-w-full justify-self-center flex flex-col items-center text-[#939393] px-[10px] py-[10px] text-[12px] font-bold transition duration-200 ease-in-out bg-[#f7f7f7] rounded-[20px] shadow-[3.2px_3.2px_8px_rgba(195,193,198,0.9),-3.2px_-3.2px_8px_#fff,4.8px_4.8px_8px_rgba(195,193,198,0.9),-3.2px_-3.2px_6.4px_#fff] hover:shadow-[inset_-2px_-2px_6px_rgba(255,255,255,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.4),inset_2px_2px_2px_rgba(255,255,255,0.05),inset_2px_2px_4px_rgba(0,0,0,0.1)] cursor-pointer"
                onClick={() => { setExtensionNotActive(false); window.open(extensionDownloadUrl) }}
              >
                <span className="hidden sm:block">Download our Extension with</span>
                <ImageComponent src={extensionImageUrl} className="w-[90px] h-auto" />
              </div>
            </div>
          </div>
        )}
      </div>
      {!extensionNotActive && (
        <div className="flex items-end justify-end w-full max-w-[750px] gap-4 mt-4">
          {isLinkedInConnected === null ? (
            // Loading state - show disabled buttons while checking LinkedIn status
            <>
              <Button
                type="custom"
                className={`p-3 my-1 rounded bg-gray-400 text-white font-bold transition min-w-[100px] cursor-wait`}
                disabled={true}
              >
                <span className="animate-pulse">Checking...</span>
              </Button>
            </>
          ) : isLinkedInConnected === false ? (
            <Button
              type="custom"
              onClick={handleConnectLinkedIn}
              className={`p-3 my-1 rounded bg-[#0A66C2] text-white font-bold hover:bg-[#004182] transition`}
            >
              Connect to LinkedIn
            </Button>
          ) : (
            <>
              <Button
                type="custom"
                onClick={() => handleApiPublish({ schedule: false })}
                className={`p-3 my-1 rounded bg-primary-color text-white font-bold hover:bg-[#8979FD] transition min-w-[130px] flex items-center justify-center gap-2`}
                disabled={isExpired || loading}
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? "Publishing..." : "Publish"}
              </Button>
              <Button
                type="custom"
                onClick={() => setOpenPostScheduleCard(true)}
                className={`p-3 my-1 rounded bg-primary-color text-white font-bold hover:bg-[#8979FD] transition min-w-[130px] flex items-center justify-center gap-2`}
                disabled={isExpired || isScheduling}
              >
                {isScheduling && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isScheduling ? "Scheduling..." : "Schedule"}
              </Button>
            </>
          )}
          {/* <Button
            type="custom"
            onClick={handlePublish}
            className={`p-3 my-1 rounded bg-primary-color text-white font-bold hover:bg-[#8979FD] transition`}
            disabled={isExpired}
          >
            Publish
          </Button>
          <Button
            type="custom"
            onClick={() => setOpenPostScheduleCard(true)}
            className={`p-3 my-1 rounded bg-primary-color text-white font-bold hover:bg-[#8979FD] transition`}
            disabled={isExpired}
          >
            Schedule
          </Button> */}

        </div>
      )}

      {openPostScheduleCard && (
        <Overlay onClose={() => setOpenPostScheduleCard(false)}>
          <ScheduleCard handlePublish={handleApiPublish} subscriptData={subscriptData} onClose={() => setOpenPostScheduleCard(false)} loading={isScheduling} />
        </Overlay>
      )}
    </div>
  );
};

export default Publish;
