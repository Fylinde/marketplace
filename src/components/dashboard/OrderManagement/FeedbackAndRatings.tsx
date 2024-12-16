import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFeedback, respondToFeedback } from "../../../redux/slices/support/feedbackSlice";
import { getLocalizedText } from "../../../utils/localizationUtils";
import type { AppDispatch, RootState } from "../../../redux/store";
import type { Feedback } from "../../../services/feedbackService";

const FeedbackAndRatings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { feedbackList, loading, error, averageRating } = useSelector(
    (state: RootState) => state.feedback
  );
  const [responseText, setResponseText] = useState<string>("");
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllFeedback());
  }, [dispatch]);

  const handleRespondToFeedback = async () => {
    if (!selectedFeedbackId || !responseText.trim()) {
      alert(getLocalizedText("responseTextEmptyError", "feedbackAndRatings"));
      return;
    }

    try {
      await dispatch(
        respondToFeedback({ feedbackId: selectedFeedbackId, response: responseText })
      ).unwrap();
      alert(getLocalizedText("responseSuccess", "feedbackAndRatings"));
      setResponseText("");
      setSelectedFeedbackId(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      alert(getLocalizedText("responseError", "feedbackAndRatings", { error: errorMessage }));
    }
  };

  const renderFeedbackDetails = () => {
    const selectedFeedback = feedbackList.find(
      (item: Feedback) => item.id === selectedFeedbackId
    );
    if (!selectedFeedback) return null;

    return (
      <div className="feedback-details">
        <h3>{getLocalizedText("feedbackDetails", "feedbackAndRatings")}</h3>
        <p>
          <strong>{getLocalizedText("customerName", "feedbackAndRatings")}:</strong>{" "}
          {selectedFeedback.customerName}
        </p>
        <p>
          <strong>{getLocalizedText("rating", "feedbackAndRatings")}:</strong>{" "}
          {selectedFeedback.rating}/5
        </p>
        <p>
          <strong>{getLocalizedText("comment", "feedbackAndRatings")}:</strong>{" "}
          {selectedFeedback.comment}
        </p>
        <textarea
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          placeholder={getLocalizedText("responsePlaceholder", "feedbackAndRatings")}
        />
        <button onClick={handleRespondToFeedback}>
          {getLocalizedText("submitResponse", "feedbackAndRatings")}
        </button>
      </div>
    );
  };

  const renderFeedbackList = () => {
    return (
      <div className="feedback-list">
        <h3>{getLocalizedText("allFeedback", "feedbackAndRatings")}</h3>
        <ul>
          {feedbackList.map((item: Feedback) => (
            <li
              key={item.id}
              className={item.id === selectedFeedbackId ? "active" : ""}
              onClick={() => setSelectedFeedbackId(item.id)}
            >
              <p>
                <strong>{getLocalizedText("customerName", "feedbackAndRatings")}:</strong>{" "}
                {item.customerName}
              </p>
              <p>
                <strong>{getLocalizedText("rating", "feedbackAndRatings")}:</strong>{" "}
                {item.rating}/5
              </p>
              <p>
                <strong>{getLocalizedText("comment", "feedbackAndRatings")}:</strong>{" "}
                {item.comment}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) return <p>{getLocalizedText("loading", "common")}</p>;
  if (error) {
    const errorMessage = typeof error === "string" ? error : String(error);
    return (
      <p>{getLocalizedText("errorFetchingFeedback", "feedbackAndRatings", { error: errorMessage })}</p>
    );
  }

  return (
    <div className="feedback-and-ratings">
      <h1>{getLocalizedText("feedbackAndRatings", "feedbackAndRatings")}</h1>
      <div className="summary">
        <h3>
          {getLocalizedText("averageRating", "feedbackAndRatings")}: {averageRating}/5
        </h3>
      </div>
      <div className="feedback-container">
        {renderFeedbackList()}
        {renderFeedbackDetails()}
      </div>
    </div>
  );
};

export default FeedbackAndRatings;
