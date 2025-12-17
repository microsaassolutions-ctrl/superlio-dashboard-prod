import React, { useEffect, useCallback, useMemo, useState } from "react";
import { Carousel, PostGenerator, Publish } from "../../components/main";
import { Input, Button, Loading } from "../../components/commons";
import { useNavigate } from "react-router-dom";
import { generateIcon } from "../../assets/images";
import useMainStore from "../../store/useMainStore";
import { errorToaster } from "../../utils/toaster";
import ContentGeneration from "../../components/main/ContentGeneration";

function Main() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [postErrorMessage, setPostErrorMessage] = useState("");

  const navigate = useNavigate();

  const summary = useMainStore((state) => state.data.summary);
  const isGenerating = useMainStore((state) => state.data.isGenerating);
  const carousels = useMainStore((state) => state.data.carousels);
  const whichToPost = useMainStore((state) => state.data.whichToPost);
  const isPostUpdating = useMainStore((state) => state.data.isPostUpdating);
  const isGeneratingCarousel = useMainStore((state) => state.data.isGeneratingCarousel);
  const isCarouselUpdating = useMainStore((state) => state.data.isCarouselUpdating);
  const [generating, setGenerating] = useState(isGenerating);
  const { data, setData, setTopicText, getAnswers, addValidTransition, getSubscription } = useMainStore();

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await getAnswers();
        if (response && response.length > 0) {
          console.log("answered the questions");
        } else {
          navigate("/content-personalization", { state: { redirected: true } });
        }
      } catch (error) {
        console.error("Error fetching answers:", error);
        navigate("/content-personalization", { state: { redirected: true } });
      } finally {
        setLoading(false);
      }
    };
    fetchAnswers();
  }, [navigate]);

  // *******************
    const [subscriptData, setSubscriptionData] = useState({});
    useEffect(() => {
      const fetchSubscription = async () => {
        const res =  await getSubscription();
        setSubscriptionData(res);
      }
      fetchSubscription();
    }, []);
  // *******************

  useEffect(() => {
    setTopic(data?.topic);
    if (data.activeTab === "publish") {
      setData("activeTab", "post");
      setData("isGeneratingCarousel", false);
      setData("isCarouselUpdating", false);
      setData("isPostUpdating", false);
      // setData("isGenerating", false);
      setData("isAnimationNeeded", false);
    }
    if (!data?.topic) {
      navigate("/content-generation");
    }

  }, []);

  useEffect(() => {
    if (isGenerating) {
      setData("activeTab", "post");
    } else {
      setGenerating(false);
    }
  }, [isGenerating]);


  const handleTabChange = useCallback((view) => {
    if (!data.validTransitions.includes(view)) return;

    const scrollAndActivate = () => {
      window.scrollTo(0, 0);
      setData("activeTab", view);
      addValidTransition(view);
    };

    if (view === "publish" && whichToPost === "carousel" && (!isGeneratingCarousel || !isCarouselUpdating)) {
      const hasValidSlides =
        Array.isArray(carousels) &&
        carousels.length >= 2 &&
        carousels.every(item => typeof item === "object" && item !== null) &&
        carousels.some(item => item.invisible === false);

      if (!hasValidSlides) {
        return errorToaster("At least one Slide must be visible for you to Publish with Carousel");
      }
    } else if (view === "publish" && isGeneratingCarousel || isCarouselUpdating) {
      setData("whichToPost", "post")
    }

    scrollAndActivate();
  }, [data.validTransitions, setData, whichToPost, carousels, isGeneratingCarousel, isCarouselUpdating]);

  const handleInputChange = useCallback((e) => {
    setTopic(e.target.value);
  }, []);

  const handleButtonClick = () => {
    handleGenerate();
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      errorToaster("The Topic Field  cannot be empty.");
      return;
    }
    setData("post.text", "");
    // setTimeout(() => setData("post.text", ""), 0);
    setData("isGenerating", true);
    setTopicText(topic);
    setPostErrorMessage("");
  };

  const activeComponent = useMemo(() => {
    switch (data.activeTab) {
      case "carousel":
        addValidTransition(data.activeTab)
        return <Carousel />;
      case "publish":
        addValidTransition(data.activeTab);
        return <Publish subscriptData={subscriptData} />;
      case "content":
        addValidTransition(data.activeTab);
        return <ContentGeneration topic={topic} handleInputChange={handleInputChange} handleButtonClick={handleButtonClick} generating={generating} />
      default:
        addValidTransition(data.activeTab)
        return (
          <PostGenerator
            errorMessage={postErrorMessage}
            setGenerating={setGenerating}
            generating={generating}
          />
        );
    }
  }, [data.activeTab, postErrorMessage, generating, topic]);
  //  bg-[#D9D9D9]
  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-80px)] sm:max-h-auto py-5 text-white my-auto">
      {loading && <Loading />}
      {/* <div className="container mx-auto w-full flex flex-col items-center mb-5">
        <div className="flex items-center justify-center w-[300px] sm:w-[400px] md:w-[600px] lg:w-[800px] bg-white border-2 sm:border-4 border-[#614bfb] rounded-lg overflow-hidden">
          <Input
            value={topic || ""}
            onChange={handleInputChange}
            placeholder="Enter Your Topic Here"
            className="flex-1 p-3 text-lg outline-none box-border flex-grow min-w-[100px] w-[100%] sm:min-w-[255px] md:min-w-[435px] lg:min-w-[634px]"
            style={{ border: "none" }}
          />
          <Button
            type="custom"
            icon={generateIcon}
            iconPosition="left"
            onClick={handleButtonClick}
            className="bg-primary-color text-white p-3 max-w-fit mr-1 sm:max-w-[140px] md:max-w-[150px] text-lg flex items-center gap-2 hover:bg-[#8979FD] transition"
            disabled={generating || isGenerating || isGeneratingCarousel}
          >
            {generating || isGenerating ? "Generating" : "Generate"}
          </Button>
        </div>
      </div> */}

      <div className="flex items-center flex-col sm:flex-row my-5 w-[320px] sm:w-[450px] md:w-[700px] lg:w-[850px] box-border rounded-lg overflow-hidden shadow-custom">
        {["Content", "Post", "Carousel", "Publish"].map((view) => {
          const formattedView = view.toLowerCase();
          const isDisabled = !data.validTransitions.includes(formattedView) || generating || isGenerating || isPostUpdating;
          // || isGeneratingCarousel || isCarouselUpdating
          const label =
            formattedView === "content"
              ? "Content Ideation"
              : formattedView === "publish"
                ? "Publish"
                : `${view} Generator`;
          return (
            <Button
              key={formattedView}
              type="custom"
              disabled={isDisabled}
              onClick={() => handleTabChange(formattedView)}
              className={`flex-1 p-3 text-lg font-bold transition duration-100 min-[0px]:min-w-full sm:min-w-0 ${data.activeTab === formattedView
                ? "bg-primary-color text-white rounded-lg hover:bg-[#8979FD] transition"
                : "bg-white text-[#797B96] rounded-none "
                } ${isDisabled ? "opacity-50 cursor-not-allowed" : data.activeTab !== formattedView && "hover:text-black"}`}
            >
              {label}
            </Button>
          );
        })}
      </div>
      <div
        className={`mt-0 flex justify-center items-center ${data.activeTab === "carousel"
          ? "custom-930:w-320 custom-930:w-415 custom-930:w-850 mt-2" // This will apply 415px width below 930px and 850px width above 930px
          : ""
          } ${data.activeTab !== "carousel"
            ? "w-[320px] sm:w-[415px] md:w-[700px] lg:w-[850px]"
            : ""
          }`}
      >
        {activeComponent}
      </div>
    </div>
  );
}

export default React.memo(Main);
