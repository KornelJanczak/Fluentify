import Link from "next/link";

export function FluentifyNav() {
  return (
    <nav
      className="fluentify-nav flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b border-[var(--fluent-line)] py-5"
      aria-label="Main navigation"
    >
      <Link
        className="fluentify-brand group flex items-center gap-2 text-lg font-semibold tracking-[-0.04em] text-[var(--fluent-ink)]"
        href="/"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-[var(--fluent-coral)] text-sm font-bold text-white transition-transform group-hover:rotate-[-8deg]">
          F
        </span>
        Fluentify
      </Link>
      <div className="fluentify-nav-links flex items-center gap-5 text-sm font-medium text-[var(--fluent-muted)] sm:gap-8">
        <a
          className="hidden transition-colors hover:text-[var(--fluent-ink)] sm:inline"
          href="#how-it-works"
        >
          How it works
        </a>
        <a
          className="hidden transition-colors hover:text-[var(--fluent-ink)] sm:inline"
          href="#for-learners"
        >
          For learners
        </a>
        <Link
          className="transition-colors hover:text-[var(--fluent-ink)]"
          href="/auth"
        >
          Sign in
        </Link>
        <Link
          className="fluentify-nav-cta rounded-full bg-[var(--fluent-ink)] px-4 py-2.5 text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--fluent-coral)]"
          href="/chaat/demo"
        >
          Start practising
        </Link>
      </div>
    </nav>
  );
}
