import Section from "./Section";
import { useRef } from "react";
import YouTubeEmbed from "../ui/YoutubeEmbed";
import { BackgroundCircles, Gradient } from "../ui/HeroStyle";
import { herobackground } from "../../assets";

const Hero = () => {
  const parallaxRef = useRef(null);
  
  return (
    <Section className="pt-8 lg:pt-32 xl:pt-40" id="hero">
      <div className="container relative" ref={parallaxRef}>
        {/* Background Image */}
        <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%] z-0">
          <img
            src={herobackground}
            className="w-full opacity-30"
            width={1440}
            height={1800}
            alt="hero"
          />
        </div>

        <div className="relative z-10 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 mb-6">
            Let's Start Our Journey{" "}
            <span className="inline-block relative">
              Together{" "}
            </span>
          </h1>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-7 lg:mb-8">
            Fun Fieldtrip With TPL 58
          </p>
        </div>

        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24 z-10">
          <div className="relative z-10 p-0.5 rounded-2xl bg-conic-gradient mx-4 md:mx-8 lg:mx-16">
            <div className="relative bg-white rounded-2xl shadow-lg">
              <div className="h-6 bg-n-10 rounded-t-2xl" />
              <div className="aspect-w-33 aspect-h-40 rounded-b-2xl overflow-hidden md:aspect-w-688 md:aspect-h-490 lg:aspect-w-1024 lg:aspect-h-490">
                <YouTubeEmbed url="https://www.youtube.com/watch?v=3jFdK2ghsdw&pp=ygUWYnJvbW8gcGVzb25hIGluZG9uZXNpYQ%3D%3D" />
              </div>
            </div>
            <Gradient />
          </div>
          <BackgroundCircles />
        </div>
      </div>
    </Section>
  );
};

export default Hero;
