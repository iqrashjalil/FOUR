import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getAllItems } from "@/store/thunks/menuThunks";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { serverUrl } from "@/serverUrl";
import burger from "../Assets/burger.webp";
import desserts from "../Assets/desserts.webp";
import drinks from "../Assets/drinks.png";
import fries from "../Assets/fries.png";
import wings from "../Assets/wings.png";
import shakes from "../Assets/shakes.png";
import softDrinks from "../Assets/softdrinks.png";
import pizza from "../Assets/pizza.png";
import fourLogo from "../Assets/fournew.png";
import classicNewyork from "../Assets/classicnewyork.jpg";
import delivery from "../Assets/delivery.png";
import firstPoster from "../Assets/firstposter.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import { menutype } from "@/types/types";
const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { allItems } = useAppSelector((state) => state.menu);
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  const categorizedItems = allItems as menutype;
  useEffect(() => {
    dispatch(getAllItems());
  }, [dispatch]);

  const posters = [
    {
      description: "Fast Delivery",
      photo: `${delivery}`,
    },
    {
      description: "Eat With Vibe",
      photo: `${firstPoster}`,
    },
    {
      description: "Classic New York Burger",
      photo: `${classicNewyork}`,
    },
  ];
  const menu = [
    {
      name: "burger",
      photo: `${burger}`,
    },
    {
      name: "pizza",
      photo: `${pizza}`,
    },
    {
      name: "shakes",
      photo: `${shakes}`,
    },
    {
      name: "drinks",
      photo: `${drinks}`,
    },
    {
      name: "desserts",
      photo: `${desserts}`,
    },

    {
      name: "fries",
      photo: `${fries}`,
    },

    {
      name: "soft drinks",
      photo: `${softDrinks}`,
    },
    {
      name: "wings",
      photo: `${wings}`,
    },
  ];
  const handleMenuClick = (category: string) => {
    navigate(`/allmenuitems?category=${category}`);
  };
  return (
    <div className="flex flex-col items-center p-2 pt-24">
      <section className="container flex flex-col items-center">
        <header className="flex justify-between w-full mb-4">
          <h1 className="text-2xl font-bold text-slate-700">Hot Items</h1>
          <NavLink
            to="/allmenuitems"
            className="font-bold cursor-pointer text-primary"
          >
            View All
          </NavLink>
        </header>
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
          }}
          className="w-[70%] xl:w-full"
        >
          <CarouselContent className="gap-4">
            {categorizedItems.burger?.map((item, index) => (
              <CarouselItem key={index} className="md:basis-1/4 xl:basis-1/6">
                <div className="p-2">
                  <Card className="border-primary">
                    <CardContent className="flex items-center justify-center p-6 aspect-square">
                      <LazyLoadImage
                        src={`${serverUrl}/${item.image}`}
                        // effect="blur"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-primary" />
          <CarouselNext className="text-primary" />
        </Carousel>
      </section>
      <section className="container flex flex-col items-center mt-20">
        <header className="flex justify-between w-full mb-4">
          <h1 className="text-2xl font-bold text-slate-700">Menu</h1>{" "}
          <NavLink
            to="/allmenuitems"
            className="font-bold cursor-pointer text-primary"
          >
            View All
          </NavLink>
        </header>

        <div className="flex flex-wrap justify-center gap-5 md:gap-24">
          {menu.map((menuItem, index) => (
            <Card
              onClick={() => handleMenuClick(menuItem.name)}
              className="w-32 cursor-pointer border-primary group md:w-60 "
              key={index}
            >
              <CardContent className="flex flex-col items-center justify-center p-0 px-5 pt-5 aspect-square">
                <LazyLoadImage
                  className="h-32 drop-shadow-xl group-hover:scale-110 transition-all duration-200 md:h-[160px]"
                  src={menuItem.photo}
                />
                <h1 className="mt-auto text-lg font-bold drop-shadow-sm group-hover:text-primary text-slate-700">
                  {menuItem.name}
                </h1>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="container flex flex-wrap justify-center gap-20 mt-20">
        {posters.map((poster, index) => (
          <Card
            className="border-none shadow-none cursor-pointer group md:w-60"
            key={index}
          >
            <CardContent className="flex flex-col items-center justify-center p-0 aspect-square">
              <LazyLoadImage
                className="transition-all duration-200 rounded-2xl  h-[20rem] drop-shadow-xl group-hover:scale-110"
                src={poster.photo}
              />
              <h1 className="mt-10 text-xl font-bold drop-shadow-sm group-hover:text-primary text-slate-700">
                {poster.description}
              </h1>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="relative flex justify-center w-full p-5 mt-20 md:justify-between lg:pl-60 ">
        <div
          className="absolute w-10 h-10 transition-all duration-200 lg:block md:hidden top-16 lg:left-0 md:w-40 md:h-40 right-20 bg-primary hover:bg-amber-400"
          style={{
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
        ></div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold text-primary">
            Special Offers And News
          </h1>
          <p className="text-gray-400">
            Subscribe now for news, promotions and more delivered right to your
            inbox
          </p>
          <input
            type="text"
            className="p-2 border-2 border-gray-200 rounded outline-none focus:border-primary"
            placeholder="Enter Email Address"
          />
          <div className="flex justify-end">
            <button className="w-40 p-2 mt-5 font-bold text-white transition-all duration-150 border-none rounded hover:font-extrabold bg-primary">
              Subscribe
            </button>
          </div>
        </div>

        <div className="justify-center hidden w-8/12 rounded-tl-full rounded-bl-full md:flex bg-primary">
          <LazyLoadImage className="w-[50%]" src={fourLogo} />
        </div>
      </section>
    </div>
  );
};

export default Home;
