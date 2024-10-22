import Header from "./components/landing-page/Header";
import Hero from "./components/landing-page/Hero";
import Purpose from "./components/landing-page/Purpose";
import { Contact } from "./components/landing-page/Contact";
import Footer from "./components/landing-page/Footer";
import { useEffect, useRef } from "react";
import axios from "axios";




const App = () => {

  const hasSentDate = useRef(false);

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const sendDateToApi = async () => {
  const formattedDate = getCurrentDate();
  try {
    const response = await axios.post(`${import.meta.env.VITE_PREFIX_BACKEND}/api/auth/add-visitor`, {
      date: formattedDate,
    });
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error sending date:", error);
  }
};

useEffect(() => {
  if (!hasSentDate.current) {
    sendDateToApi();
    hasSentDate.current = true;
  }
  document.title = "Scaling Yourself";
}, []);

  return (
    <main>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Purpose />
        <Contact />
        <Footer />
      </div>
    </main>
  );
};
export default App;
