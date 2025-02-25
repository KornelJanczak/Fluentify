import * as React from "react";

export default function SectionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col justify-center items-center w-full space-y-4 py-10 px-8  ">
      {children}
    </section>
  );
}
