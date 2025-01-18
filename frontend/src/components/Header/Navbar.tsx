import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import fourLogo from "../../Assets/fourlogo.png";
import { NavLink, useNavigate } from "react-router-dom";
import {
  addToFavourites,
  getUser,
  logout,
  updateProfile,
} from "@/store/thunks/userThunks";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { HiShoppingCart } from "react-icons/hi2";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { serverUrl } from "@/serverUrl";
import { menuItem, userInfo } from "@/types/types";

import { addToCart, clearError, clearMessage } from "@/store/slices/userSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CgProfile } from "react-icons/cg";
import { toast } from "react-toastify";
import { IoIosRemoveCircle } from "react-icons/io";
import { FaHeartBroken } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const {
    user: userDetails,
    loading,
    message,
    error,
  } = useAppSelector((state) => state.users);
  const user = userDetails as userInfo;
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleSignIn = () => {
    navigate("/login");

    setOpen(false);
  };
  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error, message]);

  const handleAddToCart = (newItem: menuItem) => {
    dispatch(addToCart(newItem));
    toast.success(`${newItem.name} Added To Cart`);
  };

  const updateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(updateProfile(userInfo));
  };

  const handleFavouritesRemove = async (id: string) => {
    try {
      await dispatch(addToFavourites(id)).unwrap();
      dispatch(getUser());
    } catch (error) {
      toast.error("Failed To Add To Favourites");
      console.log(error);
    }
  };

  return (
    <header className="fixed z-50 w-full text-gray-600 bg-white body-font ">
      <div className="container flex items-center justify-between p-4 mx-auto">
        <img className="w-20 md:w-auto" src={fourLogo} alt="" />
        <nav className="hidden text-base md:ml-auto md:block md:mr-auto">
          <NavLink to={"/"} className="mr-5 font-bold hover:text-gray-900">
            Home
          </NavLink>
          <a className="mr-5 font-bold hover:text-gray-900">
            {" "}
            <Dialog>
              <DialogTrigger asChild>
                <button>Favourites</button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Favourites</DialogTitle>
                  <DialogDescription>Your Favourites Items</DialogDescription>
                </DialogHeader>
                {!user && (
                  <div className="flex flex-col items-center justify-center">
                    <FaHeartBroken className="text-8xl text-primary" />
                    <h1 className="text-2xl font-extrabold text-slate-700">
                      Login To View Favourites List
                    </h1>
                  </div>
                )}

                {user?.favourites?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center">
                    <FaHeartBroken className="text-8xl text-primary" />
                    <h1 className="text-2xl font-extrabold text-slate-700">
                      No Items In Your Favourite List
                    </h1>
                  </div>
                ) : (
                  <div className="grid gap-4 py-4">
                    {user?.favourites?.map((item, index) => (
                      <div
                        className="flex items-center justify-between w-full gap-1"
                        key={index}
                      >
                        <div className="w-[10%]">
                          <LazyLoadImage
                            className="rounded-full"
                            src={`${serverUrl}/${item.image}`}
                          />
                        </div>
                        <div className="w-[70%]">
                          <h1>{item.name}</h1>
                        </div>
                        <div className="w-[20%] gap-2 flex">
                          <button onClick={() => handleAddToCart(item)}>
                            <HiShoppingCart className="text-2xl text-green-500" />
                          </button>
                          <button
                            onClick={() => {
                              if (item._id) {
                                handleFavouritesRemove(item._id);
                              } else {
                                toast.error(
                                  "Unexpected Error try again in a while."
                                );
                              }
                            }}
                          >
                            <IoIosRemoveCircle className="text-2xl text-primary" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <DialogFooter></DialogFooter>
              </DialogContent>
            </Dialog>
          </a>
          <a className="mr-5 font-bold hover:text-gray-900">Branch Locator</a>
        </nav>
        <nav
          className={`absolute h-screen z-50 left-0 top-16 transform transition-all duration-300 ${
            open
              ? "translate-y-0 opacity-100 visible"
              : "-translate-y-4 opacity-0 invisible"
          } bg-slate-50 md:hidden p-4 gap-2 flex flex-col w-full`}
        >
          <NavLink
            onClick={() => setOpen(false)}
            to="/"
            className="p-2 text-black bg-gray-100 rounded hover:text-gray-900"
          >
            Home
          </NavLink>
          {user?.role === "admin" && (
            <NavLink
              onClick={() => setOpen(false)}
              to="/dashboard"
              className="p-2 text-black bg-gray-100 rounded hover:text-gray-900"
            >
              Dashboard
            </NavLink>
          )}
          <NavLink
            onClick={() => setOpen(false)}
            to=""
            className="p-2 text-black bg-gray-100 rounded hover:text-gray-900"
          >
            Branch Locator
          </NavLink>

          {isAuthenticated ? (
            <>
              {" "}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full h-10 text-base font-bold text-black transition-all duration-150 border-0 rounded outline-none bg-primary md:flex group"
              >
                Logout
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
              </button>
            </>
          ) : (
            <button
              onClick={handleSignIn}
              className="flex items-center justify-center w-full h-10 text-base font-bold text-white transition-all duration-150 border-0 rounded outline-none hover:text-black hover:bg-slate-200 bg-primary md:flex group"
            >
              Sign In
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
            </button>
          )}
        </nav>

        <div className="relative flex items-center justify-center gap-2">
          {user?.role === "admin" && (
            <NavLink className="hidden font-semibold md:flex" to={"/dashboard"}>
              Dashboard
            </NavLink>
          )}
          {isAuthenticated && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="p-1 rounded-full bg-primary">
                  <CgProfile className="text-3xl text-white" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={updateUser}>
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-4">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={userInfo.name}
                        onChange={handleInputChange}
                        placeholder="Enter Name"
                        className="p-2 transition-all duration-200 border-2 rounded outline-none border-slate-200 focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={userInfo.email}
                        onChange={handleInputChange}
                        placeholder="Enter Email"
                        className="p-2 transition-all duration-200 border-2 rounded outline-none border-slate-200 focus:border-primary"
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <label htmlFor="phone">
                        Phone<span className="text-primary">*</span>
                      </label>
                      <input
                        type="number"
                        name="phone"
                        value={userInfo.phone}
                        placeholder="Enter Phone Number"
                        onChange={handleInputChange}
                        className="p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all duration-200 border-2 rounded outline-none border-slate-200 focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <label htmlFor="address">
                        Address<span className="text-primary">*</span>{" "}
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={userInfo.address}
                        placeholder="Enter Address"
                        onChange={handleInputChange}
                        className="p-2 transition-all duration-200 border-2 rounded outline-none border-slate-200 focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end w-full">
                    <button
                      type="submit"
                      className="w-full h-12 hover:bg-[#c03737] hover:border-[#c03737] p-2 mt-5 font-bold text-white transition-all duration-200 border-2 rounded border-primary bg-primary"
                    >
                      {loading ? (
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            className="inline w-6 h-6 text-white animate-spin dark:text-gray-600 fill-primary"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
                <DialogFooter></DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="items-center justify-center hidden w-20 h-10 text-base font-bold text-white transition-all duration-150 border-0 rounded outline-none hover:bg-slate-100 hover:text-black bg-primary md:flex group"
            >
              Logout
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
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="items-center justify-center hidden w-20 h-10 text-base font-bold text-white transition-all duration-150 border-0 rounded outline-none hover:text-black hover:bg-slate-200 bg-primary md:flex group"
            >
              Sign In
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
            </button>
          )}
          <BsThreeDotsVertical
            onClick={() => setOpen(!open)}
            className="text-3xl md:hidden"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
