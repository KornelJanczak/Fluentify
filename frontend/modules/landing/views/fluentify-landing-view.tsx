import Link from "next/link";
import { ArrowUpRight, BookOpen, MessageCircle, Repeat2 } from "lucide-react";

import { FluentifyNav } from "@/modules/landing/components/fluentify-nav";
import { PracticePreview } from "@/modules/landing/components/practice-preview";

const steps = [
  {
    icon: MessageCircle,
    title: "Speak",
    description: "Bring the half-formed thought, the question, or the story.",
  },
  {
    icon: BookOpen,
    title: "Shape",
    description:
      "See useful corrections in context while the conversation flows.",
  },
  {
    icon: Repeat2,
    title: "Remember",
    description: "Keep the sentence that helped, so it comes back more easily.",
  },
];

export function FluentifyLandingView() {
  return (
    <main className="fluentify-page min-h-screen overflow-hidden bg-[var(--fluent-paper)] text-[var(--fluent-ink)]">
      <div className="fluentify-container mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <FluentifyNav />

        <section
          className="fluentify-hero grid items-center gap-16 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:gap-20 lg:py-28"
          aria-labelledby="hero-title"
        >
          <div className="fluentify-hero-copy max-w-xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--fluent-line)] bg-white px-3 py-1.5 text-xs font-semibold tracking-[0.08em] text-[var(--fluent-muted)] uppercase">
              <span className="size-1.5 rounded-full bg-[var(--fluent-coral)]" />
              English practice for real life
            </p>
            <h1
              id="hero-title"
              className="fluentify-hero-title max-w-[11ch] text-[clamp(3.6rem,8vw,7.4rem)] leading-[0.88] font-semibold tracking-[-0.085em]"
            >
              Say it like you mean it.
            </h1>
            <p className="mt-8 max-w-lg text-base leading-7 text-[var(--fluent-muted)] sm:text-lg">
              Fluentify helps you turn everyday thoughts into natural English
              through patient conversation, useful corrections, and small wins
              you can actually remember.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                className="inline-flex items-center gap-3 rounded-full bg-[var(--fluent-coral)] px-5 py-3.5 text-sm font-semibold text-white shadow-[5px_5px_0_var(--fluent-ink)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0_var(--fluent-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--fluent-ink)]"
                href="/chaat/demo"
              >
                Try a practice chat
                <ArrowUpRight className="size-4" />
              </Link>
              <a
                className="text-sm font-semibold text-[var(--fluent-ink)] underline decoration-[var(--fluent-coral)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--fluent-coral)]"
                href="#how-it-works"
              >
                See how it works
              </a>
            </div>
          </div>
          <div className="fluentify-hero-art relative px-3 py-4 sm:px-8 lg:px-0">
            <div
              className="absolute -right-8 top-0 hidden h-28 w-28 rounded-full border-[14px] border-[var(--fluent-yellow)] lg:block"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-10 -left-2 hidden h-20 w-20 rounded-full bg-[var(--fluent-coral)] lg:block"
              aria-hidden="true"
            />
            <PracticePreview />
          </div>
        </section>

        <section
          id="how-it-works"
          className="fluentify-steps border-t border-[var(--fluent-line)] py-16 sm:py-20"
          aria-labelledby="steps-title"
        >
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div className="fluentify-steps-intro">
              <p className="text-xs font-semibold tracking-[0.12em] text-[var(--fluent-coral)] uppercase">
                A quieter way to improve
              </p>
              <h2
                id="steps-title"
                className="mt-4 max-w-sm text-3xl leading-tight font-semibold tracking-[-0.05em] sm:text-4xl"
              >
                Better English starts with one honest sentence.
              </h2>
            </div>
            <div className="fluentify-step-list grid gap-8 sm:grid-cols-3">
              {steps.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="border-t-2 border-[var(--fluent-ink)] pt-4"
                >
                  <Icon
                    className="mb-7 size-5 text-[var(--fluent-coral)]"
                    aria-hidden="true"
                  />
                  <h3 className="text-xl font-semibold tracking-[-0.04em]">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--fluent-muted)]">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="for-learners"
          className="fluentify-cta mb-8 flex flex-col justify-between gap-8 rounded-[2rem] bg-[var(--fluent-ink)] px-6 py-8 text-white sm:px-10 sm:py-10 md:flex-row md:items-center"
          aria-labelledby="cta-title"
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-[var(--fluent-mint)] uppercase">
              Your next small win
            </p>
            <h2
              id="cta-title"
              className="mt-3 max-w-xl text-2xl leading-tight font-semibold tracking-[-0.04em] sm:text-3xl"
            >
              Bring a thought. Leave with a sentence you&apos;ll use again.
            </h2>
          </div>
          <Link
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--fluent-yellow)] px-5 py-3.5 text-sm font-semibold text-[var(--fluent-ink)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--fluent-yellow)]"
            href="/chaat/demo"
          >
            Open the practice room
            <ArrowUpRight className="size-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
