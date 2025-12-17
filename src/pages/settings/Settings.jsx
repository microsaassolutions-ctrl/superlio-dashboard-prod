import React, { useState, useEffect } from "react";
import { Button, Loading } from "../../components/commons";
import useMainStore from "../../store/useMainStore";
import { useLocation, useNavigate } from "react-router-dom";
import { errorToaster, successToaster } from "../../utils/toaster";
import { questions } from "../../utils/helpers";


const QuestionBlock = ({ id, question, parts, answer, onChange, error, show }) => {
  const getWordCount = (text) => text?.trim().split(/\s+/).filter(Boolean).length || 0;
  const wordCount = getWordCount(answer);
  const isNicheOrHandle = question.toLowerCase().includes("niche");

  const minLimit = isNicheOrHandle ? 1 : 0;
  const maxLimit = isNicheOrHandle ? 60 : 150;
  const [isValid  , setIsaValid ] = useState(false);
  const handleChange = (id, value) => {
    const trimmedWords = value.trim().split(/\s+/).filter(Boolean);
    const wordCount = trimmedWords.length;

    if (wordCount > maxLimit) {
      setIsaValid(true);  // Error: too many words
      return;
    }

    setIsaValid(false);   // OK
    onChange(id, value);
  };

  // Paste handler (optional: if needed separately)
  const handlePaste = (e, id) => {
    let pasteData = e.clipboardData.getData('Text');
    let existingText = e.target.value;
     const wordCountText= getWordCount(existingText);
    const combinedText = existingText + ' ' + pasteData;
    const wordCount = combinedText.trim().split(/\s+/).filter(Boolean).length;

    if (wordCount > maxLimit) {
    e.preventDefault(); // Cancel the paste
    let  validWords =   wordCount - (maxLimit - wordCountText);
    validWords = wordCount - validWords
    console.log(validWords, "fsnfkjk", wordCount, maxLimit)
    const ss = pasteData.split(" ")
    existingText += ss.slice(0, validWords).join(" ")
    console.log(existingText)
    onChange(id, existingText);
      setIsaValid(true);   // Show validation error
    }
  };

  return (
    <div className="mb-1">
      <div className="flex items-center gap-1">
        <h3 className="text-lg font-semibold mb-2">{question}</h3>
        {show >= 1 && (
          <span className="mb-2 text-[12px]">{show === 1 ? "(Recommended)" : "(Optional)"}</span>
        )}
      </div>

      <ul className="list-inside mb-2 text-gray-700">
        {parts?.map((part, idx) => (
          <li key={idx}>{part}</li>
        ))}
      </ul>

      <textarea
        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 resize-none overflow-y-auto ${parts ? "h-32" : "h-12"} 
        ${parts ? "sm:h-[100px]" : "sm:h-[120px]"} ${isValid ? "border-red-500" : "border-gray-300"}`}
        value={answer || ""}
        onChange={(e) => handleChange(id, e.target.value)}
        onPaste={(e)=>handlePaste(e, id)}
        placeholder="Write your answer here..."
      />

      <div className="flex justify-between items-center text-sm mt-1">
        <p className="text-red-500">{error || ""}</p>
        <div className={`${isValid ? "text-red-500" : "text-gray-500"}`}>
          {wordCount} / {maxLimit} {wordCount === 1 ? "word" : "words"}
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [, setIsRedirectNeeded] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setData, getAnswers, getSummary, resetStoreFull } = useMainStore();

  useEffect(() => {
    if (location.state?.redirected) {
      setIsRedirectNeeded(true);
    }

    // Fetch saved answers from the database
    const fetchAnswers = async () => {
      setLoading(true);
      try {
        const response = await getAnswers();
        if (response && response.length > 0) {
          const latestAnswers = response[0];
          setAnswers({
            0: latestAnswers.handle || "",
            1: latestAnswers.niche || "",
            2: latestAnswers.user_summary || "",
            3: latestAnswers.persona || "",
            4: latestAnswers.offerings || "",
          });
        }
      } catch (error) {
        console.error("Error fetching answers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, []);

  // answer change
  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  // handle submit
  const handleSubmit = async (type) => {
    let hasError = false;
    const newErrors = {};

    questions.forEach(({ id, question }) => {
      const wordCount = answers[id]?.trim().split(/\s+/).filter(Boolean).length || 0;
      const isNicheOrHandle = question.toLowerCase().includes("niche");
      const minLimit = isNicheOrHandle ? 1 : 0;
      const maxLimit = isNicheOrHandle ? 60 : 150;

      // if (!answers[id]?.trim()) {
      //   newErrors[id] = "This field is required.";
      //   hasError = true;
      // } else 
      if (wordCount < minLimit) {
        newErrors[id] = `${isNicheOrHandle ? question : "Answer"} must be at least ${minLimit} word${minLimit > 1 ? "s" : ""}.`;
        hasError = true;
      } else if (wordCount > maxLimit) {
        newErrors[id] = `${isNicheOrHandle ? question : "Answer"} must be at max ${maxLimit} word${maxLimit > 1 ? "s" : ""}.`;
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      errorToaster("Please fix the highlighted errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      const formattedData = {
        handle: answers[0] || "",
        niche: answers[1] || "",
        summary: answers[2] || "",
        persona: answers[3] || "",
        offerings: answers[4] || "",
        // questionsAndAnswers: questions
        //   .slice(1)
        //   .map(({ id, question, parts }) => ({
        //     question: question + " *",
        //     options: parts
        //       ? parts.map(
        //         (part, idx) => `${String.fromCharCode(97 + idx)}. ${part}`
        //       )
        //       : [],
        //     answer: answers[id] || "",
        //   })),
      };
      const result = await getSummary(formattedData);
      if (!result) throw new Error("Something went wrong");

      if (type === 1) {
        navigate("/content-generation");
      } else {
        successToaster("Submission successful! 🎉");
      }
    } catch (error) {
      console.error("Error submitting answers:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-10/12">
      {loading && <Loading />}
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Answer the following questions
      </h2>

      {/* Grid layout for first 4 questions (2x2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2  sm:grid-rows-[100px_100px_100px_100px] gap-6">
        {questions.slice(0, 4).map(({ id, question, parts, show }) => {
          let rowSpan = "";
          let gridPosition = "";
          if (id === 1) rowSpan = "sm:row-span-2";
          else if (id === 2) rowSpan = "sm:row-span-2";
          else if (id === 3) rowSpan = "sm:row-span-2";
          else if (id === 4) rowSpan = "sm:row-span-2";

          if(id === 1){
            gridPosition = "sm:row-start-1";
          }else if (id === 2) {
            gridPosition = "sm:col-start-1 sm:row-start-3";
          } else if (id === 3) {
            gridPosition = "sm:col-start-2 sm:row-start-1";
          } else if (id === 4) {
            gridPosition = "sm:col-start-2 sm:row-start-3";
          }
          return (
            <div key={id} className={`w-full sm:shadow-[0px_0px_5px_0px_gray] sm:rounded-[13px] p-3 ${rowSpan} ${gridPosition}`}>
              <QuestionBlock
                id={id}
                show={show}
                question={question}
                parts={parts}
                answer={answers[id]}
                onChange={handleChange}
                error={errors[id]}
              />
            </div>
          );
        })}
      </div>

      {/* <Button
        className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Answers"}
      </Button> */}
      <div className="flex justify-end space-x-5 mt-6">
        <Button
          className="bg-primary-color text-white font-bold py-2 px-4 rounded-lg hover:bg-[#8979FD] transition"
          onClick={() => handleSubmit(0)}
          disabled={loading}
        >
          Save
        </Button>
        <Button
          className="bg-primary-color text-white font-bold py-2 px-4 rounded-lg hover:bg-[#8979FD] transition"
          onClick={() => handleSubmit(1)}
          disabled={loading}
        >
          Save & Proceed
        </Button>
      </div>
    </div>
  );
};

export default Settings;
