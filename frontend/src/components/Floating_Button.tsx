import { serverUrl } from "@/serverUrl";
import { addToCart, decreaseQuantity, setCart } from "@/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { cart, menuItem } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { BiPurchaseTag } from "react-icons/bi";
import { FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { TbShoppingBagX } from "react-icons/tb";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Floating_Button = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.users);
  const itemCount = Array.isArray(cart) ? cart.length : 0;
  const [cartOpen, setCartOpen] = useState(false);

  const cartRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
      setCartOpen(false);
    }
  };
  const handleQuantityIncrement = (newItem: menuItem) => {
    dispatch(addToCart(newItem));
  };
  const handleQuantityDecrement = (newItem: menuItem) => {
    dispatch(decreaseQuantity(newItem));
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      dispatch(setCart(JSON.parse(storedCart) as cart[]));
    }
  }, [dispatch]);

  const handleCheckout = () => {
    if (itemCount !== 0) {
      navigate("/checkout");
      setCartOpen(false);
      console.log("Checkout");
    } else {
      toast.error("Add Some Items First");
    }
  };
  return (
    <>
      {" "}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          className="fixed inset-0 z-40 bg-black bg-opacity-80"
        ></div>
      )}
      <button
        onClick={() => setCartOpen((prevState) => !prevState)}
        className="fixed z-50 flex items-center justify-center text-white transition-all duration-300 rounded-full shadow-lg hover:bg-slate-300 group bottom-4 right-4 w-14 h-14 bg-primary hover:bg-primary-dark"
      >
        <FaShoppingCart
          className="transition-all duration-200 group-hover:text-black"
          size={24}
        />

        <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-semibold text-black border-2 border-white rounded-full bg-amber-400">
          {itemCount}
        </span>
      </button>
      <div
        ref={cartRef}
        className={`box-border gap-2 flex flex-col justify-between ${
          cartOpen
            ? "translate-y-0 opacity-100 z-50"
            : "translate-y-10 opacity-0 -z-50"
        } fixed right-5 transition-all duration-300 ease-in-out w-80 bg-white bottom-20 rounded h-80`}
      >
        <div className="flex flex-col w-full h-full gap-1 p-1">
          {itemCount === 0 ? (
            <div className="flex items-center justify-center w-full h-full">
              <div>
                <div className="flex justify-center w-full">
                  {" "}
                  <TbShoppingBagX className="text-9xl" />
                </div>
                <h1 className="text-2xl font-extrabold text-black">
                  CART IS EMPTY
                </h1>
                <p className="flex justify-center w-full text-sm text-slate-500">
                  Explore Food Hurry Up!
                </p>
                <div className="flex justify-center">
                  <NavLink
                    to={"/allmenuitems"}
                    onClick={() => setCartOpen(false)}
                    className="flex items-center justify-center p-2 font-semibold text-white rounded hover:text-black group bg-primary"
                  >
                    Explore{" "}
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 ml-1 transition-all duration-150 group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </NavLink>
                </div>
              </div>
            </div>
          ) : (
            cart?.map((cart: cart, index: number) => (
              <div
                key={index}
                className="flex items-center w-full p-1 rounded bg-slate-200 "
              >
                <div className="w-[20%]">
                  <LazyLoadImage
                    src={`${serverUrl}/${cart.item.image}`}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="flex w-[80%] flex-col items-start text-black">
                  <h1 className="font-semibold">{cart.item.name}</h1>

                  <p className="flex w-full gap-2 text-sm">
                    Quantity:
                    <button
                      onClick={() => handleQuantityDecrement(cart.item)}
                      className="flex items-center justify-center h-6 p-1 rounded w-7 bg-primary"
                    >
                      {cart.quantity === 1 ? (
                        <MdDeleteForever className="text-white" size={15} />
                      ) : (
                        <FaMinus className="text-white" />
                      )}
                    </button>{" "}
                    <span className="w-2 font-bold">{cart.quantity}</span>{" "}
                    <button
                      onClick={() => handleQuantityIncrement(cart.item)}
                      className="p-1 rounded bg-primary"
                    >
                      <FaPlus className="text-white" />
                    </button>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {itemCount !== 0 && (
          <div className="w-full p-1">
            <button
              onClick={handleCheckout}
              className="flex items-center justify-center w-full p-2 font-semibold text-white rounded hover:bg-slate-300 group hover:text-black bg-primary"
            >
              Checkout
              <BiPurchaseTag className="w-5 h-5 ml-1 transition-all duration-150 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Floating_Button;
