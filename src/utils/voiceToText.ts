export interface VoiceToTextOptions {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

class VoiceToText {
  private recognition: SpeechRecognition | null = null;
  private options: VoiceToTextOptions;

  constructor(options: VoiceToTextOptions) {
    this.options = options;

    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      throw new Error("SpeechRecognition API is not supported in this browser.");
    }

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = options.language;
    recognition.continuous = options.continuous;
    recognition.interimResults = options.interimResults;

    this.recognition = recognition;

    this.bindEvents();
  }

  private bindEvents() {
    if (!this.recognition) return;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      if (event.results[event.results.length - 1].isFinal) {
        this.options.onResult(transcript.trim());
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (this.options.onError) {
        this.options.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      if (this.options.onEnd) {
        this.options.onEnd();
      }
    };
  }

  public start() {
    if (!this.recognition) return;
    this.recognition.start();
  }

  public stop() {
    if (!this.recognition) return;
    this.recognition.stop();
  }

  public abort() {
    if (!this.recognition) return;
    this.recognition.abort();
  }

  public updateOptions(newOptions: Partial<VoiceToTextOptions>) {
    if (!this.recognition) return;

    if (newOptions.language) this.recognition.lang = newOptions.language;
    if (newOptions.continuous !== undefined) this.recognition.continuous = newOptions.continuous;
    if (newOptions.interimResults !== undefined)
      this.recognition.interimResults = newOptions.interimResults;
  }
}

export default VoiceToText;
