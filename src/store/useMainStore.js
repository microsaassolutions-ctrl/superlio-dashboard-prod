import { create } from "zustand";
import { persist } from "zustand/middleware";
import { produce } from "immer";
import { errorToaster, successToaster } from "../utils/toaster";
import { initialState, carouselConfig } from "./storeConfig";
import { deleteReq, get, post } from "../api/apiService";
import { redirectionUrl } from "../utils/config";
let lastPostFetchTime = 0;
const useMainStore = create(
  persist(
    (set, getter) => ({
      data: initialState,
      showLoginRedirectBox: false,
      setShowLoginRedirectBox: (value) => set({ showLoginRedirectBox: value }),

      /**
       * ✅ Update nested state using Immer
       */
      setData: (path, value) =>
        set(
          produce((state) => {
            const keys = path.split(".");
            let nestedObject = state.data;
            keys.slice(0, -1).forEach((key) => {
              if (!nestedObject[key]) nestedObject[key] = {};
              nestedObject = nestedObject[key];
            });
            nestedObject[keys[keys.length - 1]] = value;
          })
        ),

      /**
       * ✅ Update setting state 
       */
      setSettings: (newSettings) =>
        set(
          produce((state) => {
            state.data.settings = { ...state.data.settings, ...newSettings };
          })
        ),

      resetStoreFull: () => {
        set(
          produce((state) => {
            // Reset everything except the `settings` properties you want to keep
            state.data = {
              ...initialState,
              settings: {
                ...initialState.settings,
                id: state.data.settings.id,
                name: state.data.settings.name,
                email: state.data.settings.email,
                headshot: state.data.settings.headshot,
              },
              theme: state.data.theme
            };
          })
        )
      },
      /**
       * ✅ Reset store to initial state
       */
      resetStore: () =>
        set(
          produce((state) => {
            // Reset everything except the `settings` properties you want to keep
            state.data = {
              ...initialState,
              settings: {
                ...initialState.settings,
                id: state.data.settings.id,
                name: state.data.settings.name,
                email: state.data.settings.email,
                headshot: state.data.settings.headshot,
                niche: state.data.settings.niche,
                handle: state.data.settings.handle,
                requireBranding: state.data.settings.requireBranding
              },
              summary: state.data.summary,
              suggestions: state.data.suggestions,
              theme: state.data.theme,
            };
          })
        ),

      /**
      * ✅ Add valid transition post, carousel, publish
      */
      addValidTransition: (tab) => {
        set((state) => {
          if (!state.data.validTransitions.includes(tab)) {
            return {
              data: {
                ...state.data,
                validTransitions: [...state.data.validTransitions, tab],
              },
            };
          }
          return state;
        });
      },

      /**
       * ✅ Add a new slide
       */
      addSlide: async () => {
        const { isCarouselUpdating } = getter().data;
        if (isCarouselUpdating) return;

        set(
          produce((state) => {
            state.data.isCarouselUpdating = true;
          }))

        try {
          set(
            produce((state) => {
              const { carousels } = getter().data;

              if (carousels.length >= 10) {
                errorToaster("Only 10 slides can be added");
                return;
              }

              if (!Array.isArray(carousels)) {
                throw new Error("Invalid input: 'carousels' must be an array.");
              }

              const highestId = carousels.reduce(
                (max, slide) => (slide.id > max ? slide.id : max),
                0
              );

              const newSlide = {
                ...carouselConfig,
                id: highestId,
                title: `GROW YOUR LINKEDIN ${highestId}`,
                text: "NEW SLIDE",
              };

              const totalSlides = carousels.length;
              const secondLastIndex = totalSlides > 1 ? totalSlides - 1 : 1;

              const updatedCarousels = [
                ...carousels.slice(0, secondLastIndex),
                newSlide,
                { ...carousels[totalSlides - 1], id: highestId + 1 },
              ];

              state.data.carousels = updatedCarousels;
              state.data.activeSlideId = newSlide.id;
            })
          );
        } finally {
          set(
            produce((state) => {
              state.data.isCarouselUpdating = false;
            }))
        }
      },

      /**
       * ✅ Remove a slide by ID
       */
      removeSlide: async (id) => {
        const state = getter();

        if (state.isCarouselUpdating) return;

        set(
          produce((state) => {
            state.data.isCarouselUpdating = true;
          }))

        try {
          set(
            produce((state) => {
              const { carousels } = getter().data;

              if (carousels.length <= 2) {
                alert("At least two carousels are needed!");
                return;
              }

              const indexToRemove = carousels.findIndex((item) => item.id === id);
              const nextSlide = carousels[indexToRemove + 1] || null;
              const prevSlide = carousels[indexToRemove - 1] || null;

              if (indexToRemove === -1) {
                console.warn(`Slide with id ${id} not found.`);
                return;
              }

              const leftSlides = carousels.length - (indexToRemove + 1);
              let activeSlide = carousels[0]?.id || 1;

              if (leftSlides > 1) {
                activeSlide = nextSlide.id;
              } else if (leftSlides === 1) {
                activeSlide = prevSlide.id;
              }

              state.data.carousels = carousels.filter((item) => item.id !== id);
              state.data.activeSlideId =
                state.data.carousels.length > 0 ? activeSlide : null;

            })
          );
        } catch (error) {
          console.error("Error removing slide:", error);
        } finally {
          set(
            produce((state) => {
              state.data.isCarouselUpdating = false;
            }))
        }
      },

      /**
       * ✅ Set active slide by ID
       */
      setActiveSlide: (id) =>
        set(
          produce((state) => {
            state.data.activeSlideId = id;
          })
        ),
      setTopicText: (topic) =>
        set(
          produce((state) => {
            state.data.topic = topic;
          })
        ),
      /**
       * ✅ Fetch LinkedIn post data
       */
      fetchPostData: async (data, showSuccessMessage = false) => {
        const now = Date.now();
        if (now - lastPostFetchTime < 3000) {
          console.warn("fetchPostData call ignored: throttled");
          return null;
        }

        lastPostFetchTime = now;
        try {
          const settings = await getter().data.settings;
          const summary = await getter().data.summary;
          const persona = await getter().data.persona;
          const offerings = await getter().data.offerings;
          const user_id = settings?.id || 1;
          const {
            topic,
            postType,
            linkedin_postid,
          } = data;
          const now = new Date();
          const formattedDate = now.toISOString().split("T")[0];
          const formattedTime = now.toTimeString().split(" ")[0];

          set(
            produce((state) => {
              state.data.post.text = "";
              state.data.validTransitions = ["content", "post"];
            })
          );

          const requestData = {
            user_id,
            topic,
            content: {
              summary: summary,
              persona: persona,
              offerings: offerings,
            },
            post_date: formattedDate,
            post_time: formattedTime,
            post_type: postType,
            linkedin_postid,
          };

          const response = await post(
            "/content/generate-linkedinPost",
            requestData
          );

          // await new Promise((r) => setTimeout(r, 5000));
          // const response = {
          //   success: true,
          //   message: "LinkedIn post generated successfully",
          //   data: {
          //     post:
          //       "Networking is not just about exchanging contacts; about building relationships. \nTake time to connect genuinely, share value, and grow together. \nThe right connections can open doors you never imagined! 🚀",
          //   }
          // };

          if (response?.success) {
            if (showSuccessMessage) successToaster(response?.message);
            const userConfig = response?.data?.userConfig ? JSON.parse(response?.data?.userConfig) : null;
            set(
              produce((state) => {
                state.data.post.text = response?.data?.post;
                state.data.carousels = [];
                state.data.validTransitions = ["content", "post"];
                state.data.activeTab = "post";
                state.data.topic = data.topic;
                state.data.isUpdated = Math.random();
                state.data.settings.threadId = response?.data?.threadId;
                // state.data.settings.handle = "My Handle";
                state.data.regenOptions.post = response?.data?.regenOptions;
                state.data.regenOptions.hook = response?.data?.hook;
                state.data.regenOptions.contentAndStyle = response?.data?.contentAndStyle;
                // state.data.isGenerating = false;
              })
            );
            return response.data;
          }
          set(
            produce((state) => {
              state.data.isGenerating = false;
            })
          );
          return null;
        } catch (error) {
          set(
            produce((state) => {
              state.data.isGenerating = false;
            })
          );
          console.error("Error fetching post:", error);
          return null;
        } finally {
          set(
            produce((state) => {
              state.data.requesting.post = false;
            })
          );
        }
      },

      /**
       * ✅ Regenerate a post
       */
      regeneratePost: async (data) => {
        try {
          const settings = await getter().data.settings;
          const regenOpt = await getter().data.regenOptions;
          const user_id = settings?.id || 1;
          const thread_id = settings?.threadId || "";
          const { topic, content, postType, reason } = data;
          const now = new Date();
          const formattedDate = now.toISOString().split("T")[0];
          const formattedTime = now.toTimeString().split(" ")[0];

          // set(
          //   produce((state) => {
          //     state.data.post.text = "";
          //   })
          // );

          const requestData = {
            user_id,
            topic,
            reason,
            thread_id,
            post_date: formattedDate,
            post_time: formattedTime,
            post_type: postType,
            hook: regenOpt.hook,
            content_and_style: regenOpt.contentAndStyle
          };
          const response = await post(
            "/content/re-generate-linkedinPost",
            requestData
          );

          // await new Promise((r) => setTimeout(r, 5000));
          // const response = {
          //   success: true,
          //   message: "LinkedIn post generated successfully",
          //   post: "Success isn't about luck—it's about consistency and learning from failures. \nEvery setback is an opportunity to grow and improve. \nStay focused, stay persistent, and great things will follow! 💪 #Motivation #Success",
          // };

          if (response?.success) {
            // successToaster(response?.message);
            set(
              produce((state) => {
                state.data.post.text = response?.data?.post;
                state.data.activeTab = "post";
                state.data.topic = data.topic;
                state.data.settings.threadId = response?.data?.threadId;
                state.data.regenOptions.hook = response?.data?.hook;
                state.data.regenOptions.contentAndStyle = response?.data?.contentAndStyle;
              })
            );
            return response?.data;
          }
          return null;
        } catch (error) {
          console.error("Error regenerating post:", error);
          return null;
        }
      },

      /**
       * ✅ Publish a post
       */
      publishPost: async (data, shareUrn = "") => {
        try {
          const settings = await getter().data.settings;
          const user_id = settings?.id || 1;
          const {
            topic,
            content,
            postDate,
            postTime,
            postType,
            publishType = "instant",
            user_config,
            user_fonts
          } = data;
          const now = new Date();
          let formattedDate = now.toISOString().split("T")[0];
          let formattedTime = now.toTimeString().split(" ")[0];

          if (publishType === "schedule") {
            formattedDate = "";
            formattedTime = "";

            const validPostDate = new Date(postDate);
            if (isNaN(validPostDate)) {
              console.error("Invalid postDate", postDate);
            } else {
              formattedDate = validPostDate.toISOString().split("T")[0];
            }

            const [hours, minutes] = postTime.split(":");
            const validPostTime = new Date();
            validPostTime.setHours(hours);
            validPostTime.setMinutes(minutes);
            validPostTime.setSeconds(0);

            formattedTime = validPostTime.toTimeString().split(" ")[0];
          }

          const requestData = {
            user_id,
            topic: topic,
            content: content,
            post_date: formattedDate,
            post_time: formattedTime,
            post_type: postType,
            publish_type: publishType,
            linkedin_postid: shareUrn,
            user_config: user_config,
            user_fonts: user_fonts
          };
          const response = await post("/content/save-data", requestData);

          if (response?.success) {
            // successToaster(response?.message);

            // set(
            //   produce((state) => {
            //     state.data.post.text = "";
            //     state.data.carousels = [];
            //   })
            // );

            return response;
          }
          return null;
        } catch (error) {
          console.error("Error publishing post:", error);
          return null;
        }
      },

      /**
       * ✅ Fetch LinkedIn Carousel data
       */
      fetchCarousel: async (data) => {
        try {
          const settings = await getter().data.settings;
          const summary = await getter().data.summary;
          const persona = await getter().data.persona;
          const offerings = await getter().data.offerings;
          const postText = await getter().data.post.text;
          const user_id = settings?.id || 1;
          const thread_id = settings?.threadId || "";
          const {
            topic,
            content,
            postType,
            linkedin_postid,
          } = data;

          const now = new Date();
          const formattedDate = now.toISOString().split("T")[0];
          const formattedTime = now.toTimeString().split(" ")[0];

          const requestData = {
            user_id,
            title: topic,
            content: postText,
            thread_id,
            post_date: formattedDate,
            post_time: formattedTime,
            post_type: postType,
            linkedin_postid,
          };

          // Default properties to be added
          const defaultProperties = { ...carouselConfig };

          const response = await post(
            "/content/generate-post-carousel",
            requestData
          );
          if (response.success) {
            const fontData = response?.data?.user_fonts?.carousel;
            // Map response to new structure - create fresh copy for each slide
            const updatedCarousels = response?.data?.carousel.map((slide, i) => {
              const isFirstOrLast = i === 0 || i === (response?.data?.carousel.length - 1);

              // Create fresh properties for this slide (avoid mutating shared object)
              const baseConfig = { ...carouselConfig };
              const slideProperties = {
                ...baseConfig,
                contentSetting: isFirstOrLast
                  ? (fontData?.[0]?.content || baseConfig.contentSetting)
                  : (fontData?.[1]?.content || baseConfig.contentSetting),
                titleSetting: isFirstOrLast
                  ? (fontData?.[0]?.title || baseConfig.titleSetting)
                  : (fontData?.[1]?.title || baseConfig.titleSetting),
              };

              return ({
                ...slideProperties,
                id: slide.id,
                title: slide.heading.replace(/\n/g, "<br>"),
                text: slide.content.replace(/\n/g, "<br>"),
              })
            });

            if (updatedCarousels.length > 0) {
              // if (showSuccessMessage) successToaster(response?.message);
              set(
                produce((state) => {
                  state.data.carousels = updatedCarousels;
                  state.data.requesting.carousel = false;
                  // state.data.activeTab = "carousel";
                  state.data.activeSlideId = updatedCarousels[0].id;
                  state.data.isUpdated = Math.random();
                  state.data.settings.threadId = response?.data?.threadId;
                  state.data.regenOptions.carousel = response?.data?.regenOptions;
                  state.data.regenOptions.carouselHook = response?.data?.hook;
                  state.data.regenOptions.carouselContentAndStyle = response?.data?.contentAndStyle;
                  // state.data.regenOptions.carousel = response?.data?.regenOptions;
                  // state.data.topic = data.topic;
                })
              );
              return response.data;
            }
          }
          return null;
        } catch (error) {
          console.error("Error fetching carousel:", error);
          return null;
        } finally {
          set(
            produce((state) => {
              state.data.requesting.carousel = false;
            })
          );
        }
      },

      /**
       * ✅ Regenerate a post
       */
      regenerateCarousel: async (data) => {
        try {
          const settings = await getter().data.settings;
          const postContent = await getter().data.post.text;
          const regenOpt = await getter().data.regenOptions;
          const user_id = settings?.id || 1;
          const thread_id = settings?.threadId || "";
          const { topic, content, postType, reason, length } = data;
          const now = new Date();
          const formattedDate = now.toISOString().split("T")[0];
          const formattedTime = now.toTimeString().split(" ")[0];

          set(
            produce((state) => {
              state.data.isGeneratingCarousel = true
            })
          );


          // const refined = content.map(({ title, text }) => ({
          //   heading: title || '',
          //   content: text || ''
          // }));

          const requestData = {
            user_id,
            title: topic,
            content: JSON.stringify(postContent),
            reason,
            thread_id,
            length,
            post_date: formattedDate,
            post_time: formattedTime,
            post_type: postType,
            hook: regenOpt.carouselHook,
            content_and_style: regenOpt.carouselContentAndStyle
          };


          const response = await post(
            "/content/re-generate-carousel",
            requestData
          );

          // const response = await new Promise((resolve) => {
          //   setTimeout(() => {
          //     resolve({
          //       success: true,
          //       data: {carousel: [
          //         { id: 1, heading: "Welcome to LinkedIn Growth 1 regerated", content: "Some introduction text" },
          //         { id: 2, heading: "Optimize Your Profile 2 regerated", content: "Some content text" },
          //         { id: 3, heading: "Build Your Network 3 regerated", content: "Some content text" },
          //         { id: 4, heading: "Engage with Content 4 regerated", content: "Some content text" },
          //         { id: 5, heading: "Final Thoughts last regerated", content: "Some conclusion text" },
          //       ]}
          //     });
          //   }, 5000);
          // });

          const defaultProperties = { ...carouselConfig };

          if (response?.success) {
            const fontData = response?.data?.user_fonts?.carousel;
            // Map response to new structure - create fresh copy for each slide
            const updatedCarousels = response?.data?.carousel.map((slide, i) => {
              const isFirstOrLast = i === 0 || i === (response?.data?.carousel.length - 1);

              // Create fresh properties for this slide (avoid mutating shared object)
              const baseConfig = { ...carouselConfig };
              const slideProperties = {
                ...baseConfig,
                contentSetting: isFirstOrLast
                  ? (fontData?.[0]?.content || baseConfig.contentSetting)
                  : (fontData?.[1]?.content || baseConfig.contentSetting),
                titleSetting: isFirstOrLast
                  ? (fontData?.[0]?.title || baseConfig.titleSetting)
                  : (fontData?.[1]?.title || baseConfig.titleSetting),
              };

              return ({
                ...slideProperties,
                id: slide.id,
                title: slide.heading.replace(/\n/g, "<br>"),
                text: slide.content.replace(/\n/g, "<br>"),
              })
            });

            if (updatedCarousels.length > 0) {
              // if (showSuccessMessage) successToaster(response?.message);
              set(
                produce((state) => {
                  state.data.carousels = updatedCarousels;
                  // state.data.activeTab = "carousel";
                  state.data.activeSlideId = updatedCarousels[0].id;
                  state.data.isUpdated = Math.random();
                  state.data.isGeneratingCarousel = false
                  state.data.isAnimationNeeded = true
                  state.data.regenOptions.carouselHook = response?.data?.hook;
                  state.data.regenOptions.carouselContentAndStyle = response?.data?.contentAndStyle;
                  // state.data.topic = data.topic;
                })
              );
              return response.data;
            }
          }
          return null;
        } catch (error) {
          console.error("Error regenerating post:", error);
          set(
            produce((state) => {
              state.data.isGeneratingCarousel = false
              state.data.isAnimationNeeded = false
            })
          );
          return null;
        }
      },

      /**
       * ✅ get posts
       */
      postList: async (data) => {
        try {
          const settings = await getter().data.settings;

          const user_id = settings?.id || 1;
          let { up_coming = true, to_date, from_date } = data;
          if (to_date || from_date) { up_coming = false }
          const response = await get(`/content/post-list`, { user_id, up_coming, to_date, from_date }, true);

          if (response?.success) {
            // successToaster(response?.message);
            return response;
          }
          return null;
        } catch (error) {
          console.error("post-list", error.message);
          return null;
        }
      },

      /**
       * ✅ Delete a post
       */
      deletePost: async (id) => {
        try {
          const response = await deleteReq(`/content/delete-post/${id}`);

          if (response?.success) {
            return response;
          }
          return null;
        } catch (error) {
          console.error("Error deleting post:", error);
          return null;
        }
      },

      /**
       * ✅ Get answers of the golden questions
       */
      getAnswers: async (data) => {
        try {
          const settings = await getter().data.settings;
          const user_id = settings?.id || 1;

          const response = await post(
            `/content/get-user-questions?user_id=${user_id}`,
            {},
            true
          );
          // const response = {
          //   success: true,
          //   data: [
          //     {
          //       summary: "Summary of the user's latest question and its response.",
          //       topic: "1. React Components\n2. State Management\n3. React Hooks",
          //     },
          //   ],
          // };
          if (response?.success) {
            const latestAnswers = response.data[0];
            const summary = latestAnswers.user_summary?.trim() || "";
            const persona = latestAnswers.persona?.trim() || "";
            const offerings = latestAnswers.offerings?.trim() || "";
            const niche = latestAnswers.niche?.trim() || "";
            const handle = latestAnswers.handle?.trim() || "My Handle";
            const theme = latestAnswers?.user_config && JSON.parse(latestAnswers?.user_config);
            set(
              produce((state) => {
                state.data.summary = summary;
                state.data.persona = persona;
                state.data.offerings = offerings;
                state.data.settings.niche = niche;
                state.data.settings.handle = handle;
                state.data.isAnsweredQuestion = true;
                if (theme) {
                  state.data.theme = {
                    colors: {
                      primary: theme?.themeColors?.primary,
                      secondary: theme?.themeColors?.secondary,
                      tertiary: theme?.themeColors?.tertiary,
                      background: theme?.themeColors?.background,
                    },
                    background: {
                      type: theme?.theme,
                      active: true
                    },
                  };
                }
              })
            );

            return response.data;
          }
          return null;
        } catch (error) {
          console.error("getAnswers-", error.message);
          return null;
        }
      },

      /**
       * ✅ Get summary from the given answers
       */
      getSummary: async (data) => {
        try {
          const settings = await getter().data.settings;
          const user_id = settings?.id || 1;
          data.userId = user_id;

          const response = await post("/content/get-summary", data);
          if (!response?.success || !response?.data) {
            throw new Error("Something went wrong");
          }

          const content = response?.data;
          await getter().resetStoreFull();
          set(
            produce((state) => {
              state.data.isAnsweredQuestion = true;
              // state.data.suggestions = content.topics.split(", ");
              state.data.summary = content.summary;
              state.data.persona = content.persona;
              state.data.offerings = content.offerings;
              state.data.settings.niche = content.niche;
            })
          );
          return response?.success
        } catch (error) {
          console.error("getAnswers-", error.message);
          return null;
        }
      },

      getAuth: async (data) => {
        try {
          const res = await get("/content/auth", null, true);
          if (res.data) {
            const { id, name, headshot, email, require_branding, is_allow_content } = res.data;
            getter()?.setSettings({ id, name, headshot, email, requireBranding: require_branding.toLowerCase() === "yes" });
            useMainStore.getState().setShowLoginRedirectBox(false);
            res.data.is_allow_content = is_allow_content.toLowerCase() === "yes";
            res.data.require_branding = require_branding.toLowerCase() === "yes"
            return res.data
          } else {
            throw new Error("Api failed")
          }
        } catch (error) {
          console.warn(error.message)
          // window.location.href = redirectionUrl;
          useMainStore.getState().setShowLoginRedirectBox(true);
        }
      },

      getSubscription: async (data) => {
        try {
          const res = await get("/content/subscription", null, true);
          if (res.data) {
            // const { id, name, headshot, email } = res.data;
            const { require_branding, is_allow_content } = res.data;
            getter()?.setSettings({ requireBranding: require_branding.toLowerCase() === "yes" });
            res.data.is_allow_content = is_allow_content.toLowerCase() === "yes";
            res.data.require_branding = require_branding.toLowerCase() === "yes"
            return res.data
          } else {
            throw new Error("Api failed")
          }
        } catch (error) {
          console.warn(error.message)
          // window.location.href = redirectionUrl;
          useMainStore.getState().setShowLoginRedirectBox(true);
        }
      },
      /**
       * ✅ get suggestion for a post
       */
      getSuggestions: async (data) => {
        try {
          const settings = await getter().data.settings;
          const user_id = settings?.id || 1;
          const thread_id = settings?.threadId || "";
          const niche = settings?.niche || "";
          // set(
          //   produce((state) => {
          //     state.data.post.text = "";
          //   })
          // );

          const requestData = {
            user_id,
            niche,
            thread_id,
          };

          const response = await get(
            "/content/get-suggestions",
            requestData
          );

          if (response?.success) {
            // successToaster(response?.message);
            const { data } = response
            set(
              produce((state) => {
                // state.data.topic = "";
                state.data.suggestions = data.topics;
                state.data.settings.threadId = data?.threadId;
              })
            );
            return data.topics;
          }
          return null;
        } catch (error) {
          console.error("Error regenerating post:", error);
          return null;
        }
      },
      /**
       * ✅ save handle
       */
      saveHandle: async (handle) => {
        try {
          const settings = await getter().data.settings;
          const user_id = settings?.id || 1;

          const requestData = {
            user_id,
            handle,
          };

          const response = await post(
            "/content/save-handle",
            requestData
          );

          if (response?.success) {
            const { data } = response
            set(
              produce((state) => {
                state.data.settings.handle = data?.handle;
              })
            );
            return data?.handle;
          }
          return null;
        } catch (error) {
          console.error("Error regenerating post:", error);
          return null;
        }
      },
      checkPublishPosts: async (data) => {
        const { settings } = getter().data;
        const requestData = {
          user_id: settings?.id,
          schedule_date: data?.schedule_date
        }
        const response = await post(`/content/check-publish-post`, requestData);
        if (response) {
          return response?.data;
        } else {
          return false
        }
      },
      fetchThemeBg: async () => {
        const res = await fetch(`/assets/svgs.json?ts=${Date.now()}`);
        let data = await res.json();
        if (data) {
          return data
        } else {
          return false
        }
      }
    }),
    {
      name: "main-store",
      getStorage: () => localStorage,
    }
  )
);

export default useMainStore;

