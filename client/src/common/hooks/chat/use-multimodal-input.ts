"use client";

import type { ChatRequestOptions } from "ai";
import type React from "react";
import { useRef, useEffect, useCallback } from "react";
import { useLocalStorage, useWindowSize } from "usehooks-ts";
import { toast } from "sonner";
import { useSpeechRecognition } from "react-speech-recognition";

interface UseMultiModalInputProps {
  chatId: string;
  input: string;
  isLoading: boolean;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  setInput: (value: string) => void;
}

export const useMultiModalInput = ({
  chatId,
  input,
  isLoading,
  handleSubmit,
  setInput,
}: UseMultiModalInputProps) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textAreaElement = textareaRef.current;
  const { width } = useWindowSize();

  useEffect(() => {
    if (textAreaElement) adjustHeight();
  }, []);

  const adjustHeight = () => {
    if (textAreaElement) {
      textAreaElement.style.height = "auto";
      textAreaElement.style.height = `${textAreaElement.scrollHeight + 2}px`;
    }
  };

  const resetHeight = () => {
    if (textAreaElement) {
      textAreaElement.style.height = "auto";
      textAreaElement.style.height = "98px";
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    ""
  );

  // Function to handle the textarea input change
  useEffect(() => {
    if (!textAreaElement) return;

    // Prefer DOM value over localStorage to handle hydration
    const domValue = textAreaElement.value;
    const finalValue = domValue || localStorageInput || "";
    setInput(finalValue);
    adjustHeight();
    // Only run once after hydration
  }, []);

  // Function to handle transcript change and adjust height
  useEffect(() => {
    if (!listening) return;

    // Append transcript to the current input
    //@ts-ignore
    console.log("input", textAreaElement.value);

    setInput(transcript);

    adjustHeight();
  }, [transcript, listening, setInput, resetTranscript, adjustHeight]);

  // Function to handle input change and adjust height
  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  // Function to handle input change and adjust height
  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    console.log("value", value);

    setInput(value);
    adjustHeight();
  };

  // Function to submit the form
  const submitForm = useCallback(() => {
    window.history.replaceState({}, "", `/dashboard/chat/${chatId}`);

    handleSubmit(undefined);

    resetTranscript();
    setLocalStorageInput("");
    resetHeight();

    if (width && width > 768) textAreaElement?.focus();
  }, [handleSubmit, setLocalStorageInput, width, chatId]);

  // Function to handle keydown event
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    {
      const isEnterKey = event.key === "Enter" && !event.shiftKey;

      if (!isEnterKey) return;

      event.preventDefault();

      if (isLoading)
        return toast.error("Please wait for the model to finish its response!");

      if (!isLoading) submitForm();
    }
  };

  return {
    submitForm,
    handleInput,
    textareaRef,
    onKeyDown,
    browserSupportsSpeechRecognition,
    listening,
  };
};
