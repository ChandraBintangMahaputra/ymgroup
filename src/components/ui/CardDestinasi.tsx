"use client";
import { BackgroundGradientCard } from "../ui/BackgroundGradientCard";
import { bromo, office } from "../../assets";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export function CardDestinasi() {
  return (
    <div className="relative">
      {/* Mobile View */}
      <div className="block md:hidden lg:hidden xl:hidden 2xl:hidden">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
          }}
          className="w-80 p-8"
        >
          <SwiperSlide>
            <BackgroundGradientCard className="rounded-[20px]  w-[310px] h-[350px] p-5 bg-white">
              <img
                src={bromo}
                alt="Bromo"
                height="300"
                width="300"
                className="object-cover"
              />
              <p className="text-xs text-black mt-2 mb-1 dark:text-neutral-200">
                Bromo
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Mengunjungi Gunung Bromo. Gunung Bromo atau dalam bahasa Tengger dieja "Brama", juga disebut
                Kaldera Tengger, adalah sebuah gunung berapi aktif di Jawa Timur
              </p>
            </BackgroundGradientCard>
          </SwiperSlide>
          <SwiperSlide>
            <BackgroundGradientCard className="rounded-[20px]  w-[310px] h-[350px] p-2 bg-white">
              <img
                src={office}
                alt="office"
                height="300"
                width="300"
                className="object-cover"
              />
              <p className="text-xs text-black mt-2 mb-1 dark:text-neutral-200">
                Company Visit
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Belajar langsung dari industrinya untuk memperoleh pengalaman nyata
              </p>
            </BackgroundGradientCard>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex gap-4 justify-center items-center flex-wrap">
        <BackgroundGradientCard className="rounded-[20px] w-[350px] h-[450px] p-4 bg-white dark:bg-zinc-900">
          <img
            src={bromo}
            alt="Bromo"
            height="300"
            width="300"
            className="object-cover"
          />
          <p className="text-lg text-black mt-4 mb-2 dark:text-neutral-200">
            Bromo
          </p>
          <p className="text-base text-neutral-600 dark:text-neutral-400">
            Mengunjungi Gunung Bromo. Gunung Bromo atau dalam bahasa Tengger dieja "Brama", juga disebut
            Kaldera Tengger, adalah sebuah gunung berapi aktif di Jawa Timur
          </p>
        </BackgroundGradientCard>
        <BackgroundGradientCard className="rounded-[20px] w-[350px] h-[450px] p-4 bg-white dark:bg-zinc-900">
          <img
            src={office}
            alt="office"
            height="300"
            width="300"
            className="object-cover"
          />
          <p className="text-lg text-black mt-4 mb-2 dark:text-neutral-200">
            Company Visit
          </p>
          <p className="text-base text-neutral-600 dark:text-neutral-400">
            Belajar langsung dari industrinya untuk memperoleh pengalaman nyata
          </p>
        </BackgroundGradientCard>
      </div>
    </div>
  );
}
