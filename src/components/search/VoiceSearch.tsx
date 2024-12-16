import React, { useState } from "react";
import VoiceToText from "../../utils/voiceToText";
import IconButton from "../buttons/IconButton";
import Icon from "../icon/Icon";

interface VoiceSearchProps {
  onTranscript: (transcript: string) => void;
  language?: string;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onTranscript, language = "en-US" }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const voiceToText = new VoiceToText({
    language,
    continuous: false,
    interimResults: true,
    onResult: (transcript) => {
      setIsListening(false);
      onTranscript(transcript);
    },
    onError: (err) => {
      setIsListening(false);
      setError(err);
    },
    onEnd: () => {
      setIsListening(false);
    },
  });

  const handleStartListening = () => {
    setIsListening(true);
    setError(null);
    voiceToText.start();
  };

  const handleStopListening = () => {
    setIsListening(false);
    voiceToText.stop();
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <IconButton onClick={isListening ? handleStopListening : handleStartListening}>
        <Icon
          variant="small"
          style={{
            color: isListening ? "var(--primary-main)" : "var(--text-hint)", // Custom theme colors
          }}
        >
          {isListening ? "mic" : "mic_off"}
        </Icon>
      </IconButton>
      {isListening && <span>Listening...</span>}
      {error && <span style={{ color: "red" }}>Error: {error}</span>}
    </div>
  );
};

export default VoiceSearch;
