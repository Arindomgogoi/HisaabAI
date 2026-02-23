"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecognition = any;

interface UseVoiceInputReturn {
  isListening: boolean;
  transcript: string;
  supported: boolean;
  startListening: () => void;
  stopListening: () => void;
}

function getSpeechRecognition(): (new () => AnyRecognition) | null {
  if (typeof window === "undefined") return null;
  return (
    (window as Window & { SpeechRecognition?: new () => AnyRecognition }).SpeechRecognition ??
    (window as Window & { webkitSpeechRecognition?: new () => AnyRecognition }).webkitSpeechRecognition ??
    null
  );
}

export function useVoiceInput(
  onResult: (transcript: string) => void
): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<AnyRecognition>(null);

  useEffect(() => {
    setSupported(!!getSpeechRecognition());
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: AnyRecognition) => {
      const text = event.results[0][0].transcript as string;
      setTranscript(text);
      onResult(text);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, [onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, transcript, supported, startListening, stopListening };
}
