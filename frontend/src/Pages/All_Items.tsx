import Loader from "@/components/loader/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { serverUrl } from "@/serverUrl";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getAllItems } from "@/store/thunks/menuThunks";
import { useEffect, useRef, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { menuItem, menutype, userInfo } from "@/types/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { addToCart } from "@/store/slices/userSlice";
import { LiaHeart, LiaHeartSolid } from "react-icons/lia";
import { addToFavourites, getUser } from "@/store/thunks/userThunks";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const All_Items = () => {
  const dispatch = useAppDispatch();
  const { loading, allItems } = useAppSelector((state) => state.menu);
  const { user } = useAppSelector((state) => state.users);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    category
  );

  const handleAddToCart = (newItem: menuItem) => {
    dispatch(addToCart(newItem));
    toast.success(`${newItem.name} Added To Cart`);
  };
  const newUser = user as userInfo;
  const favouriteIds = newUser?.favourites?.map((fav) => fav._id);

  useEffect(() => {
    const scrollToCategory = () => {
      if (category && categoryRefs.current[category]) {
        categoryRefs.current[category]?.scrollIntoView({ behavior: "smooth" });
        setSelectedCategory(category);
      }
    };

    if (allItems && Object.keys(allItems).length > 0) {
      scrollToCategory();
    }
  }, [allItems, category]);

  useEffect(() => {
    dispatch(getAllItems());
  }, [dispatch]);

  useEffect(() => {
    const navbarHeight = 210;
    const handleScroll = () => {
      const categoryEntries = Object.entries(categoryRefs.current);
      for (const [category, ref] of categoryEntries) {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (
            rect.top >= navbarHeight &&
            rect.top <= window.innerHeight / 2 + navbarHeight
          ) {
            setSelectedCategory(category);
            scrollToCategoryInCarousel(category);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const categorizedItems = allItems as menutype;
  const categories = Object.keys(categorizedItems);

  const handleCategoryClick = (category: string) => {
    const element = categoryRefs.current[category];
    if (element) {
      const navbarHeight = 210;
      const elementTop = element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementTop - navbarHeight,
        behavior: "smooth",
      });
    }
  };

  const scrollToCategoryInCarousel = (category: string) => {
    const index = categories.indexOf(category);
    if (index >= 0 && carouselRef.current) {
      const carouselItems = carouselRef.current.children;
      const targetItem = carouselItems[index] as HTMLElement;
      if (targetItem) {
        targetItem.scrollIntoView({
          behavior: "smooth",
          inline: "center",
        });
      }
    }
  };

  const handleAddToFavourites = async (id: string) => {
    try {
      await dispatch(addToFavourites(id)).unwrap();
      dispatch(getUser());
    } catch (error) {
      toast.error("Failed To Add To Favourites");
      console.log(error);
    }
  };
  useEffect(() => {
    console.log("categoryRefs:", categoryRefs.current);
    console.log("category:", category);
  }, [allItems, category, location.search]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center px-2 pt-[70px] md:pt-[80px]">
          <section className="fixed z-40 flex justify-center w-full bg-white">
            <section className="container flex flex-col items-center p-5 mx-2 my-5 border-2 border-slate-200 rounded-xl bg-slate-100">
              <Carousel className="w-[70%] xl:w-full">
                <CarouselContent ref={carouselRef}>
                  {categories.map((category, index) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/4 xl:basis-1/6 basis-1/2"
                    >
                      <button
                        onClick={() => handleCategoryClick(category)}
                        className={`${
                          selectedCategory === category
                            ? "bg-primary"
                            : "bg-white"
                        } flex items-center justify-center w-full p-2  cursor-pointer group rounded-xl`}
                      >
                        <h1
                          className={`text-2xl capitalize font-bold  ${
                            selectedCategory === category
                              ? "text-black"
                              : "text-slate-700"
                          } group-hover:text-black `}
                        >
                          {category}
                        </h1>
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="text-primary" />
                <CarouselNext className="text-primary" />
              </Carousel>
            </section>
          </section>
          <section className="container flex flex-col gap-5 mt-32">
            {categories.map((category, index) => (
              <section
                ref={(el) =>
                  (categoryRefs.current[category] = el as HTMLDivElement)
                }
                key={index}
                className="container flex flex-col gap-5"
              >
                <h1 className="text-2xl font-bold capitalize text-slate-700">
                  {category}
                </h1>
                <div className="flex flex-wrap justify-center gap-2 md:justify-start md:gap-5">
                  {categorizedItems[category]?.map((item, index) => (
                    <Card
                      className="relative flex flex-col justify-between w-40 border-none shadow-none md:w-60 bg-slate-100"
                      key={index}
                    >
                      <button
                        onClick={() => handleAddToFavourites(item._id!)}
                        className="absolute p-[4px] rounded-full right-2 border-2 border-slate-400 bg-white top-2"
                      >
                        {favouriteIds?.includes(item._id) ? (
                          <LiaHeartSolid className="text-4xl text-primary" />
                        ) : (
                          <LiaHeart className="text-4xl" />
                        )}
                      </button>
                      <CardContent className="flex flex-col h-full p-0">
                        <LazyLoadImage
                          className="h-40 transition-all duration-200 md:h-60 rounded-xl"
                          src={`${serverUrl}/${item.image}`}
                        />
                        <div className="flex flex-col justify-between flex-grow">
                          <div>
                            <h1 className="p-2 font-bold md:text-xl drop-shadow-sm group-hover:text-primary text-slate-700">
                              {item.name}
                            </h1>
                            <p className="p-2 text-sm">{item.description}</p>
                          </div>
                          <h2 className="p-2 text-xl font-bold text-primary">
                            RS:{item.price}
                          </h2>
                        </div>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="p-2 m-2 font-bold transition-all duration-200 bg-white rounded-lg hover:bg-primary hover:text-white"
                        >
                          +Add To Cart
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </section>
        </div>
      )}
    </>
  );
};

export default All_Items;
