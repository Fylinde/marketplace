import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDisputes,
  resolveDispute,
  escalateDispute,
} from "../../../redux/slices/support/disputeSlice";
import { getLocalizedText } from "../../../utils/localizationUtils";
import type { AppDispatch, RootState } from "../../../redux/store";

const DisputeManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { disputes, loading, error } = useSelector((state: RootState) => state.disputes);

  const [activeDisputeId, setActiveDisputeId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState<string>("");

  useEffect(() => {
    dispatch(fetchDisputes());
  }, [dispatch]);

  const handleResolveDispute = async () => {
    if (!activeDisputeId || !resolutionNote) {
      alert(getLocalizedText("resolutionNoteError", "disputeManagement"));
      return;
    }

    try {
      await dispatch(
        resolveDispute({ disputeId: activeDisputeId!, resolutionNote })
      ).unwrap();
      alert(getLocalizedText("disputeResolved", "disputeManagement"));
      setActiveDisputeId(null);
      setResolutionNote("");
    } catch (err) {
      alert(
        getLocalizedText("resolveDisputeError", "disputeManagement", {
          error: err instanceof Error ? err.message : "Unknown error",
        })
      );
    }
  };


  const handleEscalateDispute = async (disputeId: string) => {
    try {
      await dispatch(escalateDispute(disputeId)).unwrap();
      alert(getLocalizedText("disputeEscalated", "disputeManagement"));
    } catch (err) {
      const errorMessage = typeof err === "string" ? err : "Unknown error occurred";
      alert(getLocalizedText("escalateDisputeError", "disputeManagement", { error: errorMessage }));
    }
  };

  const renderDisputeDetails = () => {
    const activeDispute = disputes.find((dispute) => dispute.id === activeDisputeId);
    if (!activeDispute) return <p>{getLocalizedText("selectDispute", "disputeManagement")}</p>;

    return (
      <div className="dispute-details">
        <h2>{getLocalizedText("disputeDetails", "disputeManagement")}</h2>
        <p>
          <strong>{getLocalizedText("disputeId", "disputeManagement")}: </strong>
          {activeDispute.id}
        </p>
        <p>
          <strong>{getLocalizedText("orderId", "common")}: </strong>
          {activeDispute.orderId}
        </p>
        <p>
          <strong>{getLocalizedText("status", "common")}: </strong>
          {activeDispute.status}
        </p>
        <textarea
          placeholder={getLocalizedText("resolutionNote", "disputeManagement")}
          value={resolutionNote}
          onChange={(e) => setResolutionNote(e.target.value)}
        />
        <button onClick={handleResolveDispute}>
          {getLocalizedText("resolveDispute", "disputeManagement")}
        </button>
        <button onClick={() => handleEscalateDispute(activeDispute.id)}>
          {getLocalizedText("escalateDispute", "disputeManagement")}
        </button>
      </div>
    );
  };

  const renderDisputeList = () => (
    <ul>
      {disputes.map((dispute) => (
        <li key={dispute.id} onClick={() => setActiveDisputeId(dispute.id)}>
          <p>
            <strong>{getLocalizedText("disputeId", "disputeManagement")}: </strong>
            {dispute.id}
          </p>
          <p>
            <strong>{getLocalizedText("orderId", "common")}: </strong>
            {dispute.orderId}
          </p>
          <p>
            <strong>{getLocalizedText("status", "common")}: </strong>
            {dispute.status}
          </p>
        </li>
      ))}
    </ul>
  );

  if (loading) return <p>{getLocalizedText("loading", "common")}</p>;
  if (error) {
    const errorMessage = typeof error === "string" ? error : "Unknown error occurred";
    return (
      <p>
        {getLocalizedText("errorFetchingDisputes", "disputeManagement", { error: errorMessage })}
      </p>
    );
  }

  return (
    <div className="dispute-management">
      <h1>{getLocalizedText("disputeManagement", "disputeManagement")}</h1>
      <div className="dispute-container">
        <div className="dispute-list">{renderDisputeList()}</div>
        <div className="dispute-details-container">{renderDisputeDetails()}</div>
      </div>
    </div>
  );
};

export default DisputeManagement;
