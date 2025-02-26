import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function SectionWrapper(props: SectionWrapperProps) {
  const { children, className, ...rest } = props;

  return (
    <section
      className={cn(
        "flex flex-col justify-center items-center w-full space-y-4 py-10 px-8",
        className
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
