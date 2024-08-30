import Header from "./components/landing-page/Header";
import Hero from "./components/landing-page/Hero";
import Purpose from "./components/landing-page/Purpose";
import Agenda from "./components/landing-page/Agenda";
import { Contact } from "./components/landing-page/Contact";
import Footer from "./components/landing-page/Footer";


const App = () => {
  return (
    <main>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Purpose />
        <Agenda />
        <Contact />
        <Footer />
      </div>
    </main>
  );
};
export default App;
