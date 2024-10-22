import Section from "./Section";
import Heading from "../ui/Heading";
import { kepemimpinan, education, achieve } from "../../assets";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Purpose = () => {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.4,
    triggerOnce: true,
  });

  const [activeTab, setActiveTab] = useState("Kepemimpinan");
  const [tabContentAnimation, setTabContentAnimation] = useState({
    opacity: 0,
    y: 20,
  });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
      if (activeTab === "Kepemimpinan") {
        setTabContentAnimation({ opacity: 1, y: 0 }); // Animate "Kepemimpinan" content when component loads
      }
    } else {
      controls.start({ opacity: 0, y: 50 });
    }
  }, [controls, inView, activeTab]);

  const tabData = [
    {
      name: "Kepemimpinan",
      image: kepemimpinan,
      title: "Kepemimpinan",
      description: "Melatih dan menanamkan jiwa kepemimpinan",
      buttonText: "Read More",
    },
    {
      name: "Capaian Unggulan",
      image: achieve,
      title: "Capaian Unggulan",
      description: "Membuka potensi diri dan raih banyak prestasi",
      buttonText: "Read More",
    },
    {
      name: "Beasiswa",
      image: education,
      title: "Beasiswa",
      description: "Pelajari tips jitu lolos seleksi beasiswa",
      buttonText: "Read More",
    },
  ];

  // Handle tab change
  const handleTabClick = (tabName: string) => {
    setTabContentAnimation({ opacity: 0, y: 20 }); // Start with hidden content
    setTimeout(() => {
      setActiveTab(tabName);
      setTabContentAnimation({ opacity: 1, y: 0 }); // Animate content in
    }, 200); // Delay for smoother transition
  };

  return (
    <Section className="pt-30 mt-60 lg:pt-30 xl:pt-25" id="program" crosses>
      <div className="container flex flex-col items-center w-full h-fit">
        <div className="w-full flex flex-col items-center lg:flex-row lg:justify-between lg:items-start">
          <motion.div
            ref={ref}
            className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start"
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            transition={{ duration: 0.6 }}
          >
            <Heading title="Program" />
            <h4 className="text-n-4 max-w-96 text-lg text-center mx-auto lg:flex lg:justify-center lg:text-center">
              Scaling Yourself memiliki 3 program unggulan yang dapat
              membantumu meng-upgrade diri: Pembinaan jiwa kepemimpinan,
              pembinaan capaian unggulan, dan pembinaan beasiswa. Kamu dapat
              menemukan potensi terbaik dalam dirimu melalui program-program
              yang kami sediakan.
            </h4>
          </motion.div>

          {/* Desktop Image and Tabs */}
          <motion.div
            className="hidden lg:block w-full lg:w-1/2 flex flex-col items-center justify-center lg:justify-end mt-4 lg:pr-8 lg:mt-0"
            initial={{ opacity: 0, x: 50 }}
            animate={controls}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Tabs for desktop */}
            <div className="flex space-x-4 mb-4">
              {tabData.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => handleTabClick(tab.name)}
                  className={`px-4 py-2 border-b-2 transition duration-300 ${
                    activeTab === tab.name
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            {/* Desktop Image */}
            <div className="relative group">
              <motion.img
                src={tabData.find((tab) => tab.name === activeTab)?.image}
                alt="Gambar tujuan fieldtrip"
                className="w-full lg:w-100 md:w-100 lg:mr-8 h-48 lg:h-80 object-cover rounded-lg shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
              {/* Overlay Content */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={tabContentAnimation}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xl font-bold mb-2">
                  {tabData.find((tab) => tab.name === activeTab)?.title}
                </h3>
                <p className="text-center mb-4">
                  {tabData.find((tab) => tab.name === activeTab)?.description}
                </p>
                <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                  {tabData.find((tab) => tab.name === activeTab)?.buttonText}
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Mobile Image and Tabs */}
          <div className="w-full lg:hidden mt-6">
            {/* Tabs for mobile */}
            <div className="flex space-x-2 mb-4">
              {tabData.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => handleTabClick(tab.name)}
                  className={`px-2 py-2 text-sm border-b-2 transition duration-300 w-1/3 text-center ${
                    activeTab === tab.name
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            <div className="relative group">
              <motion.img
                src={tabData.find((tab) => tab.name === activeTab)?.image}
                alt="Gambar tujuan fieldtrip"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
              {/* Overlay Content */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={tabContentAnimation}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xl font-bold mb-2">
                  {tabData.find((tab) => tab.name === activeTab)?.title}
                </h3>
                <p className="text-center mb-4">
                  {tabData.find((tab) => tab.name === activeTab)?.description}
                </p>
                <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                  {tabData.find((tab) => tab.name === activeTab)?.buttonText}
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Purpose;
