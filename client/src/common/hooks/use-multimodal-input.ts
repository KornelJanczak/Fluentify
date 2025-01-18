"use client";

import type { ChatRequestOptions } from "ai";
import type React from "react";
import { useRef, useEffect, useCallback } from "react";
import { useLocalStorage, useWindowSize } from "usehooks-ts";
import { toast } from "sonner";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 2
      }px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "98px";
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    ""
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || "";
      setInput(finalValue);
      adjustHeight();
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  // Function to submit the form
  const submitForm = useCallback(() => {
    window.history.replaceState({}, "", `/dashboard/chat/${chatId}`);

    handleSubmit(undefined);

    setLocalStorageInput("");
    resetHeight();

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [handleSubmit, setLocalStorageInput, width, chatId]);

  // Function to handle keydown event
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        console.log("acab");

        if (isLoading) {
          toast.error("Please wait for the model to finish its response!");
        } else {
          submitForm();
        }
      }
    }
  };

  return { submitForm, handleInput, textareaRef, onKeyDown };
};
