import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Loading } from "../../components/commons";
import { generateIcon, refreshIcon, rollingIcon } from "../../assets/images";
import { errorToaster } from "../../utils/toaster";
import useMainStore from "../../store/useMainStore";
import { setDate } from "date-fns";
import { storeAllSVGs, storeThemeConfig } from "../../utils/svgHelperIndexDB";
const RollingIcon = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    ></path>
  </svg>
);

function ContentCreate() {
  const [topic, setTopic] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const { setData, resetStore, getAnswers, getSuggestions,fetchThemeBg } = useMainStore();
  const themeStore = useMainStore((state) => state?.data?.theme); 
  const savedSuggestions = useMainStore((state) => state.data.suggestions);
  const navigate = useNavigate();

  const getDummySuggestions = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return Array.from({ length: 15 }, () => `Suggestion ${Math.random().toFixed(2)}`);
  };

  const fetchSuggestions = useCallback(async () => {
    try {
      setRefreshing(true);
      setInitialLoad(true);
      const suggestions = await getSuggestions();
      if (suggestions.length > 0) {
        setSuggestions(suggestions);
        setRefreshing(false);
        setInitialLoad(false);
      } else {
        throw new Error("api request failed");
      }

    } catch (error) {
      if (suggestions.length <= 0) {
        setRefreshing(false);
        setInitialLoad(true);
      } else {
        setRefreshing(false);
        setInitialLoad(false);
      }
    }
  }, [suggestions]);

  useEffect(() => {
    const fetchAnswers = async () => {
      // setLoading(true);
      try {
        const response = await getAnswers();
        if (response && response.length > 0 && response[0].niche.trim()) {
          if (savedSuggestions.length > 0) {
            setSuggestions(savedSuggestions);
            setInitialLoad(false);
            return;
          } else {
            fetchSuggestions().finally(() => { });
          }
        } else {
          navigate("/content-personalization", { state: { redirected: true } });
        }
      } catch (error) {
        console.error("Error fetching answers:", error);
        navigate("/content-personalization", { state: { redirected: true } });
      } finally {
        setLoading(false);
        // if (!data?.post?.text) {
        //   navigate("/content-generation");
        // }
      }
    };
    fetchAnswers();
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      errorToaster("The Topic Field  cannot be empty.");
      return;
    }

    await resetStore();
    setData("topic", topic);
    setData("post.text", "");
    setData("isGenerating", true);

    navigate("/main", {
      state: {
        topic,
        autoGenerate: true,
      },
    });
  };

useEffect(() => {
  const handleStore = async () => {
    const themeBg = await fetchThemeBg();
    if (themeBg?.length > 0) {
      const allSVGs = await storeAllSVGs({ themes: themeBg });
      console.log(allSVGs, '--allSVGs--');
      const themeConfig = await storeThemeConfig({ theme: themeBg });
      console.log(themeConfig, '--themeConfig--');

      // Only set theme if store is empty
      const isStoreEmpty =
        !themeStore?.colors?.primary &&
        !themeStore?.colors?.secondary &&
        !themeStore?.colors?.tertiary &&
        !themeStore?.colors?.background

      if (isStoreEmpty) {
        const firstThemeConfig = themeBg?.[0];
        const theme = {
          colors: {
            primary: firstThemeConfig?.primary,
            secondary: firstThemeConfig?.secondary,
            tertiary: firstThemeConfig?.tertiary,
            background: firstThemeConfig?.background,
          },
          background: {
            type: firstThemeConfig?.name,
            active: true,
          },
        };
        const themeState = {colors: theme.colors, background: theme.background}
        setData("theme", themeState);
      }
    }
  };
  handleStore();
}, []);

  const shimmerRows = (
    <div className="flex flex-wrap gap-[5px] w-full max-w-[1080px]">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="flex justify-center items-center w-[140px] sm:w-[160px] md:w-[142px] lg:w-[170px] h-[40px] bg-gray-300 rounded-md animate-pulse"
        >
          {i === 0 ? 'Generating Topic...' : ''}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      {loading && <Loading />}

      {/* Input + Generate */}
      <div className="flex items-center border-2 sm:border-4 border-[#614bfb] rounded-lg overflow-hidden">
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter Your Topic Here"
          className="p-3 sm:min-w-[350px] md:min-w-[435px] lg:min-w-[600px] w-[200px] sm:w-[400px] md:w-[600px] lg:w-[800px] text-lg outline-none border-none"
        />
        <Button
          type="custom"
          icon={generateIcon}
          iconPosition="left"
          onClick={handleGenerate}
          disabled={loading}
          className={`bg-primary-color text-white p-3 mr-1 max-w-[150px] text-lg flex items-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-color"
            } hover:bg-[#8979FD] transition`}
        >
          {loading ? "Generating" : "Generate"}
        </Button>
      </div>

      {/* Suggestions + Refresh */}
      <h1 className="sm:min-w-[350px] md:min-w-[435px] lg:min-w-[600px] w-[350px] sm:w-[550px] md:w-[650px] lg:w-[930px] mt-6 max-w-[1080px] mx-auto self-start font-bold">Suggested Topics</h1>
      <div className="flex justify-center items-start gap-4 sm:min-w-[350px] md:min-w-[435px] lg:min-w-[600px] w-[350px] sm:w-[550px] md:w-[650px] lg:w-[930px] mt-2 max-w-[1080px]">
        {/* Suggestions */}
        <div className="flex flex-col gap-4">
          {initialLoad && shimmerRows}
          {!initialLoad && (
            <div
              className={`flex flex-col gap-2 transition-opacity duration-300 ${refreshing ? "opacity-50 pointer-events-none" : "opacity-100"
                }`}
            >
              <div
                className={`flex flex-wrap gap-[5px] transition-opacity duration-300 ${refreshing ? "opacity-50 pointer-events-none" : "opacity-100"
                  }`}
              >
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    type="custom"
                    title={suggestion}
                    onClick={() => setTopic(suggestion)}
                    className="w-[140px] sm:w-[160px] md:w-[142px] lg:w-[170px] bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400 text-ellipsis whitespace-nowrap overflow-hidden"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="self-start">
          <Button
            type="custom"
            icon={
              <img
                src={refreshIcon}
                alt="Refreshing..."
                className={refreshing ? "w-5 h-5 animate-spin" : "w-5 h-5"}
              />
            }
            iconPosition="left"
            hideIcon={false}
            onClick={fetchSuggestions}
            className="w-10 p-[10px] bg-primary-color rounded-md hover:bg-[#8979FD] transition"
            style={{ padding: "10px" }}
            disabled={refreshing}
          />
        </div>
      </div>
    </div>
  );
}

export default ContentCreate;
