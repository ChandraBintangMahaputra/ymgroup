import { Link, useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { scale, scaleWhite } from "../../assets"; // Updated to include both logos
import { navigation } from "../../constants";
import Button from "../ui/Button";
import MenuSvg from "../../assets/svg/MenuSvg";
import { HamburgerMenu } from "../ui/Header";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const location = useLocation();
  const [openNavigation, setOpenNavigation] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false); // Track scroll state
  const prevHash = useRef<string>("");

  useEffect(() => {
    if (location.hash !== prevHash.current) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
      prevHash.current = location.hash;
    }
  }, [location.pathname, location.hash]);

  // Handle scrolling to change navbar background and logo
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  const navigate = useNavigate();

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        openNavigation
          ? "bg-white text-black" // Saat menu dibuka
          : isScrolled
          ? "bg-white/90 text-black" // Saat user scroll
          : "bg-transparent text-white" // Default transparan saat belum dibuka dan tidak discroll
      } ${
        !isScrolled && !openNavigation ? "lg:bg-transparent bg-transparent" : ""
      }`}
    >
      <div className="flex flex-col lg:flex-row justify-between items-center px-5 lg:px-7.5 xl:px-10">
        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-0 left-0 right-0 bottom-0 bg-white lg:static lg:flex lg:mx-auto lg:bg-transparent lg:flex lg:justify-center lg:items-center lg:w-full lg:items-center`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            <div
              className={`${
                openNavigation ? "flex" : "hidden"
              } lg:hidden flex flex-col items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-9999`}
              onClick={() => navigate(`/`)}
            >
              <img
                src={isScrolled ? scale : scaleWhite}
                width={150}
                height={40}
                className="p-5"
                alt="tpl"
              />
            </div>
            {navigation.map((item) => {
              const isActive =
                location.pathname === item.url ||
                location.hash === `#${item.id}`;
              return (
                <Link
                  key={item.id}
                  to={item.title === "About" ? item.url : `${item.url}`}
                  target={item.url.startsWith("https://") ? "_blank" : "_self"}
                  onClick={handleClick}
                  className={`block relative font-code text-2xl uppercase transition-colors lg:flex lg:justify-center lg:items-center ${
                    openNavigation
                      ? isActive
                        ? "text-black font-bold" // Menu aktif saat dibuka
                        : "text-black/50 hover:text-purple-500" // Menu lainnya saat dibuka
                      : isScrolled
                      ? isActive
                        ? "text-black font-bold"
                        : "text-black/50 hover:text-purple-500"
                      : isActive
                      ? "text-white font-bold"
                      : "text-white/70 hover:text-white"
                  } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-sm lg:font-semibold lg:leading-5`}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex lg:order-last lg:pr-10 lg:items-center">
            <img
              src={isScrolled ? scale : scaleWhite} // Change logo on scroll
              width={150}
              height={40}
              alt="otsuka"
              className="cursor-pointer"
              onClick={() => navigate(`/`)}
            />
          </div>

          <HamburgerMenu />
        </nav>

        <Button
          className="ml-auto lg:hidden lg:order-3 order-1"
          px="px-3"
          onClick={toggleNavigation}
        >
           <MenuSvg openNavigation={openNavigation} fillColor={openNavigation ? "black" : isScrolled ? "black" : "white"} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
