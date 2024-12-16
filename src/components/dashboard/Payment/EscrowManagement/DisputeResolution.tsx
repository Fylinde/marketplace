import React, { useState } from "react";
import { useDispatch } from "react-redux";
import DisputeAssistance from "./DisputeAssistance"; // Correct import path
import FileUploader from "./FileUploader";
import type { AppDispatch } from "../../../../redux/store";
import { submitEvidence } from "../../../../redux/slices/orders/escrowSlice"; // Update import path

const DisputeResolution = ({ transaction }: { transaction: any }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [evidence, setEvidence] = useState("");

  const handleSubmitEvidence = async (files: File[]) => {
    if (!evidence && files.length === 0) {
      alert("Please provide evidence or upload files.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("transactionId", transaction.id);
      formData.append("evidence", evidence);
      files.forEach((file) => formData.append("files", file));

      await dispatch(submitEvidence(formData)).unwrap();
      alert("Evidence submitted successfully.");
    } catch (error) {
      alert(`Failed to submit evidence: ${error}`);
    }
  };

  return (
    <div>
      <h2>Dispute Resolution for Transaction: {transaction.id}</h2>
      <p><strong>Status:</strong> {transaction.status}</p>
      <p><strong>Dispute Reason:</strong> {transaction.disputeReason}</p>
      <p><strong>Resolution Status:</strong> {transaction.resolutionStatus || "Pending"}</p>
      <textarea
        placeholder="Enter evidence details"
        value={evidence}
        onChange={(e) => setEvidence(e.target.value)}
      ></textarea>
      <FileUploader onUpload={handleSubmitEvidence} />
      <DisputeAssistance transactionId={transaction.id} />
    </div>
  );
};

export default DisputeResolution;
