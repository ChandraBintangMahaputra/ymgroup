import { Link, useLocation, useNavigate } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { tpl } from "../../assets";
import { navigation } from "../../constants";
import Button from "../ui/Button";
import MenuSvg from "../../assets/svg/MenuSvg";
import { HamburgerMenu } from "../ui/Header";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const location = useLocation();
  const [openNavigation, setOpenNavigation] = useState<boolean>(false);
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
      className={`fixed top-0 left-0 w-full z-50 lg:bg-white/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-white" : "bg-white"
      } mb-20 sm:mb-12 md:mb-16`}
      style={{ marginBottom: '2rem' }}
    >
      <div className="flex flex-col lg:flex-row justify-between items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
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
              style={{ top: '-4rem' }}
              onClick={() => navigate(`/`)}
            >
              <img src={tpl} width={100} height={20} className="p-5" alt="otsuka" />
            </div>
            {navigation.map((item) => (
              <Link
                key={item.id}
                to={item.title === "About" ? item.url : `${item.url}`}
                target={item.url.startsWith("https://") ? "_blank" : "_self"}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-black transition-colors hover:text-color-1 lg:flex lg:justify-center lg:items-center ${
                  ""
                } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-sm lg:font-semibold  ${
                  item.url === location.hash
                    ? "z-2 lg:text-black"
                    : "lg:text-black/50"
                } lg:leading-5 lg:hover:text-black `}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Moved logo to the right for larger screens */}
          <div className="hidden lg:flex lg:order-last lg:pr-10 lg:items-center">
            <img
              src={tpl}
              width={100}
              height={20}
              alt="otsuka"
              className="cursor-pointer p-5"
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
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
