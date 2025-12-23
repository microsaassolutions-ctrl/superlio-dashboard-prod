import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ImageComponent from "../commons/Image";
import { Button, Loading, RegenerationReason, UploadMediaModal } from "../commons";
import {
  editIcon,
  globeIcon,
  linkedInIcon,
  profile,
  saveIcon,
} from "../../assets/images";
import useMainStore from "../../store/useMainStore";
import { errorToaster } from "../../utils/toaster";
import { get } from "../../api/apiService";
import { blockClipboardActions, regenSuggestions } from "../../utils/helpers";

function PostGenerator({ errorMessage, setGenerating, generating }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isProceedHovered, setIsProceedHovered] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  // const [typedPost, setTypedPost] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(true);
  const [postStatusMessage, setPostStatusMessage] = useState(errorMessage);
  const [dotCount, setDotCount] = useState(1);

  const contentRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const dotIntervalRef = useRef(null);
  const lastFetchTimeRef = useRef(0);

  const { data, setData, regeneratePost, fetchPostData } = useMainStore();
  const isRequested = useMainStore((state) => state?.data?.requesting?.post);
  const isGeneratingPost = useMainStore((state) => state.data?.isGenerating);
  const isGeneratingCarousel = useMainStore((state) => state.data?.isGeneratingCarousel);
  const postText = useMainStore((state) => state.data?.post?.text);
  const hook = useMainStore((state) => state.data?.hook);
  const contentAndStyle = useMainStore((state) => state.data?.contentAndStyle);
  const [typedPost, setTypedPost] = useState(postText || "");

  const navigate = useNavigate();
  const { state } = useLocation();

  let buttonsDisabled =
    (isGeneratingPost && !postStatusMessage.toLowerCase().includes("failed")) ||
    !isTypingComplete ||
    generating ||
    loading;

  useEffect(() => {
    if (errorMessage && !postText) {
      setPostStatusMessage("Post generation failed");
    }
  }, [errorMessage, postText]);

  useEffect(() => {
    const blockCopyAction = blockClipboardActions(contentRef.current);
    return blockCopyAction;
  }, []);

  // Reset carousel generation state when user returns to PostGenerator
  // This allows users to re-select options even if previous carousel generation failed
  useEffect(() => {
    setData("isGeneratingCarousel", false);
    setData("requesting.carousel", false);
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(typingIntervalRef.current);
      clearInterval(dotIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isGeneratingPost) {
      setIsTypingComplete(false);
      setPostStatusMessage("Post is being generated");
      dotIntervalRef.current = setInterval(() => {
        setDotCount((prev) => (prev % 3) + 1);
      }, 500);
    } else {
      clearInterval(dotIntervalRef.current);
      setDotCount(1);
    }
  }, [isGeneratingPost]);

  const typePostCharacterByCharacter = async (text) => {
    setIsTypingComplete(false);
    setTypedPost("");

    let i = -1;

    clearInterval(typingIntervalRef.current);

    const maxDuration = 8000;
    const delay = Math.max(Math.floor(maxDuration / text.length), 1);
    const currentTextRef = { current: "" };

    typingIntervalRef.current = setInterval(() => {
      if (i < text.length) {
        currentTextRef.current += text.charAt(i);
        setTypedPost(currentTextRef.current);
        i++;
      } else {
        clearInterval(typingIntervalRef.current);
        setIsTypingComplete(true);
      }
    }, delay);
  };

  useEffect(() => {
    if (postText && isGeneratingPost) {
      setIsTypingComplete(false);
      setPostStatusMessage("");
      setData("isGenerating", false);
      setGenerating(false);
      typePostCharacterByCharacter(postText);
    } else if (postText && !buttonsDisabled) {
      setIsTypingComplete(true);
      setTypedPost(postText);
      buttonsDisabled = false;
    }
    if (isGeneratingPost) {
      setEditing(false);
    }
  }, [postText, isGeneratingPost]);

  useEffect(() => {
    const autoGeneratePost = async () => {
      const now = Date.now();
      if (now - lastFetchTimeRef.current < 1000) {
        console.log("Skipped: too soon");
        return;
      }

      if ((state?.autoGenerate && !data?.post?.text) || (state?.replace && !data?.post?.text)) {
        lastFetchTimeRef.current = now;
        if (isRequested) {
          console.log("Already Requested")
          return;
        }
        setIsTypingComplete(false);
        setPostStatusMessage("Post is being generated");
        setTypedPost("");

        const payload = {
          user_id: data?.settings?.id,
          topic: data?.topic,
          postType: "Post",
          linkedin_postid: "",
        };
        try {
          setData("requesting.post", true);

          // Pre-fetch LinkedIn status in parallel (for smooth Publish page load)
          get('/linkedin/status', { suppressErrors: true }).then(response => {
            const isConnected = response?.connected && !response?.expired;
            setData("linkedInConnected", isConnected);
          }).catch(() => {
            // Silently fail - will be checked again on Publish page if needed
          });

          const result = await fetchPostData(payload);
          navigate(".", {
            state: { ...state, autoGenerate: false, replace: true },
            replace: true,
          });
          if (!result) {
            errorToaster("Failed to generate post. Click on generate button.");
            setPostStatusMessage("Post generation failed");
            return;
          }

          setPostStatusMessage("");
          // typePostCharacterByCharacter(result.post);
        } catch (error) {
          console.error(error.message);
          navigate(".", {
            state: { ...state, autoGenerate: false, replace: true },
            replace: true,
          });
          errorToaster("Failed to generate post. Click on generate button.");
          setPostStatusMessage("Post generation failed");
        }
      }
      else if (!state?.autoGenerate && !state?.replace && !data?.isGenerating && !data?.post?.text) {
        navigate("/content-generation");
      }
    };
    autoGeneratePost();
  }, [state?.autoGenerate, postText]);

  const handleEditToggle = () => {
    if (buttonsDisabled) return;

    if (editing && !contentRef.current.innerText.trim()) {
      return errorToaster("Post text cannot be empty");
    }

    if (editing) {
      const html = contentRef.current.innerHTML;
      const textWithLineBreaks = html
        .replace(/<div><br><\/div>/g, '\n')
        .replace(/<div>/g, '\n')
        .replace(/<\/div>/g, '')
        .replace(/<br>/g, '\n');

      if (!textWithLineBreaks.trim()) {
        return errorToaster("Post text cannot be empty");
      }

      setData("post", {
        ...data.post,
        text: textWithLineBreaks.trim(),
      });
    }

    setEditing(!editing);
  };

  const handleProceedClick = async (value) => {
    if (buttonsDisabled) return;

    if (editing && !contentRef.current.innerText.trim()) {
      return errorToaster("Post text cannot be empty");
    }

    if (editing) handleEditToggle();

    setData("whichToPost", "post");
    setData("activeTab", value);
    setLoading(false);
    return;
  };

  const regenerateHandle = async (reason) => {
    if (buttonsDisabled) return;
    if (!data?.topic?.trim()) {
      errorToaster("The Topic Field  cannot be empty.");
      return;
    }

    setPostStatusMessage("Post is being generated");
    setTypedPost("");
    setGenerating(true);
    setIsHovered(false);
    setData("isPostUpdating", true);
    try {
      const payload = {
        user_id: data?.settings?.id,
        topic: data.topic,
        content: data?.post?.text,
        reason,
        postType: "Post",
        linkedin_postid: "",
        hook: hook,
        contentAndStyle: contentAndStyle
      };

      dotIntervalRef.current = setInterval(() => {
        setDotCount((prev) => (prev % 3) + 1);
      }, 500);
      const result = await regeneratePost(payload);
      clearInterval(dotIntervalRef.current);
      setDotCount(1);

      if (!result) {
        errorToaster("Failed to generate post. Please try again.");
        setPostStatusMessage("Post generation failed");
        return;
      }

      setPostStatusMessage("");
      typePostCharacterByCharacter(result?.post || "");
    } catch (error) {
      console.error(error.message);
      errorToaster("Failed to generate post. Please try again.");
      setPostStatusMessage("Post generation failed");
    } finally {
      setLoading(false);
      setGenerating(false);
      setData("isPostUpdating", false);
    }
  };

  const checkCharactorLimit = (text) => {
    if (text?.length > 3000) {
      errorToaster("Character limit exceeded! Maximum allowed is 3000. Please Regenrate");
      return;
    }
  }

  return (
    <div className="flex flex-col justify-between w-full h-auto min-h-[493px] bg-white rounded-lg shadow-custom mt-2 p-4 font-sans text-gray-800">
      {loading && <Loading />}

      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <ImageComponent
              src={data?.settings?.headshot}
              fallbackSrc={profile}
              alt="Profile"
              className="w-[50px] h-[50px] rounded-full"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-[15px] font-bold">
                  {data?.settings?.name}
                </h4>
                <ImageComponent
                  src={linkedInIcon}
                  alt="LinkedIn"
                  className="w-[20px] h-[20px]"
                />
              </div>
              {/* <p className="w-full h-[18px] overflow-y-hidden text-[12px] text-gray-600">
                {data?.settings?.handle}
              </p> */}
              <div className="flex items-center gap-2 text-[12px] text-gray-600">
                <span>Now .</span>
                <ImageComponent
                  src={globeIcon}
                  alt="Globe"
                  className="w-[16px] h-[16px]"
                />
              </div>
            </div>
          </div>

          <ImageComponent
            onClick={handleEditToggle}
            src={editing ? saveIcon : editIcon}
            alt="Edit"
            title={editing ? "Save" : "Edit"}
            className={`w-[18px] cursor-pointer ${buttonsDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={buttonsDisabled}
          />
        </div>

        <div
          ref={contentRef}
          contentEditable={editing}
          suppressContentEditableWarning
          style={{ minHeight: editing ? "300px" : undefined }}
          className={`mt-3 mb-5 text-lg select-none leading-relaxed whitespace-pre-wrap ${editing ? "border-2 border-blue-500 focus:outline-none" : ""
            }`}
        >
          {postStatusMessage ? (
            <div
              className={`${postStatusMessage.toLowerCase().includes("failed")
                ? "text-red-600 font-semibold"
                : ""
                }`}
            >
              {`${postStatusMessage}${" . ".repeat(dotCount)}`}
            </div>
          ) : (
            typedPost
          )}
        </div>
      </div>

      <div className="flex justify-between items-end gap-2 pb-2 flex-wrap">
        <div className="text-sm">{typedPost && `Character count: ${typedPost?.length}`}</div>
        <div className="flex gap-2 pb-2 flex-wrap">
          {!editing && (
            <div
              className="relative inline-block"
              onMouseEnter={() => !buttonsDisabled && setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Button
                type="custom"
                onClick={() => { }}
                className={`p-3 my-1 rounded bg-primary-color text-white font-bold ${buttonsDisabled ? "opacity-50 cursor-not-allowed" : ""
                  } hover:bg-[#8979FD] transition`}
                disabled={buttonsDisabled}
              >
                Regenerate
              </Button>
              {isHovered && !buttonsDisabled && (
                <RegenerationReason
                  type={0}
                  reasons={regenSuggestions}
                  onClick={regenerateHandle}
                  className="left-[-15px] w-max bottom-[45px]"
                />
              )}
            </div>
          )}
          {typedPost?.length > 3000 ? (
            <Button
              type="custom"
              onClick={() => checkCharactorLimit(typedPost)}
              className={`p-3 my-1 rounded bg-primary-color text-white font-bold ${buttonsDisabled ? "opacity-50 cursor-not-allowed" : ""
                } hover:bg-[#8979FD] transition`}
            >
              Proceed
            </Button>
          ) : (
            <div
              className="relative inline-block"
              onMouseEnter={() => !buttonsDisabled && setIsProceedHovered(true)}
              onMouseLeave={() => setIsProceedHovered(false)}
            >
              <Button
                type="custom"
                onClick={() => { }}
                className={`p-3 my-1 rounded bg-primary-color text-white font-bold ${buttonsDisabled ? "opacity-50 cursor-not-allowed" : ""
                  } hover:bg-[#8979FD] transition`}
                disabled={buttonsDisabled || isGeneratingCarousel}
              >
                Proceed
              </Button>
              {isProceedHovered && !buttonsDisabled && (
                <div className="absolute z-50 bottom-[50px] right-0 mt-2 px-3 py-3 w-[200px] bg-white text-gray-800 text-sm rounded-md shadow-[0px_0px_10px_rgba(0,0,0,0.3)]">
                  <p
                    className="font-semibold text-[14px] py-2 px-2 cursor-pointer rounded-md hover:bg-gray-100 transition"
                    onClick={() => {
                      setIsProceedHovered(false);
                      handleProceedClick("carousel");
                    }}
                  >
                    🎠 Generate Carousel
                  </p>
                  <p
                    className="font-semibold text-[14px] py-2 px-2 cursor-pointer rounded-md hover:bg-gray-100 transition"
                    onClick={() => {
                      setIsProceedHovered(false);
                      setShowUploadModal(true);
                    }}
                  >
                    📤 Upload Media
                  </p>
                  <p
                    className="font-semibold text-[14px] py-2 px-2 cursor-pointer rounded-md hover:bg-gray-100 transition text-gray-500"
                    onClick={() => {
                      setIsProceedHovered(false);
                      // Clear any previously uploaded media
                      setData("customMedia", null);
                      // Set to post (text-only) and go directly to publish
                      setData("whichToPost", "post");
                      setData("activeTab", "publish");
                    }}
                  >
                    ⏭️ Skip (Text Only)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Media Modal */}
      {showUploadModal && (
        <UploadMediaModal
          onClose={() => setShowUploadModal(false)}
          onProceed={(fileData) => {
            // Store the uploaded media in global state
            setData("customMedia", fileData);
            // Set whichToPost to 'media' to indicate custom media upload
            setData("whichToPost", "media");
            // Navigate to publish
            setData("activeTab", "publish");
            // Close the modal
            setShowUploadModal(false);
          }}
        />
      )}
    </div>
  );
}

export default React.memo(PostGenerator);
