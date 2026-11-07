import type { ReactNode } from "react";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <span className="text-[var(--fluent-coral)]">{icon}</span>
      <div>
        <h2 className="text-xl font-semibold tracking-[-0.03em]">{title}</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
