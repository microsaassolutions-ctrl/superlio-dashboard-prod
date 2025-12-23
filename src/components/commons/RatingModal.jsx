import React, { useState } from "react";
import { FiStar, FiX } from "react-icons/fi";
import { post } from "../../api/apiService";
import { successToaster, errorToaster } from "../../utils/toaster";
import { Overlay } from "./index";

const CHROME_STORE_REVIEW_URL = "https://chromewebstore.google.com/detail/Superlio.ai/bmaobmmbobbmddkdjilonehnhopdgbkj/reviews";

const RatingModal = ({ onClose }) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [step, setStep] = useState("rate"); // "rate" | "feedback" | "chrome"
    const [feedback, setFeedback] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleStarClick = (starValue) => {
        setRating(starValue);
    };

    const handleSubmitRating = () => {
        if (rating === 0) return;

        if (rating <= 4) {
            setStep("feedback");
        } else {
            setStep("chrome");
        }
    };

    const handleSubmitFeedback = async () => {
        if (!feedback.trim()) {
            errorToaster("Please share your feedback");
            return;
        }

        setIsSubmitting(true);
        try {
            await post("/content/feedback", {
                rating,
                feedback,
                source: "dashboard_rating_modal"
            });
            successToaster("Thank you for your feedback! We truly appreciate it. 💜");
            onClose();
        } catch (error) {
            console.error("Error submitting feedback:", error);
            errorToaster("Failed to submit feedback. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChromeStoreRedirect = () => {
        // Open Chrome Store directly
        window.open(CHROME_STORE_REVIEW_URL, "_blank");
        onClose();
    };

    const renderStars = () => {
        return (
            <div className="flex justify-center space-x-2 my-6">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                    >
                        <FiStar
                            className={`w-10 h-10 transition-colors ${star <= (hoveredRating || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                                }`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    const renderRatingLabels = () => {
        const labels = ["", "Poor", "Fair", "Good", "Great", "Amazing!"];
        const displayRating = hoveredRating || rating;
        return (
            <p className={`text-center text-sm font-medium h-5 transition-opacity ${displayRating ? "opacity-100" : "opacity-0"}`}>
                {labels[displayRating]}
            </p>
        );
    };

    return (
        <Overlay onClose={onClose}>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-xl rounded-xl w-[420px] font-sans text-gray-800">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <FiX className="w-5 h-5" />
                </button>

                {step === "rate" && (
                    <>
                        <h2 className="text-2xl font-bold mb-1 text-gray-900 text-center">
                            How's your experience?
                        </h2>
                        <p className="text-gray-500 text-sm mb-4 text-center">
                            Your feedback helps us improve Superlio for everyone.
                        </p>

                        {renderStars()}
                        {renderRatingLabels()}

                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleSubmitRating}
                                disabled={rating === 0}
                                className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md ${rating > 0
                                    ? "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                Continue
                            </button>
                        </div>
                    </>
                )}

                {step === "feedback" && (
                    <>
                        <h2 className="text-2xl font-bold mb-1 text-gray-900 text-center">
                            We'd love to hear more 💜
                        </h2>
                        <p className="text-gray-500 text-sm mb-4 text-center">
                            What can we do to improve your experience?
                        </p>

                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Tell us what's on your mind..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-700 resize-none h-32"
                        />

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setStep("rate")}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmitFeedback}
                                disabled={isSubmitting}
                                className="px-8 py-2.5 bg-[#8B5CF6] text-white font-bold rounded-lg hover:bg-[#7C3AED] transition shadow-md flex items-center gap-2"
                            >
                                {isSubmitting && (
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {isSubmitting ? "Sending..." : "Submit Feedback"}
                            </button>
                        </div>
                    </>
                )}

                {step === "chrome" && (
                    <>
                        <h2 className="text-2xl font-bold mb-1 text-gray-900 text-center">
                            You're awesome! 🎉
                        </h2>
                        <p className="text-gray-500 text-sm mb-6 text-center">
                            Would you help others discover Superlio by leaving a quick review on the Chrome Web Store?
                        </p>

                        <div className="bg-purple-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-purple-800 text-center">
                                ✨ A review takes just 30 seconds and means the world to our small team!
                            </p>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                            >
                                Maybe Later
                            </button>
                            <button
                                onClick={handleChromeStoreRedirect}
                                className="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition shadow-md flex items-center gap-2"
                            >
                                <FiStar className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                                Leave a Review
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Overlay>
    );
};

export default RatingModal;
