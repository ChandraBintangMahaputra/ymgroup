import Section from "./Section";
import Heading from "../ui/Heading";
import { purposeImage } from "../../assets";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Purpose = () => {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.4, 
    triggerOnce: true, 
  });

  useEffect(() => {
    console.log("inView:", inView); 
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: 50 });
    }
  }, [controls, inView]);

  return (
    <Section id="tujuan" crosses>
      <div className="container flex flex-col items-center w-full h-fit">
        <div className="w-full flex flex-col items-center lg:flex-row lg:justify-between lg:items-start">
          <motion.div
            ref={ref}
            className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start"
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            transition={{ duration: 0.6 }}
          >
            <Heading tag="Mengapa Fieldtrip Diadakan" title="Tujuan" />
            <div className="w-full lg:hidden">
              <motion.img
                src={purposeImage}
                alt="Gambar tujuan fieldtrip"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
                initial={{ opacity: 0 }}
                animate={controls}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
            </div>
            <h4 className="text-n-4 max-w-96 text-lg mt-4 lg:mt-2 text-center mx-auto lg:flex lg:justify-center lg:text-center">
              Fieldtrip merupakan agenda yang diadakan untuk mengunjungi
              perusahaan (Company Visit) yang sejalan dengan program studi
              Teknologi Rekayasa Perangkat Lunak, yang mana diharapkan mahasiswa
              dapat belajar dari industri secara langsung. Selain itu, para
              mahasiswa nantinya juga akan mengujungi beberapa tempat wisata.
            </h4>
          </motion.div>
          <motion.div
            className="hidden lg:block w-full lg:w-1/2 flex justify-center lg:justify-end mt-4 lg:pr-8 lg:mt-0"
            initial={{ opacity: 0, x: 50 }}
            animate={controls}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.img
              src={purposeImage}
              alt="Gambar tujuan fieldtrip"
              className="w-70 lg:mr-8 h-auto object-cover rounded-lg shadow-lg"
              initial={{ opacity: 0 }}
              animate={controls}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default Purpose;
