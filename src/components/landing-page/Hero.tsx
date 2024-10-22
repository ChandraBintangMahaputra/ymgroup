import Section from "./Section";
import { useRef } from "react";

const Hero = () => {
  const parallaxRef = useRef(null);

  return (
    <Section className="" id="hero">
      {/* Full width container without side padding */}
      <div className="relative w-full" ref={parallaxRef}>
        {/* Black Background */}
        <div className="absolute -top-[138%] lg:-top[-64%] left-0 w-full z-0 bg-black h-[600px] lg:h-[700px]" />

        <div className="relative z-10 max-w-[62rem] mx-auto text-center mb-[1.875rem] md:mb-10 lg:mb-[2.25rem] lg:pt-20">
          <h3 className="h1 mb-6 mt-0 pt-0 md:mt-0 md:pt-0 text-white">
            <span className="block md:inline">Scaling</span>{" "}
            <span className="block md:inline">Yourself</span>
          </h3>
          <h3 className="body-1 max-w-3xl mx-auto mb-6 text-n-7 lg:mb-8 text-white">
            Be Better, Grow Together
          </h3>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
