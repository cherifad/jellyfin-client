"use client";

import { useBgStore } from "@/store/bgStore";
import Header from "@/components/header/header";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";

interface MainProps {
  children: React.ReactNode;
  className?: string;
}

export default function Main({ children, className }: MainProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [mainPadding, setMainPadding] = useState("0");
  const { bgImageUrl, bgImageAlt } = useBgStore();

  useEffect(() => {
    if (headerRef.current) {
      setMainPadding(`${headerRef.current.clientHeight + 5}px`);
    }
  }, [headerRef, headerRef.current ? headerRef.current.clientHeight : 0]);

  return (
    <>
      <Header ref={headerRef} />
      <main
        style={{
          paddingTop: mainPadding,
        }}
        className={`${
          className ? className + " " : ""
        }min-h-screen max-w-screen`}
      >
        <div className="app-backdrop-container">
          <Image
            src={bgImageUrl ?? ""}
            width={1920}
            height={1080}
            className="app-backdrop"
            alt={bgImageAlt ?? ""}
          />
        </div>
        <div className="hero-carousel-background-container -z-50">
          <Image
            src={bgImageUrl ?? ""}
            width={1920}
            height={1080}
            className="hero-carousel-background-image"
            alt={bgImageAlt ?? ""}
          />
        </div>
        <section className="container mx-auto p-4 z-10 relative">
          {children}
        </section>
      </main>
    </>
  );
}
