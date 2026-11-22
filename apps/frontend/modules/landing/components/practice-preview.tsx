import { ArrowUpRight, Check, Sparkles } from "lucide-react";

export function PracticePreview() {
  return (
    <div className="fluentify-preview relative mx-auto max-w-[550px] rotate-[1.5deg] rounded-[2rem] border border-[var(--fluent-line)] bg-white p-3 shadow-[16px_18px_0_var(--fluent-mint)] sm:p-5">
      <div className="fluentify-preview-inner rounded-[1.35rem] border border-[var(--fluent-line)] bg-[var(--fluent-paper)] p-5 sm:p-7">
        <div className="mb-8 flex items-center justify-between border-b border-[var(--fluent-line)] pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-[var(--fluent-muted)] uppercase">
            <span className="size-2 rounded-full bg-[var(--fluent-coral)]" />
            Practice room
          </div>
          <span className="text-xs text-[var(--fluent-muted)]">
            Today, 09:42
          </span>
        </div>
        <div className="space-y-5">
          <div className="ml-auto max-w-[86%] rounded-2xl rounded-br-sm bg-[var(--fluent-mint)] px-4 py-3 text-sm leading-6 text-[var(--fluent-ink)]">
            I want to say that I&apos;m getting used to speaking with more
            confidence.
          </div>
          <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--fluent-ink)] text-xs font-bold text-white">
              F
            </div>
            <div className="space-y-3 text-sm leading-6 text-[var(--fluent-ink)]">
              <p>
                That&apos;s a clear thought. A more natural version would be:
              </p>
              <div className="rounded-xl border-l-4 border-[var(--fluent-coral)] bg-white px-4 py-3 font-medium">
                I&apos;m getting more confident when I speak.
              </div>
              <p className="flex items-center gap-2 text-xs text-[var(--fluent-muted)]">
                <Check className="size-3.5 text-[var(--fluent-green)]" />
                Same meaning, smoother rhythm.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-[var(--fluent-line)] pt-4">
          <span className="flex items-center gap-2 text-xs font-medium text-[var(--fluent-muted)]">
            <Sparkles className="size-3.5 text-[var(--fluent-yellow)]" />
            Small win saved
          </span>
          <ArrowUpRight className="size-4 text-[var(--fluent-coral)]" />
        </div>
      </div>
    </div>
  );
}
