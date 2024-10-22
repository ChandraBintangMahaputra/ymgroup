import { Link, useLocation, useNavigate } from "react-router-dom";
import { scaleWhite } from "../../assets"; // Only use the purple logo
import { navigation } from "../../constants";
import Button from "../ui/Button";
import MenuSvg from "../../assets/svg/MenuSvg";
import { HamburgerMenu } from "../ui/Header";
import { useState, useEffect, useRef } from "react";

const SecondHeader = () => {
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
    } else {
      setOpenNavigation(true);
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    setOpenNavigation(false);
  };

  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-black text-white mb-10">
      <div className="flex flex-col lg:flex-row justify-between items-center px-5 py-5 lg:px-7.5 xl:px-10 lg:py-0 xl:py-0">
        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-0 left-0 right-0 bottom-0 bg-black lg:static lg:flex lg:mx-auto lg:justify-center lg:items-center lg:w-full`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            <div
              className={`${
                openNavigation ? "flex" : "hidden"
              } lg:hidden flex flex-col items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-9999`}
              onClick={() => navigate(`/`)}
            >
              <img
                src={scaleWhite} // Purple logo always
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
                    isActive
                    ? "text-purple-500 font-bold"  // Warna ungu untuk item aktif
                    : "text-white hover:text-purple-500" 
                  } px-6 py-6 md:py-8 lg:text-sm lg:font-semibold lg:leading-5`}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex lg:order-last lg:pr-10 lg:items-center">
            <img
              src={scaleWhite} // Purple logo always
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
          <MenuSvg openNavigation={openNavigation} fillColor="white" />
        </Button>
      </div>
    </div>
  );
};

export default SecondHeader;
