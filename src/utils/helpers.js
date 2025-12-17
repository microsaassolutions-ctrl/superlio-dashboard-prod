export const PaletteCollection = [
    // vibrant contrasts
    {
        primary: "#ffffff",
        secondary: "#cdcee5",
        background: "#4444dd",
        tertiary: "#8895f6", // light blue-violet blend
    },
    {
        primary: "#bb0088",
        secondary: "#ffffff",
        background: "#11004d",
        tertiary: "#651e7a", // rich purple-pink
    },
    {
        primary: "#A5AEB7",
        secondary: "#E9E6E1",
        background: "#211D1E",
        tertiary: "#777870", // muted gray blend
    },
    // earth tones
    {
        primary: "#ff9a8d",
        secondary: "#fbe1b7",
        background: "#3b2923",
        tertiary: "#b87f6f",
    },
    {
        primary: "#fcce19",
        secondary: "#fffcfa",
        background: "#4d8a6d",
        tertiary: "#a6c157",
    },
    // cool blues
    {
        primary: "#ffb347",
        secondary: "#ffffff",
        background: "#244854",
        tertiary: "#91b199",
    },
    {
        primary: "#06247f",
        secondary: "#ffffff",
        background: "#56a3f5",
        tertiary: "#2f64ba",
    },
    // Warm Sunsets
    {
        primary: "#c65911",
        secondary: "#7a552b",
        background: "#ffedda",
        tertiary: "#eaa672",
    },
    // soft pastels
    {
        primary: "#a199e5",
        secondary: "#262626",
        background: "#e8d9f1",
        tertiary: "#8676c9",
    },
    {
        primary: "#ff6522",
        secondary: "#07193a",
        background: "#ffe8e4",
        tertiary: "#b36c43",
    },
    // Monochromatic Grays
    {
        primary: "#d93f3c",
        secondary: "#ffffff",
        background: "#333333",
        tertiary: "#994b38",
    },
    {
        primary: "#d93f3c",
        secondary: "#4c4c4c",
        background: "#f2f2f2",
        tertiary: "#b48b88",
    },
    // Elegant Darks
    {
        primary: "#2c9955",
        secondary: "#ffffff",
        background: "#262626",
        tertiary: "#60866d",
    },
    // Soft and Soothing
    {
        primary: "#3C1E4F",
        secondary: "#9658A1",
        background: "#F7F2FA",
        tertiary: "#a586c3",
    },
    // taplio
    {
        primary: "#eb546f",
        secondary: "#220257",
        background: "#ffffff",
        tertiary: "#a75c89",
    },
    {
        primary: "#5dbb5f",
        secondary: "#eee5b1",
        background: "#231411",
        tertiary: "#9e9870",
    },
    // 
    {
        primary: "#054a91",
        secondary: "#3e7cb1",
        background: "#81a4cd",
        tertiary: "#dbe4ee",
    },
    {
        primary: "#588b8b",
        secondary: "#ffffff",
        background: "#ffd5c2",
        tertiary: "#f28f3b",
    },
    {
        primary: "#0a2463",
        secondary: "#3e92cc",
        background: "#fffaff",
        tertiary: "#d8315b",
    },
    {
        primary: "#001427",
        secondary: "#708d81",
        background: "#f4d58d",
        tertiary: "#bf0603",
    },
];

export const themeBgImages = [
    {
        'name': 'Dots',
        'url': '/images/dots',
        'primary': '#7657364',
        'secondary': '#7657364',
        'tertiary': '#f40202',
        'background': '#0e0b0b'
    }
]



export const questions = [
    // { id: 0, question: "My Handle", show: 0 },
    { id: 1, question: "Content type (Niche/ Industry)", show: 0 },

    {
        id: 2,
        question: "Summary",
        parts: [
            "Provide a one-paragraph description of who you are.",
        ],
        show: 1
    },
    {
        id: 3,
        question: "Persona",
        parts: ["Describe your target audience profiles."],
        show: 2
    },
    {
        id: 4,
        question: "Offerings",
        parts: [
            "Describe the services or products your company offers.",
        ],
        show: 2
    },
];

export const regenSuggestions = [
    {
        title: "Make It Concise And Focused",
        prompt: "custom"
    },
    {
        title: "Simplify Complex Language",
        prompt: "custom"
    },
    {
        title: "Clarity And Structure",
        prompt: "custom"
    },
    {
        title: "Error In The Response",
        prompt: "custom"
    }
];

export function getCookieValue(name) {

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}


export async function checkExtensionInstalled(extensionId) {
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage(
            extensionId,
            { action: "ping" },
            (response) => {
                if (chrome.runtime.lastError || !response.status) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }
        );
      } catch (error) {
        resolve(false);
      }
      setTimeout(() => resolve(false), 1000);
    });
};

// block clip actions
export function blockClipboardActions(element) {
  if (!element) return;

  const handleCopyPasteCut = (e) => {
    e.preventDefault();
  };

  element.addEventListener("copy", handleCopyPasteCut);
  element.addEventListener("paste", handleCopyPasteCut);
  element.addEventListener("cut", handleCopyPasteCut);

  // Return cleanup for useEffect
  return () => {
    element.removeEventListener("copy", handleCopyPasteCut);
    element.removeEventListener("paste", handleCopyPasteCut);
    element.removeEventListener("cut", handleCopyPasteCut);
  };
}

export const disableCopyPasteCut = (quillRef) => {
  const quillEditor = quillRef.current?.getEditor()?.root;
  if (!quillEditor) return;

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && ["v", "c", "x"].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCut = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  quillEditor.addEventListener("keydown", handleKeyDown);
  quillEditor.addEventListener("paste", handlePaste);
  quillEditor.addEventListener("copy", handleCopy);
  quillEditor.addEventListener("cut", handleCut);

  // Return a cleanup function for useEffect
  return () => {
    quillEditor.removeEventListener("keydown", handleKeyDown);
    quillEditor.removeEventListener("paste", handlePaste);
    quillEditor.removeEventListener("copy", handleCopy);
    quillEditor.removeEventListener("cut", handleCut);
  };
};


const loaderSets = [
 ["Finalizing carousel structure","Uploading media assets to LinkedIn", "You're not just posting. You're building a brand.", "Publishing content 🚀"],
 ["Validating post content formatting", "Rendering mobile-optimized preview","Aligning your hook and headline formatting","Almost there… just wrapping things up."],
 ["Compressing carousel slides for faster upload","Confirming LinkedIn authentication","Wrapping your carousel like a gourmet burrito 🌯","Finalizing publishing 🔒"],
 ["Queuing your post in the publishing pipeline","Checking spacing and layout consistency","Packaging post content and metadata","Your story builds someone else’s breakthrough."],
 ["Locking in your CTA","Verifying image resolution and layout","Ensuring content complies with platform rules","Publishing content to LinkedIn ✔️"],
 ["Formatting carousel structure","Verifying character limits across post sections","Dressing your copy in its best LinkedIn outfit","Triggering publishing sequence"],
 ["Aligning your hook and headline formatting","You’re closer than you think.","Preparing scheduled time slot","Publishing content to LinkedIn"],
 ["Locking in your CTA","Confirming timezone alignment for scheduling","Powering up the engagement hamster wheel","Publishing content hold tight!"],
 ["Validating post content formatting","Checking layout for light/dark mode compatibility","Queuing post in publishing pipeline","Finalizing publishing"],
 ["Finalizing carousel structure","Packaging post metadata and structure","Wrapping CTA with optimized formatting","Almost there 🚀"],
 ["Rendering carousel preview","Verifying image clarity across devices","Bribing the algorithm with good vibes ✨","Publishing content"],
 [ "Checking for spacing and layout consistency","Compressing assets for upload","Locking in optimized CTA","Syncing your content with the publishing queue"],
 [ "Queuing post for LinkedIn publishing","Finalizing character count limits","Assigning alt text for accessibility","Publishing your content go time!"],
 ["Preparing Slide previews","Compressing media assets","Final checks for layout fluidity","Post confirmed!"],
 ["Formatting visuals for feed clarity","Locking in post structure and formatting","Confirming alt text for each slide","Upload complete."],
 ["Validating spacing and layout consistency","Compressing carousel slides","Visibility = Trust. Trust = Leads.","Publishing content to LinkedIn"],
 ["Preparing Slide previews","Testing layout on light & dark mode","Wrapping your carousel like a gourmet burrito 🌯","Finalizing publishing"],
 ["Finalizing hook formatting","Aligning post structure","Someone out there needs this carousel.","Publishing now hang tight."],
 ["Rendering carousel preview","Verifying headline character limits","Running post structure validation","Upload complete. Let’s go!"],
 ["Packaging final carousel structure","Syncing scheduled time","Polishing CTA clarity","Publishing content"],
 ["Caching your carousel","Verifying alt text for accessibility","Final formatting for mobile view","Done and scheduled!"],
 ["Queuing your post","Checking for content duplication","Summoning the perfect scroll-stopper","Publishing moment incoming"],
 ["Confirming carousel transitions","Adjusting for screen responsiveness","Locking in scroll-stopping formatting","Uploading to LinkedIn"],
 ["Rendering visual hierarchy","Uploading images","Setting CTA alignment","Finalizing publish request"],
 [ "Validating content size","Assigning post ID","Polishing final text layers","Ready to go live!"],
 ["Confirming scheduling parameters", "Locking in media formatting","Drafting final publish signature","Go time! 🚀"],
 ["Checking for excess whitespace","Rendering scroll previews","Syncing with posting queue","Scheduled. Back to dashboard."],
 [ "Syncing with timezone","Rendering light mode view","Finalizing layout grids","Publishing now"],
 ["Compiling post package","Validating font legibility","Adding post to queue","Publishing"],
 ["Compressing assets","Confirming character limit compliance","Auto-checking all formats","Done and dusted!"],
 ["Assigning layout version","Checking for layout collisions","Polishing call-to-action","Almost live"],
 ["Queuing post for API call","Verifying post signature","Packaging your post for delivery 📬","Time to shine!"],
 ["Checking LinkedIn compatibility","Locking in preview formatting","Publishing in progress","Back to work. You're killing it 💥"],
 ["Preparing asset delivery","Warming up our content wizard 🧙‍♂️","Assigning backend job ID","Done. Let’s make another?"],
 ["Compressing final render","Preparing publishing headers","Scheduling your content slot","🚀 Publish successful!"],
 ["Verifying content integrity","Adjusting for text overflow","Confirming structured data tags","Ready to ship!"],
 ["Rendering responsive preview","Optimizing hook for mobile","Preparing your Post format","Publishing to LinkedIn",],
 ["Syncing scheduled time with server","Checking text compliance","Uploading draft version","Time to roll"],
 ["Finalizing typography pairing","Preloading preview thumbnails","Rendering final layout for post feed","Published & live! 🙌"],
 [ "Finalizing typography pairing","Preloading preview thumbnails","Rendering final layout for post feed","Published & live! 🙌"],
 [ "Locking in final version","Running end-to-end formatting check","Sealing assets for delivery","Scheduled successfully"]
]

const randomFacts = [
	"A Fun Fact:🧠 Your brain processes a meme faster than a spreadsheet.",
	"A Fun Fact:📈 73% of marketers admit they’ve posted content… and then immediately checked for likes.",
	"A Fun Fact:Your brain processes a meme faster than a spreadsheet.",
	"A Fun Fact:73% of marketers admit they’ve posted content and then immediately checked for likes.",
	"A Fun Fact:Posts with dogs have better engagement. Coincidence? Or are dogs better marketers?",
	"A Fun Fact:Coffee boosts productivity by 300%. Especially when spilled on your keyboard.",
	"A Fun Fact:40% of marketers have tried blaming AI for a typo.",
	"A Fun Fact:External links = LinkedIn’s version of a breakup.",
  "A Fun Fact:A hook is just a pickup line but for leads.",
  "A Fun Fact:The best performing posts? Written at 2am, in a bathrobe, while questioning life.",
  "A Fun Fact:The average marketer opens 8 tabs to write one post — and none of them help.",
  "A Fun Fact:98% of carousels start as “just one idea” and spiral out of control.",
  "A Fun Fact:Your post is being judged by 10 people silently lurking. Smile!",
  "A Fun Fact:Social media managers have trust issues — thanks to post-scheduling bugs.",
  "A Fun Fact:Posting on LinkedIn feels like public speaking. But in your pajamas.",
  "A Fun Fact:100% of graphs with no axis labels still look convincing.",
  "A Fun Fact:That “viral” post you loved? It was probably edited 9 times.",
  "A Fun Fact:AI is smart. But it still can't figure out what the so-called LinkedIn Gurus mean by “authenticity” on LinkedIn.",
  "A Fun Fact:Reading your own hook 14 times doesn’t make it better. Just painful.",
  "A Fun Fact:Your top post of the year? Probably the one you almost didn’t publish.",
  "A Fun Fact:There’s a 0.001% chance someone printed your carousel. Frame it.",
  "A Fun Fact:If you schedule a post and forget about it, you’re basically the social media version of a time traveler.",
  "A Fun Fact:Every minute, 347 new LinkedIn gurus are born. 0.4% have actually written a post.",
  "A Fun Fact:Posting on social media burns 0.1 calories. You’re basically working out.",
  "A Fun Fact:The average marketer has 12 tabs open. None of them are useful.",
  "A Fun Fact:Writing “Let that sink in” doesn’t help your content. Unless you’re posting a photo of a sink.",
  "A Fun Fact:A post without hashtags feels like a pizza without toppings—technically okay, but why would you?",
  "A Fun Fact:The first person to say “value-packed carousel” is still writing it.",
  "A Fun Fact:84% of people reading your carousel will scroll past slide 3. The other 16% are your mom.",
  "A Fun Fact:The dopamine you feel after a like is scientifically equivalent to eating 1/3rd of a cookie. Sort of.",
  "A Fun Fact:Every “🔥 Hot Take” is just a warm reheat of someone else’s lukewarm take.",
  "A Fun Fact:Marketers dream in CTAs. It’s why we sleep exhausted and wake up with ideas.",
  "A Fun Fact:Ghostwriting is like being Batman but with no cape, no credit, and fewer fight scenes.",
  "A Fun Fact:Carousel creators have one fear: Slide 7 being skipped. It haunts them nightly.",
  "A Fun Fact:The ‘thought leader’ title is self-appointed 93.2% of the time.",
  "A Fun Fact:If you ever feel like you’re talking into the void you probably posted at 3 AM.",
  "A Fun Fact:Most viral posts are written while pretending to do client work.",
  "A Fun Fact:LinkedIn loves drama. The algorithm is basically your nosy neighbor.",
  "A Fun Fact:The secret to engagement? Misplace a comma. The grammar police will handle the comments.",
  "A Fun Fact:Stats show 1 in 3 creators recycle a hook every month. And we still fall for it.",
  "A Fun Fact:People will scroll past your gold, but pause at a selfie of you holding a coffee mug. Algorithms are weird.",
  "A Fun Fact:Writing “Here’s the truth” instantly increases your credibility by 12 fake internet points.",
  "A Fun Fact:The phrase “You won’t believe this” is responsible for 78% of clickbait on the web.",
  "A Fun Fact:Every time someone says “consistency is key,” a social media manager cries softly.",
  "A Fun Fact:Content pillars are like gym routines. You build them. Then ignore them for memes.",
  "A Fun Fact:People fear public speaking. Second to that? Clicking “Post” on LinkedIn.",
  "A Fun Fact:The most powerful line in any post: “This changed everything for me.”",
  "A Fun Fact:People won’t respond to your sales pitch—but ask them to “vote with an emoji” and boom: engagement!",
  "A Fun Fact:The only thing stronger than caffeine? A comment from a verified profile.",
  "A Fun Fact:The average creator deletes and rewrites their first hook 5.7 times. Some never recover.",
  "A Fun Fact:2% of creators hit ‘Publish’ without panic. They’re not human.",
  "A Fun Fact:Every ghostwriter has at least one client who says “Make it sound like me”—but has never written a post.",
  "A Fun Fact:Most marketers believe in A/B testing. But when it comes to memes, it’s pure chaos.",
  "A Fun Fact:The social media content lifecycle: post → obsess → refresh → regret → repeat.",
  "A Fun Fact:Creating content is 20% writing, 80% doubting your existence.",
  "A Fun Fact:If you didn’t say “this post took me 3 hours to write,” did you even write?",
  "A Fun Fact:You know it’s real when you start judging other people’s CTAs in their posts.",
  "A Fun Fact:Posting a selfie increases engagement. Bonus points if you're near a mic or pretending to laugh.",
  "A Fun Fact:There’s always one guy who comments “This.” That’s it. That’s the comment.",
  "A Fun Fact:Social media strategy is just a fancy way of saying: throw stuff at the algorithm and pray.",
  "The biggest lie we tell ourselves? “Just one more scroll”",
  "Posts with 7–9 slides perform 40% better.",
  "Posts under 1500 characters perform best.",
  "Remember, Visibility = Trust. Trust = Leads.",
  "Tip:Carousels with numbers in the hook get 22% more clicks.",
  "Rembember, Don’t sell. Teach something.",
  "Tip: Bullet points beat big paragraphs.",
  "Our robots are caffeinating Beep boop",
  "Every post is a step toward authority.",
  "Tip: First 3 lines = 80% of hook impact.",
  "Your content is your currency. Spend wisely.",
  "Summoning the algorithm genie",
  "You’re creating digital leverage right now.",
  "Tip: Carousel posts often outperform Text-only Posts.",
  "Consistency beats virality. Show up daily.",
  "Whispering sweet nothings to your headline",
  "Tip: Mix authority with relatability for best results.",
  "Ask instead of tell. Spark engagement.",
  "Doing 7 pushups for your success",
  "Tip: Posts with hashtags tend to underperform.",
  "You’re not just posting — you’re building a brand.",
  "Bribing the LinkedIn algorithm with ice cream",
  "Tip: Avoid external links — they kill reach.",
  "Big outcomes follow small actions like this.",
  "Teach something. Don’t just tell.",
  "Powering up the engagement hamster wheel",
  "Tip: Headlines with “how to” tend to convert 2x better.",
  "Done is better than perfect. Publish it.",
  "You don’t need a big audience — just the right one.",
  "Someone out there needs to read this today.",
  "Tip: Spark discussion with questions.",
  "You’re one post away from your biggest opportunity.",
  "Someone needs to hear what you’re about to say.",
  "Perfection kills momentum—hit publish.",
  "Nobody gets better by hiding.",
  "Great content isn't found. It's practiced.",
  "The more you post, the more you learn.",
  "That post you’re doubting? It might be your best one.",
  "You can’t improve what you don’t publish.",
  "Your future client is scrolling. Be there.",
  "Progress > polish. Every time.",
  "Don’t let fear be louder than your voice.",
  "You were made to lead, not lurk.",
  "Today’s post builds tomorrow’s authority.",
  "You don’t need permission to show up.",
  "Every master was once invisible.",
  "Post it scared. Post it anyway.",
  "You grow by being seen—even when it’s uncomfortable.",
  "You're not posting for likes, you're building legacy.",
  "The more you share, the clearer your message gets.",
  "Doubt means you care. Don’t let it stop you.",
  "Your story has power. Tell it.",
  "Just one post can change the game.",
  "Done is the new perfect.",
  "Show up like the person you want to become.",
  "Your first 50 posts are practice. Start swinging.",
  "Inspiration follows action. Not the other way around.",
  "You’re not late. You’re right on time.",
  "Build before you need to sell.",
  "The post you skip today might've landed your dream client.",
  "Don’t post for everyone. Post for your future tribe.",
  "Visibility beats talent—especially online.",
  "You're closer than you think.",
  "Keep showing up. Even when it's quiet.",
  "Small posts, big ripple.",
  "You don’t need viral. You need consistent.",
  "Speak from the scar, not the wound.",
  "One post a day. That’s the edge.",
  "Your voice is your brand. Let them hear it.",
  "Momentum starts with one brave share.",
  "Create like no one's watching—then hit publish anyway.",
  "Build anticipation with teaser posts before a big launch.",
  "Focus on one content goal per post—don’t mix too many ideas.",
  "Repurpose comments into content.",
  "Turn DMs into posts—they’re full of real questions.",
  "Study viral posts from others, mimic the structure.",
  "Collaborate with creators in your niche.",
  "Tip: Document, don’t create. Share your daily process.",
  "Pin your highest-converting post to your profile.",
  "Tip: Write posts based on buyer objections.",
  "Tip: Post daily for 30 days to find your style fast.",
  "Use carousels for deep dives, hooks for quick wins.",
  "Build up to a “hero” post each week with micro-content.",
  "Use “soft pitch” posts—educate first, offer second.",
  "Tip: Showcase your client’s journey, not just your offer.",
  "Tip: Highlight transformation over testimonials.",
  "Turn webinars into content threads.",
  "Reverse-engineer your buyer journey into a content sequence.",
  "Tip: Use humor to stand out in serious niches.",
  "Tip: Don’t rely only on reach—build comment pods or engage groups.",
  "Build a 3-month evergreen content bank.",
  "Create visual templates for your brand.",
  "Host live sessions to gather engagement and content ideas.",
  "Tip: Review analytics every 14 days for patterns.",
  "Tip: Use stories with cliffhangers across 2–3 posts.",
  "Tip: Create “bookmark-worthy” cheat sheets.",
  "Tip: Inject pop culture into niche insights.",
  "Tip: Run “mini-challenges” for community growth.",
  "Tip: Turn testimonials into “how they got there” breakdowns.",
  "Tip: Schedule a content “reset day” monthly.",
  "Tip: Use personal milestones as entry points into deeper lessons.",
  "Tip: Align content with key calendar events.",
  "Tip: Take stances on industry debates.",
  "Tip: Share “lessons from clients” without revealing them.",
  "Rotate content types—text, image, carousel, video.",
  "Tip: Create “signature frameworks” and post around them.",
  "Tip: Lead with curiosity, end with clarity."
]
// ********************************
// function getRandomFromLoaderSet(setIndex) {
//   const set = loaderSets[setIndex];
//   return set[Math.floor(Math.random() * set.length)];
// }

// function getRandomFromRandomFacts() {
//   return randomFacts[Math.floor(Math.random() * randomFacts.length)];
// }

// let sequentialTimeout = null;
// let randomFactsInterval = null;

// export function showMessagesSequentially(callback) {
//   const totalMessages = 8;
//   let progress = 0;
//   const messages = [];

//   // Clear any existing timeout or interval before starting
//   if (sequentialTimeout) {
//     clearTimeout(sequentialTimeout);
//     sequentialTimeout = null;
//   }
//   if (randomFactsInterval) {
//     clearInterval(randomFactsInterval);
//     randomFactsInterval = null;
//   }

//   function sendCallback(message) {
//     progress += 1;
//     callback({ message, progress });
//   }

//   // Step 1: First 2 messages from SAME loaderSets sub-array
//   const firstSetIndex = Math.floor(Math.random() * loaderSets.length);
//   const firstMsg = getRandomFromLoaderSet(firstSetIndex);
//   messages.push(firstMsg);
//   sendCallback(firstMsg);

//   sequentialTimeout = setTimeout(() => {
//     const secondMsg = getRandomFromLoaderSet(firstSetIndex);
//     messages.push(secondMsg);
//     sendCallback(secondMsg);

//     // Step 2: Messages 3,4,5,6 from randomFacts every 6s
//     let count = 0;
//     randomFactsInterval = setInterval(() => {
//       if (count >= 4) {
//         clearInterval(randomFactsInterval);
//         randomFactsInterval = null;

//         // Step 3: Messages 7 and 8 from loaderSets any sub-array
//         const msg7 = getRandomFromLoaderSet(Math.floor(Math.random() * loaderSets.length));
//         messages.push(msg7);
//         sendCallback(msg7);

//         const msg8 = getRandomFromLoaderSet(Math.floor(Math.random() * loaderSets.length));
//         messages.push(msg8);
//         sendCallback(msg8);

//         return;
//       }

//       const factMsg = getRandomFromRandomFacts();
//       messages.push(factMsg);
//       sendCallback(factMsg);
//       count++;
//     }, 6000);

//   }, 6000);
// }


function getRandomFromLoaderSet(setIndex) {
  const set = loaderSets[setIndex];
  return set[Math.floor(Math.random() * set.length)];
}

function getRandomFromRandomFacts() {
  return randomFacts[Math.floor(Math.random() * randomFacts.length)];
}

let sequentialTimeout = null;
let randomFactsInterval = null;

export function showMessagesSequentially(callback, no) {
  const totalMessages = 8;
  let progress = 0;
  const messages = [];

  // Clear any existing timeout or interval before starting
  if (sequentialTimeout) {
    clearTimeout(sequentialTimeout);
    sequentialTimeout = null;
  }
  if (randomFactsInterval) {
    clearInterval(randomFactsInterval);
    randomFactsInterval = null;
  }

  function sendCallback(message) {
    progress += 1;
    callback({ message, progress });
  }

    if (no === 7) {
        if (messages.length < 7) {
            while (6 - (messages.length)) { progress += 1; messages.push("none") }
        }
        console.log(messages.length)
        const msg7 = getRandomFromLoaderSet(Math.floor(Math.random() * loaderSets.length));

        messages.push(msg7);
        sendCallback(msg7);

        setTimeout(() => {
            const msg8 = getRandomFromLoaderSet(Math.floor(Math.random() * loaderSets.length));
            messages.push(msg8);
            sendCallback(msg8);

        }, 6000)
        return;
    }

  // Step 1: First 2 messages from SAME loaderSets sub-array
  const firstSetIndex = Math.floor(Math.random() * loaderSets.length);
  const firstMsg = getRandomFromLoaderSet(firstSetIndex);
  messages.push(firstMsg);
  sendCallback(firstMsg);

  sequentialTimeout = setTimeout(() => {
    const secondMsg = getRandomFromLoaderSet(firstSetIndex);
    messages.push(secondMsg);
    sendCallback(secondMsg);

    // Step 2: Messages 3,4,5,6 from randomFacts every 6s
    let count = 0;
    randomFactsInterval = setInterval(() => {
      if (count >= 4) {
        clearInterval(randomFactsInterval);
        randomFactsInterval = null;

        // Step 3: Messages 7 and 8 from loaderSets any sub-array
        const msg7 = getRandomFromLoaderSet(Math.floor(Math.random() * loaderSets.length));
        messages.push(msg7);
        sendCallback(msg7);

        const msg8 = getRandomFromLoaderSet(Math.floor(Math.random() * loaderSets.length));
        messages.push(msg8);
        sendCallback(msg8);

        return;
      }

      const factMsg = getRandomFromRandomFacts();
      messages.push(factMsg);
      sendCallback(factMsg);
      count++;
    }, 6000);

  }, 6000);
}

// export const getLineHeight =(size)=>{
//     if(!size?.includes('px')){
//         let sizeNum = Number(size) + 2
//         return Number(sizeNum);
//     }else{
//         let sizeNum = size?.split('p')
//         return Number(sizeNum?.[0] + 2);
//     }
// }
export function getLineHeight(value) {
  // Check if the value ends with 'px' (indicating it's in pixels)
  if (typeof value === 'string' && value.includes('px')) {
    // Extract the numeric part and add 2
    const num = parseInt(value, 10);
    return (num + 2) + 'px';
  } else {
    // If it's just a number, add 2
    return value + 2;
  }
}