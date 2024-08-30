import Section from "./Section";
import Heading from "../ui/Heading";
import { CardDestinasi } from "../ui/CardDestinasi";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Agenda = () => {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.6, 
    triggerOnce: true, 
  });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: 50 });
    }
  }, [controls, inView]);

  return (
    <Section id="agenda" crosses>
      <div className="container relative w-full h-fit">
        <motion.div
          ref={ref}
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          transition={{ duration: 0.6 }}
        >
          <Heading tag="Apa Saja Agenda Kita" title="Agenda Utama" />
          <p className="lg:hidden md:hidden xl:hidden 2xl:hidden flex justify-center item-center mt-[-25px] mb-8 text-n-3 mx-3">Geser ke Samping</p>
        </motion.div>
        <motion.div
          ref={ref}
          className="mt-4"
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <CardDestinasi />
        </motion.div>
      </div>
    </Section>
  );
};

export default Agenda;
