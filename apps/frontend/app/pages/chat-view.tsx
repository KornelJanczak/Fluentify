"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import { getAccessToken } from "@/modules/auth/api";
import {
  sendStudyChatMessage,
  type Inspector,
} from "@/modules/study-chat/api";

type ChatViewProps = { flashcardSetId: string };
type ChatMessage = {
  id: number;
  type: "human" | "ai";
  content: string;
};

export default function ChatView({ flashcardSetId }: ChatViewProps) {
  const [languageLevel, setLanguageLevel] = useState("B2");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inspector, setInspector] = useState<Inspector | null>(null);
  const [accessToken] = useState<string | null>(() =>
    typeof window === "undefined" ? null : getAccessToken()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;
    if (!accessToken) {
      setError("Sign in before entering the practice room.");
      return;
    }

    setMessage("");
    setError("");
    setIsLoading(true);
    setMessages((current) => [...current, { id: Date.now(), type: "human", content: trimmed }]);

    try {
      const result = await sendStudyChatMessage(
        flashcardSetId,
        trimmed,
        languageLevel,
        accessToken,
      );
      setMessages((current) => [...current, { id: Date.now() + 1, type: "ai", content: result.response }]);
      setInspector(result.inline_inspector);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The tutor could not process that message.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="chat-shell">
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="brand" href="/">Second Tongue</Link>
        <span className="route-note">Practice room / {flashcardSetId}</span>
      </nav>
      <header className="topbar">
        <div>
          <p className="kicker">English practice room</p>
          <h1>Speak freely. Get sharper.</h1>
        </div>
        <span className={`connection connection-${isLoading ? "connecting" : "ready"}`}>
          <span className="connection-dot" /> {isLoading ? "thinking" : "ready"}
        </span>
      </header>
      <section className="workspace">
        <div className="conversation-panel">
          <div className="conversation-intro">
            <span className="intro-mark">EN</span>
            <div>
              <p className="eyebrow">Live tutor</p>
              <h2>Make your next sentence count.</h2>
              <p>Write naturally. The tutor replies as it thinks and quietly marks useful corrections.</p>
            </div>
          </div>
          <div className="messages" aria-live="polite">
            {messages.length === 0 && <p className="empty-state">Your conversation will appear here.</p>}
            {messages.map((item) => (
              <article className={`message message-${item.type === "human" ? "user" : "assistant"}`} key={item.id}>
                <span className="message-label">{item.type === "human" ? "You" : "Tutor"}</span>
                <p>{item.content}</p>
              </article>
            ))}
            {isLoading && <span className="typing">Tutor is composing<span>...</span></span>}
          </div>
          <form className="composer" onSubmit={sendMessage}>
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tell your tutor what is on your mind..." aria-label="Message" maxLength={4000} disabled={isLoading} />
            <button type="submit" disabled={!message.trim() || isLoading}>Send <span aria-hidden="true">↗</span></button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
        <aside className="practice-panel">
          <div className="panel-section">
            <p className="eyebrow">Session setup</p>
            <p className="set-reference">Set <strong>{flashcardSetId}</strong></p>
            <label htmlFor="level">English level</label>
            <select id="level" value={languageLevel} onChange={(event) => setLanguageLevel(event.target.value)}>
              {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => <option key={level}>{level}</option>)}
            </select>
          </div>
          <div className="panel-section inspector-section">
            <p className="eyebrow">Inline inspector</p>
            {inspector?.errors.length ? (
              <div className="corrections">
                <p className="correction-summary">{inspector.errors.length} useful correction{inspector.errors.length === 1 ? "" : "s"}</p>
                {inspector.errors.map((item, index) => <div className="correction" key={`${item.error_type}-${index}`}><p><del>{item.original_fragment}</del> <strong>{item.corrected_fragment}</strong></p><small>{item.explanation}</small></div>)}
              </div>
            ) : <p className="inspector-empty">Send a message to see language notes here.</p>}
          </div>
        </aside>
      </section>
    </main>
  );
}